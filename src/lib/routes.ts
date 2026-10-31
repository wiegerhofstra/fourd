// Enumerate CMS pages and known legacy URLs for Astro's static build.
import { getPages, getServices, type Page, type Service } from "./cms";
import { locales, path, type Locale } from "./i18n";

export type PageProps = {
  page: Page;
  service: Service | null;
  otherServices: Service[];
  alternates: Partial<Record<Locale, string>>;
};

export type StaticPageProps = { pageProps: PageProps; redirect?: never } | { redirect: string; pageProps?: never };

export async function getPagePaths(locale: Locale) {
  const [pagesByLocale, services] = await Promise.all([
    Promise.all(locales.map(async (code) => [code, await getPages(code)] as const)),
    getServices(locale),
  ]);
  const pages = pagesByLocale.find(([code]) => code === locale)![1];
  const fixedPaths = new Set([
    ...(["home", "services", "work", "contact"] as const).map((key) => path(key, locale).replace(/\/$/, "")),
    locale === "nl" ? "/404" : "/en/404",
    ...(locale === "nl" ? ["/home"] : []),
  ]);
  const routes = new Map<string, StaticPageProps>();
  for (const page of pages) {
    const href = page.href.replace(/\/$/, "");
    if (fixedPaths.has(href)) continue;
    if (locale === "nl" && (href === "/en" || href.startsWith("/en/"))) {
      throw new Error(`CMS page conflicts with the English route namespace: ${href}`);
    }
    if (routes.has(href)) throw new Error(`Multiple CMS pages use ${href}`);
    const service = services.find((candidate) => candidate.page?.id === page.id) ?? null;
    const alternates: Partial<Record<Locale, string>> = {};
    for (const [code, translatedPages] of pagesByLocale) {
      const translated = translatedPages.find((candidate) => candidate.id === page.id);
      if (translated) alternates[code] = translated.href;
    }
    routes.set(href, { pageProps: {
      page, service, otherServices: service ? services.filter((other) => other.id !== service.id) : [], alternates,
    } });
  }
  // Preserve the former /diensten/<name> links without a runtime CMS resolver.
  if (locale === "nl") {
    for (const page of pages) {
      if (!/^\/[^/]+$/.test(page.href) || fixedPaths.has(page.href)) continue;
      const aliases = ["/diensten" + page.href];
      if (page.href === "/mobile-apps") aliases.push("/diensten/applicaties");
      for (const alias of aliases) {
        if (!routes.has(alias)) routes.set(alias, { redirect: page.href });
      }
    }
  }
  return [...routes].map(([href, props]) => ({
    params: { path: (locale === "en" ? href.slice(4) : href.slice(1)) },
    props,
  }));
}
