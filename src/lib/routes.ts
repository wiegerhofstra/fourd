// Routing for CMS pages, shared by the Dutch and English catch-all routes.
import { getPageHref, getServices, resolvePath, type Page, type Service } from "./cms";
import { locales, type Locale } from "./i18n";

export type PageProps = {
  page: Page;
  /** The service that links to this page, if any: the page is then shown as a service page. */
  service: Service | null;
  otherServices: Service[];
  alternates: Partial<Record<Locale, string>>;
};

export type Loaded = { status: 200; props: PageProps } | { status: 308; location: string } | { status: 404 | 503 };

// The previous site served services at /diensten/<name>; they now live at the CMS page's own URL.
const legacyServicePrefix = /^\/diensten\/([^/]+)$/;
const legacyServiceAliases: Record<string, string> = { applicaties: "mobile-apps" };

/** Paths of the same page in each language; slugs can be translated, so they are looked up by ID. */
async function alternatesFor(page: Page, locale: Locale) {
  const alternates: Partial<Record<Locale, string>> = { [locale]: page.href };
  await Promise.all(locales.filter((code) => code !== locale).map(async (code) => {
    try {
      const href = await getPageHref(page.id, code);
      if (href) alternates[code] = href;
    } catch (error) {
      console.error("[cms] Translated page URL unavailable", error);
    }
  }));
  return alternates;
}

/** Resolves a request path without its language prefix, e.g. "/maatwerk" for /en/maatwerk. */
export async function loadPage(path: string, locale: Locale): Promise<Loaded> {
  try {
    const resolution = await resolvePath(path, locale);

    const legacy = resolution.kind === "missing" && locale === "nl" ? legacyServicePrefix.exec(path) : null;
    if (legacy) {
      const name = legacy[1]!;
      const target = await resolvePath("/" + (legacyServiceAliases[name] ?? name), locale);
      if (target.kind === "page") return { status: 308, location: target.page.href };
      if (target.kind === "redirect") return { status: 308, location: target.location };
    }

    if (resolution.kind === "redirect") return { status: 308, location: resolution.location };
    if (resolution.kind === "missing") return { status: 404 };

    const { page } = resolution;
    const [services, alternates] = await Promise.all([getServices(locale), alternatesFor(page, locale)]);
    const service = services.find((candidate) => candidate.page?.id === page.id) ?? null;
    return {
      status: 200,
      props: { page, service, otherServices: service ? services.filter((other) => other.id !== service.id) : [], alternates },
    };
  } catch (error) {
    console.error("[cms] Page unavailable", error);
    return { status: 503 };
  }
}

/** The CMS path for a catch-all route parameter: "/" plus the segments, with no trailing slash. */
export function cmsPath(param: string | undefined) {
  return "/" + (param ?? "").replace(/^\/+|\/+$/g, "");
}
