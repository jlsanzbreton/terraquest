Prompt para Google AI Studio

Objetivo: Genera un prototipo PWA offline‑first llamado TerraQuest – Exploradores del Mundo para niños de 8–11 años (target 9) que combine un mapa interactivo sencillo y un minijuego inicial (GeoMatch: país–capital–bandera), con progreso local (logros/insignias) y catálogo de preguntas en JSON editable. El resultado debe poder abrirse en local y desplegarse como PWA (manifest + service worker), sin dependencias remotas de datos ni de mapas.

⸻

1) Requisitos de alto nivel
	•	PWA offline‑first con:
	•	manifest.webmanifest válido (íconos de ejemplo, nombre, short_name, start_url, theme_color, background_color, display: standalone, orientation: landscape/auto).
	•	Service Worker (Workbox o vanilla) con estrategia de cache “app shell” + precache de assets estáticos. Debe cachear:
	•	HTML inicial, JS/TS, CSS, fuentes locales.
	•	Datos JSON del juego y el SVG del mapa.
	•	Sin llamadas de red en runtime (todo empaquetado en /src o /public), para que el prototipo funcione 100% offline tras la primera carga.
	•	Stack: Vite + React + TypeScript + Tailwind CSS + Dexie (IndexedDB). Evitar dependencias pesadas y librerías de mapas (Leaflet/Mapbox). Usar SVG propio simple.
	•	Accesibilidad:
	•	Tamaños de toque adecuados, foco visible, roles ARIA en botones, contraste AA.
	•	Texto en español simple y apto para 8–11 años.
	•	Privacidad: sin tracking, sin analytics, sin anuncios.

⸻

2) Arquitectura de carpetas (entregar el código con esta estructura)

terraquest/
├─ index.html
├─ vite.config.ts
├─ package.json
├─ tsconfig.json
├─ public/
│  ├─ manifest.webmanifest
│  ├─ icons/
│  │  ├─ icon-192.png
│  │  └─ icon-512.png
│  └─ world-continents.svg   # Mapa SVG simplificado por continentes (interactivo)
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ styles/tailwind.css
│  ├─ sw.ts                  # service worker (si generas con workbox, añade config)
│  ├─ data/
│  │  ├─ questions.json      # banco inicial de preguntas
│  │  └─ flags.json          # mapping país -> código bandera (banderas en SVG inline o emoji)
│  ├─ store/
│  │  └─ db.ts               # Dexie: progreso, logros, partidas
│  ├─ components/
│  │  ├─ MapView.tsx         # render de SVG + interacción por continentes/regiones
│  │  ├─ GeoMatch.tsx        # minijuego país–capital–bandera
│  │  ├─ BadgeCase.tsx       # vitrina de insignias/logros
│  │  ├─ HUD.tsx             # cabecera con puntuación/vidas/nivel
│  │  └─ Modal.tsx
│  ├─ pages/
│  │  ├─ Home.tsx
│  │  ├─ Explore.tsx         # mapa + pistas
│  │  └─ Play.tsx            # selección de minijuegos
│  ├─ utils/
│  │  ├─ shuffle.ts
│  │  └─ gameLogic.ts
│  └─ types/
│     └─ index.d.ts
└─ README.md

Nota mapa: public/world-continents.svg debe ser un SVG ligero (continentes/mega‑regiones, 8–12 paths máximo) con ids únicos (ej. africa, europe, asia, americas_north, americas_south, oceania, antarctica, mediterranean_basin). Incluir tabIndex, role="button" y aria-label por región para accesibilidad. Colores suaves, hover/focus destacados.

⸻

3) Modelos de datos (TypeScript)

3.1 Tipos de pregunta

export type Category =
  | "GEOGRAFIA"
  | "HISTORIA"
  | "PALEONTOLOGIA"
  | "ARQUEOLOGIA"
  | "POLITICA";

export type QuestionType =
  | "GEO_CAPITAL"       // país → capital
  | "GEO_BANDERA"       // país → bandera
  | "GEO_REGION"        // pista → región/continente
  | "HIST_RUTA"         // ruta histórica → destino
  | "PALEO_ERA"         // fósil → era geológica
  | "ARQ_SITIO";        // pista → yacimiento/cultura

