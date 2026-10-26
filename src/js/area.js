/* Service-area map: hover/focus/click a region to see what's covered,
 * highlight a bridge, and check a neighbourhood or postal code. */

import { coveredSectors } from '../content/map-data.js';
import { fill } from './i18n.js';

const normalize = (s) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[-'’.]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Returns 'montreal' | 'laval' | null for a free-text place or postal code. */
export function matchArea(input) {
  const q = normalize(input);
  if (!q) return null;
  // Canadian postal codes: H7x = Laval; H1–H5, H8, H9 = island of Montréal
  const pc = q.replace(/\s/g, '').match(/^h(\d)[a-z]?/);
  if (pc) {
    if (pc[1] === '7') return 'laval';
    if ('1234589'.includes(pc[1])) return 'montreal';
    return null;
  }
  for (const [region, list] of Object.entries(coveredSectors)) {
    if (list.some((name) => {
      const n = normalize(name);
      return n === q || (q.length >= 4 && (n.includes(q) || q.includes(n)));
    })) return region;
  }
  return null;
}

export function initArea(strings) {
  const a = strings.area;
  const map = document.querySelector('[data-map]');
  if (!map || !a) return;

  const title = document.querySelector('[data-area-info-title]');
  const text = document.querySelector('[data-area-info-text]');
  const kicker = document.querySelector('[data-area-info-kicker]');
  const regions = map.querySelectorAll('[data-region]');
  const sectors = map.querySelectorAll('[data-sector-region]');
  let locked = null;

  const show = (id) => {
    const r = a.regions[id];
    if (!r) return;
    title.textContent = r.name;
    text.textContent = r.text;
    kicker.textContent = id === 'around' ? a.askUs : a.mapHint;
    regions.forEach((el) => el.classList.toggle('is-active', el.dataset.region === id));
    map.querySelectorAll('[data-region-alias]').forEach((el) => el.classList.toggle('is-active', id === 'around'));
    sectors.forEach((s) => s.classList.toggle('is-dim', id !== 'around' && s.dataset.sectorRegion !== id));
  };
  const reset = () => {
    if (locked) return show(locked);
    regions.forEach((el) => el.classList.remove('is-active'));
    map.querySelectorAll('[data-region-alias]').forEach((el) => el.classList.remove('is-active'));
    sectors.forEach((s) => s.classList.remove('is-dim'));
  };

  regions.forEach((el) => {
    const id = el.dataset.region;
    el.addEventListener('pointerenter', () => show(id));
    el.addEventListener('pointerleave', reset);
    el.addEventListener('focus', () => show(id));
    el.addEventListener('blur', reset);
    const toggle = () => {
      locked = locked === id ? null : id;
      show(id);
    };
    el.addEventListener('click', toggle);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
  // Rive-Sud polygon behaves like Rive-Nord
  map.querySelectorAll('[data-region-alias]').forEach((el) => {
    el.addEventListener('pointerenter', () => show('around'));
    el.addEventListener('pointerleave', reset);
  });

  // Bridges
  document.querySelectorAll('[data-bridge-btn]').forEach((btn) => {
    const line = map.querySelector(`[data-bridge="${btn.dataset.bridgeBtn}"]`);
    const on = () => { line?.classList.add('is-active'); btn.classList.add('is-active'); };
    const off = () => { line?.classList.remove('is-active'); btn.classList.remove('is-active'); };
    btn.addEventListener('pointerenter', on);
    btn.addEventListener('pointerleave', off);
    btn.addEventListener('focus', on);
    btn.addEventListener('blur', off);
  });

  // "Is my area covered?" checker
  const form = document.querySelector('[data-area-check]');
  const result = document.querySelector('[data-area-result]');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = form.querySelector('input').value.trim();
    result.classList.remove('is-yes');
    if (!value) {
      result.textContent = a.checkEmpty;
      return;
    }
    const place = value.length > 40 ? `${value.slice(0, 40)}…` : value;
    const region = matchArea(value);
    if (region) {
      result.textContent = fill(a.checkYes, { place });
      result.classList.add('is-yes');
      show(region);
    } else {
      result.innerHTML = '';
      result.append(fill(a.checkMaybe, { place }), ' ');
      const link = document.createElement('a');
      link.href = `tel:${strings.phone.tel}`;
      link.className = 'link-btn';
      link.textContent = strings.phone.display;
      result.append(link);
      show('around');
    }
  });
}
