// Service Worker para Portal de Noticias Argentina
const CACHE_NAME = 'portal-noticias-v1.0.0';
const STATIC_CACHE_NAME = 'portal-static-v1.0.0';
const DYNAMIC_CACHE_NAME = 'portal-dynamic-v1.0.0';

// Archivos estáticos a cachear
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles/main.css',
  '/js/app.js',
  '/js/data.js',
  '/js/dollar.js',
  '/js/pwa.js',
  // Fuentes y librerías externas
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Recursos dinámicos que se pueden cachear
const DYNAMIC_URLS = [
  'https://api.bluelytics.com.ar/v2/latest',
  'https://dolarapi.com/v1/dolares'
];

// Configuración de cache
const CACHE_CONFIG = {
  maxAge: {
    static: 7 * 24 * 60 * 60 * 1000,    // 7 días
    dynamic: 24 * 60 * 60 * 1000,       // 24 horas
    api: 5 * 60 * 1000                  // 5 minutos
  },
  maxEntries: {
    dynamic: 50,
    api: 20
  }
};

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Instalando...');
  
  event.waitUntil(
    Promise.all([
      // Cache estático
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Service Worker: Cacheando archivos estáticos');
        return cache.addAll(STATIC_ASSETS.map(url => new Request(url, { cache: 'reload' })));
      }),
      // Cache dinámico inicial (vacío)
      caches.open(DYNAMIC_CACHE_NAME)
    ])
  );
  
  // Forzar activación inmediata
  self.skipWaiting();
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activando...');
  
  event.waitUntil(
    Promise.all([
      // Limpiar caches antiguos
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME &&
                cacheName.startsWith('portal-')) {
              console.log('Service Worker: Eliminando cache antiguo', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Tomar control de todas las páginas
      self.clients.claim()
    ])
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Solo manejar requests HTTP/HTTPS
  if (!request.url.startsWith('http')) return;
  
  event.respondWith(
    handleRequest(request)
  );
});

// Manejar diferentes tipos de requests
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // 1. Recursos estáticos (HTML, CSS, JS, fuentes)
    if (isStaticAsset(request)) {
      return await handleStaticRequest(request);
    }
    
    // 2. APIs de cotizaciones (con estrategia cache-first para offline)
    if (isApiRequest(request)) {
      return await handleApiRequest(request);
    }
    
    // 3. Imágenes y otros recursos dinámicos
    if (isDynamicAsset(request)) {
      return await handleDynamicRequest(request);
    }
    
    // 4. Fallback para otros requests
    return await handleGenericRequest(request);
    
  } catch (error) {
    console.log('Service Worker: Error manejando request', error);
    return await handleOfflineFallback(request);
  }
}

// Verificar si es un recurso estático
function isStaticAsset(request) {
  const url = new URL(request.url);
  return STATIC_ASSETS.some(asset => 
    url.pathname.includes(asset.replace(self.location.origin, ''))
  ) || 
  url.pathname.match(/\.(css|js|woff2?|ttf|eot|svg|ico)$/);
}

// Verificar si es una API request
function isApiRequest(request) {
  const url = new URL(request.url);
  return url.hostname.includes('bluelytics.com.ar') || 
         url.hostname.includes('dolarapi.com');
}

// Verificar si es un recurso dinámico
function isDynamicAsset(request) {
  const url = new URL(request.url);
  return url.pathname.match(/\.(png|jpg|jpeg|gif|webp)$/);
}

// Manejar recursos estáticos con estrategia Cache First
async function handleStaticRequest(request) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  const cached = await cache.match(request);
  
  if (cached) {
    // Verificar si necesita actualización en background
    if (shouldUpdateCache(cached)) {
      updateCacheInBackground(request, cache);
    }
    return cached;
  }
  
  // Si no está en cache, ir a la red
  const networkResponse = await fetch(request);
  if (networkResponse.status === 200) {
    cache.put(request, networkResponse.clone());
  }
  return networkResponse;
}

