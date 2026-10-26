/* Custom line icons (24×24, square caps) drawn for Lodico — no icon font,
 * no emoji. Usage: icon('phone') → inline <svg>. */

const paths = {
  phone:
    '<path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
  arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
  arrowDown: '<path d="M12 4v15M6 13l6 6 6-6"/>',
  arrowUp: '<path d="M12 20V5M6 11l6-6 6 6"/>',
  home: '<path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
  office: '<path d="M4 21V5h10v16"/><path d="M14 9h6v12"/><path d="M7 8h4M7 12h4M7 16h4M17 13h1M17 17h1"/><path d="M2 21h20"/>',
  store: '<path d="M3 9 5 4h14l2 5"/><path d="M3 9h18v2a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0Z"/><path d="M5 13v8h14v-8"/><path d="M10 21v-5h4v5"/>',
  fridge: '<rect x="6" y="2.5" width="12" height="19"/><path d="M6 9h12M9 5.5v1.5M9 12v3"/>',
  box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5Z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/><path d="m7.5 5.2 9 4.5"/>',
  sofa: '<path d="M5 11V7h14v4"/><path d="M3 11h4v4h10v-4h4v7H3Z"/><path d="M5 18v2M19 18v2"/>',
  pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5"/>',
  blanket: '<path d="M4 5h16v11H4z"/><path d="M4 16c0 2 2 3 4 3h12v-3"/><path d="M8 5v11M12 5v11M16 5v11"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  tag: '<path d="M3 12V3h9l9 9-9 9Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  check: '<path d="m4 12.5 5 5L20 6.5"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  minus: '<path d="M5 12h14"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  camera: '<path d="M3 7h4l2-3h6l2 3h4v13H3Z"/><circle cx="12" cy="13" r="4"/>',
  facebook: '<path d="M14 21v-8h3l.5-3.5H14V7.5c0-1 .4-1.7 1.8-1.7h1.8V2.7A24 24 0 0 0 15 2.5c-2.7 0-4.5 1.6-4.5 4.6v2.4H7.5V13h3v8"/>',
  calendar: '<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/>',
  truck: '<path d="M2 6h12v10H2zM14 9h4l4 4v3h-8z"/><circle cx="6.5" cy="17.5" r="1.8"/><circle cx="17.5" cy="17.5" r="1.8"/>',
  map: '<path d="m3 6 6-2 6 2 6-2v14l-6 2-6-2-6 2Z"/><path d="M9 4v14M15 6v14"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16Z"/><path d="m13.5 6.5 4 4"/>',
  menu: '<path d="M3 7h18M3 12h18M3 17h12"/>',
  glass: '<path d="M7 3h10l-1 7a4 4 0 0 1-8 0Z"/><path d="M12 14v6M8 21h8"/>',
};

export const icon = (name, cls = '') =>
  `<svg class="icon ${cls}" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" focusable="false">${paths[name] || ''}</svg>`;

export const iconNames = Object.keys(paths);
