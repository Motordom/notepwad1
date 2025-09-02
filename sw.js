const CACHE_NAME = 'notepad-cache-v1';

// Auto-detect base URL (works with GitHub Pages subpaths like /notepwad1/)
const BASE_URL = self.location.pathname.replace(/sw\.js$/, '');

const ASSETS = [
  `${BASE_URL}`,
  `${BASE_URL}index.html`,
  `${BASE_URL}style.css`,
  `${BASE_URL}app.js`,
  `${BASE_URL}manifest.json`
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});