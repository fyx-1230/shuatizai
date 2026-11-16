/* 刷题仔 · Service Worker
 *
 * 作用：把 index.html 和图标缓存进手机/电脑，做到「成功打开过一次，之后断网也能用」。
 * 策略：
 *   · 导航请求：网络优先 → 失败回落缓存（改版后刷新即见新版，断网照开）
 *   · 静态资源：缓存优先 → 未命中再走网络，并把结果写回缓存
 *
 * 重要：Service Worker 只在 https（或 localhost / 127.0.0.1）下才注册成功。
 * 直接双击用 file:// 打开不受影响 —— 页面本来就零外链，照样能用，
 * 只是没有「装到主屏」和「离线白屏兜底」这两项 PWA 能力。
 *
 * 改版时把 VERSION 加一，activate 阶段会自动清掉旧缓存。
 */
const VERSION = 'v1.6.0';
const CACHE = 'wenzai-' + VERSION;
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(ASSETS).catch(() => null))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => k.startsWith('wenzai-') && k !== CACHE).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // 页面导航：网络优先
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match('./index.html')))
    );
    return;
  }

  // 静态资源：缓存优先
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => hit);
    })
  );
});
