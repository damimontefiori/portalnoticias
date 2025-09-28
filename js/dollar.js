// Servicio para obtener cotizaciones del dólar argentino
class DollarService {
  constructor() {
    this.apiEndpoints = {
      // API principal (Bluelytics - gratuita y confiable)
      primary: 'https://api.bluelytics.com.ar/v2/latest',
      // API de respaldo (DolarApi)
      backup: 'https://dolarapi.com/v1/dolares',
      // Datos de fallback basados en el documento
      fallback: {
        oficial: { compra: 1320, venta: 1326, fecha: '2025-09-26' },
        blue: { compra: 1435, venta: 1440, fecha: '2025-09-26' },
        mep: { compra: 1418, venta: 1423, fecha: '2025-09-26' },
        ccl: { compra: 1457, venta: 1462, fecha: '2025-09-26' }
      }
    };
    
    this.cache = {
      data: null,
      timestamp: null,
      duration: 5 * 60 * 1000 // 5 minutos de cache
    };
    
    this.isLoading = false;
  }

  // Obtener cotizaciones desde la API principal
  async fetchFromPrimary() {
    try {
      const response = await fetch(this.apiEndpoints.primary);
      if (!response.ok) throw new Error('Primary API failed');
      
      const data = await response.json();
      return this.transformPrimaryData(data);
    } catch (error) {
      console.warn('Primary API (Bluelytics) failed:', error);
      throw error;
    }
  }

  // Obtener cotizaciones desde la API de respaldo
  async fetchFromBackup() {
    try {
      const response = await fetch(this.apiEndpoints.backup);
      if (!response.ok) throw new Error('Backup API failed');
      
      const data = await response.json();
      return this.transformBackupData(data);
    } catch (error) {
      console.warn('Backup API (DolarApi) failed:', error);
      throw error;
    }
  }

  // Transformar datos de la API principal
  transformPrimaryData(data) {
    const now = new Date();
    return {
      oficial: {
        compra: data.oficial?.value_buy || this.apiEndpoints.fallback.oficial.compra,
        venta: data.oficial?.value_sell || this.apiEndpoints.fallback.oficial.venta,
        variacion: this.calculateVariation(data.oficial?.value_sell, this.apiEndpoints.fallback.oficial.venta),
        fecha: now.toISOString()
      },
      blue: {
        compra: data.blue?.value_buy || this.apiEndpoints.fallback.blue.compra,
        venta: data.blue?.value_sell || this.apiEndpoints.fallback.blue.venta,
        variacion: this.calculateVariation(data.blue?.value_sell, this.apiEndpoints.fallback.blue.venta),
        fecha: now.toISOString()
      },
      // MEP y CCL no están en Bluelytics, usar fallback
      mep: {
        compra: this.apiEndpoints.fallback.mep.compra,
        venta: this.apiEndpoints.fallback.mep.venta,
        variacion: 0,
        fecha: now.toISOString()
      },
      ccl: {
        compra: this.apiEndpoints.fallback.ccl.compra,
        venta: this.apiEndpoints.fallback.ccl.venta,
        variacion: 0,
        fecha: now.toISOString()
      },
      lastUpdate: now.toISOString(),
      source: 'bluelytics'
    };
  }

  // Transformar datos de la API de respaldo
  transformBackupData(data) {
    const now = new Date();
    const dollarTypes = {};
    
    if (Array.isArray(data)) {
      data.forEach(item => {
        switch(item.casa) {
          case 'oficial':
            dollarTypes.oficial = {
              compra: item.compra,
              venta: item.venta,
              variacion: this.calculateVariation(item.venta, this.apiEndpoints.fallback.oficial.venta),
              fecha: item.fechaActualizacion
            };
            break;
          case 'blue':
            dollarTypes.blue = {
              compra: item.compra,
              venta: item.venta,
              variacion: this.calculateVariation(item.venta, this.apiEndpoints.fallback.blue.venta),
              fecha: item.fechaActualizacion
            };
            break;
          case 'bolsa':
            dollarTypes.mep = {
              compra: item.compra,
              venta: item.venta,
              variacion: this.calculateVariation(item.venta, this.apiEndpoints.fallback.mep.venta),
              fecha: item.fechaActualizacion
            };
            break;
          case 'contadoconliqui':
            dollarTypes.ccl = {
              compra: item.compra,
              venta: item.venta,
              variacion: this.calculateVariation(item.venta, this.apiEndpoints.fallback.ccl.venta),
              fecha: item.fechaActualizacion
            };
            break;
        }
      });
    }
    
    // Completar con fallback si faltan datos
    const result = {
      oficial: dollarTypes.oficial || { ...this.apiEndpoints.fallback.oficial, variacion: 0, fecha: now.toISOString() },
      blue: dollarTypes.blue || { ...this.apiEndpoints.fallback.blue, variacion: 0, fecha: now.toISOString() },
      mep: dollarTypes.mep || { ...this.apiEndpoints.fallback.mep, variacion: 0, fecha: now.toISOString() },
      ccl: dollarTypes.ccl || { ...this.apiEndpoints.fallback.ccl, variacion: 0, fecha: now.toISOString() },
      lastUpdate: now.toISOString(),
      source: 'dolarapi'
    };
    
    return result;
  }

