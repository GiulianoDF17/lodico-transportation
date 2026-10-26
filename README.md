# Lodico Transport — website

Bilingual (French first, English at `/en/`) website for **Lodico Transport**, furniture and goods moving/delivery in Montréal and Laval.

Built with **Vite + vanilla JavaScript**, **GSAP + ScrollTrigger**, **Lenis** (smooth scroll) and **Three.js** (3D truck and box).

> **Before launch:** every business fact lives in `src/content/business.js` and is marked *VERIFY WITH OWNER BEFORE LAUNCH*. Numbers that haven't been confirmed show a small red **À CONFIRMER / TO CONFIRM** tag on the site. See the [launch checklist](#before-launch-checklist) at the end of this file.

---

## 1. Run it on your computer

1. Install **Node.js 20 or newer** (the "LTS" version): https://nodejs.org
2. Open a terminal in this folder and run:
   ```bash
   npm install
   npm run dev
   ```
3. Open **http://localhost:5173** (French) and **http://localhost:5173/en/** (English).
   Pages reload automatically when you save a file.

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the final site into the `dist/` folder |
| `npm run preview` | Serves `dist/` locally to check the final build |
| `npm run images` | Optimizes photos from `assets/photos/` (see section 4) |

---

## 2. Edit the text (French and English)

All wording is in two files:

- `src/content/fr.js`: French (default language)
- `src/content/en.js`: English

Change only the text between the quotes `'…'`. Keep both files in the same structure. Things like `{phone}` or `{n}` are filled in automatically, so leave them as they are.

**Business facts** (phones, address, hours, Facebook, fleet, counters, licence) are in **`src/content/business.js`**, used by both languages.

- **Counters** (years, moves…): change `value`, then set `confirmed: true` to remove the "À confirmer" tag.
- **Fleet**: sizes and the capacity used by the form's truck estimate.
- **RBQ / insurance**: fill in `licence.rbq` / `licence.insurance`.
- **Reviews**: paste real Google/Facebook reviews into `reviews: []` (example in the file). The empty "Avis à venir" slots are replaced automatically.

The service-area map and the "is my area covered?" checker use `src/content/map-data.js` (sector names are listed at the bottom).

---

## 3. Replace the logo ⚠️ (currently a temporary placeholder)

No logo was provided, so the site shows a **temporary black-and-red "LODICO TRANSPORT" wordmark**. To use the real one:

1. Put the logo file in `public/brand/` (SVG is best, otherwise a transparent PNG), e.g. `public/brand/logo.svg`.
2. In `src/content/business.js`, set `logo: '/brand/logo.svg'`.
3. Replace `public/favicon.svg` (browser tab icon) and `public/apple-touch-icon.png` (180×180 px).
4. **Social image** (`public/og-image.jpg`, shown when the link is shared on Facebook, texts, etc.): replace it with any 1200×630 JPG that includes the real logo. The current one was made from `scripts/og-image.html`: open that file in Chrome, set the window to 1200×630 (DevTools → device toolbar) and take a screenshot.

---

## 4. Add real photos (trucks, team, jobs)

The site has labelled **"Photo réelle à venir"** slots for real photos. No stock photos are presented as Lodico's.

1. Copy photos (JPG/PNG) into `assets/photos/`, with simple names: `equipe-lodico.jpg`, `camion-16.jpg`…
2. Run `npm run images`. This creates compressed AVIF + WebP versions in `public/img/`.
3. In `src/content/business.js` → `photos`, write the name without extension:
   ```js
   photos: { team: 'equipe-lodico', truck16: 'camion-16', truck20: null, truck26: null, job: null },
   ```
4. Alt text (for screen readers and Google) is in `fr.js` / `en.js` (`why.photoAlt`, fleet names).

**Stock photos:** if you add any (Unsplash / Pexels), list each one in `CREDITS.md` (photographer, link, license), and never use one where it could pass as Lodico's own truck, crew or customer.

---

## 5. Connect the booking form to an email address

The form sends a complete request (job type, both addresses with floor and access, date, items, photos, contact info, reference number, truck estimate) plus a ready-to-read summary.

There are two options. Pick one in `src/content/business.js` → `formConfig.provider`.

### Option A: Netlify Forms (recommended when hosting on Netlify; photos included)

Free plan: 100 submissions per month, file uploads included, spam filtering built in.

1. Deploy the site on Netlify (section 6). `provider` is already `'netlify'`.
2. In Netlify: **Site configuration → Forms → Enable form detection**, then **redeploy** (Deploys → Trigger deploy) so Netlify detects the form named `booking`.
3. **Forms → Form notifications → Add notification → Email notification**. Enter the email address that should receive requests, and select the form `booking`.
4. Test it: send a request on the live site. It appears under **Forms → booking** and arrives by email.

### Option B: Web3Forms (any host, including Vercel; photos are not sent)

Free plan: 250 submissions per month.

