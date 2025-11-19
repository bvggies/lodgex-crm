import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build',
  },
  define: {
    'process.env.API_KEY': JSON.stringify("AIzaSyD5YJdiFVg-uNE5Jdsc7pNYRygWH1Gy34Q"),
    'process.env.REACT_APP_API_URL': JSON.stringify("http://localhost:3001/api"),
  },
});