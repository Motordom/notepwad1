const CACHE_VERSION = 'v0.0.3';
const CACHE_NAME = `notepad-cache-${CACHE_VERSION}`;
const BASE_URL = self.location.pathname.replace(/sw\.js$/, ''); // auto-detect base path

const ASSETS = [
  `${BASE_URL}index.html`,
  `${BASE_URL}style.css`,
  `${BASE_URL}app.js`,
  `${BASE_URL}manifest.json`,
  `${BASE_URL}sw.js`,
  `${BASE_URL}favicon-16.png`,
  `${BASE_URL}favicon-32.png`,
  `${BASE_URL}icon-192.png`,
  `${BASE_URL}icon-512.png`,
];

self.addEventListener('install', (event) => {
  console.log('[SW] Installing and caching assets...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating and cleaning old caches...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});