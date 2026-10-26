/* Live "shipping manifest" label: fills in as the visitor types. */

import { fill } from '../i18n.js';
import { estimateTruck } from './estimate.js';

const trim = (s, n = 42) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export function createManifest(root, strings) {
  const b = strings.booking;
  const m = b.manifest;
  const locale = strings.lang === 'fr' ? 'fr-CA' : 'en-CA';
  const get = (k) => root.querySelector(`[data-m="${k}"]`);
  const meter = root.querySelector('[data-m-meter]');
  const barcode = root.querySelector('[data-m-barcode]');
  const flags = {
    fragile: root.querySelector('[data-m-flag="fragile"]'),
    heavy: root.querySelector('[data-m-flag="heavy"]'),
  };
  const last = {};

  const set = (key, value) => {
    const el = get(key);
    if (!el) return;
    const v = value || (key.endsWith('Meta') || key === 'truckShort' ? '' : m.empty);
    if (last[key] === v) return;
    last[key] = v;
    el.textContent = v;
    el.classList.remove('is-flash');
    void el.offsetWidth; // restart the flash animation
    el.classList.add('is-flash');
  };

  const place = (s, prefix) => {
    const floor = b.floors[s[`${prefix}_floor`]] || '';
    const access = b.accesses[s[`${prefix}_access`]] || '';
    return [floor, access].filter(Boolean).join(' · ');
  };

  const formatDate = (iso) => {
    if (!iso) return '';
    const [y, mo, d] = iso.split('-').map(Number);
    return new Intl.DateTimeFormat(locale, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }).format(
      new Date(y, mo - 1, d),
    );
  };

  /** Simple deterministic barcode drawn from the reference number. */
  const drawBarcode = (ref) => {
    if (barcode.dataset.ref === ref) return;
    barcode.dataset.ref = ref;
    let seed = [...ref].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) >>> 0;
    const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
    barcode.innerHTML = Array.from({ length: 34 }, () => {
      const w = 1 + Math.floor(rnd() * 3);
      const gap = 1 + Math.floor(rnd() * 2);
      return `<i style="width:${w}px;margin-right:${gap}px"></i>`;
    }).join('');
  };

  const loadText = (s) => {
    const size = s.job === 'home' ? b.sizes[s.move_size] : s.job === 'office' ? b.officeSizes[s.office_size] : '';
    const count = s.items.reduce((n, it) => n + it.qty, 0);
    return [size, count ? `${count} ${m.items}` : ''].filter(Boolean).join(' + ');
  };

  function update(s) {
    get('ref').textContent = s.ref;
    drawBarcode(s.ref);
    set('service', s.job ? b.jobs[s.job].label : '');
    set('from', trim(s.pickup_address.trim()));
    set('fromMeta', s.pickup_address.trim() ? place(s, 'pickup') : '');
    set('to', trim(s.dropoff_address.trim()));
    set('toMeta', s.dropoff_address.trim() ? place(s, 'dropoff') : '');
    set('date', formatDate(s.date));
    set('window', b.times[s.time_window] || '');
    set('load', loadText(s));
    set('contact', [s.name.trim(), s.phone.trim()].filter(Boolean).join(' · '));

    const est = estimateTruck(s);
    const truckLabel = est ? fill(m.truckValue, { size: est.truck }) : '';
    set('truck', truckLabel);
    set('truckShort', truckLabel);
    meter.style.transform = `scaleX(${est ? est.fill : 0})`;

    for (const k of ['fragile', 'heavy']) {
      const on = !!s[k];
      if (flags[k].hidden === on) {
        flags[k].hidden = !on;
        if (on) {
          flags[k].classList.remove('is-in');
          void flags[k].offsetWidth;
          flags[k].classList.add('is-in');
        }
      }
    }
    return est;
  }

  // Mobile toggle
  const toggle = root.querySelector('[data-mf-toggle]');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    root.classList.toggle('is-open', open);
  });

  return {
    update,
    booked(on) {
      root.classList.toggle('is-booked', on);
    },
  };
}
