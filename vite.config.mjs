// Sirve o compila la app de demostración (Banco Aurora). La versión se elige con APP_VERSION=v1|v2.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

const version = process.env.APP_VERSION === 'v1' ? 'v1' : 'v2';
const raiz = path.resolve(import.meta.dirname, 'app', version);

export default defineConfig({
  root: raiz,
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.join(raiz, 'src') } },
  server: { port: Number(process.env.PORT) || 4173, strictPort: true },
  build: { outDir: process.env.SALIDA || path.resolve(import.meta.dirname, 'dist', version), emptyOutDir: true },
  clearScreen: false,
});
