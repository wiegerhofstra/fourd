// Portfolio projects. These are not in the CMS yet; add a "project" model there to let editors manage them.
import type { ImageMetadata } from "astro";
import akzonobel from "../assets/work/akzonobel-art-foundation.jpg";
import zorgOpDeKaart from "../assets/work/zorg-op-de-kaart.jpg";
import iaso from "../assets/work/iaso.jpg";
import type { Locale } from "./i18n";

export type Project = {
  name: string;
  image: ImageMetadata;
  description: Record<Locale, string>;
  partners: string[];
};

export const projects: Project[] = [
  {
    name: "AkzoNobel Art Foundation",
    image: akzonobel,
    description: {
      nl: "Een applicatie voor het beheren van de collectie, en een interactieve online tool om de grote collectie werken van internationaal gerenommeerde kunstenaars en jong talent te verkennen en te ontdekken.",
      en: "An application for managing the collection, and an interactive online tool for exploring and discovering the large collection of works by internationally renowned artists and young talent.",
    },
    partners: ["Kummer & Herrman", "Waxle"],
  },
  {
    name: "Zorg op de kaart",
    image: zorgOpDeKaart,
    description: {
      nl: "Een oplossing die visueel inzicht geeft in zorg en zorggerelateerde gegevens.",
      en: "A solution that gives visual insight into healthcare and healthcare-related data.",
    },
    partners: ["Ministerie van Volksgezondheid, Welzijn en Sport", "TNO"],
  },
  {
    name: "Iaso",
    image: iaso,
    description: {
      nl: "Een compleet EPD voor eerstelijnsverblijfzorg, waarbij veiligheid en gebruiksgemak voorop staan. Dankzij de volledige administratie en integratie van AW319 factureer je met één druk op de knop direct naar VECOZO.",
      en: "A complete electronic health record for primary care stays, built with safety and ease of use first. Full administration and AW319 integration let you invoice VECOZO directly with a single click.",
    },
    partners: [],
  },
];
