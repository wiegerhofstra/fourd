# Website copy for the CMS (NL + EN)

New copy for the FourD Software website, ready to paste into the CMS field by field.

**Positioning.** FourD Software is a software company. We build bespoke software, take on complete
full-stack systems (from database to app) and also make websites and mobile apps. The copy leads with
that, keeps the informal Dutch "je", avoids buzzwords ("naadloos", "nieuwste technologieën") and only
claims what the portfolio already shows.

## How the fields are used on the site

| Model | Field | Where it appears | Length |
|---|---|---|---|
| Service | `title` | Tile heading, page heading, "Andere diensten" | 1–3 words |
| Service | `short` | Text on the home and services tiles | 1 sentence, max ~120 characters |
| Service | `intro` | Large lead text at the top of the service page | 1–2 sentences |
| Service | `page` | Links the service to its page | – |
| Page | `title` | Menu item and fallback heading; keep it equal to the service title | – |
| Page | `slug` | URL; localized, so English can have its own slug | – |
| Page | `content` | Body text of the page (headings, lists, links) | – |

The rich-text blocks below use `##` for a heading (H2) and `-` / `1.` for lists. Paste them from a
rendered view (or type the headings with the editor's heading button) so the formatting carries over.

**Services in order.** Services are shown in the order they were created. Full-stack is new, so it
will appear last unless the CMS gets an order field.

1. Software op maat (existing, slug `maatwerk`)
2. Full-stack oplossingen (**new**: create a page and a service)
3. Automatisering (existing)
4. Websites (existing, slug `website`)
5. Mobiele apps (existing, slug `mobile-apps`)

---

## 1. Software op maat / Custom software

### Service

| Field | NL | EN |
|---|---|---|
| title | Software op maat | Custom software |
| short | Software die precies doet wat jouw organisatie nodig heeft, ook als er nog geen pakket voor bestaat. | Software that does exactly what your organisation needs, even when no off-the-shelf package exists. |

**intro, NL**

> Standaardsoftware dwingt je om je werk aan te passen aan het pakket. Wij draaien dat om: we bouwen software rond de manier waarop jij werkt, en zorgen dat die meegroeit met je organisatie.

**intro, EN**

> Off-the-shelf software makes you adapt your work to the package. We turn that around: we build software around the way you work, and make sure it grows with your organisation.

### Page

| Field | NL | EN |
|---|---|---|
| title | Software op maat | Custom software |
| slug | maatwerk *(keep; old links depend on it)* | custom-software |

**content, NL**

Soms bestaat de oplossing voor je probleem nog niet. Of het bestaande pakket is te duur, te log of past net niet bij hoe jullie werken. Dan is software op maat de beste keuze.

## Wat we bouwen

- Webapplicaties en portalen voor je klanten, medewerkers of partners
- Interne tools die spreadsheets en losse lijstjes vervangen
- Systemen voor registratie, planning, beheer en facturatie
- Koppelingen met de software die je al gebruikt

## Zo werken we

We beginnen met luisteren. Wat moet de software oplossen, wie gaat ermee werken en wat is het belangrijkste? Daarna bouwen we in korte stappen, zodat je snel iets werkends ziet en we samen kunnen bijsturen. Na de lancering blijven we betrokken voor onderhoud, beveiliging en nieuwe functies.

## Een voorbeeld

Voor eerstelijnsverblijfzorg bouwden we Iaso: een compleet EPD waarin veiligheid en gebruiksgemak voorop staan. Dankzij de volledige administratie en de AW319-koppeling factureer je met één druk op de knop direct naar VECOZO.

**content, EN**

Sometimes the solution to your problem doesn't exist yet. Or the existing package is too expensive, too heavy, or just doesn't fit the way you work. That's when custom software is the right choice.

## What we build

- Web applications and portals for your customers, staff or partners
- Internal tools that replace spreadsheets and scattered lists
- Systems for registration, planning, administration and invoicing
- Integrations with the software you already use

## How we work

We start by listening. What should the software solve, who will use it, and what matters most? Then we build in short iterations, so you see something working early and we can adjust together. After launch we stay involved for maintenance, security and new features.

## An example

For primary care stays we built Iaso: a complete electronic health record designed with safety and ease of use first. With full administration and the AW319 integration, you invoice VECOZO directly with a single click.

---

## 2. Full-stack oplossingen / Full-stack solutions (new)

Create a **page** first, then a **service** that links to it.

### Service

| Field | NL | EN |
|---|---|---|
| title | Full-stack oplossingen | Full-stack solutions |
| short | Van database tot app: we ontwerpen, bouwen en beheren het complete systeem, met één aanspreekpunt. | From database to app: we design, build and run the complete system, with a single point of contact. |

**intro, NL**

> Een goed product is meer dan een mooie interface. Wij nemen de hele keten voor onze rekening: de architectuur, de server en database, de koppelingen, de web- en mobiele apps en de hosting. Eén team dat het geheel overziet.

**intro, EN**

> A good product is more than a nice interface. We take care of the whole chain: the architecture, the server and database, the integrations, the web and mobile apps, and the hosting. One team that oversees it all.

### Page

| Field | NL | EN |
|---|---|---|
| title | Full-stack oplossingen | Full-stack solutions |
| slug | full-stack | full-stack |
| cover_image | *(new image needed)* | |

**content, NL**

Veel projecten lopen vast op de naden. Het ene bureau maakt de website, een ander de app en weer een ander beheert de server. Wij bouwen het hele systeem, zodat alle onderdelen op elkaar aansluiten en je één aanspreekpunt hebt.

## Wat we voor je regelen

- **Architectuur:** een opzet die past bij je doelen, je budget en de groei die je verwacht
- **Backend en API's:** de logica, de database en de koppelingen met andere systemen
- **Frontend:** heldere web- en mobiele interfaces die prettig werken op elk apparaat
- **Hosting en beheer:** veilige, schaalbare hosting met back-ups en monitoring
- **Doorontwikkeling:** updates, beveiliging en nieuwe functies na de lancering

## Waarom één partij

Omdat we alle lagen zelf bouwen, weten we precies hoe alles samenwerkt. Daardoor lossen we problemen sneller op, maken we betere afwegingen en voegen we nieuwe functies toe zonder dat het geheel uit elkaar valt.

## Een voorbeeld

Samen met Kummer & Herrman en Waxle maakten we voor de AkzoNobel Art Foundation zowel de applicatie om de collectie te beheren als de interactieve online tool waarmee iedereen de collectie kan verkennen.

**content, EN**

Many projects get stuck at the seams. One agency builds the website, another the app, and yet another runs the server. We build the whole system, so every part fits together and you have a single point of contact.

## What we take care of

- **Architecture:** a setup that fits your goals, your budget and the growth you expect
- **Backend and APIs:** the logic, the database and the integrations with other systems
- **Frontend:** clear web and mobile interfaces that work well on any device
- **Hosting and operations:** secure, scalable hosting with backups and monitoring
- **Ongoing development:** updates, security and new features after launch

## Why one partner

Because we build every layer ourselves, we know exactly how everything works together. That means we solve problems faster, make better trade-offs, and add new features without the whole thing falling apart.

## An example

Together with Kummer & Herrman and Waxle, we built both the collection management application for the AkzoNobel Art Foundation and the interactive online tool that lets anyone explore the collection.

---

## 3. Automatisering / Automation

### Service

| Field | NL | EN |
|---|---|---|
| title | Automatisering | Automation |
| short | We automatiseren terugkerend werk en koppelen je systemen, zodat je tijd overhoudt voor wat ertoe doet. | We automate recurring work and connect your systems, so you have time for what matters. |

**intro, NL**

> Gegevens overtypen, lijstjes bijwerken, elke maand dezelfde rapportage maken: het kost tijd en het gaat makkelijk mis. Wij zoeken uit wat er slimmer kan en laten software het werk doen.

**intro, EN**

> Retyping data, updating lists, producing the same report every month: it takes time and it's easy to get wrong. We find out what can be done smarter and let software do the work.

### Page

| Field | NL | EN |
|---|---|---|
| title | Automatisering | Automation |
| slug | automatisering | automation |

**content, NL**

Bijna elke organisatie heeft taken die dagelijks, wekelijks of maandelijks terugkomen. Ze zijn niet moeilijk, maar wel tijdrovend en foutgevoelig. Door ze te automatiseren win je tijd, worden je processen voorspelbaar en verklein je de kans op fouten.

## Wat we automatiseren

- Koppelingen tussen systemen, zodat niemand meer gegevens hoeft over te typen
- Rapportages en overzichten die zichzelf bijwerken
- Facturatie, bestellingen en andere administratieve stromen
- Meldingen en controles, zodat er geen stap wordt overgeslagen

## Zo pakken we het aan

1. **Inventariseren:** samen brengen we in kaart waar de tijd en de fouten zitten.
2. **Advies:** soms is een bestaand pakket of een kleine aanpassing genoeg. Dan zeggen we dat ook.
3. **Bouwen:** waar nodig ontwikkelen we een oplossing op maat die precies past bij jouw situatie.
4. **Evalueren:** we kijken samen of de automatisering doet wat ze belooft, en verbeteren waar nodig.

**content, EN**

Almost every organisation has tasks that come back daily, weekly or monthly. They aren't difficult, but they are time-consuming and error-prone. Automating them saves time, makes your processes predictable and reduces the chance of mistakes.

## What we automate

- Integrations between systems, so nobody has to retype data
- Reports and overviews that update themselves
- Invoicing, orders and other administrative flows
- Notifications and checks, so no step gets skipped

## How we approach it

1. **Map it out:** together we find where the time goes and where mistakes happen.
2. **Advise:** sometimes an existing package or a small change is enough. If so, we'll tell you.
3. **Build:** where needed, we develop a custom solution that fits your situation exactly.
4. **Evaluate:** together we check that the automation does what it promised, and improve it where needed.

---

## 4. Websites

### Service

| Field | NL | EN |
|---|---|---|
| title | Websites | Websites |
| short | Snelle, toegankelijke websites die goed gevonden worden en die je eenvoudig zelf beheert. | Fast, accessible websites that are easy to find and easy to manage yourself. |

**intro, NL**

> Je website is vaak het eerste wat mensen van je zien. Wij maken websites die snel laden, op elk scherm goed werken en die je zelf eenvoudig bijhoudt.

**intro, EN**

> Your website is often the first thing people see of you. We build websites that load fast, work well on every screen, and are easy to keep up to date yourself.

### Page

| Field | NL | EN |
|---|---|---|
| title | Websites | Websites |
| slug | website *(keep; old links depend on it)* | websites |

**content, NL**

Een website maken is tegenwoordig eenvoudig. Een website maken die snel is, goed gevonden wordt en jaren meegaat, is een vak. Wij combineren een goed ontwerp met degelijke techniek.

## Wat je van ons kunt verwachten

- Een ontwerp dat past bij je organisatie en je boodschap
- Snel en prettig in gebruik op telefoon, tablet en desktop
- Toegankelijk voor iedereen, ook voor mensen met een beperking
- Goed vindbaar in Google dankzij een nette technische basis
- Een CMS waarmee je zelf teksten, pagina's en afbeeldingen aanpast
- Meertalig als dat nodig is

## Meer dan een visitekaartje

Moet je website ook iets dóén, zoals afspraken plannen, aanvragen verwerken of gegevens uit je eigen systemen tonen? Omdat we ook software op maat bouwen, koppelen we je website aan de systemen die je al gebruikt.

**content, EN**

Building a website is easy these days. Building one that's fast, easy to find and lasts for years is a craft. We combine good design with solid engineering.

## What you can expect

- A design that fits your organisation and your message
- Fast and pleasant to use on phone, tablet and desktop
- Accessible to everyone, including people with disabilities
- Easy to find in Google, thanks to a clean technical foundation
- A CMS that lets you edit text, pages and images yourself
- Multilingual when you need it

## More than a business card

Does your website also need to *do* something, like schedule appointments, handle requests or show data from your own systems? Because we also build custom software, we connect your website to the systems you already use.

---

## 5. Mobiele apps / Mobile apps

### Service

| Field | NL | EN |
|---|---|---|
| title | Mobiele apps | Mobile apps |
| short | Apps voor iOS en Android die je klanten en medewerkers onderweg met je organisatie verbinden. | Apps for iOS and Android that connect your customers and staff to your organisation on the go. |

**intro, NL**

> Een app brengt je dienst naar de broekzak van je klant of medewerker. Wij begeleiden het hele traject: van het eerste idee en het ontwerp tot de lancering in de App Store en Google Play.

**intro, EN**

> An app puts your service in the pocket of your customers and staff. We guide the whole journey: from the first idea and the design to the launch in the App Store and Google Play.

### Page

| Field | NL | EN |
|---|---|---|
| title | Mobiele apps | Mobile apps |
| slug | mobile-apps | mobile-apps |

**content, NL**

Een goede app voelt eenvoudig, maar daar gaat veel denkwerk aan vooraf. Wat moet de app doen, voor wie, en hoe sluit hij aan op je bestaande systemen? Die vragen beantwoorden we samen, voordat we gaan bouwen.

## Wat we doen

- Functioneel ontwerp en prototypes, zodat je vroeg ziet hoe de app gaat werken
- Ontwikkeling voor iOS en Android
- De backend en koppelingen die de app nodig heeft
- Publicatie in de App Store en Google Play
- Onderhoud en updates voor nieuwe versies van iOS en Android

## Van idee tot lancering

We werken in korte stappen en laten je regelmatig de nieuwste versie uitproberen. Zo weet je altijd waar je aan toe bent en kun je bijsturen voordat de app live gaat.

**content, EN**

A good app feels simple, but a lot of thinking goes into it first. What should the app do, for whom, and how does it connect to your existing systems? We answer those questions together, before we start building.

## What we do

- Functional design and prototypes, so you see early on how the app will work
- Development for iOS and Android
- The backend and integrations the app needs
- Publishing in the App Store and Google Play
- Maintenance and updates for new versions of iOS and Android

## From idea to launch

We work in short iterations and regularly let you try the latest version. That way you always know where you stand, and you can steer before the app goes live.

---

## Check before publishing

- **Hosting and operations** (Full-stack): only keep "hosting met back-ups en monitoring" if FourD offers it.
- **Accessibility** (Websites): only keep the accessibility line if you build to WCAG.
- **Cover image** for the new Full-stack page.
- **Clean-up:** the existing service entries still contain old `slug` and `content` values from an earlier schema. The site ignores them, but you can clear them.
- **English slugs:** once the English slugs are filled in, the English pages move to `/en/custom-software`, `/en/automation` and `/en/websites`.

## Site text that lives in the code (not in the CMS)

These texts are in `src/lib/i18n.ts`. Suggested updates in the same voice (I can apply them):

| Key | NL | EN |
|---|---|---|
| hero.body | FourD Software bouwt software op maat. Van een slimme koppeling tot een compleet platform: we ontwerpen, bouwen en onderhouden het hele systeem, van database tot app. En ja, ook je website. | FourD Software builds bespoke software. From a smart integration to a complete platform, we design, build and maintain the whole system, from database to app. And yes, your website too. |
| services.intro | Elke organisatie werkt anders. Daarom beginnen we niet bij een pakket, maar bij jouw vraag. Of het nu gaat om één slimme koppeling of een compleet systeem: we bouwen precies wat je nodig hebt. | Every organisation works differently. So we don't start with a package, we start with your question. Whether it's one smart integration or a complete system, we build exactly what you need. |
| contact.intro | Heb je een idee voor een applicatie, wil je werk automatiseren of is je website aan vervanging toe? Vertel ons waar je tegenaan loopt. We denken graag mee, ook als je nog niet precies weet wat je nodig hebt. | Have an idea for an application, want to automate work, or is your website due for replacement? Tell us what you're running into. We're happy to think along, even if you don't know exactly what you need yet. |
| meta.description | FourD Software bouwt software op maat: van automatisering en koppelingen tot complete full-stack systemen, websites en mobiele apps. | FourD Software builds bespoke software: from automation and integrations to complete full-stack systems, websites and mobile apps. |
