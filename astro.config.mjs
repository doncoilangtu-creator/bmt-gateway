import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  server: {
    host: '0.0.0.0',
    port: 4321,
  },
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
    server: {
      allowedHosts: ['duc.shr.vn', 'localhost', '127.0.0.1'],
    },
    preview: {
      allowedHosts: ['duc.shr.vn', 'localhost', '127.0.0.1'],
    },
  },
});
