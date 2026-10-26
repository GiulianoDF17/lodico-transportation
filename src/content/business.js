/* =============================================================================
 * VERIFY WITH OWNER BEFORE LAUNCH
 * -----------------------------------------------------------------------------
 * Every business fact used on the site lives in this one file: name, phones,
 * address, hours, links, fleet, stats, licences. The French and English copy
 * (fr.js / en.js) only holds wording.
 *
 * Anything marked `confirmed: false` (or with a "TO CONFIRM" comment) is a
 * placeholder. On the site, unconfirmed numbers show a small red
 * "À CONFIRMER / TO CONFIRM" tag so nothing slips through by accident.
 * Once Johnny Lodico confirms a value, change it and set `confirmed: true`.
 * ========================================================================== */

export const business = {
  name: 'Lodico Transport',
  owner: 'Johnny Lodico',

  // TO CONFIRM: the real domain. Used for canonical URLs, hreflang, sitemap and
  // social previews. Change it once the domain is connected (no trailing slash).
  siteUrl: 'https://lodico-transport.netlify.app',

  phones: {
    main: { display: '514-562-2050', tel: '+15145622050' },
    alt: { display: '514-329-5683', tel: '+15143295683' },
  },

  address: {
    street: '10871, avenue Salk',
    streetEn: '10871 Salk Avenue',
    district: 'Montréal-Nord',
    city: 'Montréal',
    region: 'QC',
    postalCode: 'H1G 6M7',
    country: 'CA',
    // Opens Google Maps on the address (no API key needed)
    mapUrl:
      'https://www.google.com/maps/search/?api=1&query=10871+avenue+Salk+Montr%C3%A9al-Nord+QC+H1G+6M7',
  },

  // Office hours. Used in the footer, FAQ and Google structured data.
  hours: {
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00',
  },

  facebook: 'https://www.facebook.com/p/Lodico-Transport-Johnny-Lodico-100064180086497/',

  // Real logo: put the file in /public/brand/ (e.g. /public/brand/logo.svg)
  // and set the path here. While `null`, a temporary wordmark is drawn.
  logo: null, // e.g. '/brand/logo.svg'

  // Real photos: drop JPG/PNG files in /assets/photos/, run `npm run images`,
  // then put the file name (without extension) here. `null` = placeholder slot.
  photos: {
    team: null, // e.g. 'equipe-lodico'
    truck16: null,
    truck20: null,
    truck26: null,
    job: null, // a real job photo for the "Why Lodico" section
  },

  // Counters in the "Why Lodico" section. TO CONFIRM: years and moves are
  // examples only — replace with real numbers and set confirmed: true.
  stats: [
    { id: 'years', value: 10, suffix: '+', confirmed: false },
    { id: 'moves', value: 1000, suffix: '+', confirmed: false },
    { id: 'cities', value: 2, suffix: '', confirmed: true }, // Montréal + Laval
    { id: 'trucks', value: 3, suffix: '', confirmed: false },
  ],

  // Fleet. TO CONFIRM: sizes and example capacities with the owner.
  // `capacityCuFt` is only used by the form to suggest a truck (estimate).
  fleet: [
    { id: '16', lengthFt: 16, capacityCuFt: 450, confirmed: false },
    { id: '20', lengthFt: 20, capacityCuFt: 800, confirmed: false },
    { id: '26', lengthFt: 26, capacityCuFt: 1400, confirmed: false },
  ],

  // TO CONFIRM: callback delay promised after a booking request.
  callbackBusinessDays: 1,

  // TO CONFIRM: RBQ licence / insurance info. Shown in the footer.
  // Leave `null` to show the placeholder tag.
  licence: {
    rbq: null, // e.g. 'RBQ 1234-5678-90' (if applicable)
    insurance: null, // e.g. 'Assuré pour la marchandise transportée'
  },

  // Real reviews only. Copy them from Google or Facebook, with permission.
  // Example: { name: 'Marie T.', source: 'Google', rating: 5, text: { fr: '…', en: '…' } }
  reviews: [],
};

// Where the booking requests go. See README → "Connect the booking email".
export const formConfig = {
  // 'netlify'  : Netlify Forms (free, supports photo uploads, no key needed)
  // 'web3forms': Web3Forms (free, works on any host; photos are not sent)
  provider: 'netlify',
  formName: 'booking',
  // Web3Forms access key comes from the .env file (VITE_WEB3FORMS_KEY)
  maxPhotos: 3,
  maxPhotoBytes: 8 * 1024 * 1024,
  // Basic rate limit: one request per device every 2 minutes
  rateLimitMs: 2 * 60 * 1000,
};
