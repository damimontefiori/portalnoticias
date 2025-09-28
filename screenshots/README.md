# Screenshots PWA

Esta carpeta debe contener las capturas de pantalla para la PWA que se muestran en las tiendas de aplicaciones y durante la instalación.

## Screenshots Requeridos

### Mobile (narrow form factor)
- **mobile.png**: 320x640px o similar ratio
- Debe mostrar la interfaz principal en dispositivo móvil
- Incluir el ticker de dólar y algunas noticias

### Desktop (wide form factor)  
- **desktop.png**: 1280x720px o similar ratio
- Debe mostrar la interfaz completa en desktop
- Incluir todas las categorías y layout expandido

## Cómo Tomar las Capturas

### Método 1: Herramientas de Desarrollo del Navegador
1. Abre la aplicación en Chrome
2. Presiona F12 para abrir DevTools
3. Click en el icono de dispositivo móvil
4. Selecciona resolución apropiada
5. Toma captura con la herramienta de screenshot

### Método 2: Lighthouse
```bash
lighthouse http://localhost:8080 --only-categories=pwa --chrome-flags="--headless" --output=html
```

### Método 3: Puppeteer Script
```javascript
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  // Mobile screenshot
  await page.setViewport({width: 375, height: 667});
  await page.goto('http://localhost:8080');
  await page.screenshot({path: 'screenshots/mobile.png'});
  
  // Desktop screenshot  
  await page.setViewport({width: 1280, height: 720});
  await page.screenshot({path: 'screenshots/desktop.png'});
  
  await browser.close();
})();
```

## Mejores Prácticas

- **Contenido Real**: Usa datos reales, no lorem ipsum
- **Estados Ideales**: Muestra la app en su mejor estado
- **Branding**: Incluye elementos que identifiquen la app
- **Funcionalidades**: Destaca las características principales
- **Responsive**: Asegúrate que se vea bien en diferentes tamaños

## Herramientas Útiles

- [Mockup Generator](https://mockuphone.com/)
- [PWA Screenshots](https://appsco.pe/developer/splash-screens)
- [Responsive Screenshots](https://www.responsinator.com/)

Las capturas se usan en:
- Manifest.json (para instalación PWA)
- App stores si decides subir la app
- Documentación y marketing