export interface Question {
  id: string;
  category: Category;
  type: QuestionType;
  difficulty: 1 | 2 | 3; // 1 fácil, 2 media, 3 difícil
  regionId?: string;      // vincular a id del SVG
  prompt: string;         // enunciado/pista
  options: string[];      // 3–4 opciones
  answer: string;         // respuesta correcta
  extra?: string;         // curiosidad/contexto
  assets?: string[];      // ids de bandera u otros íconos
}

3.2 Progreso y logros (Dexie)

export interface SaveSlot {
  id?: number;
  createdAt: number;
  playerName: string;
  points: number;
  badges: string[];    // ids de logros
  seenTips: string[];  // ids de tutoriales vistos
}

export interface History {
  id?: number;
  questionId: string;
  correct: boolean;
  timestamp: number;
}


⸻

4) Contenido inicial (seed)

4.1 questions.json (muestra)

[
  {
    "id": "q_geo_001",
    "category": "GEOGRAFIA",
    "type": "GEO_CAPITAL",
    "difficulty": 1,
    "regionId": "europe",
    "prompt": "¿Cuál es la capital de Francia?",
    "options": ["París", "Lyon", "Marsella"],
    "answer": "París",
    "extra": "París es conocida como la ciudad de la luz."
  },
  {
    "id": "q_geo_002",
    "category": "GEOGRAFIA",
    "type": "GEO_BANDERA",
    "difficulty": 1,
    "regionId": "americas_north",
    "prompt": "Elige la bandera de Canadá",
    "options": ["canada", "mexico", "usa"],
    "answer": "canada",
    "assets": ["flag_canada", "flag_mexico", "flag_usa"],
    "extra": "La hoja de arce es un símbolo de Canadá."
  },
  {
    "id": "q_geo_003",
    "category": "GEOGRAFIA",
    "type": "GEO_REGION",
    "difficulty": 2,
    "regionId": "asia",
    "prompt": "Soy el río más largo de Asia y paso por China. ¿Quién soy?",
    "options": ["Yangtsé", "Ganges", "Mekong"],
    "answer": "Yangtsé"
  },
  {
    "id": "q_paleo_001",
    "category": "PALEONTOLOGIA",
    "type": "PALEO_ERA",
    "difficulty": 2,
    "regionId": "americas_south",
    "prompt": "El T. rex vivió en…",
    "options": ["Cretácico", "Jurásico", "Triásico"],
    "answer": "Cretácico",
    "extra": "El T. rex vivió hace unos 68–66 millones de años."
  }
]

4.2 flags.json (mapeo simple)

{
  "canada": "🇨🇦",
  "mexico": "🇲🇽",
  "usa": "🇺🇸",
  "france": "🇫🇷"
}

Simplificación de banderas: utilizar emoji en el MVP para evitar assets pesados; en una versión posterior se pueden añadir SVG locales por país.

⸻

5) Comportamiento de las pantallas

5.1 Home
	•	Botón Jugar (va a Play), Explorar (va a Explore), Colección (va a BadgeCase).
	•	Selector de ranura de guardado (1, 2, 3). Nombre del jugador.

5.2 Play (minijuegos)
	•	Lista de minijuegos disponibles; activo: GeoMatch.
	•	Dificultad: Fácil/Media/Difícil (filtra preguntas por difficulty).

5.3 GeoMatch
	•	Ronda de 5 preguntas.
	•	Cada pregunta muestra prompt y 3 opciones (botones grandes con texto o emojis/íconos).
	•	Feedback inmediato (correcto/incorrecto), suma de puntos, barra de progreso, sonido opcional (muteable).
	•	Al finalizar: mostrar puntuación, estrellas (0–3), y posible logro (p. ej., “Aprendiz de cartógrafo” por 5/5).

