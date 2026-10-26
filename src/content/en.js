/* =============================================================================
 * ENGLISH COPY
 * Edit the text between the quotes. Keep the same structure as fr.js.
 * Business facts (phone, address, hours, fleet…) live in business.js.
 * {phone}, {n}, {size}… are filled in automatically — don't translate them.
 * ========================================================================== */

export default {
  lang: 'en',
  locale: 'en-CA',
  path: '/en/',

  meta: {
    title: 'Movers & Furniture Delivery in Montreal and Laval | Lodico Transport',
    description:
      'Home and office moves, furniture delivery and appliance transport in Montréal-Nord, Montreal and Laval. Get a quote: 514-562-2050.',
    ogTitle: 'Lodico Transport — Heavy loads, handled with care',
    ogImageAlt: 'Lodico Transport: moving and furniture delivery in Montreal and Laval',
  },

  a11y: {
    skip: 'Skip to content',
    menu: 'Menu',
    closeMenu: 'Close menu',
    langSwitch: 'Version française',
    progress: 'Page progress',
    newTab: '(opens in a new tab)',
    home: 'home',
  },

  nav: {
    services: 'Services',
    fleet: 'Fleet',
    area: 'Areas',
    faq: 'FAQ',
    contact: 'Contact',
    book: 'Book',
    call: 'Call',
    langShort: 'FR',
  },

  placeholderTag: 'To confirm',
  photoPlaceholder: 'Real photo coming',

  hero: {
    kicker: 'Montreal ⇄ Laval — furniture & goods',
    title: ['Heavy loads,', 'handled', 'with care.'],
    lead:
      'Moves, furniture delivery, appliances and bulky items. A Montréal-Nord crew that shows up on time and treats your things like their own.',
    ctaBook: 'Book a move',
    ctaCall: 'Call',
    manifest: [
      ['From', 'Laval'],
      ['To', 'Montreal'],
      ['Office', 'Mon–Fri · 9 am–5 pm'],
    ],
    hudLoad: 'Load',
    hudPhases: ['Loading — Laval', 'On the road — Pie-IX bridge', 'Delivered — Montreal'],
    stamp: 'Delivered',
    scrollHint: 'Scroll to load the truck',
    posterAlt: 'Illustration of a black and red box truck linking Laval and Montreal',
    sceneAlt:
      '3D animation: a black and red truck is loaded with boxes and furniture, then drives from Laval to Montreal over the Pie-IX bridge.',
  },

  services: {
    eyebrow: 'Services',
    title: 'What we move.',
    intro: 'Your things, never passengers. From a full 2-bedroom to a single fridge.',
    includedLabel: 'Included',
    bookThis: 'Book this',
    note: 'What each service includes is confirmed over the phone.',
    items: [
      {
        id: 'home',
        title: 'Home moves',
        text: 'Apartment, condo, house. We protect, load, deliver and set every piece down in the right room.',
        includes: ['Truck and crew', 'Moving blankets and straps', 'Loading and unloading', 'Basic disassembly on request'],
      },
      {
        id: 'office',
        title: 'Office moves',
        text: 'Offices, shops, small warehouses. We plan it with you so you’re back in business fast.',
        includes: ['Workstations and filing cabinets', 'Equipment labelled by room', 'Schedule planned with you'],
      },
      {
        id: 'furniture',
        title: 'Furniture delivery for stores',
        text: 'Stores and retailers: we deliver to your customers’ homes, or pick up from them.',
        includes: ['Pickup at store or warehouse', 'Delivered right into the room', 'Home pickups'],
      },
      {
        id: 'single',
        title: 'Single items & appliances',
        text: 'That Marketplace couch, a washer, a fridge, a dresser: we pick it up and drop it off.',
        includes: ['Appliances', 'Large and bulky furniture', 'Same-day pickup and drop-off'],
      },
      {
        id: 'small',
        title: 'Small jobs',
        text: 'A few boxes, a storage locker to empty, a run for a contractor or property manager.',
        includes: ['Boxes and small furniture', 'Contractors and property managers', 'Short notice when available'],
      },
    ],
  },

  tape: ['This side up', 'Fragile', 'Handle with care', 'Montreal ⇄ Laval', 'Do not stack'],

  why: {
    eyebrow: 'Why Lodico',
    title: ['Based in', 'Montréal-Nord.'],
    lead:
      'We know the spiral staircases, the narrow back lanes and the bridges at rush hour. Montreal and Laval are our turf.',
    points: [
      { icon: 'pin', title: 'Local business', text: 'Our truck leaves from Salk Avenue in Montréal-Nord. No call centre across the country.' },
      { icon: 'blanket', title: 'Handled with care', text: 'Blankets, straps and careful hands for every piece of furniture and every appliance.' },
      { icon: 'clock', title: 'On time', text: 'We arrive within the planned window. If anything changes, you know first.' },
      { icon: 'tag', title: 'Clear prices', text: 'A clear quote before moving day. No surprises on the bill.' },
    ],
    stats: {
      years: 'years on the job',
      moves: 'moves done',
      cities: 'cities: Montreal + Laval',
      trucks: 'box trucks',
    },
    photoAlt: 'The Lodico Transport crew at work',
  },

  how: {
    eyebrow: 'How it works',
    title: 'Four steps. Zero headaches.',
    steps: [
      { title: 'Request', text: 'Fill in the form or give us a call. Two minutes, tops.' },
      { title: 'Quote & confirm', text: 'We call you back, check the details, confirm the price and the time.' },
      { title: 'Moving day', text: 'The crew shows up, protects, loads and hits the road.' },
      { title: 'Done', text: 'Everything goes exactly where you want it. All that’s left is unpacking.' },
    ],
    box: { up: 'THIS SIDE UP', fragile: 'FRAGILE', delivered: 'DELIVERED', label: 'SHIPPING MANIFEST' },
    sceneAlt: '3D animation of a moving box opening and closing at each step.',
  },

  fleet: {
    eyebrow: 'The fleet',
    title: 'Three trucks. The right size.',
    intro: 'We pick the truck for your volume — no bigger, no pricier.',
    note: 'Example capacities, approximate. We confirm based on your inventory.',
    lengthUnit: 'ft',
    fitsLabel: 'Best for',
    choose: 'Choose this truck',
    dragHint: 'Swipe to see the trucks',
    trucks: {
      16: { name: '16 ft box truck', fits: 'Studio / 1-bedroom', list: ['Studio or 1-bedroom', 'A few furniture deliveries', 'Appliances and bulky items'] },
      20: { name: '20 ft box truck', fits: '2–3 bedrooms', list: ['2 to 3 bedroom apartment', 'Small office', 'Delivery rounds'] },
      26: { name: '26 ft box truck', fits: 'Full house or office', list: ['Full house', 'Full office', 'Large commercial loads'] },
    },
    truckAlt: 'Illustration of the {name}',
  },

  area: {
    eyebrow: 'Service area',
    title: 'Montreal + Laval.',
    intro: 'Our base is in Montréal-Nord. We cover the island of Montreal and Laval, on both sides of the Rivière des Prairies.',
    checkLabel: 'Your neighbourhood or postal code',
    checkPlaceholder: 'E.g. Chomedey, Rosemont, H7N',
    checkButton: 'Check',
    checkYes: '{place}: yes, we go there.',
    checkMaybe: '{place}: give us a call and we’ll sort it out.',
    checkEmpty: 'Enter a neighbourhood, city or postal code.',
    regions: {
      montreal: { name: 'Island of Montreal', text: 'From the West Island to Pointe-aux-Trembles, downtown to Montréal-Nord.' },
      laval: { name: 'Laval', text: 'Chomedey, Vimont, Duvernay, Sainte-Rose, Laval-des-Rapides and every other sector.' },
      around: { name: 'North & South Shore', text: 'Outside Montreal and Laval? Ask us.' },
    },
    base: 'Lodico base',
    bridgesTitle: 'We know the bridges.',
    mapHint: 'Hover or select an area',
    mapAlt:
      'Stylized map of the island of Montreal and Laval, separated by the Rivière des Prairies, with the bridges and Lodico’s base in Montréal-Nord.',
    askUs: 'Ask us',
  },

  reviews: {
    eyebrow: 'Reviews',
    title: 'Your words, here.',
    intro: 'Real reviews from our customers, from Google and Facebook, will go here.',
    slot: 'Review coming',
    cta: 'Moved with us? Leave a review on Facebook',
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Common questions.',
    items: [
      {
        q: 'How much does a move cost?',
        a: 'It depends on volume, distance, floors and the time needed. Send a request or call us: you get a clear quote before you confirm anything.',
      },
      {
        q: 'Are you insured?',
        a: 'Tell us about valuable items when you ask for a quote. We’ll explain the coverage offered and your options before moving day.',
      },
      {
        q: 'What won’t you move?',
        a: 'We don’t transport people. We also refuse hazardous materials: propane tanks, gasoline, paint, chemicals. For anything unusual, just ask.',
      },
      {
        q: 'Stairs, elevators, spiral staircases?',
        a: 'Add the floor and type of access in the form, for both pickup and drop-off. If there’s an elevator to book, reserve it for the day.',
      },
      {
        q: 'What if I need to cancel or change the date?',
        a: 'Let us know as early as possible. Cancellation and change terms are explained when your move is confirmed.',
      },
      {
        q: 'What about July 1st?',
        a: 'It’s the busiest moving day of the year in Quebec. Book early: the best time slots go fast.',
      },
      {
        q: 'Do you deliver for furniture stores?',
        a: 'Yes. Furniture stores, retailers, contractors, property managers: call us to set up a regular arrangement.',
      },
      {
        q: 'What are your hours?',
        a: 'The office answers Monday to Friday, 9 am to 5 pm. You can send a request online any time.',
      },
    ],
  },

  booking: {
    eyebrow: 'Booking',
    title: ['Book', 'your move.'],
    intro: 'Five steps, two minutes. We call you back to confirm the price and time.',
    steps: ['Service', 'Route', 'Inventory', 'Contact', 'Review'],
    stepOf: 'Step {n} of {total}',
    next: 'Continue',
    back: 'Back',
    submit: 'Send request',
    sending: 'Sending…',
    optional: 'optional',
    required: 'required',
    saved: 'Draft saved on this device.',
    restored: 'We kept your answers. Pick up where you left off.',
    clear: 'Clear all',
    clearConfirm: 'Clear all answers?',

    jobLegend: 'What do you need moved?',
    jobs: {
      home: { label: 'Home move', hint: 'Apartment, condo, house' },
      office: { label: 'Office move', hint: 'Office, shop' },
      furniture: { label: 'Furniture delivery', hint: 'Store → customer, pickups' },
      single: { label: 'Single item / appliance', hint: 'Couch, fridge, washer…' },
      other: { label: 'Other', hint: 'Small job, boxes…' },
    },

    pickup: 'Pickup',
    dropoff: 'Drop-off',
    address: 'Address',
    addressPlaceholder: '1234 Example St, Laval',
    floor: 'Floor',
    floors: { 1: 'Ground floor', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th or higher' },
    access: 'Access',
    accesses: { inside: 'Inside stairs', outside: 'Outside stairs', elevator: 'Elevator', none: 'No steps' },
    date: 'Preferred date',
    time: 'Time window',
    times: { morning: 'Morning', afternoon: 'Afternoon', flexible: 'Flexible' },
    july1: 'July 1st is a race: we’ll call you back quickly to lock in your spot.',

    sizeLegend: 'Size of the move',
    sizes: { studio: 'Studio', s35: '1 bedroom', s45: '2 bedrooms', s55: '3 bedrooms', house: '4+ / house' },
    officeSizes: { small: 'Small (1–5 desks)', medium: 'Medium (6–15 desks)', large: 'Large (16+ desks)' },
    itemsLegend: 'Item list',
    itemsHint: 'Optional for a full move, but it helps us estimate.',
    itemType: 'Item',
    itemQty: 'Quantity',
    itemCustom: 'Describe the item',
    addItem: 'Add',
    removeItem: 'Remove {item}',
    noItems: 'No items added.',
    catalog: {
      sofa: 'Couch', bed: 'Bed + mattress', mattress: 'Mattress only', dresser: 'Dresser', table: 'Table',
      chair: 'Chair', fridge: 'Fridge', stove: 'Stove', washer: 'Washer', dryer: 'Dryer',
      tv: 'TV', desk: 'Desk', cabinet: 'Filing cabinet', box: 'Box', other: 'Other',
    },
    fragile: 'There are fragile items',
    heavy: 'There are very heavy items (over 100 kg)',
    notes: 'Useful details',
    notesPlaceholder: 'E.g. parking in the back lane, narrow door, valuable item…',
    photos: 'Photos',
    photosHint: 'Up to 3 photos (8 MB total) to help us estimate.',
    photosButton: 'Add photos',
    photosRemove: 'Remove photo {n}',
    photosNotSent: 'Photos can’t be sent online yet: text them to us after our call.',

    name: 'Full name',
    phone: 'Phone',
    phonePlaceholder: '514-555-1234',
    email: 'Email',
    emailPlaceholder: 'name@example.com',
    contactLegend: 'How should we reach you?',
    contacts: { phone: 'Call', sms: 'Text', email: 'Email' },
    langLegend: 'Language',
    langs: { fr: 'Français', en: 'English' },
    company: 'Business name',

    reviewTitle: 'Review your request',
    reviewIntro: 'All good? Send it and we’ll call you back.',
    edit: 'Edit',
    reviewSections: { job: 'Service', route: 'Route', load: 'Inventory', contact: 'Contact' },
    consent: 'By sending, you agree to be contacted about this request.',

    errors: {
      required: 'This field is required.',
      choose: 'Choose an option.',
      address: 'Enter a full address (number and street).',
      date: 'Pick a date from today onward.',
      phone: 'Enter a 10-digit number, e.g. 514-555-1234.',
      email: 'Enter a valid email, e.g. name@example.com.',
      load: 'Pick a size or add at least one item.',
      custom: 'Describe the item.',
      summary: '{n} field(s) still need fixing.',
      photoSize: 'Photos are over 8 MB in total.',
      photoType: 'Images only (JPG, PNG, WebP, HEIC).',
      photoCount: '3 photos maximum.',
      rate: 'A request was just sent from this device. Try again in a few minutes or call us at {phone}.',
      network: 'Sending didn’t work. Try again or call us at {phone}.',
    },

    manifest: {
      title: 'Shipping manifest',
      ref: 'Ref.',
      draft: 'Draft',
      service: 'Service',
      from: 'From',
      to: 'To',
      date: 'Date',
      window: 'Window',
      load: 'Load',
      items: 'item(s)',
      fragile: 'Fragile',
      heavy: 'Heavy',
      contact: 'Contact',
      truck: 'Suggested truck',
      estimate: 'Estimate — confirmed by phone',
      empty: '—',
      toggle: 'View shipping manifest',
      floorShort: 'fl.',
      truckValue: '{size} ft box',
      loadMeter: 'Estimated fill',
    },

    success: {
      stamp: 'Booked',
      title: 'Request received.',
      text: 'We’ll call you back within {days} business day to confirm the price and time.',
      refLabel: 'Your reference number',
      call: 'In a hurry? Call us',
      again: 'New request',
    },
  },

  contact: {
    eyebrow: 'Contact',
    title: ['One call,', 'we’re rolling.'],
    phoneLabel: 'Main line',
    altLabel: 'Other line',
    addressLabel: 'Address',
    directions: 'Google Maps directions',
    hoursLabel: 'Office hours',
    hoursValue: 'Monday to Friday, 9 am to 5 pm',
    facebook: 'Lodico Transport on Facebook',
    licenceLabel: 'Licence & insurance',
  },

  footer: {
    tagline: 'Furniture and goods transport — Montreal & Laval.',
    noPeople: 'We do not transport people.',
    rights: '© {year} Lodico Transport. All rights reserved.',
    credits: 'Credits',
    top: 'Back to top',
  },
};
