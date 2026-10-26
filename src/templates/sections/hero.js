/* 01 — Hero: headline, CTAs, shipping-manifest strip, and the stage where
 * the 3D truck loads and drives Laval → Montréal (desktop). Phones and
 * reduced-motion users get the static poster illustration instead. */

import { business } from '../../content/business.js';
import { esc } from '../utils.js';
import { icon } from '../icons.js';
import { truckSvg } from '../truck-svg.js';

function poster(t) {
  const [, to] = t.hero.manifest;
  return `
<svg class="hero-poster__map" viewBox="0 0 640 400" aria-hidden="true" focusable="false">
  <defs>
    <pattern id="poster-grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M32 0H0V32" fill="none" stroke="#1d1d1d" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="640" height="400" fill="url(#poster-grid)"/>
  <path d="M0 150 L120 132 L260 140 L400 128 L520 118 L640 104" fill="none" stroke="#2c2c2c" stroke-width="2"/>
  <path d="M0 176 L130 160 L270 168 L410 156 L530 148 L640 136" fill="none" stroke="#2c2c2c" stroke-width="2"/>
  <text x="24" y="60" class="poster__city">LAVAL</text>
  <text x="616" y="372" text-anchor="end" class="poster__city">${t.lang === 'fr' ? 'MONTRÉAL' : 'MONTREAL'}</text>
  <text x="332" y="158" class="poster__river">RIVIÈRE DES PRAIRIES</text>
  <path class="poster__route" d="M96 84 C 200 96, 300 100, 306 150 S 330 260, 540 318" fill="none" stroke="#E10600" stroke-width="5" stroke-linecap="square"/>
  <rect x="88" y="76" width="16" height="16" fill="#E10600"/>
  <circle cx="540" cy="318" r="9" fill="none" stroke="#E10600" stroke-width="4"/>
  <text x="112" y="104" class="poster__tag">A · ${esc(t.hero.manifest[0][0].toUpperCase())}</text>
  <text x="530" y="300" text-anchor="end" class="poster__tag">B · ${esc(to[0].toUpperCase())}</text>
  <text x="318" y="128" class="poster__tag poster__tag--dim">PONT PIE-IX</text>
</svg>
<div class="hero-poster__truck">${truckSvg({ ft: 20 })}</div>`;
}

export function hero(t) {
  const phone = business.phones.main;
  const title = t.hero.title
    .map((l, i) => `<span class="line"><span class="line__inner${i === 1 ? ' is-red' : ''}">${esc(l)}</span></span>`)
    .join(' ');

  return `
<section class="hero" id="top" data-hero aria-labelledby="hero-title">
  <div class="hero__stage" data-hero-stage>
    <div class="hero__visual">
      <div class="hero-poster" data-hero-poster role="img" aria-label="${esc(t.hero.posterAlt)}">${poster(t)}</div>
      <canvas class="hero__canvas" data-hero-canvas role="img" aria-label="${esc(t.hero.sceneAlt)}"></canvas>
    </div>

    <div class="hero__content">
      <p class="hero__kicker mono">${esc(t.hero.kicker)}</p>
      <h1 class="hero__title display" id="hero-title" data-hero-title>${title}</h1>
      <p class="hero__lead">${esc(t.hero.lead)}</p>
      <div class="hero__ctas">
        <a class="btn btn--red btn--lg" href="#booking" data-magnetic><span>${esc(t.hero.ctaBook)}</span>${icon('arrow')}</a>
        <a class="btn btn--ghost btn--lg" href="tel:${phone.tel}" data-magnetic>${icon('phone')}<span>${esc(t.hero.ctaCall)} <span class="mono">${esc(phone.display)}</span></span></a>
      </div>
      <dl class="hero__manifest">
        ${t.hero.manifest.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}
      </dl>
    </div>

    <div class="hero__hud" aria-hidden="true" data-hud>
      <div class="hud-load">
        <span class="hud-load__label">${esc(t.hero.hudLoad)}</span>
        <span class="hud-load__value"><b data-hud-load>000</b>%</span>
        <span class="hud-load__bar"><i data-hud-bar></i></span>
      </div>
      <ol class="hud-phases">
        ${t.hero.hudPhases.map((p, i) => `<li data-hud-phase="${i}"><span>0${i + 1}</span>${esc(p)}</li>`).join('')}
      </ol>
    </div>

    <div class="hero__stamp stamp" data-hero-stamp aria-hidden="true">${esc(t.hero.stamp)}</div>
    <p class="hero__hint mono" aria-hidden="true" data-hero-hint>${esc(t.hero.scrollHint)} ${icon('arrowDown')}</p>
  </div>
</section>`;
}
