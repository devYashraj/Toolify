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
      companyAddr:'"East Street, South Park"',
      companyEmail:'"admin@sintefy.com"',
      companyPhno:'"+91 1000000000"',
      baseUrl:'"http://localhost:3000/api/"',
  },
});
