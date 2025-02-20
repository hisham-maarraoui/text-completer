import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        content: 'src/content/content.jsx'
      },
      output: {
        dir: 'dist',
        format: 'es',
        entryFileNames: '[name].js'
      }
    },
    outDir: 'dist'
  }
})