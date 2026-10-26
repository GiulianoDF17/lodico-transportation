/* Validation rules for each step. Returns { fieldName: errorKey }.
 * Error keys map to strings in fr.js / en.js → booking.errors. */

export const todayISO = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export const phoneDigits = (v = '') => {
  const d = v.replace(/\D/g, '');
  return d.length === 11 && d.startsWith('1') ? d.slice(1) : d;
};

export const isPhone = (v) => /^[2-9]\d{2}[2-9]\d{6}$/.test(phoneDigits(v));
export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim());
const isAddress = (v) => v.trim().length >= 6 && /\d/.test(v) && /[a-zà-ÿ]{2,}/i.test(v);

export function validateStep(step, s) {
  const e = {};
  if (step === 1) {
    if (!s.job) e.job_type = 'choose';
  }
  if (step === 2) {
    if (!s.pickup_address.trim()) e.pickup_address = 'required';
    else if (!isAddress(s.pickup_address)) e.pickup_address = 'address';
    if (!s.dropoff_address.trim()) e.dropoff_address = 'required';
    else if (!isAddress(s.dropoff_address)) e.dropoff_address = 'address';
    if (!s.date || s.date < todayISO()) e.date = 'date';
    if (!s.time_window) e.time_window = 'choose';
  }
  if (step === 3) {
    const hasSize = (s.job === 'home' && s.move_size) || (s.job === 'office' && s.office_size);
    const needsLoad = s.job !== 'other' || !s.notes.trim();
    if (needsLoad && !hasSize && s.items.length === 0) e.items = 'load';
  }
  if (step === 4) {
    if (s.name.trim().length < 2) e.name = 'required';
    if (!s.phone.trim()) e.phone = 'required';
    else if (!isPhone(s.phone)) e.phone = 'phone';
    if (s.email.trim() && !isEmail(s.email)) e.email = 'email';
    if (!s.email.trim() && s.contact_method === 'email') e.email = 'required';
    if (!s.contact_method) e.contact_method = 'choose';
    if (!s.language) e.language = 'choose';
  }
  return e;
}

/** Single field check used on blur (only for fields with a format). */
export function validateField(name, s) {
  const stepOf = {
    job_type: 1, pickup_address: 2, dropoff_address: 2, date: 2, time_window: 2,
    name: 4, phone: 4, email: 4, contact_method: 4, language: 4,
  };
  const step = stepOf[name];
  if (!step) return null;
  return validateStep(step, s)[name] || null;
}
