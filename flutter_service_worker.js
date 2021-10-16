'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "main.dart.js": "c87c06a3aed896061213bab5814d9d6c",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"index.html": "0395916b06b446f2ade893fcb83f8a07",
"/": "0395916b06b446f2ade893fcb83f8a07",
"assets/AssetManifest.json": "e734221625fe6b153fbc09d07abaf22f",
"assets/assets/images/web_dev_graphic.png": "96c7c97e5aa784024a2e0bfc4519cdbf",
"assets/assets/images/web_dev_fill.png": "562e597356f84f06c02098876c1469bd",
"assets/assets/images/cover_2.jpg": "5bff6330479aed404c38ef55e0ee9a5e",
"assets/assets/images/mobile_dev_outline.png": "b7665404ec04dbe1f269fafac2c793d2",
"assets/assets/images/sign_1.png": "4ca811d70123dd1505f52a52fbf8c6ba",
"assets/assets/images/sign.png": "4910b606ae222a8cba8833fac6019c09",
"assets/assets/images/student_management_system.png": "125bba97205de186dbc3f997c63ca386",
"assets/assets/images/mail.png": "0836614f2d0a363392655da257655409",
"assets/assets/images/cover.jpg": "d77e2a943222d4deafd39a8ec7558270",
"assets/assets/images/finger.jpg": "d8130d43c801c0302cef49d7719df0c5",
"assets/assets/images/mobile_dev_fill_1.png": "0393b3533ffff62a2c66c44a5f48f7ae",
"assets/assets/images/custom_software_1.png": "ad2539e804871f98ada26f07ee43b630",
"assets/assets/images/web_dev_fill_1.png": "4974a68c6c4b682f09f13db264df2935",
"assets/assets/images/ellie_writes_2.png": "19d5d137f0b373c77ea3db8333ff702a",
"assets/assets/images/logos/php.png": "310403ec394e8cfe308af0e16af9db38",
"assets/assets/images/logos/pandas.png": "53a0683deff201585ff8b5dc9401e726",
"assets/assets/images/logos/flutter.png": "d21f1eecaeaab081ba7efec1721c0712",
"assets/assets/images/logos/github.png": "30485e2973af4b569890794e84715d4d",
"assets/assets/images/logos/mysql.png": "754e01e49836a295574661a188161775",
"assets/assets/images/logos/dart.png": "46d44c788895a7ae380027051112aa39",
"assets/assets/images/logos/linkedin.png": "a9fd59290c2ea49d7430e8516cca404f",
"assets/assets/images/logos/python.png": "abfd56e8e8f263e793fda40eb657fe3d",
"assets/assets/images/logos/my_logo_white.png": "5d146dfabe6450ef86f2ca717ce98dd9",
"assets/assets/images/logos/line.png": "6135730ee7e1e8016fe035acafd5d35b",
"assets/assets/images/logos/my_logo.png": "193f1b6991435012239a041722f42cfc",
"assets/assets/images/logos/twitter.png": "47cce776d46ebcab12724be3e319017d",
"assets/assets/images/demo.gif": "99076a7d927229fb239ffab57b13dd26",
"assets/assets/images/web_dev_outline.png": "48dbd0d8275f10f2ecd3e6d45c4f5133",
"assets/assets/images/phone_1.jpg": "8619b14526012368c72a8913a5a52910",
"assets/assets/images/ellie_writes.png": "5f9f1faa55c1ef89092ae7628742ca54",
"assets/assets/images/phone.png": "a107ab9837dd676f8bef60c78afbd05f",
"assets/assets/images/cover_4.jpg": "6bb5f3a8a90f2f133c7924a80911bd6a",
"assets/assets/images/cover_1.jpg": "01a2948c7146d66e9cb2bf1ab617897f",
"assets/assets/images/mobile_dev_fill.png": "bb2db82c72db82916be6ba793bd4a470",
"assets/assets/images/sign_2.png": "4dc695fe5a953deae41aea52255d3127",
"assets/assets/images/ellie_writes_1.png": "6c1719025abc1745a30fca89b8ad10fb",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/NOTICES": "5551236cd54d9c99dd6b80e5fa0329b5",
"manifest.json": "60091747cc42c4f25033351cba54fc65",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"styles.css": "ac86fe007f705ebe3d958cf615414a6e",
"version.json": "aaafa928a4f8616604eca12d830fe765"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
