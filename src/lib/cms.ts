// Build-time access to FourD CMS content, shaped for the static website.
// The client, types and rich-text renderer are generated into docs/cms/ by
// `npm run cms:docs`; they are imported from there so a refresh updates the integration directly.
import { CMS_ACCESS_TOKEN, CMS_TENANT_SLUG, CMS_URL } from "astro:env/server";
import { createCmsClient } from "../../docs/cms/client";
import { renderRichText, safeHref } from "../../docs/cms/rich-text";
import { isExpandedEntry, modelSlugById, type DeliveryAsset, type DeliveryEntry } from "../../docs/cms/types";
import { localize, type Locale } from "./i18n";

export const cms = createCmsClient({ origin: CMS_URL, tenantSlug: CMS_TENANT_SLUG, token: CMS_ACCESS_TOKEN });

// --- Cache -------------------------------------------------------------------------------------
// Share one content snapshot per locale throughout a build. In development, refresh after five
// seconds so editor changes are visible without restarting Astro. Failures must stop the build.

const cache = new Map<string, { expires: number; value: Promise<unknown> }>();

function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  const hit = cache.get(key);
  if (hit && hit.expires > Date.now()) return hit.value as Promise<T>;
  const value = load();
  cache.set(key, { expires: Date.now() + (import.meta.env.DEV ? 5000 : Infinity), value });
  value.catch(() => { if (cache.get(key)?.value === value) cache.delete(key); });
  return value;
}

// --- Field validation ----------------------------------------------------------------------------
// Delivery does not enforce field types, so every raw value is checked before use.

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function richText(value: unknown): string | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  // Assets and asset links use the CMS's stable file URLs.
  const html = renderRichText(value);
  return html.replace(/<p>(<br>)?<\/p>/g, "").trim() || null;
}

function image(value: unknown): Image | null {
  if (!value || typeof value !== "object" || !("id" in value) || typeof value.id !== "string") return null;
  const raw = value as DeliveryAsset;
  if (typeof raw.mimeType !== "string" || !raw.mimeType.startsWith("image/")) return null;
  const src = safeHref(raw.url);
  if (!src) return null;
  return { src, width: raw.imageWidth ?? undefined, height: raw.imageHeight ?? undefined };
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

/** Visit nested components and rich text as well as top-level fields. */
function visit(value: unknown, fn: (record: Record<string, unknown>) => void) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    value.forEach((child) => visit(child, fn));
    return;
  }
  const record = value as Record<string, unknown>;
  fn(record);
  Object.values(record).forEach((child) => visit(child, fn));
}

function snapshot(locale: Locale) {
  return cached("snapshot:" + locale, async () => {
    const [pages, services, menus] = await Promise.all([
      all("page", locale, 1), all("service", locale, 2), all("menu", locale, 2),
    ]);
    const pageEntries = new Map<string, DeliveryEntry>();
    visit([pages, services, menus], (record) => {
      // Collections omit component children; service and menu expansions include those pages.
      if (isExpandedEntry(record) && modelSlugById[record.modelId] === "page") {
        pageEntries.set(record.id, record);
      }
    });
    return { pageEntries: [...pageEntries.values()], services, menus };
  });
}

/** Enumerate every published page, including pages nested in services and menus. */
export async function getPages(locale: Locale): Promise<Page[]> {
  return (await snapshot(locale)).pageEntries.flatMap((entry) => {
    const page = toPage(entry, locale);
    if (entry.url && !page) throw new Error(`CMS page ${entry.id} is missing a usable title`);
    return page ? [page] : [];
  });
}

/** Services in the order editors created them (the API returns newest first), with their linked page. */
export function getServices(locale: Locale): Promise<Service[]> {
  return cached("services:" + locale, async () => {
    const { services: entries } = await snapshot(locale);
    return entries
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((entry) => toService(entry, locale))
      .filter((service): service is Service => service !== null);
  });
}

/** Pages linked from the first menu in the CMS, in editor order. Empty when no menu is published. */
export function getMenu(locale: Locale): Promise<MenuItem[]> {
  return cached("menu:" + locale, async () => {
    const { menus: [menu] } = await snapshot(locale);
    const items = Array.isArray(menu?.data.items) ? menu.data.items : [];
    return items.flatMap((item): MenuItem[] => {
      const page = toPage(item, locale);
      return page ? [{ href: page.href, title: page.title }] : [];
    });
  });
}
