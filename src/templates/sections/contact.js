/* 10 — Contact + footer. */

import { business } from '../../content/business.js';
import { esc, eyebrow, fill, lines, placeholderTag } from '../utils.js';
import { icon } from '../icons.js';
import { logo } from './header.js';

export function contact(t) {
  const c = t.contact;
  const { main, alt } = business.phones;
  const addr = business.address;
  const street = t.lang === 'en' ? addr.streetEn : addr.street;
  const lic = business.licence;
  const licence = [lic.rbq, lic.insurance].filter(Boolean).map(esc).join(' · ');

  return `
<section class="section contact" id="contact" aria-labelledby="contact-title">
  <div class="wrap">
    ${eyebrow(9, c.eyebrow)}
    <div class="contact__grid">
      <div>
        ${lines(c.title, 'h2', 'display section-title', 'contact-title')}
        <a class="contact__phone stencil" href="tel:${main.tel}" data-magnetic>
          <span class="label-mono">${esc(c.phoneLabel)}</span>${esc(main.display)}
        </a>
      </div>
      <dl class="contact__list">
        <div><dt class="label-mono">${esc(c.altLabel)}</dt><dd><a href="tel:${alt.tel}">${esc(alt.display)}</a></dd></div>
        <div><dt class="label-mono">${esc(c.addressLabel)}</dt>
          <dd><address>${esc(street)}<br>${esc(addr.district)}, ${esc(addr.region)} ${esc(addr.postalCode)}</address>
          <a class="link-arrow" href="${esc(addr.mapUrl)}" target="_blank" rel="noopener">${icon('pin')}<span>${esc(c.directions)}</span><span class="visually-hidden"> ${esc(t.a11y.newTab)}</span></a></dd></div>
        <div><dt class="label-mono">${esc(c.hoursLabel)}</dt><dd>${esc(c.hoursValue)}</dd></div>
        <div><dt class="label-mono">Facebook</dt><dd><a class="link-arrow" href="${esc(business.facebook)}" target="_blank" rel="noopener">${icon('facebook')}<span>${esc(c.facebook)}</span><span class="visually-hidden"> ${esc(t.a11y.newTab)}</span></a></dd></div>
        <div><dt class="label-mono">${esc(c.licenceLabel)}</dt><dd>${licence || placeholderTag(t)}</dd></div>
      </dl>
    </div>
  </div>
</section>`;
}

export function footer(t, other) {
  const f = t.footer;
  const year = new Date().getFullYear();
  return `
<footer class="site-footer">
  <div class="hazard" aria-hidden="true"></div>
  <div class="wrap site-footer__inner">
    <div class="site-footer__brand">
      ${logo(t, 'wordmark--lg')}
      <p>${esc(f.tagline)}</p>
      <p class="mono">${esc(f.noPeople)}</p>
    </div>
    <nav class="site-footer__nav" aria-label="Footer">
      <a href="#services">${esc(t.nav.services)}</a>
      <a href="#fleet">${esc(t.nav.fleet)}</a>
      <a href="#area">${esc(t.nav.area)}</a>
      <a href="#faq">${esc(t.nav.faq)}</a>
      <a href="#booking">${esc(t.nav.book)}</a>
      <a href="${other.path}" hreflang="${other.locale}" lang="${other.lang}">${esc(t.a11y.langSwitch)}</a>
    </nav>
    <div class="site-footer__legal mono">
      <p>${esc(fill(f.rights, { year }))}</p>
      <a href="#top">${esc(f.top)} ${icon('arrowUp')}</a>
    </div>
  </div>
  <svg class="site-footer__giant" viewBox="0 0 1000 250" aria-hidden="true" focusable="false"><text x="500" y="236" text-anchor="middle">LODICO</text></svg>
</footer>`;
}
