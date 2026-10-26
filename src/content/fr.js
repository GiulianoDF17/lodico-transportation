/* =============================================================================
 * TEXTE FRANÇAIS (langue par défaut)
 * Modifiez le texte entre les apostrophes. Gardez la même structure que en.js.
 * Les faits (téléphone, adresse, heures, flotte…) sont dans business.js.
 * {phone}, {n}, {size}… sont remplacés automatiquement — ne les traduisez pas.
 * ========================================================================== */

export default {
  lang: 'fr',
  locale: 'fr-CA',
  path: '/',

  meta: {
    title: 'Déménagement et transport de meubles à Montréal et Laval | Lodico Transport',
    description:
      'Déménagement résidentiel et de bureau, livraison de meubles et transport d’électros à Montréal-Nord, Montréal et Laval. Demandez votre soumission : 514-562-2050.',
    ogTitle: 'Lodico Transport — Du lourd, livré avec soin',
    ogImageAlt: 'Lodico Transport : déménagement et transport de meubles à Montréal et Laval',
  },

  a11y: {
    skip: 'Aller au contenu',
    menu: 'Menu',
    closeMenu: 'Fermer le menu',
    langSwitch: 'English version',
    progress: 'Progression de la page',
    newTab: '(ouvre un nouvel onglet)',
    home: 'accueil',
  },

  nav: {
    services: 'Services',
    fleet: 'Flotte',
    area: 'Secteurs',
    faq: 'FAQ',
    contact: 'Contact',
    book: 'Réserver',
    call: 'Appeler',
    langShort: 'EN',
  },

  placeholderTag: 'À confirmer',
  photoPlaceholder: 'Photo réelle à venir',

  hero: {
    kicker: 'Montréal ⇄ Laval — meubles & marchandises',
    title: ['Du lourd,', 'livré', 'avec soin.'],
    lead:
      'Déménagements, livraison de meubles, électros et gros morceaux. Une équipe de Montréal-Nord qui arrive à l’heure et traite vos affaires comme les siennes.',
    ctaBook: 'Réserver un déménagement',
    ctaCall: 'Appeler',
    manifest: [
      ['Départ', 'Laval'],
      ['Arrivée', 'Montréal'],
      ['Bureau', 'Lun–ven · 9 h–17 h'],
    ],
    hudLoad: 'Charge',
    hudPhases: ['Chargement — Laval', 'En route — pont Pie-IX', 'Livré — Montréal'],
    stamp: 'Livré',
    scrollHint: 'Défilez pour charger le camion',
    posterAlt: 'Illustration d’un camion cube noir et rouge qui relie Laval et Montréal',
    sceneAlt:
      'Animation 3D : un camion noir et rouge est chargé de boîtes et de meubles, puis roule de Laval à Montréal par le pont Pie-IX.',
  },

  services: {
    eyebrow: 'Services',
    title: 'Ce qu’on transporte.',
    intro: 'Vos affaires, pas de passagers. Du 4½ complet au frigo tout seul.',
    includedLabel: 'Inclus',
    bookThis: 'Réserver ce service',
    // TO CONFIRM: what is included in each service
    note: 'Le contenu exact de chaque service se confirme au téléphone.',
    items: [
      {
        id: 'home',
        title: 'Déménagement résidentiel',
        text: 'Appartement, condo, maison. On protège, on charge, on livre et on dépose chaque morceau dans la bonne pièce.',
        includes: ['Camion et équipe', 'Couvertures et sangles', 'Chargement et déchargement', 'Démontage simple sur demande'],
      },
      {
        id: 'office',
        title: 'Déménagement de bureau',
        text: 'Bureaux, commerces, petits entrepôts. On planifie avec vous pour que vos opérations reprennent vite.',
        includes: ['Postes de travail et classeurs', 'Équipement identifié par pièce', 'Horaire planifié avec vous'],
      },
      {
        id: 'furniture',
        title: 'Livraison de meubles pour magasins',
        text: 'Magasins et détaillants : on livre vos clients du magasin à la maison, ou on ramasse chez eux.',
        includes: ['Cueillette en magasin ou en entrepôt', 'Livraison jusque dans la pièce', 'Ramassage à domicile'],
      },
      {
        id: 'single',
        title: 'Un seul morceau, électros',
        text: 'Le sofa trouvé sur Marketplace, une laveuse, un frigo, une commode : on va le chercher, on le livre.',
        includes: ['Électroménagers', 'Gros meubles et articles encombrants', 'Cueillette et livraison le même jour'],
      },
      {
        id: 'small',
        title: 'Petits contrats',
        text: 'Quelques boîtes, un casier à vider, un aller-retour pour un entrepreneur ou un gestionnaire d’immeubles.',
        includes: ['Boîtes et petits meubles', 'Entrepreneurs et gestionnaires d’immeubles', 'Court préavis selon disponibilité'],
      },
    ],
  },

  tape: ['Ce côté vers le haut', 'Fragile', 'Manipuler avec soin', 'Montréal ⇄ Laval', 'Ne pas empiler'],

  why: {
    eyebrow: 'Pourquoi Lodico',
    title: ['Basé à', 'Montréal-Nord.'],
    lead:
      'On connaît les escaliers en colimaçon, les ruelles étroites et les ponts à l’heure de pointe. Montréal et Laval, c’est notre terrain.',
    // TO CONFIRM: these promises with the owner
    points: [
      { icon: 'pin', title: 'Une entreprise d’ici', text: 'Notre camion part de l’avenue Salk, à Montréal-Nord. Pas de centrale à l’autre bout du pays.' },
      { icon: 'blanket', title: 'Manipulé avec soin', text: 'Couvertures, sangles et mains attentives pour chaque meuble, chaque électro.' },
      { icon: 'clock', title: 'À l’heure', text: 'On arrive dans la plage prévue. Si quelque chose change, vous le savez avant.' },
      { icon: 'tag', title: 'Prix clairs', text: 'Une soumission claire avant le jour J. Pas de surprise sur la facture.' },
    ],
    stats: {
      years: 'ans de métier',
      moves: 'déménagements',
      cities: 'villes : Montréal + Laval',
      trucks: 'camions cube',
    },
    photoAlt: 'L’équipe Lodico Transport au travail',
  },

  how: {
    eyebrow: 'Comment ça marche',
    title: 'Quatre étapes. Zéro casse-tête.',
    steps: [
      { title: 'Demande', text: 'Remplissez le formulaire ou appelez-nous. Deux minutes, pas plus.' },
      { title: 'Soumission et confirmation', text: 'On vous rappelle, on valide les détails, on confirme le prix et l’heure.' },
      { title: 'Jour du déménagement', text: 'L’équipe arrive, protège, charge et prend la route.' },
      { title: 'C’est réglé', text: 'Tout est déposé où vous le voulez. Il ne vous reste qu’à déballer.' },
    ],
    box: { up: 'CE CÔTÉ VERS LE HAUT', fragile: 'FRAGILE', delivered: 'LIVRÉ', label: 'BON DE TRANSPORT' },
    sceneAlt: 'Animation 3D d’une boîte de déménagement qui s’ouvre et se ferme à chaque étape.',
  },

  fleet: {
    eyebrow: 'La flotte',
    title: 'Trois camions. Le bon format.',
    intro: 'On choisit le camion selon votre volume — pas plus gros, pas plus cher.',
    note: 'Capacités approximatives, à titre d’exemple. On confirme selon votre inventaire.',
    lengthUnit: 'pi',
    fitsLabel: 'Idéal pour',
    choose: 'Choisir ce camion',
    dragHint: 'Glissez pour voir les camions',
    trucks: {
      16: { name: 'Camion cube 16 pi', fits: 'Studio / 3½', list: ['Studio, 2½ ou 3½', 'Quelques meubles livrés', 'Électros et gros morceaux'] },
      20: { name: 'Camion cube 20 pi', fits: '4½ à 5½', list: ['Logement de 2 à 3 chambres', 'Petit bureau', 'Tournée de livraisons'] },
      26: { name: 'Camion cube 26 pi', fits: 'Maison ou bureau', list: ['Maison complète', 'Bureau complet', 'Gros volume commercial'] },
    },
    truckAlt: 'Illustration du {name}',
  },

  area: {
    eyebrow: 'Secteurs desservis',
    title: 'Montréal + Laval.',
    intro: 'Notre base est à Montréal-Nord. On couvre l’île de Montréal et Laval, des deux côtés de la rivière des Prairies.',
    checkLabel: 'Votre quartier ou code postal',
    checkPlaceholder: 'Ex. Chomedey, Rosemont, H7N',
    checkButton: 'Vérifier',
    checkYes: '{place} : oui, on y va.',
    checkMaybe: '{place} : appelez-nous, on regarde ça ensemble.',
    checkEmpty: 'Entrez un quartier, une ville ou un code postal.',
    regions: {
      montreal: { name: 'Île de Montréal', text: 'De l’Ouest-de-l’Île à Pointe-aux-Trembles, du centre-ville à Montréal-Nord.' },
      laval: { name: 'Laval', text: 'Chomedey, Vimont, Duvernay, Sainte-Rose, Laval-des-Rapides et tous les autres secteurs.' },
      around: { name: 'Rive-Nord et Rive-Sud', text: 'Hors de Montréal et Laval ? Demandez-nous.' },
    },
    base: 'Base Lodico',
    bridgesTitle: 'Les ponts, on connaît.',
    mapHint: 'Survolez ou sélectionnez une zone',
    mapAlt:
      'Carte stylisée de l’île de Montréal et de Laval, séparées par la rivière des Prairies, avec les ponts et la base de Lodico à Montréal-Nord.',
    askUs: 'Demandez-nous',
  },

  reviews: {
    eyebrow: 'Avis clients',
    title: 'Vos mots, ici.',
    intro: 'On affichera ici de vrais avis de nos clients, tirés de Google et Facebook.',
    slot: 'Avis à venir',
    cta: 'Vous avez déménagé avec nous ? Laissez un avis sur Facebook',
  },

  faq: {
    eyebrow: 'FAQ',
    title: 'Questions fréquentes.',
    // TO CONFIRM: every answer with the owner (prices, insurance, cancellation)
    items: [
      {
        q: 'Combien coûte un déménagement ?',
        a: 'Le prix dépend du volume, de la distance, des étages et du temps requis. Envoyez votre demande ou appelez-nous : vous recevez une soumission claire avant de confirmer quoi que ce soit.',
      },
      {
        q: 'Êtes-vous assurés ?',
        a: 'Parlez-nous de vos objets de valeur au moment de la soumission. On vous explique la couverture offerte et les options possibles avant le jour du déménagement.',
      },
      {
        q: 'Qu’est-ce que vous ne transportez pas ?',
        a: 'On ne transporte pas de personnes. On refuse aussi les matières dangereuses : bonbonnes de propane, essence, peinture, produits chimiques. Pour un objet spécial, demandez-nous.',
      },
      {
        q: 'Escaliers, ascenseur, colimaçon ?',
        a: 'Indiquez l’étage et le type d’accès dans le formulaire, pour la cueillette et la livraison. S’il y a un ascenseur à réserver, réservez-le pour la journée.',
      },
      {
        q: 'Et si je dois annuler ou changer la date ?',
        a: 'Prévenez-nous le plus tôt possible. Les conditions d’annulation et de changement vous sont expliquées au moment de la confirmation.',
      },
      {
        q: 'Et le 1er juillet ?',
        a: 'C’est la journée la plus occupée de l’année au Québec. Réservez tôt : les meilleures plages partent vite.',
      },
      {
        q: 'Faites-vous les livraisons pour les magasins ?',
        a: 'Oui. Magasins de meubles, détaillants, entrepreneurs, gestionnaires d’immeubles : appelez-nous pour une entente régulière.',
      },
      {
        q: 'Quelles sont vos heures ?',
        a: 'Le bureau répond du lundi au vendredi, de 9 h à 17 h. Vous pouvez envoyer une demande en ligne en tout temps.',
      },
    ],
  },

  booking: {
    eyebrow: 'Réservation',
    title: ['Réservez', 'votre transport.'],
    intro: 'Cinq étapes, deux minutes. On vous rappelle pour confirmer le prix et l’heure.',
    steps: ['Service', 'Trajet', 'Inventaire', 'Coordonnées', 'Vérification'],
    stepOf: 'Étape {n} sur {total}',
    next: 'Continuer',
    back: 'Retour',
    submit: 'Envoyer la demande',
    sending: 'Envoi en cours…',
    optional: 'facultatif',
    required: 'requis',
    saved: 'Brouillon sauvegardé sur cet appareil.',
    restored: 'On a gardé vos réponses. Vous pouvez continuer où vous étiez.',
    clear: 'Tout effacer',
    clearConfirm: 'Effacer toutes les réponses ?',

    jobLegend: 'Quel type de transport ?',
    jobs: {
      home: { label: 'Déménagement résidentiel', hint: 'Appartement, condo, maison' },
      office: { label: 'Déménagement de bureau', hint: 'Bureau, commerce' },
      furniture: { label: 'Livraison de meubles', hint: 'Magasin → client, ramassage' },
      single: { label: 'Un seul morceau / électro', hint: 'Sofa, frigo, laveuse…' },
      other: { label: 'Autre', hint: 'Petit contrat, boîtes…' },
    },

    pickup: 'Cueillette',
    dropoff: 'Livraison',
    address: 'Adresse',
    addressPlaceholder: '1234, rue Exemple, Laval',
    floor: 'Étage',
    floors: { 1: 'Rez-de-chaussée', 2: '2e', 3: '3e', 4: '4e', 5: '5e et plus' },
    access: 'Accès',
    accesses: { inside: 'Escalier intérieur', outside: 'Escalier extérieur', elevator: 'Ascenseur', none: 'Aucune marche' },
    date: 'Date souhaitée',
    time: 'Plage horaire',
    times: { morning: 'Matin', afternoon: 'Après-midi', flexible: 'Flexible' },
    july1: 'Le 1er juillet, c’est la course : on vous rappelle vite pour bloquer votre place.',

    sizeLegend: 'Grandeur du déménagement',
    sizes: { studio: 'Studio / 2½', s35: '3½', s45: '4½', s55: '5½', house: '6½ + / maison' },
    officeSizes: { small: 'Petit (1–5 postes)', medium: 'Moyen (6–15 postes)', large: 'Grand (16 postes +)' },
    itemsLegend: 'Liste d’objets',
    itemsHint: 'Facultatif pour un déménagement complet, mais ça nous aide à mieux estimer.',
    itemType: 'Objet',
    itemQty: 'Quantité',
    itemCustom: 'Précisez l’objet',
    addItem: 'Ajouter',
    removeItem: 'Retirer {item}',
    noItems: 'Aucun objet ajouté.',
    catalog: {
      sofa: 'Sofa', bed: 'Lit + matelas', mattress: 'Matelas seul', dresser: 'Commode', table: 'Table',
      chair: 'Chaise', fridge: 'Réfrigérateur', stove: 'Cuisinière', washer: 'Laveuse', dryer: 'Sécheuse',
      tv: 'Télé', desk: 'Bureau (meuble)', cabinet: 'Classeur', box: 'Boîte', other: 'Autre',
    },
    fragile: 'Il y a des objets fragiles',
    heavy: 'Il y a des objets très lourds (plus de 100 kg)',
    notes: 'Détails utiles',
    notesPlaceholder: 'Ex. stationnement dans la ruelle, porte étroite, objet de valeur…',
    photos: 'Photos',
    photosHint: 'Jusqu’à 3 photos (8 Mo au total) pour mieux estimer.',
    photosButton: 'Ajouter des photos',
    photosRemove: 'Retirer la photo {n}',
    photosNotSent: 'Les photos ne peuvent pas être envoyées en ligne pour l’instant : montrez-les-nous par texto après l’appel.',

    name: 'Nom complet',
    phone: 'Téléphone',
    phonePlaceholder: '514-555-1234',
    email: 'Courriel',
    emailPlaceholder: 'nom@exemple.com',
    contactLegend: 'On vous joint comment ?',
    contacts: { phone: 'Appel', sms: 'Texto', email: 'Courriel' },
    langLegend: 'Langue',
    langs: { fr: 'Français', en: 'English' },
    company: 'Entreprise',

    reviewTitle: 'Vérifiez votre demande',
    reviewIntro: 'Tout est bon ? Envoyez et on vous rappelle.',
    edit: 'Modifier',
    reviewSections: { job: 'Service', route: 'Trajet', load: 'Inventaire', contact: 'Coordonnées' },
    consent: 'En envoyant, vous acceptez d’être contacté au sujet de cette demande.',

    errors: {
      required: 'Ce champ est requis.',
      choose: 'Choisissez une option.',
      address: 'Entrez une adresse complète (numéro et rue).',
      date: 'Choisissez une date à partir d’aujourd’hui.',
      phone: 'Entrez un numéro à 10 chiffres, ex. 514-555-1234.',
      email: 'Entrez un courriel valide, ex. nom@exemple.com.',
      load: 'Choisissez une grandeur ou ajoutez au moins un objet.',
      custom: 'Précisez l’objet.',
      summary: 'Il reste {n} champ(s) à corriger.',
      photoSize: 'Les photos dépassent 8 Mo au total.',
      photoType: 'Seulement des images (JPG, PNG, WebP, HEIC).',
      photoCount: 'Maximum 3 photos.',
      rate: 'Une demande vient d’être envoyée de cet appareil. Réessayez dans quelques minutes ou appelez-nous au {phone}.',
      network: 'L’envoi n’a pas fonctionné. Réessayez ou appelez-nous au {phone}.',
    },

    manifest: {
      title: 'Bon de transport',
      ref: 'Réf.',
      draft: 'Brouillon',
      service: 'Service',
      from: 'De',
      to: 'À',
      date: 'Date',
      window: 'Plage',
      load: 'Chargement',
      items: 'objet(s)',
      fragile: 'Fragile',
      heavy: 'Lourd',
      contact: 'Contact',
      truck: 'Camion suggéré',
      estimate: 'Estimation — on confirme au téléphone',
      empty: '—',
      toggle: 'Voir le bon de transport',
      floorShort: 'ét.',
      truckValue: 'Cube {size} pi',
      loadMeter: 'Remplissage estimé',
    },

    success: {
      stamp: 'Réservé',
      title: 'Demande reçue.',
      // {days} comes from business.callbackBusinessDays (TO CONFIRM)
      text: 'On vous rappelle d’ici {days} jour ouvrable pour confirmer le prix et l’heure.',
      refLabel: 'Votre numéro de référence',
      call: 'Pressé ? Appelez-nous',
      again: 'Nouvelle demande',
    },
  },

  contact: {
    eyebrow: 'Contact',
    title: ['Un appel,', 'c’est parti.'],
    phoneLabel: 'Ligne principale',
    altLabel: 'Autre ligne',
    addressLabel: 'Adresse',
    directions: 'Itinéraire Google Maps',
    hoursLabel: 'Heures du bureau',
    hoursValue: 'Lundi au vendredi, 9 h à 17 h',
    facebook: 'Lodico Transport sur Facebook',
    licenceLabel: 'Licence et assurance',
  },

  footer: {
    tagline: 'Transport de meubles et de marchandises — Montréal & Laval.',
    noPeople: 'Nous ne transportons pas de personnes.',
    rights: '© {year} Lodico Transport. Tous droits réservés.',
    credits: 'Crédits',
    top: 'Haut de page',
  },
};
