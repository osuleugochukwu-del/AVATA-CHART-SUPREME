const CACHE = 'trade-avata-chart-v8.0.4-r2';

const LOCAL = [
  './',
  './index.html',
  './assets/styles.css',
  './src/app.js',
  './src/chart-pane.js',
  './src/data.js',
  './src/drawings.js',
  './src/state.js',
  './src/utils.js',
  './src/indicator-security.js',
  './src/alert-client.js',
  './src/replay-client.js',
  './src/indicators.js',
  './src/analytics.js',
  './src/workspace-sync.js',
  './src/share.js',
  './src/market-intelligence.js',
  './src/ai-client.js',
  './public/brand/trade-avata-logo.svg',
  './manifest.webmanifest'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then(cache => cache.addAll(LOCAL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key =>
              key.startsWith('trade-avata-chart-') &&
              key !== CACHE
            )
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Trade Avata files:
  // always try the newest deployed version first.
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request, { cache: 'no-store' })
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => {
              cache.put(event.request, copy).catch(() => {});
            });
          }

          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);

          if (cached) return cached;

          return caches.match('./index.html');
        })
    );

    return;
  }

  // External chart library:
  // use cached copy when available.
  if (url.hostname === 'unpkg.com') {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) return cached;

        return fetch(event.request).then(response => {
          const copy = response.clone();

          caches.open(CACHE).then(cache => {
            cache.put(event.request, copy).catch(() => {});
          });

          return response;
        });
      })
    );
  }
});
