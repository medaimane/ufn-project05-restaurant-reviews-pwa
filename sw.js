const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/',
    '/restaurant.html',
    '/favicon.ico', // styles
    '/css/styles.css',
    'https://fonts.googleapis.com/css?family=Dancing+Script&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css',
    'https://api.mapbox.com/mapbox-gl-js/v1.2.0/mapbox-gl.css',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
    '/js/databaseHelper.js', // scripts
    '/js/registerSW.js',
    '/js/main.js',
    '/js/restaurantInfo.js',
    'https://api.mapbox.com/mapbox-gl-js/v1.2.0/mapbox-gl.js',
    'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
    '/img/1.jpg',
    '/img/2.jpg',
    '/img/3.jpg',
    '/img/4.jpg',
    '/img/5.jpg',
    '/img/6.jpg',
    '/img/7.jpg',
    '/img/8.jpg',
    '/img/9.jpg',
    '/img/10.jpg',
    '/data/restaurants.json',
];

/**
 * Install a service worker
 */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

/**
 * Cache and return requests
 */
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }

                let fetchRequest = event.request.clone();
                return fetch(fetchRequest).then(
                    response => {
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        let responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(cache =>
                                cache.put(event.request, responseToCache)
                            );

                        return response;
                    }
                );
            })
    );
});

/**
 * Update a service worker
 */
self.addEventListener('activate', event => {
    let cacheWhitelist = ['my-site-cache-v1'];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