// Manejar APIs con estrategia Cache First + Network Fallback
async function handleApiRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cached = await cache.match(request);
  
  try {
    // Intentar red primero para datos frescos
    const networkResponse = await fetch(request, { 
      timeout: 5000 // 5 segundos timeout
    });
    
    if (networkResponse.status === 200) {
      // Cache la respuesta exitosa
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    // Si la red falla pero hay cache, usar cache
    if (cached) {
      return cached;
    }
    
    throw new Error('Network failed and no cache available');
    
  } catch (error) {
    // Si la red falla, usar cache si está disponible
    if (cached) {
      console.log('Service Worker: Usando datos de cache para API offline');
      return cached;
    }
    
    // Si no hay cache, devolver respuesta de fallback
    return new Response(JSON.stringify({
      error: 'offline',
      message: 'Datos no disponibles sin conexión',
      cached: false
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 503
    });
  }
}

// Manejar recursos dinámicos con estrategia Network First
async function handleDynamicRequest(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      cache.put(request, networkResponse.clone());
      await cleanupDynamicCache(cache);
    }
    return networkResponse;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Manejar requests genéricos
async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Fallback offline
async function handleOfflineFallback(request) {
  // Para navegación, devolver la página principal
  if (request.mode === 'navigate') {
    const cache = await caches.open(STATIC_CACHE_NAME);
    return cache.match('/index.html') || cache.match('/');
  }
  
  // Para otros recursos, respuesta genérica offline
  return new Response('Contenido no disponible sin conexión', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Verificar si el cache necesita actualización
function shouldUpdateCache(cachedResponse) {
  if (!cachedResponse.headers.get('date')) return true;
  
  const cacheDate = new Date(cachedResponse.headers.get('date'));
  const now = new Date();
  const age = now.getTime() - cacheDate.getTime();
  
  return age > CACHE_CONFIG.maxAge.static;
}

// Actualizar cache en background
async function updateCacheInBackground(request, cache) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.status === 200) {
      await cache.put(request, networkResponse);
    }
  } catch (error) {
    console.log('Service Worker: Error actualizando cache en background', error);
  }
}

// Limpiar cache dinámico para evitar que crezca demasiado
async function cleanupDynamicCache(cache) {
  const keys = await cache.keys();
  if (keys.length > CACHE_CONFIG.maxEntries.dynamic) {
    // Eliminar las entradas más antiguas
    const keysToDelete = keys.slice(0, keys.length - CACHE_CONFIG.maxEntries.dynamic);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Manejar mensajes desde la aplicación principal
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: CACHE_NAME });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
      
    case 'FORCE_UPDATE':
      forceUpdateCache(data.urls).then(() => {
        event.ports[0].postMessage({ success: true });
      });
      break;
  }
});

// Limpiar todos los caches
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(
    cacheNames.map(cacheName => caches.delete(cacheName))
  );
}

// Forzar actualización de URLs específicas
async function forceUpdateCache(urls = []) {
  const cache = await caches.open(STATIC_CACHE_NAME);
  return Promise.all(
    urls.map(async (url) => {
      try {
        const response = await fetch(url, { cache: 'reload' });
        if (response.status === 200) {
          return cache.put(url, response);
        }
      } catch (error) {
        console.log('Service Worker: Error actualizando', url, error);
      }
    })
  );
}

// Notificar actualizaciones disponibles
self.addEventListener('updatefound', () => {
  console.log('Service Worker: Nueva versión encontrada');
  
  // Notificar a los clientes sobre la actualización
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        version: CACHE_NAME
      });
    });
  });
});

// Sync en background para actualizar datos cuando hay conexión
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

// Realizar sincronización en background
async function doBackgroundSync() {
  console.log('Service Worker: Ejecutando sync en background');
  
  try {
    // Actualizar cotizaciones de dólar
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    for (const url of DYNAMIC_URLS) {
      try {
        const response = await fetch(url);
        if (response.status === 200) {
          await cache.put(url, response);
        }
      } catch (error) {
        console.log('Service Worker: Error en background sync para', url);
      }
    }
  } catch (error) {
    console.log('Service Worker: Error en background sync', error);
  }
}

// Log de información
console.log('Service Worker: Portal de Noticias Argentina SW cargado', {
  version: CACHE_NAME,
  staticAssets: STATIC_ASSETS.length,
  dynamicUrls: DYNAMIC_URLS.length
});