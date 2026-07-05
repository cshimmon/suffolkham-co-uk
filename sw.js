var CACHE = 'suffolkham-v3';

var PRECACHE = [
  '/',
  '/about',
  '/bandplan',
  '/calculators',
  '/dmr',
  '/equipment',
  '/events',
  '/getting-started',
  '/glossary',
  '/locator',
  '/meshcore',
  '/nets',
  '/raynet',
  '/repeaters',
  '/404.html',
  '/style.css',
  '/nav.js',
  '/nav.json',
  '/manifest.json',
  '/favicon.png',
  '/apple-touch-icon.png'
];

var DATA = [
  '/repeaters.json',
  '/nets.json',
  '/events.json',
  '/band-conditions.json',
  '/rsgb-news.json'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(PRECACHE); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin || e.request.method !== 'GET' || e.request.mode === 'navigate') return;

  if (DATA.indexOf(url.pathname) !== -1) {
    // Network-first for live data — always try fresh, fall back to cache offline
    e.respondWith(
      fetch(e.request).then(function (res) {
        caches.open(CACHE).then(function (c) { c.put(e.request, res.clone()); });
        return res;
      }).catch(function () { return caches.match(e.request); })
    );
  } else {
    // Stale-while-revalidate for static assets — instant from cache, refresh in background
    e.respondWith(
      caches.match(e.request).then(function (cached) {
        var network = fetch(e.request).then(function (res) {
          if (res.ok) caches.open(CACHE).then(function (c) { c.put(e.request, res.clone()); });
          return res;
        });
        return cached || network;
      })
    );
  }
});
