/* 06 — Service area: interactive stylized map of Montréal + Laval with the
 * bridges, Lodico's base, and an "is my area covered?" checker. */

import {
  MAP_W, MAP_H, montreal, laval, riveNord, riveSud, bridges, base, mapSectors, roads,
} from '../../content/map-data.js';
import { esc, eyebrow, lines } from '../utils.js';

const Y = (y) => +(MAP_H - y).toFixed(2);
const pts = (poly) => poly.map(([x, y]) => `${x},${Y(y)}`).join(' ');

/** y of a polyline (ordered by x) at a given x */
function yAt(line, x) {
  for (let i = 0; i < line.length - 1; i++) {
    const [x1, y1] = line[i];
    const [x2, y2] = line[i + 1];
    if (x >= Math.min(x1, x2) && x <= Math.max(x1, x2)) return y1 + ((x - x1) / (x2 - x1)) * (y2 - y1);
  }
  return line[0][1];
}
const mtlNorthShore = montreal.slice(0, 11);
const lavalSouthShore = laval.slice(6).reverse();

export function area(t) {
  const a = t.area;
  const bridgeLines = bridges
    .map((b) => {
      const y1 = Y(yAt(lavalSouthShore, b.x)) - 0.6;
      const y2 = Y(yAt(mtlNorthShore, b.x)) + 0.6;
      return `<line class="map__bridge" data-bridge="${b.id}" x1="${b.x}" y1="${y1.toFixed(2)}" x2="${b.x}" y2="${y2.toFixed(2)}"/>`;
    })
    .join('');

  const sectors = mapSectors
    .map(
      (s) => `<g class="map__sector${s.name === 'Montréal-Nord' ? ' is-base' : ''}" data-sector-region="${s.region}">
        <circle cx="${s.x}" cy="${Y(s.y)}" r="0.55"/><text x="${s.x + 1.1}" y="${Y(s.y) + 0.55}">${esc(s.name)}</text></g>`,
    )
    .join('');

  const region = (id) =>
    `role="button" tabindex="0" data-region="${id}" aria-label="${esc(a.regions[id].name)}"`;

  return `
<section class="section area" id="area" aria-labelledby="area-title">
  <div class="wrap area__grid">
    <div class="area__text">
      ${eyebrow(5, a.eyebrow)}
      ${lines(a.title, 'h2', 'display section-title', 'area-title')}
      <p class="area__lead">${esc(a.intro)}</p>

      <form class="area-check" data-area-check novalidate>
        <label class="label-mono" for="area-input">${esc(a.checkLabel)}</label>
        <div class="area-check__row">
          <input id="area-input" type="text" autocomplete="postal-code" placeholder="${esc(a.checkPlaceholder)}" aria-describedby="area-result">
          <button class="btn btn--red" type="submit">${esc(a.checkButton)}</button>
        </div>
        <p class="area-check__result" id="area-result" role="status" aria-live="polite" data-area-result></p>
      </form>

      <div class="area-info" data-area-info aria-live="polite">
        <p class="label-mono" data-area-info-kicker>${esc(a.mapHint)}</p>
        <h3 class="area-info__title" data-area-info-title>${esc(a.regions.montreal.name)} + ${esc(a.regions.laval.name)}</h3>
        <p data-area-info-text>${esc(a.intro)}</p>
      </div>

      <div class="area-bridges">
        <p class="label-mono">${esc(a.bridgesTitle)}</p>
        <ul>${bridges.map((b) => `<li><button type="button" data-bridge-btn="${b.id}">${esc(b.name)}</button></li>`).join('')}</ul>
      </div>
    </div>

    <figure class="area__map" data-reveal="wipe">
      <svg class="map" viewBox="0 0 ${MAP_W} ${MAP_H}" role="group" aria-labelledby="map-title" data-map>
        <title id="map-title">${esc(a.mapAlt)}</title>
        <defs>
          <pattern id="map-hatch" width="1.6" height="1.6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="1.6" stroke="#2a2a2a" stroke-width="0.5"/>
          </pattern>
          <pattern id="map-grid" width="5" height="5" patternUnits="userSpaceOnUse">
            <path d="M5 0H0V5" fill="none" stroke="#181818" stroke-width="0.15"/>
          </pattern>
        </defs>
        <rect width="${MAP_W}" height="${MAP_H}" fill="url(#map-grid)"/>
        <polygon class="map__shore" points="${pts(riveNord)}" fill="url(#map-hatch)" ${region('around')}/>
        <polygon class="map__shore" points="${pts(riveSud)}" fill="url(#map-hatch)" data-region-alias="around" aria-hidden="true"/>
        <text class="map__ask" x="6" y="${Y(60.6)}">RIVE-NORD — ${esc(a.askUs.toUpperCase())}</text>
        <text class="map__ask" x="80" y="${Y(4)}" text-anchor="middle">RIVE-SUD — ${esc(a.askUs.toUpperCase())}</text>
        <polygon class="map__land" points="${pts(laval)}" ${region('laval')}/>
        <polygon class="map__land" points="${pts(montreal)}" ${region('montreal')}/>
        <g class="map__roads" aria-hidden="true">${roads.map((r) => `<polyline points="${pts(r)}"/>`).join('')}</g>
        <g class="map__bridges" aria-hidden="true">${bridgeLines}</g>
        <text class="map__region-name" x="50" y="${Y(52.5)}" text-anchor="middle" aria-hidden="true">LAVAL</text>
        <text class="map__region-name" x="38" y="${Y(23)}" text-anchor="middle" aria-hidden="true">${t.lang === 'fr' ? 'MONTRÉAL' : 'MONTREAL'}</text>
        <text class="map__river" x="70" y="${Y(46.1)}" aria-hidden="true">RIV. DES PRAIRIES</text>
        <g class="map__sectors" aria-hidden="true">${sectors}</g>
        <g class="map__base" aria-hidden="true" transform="translate(${base[0]} ${Y(base[1])})">
          <circle class="map__base-pulse" r="2.4"/>
          <rect x="-1" y="-1" width="2" height="2"/>
          <text x="2" y="-1.6">${esc(a.base.toUpperCase())}</text>
        </g>
      </svg>
      <figcaption class="map__legend mono" aria-hidden="true">
        <span><i class="key key--land"></i>${esc(a.regions.montreal.name)} · ${esc(a.regions.laval.name)}</span>
        <span><i class="key key--shore"></i>${esc(a.askUs)}</span>
        <span><i class="key key--base"></i>${esc(a.base)}</span>
      </figcaption>
    </figure>
  </div>
</section>`;
}

