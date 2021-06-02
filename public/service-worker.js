self.addEventListener('install', e => {
    e.waitUntil(
        caches.open('static').then(cache =>{
            return cache.addAll([
                './',
                'index.html',
                './styles.css',
                './icons/icon-192x192.png',
                './icons/icon-512x512.png'
            ]);
        })
    );
    console.log('install');
    self.skipWaiting();
});
self.addEventListener('fetch', e =>{
    e.respondWith(
        caches.match(e.request).then(request => {
            return response || fetch (e.request);
        })
    );
});