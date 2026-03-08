const CACHE_NAME = 'iptv-player-shell-v3';
const BASE_PATH = new URL(self.registration.scope).pathname;
const APP_SHELL = [
  BASE_PATH,
  `${BASE_PATH}index.html`,
  `${BASE_PATH}manifest.webmanifest`,
  `${BASE_PATH}pwa-icon.svg`,
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const {request} = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Never cache proxy/API requests
  if (url.pathname.includes('/proxy')) return;

  // For SPA navigations use network-first to avoid stale blank pages
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(`${BASE_PATH}index.html`, responseToCache));
          return response;
        })
        .catch(() => caches.match(`${BASE_PATH}index.html`)),
    );
    return;
  }

  // Static assets: cache-first + network fallback
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));

          return networkResponse;
        })
        .catch(() => caches.match(BASE_PATH));
    }),
  );
});
