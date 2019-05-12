let staticCacheName = 'rest-rev-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll([
        '/',
        'js/dbhelper.js',
        'js/main.js',
        'js/restaurant_info.js',
        'data/restaurants.json',
        'css/styles.css',
        'restaurant.html',
        'img/1.jpg',
        'img/2.jpg',
        'img/3.jpg',
        'img/4.jpg',
        'img/5.jpg',
        'img/6.jpg',
        'img/7.jpg',
        'img/8.jpg',
        'img/9.jpg',
        'img/10.jpg',
      ]).catch(error => {
        console.log('Caches open failed: ' + error);
        
      });
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((cacheName) => {
          return cacheName.startsWith('rest-rev-') &&
                cacheName != staticCacheName;
        }).map((cacheName) => {
          return cache.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  let cacheRequest = event.request;
  let cacheUrlObj = new URL(event.request.url);
  if (event.request.url.indexOf('restaurant.html') > -1) {
    const cacheURL = 'restaurant.html';
    cacheRequest = new Request(cacheURL);
  }
  event.respondWith(
    caches.match(cacheRequest).then((response) => {
      return response || fetch(event.request)
        .then(fetchResponse => {
          return caches.open(staticCacheName).then(cache => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        }).catch(error => {
          if (event.request.url.indexOf('.jpg') > -1) {
            return caches.match('/img/na.png');
          }
          return new Response('Application is not connected to the internet', {
            status: 404,
            statusText: 'Application is not connected to the internet'
          });
        })

    })
  );
});