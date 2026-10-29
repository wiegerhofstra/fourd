// Server-only access to FourD CMS content, shaped for the website.
// client.ts, types.ts, rich-text.ts and revalidation.ts are copied unchanged from the CMS export
// (cms-fourd-integration/); regenerate them when the CMS schema hash changes.
import { CMS_ACCESS_TOKEN, CMS_CACHE_SECONDS, CMS_TENANT_SLUG, CMS_URL } from "astro:env/server";
import { createCmsClient } from "./client";
import { renderRichText } from "./rich-text";
import { isExpandedEntry, modelSlugById, type DeliveryAsset, type DeliveryEntry } from "./types";
import type { Locale } from "../i18n";

export { CmsApiError } from "./client";

export const cms = createCmsClient({ origin: CMS_URL, tenantSlug: CMS_TENANT_SLUG, token: CMS_ACCESS_TOKEN });

// --- Cache -------------------------------------------------------------------------------------
// The CMS answers with no-store, so caching is ours. Everything is keyed by request and dropped at
// once by the revalidation endpoint (src/pages/api/revalidate.ts) or after CMS_CACHE_SECONDS.

const cache = new Map<string, { expires: number; value: Promise<unknown> }>();

function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as Promise<T>;
  const value = load();
  cache.set(key, { expires: Date.now() + CMS_CACHE_SECONDS * 1000, value });
  // Never keep a failed request around; the next visit tries again.
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

function asset(value: unknown): Image | null {
  if (!value || typeof value !== "object" || !("id" in value) || typeof value.id !== "string") return null;
  const raw = value as DeliveryAsset;
  if (typeof raw.mimeType !== "string" || !raw.mimeType.startsWith("image/")) return null;
  return { src: mediaUrl(raw.id), width: raw.imageWidth ?? undefined, height: raw.imageHeight ?? undefined };
}

/** A stable URL for an asset; src/pages/media/[assetId].ts resolves it to the file. */
export function mediaUrl(assetId: string) {
  return "/media/" + encodeURIComponent(assetId);
}

const looksLikeUrl = (value: string) => /^https?:\/\//i.test(value);

// --- Content -------------------------------------------------------------------------------------

export type Image = { src: string; width?: number; height?: number };
export type Service = { id: string; slug: string; title: string; short: string | null; intro: string | null; content: string | null };
export type Page = { id: string; slug: string; title: string; cover: Image | null; content: string | null };
export type MenuItem = { slug: string; title: string };

async function all<M extends string>(model: M, locale: Locale, maxDepth = 1) {
  const entries: DeliveryEntry[] = [];
  for await (const entry of cms.iterateEntries(model, { limit: 100, maxDepth, locale })) entries.push(entry);
  return entries;
}

function toService(entry: DeliveryEntry): Service | null {
  const slug = text(entry.data.slug);
  const title = text(entry.data.title);
  // An entry without a slug cannot be linked, and a URL in the title is an editing mistake.
  if (!slug || !title || looksLikeUrl(title)) {
    console.warn(`[cms] Skipping service ${entry.id}: it needs a slug and a title.`);
    return null;
  }
  return { id: entry.id, slug, title, short: text(entry.data.short), intro: richText(entry.data.intro), content: richText(entry.data.content) };
}

function toPage(entry: DeliveryEntry): Page | null {
  const slug = text(entry.data.slug);
  const title = text(entry.data.title);
  if (!slug || !title) return null;
  return { id: entry.id, slug, title, cover: asset(entry.data.cover_image), content: richText(entry.data.content) };
}

/** Services in the order editors created them (the API returns newest first). */
export function getServices(locale: Locale): Promise<Service[]> {
  return cached("services:" + locale, async () => {
    const entries = await all("service", locale);
    return entries
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map(toService)
      .filter((service): service is Service => service !== null);
  });
}

export async function getService(slug: string, locale: Locale): Promise<Service | null> {
  const services = await getServices(locale);
  return services.find((service) => service.slug === slug) ?? null;
}

export function getPages(locale: Locale): Promise<Page[]> {
  return cached("pages:" + locale, async () => (await all("page", locale)).map(toPage).filter((page): page is Page => page !== null));
}

export async function getPage(slug: string, locale: Locale): Promise<Page | null> {
  const pages = await getPages(locale);
  return pages.find((page) => page.slug === slug) ?? null;
}

/** Pages linked from the first menu in the CMS, in editor order. Empty when no menu is published. */
export function getMenu(locale: Locale): Promise<MenuItem[]> {
  return cached("menu:" + locale, async () => {
    const [menu] = await all("menu", locale, 2);
    const items = Array.isArray(menu?.data.items) ? menu.data.items : [];
    return items.flatMap((item): MenuItem[] => {
      if (!isExpandedEntry(item) || modelSlugById[item.modelId] !== "page") return [];
      const page = toPage(item);
      return page ? [{ slug: page.slug, title: page.title }] : [];
    });
  });
}
