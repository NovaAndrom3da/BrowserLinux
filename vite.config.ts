import { svelte } from '@sveltejs/vite-plugin-svelte';
import UnpluginIcons from 'unplugin-icons/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import { prefetch } from './prefetch-plugin';

export default defineConfig({
  plugins: [
    svelte(),
    prefetch(),
    // replace({ ...replacePlugin() }),
    UnpluginIcons({ autoInstall: true, compiler: 'svelte' }),
    VitePWA({
      includeAssets: [
        'robots.txt',
        'assets/app-icons/finder/32.png',
        'assets/cover-image.png',
        'assets/cursors/(normal|link|text|help)-select.svg',
        'assets/**/*.mp3',
        'assets/**/*.webp',
        'assets/wallpapers/37-[12].jpg',
      ],
      manifest: {
        name: 'BrowserLinux',
        short_name: 'BrowserLinux',
        theme_color: '#ffffff',
        description: 'A linux environment in the browser.',
        icons: [
          {
            src: 'assets/app-icons/finder/128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'assets/app-icons/finder/192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'assets/app-icons/finder/256.png',
            sizes: '256x256',
            type: 'image/png',
          },
          {
            src: 'assets/app-icons/finder/512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'assets/app-icons/finder/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '🍎': new URL('./src/', import.meta.url).pathname,
    },
  },
  build: {
    minify: 'terser',
  },
  server: {
    port: 80,
    hmr: {
      clientPort: 442,
    },
    //hmr: false,
    proxy: {
      '/blpm': 'http://localhost:5456',
      '/blpm-listall': 'http://localhost:5456',
      '/pip': 'http://localhost:5456',
    },
  },
});

