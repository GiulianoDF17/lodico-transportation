/* 09 — Booking form (main conversion feature).
 * Rendered as real HTML so it works with Netlify Forms detection and is
 * readable without JS. src/js/booking/ adds the multi-step behaviour,
 * validation, live manifest, truck estimate, saving and submission. */

import { business, formConfig } from '../../content/business.js';
import { esc, eyebrow, fill, lines } from '../utils.js';
import { icon } from '../icons.js';

const JOB_ICONS = { home: 'home', office: 'office', furniture: 'store', single: 'fridge', other: 'box' };

/** Group of radio "chips" or "cards" inside a fieldset with legend. */
function radios({ name, legend, options, type = 'chip', required = true, t, id }) {
  const opts = Object.entries(options)
    .map(([value, o]) => {
      const label = typeof o === 'string' ? o : o.label;
      const hint = typeof o === 'string' ? '' : o.hint;
      const ic = type === 'card' ? `<span class="choice__icon">${icon(JOB_ICONS[value] || 'box')}</span>` : '';
      return `
        <label class="choice choice--${type}">
          <input type="radio" name="${name}" value="${esc(value)}"${required ? ' required' : ''}>
          <span class="choice__box">${ic}<span class="choice__label">${esc(label)}</span>${hint ? `<span class="choice__hint">${esc(hint)}</span>` : ''}</span>
        </label>`;
    })
    .join('');
  return `
    <fieldset class="field field--group" data-field="${name}"${id ? ` id="${id}"` : ''} aria-describedby="err-${name}">
      <legend class="field__label">${esc(legend)}${required ? '' : ` <span class="field__opt">(${esc(t.booking.optional)})</span>`}</legend>
      <div class="choices choices--${type}">${opts}</div>
      <p class="field__error" id="err-${name}" data-error-for="${name}"></p>
    </fieldset>`;
}

function input({ name, label, type = 'text', required = true, t, attrs = '', hint = '' }) {
  const describedBy = [hint ? `hint-${name}` : '', `err-${name}`].filter(Boolean).join(' ');
  return `
    <div class="field" data-field="${name}">
      <label class="field__label" for="f-${name}">${esc(label)}${required ? '' : ` <span class="field__opt">(${esc(t.booking.optional)})</span>`}</label>
      ${hint ? `<p class="field__hint" id="hint-${name}">${esc(hint)}</p>` : ''}
      <input class="field__input" id="f-${name}" name="${name}" type="${type}"${required ? ' required aria-required="true"' : ''} aria-describedby="${describedBy}" ${attrs}>
      <p class="field__error" id="err-${name}" data-error-for="${name}"></p>
    </div>`;
}

function select({ name, label, options, t }) {
  return `
    <div class="field" data-field="${name}">
      <label class="field__label" for="f-${name}">${esc(label)}</label>
      <div class="field__select">
        <select class="field__input" id="f-${name}" name="${name}">
          ${Object.entries(options).map(([v, l]) => `<option value="${esc(v)}">${esc(l)}</option>`).join('')}
        </select>
      </div>
    </div>`;
}

function place(prefix, title, b, t) {
  return `
    <fieldset class="place" data-place="${prefix}">
      <legend class="place__title"><span class="place__tag mono">${prefix === 'pickup' ? 'A' : 'B'}</span>${esc(title)}</legend>
      ${input({ name: `${prefix}_address`, label: b.address, t, attrs: `autocomplete="${prefix === 'pickup' ? 'section-pickup street-address' : 'section-dropoff street-address'}" placeholder="${esc(b.addressPlaceholder)}"` })}
      <div class="field-row">
        ${select({ name: `${prefix}_floor`, label: b.floor, options: b.floors, t })}
        ${select({ name: `${prefix}_access`, label: b.access, options: b.accesses, t })}
      </div>
    </fieldset>`;
}

