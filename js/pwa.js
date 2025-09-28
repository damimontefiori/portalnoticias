// PWA Manager para Portal de Noticias Argentina
class PWAManager {
  constructor() {
    this.registration = null;
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.isOnline = navigator.onLine;
    
    this.init();
  }

  // Inicializar PWA Manager
  async init() {
    if ('serviceWorker' in navigator) {
      await this.registerServiceWorker();
      this.setupInstallPrompt();
      this.setupOnlineOfflineHandlers();
      this.setupUpdateHandlers();
      this.checkIfInstalled();
      
      console.log('PWA Manager inicializado');
    } else {
      console.warn('Service Workers no soportados en este navegador');
    }
  }

  // Registrar Service Worker
  async registerServiceWorker() {
    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('Service Worker registrado exitosamente:', this.registration.scope);

      // Manejar actualizaciones
      this.registration.addEventListener('updatefound', () => {
        this.handleServiceWorkerUpdate();
      });

      // Verificar si hay una actualización esperando
      if (this.registration.waiting) {
        this.showUpdateAvailable();
      }

    } catch (error) {
      console.error('Error registrando Service Worker:', error);
    }
  }

  // Configurar prompt de instalación
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevenir que Chrome muestre el prompt automáticamente
      e.preventDefault();
      this.deferredPrompt = e;
      
      // Mostrar nuestro banner de instalación personalizado
      this.showInstallBanner();
    });

    // Detectar cuando la app fue instalada
    window.addEventListener('appinstalled', () => {
      console.log('PWA instalada exitosamente');
      this.isInstalled = true;
      this.hideInstallBanner();
      this.deferredPrompt = null;
      
      // Analytics o tracking de instalación
      this.trackInstallation();
    });
  }

  // Mostrar banner de instalación
  showInstallBanner() {
    const banner = document.getElementById('pwa-banner');
    const installBtn = document.getElementById('pwa-install');
    const dismissBtn = document.getElementById('pwa-dismiss');

    if (!banner) return;

    banner.classList.remove('hidden');

    // Handler para instalación
    if (installBtn) {
      installBtn.onclick = () => this.installApp();
    }

    // Handler para descartar
    if (dismissBtn) {
      dismissBtn.onclick = () => this.dismissInstallBanner();
    }

    // Auto-hide después de 30 segundos
    setTimeout(() => {
      if (!banner.classList.contains('hidden')) {
        this.dismissInstallBanner();
      }
    }, 30000);
  }

  // Ocultar banner de instalación
  hideInstallBanner() {
    const banner = document.getElementById('pwa-banner');
    if (banner) {
      banner.classList.add('hidden');
    }
  }

  // Descartar banner de instalación
  dismissInstallBanner() {
    this.hideInstallBanner();
    
    // Guardar que el usuario descartó el banner
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  }

  // Instalar la aplicación
  async installApp() {
    if (!this.deferredPrompt) {
      console.log('No hay prompt de instalación disponible');
      return;
    }

    // Mostrar el prompt de instalación
    this.deferredPrompt.prompt();

    // Esperar la respuesta del usuario
    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('Usuario aceptó la instalación');
      this.trackInstallation('accepted');
    } else {
      console.log('Usuario rechazó la instalación');
      this.trackInstallation('dismissed');
    }

    // Limpiar el prompt
    this.deferredPrompt = null;
    this.hideInstallBanner();
  }

  // Verificar si la app está instalada
  checkIfInstalled() {
    // Método 1: Detectar display mode
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
      return;
    }

    // Método 2: Detectar navegador standalone en iOS
    if (window.navigator.standalone === true) {
      this.isInstalled = true;
      return;
    }

    // Método 3: Verificar user agent
    if (document.referrer.includes('android-app://')) {
      this.isInstalled = true;
      return;
    }

    this.isInstalled = false;
  }

  // Configurar handlers de online/offline
  setupOnlineOfflineHandlers() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.handleOnlineStatus();
      console.log('Aplicación online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.handleOfflineStatus();
      console.log('Aplicación offline');
    });
  }

  // Manejar estado online
  handleOnlineStatus() {
    // Remover indicador offline
    document.body.classList.remove('offline');
    
    // Notificar a la aplicación
    if (window.newsApp) {
      window.newsApp.showNotification('Conexión restaurada', 'success');
      // Refrescar datos automáticamente
      setTimeout(() => {
        window.newsApp.refreshAll();
      }, 1000);
    }

    // Registrar background sync para actualizar datos
    if (this.registration && 'sync' in window.ServiceWorkerRegistration.prototype) {
      this.registration.sync.register('background-sync');
    }
  }

  // Manejar estado offline
  handleOfflineStatus() {
    // Agregar indicador offline
    document.body.classList.add('offline');
    
    // Notificar a la aplicación
    if (window.newsApp) {
      window.newsApp.showNotification('Sin conexión - Usando datos guardados', 'info');
    }
  }

  // Configurar handlers de actualizaciones
  setupUpdateHandlers() {
    // Escuchar mensajes del Service Worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        const { type, version } = event.data;
        
        if (type === 'UPDATE_AVAILABLE') {
          this.showUpdateAvailable(version);
        }
      });
    }
  }

  // Manejar actualización del Service Worker
  handleServiceWorkerUpdate() {
    const newWorker = this.registration.installing;
    
    newWorker.addEventListener('statechange', () => {
      if (newWorker.state === 'installed') {
        if (navigator.serviceWorker.controller) {
          // Nueva versión disponible
          this.showUpdateAvailable();
        }
      }
    });
  }

  // Mostrar notificación de actualización disponible
  showUpdateAvailable(version) {
    const updateNotification = this.createUpdateNotification(version);
    document.body.appendChild(updateNotification);
    
    // Auto-mostrar
    setTimeout(() => updateNotification.classList.add('show'), 100);
  }

  // Crear notificación de actualización
  createUpdateNotification(version) {
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <div class="update-info">
          <i class="fas fa-download"></i>
          <div class="update-text">
            <strong>Nueva versión disponible</strong>
            <small>Actualizar para obtener las últimas mejoras</small>
          </div>
        </div>
        <div class="update-actions">
          <button class="update-btn" onclick="this.parentElement.parentElement.parentElement.pwaManager.applyUpdate()">
            Actualizar
          </button>
          <button class="update-dismiss" onclick="this.parentElement.parentElement.parentElement.remove()">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    `;

    // Agregar referencia al PWAManager
    notification.pwaManager = this;
    
    return notification;
  }

  // Aplicar actualización
  async applyUpdate() {
    if (!this.registration || !this.registration.waiting) {
      window.location.reload();
      return;
    }

    // Enviar mensaje al Service Worker para que se active
    this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    
    // Recargar la página cuando el nuevo SW tome control
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload();
    });
  }

  // Obtener información de cache
  async getCacheInfo() {
    if (!('caches' in window)) return null;

    try {
      const cacheNames = await caches.keys();
      const cacheInfo = {};
      
      for (const name of cacheNames) {
        const cache = await caches.open(name);
        const keys = await cache.keys();
        cacheInfo[name] = {
          entries: keys.length,
          urls: keys.map(request => request.url)
        };
      }
      
      return cacheInfo;
    } catch (error) {
      console.error('Error obteniendo info de cache:', error);
      return null;
    }
  }

  // Limpiar cache manualmente
  async clearCache() {
    if (!('caches' in window)) return false;

    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(name => caches.delete(name))
      );
      
      console.log('Cache limpiado exitosamente');
      return true;
    } catch (error) {
      console.error('Error limpiando cache:', error);
      return false;
    }
  }

  // Tracking de instalación
  trackInstallation(outcome = 'completed') {
    // Aquí se puede integrar con Google Analytics, Firebase, etc.
    console.log('PWA Installation tracked:', outcome);
    
    // Ejemplo con localStorage para tracking local
    const installData = {
      timestamp: Date.now(),
      outcome: outcome,
      userAgent: navigator.userAgent,
      platform: navigator.platform
    };
    
    localStorage.setItem('pwa-install-data', JSON.stringify(installData));
  }

  // Obtener estadísticas de la PWA
  getPWAStats() {
    return {
      isInstalled: this.isInstalled,
      isOnline: this.isOnline,
      hasServiceWorker: !!this.registration,
      canInstall: !!this.deferredPrompt,
      installData: JSON.parse(localStorage.getItem('pwa-install-data') || '{}')
    };
  }

  // Forzar verificación de actualizaciones
  async checkForUpdates() {
    if (!this.registration) return false;

    try {
      const registration = await this.registration.update();
      console.log('Verificación de actualización completada');
      return true;
    } catch (error) {
      console.error('Error verificando actualizaciones:', error);
      return false;
    }
  }
}

// Agregar estilos para notificaciones de PWA
const pwaStyles = document.createElement('style');
pwaStyles.textContent = `
  /* Offline indicator */
  .offline::before {
    content: "Sin conexión";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #dc3545;
    color: white;
    text-align: center;
    padding: 4px;
    font-size: 12px;
    z-index: 9999;
  }
  
  .offline .header {
    margin-top: 24px;
  }

  /* Update notification */
  .update-notification {
    position: fixed;
    top: 20px;
    right: 20px;
    background: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 2000;
    min-width: 320px;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }
  
  .update-notification.show {
    transform: translateX(0);
  }
  
  .update-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    gap: 16px;
  }
  
  .update-info {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }
  
  .update-info i {
    color: #0066cc;
    font-size: 20px;
  }
  
  .update-text strong {
    display: block;
    margin-bottom: 2px;
    font-weight: 600;
  }
  
  .update-text small {
    color: #666;
    font-size: 12px;
  }
  
  .update-actions {
    display: flex;
    gap: 8px;
  }
  
  .update-btn {
    background: #0066cc;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    cursor: pointer;
    font-size: 14px;
  }
  
  .update-btn:hover {
    background: #0052a3;
  }
  
  .update-dismiss {
    background: none;
    border: none;
    color: #666;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
  }
  
  .update-dismiss:hover {
    background: #f0f0f0;
  }
  
  @media (max-width: 480px) {
    .update-notification {
      top: 10px;
      right: 10px;
      left: 10px;
      min-width: auto;
    }
    
    .update-content {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
    
    .update-actions {
      justify-content: center;
    }
  }
`;

document.head.appendChild(pwaStyles);

// Inicializar PWA Manager cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.pwaManager = new PWAManager();
});