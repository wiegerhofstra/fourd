# FourD website

Astro builds the Dutch and English website into static files in `dist/`. CMS content,
page routes, and navigation are fetched during the build. Production needs only a static
web server: no Node process, database, or persistent volume. Images and downloads link
directly to their stable CMS URLs.

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
compression, caches build assets for a year, and revalidates HTML.
Preserve any infrastructure-specific directives required by your Coolify installation.
Do not configure an SPA fallback to `/index.html`; this is a multipage website.
A health check can request `/` on port 80 without contacting the CMS.

See [Coolify's Railpack guide](https://coolify.io/docs/applications/builds/railpack).

## Publishing content

After publishing, editing, moving, unpublishing or deleting content, click **Rebuild** in
the CMS. Publishing does not queue a build automatically, so batch changes and rebuild once;
changes made while a build runs may need another rebuild. The CMS reports "build queued"
once Coolify accepts the deployment; it does not wait for the build. Follow the deployment
in Coolify: on failure the previous site stays live. After a timeout, check Coolify before
retrying, because a deployment may already have started.

The Rebuild button calls Coolify's deploy webhook with `force=true`, so an unchanged Git
commit still produces fresh HTML. A CMS administrator configures it once: select Astro under
Settings → Tenants, then under Settings → Website save this application's **Deploy Webhook**
(the resource webhook with this application's UUID, not a tag webhook) and a Coolify API token
with deploy permission. Enable Coolify API access if needed. That token belongs only in the
CMS, never in this repository or the application's environment.

To deploy manually instead, use **Force deploy (without cache)** in Coolify. A normal deploy
can reuse the image for an unchanged Git commit, and build caches can reuse old CMS output.
Restarting an existing container does not update content. There is no `/api/revalidate`
endpoint and no runtime cache to invalidate.

CMS/API errors fail the build instead of publishing incomplete pages. Pages stay online
while the CMS is unavailable, but images and downloads are served by the CMS from their
stable asset URLs, so they need the CMS to be up. The CMS checks each request, so deleting
an asset takes effect immediately, without a rebuild. Rebuild after the CMS's media signing
secret is rotated, because the old URLs in the deployed HTML stop working. There is no
`/media/` route on this site; do not proxy or cache CMS files as public or immutable.

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
