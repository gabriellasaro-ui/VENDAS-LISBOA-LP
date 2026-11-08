import { defineConfig } from 'vite'
import { resolve } from 'node:path'

export default defineConfig({
  server: { port: 5173, open: false },
  build: {
    target: 'es2022',
    // Cada página com o próprio CSS: a LP de fronteira reaproveita nomes de classe da original
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        fronteira: resolve(import.meta.dirname, 'fronteira/index.html')
      }
    }
  }
})
