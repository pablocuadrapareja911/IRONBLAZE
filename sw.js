// IRONBLAZE service worker: app sin conexión, caché de animaciones, avisos de descanso y actualizaciones.
// ⚠️ Cada vez que publiques cambios, sube VERSION: así los usuarios ven el aviso "Nueva versión disponible".
const VERSION = '1.4.1';
const APP = 'ironblaze-app-' + VERSION;
const MEDIA = 'ironblaze-media-v1';
const SHELL = ['./', 'index.html', 'css/styles.css', 'js/exercises-data.js', 'js/hd-images.js', 'js/es-content.js', 'js/i18n.js',
  'js/store.js', 'js/bodymap.js', 'js/firebase-config.js', 'js/cloud.js', 'js/charts.js', 'js/app.js', 'icon.svg', 'icons/icon-192.png', 'icons/icon-512.png', 'manifest.webmanifest', 'privacy.html'];

self.addEventListener('install', e => {
  // No se activa solo: espera a que el usuario pulse "Actualizar" (salvo la primera instalación)
  e.waitUntil(caches.open(APP).then(c => c.addAll(SHELL)).then(() => { if (!self.registration.active) return self.skipWaiting(); }));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== APP && k !== MEDIA).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  // Animaciones y fotos de ejercicios: caché primero (no cambian nunca)
  if (url.hostname === 'static.exercisedb.dev' || (url.hostname === 'raw.githubusercontent.com' && url.pathname.includes('/free-exercise-db/'))) {
    e.respondWith(caches.open(MEDIA).then(async c => {
      const hit = await c.match(e.request);
      if (hit) return hit;
      const res = await fetch(e.request);
      if (res.ok || res.type === 'opaque') c.put(e.request, res.clone());
      return res;
    }));
    return;
  }
  // Archivos de la app: red primero (siempre la última versión) y caché si no hay conexión
  if (url.origin === location.origin) {
    e.respondWith(fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(APP).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('index.html'))));
  }
});

// ---- Mensajes desde la app ----
let restToken = 0;
self.addEventListener('message', e => {
  const msg = e.data || {};
  if (msg.type === 'skip-waiting') { self.skipWaiting(); return; }
  if (msg.type === 'rest-cancel') { restToken++; return; }
  if (msg.type === 'rest') {
    const token = ++restToken;
    const ms = Math.max(0, msg.end - Date.now());
    // Mantiene vivo el service worker hasta que termina el descanso y lanza la notificación
    e.waitUntil(new Promise(resolve => setTimeout(async () => {
      if (token === restToken) {
        const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        const visible = wins.some(c => c.visibilityState === 'visible' && c.focused);
        if (!visible) {
          await self.registration.showNotification('⏱️ ¡Descanso terminado!', {
            body: 'A por la siguiente serie 🔥', tag: 'ironblaze-rest', renotify: true,
            icon: 'icon.svg', badge: 'icon.svg', vibrate: [300, 150, 300, 150, 300], requireInteraction: false
          });
        }
      }
      resolve();
    }, ms)));
  }
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(wins => {
    const w = wins[0];
    if (w) return w.focus();
    return self.clients.openWindow('./');
  }));
});
