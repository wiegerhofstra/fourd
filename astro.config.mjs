// @ts-check
import { defineConfig, envField } from 'astro/config';
import { loadEnv } from 'vite';

const { PUBLIC_URL } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), 'PUBLIC_');

// https://astro.build/config
export default defineConfig({
  site: PUBLIC_URL || 'https://www.fourd.nl',
  // Fetch CMS content and download its media when building; production serves only files.
  output: 'static',
  i18n: {
    locales: ['nl', 'en'],
    defaultLocale: 'nl',
    routing: { prefixDefaultLocale: false },
  },
  redirects: {
    '/home': '/',
  },
  env: {
    schema: {
      CMS_URL: envField.string({ context: 'server', access: 'public', default: 'https://cms.fourd.nl' }),
      CMS_TENANT_SLUG: envField.string({ context: 'server', access: 'public', default: 'fourd' }),
      CMS_ACCESS_TOKEN: envField.string({ context: 'server', access: 'secret' }),
    },
  },
});
