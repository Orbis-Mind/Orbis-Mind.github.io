import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Org GitHub Pages site: served at the domain root.
export default defineConfig({
  site: 'https://orbis-mind.github.io',
  base: '/',
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
