import { defineConfig } from 'vite';

export default defineConfig({
  // THIS IS THE FIX: It makes paths relative so they don't 404
  base: './',
  root: '.',
  build: {
    outDir: 'dist'
  }
});