  // Calcular variación porcentual
  calculateVariation(current, previous) {
    if (!current || !previous) return 0;
    return ((current - previous) / previous * 100);
  }

  // Usar datos de fallback
  getFallbackData() {
    const now = new Date();
    return {
      oficial: { ...this.apiEndpoints.fallback.oficial, variacion: 0, fecha: now.toISOString() },
      blue: { ...this.apiEndpoints.fallback.blue, variacion: 0, fecha: now.toISOString() },
      mep: { ...this.apiEndpoints.fallback.mep, variacion: 0, fecha: now.toISOString() },
      ccl: { ...this.apiEndpoints.fallback.ccl, variacion: 0, fecha: now.toISOString() },
      lastUpdate: now.toISOString(),
      source: 'fallback'
    };
  }

  // Verificar si el cache es válido
  isCacheValid() {
    if (!this.cache.data || !this.cache.timestamp) return false;
    return (Date.now() - this.cache.timestamp) < this.cache.duration;
  }

  // Obtener cotizaciones (método principal)
  async getDollarRates() {
    // Retornar cache si es válido
    if (this.isCacheValid()) {
      return this.cache.data;
    }

    // Evitar múltiples requests simultáneos
    if (this.isLoading) {
      return this.cache.data || this.getFallbackData();
    }

    this.isLoading = true;

    try {
      // Intentar API principal primero
      let data;
      try {
        data = await this.fetchFromPrimary();
      } catch (error) {
        // Si falla, intentar API de respaldo
        try {
          data = await this.fetchFromBackup();
        } catch (backupError) {
          // Si ambas fallan, usar datos de fallback
          console.warn('All APIs failed, using fallback data');
          data = this.getFallbackData();
        }
      }

      // Actualizar cache
      this.cache.data = data;
      this.cache.timestamp = Date.now();

      return data;

    } finally {
      this.isLoading = false;
    }
  }

  // Obtener solo las cotizaciones de venta (más comunes)
  async getSellingRates() {
    const data = await this.getDollarRates();
    return {
      oficial: data.oficial.venta,
      blue: data.blue.venta,
      mep: data.mep.venta,
      ccl: data.ccl.venta,
      lastUpdate: data.lastUpdate,
      source: data.source
    };
  }

  // Obtener información detallada de una cotización específica
  async getSpecificRate(type) {
    const data = await this.getDollarRates();
    return data[type] || null;
  }

  // Forzar actualización de datos
  async forceRefresh() {
    this.cache.data = null;
    this.cache.timestamp = null;
    return await this.getDollarRates();
  }

  // Obtener información sobre las fuentes de datos
  getSourceInfo() {
    return {
      primary: {
        name: 'Bluelytics',
        url: 'https://bluelytics.com.ar',
        description: 'API confiable para cotizaciones del dólar en Argentina',
        covers: ['oficial', 'blue']
      },
      backup: {
        name: 'DolarApi',
        url: 'https://dolarapi.com',
        description: 'API alternativa para cotizaciones del dólar',
        covers: ['oficial', 'blue', 'mep', 'ccl']
      },
      fallback: {
        name: 'Datos estáticos',
        description: 'Datos de respaldo basados en la última información disponible',
        date: '2025-09-26',
        covers: ['oficial', 'blue', 'mep', 'ccl']
      }
    };
  }
}

// Crear instancia global
const dollarService = new DollarService();

// Exportar para uso global
if (typeof window !== 'undefined') {
  window.dollarService = dollarService;
}

// Para Node.js (si se usa en server-side)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DollarService;
}