5.4 Explore (Mapa)
	•	Carga public/world-continents.svg como componente React (<object> o import SVG como JSX con vite-svg-loader, o inline como JSX) con regiones clicables.
	•	Al hacer hover/focus, resaltar región; al click, mostrar pistas (filtra questions.json por regionId) y ofrece un botón “Jugar preguntas de esta región” (navega a GeoMatch con ese filtro).

5.5 BadgeCase (Logros)
	•	Lista de insignias desbloqueadas y por desbloquear (grisadas). Ejemplos:
	•	badge_first_win (primera partida finalizada)
	•	badge_perfect_round (5/5 aciertos)
	•	badge_continental_explorer (3 regiones diferentes jugadas)

⸻

6) UI/UX y estilo (Tailwind)
	•	Paleta amable y contrastada; tipografía legible; botones grandes; feedback visual claro.
	•	Soporte tema claro/oscuro opcional.
	•	Componentes reutilizables: Button, Card, Modal, ProgressBar.

⸻

7) Lógica de datos
	•	Cargar questions.json y flags.json al inicio y cachear en Service Worker.
	•	Filtro por región y dificultad.
	•	shuffle() para aleatorizar opciones y orden de preguntas.
	•	Persistencia en Dexie:
	•	Tabla saves: id, playerName, points, badges.
	•	Tabla history: questionId, correct, timestamp.
	•	API simple en store/db.ts con funciones: getSave(slot), saveProgress, addBadge, logAnswer, resetSave.

⸻

8) PWA – manifest y SW

8.1 public/manifest.webmanifest
	•	Campos mínimos: name, short_name, start_url: "/", scope: "/", display: "standalone", theme_color, background_color, icons (192 y 512), prefer_related_applications: false.

