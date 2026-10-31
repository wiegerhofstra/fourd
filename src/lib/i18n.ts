// Interface text and localized routes. CMS content is translated in the CMS itself;
// untranslated fields fall back to Dutch there.

export const locales = ["nl", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "nl";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

/** Route keys map to the path of each fixed section per language. Dutch paths match the previous site. */
const routes = {
  home: { nl: "/", en: "/en/" },
  services: { nl: "/diensten", en: "/en/services" },
  work: { nl: "/ons-werk", en: "/en/work" },
  contact: { nl: "/contact", en: "/en/contact" },
} as const;
export type RouteKey = keyof typeof routes;

export function path(route: RouteKey, locale: Locale) {
  return routes[route][locale];
}

/** English pages live under /en; the CMS returns page paths without a language prefix. */
const prefixes: Record<Locale, string> = { nl: "", en: "/en" };

/** Turns a CMS page path ("/maatwerk") into this site's URL for the language ("/en/maatwerk"). */
export function localize(cmsPath: string, locale: Locale) {
  const prefix = prefixes[locale];
  return prefix && cmsPath === "/" ? prefix + "/" : prefix + cmsPath;
}

export const company = {
  name: "FourD Software",
  email: "info@fourdsoftware.com",
  phone: "+31 641 525 515",
  phoneHref: "tel:+31641525515",
  street: "De Remize 26",
  postalCode: "9051 WB",
  city: "Stiens",
  mapsHref: "https://www.google.com/maps/search/?api=1&query=De+Remize+26%2C+9051+WB+Stiens",
  kvk: "52379787",
  linkedin: "https://www.linkedin.com/company/fourd-software",
};

const dictionary = {
  nl: {
    "meta.description": "FourD Software denkt met je mee over software. Wij bouwen maatwerk, automatiseren processen en maken websites en mobiele apps. Altijd een passende oplossing.",
    "nav.label": "Hoofdmenu",
    "nav.home": "Home",
    "nav.services": "Diensten",
    "nav.work": "Ons werk",
    "nav.contact": "Contact",
    "nav.menu": "Menu",
    "nav.language": "Taal",
    "nav.skip": "Naar de inhoud",
    "hero.lead": "Altijd een",
    "hero.phrases": ["passende oplossing.", "duidelijk verhaal.", "goed advies.", "betrouwbare partner."],
    "hero.body": "Bij FourD Software denken we met je mee. We bouwen software op maat, automatiseren je terugkerende werk en maken websites en apps die doen wat ze moeten doen.",
    "hero.primary": "Vertel ons je idee",
    "hero.secondary": "Bekijk onze diensten",
    "services.title": "Hier kunnen we je mee helpen",
    "services.more": "Lees meer over",
    "services.all": "Alle diensten",
    "services.intro": "Om te kunnen groeien heeft je bedrijf software nodig. Soms bestaat die software niet, is ze veel te duur of gewoon niet goed genoeg. Wij denken met je mee en ontwikkelen precies wat je nodig hebt.",
    "services.empty": "Er zijn nog geen diensten gepubliceerd. Bekijk het later opnieuw of neem direct contact met ons op.",
    "service.cta": "Wat wil je door ons laten maken?",
    "service.ctaBody": "Vertel ons wat je in gedachten hebt. We denken mee over de aanpak en laten weten wat mogelijk is.",
    "service.other": "Andere diensten",
    "work.title": "Ons werk",
    "work.intro": "We hebben de afgelopen jaren aan veel mooie projecten mogen werken. Hier een paar voorbeelden.",
    "work.with": "In samenwerking met",
    "work.highlight": "Een greep uit ons werk",
    "work.all": "Bekijk al ons werk",
    "contact.title": "Contact",
    "contact.heading": "Vertel ons wat je wilt maken.",
    "contact.intro": "Wil je iets automatiseren? Een nieuwe website nodig? Heb je een idee voor een app, of een andere vraag? We gaan graag met je in gesprek.",
    "contact.call": "Bel ons",
    "contact.mail": "Mail ons",
    "contact.visit": "Kom langs",
    "contact.response": "Je hoort snel van ons.",
    "contact.registration": "KvK-nummer",
    "footer.rights": "Alle rechten voorbehouden.",
    "error.title": "Deze pagina bestaat niet",
    "error.body": "De link is misschien verouderd of de pagina is verplaatst. Ga terug naar de homepage of bekijk onze diensten.",
    "error.home": "Naar de homepage",
    "error.unavailable": "Deze pagina is tijdelijk niet beschikbaar",
    "error.cms": "De inhoud kon niet worden geladen. Probeer het over een paar minuten opnieuw.",
  },
  en: {
    "meta.description": "FourD Software thinks along with you about software. We build custom applications, automate processes, and make websites and mobile apps. Always a solution that fits.",
    "nav.label": "Main menu",
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.work": "Our work",
    "nav.contact": "Contact",
    "nav.menu": "Menu",
    "nav.language": "Language",
    "nav.skip": "Skip to content",
    "hero.lead": "Always",
    "hero.phrases": ["a solution that fits.", "a clear story.", "good advice.", "a reliable partner."],
    "hero.body": "At FourD Software we think along with you. We build custom software, automate your recurring work, and make websites and apps that do what they should.",
    "hero.primary": "Tell us your idea",
    "hero.secondary": "See our services",
    "services.title": "What we can help you with",
    "services.more": "Read more about",
    "services.all": "All services",
    "services.intro": "To grow, your business needs software. Sometimes that software doesn't exist, costs far too much, or simply isn't good enough. We think along with you and build exactly what you need.",
    "services.empty": "No services have been published yet. Check back later or contact us directly.",
    "service.cta": "What would you like us to build?",
    "service.ctaBody": "Tell us what you have in mind. We'll think through the approach with you and tell you what's possible.",
    "service.other": "Other services",
    "work.title": "Our work",
    "work.intro": "Over the past years we've worked on many great projects. Here are a few examples.",
    "work.with": "In collaboration with",
    "work.highlight": "A selection of our work",
    "work.all": "See all our work",
    "contact.title": "Contact",
    "contact.heading": "Tell us what you want to build.",
    "contact.intro": "Want to automate something? Need a new website? Have an idea for an app, or another question? We'd love to talk.",
    "contact.call": "Call us",
    "contact.mail": "Email us",
    "contact.visit": "Visit us",
    "contact.response": "You'll hear from us soon.",
    "contact.registration": "Chamber of Commerce (KvK)",
    "footer.rights": "All rights reserved.",
    "error.title": "This page doesn't exist",
    "error.body": "The link may be outdated or the page has moved. Go back to the homepage or see our services.",
    "error.home": "Go to the homepage",
    "error.unavailable": "This page is temporarily unavailable",
    "error.cms": "The content couldn't be loaded. Try again in a few minutes.",
  },
} as const;

type Dictionary = (typeof dictionary)["nl"];

export function useTranslations(locale: Locale) {
  return <K extends keyof Dictionary>(key: K): (typeof dictionary)[Locale][K] => dictionary[locale][key];
}
