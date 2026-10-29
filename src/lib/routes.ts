// Data for the CMS-driven routes, shared by the Dutch and English route files.
import { getPage, getPages, getService, getServices, type Page, type Service } from "./cms";
import { locales, path, type Locale } from "./i18n";

export type Loaded<T> = { status: 200; props: T } | { status: 404 | 503 };

/** Paths of the same entry in each language; slugs can be translated, so they are matched by entry ID. */
async function alternatesFor<T extends { id: string; slug: string }>(id: string, list: (locale: Locale) => Promise<T[]>, route: "service" | "page") {
  const alternates: Partial<Record<Locale, string>> = {};
  await Promise.all(locales.map(async (code) => {
    const match = (await list(code)).find((item) => item.id === id);
    if (match) alternates[code] = path(route, code, match.slug);
  }));
  return alternates;
}

export async function loadService(slug: string | undefined, locale: Locale): Promise<Loaded<{ service: Service; cover: Page["cover"]; others: Service[]; alternates: Partial<Record<Locale, string>> }>> {
  if (!slug) return { status: 404 };
  try {
    const service = await getService(slug, locale);
    if (!service) return { status: 404 };
    const [services, page, alternates] = await Promise.all([getServices(locale), getPage(slug, locale), alternatesFor(service.id, getServices, "service")]);
    return { status: 200, props: { service, cover: page?.cover ?? null, others: services.filter((other) => other.id !== service.id), alternates } };
  } catch (error) {
    console.error("[cms] Service unavailable", error);
    return { status: 503 };
  }
}

export async function loadPage(slug: string | undefined, locale: Locale): Promise<Loaded<{ page: Page; alternates: Partial<Record<Locale, string>> }>> {
  if (!slug) return { status: 404 };
  try {
    const page = await getPage(slug, locale);
    if (!page) return { status: 404 };
    return { status: 200, props: { page, alternates: await alternatesFor(page.id, getPages, "page") } };
  } catch (error) {
    console.error("[cms] Page unavailable", error);
    return { status: 503 };
  }
}
