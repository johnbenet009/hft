const CACHE_NAME = 'hft-cache-v1';
const urlsToCache = [
  // Use relative paths so this works when hosted on a subpath (e.g. /hft/ on GitHub Pages)
  './',
  './index.html',
  './logo.svg',
  './manifest.json',
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) return response;
      return fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) return caches.delete(cacheName);
        })
      )
    )
  );
});