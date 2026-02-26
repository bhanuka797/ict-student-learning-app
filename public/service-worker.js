const CACHE_NAME = 'ict-learning-v1';
const CORE_ASSETS = [
  '/index.html',
  '/dashboard.html',
  '/admin/index.html',
  '/css/styles.css',
  '/js/main.js',
  '/js/auth.js',
  '/js/access.js',
  '/js/firebase-config.js',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => cached || fetch(event.request).then((response) => {
      const cloned = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
      return response;
    }).catch(() => caches.match('/index.html')))
  );
});
