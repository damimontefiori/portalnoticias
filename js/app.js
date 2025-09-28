// Aplicación principal del Portal de Noticias Argentina
class NewsApp {
  constructor() {
    this.currentCategory = 'all';
    this.expandedCards = new Set();
    this.isInitialized = false;
    
    // Referencias a elementos del DOM
    this.elements = {};
    
    // Configuración
    this.config = {
      dollarUpdateInterval: 5 * 60 * 1000, // 5 minutos
      newsRefreshInterval: 30 * 60 * 1000, // 30 minutos
      animationDuration: 300
    };
    
    // Estado de la aplicación
    this.state = {
      isLoading: false,
      lastDollarUpdate: null,
      lastNewsUpdate: null
    };
  }

  // Inicializar la aplicación
  async init() {
    if (this.isInitialized) return;
    
    try {
      this.initializeElements();
      this.setupEventListeners();
      await this.loadInitialData();
      this.startPeriodicUpdates();
      this.isInitialized = true;
      
      console.log('Portal de Noticias Argentina inicializado correctamente');
    } catch (error) {
      console.error('Error al inicializar la aplicación:', error);
      this.showError('Error al cargar la aplicación');
    }
  }

  // Inicializar referencias a elementos del DOM
  initializeElements() {
    this.elements = {
      // Header
      refreshBtn: document.getElementById('refresh-btn'),
      menuBtn: document.getElementById('menu-btn'),
      
      // Dollar ticker
      dollarRates: document.getElementById('dollar-rates'),
      lastUpdate: document.getElementById('last-update'),
      
      // Navigation
      categoryTabs: document.querySelectorAll('.tab-btn'),
      
      // News grid
      newsGrid: document.getElementById('news-grid'),
      
      // Modal
      modal: document.getElementById('news-modal'),
      modalBody: document.getElementById('modal-body'),
      modalClose: document.getElementById('modal-close')
    };
  }

