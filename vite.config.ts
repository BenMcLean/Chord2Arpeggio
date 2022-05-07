import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
      react(),
    VitePWA({
        // the default strategy is prompt
        registerType: 'autoUpdate',
        workbox: {
            globPatterns: ['**/*.{js,css,html,svg}']
        }
    })
  ],
  base: '/Chord2Arpeggio/',
})
