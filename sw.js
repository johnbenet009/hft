const CACHE_NAME = 'hft-cache-v1';
const urlsToCache = [
  // Use relative paths so this works when hosted on a subpath (e.g. /hft/ on GitHub Pages)
  './',
  './index.html',
  './logo.svg',
  './manifest.json',
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('fetch', event => {
  const url = event.request.url;
  const isApiCall = url.includes('supabase.co') || url.includes('/rest/v1/') || url.includes('/auth/v1/');

  // Only handle GET requests for static files, and ignore ALL API calls
  if (event.request.method !== 'GET' || isApiCall) {
    return;
  }

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