// Visitenkarte – Offline-Speicher: Seite, Icon, QR-Bibliothek, Kontaktdatei und Schriften.
// Bei Änderungen VERSION erhöhen.
const VERSION = 'visitenkarte-v1';
const DATEIEN = ['./', 'index.html', 'qrcode.js', 'icon.svg', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'favicon-32.png',
  'patrick-schaefer.vcf', 'manifest.webmanifest', '/fonts/fonts.css',
  '/fonts/bricolage-grotesque-500-800-normal-latin.woff2', '/fonts/bricolage-grotesque-500-800-normal-latin-ext.woff2',
  '/fonts/work-sans-500-700-normal-latin.woff2', '/fonts/work-sans-500-700-normal-latin-ext.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(DATEIEN)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n.startsWith('visitenkarte-') && n !== VERSION).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== location.origin) return;
  // erst Internet (neueste Fassung), sonst Speicher – „?qr“ nutzt dieselbe Seite
  e.respondWith(fetch(r).then(a => { if (a.ok && u.search === '') { const k = a.clone(); caches.open(VERSION).then(c => c.put(r, k)); } return a; })
    .catch(() => caches.match(r, { ignoreSearch: true }).then(t => t || caches.match('index.html'))));
});
