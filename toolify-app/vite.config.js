import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ registerType: 'autoUpdate' })
  ],
  define: {
    companyName: '"Toolify"',
    companyAddr: '"7, Apple Tool Works, MIDC, Pune"',
    companyEmail: '"admin@toolify.com"',
    companyPhno: '"+91 1020202020"',
    baseUrl: '"http://localhost:3000/api/"',
  },
});
