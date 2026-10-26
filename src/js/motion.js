/* =============================================================================
 * MOTION — Lenis smooth scroll + GSAP ScrollTrigger.
 * Masked text reveals, image wipes, counters, hazard progress bar, header
 * hide/show, tape marquee, hero pin (drives the 3D truck), "how it works"
 * steps, pinned horizontal fleet, magnetic buttons, custom cursor.
 * Everything is skipped for prefers-reduced-motion (content stays static).
 * ========================================================================== */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

const root = document.documentElement;

export function initMotion() {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const desktop = () => matchMedia('(min-width: 900px)').matches;

  // Shared state other modules subscribe to (3D scenes, HUD)
  const api = {
    reduced,
    lenis: null,
    heroProgress: 0,
    howProgress: 0,
    listeners: { hero: new Set(), how: new Set() },
    on(name, fn) {
      this.listeners[name].add(fn);
      fn(name === 'hero' ? this.heroProgress : this.howProgress);
    },
    emit(name, value) {
      if (name === 'hero') this.heroProgress = value;
      else this.howProgress = value;
      this.listeners[name].forEach((fn) => fn(value));
    },
    scrollTo(target, opts = {}) {
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return;
      if (this.lenis) this.lenis.scrollTo(el, { offset: opts.offset ?? -70, duration: 1.2 });
      else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
    },
  };

  initProgressBar(reduced);
  initHeaderHide();

  if (reduced) {
    root.classList.add('reduced-motion');
    initHowSteps(api, false);
    return api;
  }

  root.classList.add('js-motion');
  gsap.registerPlugin(ScrollTrigger);

  // ---- Lenis smooth scrolling, synced with GSAP's ticker ----
  const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true });
  api.lenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Pins first: they add scroll space, so triggers created after them
  // measure their positions correctly.
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    initHeroPin(api);
    const kill = initFleetPin();
    return () => kill && kill();
  });

  initHeroIntro();
  // Below-the-fold motion is set up when the browser is idle, so it doesn't
  // delay the first paint of the headline.
  const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 200));
  idle(() => {
    initReveals();
    initCounters();
    initTape();
    initHowSteps(api, true);
  }, { timeout: 1200 });

  if (finePointer) {
    initMagnetic();
    initCursor();
  }

  api.desktop = desktop;
  return api;
}

/* ---------- Hazard-stripe progress bar ---------- */
function initProgressBar() {
  const bar = document.querySelector('[data-progress]');
  if (!bar) return;
  let ticking = false;
  const update = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    ticking = false;
  };
  addEventListener('scroll', () => {
    if (!ticking) requestAnimationFrame(update), (ticking = true);
  }, { passive: true });
  update();
}

/* ---------- Header hides on scroll down, returns on scroll up ---------- */
function initHeaderHide() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  let last = scrollY;
  addEventListener('scroll', () => {
    const y = scrollY;
    const menuOpen = root.classList.contains('menu-open');
    header.classList.toggle('is-hidden', !menuOpen && y > last && y > 400);
    last = y;
  }, { passive: true });
}