export function booking(t) {
  const b = t.booking;
  const total = b.steps.length;

  const stepNav = b.steps
    .map(
      (s, i) => `<li class="bsteps__item${i === 0 ? ' is-current' : ''}" data-step-dot="${i + 1}"${i === 0 ? ' aria-current="step"' : ''}>
        <span class="bsteps__num">${i + 1}</span><span class="bsteps__label">${esc(s)}</span></li>`,
    )
    .join('');

  const catalogOptions = Object.entries(b.catalog)
    .map(([v, l]) => `<option value="${v}">${esc(l)}</option>`)
    .join('');

  return `
<section class="section booking" id="booking" aria-labelledby="booking-title">
  <div class="wrap">
    <header class="booking__head">
      ${eyebrow(8, b.eyebrow)}
      ${lines(b.title, 'h2', 'display section-title section-title--md', 'booking-title')}
      <p class="booking__intro">${esc(b.intro)}</p>
    </header>

    <div class="booking__grid">
      <div class="booking__main">
        <form class="bform" name="${formConfig.formName}" method="POST" action="${t.path}#booking"
              data-netlify="true" netlify-honeypot="bot-field" enctype="multipart/form-data" novalidate data-booking>
          <input type="hidden" name="form-name" value="${formConfig.formName}">
          <!-- Spam honeypot: humans never see or fill this -->
          <p class="hp" aria-hidden="true"><label>Leave empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
          <input type="hidden" name="reference" data-hidden="reference">
          <input type="hidden" name="items_list" data-hidden="items">
          <input type="hidden" name="truck_estimate" data-hidden="truck">
          <input type="hidden" name="site_language" value="${t.lang}">
          <input type="hidden" name="summary" data-hidden="summary">
          <!-- Netlify Forms needs these to exist in the HTML; files are attached by JS -->
          <input type="file" name="photo1" hidden tabindex="-1" aria-hidden="true">
          <input type="file" name="photo2" hidden tabindex="-1" aria-hidden="true">
          <input type="file" name="photo3" hidden tabindex="-1" aria-hidden="true">

          <div class="bform__top">
            <ol class="bsteps" aria-label="${esc(fill(b.stepOf, { n: 1, total }))}" data-steps-nav>${stepNav}</ol>
            <div class="bform__bar" aria-hidden="true"><i data-step-bar></i></div>
            <p class="visually-hidden" aria-live="polite" data-step-status>${esc(fill(b.stepOf, { n: 1, total }))}</p>
          </div>

          <div class="bform__restored mono" data-restored hidden>
            <span>${esc(b.restored)}</span>
            <button type="button" class="link-btn" data-clear>${esc(b.clear)}</button>
          </div>

          <div class="bform__summary" role="alert" tabindex="-1" data-error-summary hidden></div>

          <!-- STEP 1 — job type -->
          <div class="bstep is-active" data-step="1" role="group" aria-labelledby="bstep-1">
            <h3 class="bstep__title" id="bstep-1" tabindex="-1"><span class="mono">01</span>${esc(b.steps[0])}</h3>
            ${radios({ name: 'job_type', legend: b.jobLegend, options: b.jobs, type: 'card', t })}
          </div>

          <!-- STEP 2 — route, date, time -->
          <div class="bstep" data-step="2" role="group" aria-labelledby="bstep-2" hidden>
            <h3 class="bstep__title" id="bstep-2" tabindex="-1"><span class="mono">02</span>${esc(b.steps[1])}</h3>
            <div class="places">
              ${place('pickup', b.pickup, b, t)}
              ${place('dropoff', b.dropoff, b, t)}
            </div>
            <div class="field-row field-row--date">
              ${input({ name: 'date', label: b.date, type: 'date', t, attrs: 'data-date' })}
              ${radios({ name: 'time_window', legend: b.time, options: b.times, t })}
            </div>
            <p class="bform__note" data-july1 hidden>${icon('calendar')}${esc(b.july1)}</p>
          </div>

          <!-- STEP 3 — inventory -->
          <div class="bstep" data-step="3" role="group" aria-labelledby="bstep-3" hidden>
            <h3 class="bstep__title" id="bstep-3" tabindex="-1"><span class="mono">03</span>${esc(b.steps[2])}</h3>
            <div data-size-home>${radios({ name: 'move_size', legend: b.sizeLegend, options: b.sizes, required: false, t })}</div>
            <div data-size-office hidden>${radios({ name: 'office_size', legend: b.sizeLegend, options: b.officeSizes, required: false, t })}</div>

            <fieldset class="field field--group items" data-field="items" aria-describedby="items-hint err-items">
              <legend class="field__label">${esc(b.itemsLegend)}</legend>
              <p class="field__hint" id="items-hint" data-items-hint>${esc(b.itemsHint)}</p>
              <div class="items__add">
                <div class="field">
                  <label class="field__label field__label--sm" for="item-type">${esc(b.itemType)}</label>
                  <div class="field__select"><select class="field__input" id="item-type" data-item-type>${catalogOptions}</select></div>
                </div>
                <div class="field field--qty">
                  <label class="field__label field__label--sm" for="item-qty">${esc(b.itemQty)}</label>
                  <div class="qty">
                    <button type="button" class="qty__btn" data-qty="-1" aria-label="−1">${icon('minus')}</button>
                    <input class="field__input" id="item-qty" type="number" min="1" max="99" value="1" inputmode="numeric" data-item-qty>
                    <button type="button" class="qty__btn" data-qty="1" aria-label="+1">${icon('plus')}</button>
                  </div>
                </div>
                <div class="field field--custom" data-item-custom-wrap hidden>
                  <label class="field__label field__label--sm" for="item-custom">${esc(b.itemCustom)}</label>
                  <input class="field__input" id="item-custom" type="text" maxlength="60" data-item-custom>
                </div>
                <button type="button" class="btn btn--line btn--add" data-item-add>${icon('plus')}<span>${esc(b.addItem)}</span></button>
              </div>
              <ul class="items__list" data-items-list aria-live="polite"><li class="items__empty">${esc(b.noItems)}</li></ul>
              <p class="field__error" id="err-items" data-error-for="items"></p>
            </fieldset>

            <div class="checks">
              <label class="check"><input type="checkbox" name="fragile" value="yes"><span class="check__box">${icon('check')}</span><span>${esc(b.fragile)}</span></label>
              <label class="check"><input type="checkbox" name="heavy" value="yes"><span class="check__box">${icon('check')}</span><span>${esc(b.heavy)}</span></label>
            </div>

            <div class="field" data-field="notes">
              <label class="field__label" for="f-notes">${esc(b.notes)} <span class="field__opt">(${esc(b.optional)})</span></label>
              <textarea class="field__input" id="f-notes" name="notes" rows="3" maxlength="1000" placeholder="${esc(b.notesPlaceholder)}"></textarea>
            </div>

            <div class="field photos" data-field="photos">
              <span class="field__label" id="photos-label">${esc(b.photos)} <span class="field__opt">(${esc(b.optional)})</span></span>
              <p class="field__hint" id="photos-hint">${esc(b.photosHint)}</p>
              <label class="photos__drop" data-photos-drop>
                <input class="visually-hidden" type="file" accept="image/*" multiple data-photos-input aria-labelledby="photos-label" aria-describedby="photos-hint err-photos">
                ${icon('camera')}<span>${esc(b.photosButton)}</span>
              </label>
              <ul class="photos__list" data-photos-list></ul>
              <p class="field__hint" data-photos-notsent hidden>${esc(b.photosNotSent)}</p>
              <p class="field__error" id="err-photos" data-error-for="photos"></p>
            </div>
          </div>

          <!-- STEP 4 — contact -->
          <div class="bstep" data-step="4" role="group" aria-labelledby="bstep-4" hidden>
            <h3 class="bstep__title" id="bstep-4" tabindex="-1"><span class="mono">04</span>${esc(b.steps[3])}</h3>
            <div class="field-row">
              ${input({ name: 'name', label: b.name, t, attrs: 'autocomplete="name" maxlength="80"' })}
              ${input({ name: 'company', label: b.company, required: false, t, attrs: 'autocomplete="organization" maxlength="80"' })}
            </div>
            <div class="field-row">
              ${input({ name: 'phone', label: b.phone, type: 'tel', t, attrs: `autocomplete="tel" inputmode="tel" placeholder="${esc(b.phonePlaceholder)}"` })}
              ${input({ name: 'email', label: b.email, type: 'email', required: false, t, attrs: `autocomplete="email" inputmode="email" placeholder="${esc(b.emailPlaceholder)}"` })}
            </div>
            <div class="field-row">
              ${radios({ name: 'contact_method', legend: b.contactLegend, options: b.contacts, t })}
              ${radios({ name: 'language', legend: b.langLegend, options: b.langs, t })}
            </div>
          </div>

          <!-- STEP 5 — review -->
          <div class="bstep" data-step="5" role="group" aria-labelledby="bstep-5" hidden>
            <h3 class="bstep__title" id="bstep-5" tabindex="-1"><span class="mono">05</span>${esc(b.reviewTitle)}</h3>
            <p class="bstep__intro">${esc(b.reviewIntro)}</p>
            <div class="review-sheet" data-review></div>
            <p class="fine-print">${esc(b.consent)}</p>
          </div>

          <div class="bform__nav">
            <button type="button" class="btn btn--ghost" data-back hidden>${icon('arrow', 'icon--flip')}<span>${esc(b.back)}</span></button>
            <button type="button" class="btn btn--red btn--lg" data-next data-magnetic><span>${esc(b.next)}</span>${icon('arrow')}</button>
            <button type="submit" class="btn btn--red btn--lg" data-submit hidden data-magnetic><span data-submit-label>${esc(b.submit)}</span>${icon('arrow')}</button>
          </div>
          <p class="bform__saved mono" data-saved aria-live="polite"></p>
          <p class="bform__fail" role="alert" data-fail hidden></p>
        </form>

        <div class="bsuccess" data-success hidden tabindex="-1" aria-labelledby="bsuccess-title">
          <p class="stamp stamp--big" data-success-stamp>${esc(b.success.stamp)}</p>
          <h3 class="display bsuccess__title" id="bsuccess-title">${esc(b.success.title)}</h3>
          <p class="bsuccess__text">${esc(fill(b.success.text, { days: business.callbackBusinessDays }))}</p>
          <p class="bsuccess__ref"><span class="label-mono">${esc(b.success.refLabel)}</span><strong class="mono" data-success-ref></strong></p>
          <div class="bsuccess__actions">
            <a class="btn btn--ghost" href="tel:${business.phones.main.tel}">${icon('phone')}<span>${esc(b.success.call)} — ${esc(business.phones.main.display)}</span></a>
            <button type="button" class="btn btn--line" data-again>${esc(b.success.again)}</button>
          </div>
        </div>
      </div>

      ${manifest(t)}
    </div>
  </div>
</section>`;
}

