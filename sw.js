// Leah's Cave Adventure - offline support
// Strategy: network-first, fall back to cache.
// This means a fresh upload to GitHub Pages is ALWAYS picked up when online,
// while the game still runs with no signal at all.

const CACHE = 'leah-cave-v1';
const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './art-leah-walk.png',
  './art-dad-walk.png',
  './art-mon-walk.png',
  './art-mon-hurt.png',
  './art-items.png',
  './art-plush.png',
  './art-mom.png',
  './art-floor.jpg',
  './art-wall.jpg',
  './art-cave.jpg',
  './art-cave3.jpg',
  './art-title.jpg',
  './art-logo-th.png',
  './art-logo-en.png',
  './art-dad-cast.png',
  './art-orb-burst.jpg',
  './art-splash.jpg',
  './art-leah-swing.png',
  './art-leah-hurt.png',
  './art-boss-walk.png',
  './art-mom-walk.png',
  './art-powerups.png',
  './art-items2.png',
  './art-reward4.png',
  './art-reward5.png',
  './art-exit.png',
  './art-cave2.jpg',
  './art-cave4.jpg',
  './art-secret.jpg',
  './art-fx-collect.jpg',
  './art-fx-shield.jpg',
  './art-lose.jpg',
  './bgm-calm.mp3',
  './bgm-escape.mp3',
  './sfx-collect.mp3',
  './sfx-correct.mp3',
  './sfx-wrong.mp3',
  './sfx-magic.mp3',
  './sfx-hit.mp3',
  './sfx-win.mp3',
  './win1.mp4',
  './win2.mp4',
  './win3.mp4',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(c =>
      // Never let one missing file abort the whole install
      Promise.all(PRECACHE.map(url => c.add(url).catch(() => null)))
    )
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    fetch(req)
      .then(res => {
        // Stash a fresh copy for offline use
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then(hit => hit || caches.match('./index.html'))
      )
  );
});