/* ---------- Masked text reveals, rows, wipes ---------- */
function initReveals() {
  gsap.utils.toArray('[data-reveal="lines"]').forEach((el) => {
    if (el.closest('[data-hero]')) return; // hero has its own intro
    const inner = el.querySelectorAll('.line__inner');
    gsap.from(inner, {
      yPercent: 110,
      duration: 1.1,
      ease: 'expo.out',
      stagger: 0.09,
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  gsap.utils.toArray('[data-reveal="row"], [data-reveal="up"]').forEach((el) => {
    gsap.from(el, {
      y: 48,
      opacity: 0,
      duration: 1,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  gsap.utils.toArray('[data-reveal="wipe"]').forEach((el) => {
    gsap.fromTo(
      el,
      { clipPath: 'inset(0 100% 0 0)' },
      {
        clipPath: 'inset(0 0% 0 0)',
        duration: 1.4,
        ease: 'expo.inOut',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onComplete: () => gsap.set(el, { clearProps: 'clipPath' }),
      },
    );
  });
}

function initHeroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  // The headline itself is revealed by CSS (see .hero__title in sections.css)
  // so it paints immediately, before any JavaScript runs.
  tl.from('.hero__lead, .hero__ctas, .hero__manifest', { y: 24, opacity: 0, duration: 1, stagger: 0.08, delay: 0.35 })
    .from('.hero-poster', { opacity: 0, y: 30, duration: 1.2 }, '-=0.9');
}

/* ---------- Counters ---------- */
function initCounters() {
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const obj = { v: 0 };
    el.textContent = '0';
    gsap.to(obj, {
      v: end,
      duration: 2,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => (el.textContent = Math.round(obj.v).toLocaleString(root.lang)),
    });
  });
}

/* ---------- Tape marquee (speeds up with scroll velocity) ---------- */
function initTape() {
  gsap.utils.toArray('[data-tape]').forEach((track, i) => {
    const dir = i % 2 ? 1 : -1;
    const loop = gsap.fromTo(
      track,
      { xPercent: dir < 0 ? 0 : -33.333 },
      { xPercent: dir < 0 ? -33.333 : 0, duration: 28, ease: 'none', repeat: -1 },
    );
    ScrollTrigger.create({
      trigger: track,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const v = Math.min(Math.abs(self.getVelocity()) / 400, 5);
        gsap.to(loop, { timeScale: 1 + v, duration: 0.2, overwrite: true });
        gsap.to(loop, { timeScale: 1, duration: 1.2, delay: 0.2 });
      },
      onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
    });
  });
}

/* ---------- Hero pin: scroll drives load → drive → delivered ---------- */
function initHeroPin(api) {
  const hero = document.querySelector('[data-hero]');
  const stage = hero?.querySelector('[data-hero-stage]');
  if (!stage) return;

  const loadEl = hero.querySelector('[data-hud-load]');
  const barEl = hero.querySelector('[data-hud-bar]');
  const phases = hero.querySelectorAll('[data-hud-phase]');
  const stamp = hero.querySelector('[data-hero-stamp]');
  const hint = hero.querySelector('[data-hero-hint]');
  const posterTruck = hero.querySelector('.hero-poster__truck');
  let stampShown = false;

  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: '+=230%',
    pin: stage,
    scrub: true,
    anticipatePin: 1,
    onUpdate: (self) => api.emit('hero', self.progress),
  });

  api.on('hero', (p) => {
    const load = Math.min(1, p / 0.45);
    loadEl.textContent = String(Math.round(load * 100)).padStart(3, '0');
    barEl.style.transform = `scaleX(${load})`;
    const phase = p < 0.5 ? 0 : p < 0.94 ? 1 : 2;
    phases.forEach((li, i) => {
      li.classList.toggle('is-active', i === phase);
      li.classList.toggle('is-done', i < phase);
    });
    hint.style.opacity = p > 0.05 ? 0 : 1;
    const show = p >= 0.94;
    if (show !== stampShown) {
      stampShown = show;
      gsap.to(stamp, show
        ? { opacity: 1, scale: 1, rotate: -8, duration: 0.45, ease: 'back.out(2.5)', startAt: { scale: 2.2, rotate: -2 } }
        : { opacity: 0, duration: 0.2 });
    }
    // Poster fallback (shown until / unless WebGL is ready): truck moves along
    if (!hero.classList.contains('is-3d') && posterTruck) {
      const drive = Math.max(0, (p - 0.5) / 0.5);
      posterTruck.style.transform = `translateX(${drive * 30}%)`;
    }
  });
}

/* ---------- How it works: active step + overall progress ---------- */
function initHowSteps(api, animated) {
  const section = document.querySelector('[data-how]');
  if (!section) return;
  const steps = [...section.querySelectorAll('[data-how-step]')];
  const counter = section.querySelector('[data-how-current]');
  const list = section.querySelector('.how-steps');
  const setActive = (i) => {
    steps.forEach((s, j) => s.classList.toggle('is-active', j === i));
    if (counter) counter.textContent = String(i + 1).padStart(2, '0');
  };
  setActive(0);
  if (!animated) return;

  steps.forEach((step, i) => {
    ScrollTrigger.create({
      trigger: step,
      start: 'top 60%',
      end: 'bottom 60%',
      onToggle: (self) => self.isActive && setActive(i),
    });
  });
  ScrollTrigger.create({
    trigger: list,
    start: 'top 60%',
    end: 'bottom 60%',
    scrub: true,
    onUpdate: (self) => api.emit('how', self.progress),
  });
}

/* ---------- Fleet: pinned horizontal scroll (desktop) ---------- */
function initFleetPin() {
  const section = document.querySelector('[data-fleet]');
  const pin = section?.querySelector('[data-fleet-pin]');
  const track = section?.querySelector('[data-fleet-track]');
  const bar = section?.querySelector('[data-fleet-progress]');
  if (!track) return null;
  section.classList.add('is-pinned');
  const distance = () => Math.max(0, track.scrollWidth - innerWidth);
  const tween = gsap.to(track, {
    x: () => -distance(),
    ease: 'none',
    scrollTrigger: {
      trigger: pin,
      start: 'top top',
      end: () => `+=${distance()}`,
      pin: true,
      scrub: 0.6,
      invalidateOnRefresh: true,
      onUpdate: (self) => bar && (bar.style.transform = `scaleX(${self.progress})`),
    },
  });
  return () => {
    section.classList.remove('is-pinned');
    tween.scrollTrigger?.kill();
    tween.kill();
    gsap.set(track, { clearProps: 'transform' });
  };
}

/* ---------- Magnetic buttons ---------- */
function initMagnetic() {
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    const strength = 0.28;
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    });
    el.addEventListener('pointerleave', () => {
      xTo(0);
      yTo(0);
    });
  });
}

/* ---------- Custom cursor (desktop only) ---------- */
function initCursor() {
  const cursor = document.querySelector('[data-cursor]');
  if (!cursor) return;
  root.classList.add('has-cursor');
  const dot = cursor.querySelector('.cursor__dot');
  const ring = cursor.querySelector('.cursor__ring');
  const dx = gsap.quickTo(dot, 'x', { duration: 0.08 });
  const dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
  const rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' });
  const ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' });
  const hoverSel = 'a, button, label, summary, select, [role="button"], input[type="date"]';

  addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    cursor.classList.remove('is-hidden');
  }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    cursor.classList.toggle('is-hover', !!e.target.closest?.(hoverSel));
  });
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  document.addEventListener('pointerdown', () => gsap.to(ring, { scale: 0.8, duration: 0.15 }));
  document.addEventListener('pointerup', () => gsap.to(ring, { scale: 1, duration: 0.3 }));
}
