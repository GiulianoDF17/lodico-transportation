/* 02 — Services: an editorial manifest list (not identical cards). Each row
 * has what's included and a "Book this" button that pre-selects the job
 * type in the booking form. Also the hazard "tape" marquee divider. */

import { esc, eyebrow, lines, pad } from '../utils.js';
import { icon } from '../icons.js';

const ICONS = { home: 'home', office: 'office', furniture: 'store', single: 'fridge', small: 'box' };
// Service → booking job type
const JOB = { home: 'home', office: 'office', furniture: 'furniture', single: 'single', small: 'other' };

export function services(t) {
  const s = t.services;
  const rows = s.items
    .map(
      (item, i) => `
    <li class="svc" data-reveal="row">
      <span class="svc__num stencil" aria-hidden="true">${pad(i + 1)}</span>
      <div class="svc__main">
        <h3 class="svc__title">${esc(item.title)}</h3>
        <p class="svc__text">${esc(item.text)}</p>
      </div>
      <div class="svc__incl">
        <p class="label-mono">${esc(s.includedLabel)}</p>
        <ul>${item.includes.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
      </div>
      <div class="svc__cta">
        <a class="btn btn--line" href="#booking" data-book-job="${JOB[item.id]}" data-magnetic>
          <span>${esc(s.bookThis)}</span>${icon('arrow')}<span class="visually-hidden"> — ${esc(item.title)}</span>
        </a>
      </div>
      <span class="svc__icon" aria-hidden="true">${icon(ICONS[item.id])}</span>
    </li>`,
    )
    .join('');

  return `
<section class="section services" id="services" aria-labelledby="services-title">
  <div class="wrap">
    <header class="section-head section-head--split">
      ${eyebrow(1, s.eyebrow)}
      ${lines(s.title, 'h2', 'display section-title', 'services-title')}
      <p class="section-head__intro">${esc(s.intro)}</p>
    </header>
    <ol class="svc-list">${rows}</ol>
    <p class="fine-print">${esc(s.note)}</p>
  </div>
</section>`;
}

export function tape(t, variant = '') {
  const items = t.tape
    .map((x) => `<span class="tape__item">${esc(x)}<span class="tape__arrows">${icon('arrowUp')}${icon('arrowUp')}</span></span>`)
    .join('');
  return `
<div class="tape ${variant}" aria-hidden="true">
  <div class="tape__track" data-tape>${items}${items}${items}</div>
</div>`;
}
