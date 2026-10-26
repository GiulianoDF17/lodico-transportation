/* =============================================================================
 * BOOKING FORM — multi-step logic
 * Steps, inline validation (with screen-reader messages), item list,
 * photos, live manifest, truck estimate, draft saved in localStorage,
 * spam checks (honeypot + time trap + rate limit), submission, confirmation.
 * ========================================================================== */

import { formConfig } from '../../content/business.js';
import { fill } from '../i18n.js';
import { validateStep, validateField, todayISO } from './validate.js';
import { createManifest } from './manifest.js';
import { estimateTruck, TRUCK_TO_SIZE } from './estimate.js';
import { sendBooking, isRateLimited, markSubmitted, compressImage } from './submit.js';

const STORE_KEY = 'lodico-booking-v1';
const TOTAL = 5;

const newRef = () => {
  const d = new Date();
  const ymd = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  return `LT-${ymd}-${[...bytes].map((x) => alphabet[x % alphabet.length]).join('')}`;
};

export function initBooking(strings, motion) {
  const form = document.querySelector('[data-booking]');
  if (!form || !strings.booking) return;
  const b = strings.booking;
  const err = b.errors;
  const $ = (sel) => form.querySelector(sel);
  const $$ = (sel) => [...form.querySelectorAll(sel)];

  const manifest = createManifest(document.querySelector('[data-manifest]'), strings);
  const success = document.querySelector('[data-success]');
  const summaryBox = $('[data-error-summary]');
  const steps = $$('[data-step]');
  const dots = $$('[data-step-dot]');
  const bar = $('[data-step-bar]');
  const status = $('[data-step-status]');
  const backBtn = $('[data-back]');
  const nextBtn = $('[data-next]');
  const submitBtn = $('[data-submit]');
  const savedEl = $('[data-saved]');
  const failEl = $('[data-fail]');
  const dateInput = $('[data-date]');

  let step = 1;
  let items = [];
  let photos = [];
  let ref = newRef();
  let startedAt = Date.now();
  const touched = new Set();

  dateInput.min = todayISO();

  /* ---------- State ---------- */
  const read = () => {
    const fd = new FormData(form);
    const v = (k) => (fd.get(k) || '').toString();
    return {
      ref,
      job: v('job_type'),
      pickup_address: v('pickup_address'),
      pickup_floor: v('pickup_floor'),
      pickup_access: v('pickup_access'),
      dropoff_address: v('dropoff_address'),
      dropoff_floor: v('dropoff_floor'),
      dropoff_access: v('dropoff_access'),
      date: v('date'),
      time_window: v('time_window'),
      move_size: v('move_size'),
      office_size: v('office_size'),
      items,
      fragile: fd.get('fragile') === 'yes',
      heavy: fd.get('heavy') === 'yes',
      notes: v('notes'),
      name: v('name'),
      company: v('company'),
      phone: v('phone'),
      email: v('email'),
      contact_method: v('contact_method'),
      language: v('language'),
    };
  };

  /* ---------- Draft save / restore ---------- */
  let saveTimer;
  const save = () => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      const fd = new FormData(form);
      const values = {};
      for (const [k, val] of fd.entries()) {
        if (typeof val !== 'string' || ['form-name', 'bot-field', 'site_language'].includes(k)) continue;
        if (k.startsWith('photo')) continue;
        values[k] = val;
      }
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify({ step, values, items, ref, startedAt }));
        savedEl.textContent = b.saved;
      } catch {
        /* storage unavailable */
      }
    }, 350);
  };

  const restore = () => {
    let data;
    try {
      data = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
    } catch {
      data = null;
    }
    if (!data || !data.values) return false;
    for (const [k, val] of Object.entries(data.values)) {
      const els = form.elements[k];
      if (!els) continue;
      if (els instanceof RadioNodeList) {
        [...els].forEach((el) => {
          if (el.type === 'radio' || el.type === 'checkbox') el.checked = el.value === val;
          else el.value = val;
        });
      } else if (els.type === 'checkbox') els.checked = val === els.value;
      else els.value = val;
    }
    items = Array.isArray(data.items) ? data.items : [];
    ref = data.ref || ref;
    startedAt = data.startedAt || startedAt;
    const meaningful = Object.keys(data.values).some((k) => !['language', 'contact_method', 'pickup_floor', 'pickup_access', 'dropoff_floor', 'dropoff_access'].includes(k) && data.values[k]);
    if (meaningful) $('[data-restored]').hidden = false;
    // Never restore a past date
    if (dateInput.value && dateInput.value < todayISO()) dateInput.value = '';
    goTo(Math.min(Math.max(1, data.step || 1), TOTAL), { focus: false, instant: true });
    return meaningful;
  };

  const clearAll = () => {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      /* ignore */
    }
    form.reset();
    items = [];
    photos.forEach((p) => URL.revokeObjectURL(p.url));
    photos = [];
    ref = newRef();
    startedAt = Date.now();
    touched.clear();
    setDefaults();
    renderItems();
    renderPhotos();
    $$('.field.is-invalid').forEach((f) => clearError(f.dataset.field));
    summaryBox.hidden = true;
    $('[data-restored]').hidden = true;
    savedEl.textContent = '';
    goTo(1, { focus: false, instant: true });
    refresh();
  };

  /* ---------- Errors ---------- */
  const fieldEl = (name) => form.querySelector(`[data-field="${name}"]`);
  const controlFor = (name) =>
    name === 'items' ? $('[data-item-type]') : form.querySelector(`[name="${name}"]`);

  function showError(name, key) {
    const wrap = fieldEl(name);
    const msg = form.querySelector(`[data-error-for="${name}"]`);
    if (!wrap || !msg) return;
    wrap.classList.add('is-invalid');
    msg.textContent = fill(err[key] || err.required, { phone: strings.phone.display });
    const ctrl = controlFor(name);
    if (ctrl && ctrl.type !== 'radio') ctrl.setAttribute('aria-invalid', 'true');
    if (wrap.tagName === 'FIELDSET') wrap.setAttribute('aria-invalid', 'true');
  }
  function clearError(name) {
    const wrap = fieldEl(name);
    if (!wrap) return;
    wrap.classList.remove('is-invalid');
    wrap.removeAttribute('aria-invalid');
    const msg = form.querySelector(`[data-error-for="${name}"]`);
    if (msg) msg.textContent = '';
    controlFor(name)?.removeAttribute('aria-invalid');
  }

  function showSummary(errors) {
    const names = Object.keys(errors);
    const label = (n) => {
      const w = fieldEl(n);
      const l = w?.querySelector('legend, label');
      return (l?.textContent || n).replace(/\(.*\)/, '').trim();
    };
    summaryBox.innerHTML = `<p>${fill(err.summary, { n: names.length })}</p><ul>${names
      .map((n) => `<li><a href="#" data-err-link="${n}">${label(n)}</a> — ${fill(err[errors[n]] || err.required, { phone: strings.phone.display })}</li>`)
      .join('')}</ul>`;
    summaryBox.hidden = false;
    summaryBox.focus();
  }
  summaryBox.addEventListener('click', (e) => {
    const a = e.target.closest('[data-err-link]');
    if (!a) return;
    e.preventDefault();
    const name = a.dataset.errLink;
    const ctrl = controlFor(name);
    (ctrl || fieldEl(name))?.focus();
  });

  /* ---------- Steps ---------- */
  function goTo(n, { focus = true, instant = false, back = false } = {}) {
    step = n;
    steps.forEach((el) => {
      const active = Number(el.dataset.step) === n;
      el.hidden = !active;
      el.classList.toggle('is-active', active);
      el.classList.remove('is-entering', 'is-entering-back');
      if (active && !instant && !motion.reduced) el.classList.add(back ? 'is-entering-back' : 'is-entering');
    });
    dots.forEach((d) => {
      const i = Number(d.dataset.stepDot);
      d.classList.toggle('is-current', i === n);
      d.classList.toggle('is-done', i < n);
      if (i === n) d.setAttribute('aria-current', 'step');
      else d.removeAttribute('aria-current');
    });
    bar.style.transform = `scaleX(${n / TOTAL})`;
    status.textContent = `${fill(b.stepOf, { n, total: TOTAL })} — ${b.steps[n - 1]}`;
    backBtn.hidden = n === 1;
    nextBtn.hidden = n === TOTAL;
    submitBtn.hidden = n !== TOTAL;
    summaryBox.hidden = true;
    failEl.hidden = true;
    if (n === 3) syncSizeGroups();
    if (n === TOTAL) renderReview();
    if (focus) {
      const top = form.getBoundingClientRect().top;
      if (top < 0 || top > innerHeight * 0.5) motion.scrollTo(form, { offset: -90 });
      form.querySelector(`#bstep-${n}`)?.focus({ preventScroll: true });
    }
    save();
  }

  function tryNext() {
    const s = read();
    const errors = validateStep(step, s);
    // Clear errors of this step, then show current ones
    steps[step - 1].querySelectorAll('[data-field]').forEach((f) => clearError(f.dataset.field));
    if (Object.keys(errors).length) {
      Object.entries(errors).forEach(([k, v]) => showError(k, v));
      showSummary(errors);
      return false;
    }
    goTo(step + 1);
    return true;
  }

  nextBtn.addEventListener('click', tryNext);
  backBtn.addEventListener('click', () => goTo(step - 1, { back: true }));

  // Enter in a text field moves to the next step instead of submitting early
  form.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' || e.target.tagName === 'TEXTAREA' || e.target.type === 'submit' || e.target.tagName === 'BUTTON') return;
    if (e.target.matches('[data-item-custom], [data-item-qty]')) {
      e.preventDefault();
      addItem();
      return;
    }
    if (step < TOTAL) {
      e.preventDefault();
      tryNext();
    }
  });

  /* ---------- Conditional fields ---------- */
  function syncSizeGroups() {
    const job = read().job;
    $('[data-size-home]').hidden = job !== 'home';
    $('[data-size-office]').hidden = job !== 'office';
  }

  function setDefaults() {
    if (!form.elements.language.value) {
      const el = form.querySelector(`[name="language"][value="${strings.lang}"]`);
      if (el) el.checked = true;
    }
    if (!form.elements.contact_method.value) {
      const el = form.querySelector('[name="contact_method"][value="phone"]');
      if (el) el.checked = true;
    }
  }

  /* ---------- Items ---------- */
  const typeSel = $('[data-item-type]');
  const qtyInput = $('[data-item-qty]');
  const customWrap = $('[data-item-custom-wrap]');
  const customInput = $('[data-item-custom]');
  const list = $('[data-items-list]');

  typeSel.addEventListener('change', () => {
    customWrap.hidden = typeSel.value !== 'other';
  });
  form.querySelectorAll('[data-qty]').forEach((btn) =>
    btn.addEventListener('click', () => {
      qtyInput.value = Math.min(99, Math.max(1, (Number(qtyInput.value) || 1) + Number(btn.dataset.qty)));
    }),
  );

  function addItem() {
    const type = typeSel.value;
    const qty = Math.min(99, Math.max(1, Math.round(Number(qtyInput.value) || 1)));
    const custom = customInput.value.trim();
    if (type === 'other' && !custom) {
      showError('items', 'custom');
      customInput.focus();
      return;
    }
    const label = type === 'other' ? custom : b.catalog[type];
    const existing = items.find((it) => it.type === type && it.label === label);
    if (existing) existing.qty = Math.min(99, existing.qty + qty);
    else items.push({ type, label, qty });
    qtyInput.value = 1;
    customInput.value = '';
    clearError('items');
    renderItems();
    refresh();
  }
  $('[data-item-add]').addEventListener('click', addItem);

  function renderItems() {
    if (!items.length) {
      list.innerHTML = `<li class="items__empty">${b.noItems}</li>`;
      return;
    }
    list.innerHTML = '';
    items.forEach((it, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="items__qty">${it.qty} ×</span><span></span>
        <button type="button" class="items__remove"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>`;
      li.children[1].textContent = it.label;
      const btn = li.querySelector('button');
      btn.setAttribute('aria-label', fill(b.removeItem, { item: `${it.qty} × ${it.label}` }));
      btn.addEventListener('click', () => {
        items.splice(i, 1);
        renderItems();
        refresh();
        typeSel.focus();
      });
      list.append(li);
    });
  }

  /* ---------- Photos ---------- */
  const photoInput = $('[data-photos-input]');
  const photoList = $('[data-photos-list]');
  const drop = $('[data-photos-drop]');
  if (formConfig.provider === 'web3forms') $('[data-photos-notsent]').hidden = false;

  async function addPhotos(files) {
    clearError('photos');
    const incoming = [...files];
    if (incoming.some((f) => !/^image\//.test(f.type) && !/\.(heic|heif)$/i.test(f.name))) {
      showError('photos', 'photoType');
      return;
    }
    if (photos.length + incoming.length > formConfig.maxPhotos) {
      showError('photos', 'photoCount');
      return;
    }
    const compressed = await Promise.all(incoming.map(compressImage));
    const total = [...photos.map((p) => p.file), ...compressed].reduce((s, f) => s + f.size, 0);
    if (total > formConfig.maxPhotoBytes) {
      showError('photos', 'photoSize');
      return;
    }
    compressed.forEach((file) => photos.push({ file, url: URL.createObjectURL(file) }));
    renderPhotos();
  }
  photoInput.addEventListener('change', () => {
    addPhotos(photoInput.files);
    photoInput.value = '';
  });
  ['dragenter', 'dragover'].forEach((ev) =>
    drop.addEventListener(ev, (e) => {
      e.preventDefault();
      drop.classList.add('is-over');
    }),
  );
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, () => drop.classList.remove('is-over')));
  drop.addEventListener('drop', (e) => {
    e.preventDefault();
    addPhotos(e.dataTransfer.files);
  });

  function renderPhotos() {
    photoList.innerHTML = '';
    photos.forEach((p, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<img alt="" src="${p.url}"><button type="button"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg></button>`;
      li.querySelector('img').alt = p.file.name;
      const btn = li.querySelector('button');
      btn.setAttribute('aria-label', fill(b.photosRemove, { n: i + 1 }));
      btn.addEventListener('click', () => {
        URL.revokeObjectURL(p.url);
        photos.splice(i, 1);
        renderPhotos();
        photoInput.focus();
      });
      photoList.append(li);
    });
  }

  /* ---------- Review step ---------- */
  function renderReview() {
    const s = read();
    const est = estimateTruck(s);
    const placeLine = (p) =>
      `${s[`${p}_address`]} — ${b.floors[s[`${p}_floor`]]}, ${b.accesses[s[`${p}_access`]]}`;
    const size = s.job === 'home' ? b.sizes[s.move_size] : s.job === 'office' ? b.officeSizes[s.office_size] : '';
    const blocks = [
      { step: 1, title: b.reviewSections.job, rows: [[b.jobLegend, b.jobs[s.job]?.label]] },
      {
        step: 2,
        title: b.reviewSections.route,
        rows: [
          [b.pickup, placeLine('pickup')],
          [b.dropoff, placeLine('dropoff')],
          [b.date, `${s.date} · ${b.times[s.time_window] || ''}`],
        ],
      },
      {
        step: 3,
        title: b.reviewSections.load,
        rows: [
          [b.sizeLegend, size],
          [b.itemsLegend, s.items.map((it) => `${it.qty} × ${it.label}`).join(', ')],
          [b.manifest.fragile, s.fragile ? '✓' : ''],
          [b.manifest.heavy, s.heavy ? '✓' : ''],
          [b.notes, s.notes],
          [b.photos, photos.length ? String(photos.length) : ''],
          [b.manifest.truck, est ? `${fill(b.manifest.truckValue, { size: est.truck })} (${b.manifest.estimate})` : ''],
        ],
      },
      {
        step: 4,
        title: b.reviewSections.contact,
        rows: [
          [b.name, s.name],
          [b.company, s.company],
          [b.phone, s.phone],
          [b.email, s.email],
          [b.contactLegend, b.contacts[s.contact_method]],
          [b.langLegend, b.langs[s.language]],
        ],
      },
    ];
    const box = $('[data-review]');
    box.innerHTML = '';
    blocks.forEach((blk) => {
      const sec = document.createElement('section');
      sec.className = 'review-block';
      sec.innerHTML = `<div class="review-block__head"><h4></h4><button type="button"></button></div><dl></dl>`;
      sec.querySelector('h4').textContent = blk.title;
      const btn = sec.querySelector('button');
      btn.textContent = b.edit;
      btn.setAttribute('aria-label', `${b.edit} — ${blk.title}`);
      btn.addEventListener('click', () => goTo(blk.step, { back: true }));
      const dl = sec.querySelector('dl');
      blk.rows.filter(([, v]) => v && String(v).trim()).forEach(([k, v]) => {
        const dt = document.createElement('dt');
        const dd = document.createElement('dd');
        dt.textContent = k;
        dd.textContent = v;
        dl.append(dt, dd);
      });
      box.append(sec);
    });
  }

  /* ---------- Plain-text summary for the email ---------- */
  function buildSummary(s, est) {
    const line = (k, v) => (v ? `${k}: ${v}` : '');
    return [
      `${b.manifest.ref} ${s.ref}`,
      line(b.jobLegend, b.jobs[s.job]?.label),
      line(b.pickup, `${s.pickup_address} (${b.floors[s.pickup_floor]}, ${b.accesses[s.pickup_access]})`),
      line(b.dropoff, `${s.dropoff_address} (${b.floors[s.dropoff_floor]}, ${b.accesses[s.dropoff_access]})`),
      line(b.date, `${s.date} — ${b.times[s.time_window]}`),
      line(b.sizeLegend, s.job === 'home' ? b.sizes[s.move_size] : s.job === 'office' ? b.officeSizes[s.office_size] : ''),
      line(b.itemsLegend, s.items.map((it) => `${it.qty} × ${it.label}`).join(', ')),
      s.fragile ? b.fragile : '',
      s.heavy ? b.heavy : '',
      line(b.notes, s.notes),
      line(b.manifest.truck, est ? `${est.truck} ft (≈${est.volume} pi³/ft³)` : ''),
      line(b.name, s.name),
      line(b.company, s.company),
      line(b.phone, s.phone),
      line(b.email, s.email),
      line(b.contactLegend, b.contacts[s.contact_method]),
      line(b.langLegend, b.langs[s.language]),
    ]
      .filter(Boolean)
      .join('\n');
  }

  /* ---------- Submit ---------- */
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (step !== TOTAL) {
      tryNext();
      return;
    }
    // Re-validate every step (in case data was changed via "Edit")
    const s = read();
    for (let i = 1; i < TOTAL; i++) {
      const errors = validateStep(i, s);
      if (Object.keys(errors).length) {
        goTo(i, { back: true });
        Object.entries(errors).forEach(([k, v]) => showError(k, v));
        showSummary(errors);
        return;
      }
    }
    failEl.hidden = true;

    // Spam checks: honeypot filled or form completed impossibly fast → fake success
    const bot = form.elements['bot-field'].value || Date.now() - startedAt < 4000;
    if (!bot && isRateLimited()) {
      failEl.textContent = fill(err.rate, { phone: strings.phone.display });
      failEl.hidden = false;
      return;
    }

    const est = estimateTruck(s);
    form.querySelector('[data-hidden="reference"]').value = s.ref;
    form.querySelector('[data-hidden="items"]').value = s.items.map((it) => `${it.qty} × ${it.label}`).join('\n');
    form.querySelector('[data-hidden="truck"]').value = est ? `${est.truck} ft (estimate)` : '';
    form.querySelector('[data-hidden="summary"]').value = buildSummary(s, est);
    form.elements.phone.value = s.phone.trim();

    const data = new FormData(form);
    ['photo1', 'photo2', 'photo3'].forEach((k) => data.delete(k));
    if (formConfig.provider === 'netlify') photos.forEach((p, i) => data.append(`photo${i + 1}`, p.file, p.file.name));

    submitBtn.disabled = true;
    const label = $('[data-submit-label]');
    label.textContent = b.sending;
    try {
      if (!bot) await sendBooking(data);
      else await new Promise((r) => setTimeout(r, 600));
      markSubmitted();
      showSuccess(s.ref);
    } catch (error) {
      console.error('[booking] send failed', error);
      failEl.textContent = fill(err.network, { phone: strings.phone.display });
      failEl.hidden = false;
      failEl.focus?.();
    } finally {
      submitBtn.disabled = false;
      label.textContent = b.submit;
    }
  });

  function showSuccess(reference) {
    try {
      localStorage.removeItem(STORE_KEY);
    } catch {
      /* ignore */
    }
    form.hidden = true;
    success.hidden = false;
    success.querySelector('[data-success-ref]').textContent = reference;
    success.classList.remove('is-in');
    void success.offsetWidth;
    success.classList.add('is-in');
    manifest.booked(true);
    motion.scrollTo(success.closest('.booking__main'), { offset: -90 });
    success.focus({ preventScroll: true });
  }

  document.querySelector('[data-again]')?.addEventListener('click', () => {
    success.hidden = true;
    form.hidden = false;
    manifest.booked(false);
    clearAll();
    form.querySelector('#bstep-1')?.focus();
  });

  $('[data-clear]').addEventListener('click', () => {
    if (confirm(b.clearConfirm)) clearAll();
  });

  /* ---------- Live updates ---------- */
  function refresh() {
    const s = read();
    manifest.update(s);
    $('[data-july1]').hidden = !s.date.endsWith('-07-01');
    save();
    return s;
  }

  form.addEventListener('input', (e) => {
    const name = e.target.name;
    if (name && fieldEl(name)?.classList.contains('is-invalid')) {
      const s = read();
      if (!validateField(name, s)) clearError(name);
    }
    refresh();
  });
  form.addEventListener('change', (e) => {
    const name = e.target.name;
    if (e.target.type === 'radio' && name) clearError(name);
    if (name === 'move_size' || name === 'office_size') clearError('items');
    if (name === 'job_type') syncSizeGroups();
    refresh();
  });
  form.addEventListener('focusout', (e) => {
    const name = e.target.name;
    if (!name || e.target.type === 'radio') return;
    touched.add(name);
    const s = read();
    if (!s[name] && !['email'].includes(name)) return; // don't nag on empty fields until "Continue"
    const key = validateField(name, s);
    if (key) showError(name, key);
    else clearError(name);
  });

  /* ---------- "Book this" / "Choose this truck" buttons ---------- */
  document.addEventListener('click', (e) => {
    const jobBtn = e.target.closest('[data-book-job]');
    const truckBtn = e.target.closest('[data-book-truck]');
    if (!jobBtn && !truckBtn) return;
    if (jobBtn) {
      const radio = form.querySelector(`[name="job_type"][value="${jobBtn.dataset.bookJob}"]`);
      if (radio) radio.checked = true;
    }
    if (truckBtn) {
      const job = form.elements.job_type.value;
      if (!job || (job !== 'home' && job !== 'office')) {
        form.querySelector('[name="job_type"][value="home"]').checked = true;
      }
      if (form.elements.job_type.value === 'home') {
        const size = form.querySelector(`[name="move_size"][value="${TRUCK_TO_SIZE[truckBtn.dataset.bookTruck]}"]`);
        if (size) size.checked = true;
      }
    }
    clearError('job_type');
    syncSizeGroups();
    refresh();
    if (form.hidden) return;
    // Focus the step title after the smooth scroll lands
    setTimeout(() => form.querySelector(`#bstep-${step}`)?.focus({ preventScroll: true }), 900);
  });

  /* ---------- Init ---------- */
  renderItems();
  restore();
  setDefaults();
  syncSizeGroups();
  manifest.update(read());
  $('[data-july1]').hidden = !read().date.endsWith('-07-01');
}
