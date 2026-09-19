// Leah's Cave Adventure - offline support
// Strategy: network-first, fall back to cache.
// This means a fresh upload to GitHub Pages is ALWAYS picked up when online,
// while the game still runs with no signal at all.

const CACHE = 'leah-cave-v1';
const PRECACHE = [
  './',
  './index.html',
  './dressup.html',
  './dress-base-girl.png',
  './dress-base-boy.png',
  './dress-face-01.png',
  './dress-face-02.png',
  './dress-face-03.png',
  './dress-face-04.png',
  './dress-face-05.png',
  './dress-face-06.png',
  './dress-face-07.png',
  './dress-face-08.png',
  './dress-face-09.png',
  './dress-face-10.png',
  './dress-hair-01.png',
  './dress-hair-02.png',
  './dress-hair-03.png',
  './dress-hair-04.png',
  './dress-hair-05.png',
  './dress-hair-06.png',
  './dress-hair-07.png',
  './dress-hair-08.png',
  './dress-hair-09.png',
  './dress-hair-10.png',
  './dress-eyes-01.png',
  './dress-eyes-02.png',
  './dress-eyes-03.png',
  './dress-eyes-04.png',
  './dress-eyes-05.png',
  './dress-eyes-06.png',
  './dress-eyes-07.png',
  './dress-eyes-08.png',
  './dress-eyes-09.png',
  './dress-eyes-10.png',
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
  './art-mon2-walk.png',
  './art-boss2-walk.png',
  './art-mon3-walk.png',
  './art-mon3-hurt.png',
  './art-boss3-walk.png',
  './art-boss3-sleep.png',
  './art-hazards3.png',
  './art-fx-spikes.jpg',
  './art-fx-rockfall.jpg',
  './art-cave5.jpg',
  './art-win7.jpg',
  './art-win8.jpg',
  './art-win9.jpg',
  './bgm-deep.mp3',
  './bgm-victory.mp3',
  './art-reward6.png',
  './art-mon2-hurt.png',
  './art-win4.jpg',
  './art-win5.jpg',
  './art-win6.jpg',
  './sfx-step.mp3',
  './sfx-slash.mp3',
  './art-boss-floor.jpg',
  './art-boss-wall.jpg',
  './art-boss-gate.png',
  './art-boss-sleep.png',
  './art-hazards.png',
  './art-fx-slam.jpg',
  './bgm-boss.mp3',
  './bgm-boss2.mp3',
  './sfx-slam.mp3',
  './sfx-rock.mp3',
  './sfx-crystal.mp3',
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
  './art-warp.png',
  './art-fx-warp.jpg',
  './art-lose.jpg',
  './bgm-calm.mp3',
  './bgm-escape.mp3',
  './sfx-collect.mp3',
  './sfx-correct.mp3',
  './sfx-wrong.mp3',
  './sfx-magic.mp3',
  './sfx-hit.mp3',
  './sfx-win.mp3',
  './sfx-bolt.mp3',
  './sfx-warp.mp3',
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
