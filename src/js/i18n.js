/* Runtime strings for the current page language, embedded by the template
 * as JSON (<script id="i18n">) so the browser doesn't download both files. */

const el = document.getElementById('i18n');
export const strings = el ? JSON.parse(el.textContent) : {};

/** Replace {tokens}: fill('Step {n}', { n: 2 }) → 'Step 2' */
export const fill = (str, vars = {}) =>
  String(str ?? '').replace(/\{(\w+)\}/g, (m, k) => (k in vars ? vars[k] : m));