  // Configurar event listeners
  setupEventListeners() {
    // Refresh button
    if (this.elements.refreshBtn) {
      this.elements.refreshBtn.addEventListener('click', () => this.refreshAll());
    }

    // Category tabs
    this.elements.categoryTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const category = e.currentTarget.dataset.category;
        this.switchCategory(category);
      });
    });

    // Modal close
    if (this.elements.modalClose) {
      this.elements.modalClose.addEventListener('click', () => this.closeModal());
    }
    
    if (this.elements.modal) {
      this.elements.modal.addEventListener('click', (e) => {
        if (e.target === this.elements.modal) {
          this.closeModal();
        }
      });
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.elements.modal.classList.contains('active')) {
        this.closeModal();
      }
    });

    // Detect PWA installation
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.handlePWAInstallPrompt(e);
    });
  }

  // Cargar datos iniciales
  async loadInitialData() {
    this.showLoading(true);
    
    try {
      // Cargar cotizaciones del dólar y noticias en paralelo
      await Promise.all([
        this.updateDollarRates(),
        this.loadNews()
      ]);
      
      this.state.lastNewsUpdate = new Date();
    } catch (error) {
      console.error('Error cargando datos iniciales:', error);
    } finally {
      this.showLoading(false);
    }
  }

  // Actualizar cotizaciones del dólar
  async updateDollarRates() {
    try {
      const rates = await dollarService.getDollarRates();
      this.renderDollarRates(rates);
      this.state.lastDollarUpdate = new Date();
    } catch (error) {
      console.error('Error actualizando cotizaciones:', error);
      // Mostrar datos de fallback
      const fallbackRates = dollarService.getFallbackData();
      this.renderDollarRates(fallbackRates);
    }
  }

  // Renderizar cotizaciones del dólar
  renderDollarRates(rates) {
    if (!this.elements.dollarRates) return;

    const rateItems = this.elements.dollarRates.querySelectorAll('.rate-item');
    const rateTypes = ['oficial', 'blue', 'mep', 'ccl'];

    rateItems.forEach((item, index) => {
      const rateType = rateTypes[index];
      const rate = rates[rateType];
      
      if (rate) {
        const valueElement = item.querySelector('.rate-value');
        const nameElement = item.querySelector('.rate-name');
        
        // Remover loading state
        item.classList.remove('loading');
        
        // Actualizar valor
        valueElement.textContent = `$${rate.venta.toFixed(0)}`;
        
        // Agregar indicador de variación
        item.classList.remove('up', 'down');
        if (rate.variacion > 0) {
          item.classList.add('up');
        } else if (rate.variacion < 0) {
          item.classList.add('down');
        }
        
        // Tooltip con información adicional
        item.title = `Compra: $${rate.compra} | Venta: $${rate.venta}`;
      }
    });

    // Actualizar timestamp
    if (this.elements.lastUpdate) {
      const updateTime = new Date(rates.lastUpdate);
      this.elements.lastUpdate.textContent = `Actualizado: ${updateTime.toLocaleTimeString('es-AR')}`;
    }
  }

  // Cargar y mostrar noticias
  async loadNews() {
    try {
      const news = window.newsData.getNewsByCategory(this.currentCategory);
      this.renderNews(news);
    } catch (error) {
      console.error('Error cargando noticias:', error);
      this.showError('Error al cargar las noticias');
    }
  }

  // Renderizar noticias
  renderNews(news) {
    if (!this.elements.newsGrid) return;

    // Limpiar skeleton loading
    const skeleton = this.elements.newsGrid.querySelector('.loading-skeleton');
    if (skeleton) {
      skeleton.remove();
    }

    // Generar HTML de las noticias
    const newsHTML = news.map(article => this.createNewsCardHTML(article)).join('');
    this.elements.newsGrid.innerHTML = newsHTML;

    // Agregar event listeners a las tarjetas
    this.setupNewsCardListeners();
  }

  // Crear HTML de tarjeta de noticia
  createNewsCardHTML(article) {
    const isExpanded = this.expandedCards.has(article.id);
    const expandedClass = isExpanded ? 'expanded' : '';
    
    return `
      <article class="news-card ${expandedClass}" data-id="${article.id}">
        <div class="card-header">
          <span class="card-category ${article.category}">${article.categoryInfo.name}</span>
          <h2 class="card-title">${article.title}</h2>
          <p class="card-summary">${article.summary}</p>
          <div class="card-meta">
            <span class="card-date">
              <i class="fas fa-clock"></i>
              ${this.formatDate(article.date)} • ${article.readTime}
            </span>
            <button class="card-read-more" data-action="expand">
              <span>${isExpanded ? 'Leer menos' : 'Leer más'}</span>
              <i class="fas fa-chevron-${isExpanded ? 'up' : 'down'}"></i>
            </button>
          </div>
        </div>
        <div class="card-content ${isExpanded ? 'expanded' : ''}">
          <div class="card-full-content">
            ${article.content}
          </div>
        </div>
      </article>
    `;
  }

  // Configurar event listeners para tarjetas de noticias
  setupNewsCardListeners() {
    const newsCards = this.elements.newsGrid.querySelectorAll('.news-card');
    
    newsCards.forEach(card => {
      const expandBtn = card.querySelector('.card-read-more');
      const cardHeader = card.querySelector('.card-header');
      
      // Expandir/contraer con click en botón o header
      [expandBtn, cardHeader].forEach(element => {
        if (element) {
          element.addEventListener('click', (e) => {
            e.preventDefault();
            const articleId = card.dataset.id;
            this.toggleNewsCard(articleId);
          });
        }
      });
    });
  }

  // Alternar expansión de tarjeta de noticia
  toggleNewsCard(articleId) {
    const card = this.elements.newsGrid.querySelector(`[data-id="${articleId}"]`);
    if (!card) return;

    const isExpanded = this.expandedCards.has(articleId);
    const content = card.querySelector('.card-content');
    const expandBtn = card.querySelector('.card-read-more');
    const expandIcon = expandBtn.querySelector('i');
    const expandText = expandBtn.querySelector('span');

    if (isExpanded) {
      // Contraer
      this.expandedCards.delete(articleId);
      card.classList.remove('expanded');
      content.classList.remove('expanded');
      expandIcon.className = 'fas fa-chevron-down';
      expandText.textContent = 'Leer más';
    } else {
      // Expandir
      this.expandedCards.add(articleId);
      card.classList.add('expanded');
      content.classList.add('expanded');
      expandIcon.className = 'fas fa-chevron-up';
      expandText.textContent = 'Leer menos';
      
      // Scroll suave hacia la tarjeta expandida
      setTimeout(() => {
        card.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start',
          inline: 'nearest'
        });
      }, this.config.animationDuration);
    }
  }

  // Cambiar categoría de noticias
  async switchCategory(category) {
    if (category === this.currentCategory) return;

    // Actualizar estado visual de los tabs
    this.elements.categoryTabs.forEach(tab => {
      tab.classList.remove('active');
      if (tab.dataset.category === category) {
        tab.classList.add('active');
      }
    });

    // Actualizar categoría actual
    this.currentCategory = category;

    // Cargar noticias de la nueva categoría
    this.showLoading(true);
    await this.loadNews();
    this.showLoading(false);

    // Reset expanded cards para nueva categoría
    this.expandedCards.clear();
  }

  // Abrir modal de noticia
  openNewsModal(articleId) {
    const article = window.newsData.getNewsById(articleId);
    if (!article || !this.elements.modal) return;

    // Generar contenido del modal
    const modalHTML = `
      <div class="modal-article">
        <span class="card-category ${article.category}">${article.categoryInfo.name}</span>
        <h1 class="modal-title">${article.title}</h1>
        <div class="modal-meta">
          <span class="modal-date">
            <i class="fas fa-clock"></i>
            ${this.formatDate(article.date)} • ${article.readTime}
          </span>
        </div>
        <div class="modal-content-body">
          ${article.content}
        </div>
      </div>
    `;

    this.elements.modalBody.innerHTML = modalHTML;
    this.elements.modal.classList.add('active');
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
  }

  // Cerrar modal
  closeModal() {
    if (!this.elements.modal) return;
    
    this.elements.modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Refrescar todos los datos
  async refreshAll() {
    if (this.state.isLoading) return;

    // Animación del botón de refresh
    this.elements.refreshBtn?.classList.add('spinning');
    
    try {
      await Promise.all([
        this.updateDollarRates(),
        this.loadNews()
      ]);
      
      // Mostrar feedback de éxito
      this.showNotification('Datos actualizados correctamente', 'success');
    } catch (error) {
      console.error('Error al refrescar:', error);
      this.showNotification('Error al actualizar los datos', 'error');
    } finally {
      setTimeout(() => {
        this.elements.refreshBtn?.classList.remove('spinning');
      }, 1000);
    }
  }

  // Mostrar/ocultar loading
  showLoading(show) {
    this.state.isLoading = show;
    
    if (show) {
      // Mostrar skeleton si no hay noticias
      if (!this.elements.newsGrid.hasChildNodes() || 
          this.elements.newsGrid.querySelector('.loading-skeleton')) {
        this.elements.newsGrid.innerHTML = `
          <div class="loading-skeleton">
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
            <div class="skeleton-card"></div>
          </div>
        `;
      }
    }
  }

  // Mostrar notificación
  showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <div class="notification-content">
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
      </div>
    `;

    // Agregar al DOM
    document.body.appendChild(notification);

    // Animación de entrada
    setTimeout(() => notification.classList.add('show'), 100);

    // Remover después de 3 segundos
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // Mostrar error
  showError(message) {
    this.showNotification(message, 'error');
  }

  // Formatear fecha
  formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Hoy';
    } else if (diffDays === 2) {
      return 'Ayer';
    } else if (diffDays <= 7) {
      return `Hace ${diffDays - 1} días`;
    } else {
      return date.toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    }
  }

  // Iniciar actualizaciones periódicas
  startPeriodicUpdates() {
    // Actualizar cotizaciones cada 5 minutos
    setInterval(() => {
      this.updateDollarRates();
    }, this.config.dollarUpdateInterval);

    // Actualizar noticias cada 30 minutos
    setInterval(() => {
      this.loadNews();
    }, this.config.newsRefreshInterval);
  }

  // Manejar instalación de PWA
  handlePWAInstallPrompt(e) {
    const banner = document.getElementById('pwa-banner');
    const installBtn = document.getElementById('pwa-install');
    const dismissBtn = document.getElementById('pwa-dismiss');

    if (banner) {
      banner.classList.remove('hidden');

      if (installBtn) {
        installBtn.addEventListener('click', () => {
          e.prompt();
          e.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
              console.log('PWA instalada');
            }
            banner.classList.add('hidden');
          });
        });
      }

      if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
          banner.classList.add('hidden');
        });
      }
    }
  }

  // Obtener estadísticas de uso
  getAppStats() {
    return {
      category: this.currentCategory,
      expandedCards: Array.from(this.expandedCards),
      lastDollarUpdate: this.state.lastDollarUpdate,
      lastNewsUpdate: this.state.lastNewsUpdate,
      isInitialized: this.isInitialized
    };
  }
}

// Inicializar aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  const app = new NewsApp();
  app.init();
  
  // Hacer app accesible globalmente para debugging
  window.newsApp = app;
});