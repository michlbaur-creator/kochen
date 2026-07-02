const VERSION = 'kochen-shell-v1';
const KERN = ['./', './index.html', './manifest.webmanifest', './assets/app.js', './assets/icon-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(KERN)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('message', e => { if (e.data === 'SKIP_WAITING') self.skipWaiting(); });

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  if (e.request.destination === 'image') {
    e.respondWith(caches.open(VERSION).then(c => c.match(e.request).then(r => r || fetch(e.request).then(n => { if (n.ok && url.origin === location.origin) c.put(e.request, n.clone()); return n; }).catch(() => r))));
    return;
  }
  e.respondWith(fetch(e.request).then(n => {
    if (n.ok && url.origin === location.origin) caches.open(VERSION).then(c => c.put(e.request, n.clone()));
    return n;
  }).catch(() => caches.match(e.request).then(r => r || caches.match('./'))));
});
