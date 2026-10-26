/* Navigation: smooth anchor links, mobile menu (with focus handling),
 * active section highlight, sticky mobile bar hiding near the form. */

export function initNav(motion) {
  const root = document.documentElement;
  const btn = document.querySelector('[data-menu-btn]');
  const menu = document.querySelector('[data-mobile-nav]');
  const label = btn?.querySelector('[data-menu-label]');

  const setMenu = (open) => {
    if (!btn || !menu) return;
    btn.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    label.textContent = open ? label.dataset.close : label.dataset.open;
    root.classList.toggle('menu-open', open);
    if (open) {
      motion.lenis?.stop();
      menu.querySelector('a')?.focus();
    } else {
      motion.lenis?.start();
    }
  };
  btn?.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && root.classList.contains('menu-open')) {
      setMenu(false);
      btn.focus();
    }
  });

  // In-page links: smooth scroll (Lenis) and move focus for keyboard users
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id.length > 1 && document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    if (root.classList.contains('menu-open')) setMenu(false);
    motion.scrollTo(target);
    history.replaceState(null, '', id);
    if (id !== '#booking') {
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    }
  });

  // Language switch keeps the current section (#hash)
  document.querySelector('[data-lang-switch]')?.addEventListener('click', (e) => {
    if (location.hash) {
      e.preventDefault();
      location.href = e.currentTarget.getAttribute('href') + location.hash;
    }
  });

  // Highlight the nav link of the section in view
  const links = [...document.querySelectorAll('.site-nav a[data-nav]')];
  const sections = links.map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${en.target.id}`));
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  sections.forEach((s) => io.observe(s));

  // Hide the sticky mobile bar while the booking form is on screen
  const bar = document.querySelector('[data-mobile-bar]');
  const form = document.querySelector('#booking');
  if (bar && form) {
    new IntersectionObserver(([en]) => bar.classList.toggle('is-hidden', en.isIntersecting), {
      rootMargin: '0px 0px -30% 0px',
    }).observe(form);
  }
}