/** Live shipping-label summary (fills in as the visitor types). */
function manifest(t) {
  const m = t.booking.manifest;
  const row = (key, label) => `<div class="mf__cell"><dt>${esc(label)}</dt><dd data-m="${key}">${esc(m.empty)}</dd></div>`;
  return `
      <aside class="mf" aria-labelledby="mf-title" data-manifest>
        <button type="button" class="mf__toggle" aria-expanded="false" aria-controls="mf-body" data-mf-toggle>
          ${icon('truck')}<span>${esc(m.toggle)}</span><span class="mf__toggle-truck mono" data-m="truckShort"></span>
        </button>
        <div class="mf__label" id="mf-body" data-mf-body>
          <div class="mf__head">
            <span class="mf__brand">LODICO<small>TRANSPORT</small></span>
            <h3 class="mf__title" id="mf-title">${esc(m.title)}</h3>
            <p class="mf__ref mono">${esc(m.ref)} <b data-m="ref">LT-——</b></p>
          </div>
          <div class="mf__route">
            <div><span class="mf__tag">A · ${esc(m.from)}</span><p data-m="from">${esc(m.empty)}</p><small data-m="fromMeta"></small></div>
            <span class="mf__arrow" aria-hidden="true">${icon('arrow')}</span>
            <div><span class="mf__tag">B · ${esc(m.to)}</span><p data-m="to">${esc(m.empty)}</p><small data-m="toMeta"></small></div>
          </div>
          <dl class="mf__grid">
            ${row('service', m.service)}
            ${row('date', m.date)}
            ${row('window', m.window)}
            ${row('load', m.load)}
            ${row('contact', m.contact)}
          </dl>
          <div class="mf__truck">
            <div class="mf__truck-head"><span class="mf__tag">${esc(m.truck)}</span><strong data-m="truck">${esc(m.empty)}</strong></div>
            <div class="mf__meter" aria-hidden="true"><i data-m-meter></i></div>
            <p class="mf__estimate">${esc(m.estimate)}</p>
          </div>
          <div class="mf__foot">
            <div class="mf__barcode" data-m-barcode aria-hidden="true"></div>
            <div class="mf__flags">
              <span class="mf__flag" data-m-flag="fragile" hidden>${icon('glass')}${esc(m.fragile)}</span>
              <span class="mf__flag" data-m-flag="heavy" hidden>${esc(m.heavy)} +100 kg</span>
              <span class="mf__up" aria-hidden="true">${icon('arrowUp')}${icon('arrowUp')}</span>
            </div>
          </div>
          <svg class="mf__draft" viewBox="0 0 400 70" aria-hidden="true" focusable="false"><text x="200" y="52" text-anchor="middle">${esc(m.draft.toUpperCase())}</text></svg>
          <span class="mf__stamp stamp" data-m-stamp aria-hidden="true">${esc(t.booking.success.stamp)}</span>
        </div>
      </aside>`;
}
