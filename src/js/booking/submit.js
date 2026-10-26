/* Sending the booking request.
 *  - 'netlify'   → POST to the site itself; Netlify Forms emails it to you.
 *  - 'web3forms' → POST to api.web3forms.com with your access key (.env).
 * In `npm run dev`, sending is SIMULATED (nothing leaves your computer)
 * unless VITE_FORM_LIVE=1 is set in .env. See README → "Booking email". */

import { formConfig } from '../../content/business.js';

const LAST_KEY = 'lodico-last-submit';

export function isRateLimited() {
  try {
    const last = Number(localStorage.getItem(LAST_KEY) || 0);
    return Date.now() - last < formConfig.rateLimitMs;
  } catch {
    return false;
  }
}

export function markSubmitted() {
  try {
    localStorage.setItem(LAST_KEY, String(Date.now()));
  } catch {
    /* private mode: ignore */
  }
}

/**
 * @param {FormData} data  all fields, photos attached as photo1..3
 * @returns {Promise<void>} resolves on success, throws on failure
 */
export async function sendBooking(data) {
  if (import.meta.env.DEV && import.meta.env.VITE_FORM_LIVE !== '1') {
    // Simulated send in development
    console.info('[booking] simulated submission', Object.fromEntries(data.entries()));
    await new Promise((r) => setTimeout(r, 900));
    if (window.__lodicoFailNext) {
      window.__lodicoFailNext = false;
      throw new Error('simulated failure');
    }
    return;
  }

  if (formConfig.provider === 'web3forms') {
    const key = import.meta.env.VITE_WEB3FORMS_KEY;
    if (!key) throw new Error('Missing VITE_WEB3FORMS_KEY');
    const body = new FormData();
    for (const [k, v] of data.entries()) {
      if (typeof v === 'string' && !['form-name', 'bot-field'].includes(k)) body.append(k, v);
    }
    body.append('access_key', key);
    body.append('subject', `Lodico — demande ${data.get('reference')} (${data.get('job_type')})`);
    body.append('from_name', 'Site Lodico Transport');
    body.append('botcheck', '');
    const res = await fetch('https://api.web3forms.com/submit', { method: 'POST', body });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || !json.success) throw new Error(json.message || `HTTP ${res.status}`);
    return;
  }

  // Netlify Forms: multipart POST to the page (supports photo files)
  const res = await fetch('/', { method: 'POST', body: data });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
}

/** Shrink photos before upload (max 1600px, JPEG) to stay under limits. */
export async function compressImage(file) {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type) || !('createImageBitmap' in window)) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d').drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise((r) => canvas.toBlob(r, 'image/jpeg', 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, '') + '.jpg', { type: 'image/jpeg' });
  } catch {
    return file;
  }
}
