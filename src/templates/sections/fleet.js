/* 05 — Fleet: pinned horizontal scroll on desktop (swipe on phones). The
 * trucks are drawn to scale. "Choose this truck" pre-fills the form. */

import { business } from '../../content/business.js';
import { esc, eyebrow, fill, lines, placeholderTag } from '../utils.js';
import { icon } from '../icons.js';
import { truckSvg } from '../truck-svg.js';
import { photo } from '../photo.js';

export function fleet(t) {
  const f = t.fleet;
  const maxFt = Math.max(...business.fleet.map((x) => x.lengthFt));

  const panels = business.fleet
    .map((truck, i) => {
      const copy = f.trucks[truck.id];
      return `
      <article class="fleet-card" aria-labelledby="truck-${truck.id}">
        <header class="fleet-card__head">
          <span class="fleet-card__ft stencil" aria-hidden="true">${truck.lengthFt}<small>${esc(f.lengthUnit)}</small></span>
          <div>
            <p class="label-mono">0${i + 1} / 0${business.fleet.length}${truck.confirmed ? '' : ` ${placeholderTag(t)}`}</p>
            <h3 class="fleet-card__name" id="truck-${truck.id}">${esc(copy.name)}</h3>
          </div>
        </header>
        <div class="fleet-card__art">
          ${truckSvg({ ft: truck.lengthFt, maxFt, title: fill(f.truckAlt, { name: copy.name }) })}
          <div class="fleet-card__ruler" aria-hidden="true" style="--ft:${truck.lengthFt};--max:${maxFt}"><span>${truck.lengthFt} ${esc(f.lengthUnit)}</span></div>
        </div>
        <div class="fleet-card__info">
          <p class="fleet-card__fits"><span class="label-mono">${esc(f.fitsLabel)}</span>${esc(copy.fits)}</p>
          <ul>${copy.list.map((x) => `<li>${icon('check')}${esc(x)}</li>`).join('')}</ul>
          <a class="btn btn--line" href="#booking" data-book-truck="${truck.id}" data-magnetic><span>${esc(f.choose)}</span>${icon('arrow')}<span class="visually-hidden"> — ${esc(copy.name)}</span></a>
        </div>
        ${business.photos[`truck${truck.id}`] ? `<div class="fleet-card__photo">${photo({ name: business.photos[`truck${truck.id}`], alt: copy.name, t })}</div>` : ''}
      </article>`;
    })
    .join('');

  return `
<section class="section fleet" id="fleet" aria-labelledby="fleet-title" data-fleet>
  <div class="fleet__pin" data-fleet-pin>
    <div class="fleet__track" data-fleet-track>
      <div class="fleet__intro">
        ${eyebrow(4, f.eyebrow)}
        ${lines(f.title, 'h2', 'display section-title', 'fleet-title')}
        <p class="fleet__lead">${esc(f.intro)}</p>
        <p class="fine-print">${esc(f.note)}</p>
        <p class="fleet__hint mono" aria-hidden="true">${esc(f.dragHint)} ${icon('arrow')}</p>
      </div>
      ${panels}
    </div>
    <div class="fleet__progress" aria-hidden="true"><i data-fleet-progress></i></div>
  </div>
</section>`;
}
