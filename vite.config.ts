import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
      },
      includeAssets: ['favicon.svg', 'world-continents.svg', 'icons/*.png'],
      manifest: {
        name: 'TerraQuest – Exploradores del Mundo',
        short_name: 'TerraQuest',
        description: 'Juegos educativos offline para explorar geografía, historia y ciencia.',
        lang: 'es-ES',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'any',
        theme_color: '#0ea5e9',
        background_color: '#f1f5f9',
        categories: ['education', 'games'],
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
});