8.2 src/sw.ts
	•	Precarga (precache) de index.html, src/**, public/world-continents.svg, datos src/data/*.json e íconos.
	•	Estrategia NetworkOnly con fallback a Cache para / (app shell) en desarrollo o directamente CacheFirst en producción.
	•	Escuchar eventos install, activate, fetch.

⸻

9) Aceptación (criterios de éxito)
	•	La app arranca offline (tras una primera carga) y permite jugar GeoMatch sin red.
	•	El mapa SVG es navegable (mouse/teclado), con regiones clicables que filtran preguntas.
	•	El progreso (puntos y logros) persiste tras cerrar y abrir la app.
	•	Sin errores de consola. Lint y typecheck pasan.

⸻

10) Scripts de npm (añadir en package.json)
	•	dev: arranque Vite
	•	build: build de producción
	•	preview: vista previa del build
	•	typecheck: tsc --noEmit
	•	lint (opcional)

⸻

11) Instrucciones en README.md
	•	Requisitos: Node 22.x, npm 10+.
	•	npm i → npm run dev.
	•	npm run build → npm run preview.
	•	Cómo instalar como PWA (add to home / desktop).
	•	Cómo editar questions.json para que padres/profes puedan añadir contenido.

⸻

12) Consideraciones Pedagógicas
	•	Dificultad progresiva (1→3), sesiones cortas (5–8 min), refuerzo positivo.
	•	Multimodalidad: texto + emoji/íconos, sonidos opcionales (silenciables).
	•	Fomentar el descubrimiento: tras cada respuesta correcta, mostrar una curiosidad (extra).

⸻

13) Entrega
	•	Devuélveme todo el código fuente completo siguiendo la estructura dada, con archivos y contenido listos para abrir en VS Code y ejecutar.
	•	Incluye un SVG de continentes simple y bonito en public/world-continents.svg (paths con ids y títulos accesibles).
	•	Añade 20–30 preguntas de ejemplo distribuidas en categorías y dificultades.

⸻

14) Extras (si cabe)
	•	Modo “Explorador Rápido”: preguntas al azar en 60s.
	•	Toggle tema claro/oscuro.
	•	Sonidos UI breves (click/acierto/error) locales en /public/sfx.

⸻

Importante: No uses servicios externos (APIs de mapas, CDNs de banderas, etc.). Todo debe vivir en el repo. El resultado debe ser un MVP jugable, PWA, accesible, ligero y sin anuncios.

⸻

Archivos listos para el MVP

A continuación tienes package.json, public/manifest.webmanifest y README.md listos para copiar en el proyecto.

1) package.json

{
  "name": "terraquest",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "typecheck": "tsc --noEmit",
    "lint": "echo 'No linter configured in MVP' && exit 0"
  },
  "dependencies": {
    "dexie": "^4.0.8",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@types/react": "^18.3.7",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "@tailwindcss/postcss": "^4.0.0",
    "typescript": "^5.6.3",
    "vite": "^6.3.5",
    "vite-svg-loader": "^5.1.0"
  }
}

Notas
	•	Incluye @tailwindcss/postcss para evitar el error de Vite/PostCSS reciente.
	•	vite-svg-loader permite importar el world-continents.svg como componente si lo prefieres.

⸻

2) public/manifest.webmanifest

{
  "name": "TerraQuest – Exploradores del Mundo",
  "short_name": "TerraQuest",
  "description": "Juegos educativos offline para explorar geografía, historia y ciencia.",
  "lang": "es-ES",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "any",
  "theme_color": "#0ea5e9",
  "background_color": "#f1f5f9",
  "categories": ["education", "games"],
  "icons": [
    { "src": "/icons/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icons/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" }
  ]
}

Recuerda colocar los íconos en public/icons/ con esos nombres.

⸻

3) README.md

# TerraQuest – Exploradores del Mundo (MVP)

**PWA offline-first** para niños de 8–11 años. Incluye mapa SVG interactivo y el minijuego inicial **GeoMatch (país–capital–bandera)**, con progreso local (Dexie/IndexedDB).

## Requisitos
- Node 22.x
- npm 10+

## Puesta en marcha
```bash
npm i
npm run dev

Abre el enlace local que muestra Vite.

Build y preview

npm run build
npm run preview

Estructura mínima sugerida

terraquest/
├─ public/
│  ├─ manifest.webmanifest
│  ├─ icons/
│  │  ├─ icon-192.png
│  │  └─ icon-512.png
│  └─ world-continents.svg
├─ src/
│  ├─ main.tsx
│  ├─ App.tsx
│  ├─ styles/tailwind.css
│  ├─ sw.ts
│  ├─ data/questions.json
│  ├─ data/flags.json
│  ├─ store/db.ts
│  ├─ components/{MapView,GeoMatch,BadgeCase,HUD,Modal}.tsx
│  ├─ pages/{Home,Explore,Play}.tsx
│  └─ utils/{shuffle,gameLogic}.ts
├─ index.html
├─ vite.config.ts
├─ tsconfig.json
└─ package.json

Tailwind CSS

Asegúrate de tener estos archivos de config (si aún no existen):

tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: []
};

postcss.config.js

export default {
  plugins: {
    "@tailwindcss/postcss": {},
    autoprefixer: {}
  }
};

src/styles/tailwind.css

@tailwind base;
@tailwind components;
@tailwind utilities;

Importa ./styles/tailwind.css en main.tsx.

Service Worker (SW)

El MVP puede usar un SW simple (src/sw.ts) con precache de index.html, src/**, public/world-continents.svg, src/data/*.json e íconos. Regístralo en main.tsx con:

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(console.error);
  });
}

Si usas TypeScript, recuerda compilar/copiar sw.ts a sw.js en el build (por ejemplo con vite-plugin-pwa o copiando el archivo como asset).

Datos del juego
	•	Edita src/data/questions.json y src/data/flags.json para añadir preguntas y banderas (emoji en MVP).
	•	Mantén 3–4 opciones por pregunta. Campo extra para curiosidades.

Accesibilidad
	•	Regiones del mapa con role="button", tabIndex="0", y aria-label descriptivo.
	•	Foco visible, botones grandes, contraste adecuado.

PWA
	•	Manifest en public/manifest.webmanifest (incluye nombre, short_name, start_url, display, icons, theme/background).
	•	Tras instalar, el juego abre en ventana independiente (standalone) y funciona offline.

Licencia

MVP educativo. Añade la licencia que prefieras (MIT recomendado) cuando subas el repo.

