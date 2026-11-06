const CACHE = 'spesapp-v1';
const ASSETS = [
  '/Spesapp/',
  '/Spesapp/index.html',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Passa sempre le chiamate API/Drive alla rete
  if (e.request.url.includes('googleapis.com') ||
      e.request.url.includes('accounts.google.com')) {
    e.respondWith(fetch(e.request));
    return;
  }
  // Per il resto: cache-first con fallback alla rete
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
