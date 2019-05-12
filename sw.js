let staticCacheName = 'rest-rev-cache-v4';

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
        'img/resized/1_1x.jpg',
        'img/resized/1_2x.jpg',
        'img/resized/2_1x.jpg',
        'img/resized/2_2x.jpg',
        'img/resized/3_1x.jpg',
        'img/resized/3_2x.jpg',
        'img/resized/4_1x.jpg',
        'img/resized/4_2x.jpg',
        'img/resized/5_1x.jpg',
        'img/resized/5_2x.jpg',
        'img/resized/6_1x.jpg',
        'img/resized/6_2x.jpg',
        'img/resized/7_1x.jpg',
        'img/resized/7_2x.jpg',
        'img/resized/8_1x.jpg',
        'img/resized/8_2x.jpg',
        'img/resized/9_1x.jpg',
        'img/resized/9_2x.jpg',
        'img/resized/10_1x.jpg',
        'img/resized/10_2x.jpg',
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