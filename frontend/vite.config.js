import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Pasta onde o app fica publicado. No GitHub Pages é "/recebidinho/"
// (definido no workflow); no computador e em domínio próprio, "/".
const base = process.env.BASE_PATH || '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      // Service worker próprio (src/sw.js): precisamos tratar o push.
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectRegister: 'auto',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png', 'icons/badge-96.png'],
      manifest: {
        name: 'Recebidinho - Encomendas do condomínio',
        short_name: 'Recebidinho',
        description: 'Avisos de encomendas que chegaram na portaria.',
        lang: 'pt-BR',
        start_url: base,
        scope: base,
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0f766e',
        // Caminhos relativos ao manifesto (funcionam em qualquer pasta).
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
