import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base relativa: funciona tanto en local como en cualquier subpath de GitHub Pages,
  // sin necesidad de hardcodear el nombre del repo.
  base: './',
})
