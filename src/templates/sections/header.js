/* Header: hazard-stripe scroll progress, logo, nav, language switch, phone,
 * book button, mobile menu. Also the sticky mobile book + call bar. */

import { business } from '../../content/business.js';
import { esc } from '../utils.js';
import { icon } from '../icons.js';

/** Logo: real file if set in business.js, otherwise the temporary wordmark. */
export function logo(t, size = '') {
  if (business.logo) {
    return `<img class="logo-img ${size}" src="${esc(business.logo)}" alt="Lodico Transport" width="160" height="48">`;
  }
  // TEMPORARY WORDMARK — replace with the real logo (see README)
  return `<span class="wordmark ${size}"><span class="wordmark__mark" aria-hidden="true"></span><span class="wordmark__name">Lodico</span> <span class="wordmark__sub">Transport</span></span>`;
}

export function header(t, other) {
  const nav = ['services', 'fleet', 'area', 'faq', 'contact'];
  const links = nav.map((k) => `<li><a href="#${k}" data-nav>${esc(t.nav[k])}</a></li>`).join('');
  const phone = business.phones.main;

  return `
<a class="skip-link" href="#main">${esc(t.a11y.skip)}</a>

<div class="scroll-progress" aria-hidden="true">
  <div class="scroll-progress__fill" data-progress></div>
</div>

<header class="site-header" data-header>
  <div class="site-header__inner">
    <a class="site-header__logo" href="${t.path}">${logo(t)}<span class="visually-hidden"> — ${esc(t.a11y.home)}</span></a>

    <nav class="site-nav" aria-label="${esc(t.a11y.menu)}">
      <ul>${links}</ul>
    </nav>

    <div class="site-header__actions">
      <a class="lang-switch" href="${other.path}" hreflang="${other.locale}" lang="${other.lang}" data-lang-switch>
        <span class="lang-switch__on" aria-hidden="true">${t.lang.toUpperCase()}</span><span class="lang-switch__off">${esc(t.nav.langShort)}<span class="visually-hidden"> — ${esc(t.a11y.langSwitch)}</span></span>
      </a>
      <a class="site-header__phone" href="tel:${phone.tel}">${icon('phone')}<span>${esc(phone.display)}</span></a>
      <a class="btn btn--red btn--sm site-header__book" href="#booking" data-magnetic><span>${esc(t.nav.book)}</span></a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mobile-nav" data-menu-btn>
        <span class="visually-hidden" data-menu-label data-open="${esc(t.a11y.menu)}" data-close="${esc(t.a11y.closeMenu)}">${esc(t.a11y.menu)}</span>
        <span class="menu-btn__bars" aria-hidden="true"><i></i><i></i></span>
      </button>
    </div>
  </div>
</header>

<div class="mobile-nav" id="mobile-nav" data-mobile-nav hidden>
  <ul>${nav
    .map((k, i) => `<li><a href="#${k}" data-nav><span class="mono">0${i + 1}</span>${esc(t.nav[k])}</a></li>`)
    .join('')}</ul>
  <div class="mobile-nav__foot">
    <a class="btn btn--red" href="#booking" data-nav>${esc(t.nav.book)} ${icon('arrow')}</a>
    <a class="btn btn--ghost" href="tel:${phone.tel}">${icon('phone')} ${esc(phone.display)}</a>
  </div>
</div>`;
}

/** Sticky book + call bar, phones only. */
export function mobileBar(t) {
  const phone = business.phones.main;
  return `
<div class="mobile-bar" data-mobile-bar>
  <a class="mobile-bar__call" href="tel:${phone.tel}" aria-label="${esc(t.nav.call)} ${esc(phone.display)}">${icon('phone')}<span>${esc(t.nav.call)}</span></a>
  <a class="mobile-bar__book" href="#booking">${esc(t.nav.book)} ${icon('arrow')}</a>
</div>`;
}
