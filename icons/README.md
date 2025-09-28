# Iconos PWA

Esta carpeta debe contener los iconos necesarios para la PWA en diferentes tamaños.

## Iconos Requeridos

Para generar los iconos automáticamente, puedes usar herramientas como:

### Opción 1: PWA Asset Generator
```bash
npm install -g pwa-asset-generator
pwa-asset-generator logo.svg icons/ --manifest manifest.json --index index.html
```

### Opción 2: Favicon.io
1. Ve a https://favicon.io/
2. Sube tu logo
3. Descarga el paquete completo
4. Coloca los archivos en esta carpeta

### Opción 3: Crear manualmente
Necesitas estos tamaños:
- favicon-16x16.png
- favicon-32x32.png
- apple-touch-icon.png (180x180)
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Logo Base Recomendado

Para mejores resultados, usa un logo:
- Formato SVG o PNG de alta resolución (512x512 mínimo)
- Fondo transparente
- Diseño simple y reconocible
- Colores que contrasten bien en fondos claros y oscuros

## Iconos de Accesos Directos

También puedes crear iconos específicos para los shortcuts:
- dollar-shortcut.png (96x96) - Para acceso rápido a cotizaciones
- economy-shortcut.png (96x96) - Para noticias económicas

Estos se configuran en el manifest.json y aparecen cuando el usuario mantiene presionado el icono de la app.