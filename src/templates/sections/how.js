/* 04 — How it works: steps on the right; on desktop the 3D moving box on the
 * left opens/closes as you scroll through them. Static box drawings are the
 * fallback (phones, reduced motion, no WebGL). */

import { esc, eyebrow, lines, pad } from '../utils.js';

/** Flat isometric box drawing: state 'closed' | 'open' | 'taped' | 'done' */
function boxSvg(state) {
  const open = state === 'open' || state === 'done';
  const flaps = open
    ? `<path d="M20 38 L4 24 L44 6 L60 20 Z" fill="#c69a6b"/><path d="M60 20 L76 6 L116 24 L100 38 Z" fill="#a87c50"/>`
    : `<path d="M20 38 L60 20 L100 38 L60 56 Z" fill="#c69a6b"/><path d="M60 20 V56" stroke="#8a6440" stroke-width="2"/>`;
  const tape = state === 'taped' ? `<path d="M40 29 L80 47" stroke="#e8e3d6" stroke-width="7"/>` : '';
  const stamp =
    state === 'done'
      ? `<g transform="rotate(-12 60 84)"><rect x="34" y="74" width="52" height="18" fill="none" stroke="#E10600" stroke-width="3"/><path d="M42 83 l6 5 12-10" stroke="#E10600" stroke-width="3" fill="none"/></g>`
      : '';
  return `<svg viewBox="0 0 120 120" aria-hidden="true" focusable="false">
    <path d="M20 38 L60 56 V108 L20 90 Z" fill="#b48455"/>
    <path d="M60 56 L100 38 V90 L60 108 Z" fill="#94683d"/>
    ${flaps}${tape}
    <rect x="68" y="70" width="22" height="14" fill="#F2EFE8" transform="skewY(-24) translate(0 32)"/>
    ${stamp}
  </svg>`;
}

const STATES = ['closed', 'open', 'taped', 'done'];

export function how(t) {
  const h = t.how;
  const steps = h.steps
    .map(
      (s, i) => `
      <li class="how-step" data-how-step="${i}">
        <span class="how-step__num stencil" aria-hidden="true">${pad(i + 1)}</span>
        <div class="how-step__body">
          <h3 class="how-step__title">${esc(s.title)}</h3>
          <p>${esc(s.text)}</p>
        </div>
        <span class="how-step__box" aria-hidden="true">${boxSvg(STATES[i])}</span>
      </li>`,
    )
    .join('');

  return `
<section class="section how" id="how" aria-labelledby="how-title" data-how>
  <div class="wrap how__grid" data-how-pin>
    <div class="how__visual" aria-hidden="true">
      <canvas class="how__canvas" data-how-canvas></canvas>
      <div class="how__fallback">${boxSvg('open')}</div>
      <div class="how__counter stencil"><span data-how-current>01</span><span class="how__counter-total">/04</span></div>
    </div>
    <div class="how__content">
      ${eyebrow(3, h.eyebrow)}
      ${lines(h.title, 'h2', 'display section-title section-title--md', 'how-title')}
      <ol class="how-steps">${steps}</ol>
    </div>
  </div>
</section>`;
}
