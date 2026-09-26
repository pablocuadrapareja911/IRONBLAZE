// IRONBLAZE service worker: arranque instantáneo desde caché, modo sin conexión, avisos de descanso y actualizaciones.
// ⚠️ Cada vez que publiques cambios, sube VERSION: así los usuarios ven el aviso "Nueva versión disponible".
const VERSION = '1.5.3';
const APP = 'ironblaze-app-' + VERSION;   // archivos de la app (versión concreta)
const MEDIA = 'ironblaze-media-v1';        // animaciones y fotos de ejercicios
const FONTS = 'ironblaze-fonts-v1';        // tipografías de Google Fonts
const MEDIA_MAX = 400;                     // máximo de imágenes guardadas (evita llenar el móvil)
const SHELL = ['./', 'index.html', 'css/styles.css', 'js/exercises-data.js', 'js/hd-images.js', 'js/es-content.js', 'js/i18n.js',
  'js/store.js', 'js/bodymap.js', 'js/firebase-config.js', 'js/cloud.js', 'js/charts.js', 'js/app.js', 'icon.svg',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/logo-256.png', 'icons/favicon-64.png', 'manifest.webmanifest', 'privacy.html'];

self.addEventListener('install', e => {
  // cache: 'reload' salta la caché HTTP (y la de GitHub) para guardar exactamente esta versión
  e.waitUntil(caches.open(APP)
    .then(c => c.addAll(SHELL.map(u => new Request(u, { cache: 'reload' }))))
    // No se activa sola: espera a que el usuario pulse "Actualizar" (salvo la primera instalación)
    .then(() => { if (!self.registration.active) return self.skipWaiting(); }));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k.startsWith('ironblaze-app-') && k !== APP).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

async function trimMedia() {
  const c = await caches.open(MEDIA), keys = await c.keys();
  for (let i = 0; i < keys.length - MEDIA_MAX; i++) await c.delete(keys[i]); // borra las más antiguas
}
let trimTimer = null;

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;

  // Animaciones y fotos de ejercicios: caché primero (nunca cambian)
  if (url.hostname === 'static.exercisedb.dev' || (url.hostname === 'raw.githubusercontent.com' && url.pathname.includes('/free-exercise-db/'))) {
    e.respondWith(caches.open(MEDIA).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') {
        c.put(req, res.clone());
        clearTimeout(trimTimer); trimTimer = setTimeout(trimMedia, 5000);
      }
      return res;
    }));
    return;
  }

  // Google Fonts y la librería de Firebase (versión fija, nunca cambia): caché primero.
  // Así la sesión se recupera también sin conexión.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com' ||
    (url.hostname === 'www.gstatic.com' && url.pathname.startsWith('/firebasejs/'))) {
    e.respondWith(caches.open(FONTS).then(async c => {
      const hit = await c.match(req);
      if (hit) return hit;
      const res = await fetch(req);
      if (res.ok || res.type === 'opaque') c.put(req, res.clone());
      return res;
    }).catch(() => fetch(req)));
    return;
  }

  // Archivos de la propia app: caché primero (arranque instantáneo). Lo nuevo llega con cada versión del SW.
  if (url.origin === location.origin) {
    e.respondWith((async () => {
      const cache = await caches.open(APP);
      const hit = await cache.match(req, { ignoreSearch: true });
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res.ok) cache.put(req, res.clone());
        return res;
      } catch (err) {
        if (req.mode === 'navigate') return (await cache.match('index.html')) || Response.error();
        return Response.error();
      }
    })());
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
    const ms = Math.max(0, Math.min(15 * 60e3, (+msg.end || 0) - Date.now()));
    // Mantiene vivo el service worker hasta que termina el descanso y lanza la notificación
    e.waitUntil(new Promise(resolve => setTimeout(async () => {
      if (token === restToken) {
        const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        const visible = wins.some(c => c.visibilityState === 'visible' && c.focused);
        if (!visible) {
          await self.registration.showNotification('⏱️ ¡Descanso terminado!', {
            body: 'A por la siguiente serie 🔥', tag: 'ironblaze-rest', renotify: true,
            icon: 'icons/icon-192.png', badge: 'icons/icon-192.png', vibrate: [300, 150, 300, 150, 300], requireInteraction: false
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
