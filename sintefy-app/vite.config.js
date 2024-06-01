import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({ registerType: 'autoUpdate' })
  ],
  define:{
      companyName:'"Sintefy"',
      companyAddr:'"7, Apple Tool Works, MIDC, Pune"',
      companyEmail:'"admin@sintefy.com"',
      companyPhno:'"+91 9876765432"',
      baseUrl:'"http://localhost:3000/api/"',
  },
});
