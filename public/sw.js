/// <reference lib="WebWorker" />
const CACHE_NAME = 'terraquest-app-shell-v1';
const APP_SHELL = [
    '/',
    '/index.html',
    '/manifest.webmanifest',
    '/favicon.svg',
    '/world-continents.svg',
    '/icons/icon-192.png',
    '/icons/icon-512.png'
];
self.addEventListener('install', (event) => {
    event.waitUntil(caches
        .open(CACHE_NAME)
        .then((cache) => cache.addAll(APP_SHELL))
        .then(() => self.skipWaiting()));
});
self.addEventListener('activate', (event) => {
    event.waitUntil(caches
        .keys()
        .then((cacheNames) => Promise.all(cacheNames
        .filter((cacheName) => cacheName !== CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName))))
        .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (event) => {
    const request = event.request;
    if (request.method !== 'GET') {
        return;
    }
    const requestUrl = new URL(request.url);
    // Same-origin only
    if (requestUrl.origin !== self.location.origin) {
        return;
    }
    if (request.mode === 'navigate') {
        event.respondWith((async () => {
            const cached = await caches.match('/index.html');
            if (cached) {
                return cached;
            }
            const response = await fetch(request);
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy));
            return response;
        })());
        return;
    }
    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        try {
            const networkResponse = await fetch(request);
            if (networkResponse.status === 200 && networkResponse.type === 'basic') {
                cache.put(request, networkResponse.clone()).catch(() => undefined);
            }
            return networkResponse;
        }
        catch (error) {
            const fallback = await cache.match('/index.html');
            if (fallback) {
                return fallback;
            }
            return new Response('Offline', { status: 503, statusText: 'Servicio sin conexión' });
        }
    })());
});
export {};
