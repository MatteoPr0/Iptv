const CACHE_NAME = 'iptv-player-shell-v2';
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

  if (url.pathname.includes('/proxy')) {
    return;
  }

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
        .catch(() => {
          if (request.mode === 'navigate') {
            return caches.match(`${BASE_PATH}index.html`);
          }
          return caches.match(BASE_PATH);
        });
    }),
  );
});
