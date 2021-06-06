
  const CACHE_NAME = "static-cache-v2";
  const DATA_CACHE_NAME = "data-cache-v1";
  const FILES_TO_CACHE = [
    '/',
    '/index.html',
    '/db.js',
    '/index.js',
    '/style.css',
  ];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('static').then(cache =>{
            return cache.addAll(FILES_TO_CACHE);
        })
    );
    console.log('installed');
    self.skipWaiting();
});

e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
    cache.add('./icons'))
)
e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
)
self.addEventListener('fetch', e =>{
    if (e.request.url.includes('/api')) {
        e.respondWith(
            caches.open(DATA_CACHE_NAME).then (cache => {
                return fetch(e.request)
                .then(response => {
                    if(response.status === 200) {
                        cache.put(e.request.url, res.clone());
                    }
                    return res;
                })
                .catch(err => {
                    return cache.match(e.request);
                });
            }).catch(err => console.log(err))
        );
        return;
    }
    e.respondWith(caches.open(CACHE_NAME).then(cache => {
        return cach.match(e.request).then(res => {
            return res || fetch(e.request);
        });
    })
    );
});