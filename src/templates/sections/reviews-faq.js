/* 07 — Reviews (real ones only, empty slots until added in business.js)
 * 08 — FAQ (native <details>, keyboard accessible by default) */

import { business } from '../../content/business.js';
import { esc, eyebrow, lines, pad } from '../utils.js';
import { icon } from '../icons.js';

export function reviews(t) {
  const r = t.reviews;
  const real = business.reviews;
  const cards = real.length
    ? real
        .map(
          (rev) => `
      <figure class="review">
        <p class="review__stars" aria-label="${rev.rating}/5">${'★'.repeat(rev.rating)}</p>
        <blockquote><p>${esc(rev.text[t.lang] || rev.text.fr)}</p></blockquote>
        <figcaption class="mono">${esc(rev.name)} — ${esc(rev.source)}</figcaption>
      </figure>`,
        )
        .join('')
    : // Empty slots: ADD REAL GOOGLE/FACEBOOK REVIEWS in business.js → reviews
      [1, 2, 3]
        .map(
          (n) => `
      <div class="review review--empty" aria-hidden="true">
        <span class="mono">${pad(n)}</span>
        <span class="review__slot">${esc(r.slot)}</span>
      </div>`,
        )
        .join('');

  return `
<section class="section reviews" id="reviews" aria-labelledby="reviews-title">
  <div class="wrap">
    <header class="section-head section-head--split">
      ${eyebrow(6, r.eyebrow)}
      ${lines(r.title, 'h2', 'display section-title', 'reviews-title')}
      <p class="section-head__intro">${esc(r.intro)}</p>
    </header>
    <div class="reviews__grid">${cards}</div>
    <a class="link-arrow" href="${esc(business.facebook)}" target="_blank" rel="noopener">${icon('facebook')}<span>${esc(r.cta)}</span>${icon('arrow')}<span class="visually-hidden"> ${esc(t.a11y.newTab)}</span></a>
  </div>
</section>`;
}

export function faq(t) {
  const f = t.faq;
  const items = f.items
    .map(
      (it, i) => `
      <details class="faq-item"${i === 0 ? ' open' : ''}>
        <summary>
          <span class="faq-item__num mono" aria-hidden="true">Q${pad(i + 1)}</span>
          <span class="faq-item__q">${esc(it.q)}</span>
          <span class="faq-item__icon" aria-hidden="true">${icon('plus')}</span>
        </summary>
        <div class="faq-item__a"><p>${esc(it.a)}</p></div>
      </details>`,
    )
    .join('');

  return `
<section class="section faq" id="faq" aria-labelledby="faq-title">
  <div class="wrap faq__grid">
    <header class="faq__head">
      ${eyebrow(7, f.eyebrow)}
      ${lines(f.title, 'h2', 'display section-title section-title--md', 'faq-title')}
    </header>
    <div class="faq__list">${items}</div>
  </div>
</section>`;
}
