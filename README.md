# FourD website

Astro builds the Dutch and English website into static files in `dist/`. CMS content,
page routes, navigation, and media are fetched during the build. Production needs only
a static web server: no Node process, CMS requests, database, or persistent volume.

## Local development

Use Node.js 22.23.4 or newer and install dependencies with `npm ci`.
Copy `.env.example` to `.env.local` and set a tenant-scoped `CMS_ACCESS_TOKEN`.
Never commit the real token.

```sh
npx astro dev --background
npx astro dev status
npx astro dev logs
npx astro dev stop
```

Development refreshes its CMS snapshot after five seconds. Production content changes
only when the site is rebuilt and redeployed.

```sh
npx astro check
npm run test:static
npm run build
npm run preview
```

## Deploy on Coolify with Railpack

| Setting | Value |
| --- | --- |
| Build pack | Railpack |
| Output type | Static site |
| Site type (after creation) | Static, not SPA |
| Base directory | `/` |
| Install command | `npm ci` |
| Build command | `npm run build` |
| Publish directory | `/dist` |
| Port | `80` (Nginx) |
| Start command | Leave unset; Coolify serves the generated files |

Ensure the detected Node version satisfies `package.json` (`>=22.23.4`). Configure
these variables as **available during build**:

| Variable | Purpose / default |
| --- | --- |
| `PUBLIC_URL` | Canonical HTTPS origin; defaults to `https://www.fourd.nl` |
| `CMS_URL` | CMS origin; defaults to `https://cms.fourd.nl` |
| `CMS_TENANT_SLUG` | Tenant; defaults to `fourd` |
| `CMS_ACCESS_TOKEN` | Required secret with read access to the tenant's content and assets |

The token is used only by the build; it is not included in the published `dist/` files.
Use Coolify's build-secret support where available; never add it to source control or
prefix it with `PUBLIC_`. No runtime environment variables are required. Remove old
`CMS_CACHE_SECONDS` and `CMS_REVALIDATION_SECRET` settings.

Set the HTTPS domain in Coolify and point DNS at the deployment server. In
General → Build pipeline → Custom Nginx configuration, use `deploy/nginx.conf`.
It serves nested routes, returns a real 404 (including an English error page), enables
compression, caches build assets and CMS media for a year, and revalidates HTML.
Preserve any infrastructure-specific directives required by your Coolify installation.
Do not configure an SPA fallback to `/index.html`; this is a multipage website.
A health check can request `/` on port 80 without contacting the CMS.

See [Coolify's Railpack guide](https://coolify.io/docs/applications/builds/railpack).

## Publishing content

After editing or publishing in the CMS, trigger a fresh Coolify build and deployment.
For content-only changes, use **Force deploy (without cache)**: Coolify can otherwise
reuse the image for an unchanged Git commit, and build caches can reuse old CMS output.
Restarting an existing container does not update content.

The old `/api/revalidate` endpoint has been removed. Disable its configuration in the
CMS. A future deployment webhook would need to trigger a fresh build, not cache
invalidation. The CMS's manual Revalidate action is not automatically compatible
with Coolify's deployment API.

CMS/API or asset download errors fail the build instead of publishing incomplete
pages. The already deployed site remains independent of CMS availability. Downloads
are saved as `/media/<asset-id>.<extension>`, so the site never links to CMS file URLs and
keeps working while the CMS is unavailable. Removing an asset in the CMS does not erase copies
in old deployments or browser caches; a new build removes unused files from the new output.
`/media/` is cached as immutable because an asset ID's bytes never change: a replaced file gets
a new ID and URL. Do not put a shared cache or CDN in front of `/media/` without revisiting this,
or files removed from the CMS stay publicly reachable there for up to a year.

All published page entries are generated in both languages, including child pages
expanded in services and menus. Localized slugs and language-switch links are retained.
`/home` and legacy `/diensten/<name>` links have generated HTML redirects. Static HTML
redirects use meta refresh, not HTTP 301/308; add matching Nginx `return 308` rules if
HTTP redirects are required.

The CMS delivery API cannot enumerate historical redirects. When renaming/moving a
page, record its old path in `astro.config.mjs` → `redirects` (or Nginx) and rebuild;
unlisted historical paths return 404. Keep redirects for both languages as needed.

## CMS integration

Read `docs/cms/INTEGRATION.md` before changing the integration. The generated client,
types, and rich-text renderer are imported directly from `docs/cms/`, so that directory
must stay committed and available during builds. Never edit generated files.

After CMS schema changes, run `npm run cms:docs`, review and commit the changes, then
run `npx astro check` and `npm run build`. Keep documentation refreshes separate from
normal deployment builds. See `CMS-DOCS-SETUP.md` for setup.
