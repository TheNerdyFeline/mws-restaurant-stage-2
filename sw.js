let staticCacheName = "restaurant-app-v5";
let imagesCache = "restaurant-images-v1";
let allCaches = [staticCacheName, imagesCache];
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     new Response('<p class="a-winner">Hello World!</p>', {
//       headers: {'Content-Type': 'text/html'}
//     })
//   );
// });
// install serviceworker and cache assests (no images)
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      console.log('installing');
      return cache.addAll([
        '/',
        'index.html',
        '/js/dbhelper.js',
        '/js/main.js',
        '/css/styles.css'
      ]);
      // console.log('installed sw');
    })
  );
});

// update cache and delete old
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName.startsWith('restaurant-') &&
            !allCaches.includes(cacheName);
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log('test fetch');
  let requestUrl = new URL(event.request.url);
  if(requestUrl.origin === location.origin) {
    if(requestUrl.pathname === '/') {
      event.respondWith(caches.match('/index.html'));
      return;
    }
  } 
  
  event.respondWith(
    caches.match(event.request).then(function(res) {
      return res || fetch(event.request);
    })
  );
});
 

//hijack response so it checks cache first
// self.addEventListener('fetch', function(event) {
//   console.log('fetch');
//   event.respondWith(
//     caches.match(event.request).then(function(res) {
//       return res || fetch(event.request);
//     })
//   );
// });


