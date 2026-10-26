/* Assembles a full page (head + body) for one language. Called by the Vite
 * plugin in vite.config.js for "/" (French) and "/en/" (English), so both
 * versions are real pre-rendered HTML for search engines. */

import fr from '../content/fr.js';
import en from '../content/en.js';
import { business } from '../content/business.js';
import { esc } from './utils.js';
import { header, mobileBar } from './sections/header.js';
import { hero } from './sections/hero.js';
import { services, tape } from './sections/services.js';
import { why } from './sections/why.js';
import { how } from './sections/how.js';
import { fleet } from './sections/fleet.js';
import { area } from './sections/area.js';
import { reviews, faq } from './sections/reviews-faq.js';
import { booking } from './sections/booking.js';
import { contact, footer } from './sections/contact.js';

const LANGS = { fr, en };

/** LocalBusiness / MovingCompany structured data for Google. */
function structuredData(t) {
  const url = business.siteUrl;
  const a = business.address;
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'MovingCompany',
        '@id': `${url}/#business`,
        name: business.name,
        url: `${url}${t.path}`,
        image: `${url}/og-image.jpg`,
        logo: `${url}/favicon.svg`,
        description: t.meta.description,
        telephone: business.phones.main.tel,
        address: {
          '@type': 'PostalAddress',
          streetAddress: a.street.replace(',', ''), // "10871 avenue Salk"
          addressLocality: a.city,
          addressRegion: a.region,
          postalCode: a.postalCode,
          addressCountry: a.country,
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: business.hours.days,
            opens: business.hours.opens,
            closes: business.hours.closes,
          },
        ],
        areaServed: [
          { '@type': 'City', name: 'Montréal' },
          { '@type': 'City', name: 'Laval' },
          { '@type': 'Place', name: 'Montréal-Nord' },
        ],
        contactPoint: [
          { '@type': 'ContactPoint', telephone: business.phones.main.tel, contactType: 'customer service', availableLanguage: ['French', 'English'], areaServed: 'CA-QC' },
          { '@type': 'ContactPoint', telephone: business.phones.alt.tel, contactType: 'customer service', availableLanguage: ['French', 'English'], areaServed: 'CA-QC' },
        ],
        sameAs: [business.facebook],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: t.services.title,
          itemListElement: t.services.items.map((s) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: s.title, description: s.text, areaServed: ['Montréal', 'Laval'] },
          })),
        },
      },
      {
        '@type': 'FAQPage',
        inLanguage: t.locale,
        mainEntity: t.faq.items.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

/** Strings the browser scripts need (form messages, map checker, 3D labels). */
function runtimeStrings(t) {
  return JSON.stringify({
    lang: t.lang,
    path: t.path,
    booking: t.booking,
    area: t.area,
    hero: { hudPhases: t.hero.hudPhases, stamp: t.hero.stamp },
    how: t.how.box,
    fleetNames: Object.fromEntries(Object.entries(t.fleet.trucks).map(([k, v]) => [k, v.name])),
    phone: business.phones.main,
    callbackDays: business.callbackBusinessDays,
  }).replace(/</g, '\\u003c');
}

export function renderPage(lang) {
  const t = LANGS[lang];
  const other = lang === 'fr' ? en : fr;
  const url = business.siteUrl;

  const head = `
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(t.meta.title)}</title>
<meta name="description" content="${esc(t.meta.description)}">
<link rel="canonical" href="${url}${t.path}">
<link rel="alternate" hreflang="fr-CA" href="${url}/">
<link rel="alternate" hreflang="en-CA" href="${url}/en/">
<link rel="alternate" hreflang="x-default" href="${url}/">
<meta name="theme-color" content="#0A0A0A">
<meta name="color-scheme" content="dark">
<link rel="preload" as="font" type="font/woff2" crossorigin href="/node_modules/@fontsource-variable/archivo/files/archivo-latin-wdth-normal.woff2">
<link rel="preload" as="font" type="font/woff2" crossorigin href="/node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(business.name)}">
<meta property="og:locale" content="${t.locale.replace('-', '_')}">
<meta property="og:locale:alternate" content="${other.locale.replace('-', '_')}">
<meta property="og:title" content="${esc(t.meta.ogTitle)}">
<meta property="og:description" content="${esc(t.meta.description)}">
<meta property="og:url" content="${url}${t.path}">
<meta property="og:image" content="${url}/og-image.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(t.meta.ogImageAlt)}">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">${structuredData(t)}</script>
<script>document.documentElement.classList.add('js')</script>`;

  const body = `
${header(t, other)}
<main id="main">
  ${hero(t)}
  ${tape(t)}
  ${services(t)}
  ${why(t)}
  ${how(t)}
  ${tape(t, 'tape--red')}
  ${fleet(t)}
  ${area(t)}
  ${reviews(t)}
  ${faq(t)}
  ${booking(t)}
  ${contact(t)}
</main>
${footer(t, other)}
${mobileBar(t)}
<div class="cursor is-hidden" aria-hidden="true" data-cursor><span class="cursor__dot"></span><span class="cursor__ring"></span></div>
<script type="application/json" id="i18n">${runtimeStrings(t)}</script>`;

  return { head, body, htmlLang: t.locale };
}
