/* Shared Three.js helpers: renderer, render loop that only runs while the
 * canvas is visible, canvas-drawn textures (labels, livery, cardboard). */

import { WebGLRenderer, CanvasTexture, SRGBColorSpace, Sprite, SpriteMaterial } from 'three';
import gsap from 'gsap';

export async function fontsReady() {
  try {
    await Promise.all([
      document.fonts.load('900 64px "Archivo Variable"'),
      document.fonts.load('700 32px "JetBrains Mono Variable"'),
    ]);
  } catch {
    /* fall back to system fonts */
  }
}

export function createRenderer(canvas, { shadows = false } = {}) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0x0a0a0a, 1);
  if (shadows) {
    renderer.shadowMap.enabled = true;
  }
  return renderer;
}

/** Runs `frame()` on GSAP's ticker only while `el` is on screen, and only
 * Each scene's `frame()` returns early when nothing changed since the last
 * draw, so an idle scene costs almost nothing. */
export function visibleLoop(el, frame) {
  let running = false;
  const tick = () => frame();
  const io = new IntersectionObserver(([en]) => {
    if (en.isIntersecting && !running) {
      gsap.ticker.add(tick);
      running = true;
    } else if (!en.isIntersecting && running) {
      gsap.ticker.remove(tick);
      running = false;
    }
  });
  io.observe(el);
  return () => {
    io.disconnect();
    gsap.ticker.remove(tick);
  };
}

/** Keeps renderer + camera sized to the canvas element. */
export function autoResize(canvas, renderer, onResize) {
  const ro = new ResizeObserver(() => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    onResize(w, h);
  });
  ro.observe(canvas);
  return () => ro.disconnect();
}

export function canvasTexture(w, h, draw) {
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d');
  draw(ctx, w, h);
  const tex = new CanvasTexture(c);
  tex.colorSpace = SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const condensed = (ctx) => {
  if ('fontStretch' in ctx) ctx.fontStretch = 'ultra-condensed';
};

/** Text sprite that always faces the camera. `height` is in world units. */
export function textSprite(text, { height = 1, color = '#f2efe8', font = 'display', bg = null, weight = 900 } = {}) {
  const px = 96;
  const family = font === 'mono' ? '"JetBrains Mono Variable", monospace' : '"Archivo Variable", Impact, sans-serif';
  const measure = document.createElement('canvas').getContext('2d');
  measure.font = `${weight} ${px}px ${family}`;
  if (font !== 'mono') condensed(measure);
  const pad = bg ? px * 0.35 : px * 0.1;
  const w = Math.ceil(measure.measureText(text).width + pad * 2);
  const h = Math.ceil(px * 1.3);
  const tex = canvasTexture(w, h, (ctx) => {
    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.font = `${weight} ${px}px ${family}`;
    if (font !== 'mono') condensed(ctx);
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.fillText(text, pad, h / 2 + px * 0.04);
  });
  const sprite = new Sprite(new SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
  sprite.scale.set((w / h) * height, height, 1);
  return sprite;
}

export { condensed };
