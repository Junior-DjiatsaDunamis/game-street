// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],

  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      exclude: ['face-api.js']
    },
    ssr: {
      noExternal: ['face-api.js']
    },
    resolve: {
      alias: {
        'face-api.js': 'face-api.js/build/es6/index.js'
      }
    }
  }
});