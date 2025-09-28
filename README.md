# Portal de Noticias Argentina

Una Progressive Web App (PWA) moderna y responsive que presenta las últimas noticias argentinas con cotizaciones del dólar en tiempo real.

## 🌟 Características

- **📱 Mobile-First**: Diseño optimizado para dispositivos móviles
- **⚡ PWA**: Aplicación web progresiva con funcionalidad offline
- **💱 Cotizaciones en Tiempo Real**: Dólar oficial, blue, MEP y CCL
- **📰 Categorías Organizadas**: Economía, política, deportes, entretenimiento y tecnología/IA
- **🎨 Diseño Moderno**: UI/UX atractiva con sistema de widgets expandibles
- **🔄 Actualizaciones Automáticas**: Service Worker con cache inteligente
- **⚡ Carga Rápida**: Optimizado para velocidad y performance

## 📂 Estructura del Proyecto

```
portal-noticias/
├── index.html              # Página principal
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── netlify.toml           # Configuración de Netlify
├── styles/
│   └── main.css           # Estilos principales
├── js/
│   ├── app.js             # Aplicación principal
│   ├── data.js            # Datos de noticias
│   ├── dollar.js          # Servicio de cotizaciones
│   └── pwa.js             # Manager de PWA
├── icons/                 # Iconos de la PWA (a generar)
└── screenshots/           # Capturas para PWA (a generar)
```

## 🚀 Despliegue en Netlify

### Opción 1: Despliegue Automático desde Git

1. **Conectar repositorio**:
   - Ve a [Netlify](https://netlify.com)
   - Crea una cuenta o inicia sesión
   - Click en "New site from Git"
   - Conecta tu repositorio de GitHub/GitLab

2. **Configuración de build**:
   - Build command: `echo 'Static site ready'`
   - Publish directory: `.`
   - El archivo `netlify.toml` configura automáticamente todo lo demás

### Opción 2: Despliegue Manual

1. **Preparar archivos**:
   ```bash
   # Comprimir todos los archivos en un ZIP
   zip -r portal-noticias.zip . -x "*.git*" "*.md"
   ```

2. **Subir a Netlify**:
   - Ve a Netlify Dashboard
   - Arrastra el ZIP a la zona de deploy
   - La app se desplegará automáticamente

### Configuración de Dominio Personalizado

```bash
# En netlify.toml ya está configurado para:
# - HTTPS automático
# - Cache headers optimizados
# - Redirects para APIs
# - Configuración PWA
```

## 🔧 APIs Utilizadas

### Cotizaciones del Dólar
- **Primaria**: [Bluelytics API](https://bluelytics.com.ar/api)
- **Respaldo**: [DolarApi](https://dolarapi.com)
- **Fallback**: Datos estáticos del documento fuente

### Características de las APIs
- ✅ CORS habilitado
- ✅ Sin autenticación requerida  
- ✅ Rate limiting generoso
- ✅ Fallback automático

## 📱 Instalación como PWA

### Android
1. Abre el sitio en Chrome
2. Toca el menú (⋮) → "Instalar app"
3. Confirma la instalación

### iOS
1. Abre el sitio en Safari
2. Toca el botón de compartir
3. Selecciona "Agregar a pantalla de inicio"

### Desktop
1. Abre el sitio en Chrome/Edge
2. Click en el icono de instalación en la barra de direcciones
3. Confirma la instalación

## 🎨 Personalización

### Colores del Tema
```css
:root {
  --primary-color: #0066cc;    /* Azul principal */
  --accent-color: #28a745;     /* Verde éxito */
  --danger-color: #dc3545;     /* Rojo peligro */
  --warning-color: #ffc107;    /* Amarillo advertencia */
}
```

### Categorías de Noticias
Las categorías están configuradas en `js/data.js`:
- 🏛️ **Política**: Actualidad política nacional
- 📈 **Economía**: Mercados, finanzas y comercio
- ⚽ **Deportes**: Fútbol, rugby y otros deportes
- 🎬 **Entretenimiento**: Cine, streaming y cultura
- 🤖 **Tecnología & IA**: Innovación y inteligencia artificial

## ⚡ Performance

### Optimizaciones Implementadas
- **Lazy Loading**: Carga diferida de contenido
- **Image Optimization**: Compresión automática
- **Minificación**: CSS y JS optimizados
- **Service Worker**: Cache inteligente
- **CDN**: Distribución global vía Netlify

### Métricas Objetivo (Lighthouse)
- 🎯 **Performance**: > 90
- 🎯 **Accessibility**: > 95  
- 🎯 **Best Practices**: > 90
- 🎯 **SEO**: > 90
- 🎯 **PWA**: > 90

## 🔒 Seguridad

### Headers Configurados
```toml
X-Frame-Options = "DENY"
X-Content-Type-Options = "nosniff"
Referrer-Policy = "strict-origin-when-cross-origin"
Permissions-Policy = "geolocation=(), microphone=(), camera=()"
```

### Funcionalidades de Seguridad
- ✅ HTTPS forzado
- ✅ CSP headers
- ✅ Sin tracking de terceros
- ✅ APIs públicas sin autenticación

## 🛠️ Desarrollo Local

```bash
# Servidor local simple
python -m http.server 8080
# o
npx serve .

# Abrir en navegador
open http://localhost:8080
```

### Testing PWA

```bash
# Lighthouse CLI
npm install -g lighthouse
lighthouse http://localhost:8080 --view

# PWA testing
npx pwa-asset-generator logo.svg icons/ --manifest manifest.json
```

## 📊 Analytics y Monitoreo

### Métricas Disponibles (vía console)
```javascript
// Estado de la aplicación
console.log(window.newsApp.getAppStats());

// Estadísticas PWA
console.log(window.pwaManager.getPWAStats());

// Estado del cache
window.pwaManager.getCacheInfo().then(console.log);
```

## 🐛 Troubleshooting

### Problemas Comunes

**PWA no se instala**
```javascript
// Verificar soporte
console.log('SW support:', 'serviceWorker' in navigator);
console.log('Manifest:', document.querySelector('link[rel="manifest"]'));
```

**Cotizaciones no cargan**
```javascript
// Test APIs manualmente
window.dollarService.getDollarRates().then(console.log);
```

**Cache issues**
```javascript
// Limpiar cache manualmente
window.pwaManager.clearCache();
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para reportar bugs o solicitar features, por favor usa el [issue tracker](https://github.com/tu-usuario/portal-noticias/issues).

---

**Portal de Noticias Argentina** - Una PWA moderna para mantenerte informado 🇦🇷