/* Decides whether to run the 3D scenes and lazy-loads Three.js.
 * 3D only on desktop-size screens, with WebGL, no reduced motion and no
 * data-saver. Otherwise the static illustrations stay in place. */

import { strings } from '../i18n.js';

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

/* The truck loads on the visitor's first interaction (mouse move, scroll,
 * key, touch) after the page has loaded. Desktop visitors move the mouse
 * almost immediately, and the page's first paint never waits for 3D. */
const whenInteracting = (fn) => {
  const events = ['pointermove', 'wheel', 'scroll', 'keydown', 'touchstart'];
  let done = false;
  const go = () => {
    if (done) return;
    done = true;
    events.forEach((e) => removeEventListener(e, go));
    fn();
  };
  const arm = () => events.forEach((e) => addEventListener(e, go, { once: true, passive: true }));
  if (document.readyState === 'complete') arm();
  else addEventListener('load', arm, { once: true });
};

export function initScenes(motion) {
  if (motion.reduced) return;
  const desktop = matchMedia('(min-width: 900px)').matches;
  const saveData = navigator.connection?.saveData;
  if (!desktop || saveData || !webglAvailable()) return;

  // Hero truck — loads on first interaction
  const hero = document.querySelector('[data-hero]');
  const heroCanvas = hero?.querySelector('[data-hero-canvas]');
  if (heroCanvas) {
    whenInteracting(async () => {
      try {
        const { createHeroScene } = await import('./hero-scene.js');
        const scene = await createHeroScene(heroCanvas, strings);
        motion.on('hero', (p) => scene.setProgress(p));
        hero.classList.add('is-3d');
      } catch (e) {
        console.warn('[3d] hero scene unavailable, keeping illustration', e);
      }
    });
  }

  // "How it works" box — loads when the section approaches
  const how = document.querySelector('[data-how]');
  const howCanvas = how?.querySelector('[data-how-canvas]');
  if (howCanvas) {
    const io = new IntersectionObserver(
      async ([en]) => {
        if (!en.isIntersecting) return;
        io.disconnect();
        try {
          const { createBoxScene } = await import('./box-scene.js');
          const scene = await createBoxScene(howCanvas, strings.how);
          motion.on('how', (p) => scene.setProgress(p));
          how.classList.add('is-3d');
        } catch (e) {
          console.warn('[3d] box scene unavailable, keeping illustration', e);
        }
      },
      { rootMargin: '900px 0px' },
    );
    io.observe(how);
  }
}
