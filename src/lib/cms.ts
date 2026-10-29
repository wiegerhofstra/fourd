// Server-only access to FourD CMS content, shaped for the website.
// The client, types, rich-text renderer and revalidation handler are generated into docs/cms/ by
// `npm run cms:docs`; they are imported from there so a refresh updates the integration directly.
import { CMS_ACCESS_TOKEN, CMS_CACHE_SECONDS, CMS_TENANT_SLUG, CMS_URL } from "astro:env/server";
import { CmsApiError, createCmsClient } from "../../docs/cms/client";
import { renderRichText } from "../../docs/cms/rich-text";
import { isExpandedEntry, modelSlugById, type DeliveryAsset, type DeliveryEntry } from "../../docs/cms/types";
import { localize, type Locale } from "./i18n";

export { CmsApiError };

export const cms = createCmsClient({ origin: CMS_URL, tenantSlug: CMS_TENANT_SLUG, token: CMS_ACCESS_TOKEN });

// --- Cache -------------------------------------------------------------------------------------
// The CMS answers with no-store, so caching is ours. Everything is keyed by request and dropped at
// once by the revalidation endpoint (src/pages/api/revalidate.ts) or after CMS_CACHE_SECONDS.
// Failed requests, including 404s, are never cached.

const cache = new Map<string, { expires: number; value: Promise<unknown> }>();

function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as Promise<T>;
  const value = load();
  cache.set(key, { expires: Date.now() + CMS_CACHE_SECONDS * 1000, value });
  value.catch(() => { if (cache.get(key)?.value === value) cache.delete(key); });
  return value;
}

export function invalidateCmsCache() {
  cache.clear();
}

// --- Field validation ----------------------------------------------------------------------------
// Delivery does not enforce field types, so every raw value is checked before use.

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function richText(value: unknown): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const html = renderRichText(value, { assetUrl: (asset) => mediaUrl(asset.id) });
  return html.replace(/<p>(<br>)?<\/p>/g, "").trim() || null;
}

function image(value: unknown): Image | null {
  if (!value || typeof value !== "object" || !("id" in value) || typeof value.id !== "string") return null;
  const raw = value as DeliveryAsset;
  if (typeof raw.mimeType !== "string" || !raw.mimeType.startsWith("image/")) return null;
  return { src: mediaUrl(raw.id), width: raw.imageWidth ?? undefined, height: raw.imageHeight ?? undefined };
}

/** A stable URL for an asset; src/pages/media/[assetId].ts resolves it to the file. */
export function mediaUrl(assetId: string) {
  return "/media/" + encodeURIComponent(assetId);
}

// --- Content -------------------------------------------------------------------------------------

export type Image = { src: string; width?: number; height?: number };
/** A CMS page. `href` is the page's URL on this site in the requested language. */
export type Page = { id: string; href: string; slug: string; title: string; cover: Image | null; content: string | null };
export type Service = { id: string; title: string; short: string | null; intro: string | null; page: Page | null };
export type MenuItem = { href: string; title: string };

function toPage(entry: unknown, locale: Locale): Page | null {
  if (!isExpandedEntry(entry) || modelSlugById[entry.modelId] !== "page" || !entry.url) return null;
  const title = text(entry.data.title);
  if (!title) return null;
  return {
    id: entry.id,
    href: localize(entry.url, locale),
    slug: text(entry.data.slug) ?? "",
    title,
    cover: image(entry.data.cover_image),
    content: richText(entry.data.content),
  };
}

function toService(entry: DeliveryEntry, locale: Locale): Service | null {
  const title = text(entry.data.title);
  if (!title) return null;
  return { id: entry.id, title, short: text(entry.data.short), intro: richText(entry.data.intro), page: toPage(entry.data.page, locale) };
}

async function all(model: string, locale: Locale, maxDepth: number) {
  const entries: DeliveryEntry[] = [];
  for await (const entry of cms.iterateEntries(model, { limit: 100, maxDepth, locale })) entries.push(entry);
  return entries;
}

/** Services in the order editors created them (the API returns newest first), with their linked page. */
export function getServices(locale: Locale): Promise<Service[]> {
  return cached("services:" + locale, async () => {
    const entries = await all("service", locale, 2);
    return entries
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((entry) => toService(entry, locale))
      .filter((service): service is Service => service !== null);
  });
}

/** Pages linked from the first menu in the CMS, in editor order. Empty when no menu is published. */
export function getMenu(locale: Locale): Promise<MenuItem[]> {
  return cached("menu:" + locale, async () => {
    const [menu] = await all("menu", locale, 2);
    const items = Array.isArray(menu?.data.items) ? menu.data.items : [];
    return items.flatMap((item): MenuItem[] => {
      const page = toPage(item, locale);
      return page ? [{ href: page.href, title: page.title }] : [];
    });
  });
}

export type Resolution = { kind: "page"; page: Page } | { kind: "redirect"; location: string } | { kind: "missing" };

/**
 * Resolves a CMS path (without the language prefix, e.g. "/maatwerk") to a page or a permanent
 * redirect. Unknown paths, and paths the CMS rejects as malformed, are "missing".
 */
export function resolvePath(path: string, locale: Locale): Promise<Resolution> {
  return cached(`resolve:${locale}:${path}`, async (): Promise<Resolution> => {
    const { data } = await cms.resolvePage(path, { locale });
    if (data.kind === "redirect") return { kind: "redirect", location: localize(data.location, locale) };
    const page = data.modelSlug === "page" ? toPage(data.entry, locale) : null;
    return page ? { kind: "page", page } : { kind: "missing" };
  }).catch((error: unknown): Resolution => {
    if (error instanceof CmsApiError && (error.status === 404 || error.status === 400)) return { kind: "missing" };
    throw error;
  });
}

/** The page's URL on this site in another language; slugs can be translated. */
export function getPageHref(id: string, locale: Locale): Promise<string | null> {
  return cached(`page-href:${locale}:${id}`, async () => {
    const { data } = await cms.getEntry("page", id, { locale });
    return data.url ? localize(data.url, locale) : null;
  });
}
