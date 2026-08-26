const CACHE_NAME = 'jw-cool-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/gallery.html',
    '/blog.html',
    '/styles.css',
    '/gallery-page.css',
    '/blog-page.css',
    '/script.js',
    '/blog-data.js',
    '/site.webmanifest',
    '/img/johnsonwhitelogo.webp',
    '/img/favicon.ico',
    '/img/favicon-16x16.png',
    '/img/favicon-32x32.png',
    '/img/apple-touch-icon.png'
];

const EXTERNAL_ASSETS = [
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css'
];

// Install - cache static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll([...STATIC_ASSETS, ...EXTERNAL_ASSETS]);
        })
    );
    self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

// Fetch - cache-first for static, network-first for dynamic
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip FormSubmit and analytics
    if (url.hostname.includes('formsubmit.co') ||
        url.hostname.includes('googletagmanager.com') ||
        url.hostname.includes('google-analytics.com')) {
        return;
    }

    // Cache-first for same-origin static assets
    if (url.origin === location.origin) {
        event.respondWith(
            caches.match(request).then((cached) => {
                if (cached) return cached;
                return fetch(request).then((response) => {
                    if (response.ok) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
                    }
                    return response;
                });
            })
        );
        return;
    }

    // Network-first for external resources (fonts, icons)
    event.respondWith(
        fetch(request).then((response) => {
            if (response.ok) {
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
        }).catch(() => caches.match(request))
    );
});
