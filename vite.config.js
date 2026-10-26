/* Vite config.
 * The `lodicoPages` plugin pre-renders the French (/) and English (/en/)
 * pages from the templates + content files, so both are complete HTML for
 * search engines, and generates sitemap.xml + robots.txt from business.js. */

import { defineConfig } from 'vite';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('.', import.meta.url));

function lodicoPages() {
  let server;
  const load = (file) =>
    server
      ? server.ssrLoadModule(file)
      : import(pathToFileURL(root + file.slice(1)).href);

  return {
    name: 'lodico-pages',
    configureServer(s) {
      server = s;
    },
    transformIndexHtml: {
      order: 'pre',
      async handler(html, ctx) {
        const lang = /(^|\/)en\//.test(ctx.filename.replace(root, '')) ? 'en' : 'fr';
        const { renderPage } = await load('/src/templates/page.js');
        const page = renderPage(lang);
        return html
          .replace('<!--HTML_LANG-->', page.htmlLang)
          .replace('<!--HEAD-->', page.head)
          .replace('<!--BODY-->', page.body);
      },
    },
    handleHotUpdate({ file, server: s }) {
      if (/src\/(content|templates)\//.test(file)) s.ws.send({ type: 'full-reload' });
    },
    async generateBundle() {
      const { business } = await load('/src/content/business.js');
      const url = business.siteUrl;
      const today = new Date().toISOString().slice(0, 10);
      const entry = (loc) => `  <url>
    <loc>${url}${loc}</loc>
    <lastmod>${today}</lastmod>
    <xhtml:link rel="alternate" hreflang="fr-CA" href="${url}/"/>
    <xhtml:link rel="alternate" hreflang="en-CA" href="${url}/en/"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${url}/"/>
  </url>`;
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entry('/')}
${entry('/en/')}
</urlset>
`,
      });
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n\nSitemap: ${url}/sitemap.xml\n`,
      });
    },
  };
}

export default defineConfig({
  plugins: [lodicoPages()],
  build: {
    target: 'es2020',
    // Three.js is a lazy, desktop-only chunk (~145 kB gzip); silence the size warning
    chunkSizeWarningLimit: 700,
    cssCodeSplit: true,
    rollupOptions: {
      input: {
        fr: fileURLToPath(new URL('./index.html', import.meta.url)),
        en: fileURLToPath(new URL('./en/index.html', import.meta.url)),
      },
    },
  },
});
