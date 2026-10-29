// @ts-check
import { defineConfig, envField } from 'astro/config';
import node from '@astrojs/node';
import { loadEnv } from 'vite';

const { PUBLIC_URL } = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), 'PUBLIC_');

// https://astro.build/config
export default defineConfig({
  site: PUBLIC_URL || 'https://www.fourd.nl',
  // CMS content is fetched per request (with a short in-memory cache), so pages render on the server.
  output: 'server',
  adapter: node({ mode: 'standalone' }),
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
      CMS_REVALIDATION_SECRET: envField.string({ context: 'server', access: 'secret', optional: true }),
      /** Seconds before cached CMS content is fetched again, even without a revalidation call. */
      CMS_CACHE_SECONDS: envField.number({ context: 'server', access: 'public', default: 300 }),
    },
  },
});