1. Go to https://web3forms.com, enter the email address that should receive requests, and copy the **Access Key** they email you.
2. In `src/content/business.js`, set `provider: 'web3forms'`.
3. Copy `.env.example` to a new file named `.env` and paste the key:
   ```
   VITE_WEB3FORMS_KEY=your-access-key
   ```
   On Netlify/Vercel, add the same variable under **Environment variables** in the site settings, then redeploy.
4. With this option the form tells visitors to text their photos after the call.

### Spam protection (already built in)
- Hidden **honeypot** field: bots that fill it get a fake "success" and nothing is sent.
- **Time trap**: forms completed in under 4 seconds are ignored.
- **Rate limit**: one request per device every 2 minutes (`formConfig.rateLimitMs`).
- Netlify adds its own spam filter. Web3Forms has optional hCaptcha in its dashboard.

### Testing locally
In `npm run dev`, submissions are **simulated** (nothing is sent; the data is printed in the browser console). To send real test requests from your computer, add `VITE_FORM_LIVE=1` to `.env` (Web3Forms only; Netlify Forms only work on the deployed site).

Answers are **saved in the visitor's browser** while they fill the form (a refresh doesn't lose them) and cleared after sending.

---

## 6. Put it online for free

### Netlify (recommended)
1. Create a free account at https://netlify.com.
2. **Easiest**: put this project on GitHub, then in Netlify **Add new site → Import an existing project → GitHub** and pick the repository. The settings are read from `netlify.toml` (build command `npm run build`, folder `dist`).
   *Without GitHub:* run `npm run build` and drag the `dist/` folder onto https://app.netlify.com/drop (forms still work).
3. Set up the booking email (section 5, option A).

### Custom domain (e.g. lodicotransport.ca)
1. Buy the domain (e.g. at a Canadian registrar).
2. Netlify: **Domain management → Add a domain**, then follow the instructions (point the domain's DNS to Netlify, or use Netlify DNS). HTTPS is automatic.
3. **Important:** in `src/content/business.js`, change `siteUrl` to the real domain (no trailing `/`) and redeploy. Search engines, the sitemap and social previews use it.
4. Optional: submit `https://your-domain/sitemap.xml` in Google Search Console, and create or claim the **Google Business Profile** with the same address, phone and hours. That matters as much as the site for local searches.

### Vercel (alternative)
Import the GitHub repository at https://vercel.com (framework preset "Vite"). Netlify Forms don't exist on Vercel, so use **Option B (Web3Forms)** for the booking email.

---

## 7. How the project is organized

```
index.html, en/index.html     Page shells (content is generated from the templates)
vite.config.js                Pre-renders FR + EN pages, writes sitemap.xml + robots.txt
src/content/                  ← EDIT HERE: business.js, fr.js, en.js, map-data.js
src/templates/                HTML for each section (hero, services, fleet, booking…)
src/styles/                   base (colors, fonts, buttons), layout, sections, booking
src/js/motion.js              Smooth scroll, reveals, pinned hero/fleet, cursor, magnetic buttons
src/js/booking/               Booking form: steps, validation, manifest label, estimate, sending
src/js/three/                 3D truck scene + 3D box scene (loaded only on desktop)
src/js/area.js                Service-area map + area checker
public/                       Favicon, social image, optimized photos
assets/photos/                Your original photos (input for `npm run images`)
scripts/                      Photo optimizer, social image source
```

**Performance and accessibility choices**
- Both languages are real HTML pages (good for Google), linked with `hreflang`.
- Three.js loads only on desktop, after the visitor first interacts, and only draws when something moves. Phones and "reduce motion" users get static illustrations.
- Everything works with the keyboard; form errors are announced to screen readers.
- Last Lighthouse check (local production build): mobile 95/100/100/100, desktop 100/100/100/100 (Performance / Accessibility / Best practices / SEO).

---

## Before launch checklist

Everything below is a placeholder or needs Johnny Lodico's confirmation:

- [ ] **Logo**: temporary wordmark → real logo, favicon, social image (section 3)
- [ ] **Real photos**: team, trucks, jobs (section 4)
- [ ] **Domain**: `siteUrl` in `business.js` (currently `https://lodico-transport.netlify.app`)
- [ ] **Booking email** connected and tested (section 5)
- [ ] **Counters**: years in business (10+), moves done (1 000+), number of trucks (3)
- [ ] **Fleet**: 16 / 20 / 26 ft sizes and example capacities (studio–3½ / 4½–5½ / house or office)
- [ ] **Services**: what's included in each (blankets and straps, basic disassembly, same-day pickup, short notice…)
- [ ] **"Why Lodico" promises**: careful handling, on time, clear prices, "no call centre"
- [ ] **FAQ answers**: pricing, insurance, items refused, stairs/elevators, cancellations, July 1st, store deliveries
- [ ] **Callback promise**: "within 1 business day" (`callbackBusinessDays`)
- [ ] **RBQ licence / insurance** info in the footer (or remove the line if not applicable)
- [ ] **Service area**: list of covered sectors (`map-data.js`), and how to word nearby areas ("ask us")
- [ ] **Reviews**: add real Google/Facebook reviews (with permission)
- [ ] Phones, address, hours and Facebook link (already filled in from the brief, but double-check)
