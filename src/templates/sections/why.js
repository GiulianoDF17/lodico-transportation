/* 03 — Why Lodico: asymmetric statement + cargo-label points + counters. */

import { business } from '../../content/business.js';
import { esc, eyebrow, lines, placeholderTag } from '../utils.js';
import { icon } from '../icons.js';
import { photo } from '../photo.js';

export function why(t) {
  const w = t.why;
  const points = w.points
    .map(
      (p, i) => `
      <li class="cargo-label" data-reveal="up">
        <span class="cargo-label__code mono">LT-${String(i + 1).padStart(3, '0')}</span>
        <span class="cargo-label__icon">${icon(p.icon)}</span>
        <h3 class="cargo-label__title">${esc(p.title)}</h3>
        <p>${esc(p.text)}</p>
      </li>`,
    )
    .join('');

  const stats = business.stats
    .map(
      (s) => `
      <div class="stat${s.confirmed ? '' : ' is-placeholder'}">
        <dt class="stat__label">${esc(w.stats[s.id])}${s.confirmed ? '' : ` ${placeholderTag(t)}`}</dt>
        <dd class="stat__value stencil"><span data-count="${s.value}">${s.value}</span>${esc(s.suffix)}</dd>
      </div>`,
    )
    .join('');

  return `
<section class="section why" id="why" aria-labelledby="why-title">
  <div class="wrap why__grid">
    <div class="why__intro">
      ${eyebrow(2, w.eyebrow)}
      ${lines(w.title, 'h2', 'display section-title section-title--md', 'why-title')}
      <p class="why__lead">${esc(w.lead)}</p>
      <div class="why__photo" data-reveal="wipe">
        ${photo({ name: business.photos.team, alt: w.photoAlt, t, cls: 'why__img' })}
      </div>
    </div>
    <ul class="why__points">${points}</ul>
  </div>
  <div class="wrap">
    <dl class="stats" data-stats>${stats}</dl>
  </div>
</section>`;
}
