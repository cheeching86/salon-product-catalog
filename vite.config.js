import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// IMPORTANT: this must match your GitHub repository name exactly.
// Deployed URL will be https://USERNAME.github.io/salon-product-catalog/
const REPO_BASE = '/salon-product-catalog/'

export default defineConfig({
  base: REPO_BASE,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      // We register the service worker ourselves in src/main.jsx via the
      // 'virtual:pwa-register' module, so the plugin should NOT also
      // inject its own <script> registration (that would double-register).
      injectRegister: false,
      workbox: {
        // Precache every build asset (JS, CSS, HTML, icons, fonts) so the
        // app has everything it needs with zero network access.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        // SPA fallback: any navigation request that isn't precached
        // (e.g. deep link) still resolves to the cached index.html.
        navigateFallback: `${REPO_BASE}index.html`,
        cleanupOutdatedCaches: true,
        // Data lives in IndexedDB, never in the SW cache, so bumping the
        // service worker / clearing old caches never touches catalog data.
        clientsClaim: true,
        skipWaiting: true
      },
      includeAssets: [
        'icons/favicon.ico',
        'icons/apple-touch-icon.png',
        'icons/icon-192.png',
        'icons/icon-512.png',
        'icons/icon-maskable-512.png'
      ],
      manifest: {
        id: REPO_BASE,
        name: 'Salon Product Catalog',
        short_name: 'Salon Catalog',
        description: 'Professional hair care wholesale product catalog — works fully offline.',
        start_url: REPO_BASE,
        scope: REPO_BASE,
        display: 'standalone',
        display_override: ['standalone', 'minimal-ui'],
        orientation: 'any',
        background_color: '#FAF6F1',
        theme_color: '#2F4538',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      devOptions: {
        enabled: false
      }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
