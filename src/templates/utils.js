/* Small helpers shared by the HTML templates (run at build time). */

/** Escape text for safe use in HTML content and attributes. */
export const esc = (value = '') =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Replace {tokens} in a string: fill('Step {n}', { n: 2 }) → 'Step 2'. */
export const fill = (str, vars = {}) =>
  String(str).replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));

/** Zero-padded index for stencil numbers: 1 → '01'. */
export const pad = (n) => String(n).padStart(2, '0');

/** Red "to confirm" tag shown next to unconfirmed placeholder facts. */
export const placeholderTag = (t) =>
  `<span class="tag-confirm" data-placeholder>${esc(t.placeholderTag)}</span>`;

/** Section eyebrow: "01 / SERVICES" in mono, like a manifest field. */
export const eyebrow = (num, label) =>
  `<p class="eyebrow"><span class="eyebrow__num">${pad(num)}</span><span class="eyebrow__sep">/</span>${esc(label)}</p>`;

/** Heading split in lines, each wrapped for the masked reveal animation. */
export const lines = (arr, tag = 'h2', cls = 'display', id = '') => {
  const list = Array.isArray(arr) ? arr : [arr];
  return `<${tag}${id ? ` id="${id}"` : ''} class="${cls}" data-reveal="lines">${list
    .map((l) => `<span class="line"><span class="line__inner">${esc(l)}</span></span>`)
    .join(' ')}</${tag}>`;
};
