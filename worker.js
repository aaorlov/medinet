importScripts('/cache-polyfill.js');

const CACHE_NAME = 'medinet-cache';

self.addEventListener('activate', event => {
  const currentCachelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys()
      .then(keyList =>
        Promise.all(keyList.map(key => {
          if (!currentCachelist.includes(key)) {
            return caches.delete(key);
          }
        }))
      )
  );
});
// This triggers when user starts the app
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/favicon.ico',
        '/assets/img/icons/icon-256.png',
        '/manifest.json',
        '/static/bundle.main.js',
        // '/static/chunk.vendors.js', //uncomment for prod build
      ]);
    })
  );
});


self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME)
      .then(cache => cache.match(event.request, {ignoreSearch: true}))
      .then(response => {
        return response || fetch(event.request);
      })
  );
});