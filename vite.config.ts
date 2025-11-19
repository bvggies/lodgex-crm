import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  define: {
    'process.env.API_KEY': JSON.stringify("AIzaSyD5YJdiFVg-uNE5Jdsc7pNYRygWH1Gy34Q"),
  },
});