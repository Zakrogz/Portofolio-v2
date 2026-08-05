import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages sirve el repo en /Portofolio-v2/, no en la raíz del dominio.
  base: '/Portofolio-v2/',
})
