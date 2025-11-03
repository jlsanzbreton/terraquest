
# TerraQuest – Exploradores del Mundo (MVP)

**PWA offline-first** para niños de 8–11 años. Incluye mapa SVG interactivo y el minigame inicial **GeoMatch (país–capital–bandera)**, con progreso local (Dexie/IndexedDB).

## Requisitos
- Node 22.x
- npm 10+

## Puesta en marcha
```bash
# Instalar dependencias
npm i

# Iniciar servidor de desarrollo
npm run dev
```
Abre el enlace local que muestra Vite.

### Build y preview
```bash
# Crear la build de producción
npm run build

# Previsualizar la build
npm run preview
```

## Estructura de archivos
```
terraquest/
├─ public/
│  ├─ manifest.webmanifest
│  ├─ icons/
│  │  ├─ icon-192.png
│  │  └─ icon-512.png
│  └─ world-continents.svg
├─ src/
│  ├─ index.tsx
│  ├─ App.tsx
│  ├─ styles.css
│  ├─ data/questions.json
│  ├─ data/flags.json
│  ├─ store/db.ts
│  ├─ components/{MapView,GeoMatch,BadgeCase,HUD,Modal}.tsx
│  ├─ pages/{Home,Explore,Play}.tsx
│  ├─ utils/{shuffle,gameLogic}.ts
│  └─ types.ts
├─ index.html
├─ vite.config.ts
├─ tsconfig.json
└─ package.json
```

## Tailwind CSS

Asegúrate de tener estos archivos de configuración:

**tailwind.config.js**
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: []
};
```

**postcss.config.js**
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

**src/styles.css**
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```
Importa `./styles.css` en `src/index.tsx`.

## Service Worker (SW)

El proyecto usa `vite-plugin-pwa` para generar automáticamente el service worker (`sw.js`) en el proceso de build, asegurando que la aplicación funcione offline. La configuración está en `vite.config.ts` y precachea todos los assets necesarios.

## Datos del juego
- Edita `src/data/questions.json` y `src/data/flags.json` para añadir preguntas y banderas (emoji en MVP).
- Mantén 3–4 opciones por pregunta. El campo `extra` es para curiosidades.

## Accesibilidad
- Regiones del mapa con `role="button"`, `tabIndex="0"`, y `aria-label` descriptivo.
- Foco visible, botones grandes, contraste adecuado.

## PWA
- Manifest en `public/manifest.webmanifest`.
- Tras instalar, el juego abre en ventana independiente (`standalone`) y funciona offline.

## Licencia

MVP educativo. Añade la licencia que prefieras (MIT recomendado) cuando subas el repo.
