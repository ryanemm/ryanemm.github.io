'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"index.html": "8570829c895a0d7098d1394bbc915373",
"/": "8570829c895a0d7098d1394bbc915373",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"version.json": "372a94bdc218fe548258a2aebf00464e",
"flutter.js": "0816e65a103ba8ba51b174eeeeb2cb67",
"assets/AssetManifest.json": "cf77aec00ae306dcdbe6c5258b4f2b9e",
"assets/kosi_connect_logo.png": "272bd72b18d32012a73dea4d80675f1a",
"assets/fonts/MaterialIcons-Regular.otf": "95db9098c58fd6db106f1116bae85a0b",
"assets/assets/images/process_infographic.png": "9437ecd3fa5331c503f8de869af3d1cf",
"assets/assets/images/logos/twitter.png": "b5bc5e8c9c63b7ef1c4093519977cccc",
"assets/assets/images/custom_software_1.png": "86fd6c6171ba0c14fb1f308ebb685355",
"assets/assets/images/ellie_writes.png": "5709cda9d72109b68023efc65d3e08b8",
"assets/assets/images/header.jpg": "b380d1fc5884ae13eb7179ce1db2025a",
"assets/assets/images/pro8_tech_mobile.png": "d456b3209a7f3eb1d3480487d4408db0",
"assets/assets/images/header_desktop1.jpeg": "0c84b9780af71606e416d881efff0d38",
"assets/assets/images/pro8_tech_desktop.png": "8fe937d22a6639774cfeca1aa48367c8",
"assets/assets/images/process_infographic_mobile.jpg": "913a9e3edf8859b57155a8947c52df5c",
"assets/assets/images/whatsapp.png": "97db2bf114f6e7c411a652f106408911",
"assets/assets/images/skyline_grey.png": "0e905b3e9929d3772333f45d6729fcbf",
"assets/assets/images/web_dev_fill_1.png": "9097c7cebd5e1f7bb3dc6f6d534570e3",
"assets/assets/images/mobile_dev_fill_1.png": "0393b3533ffff62a2c66c44a5f48f7ae",
"assets/assets/images/nelspruit1_mobile_blur.jpeg": "57dc5e6d9b59051b0590a5868819b0f0",
"assets/assets/images/skyline_2.png": "feb2fc3c7b2f9b63f7134a106174eb48",
"assets/assets/images/web_dev_graphic.png": "e8a012ca3abb17484474a104bc5b97e4",
"assets/assets/images/ellie_writes_mobile.jpg": "25aef7aa56354cdeb536dedd44d9fbb1",
"assets/assets/images/company_logo_navbar.png": "7af5d36e8c0536fb3bc24e69726d9ace",
"assets/assets/images/company_logo.png": "fda14c14cb30297030f8cafd961f9817",
"assets/packages/yaru_widgets/assets/ubuntu_logo.png": "1cd87df893e3c75b7df2e850e0dfc1d7",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/NOTICES": "53ac67b281ba3eb432d68561dcea1adf",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"main.dart.js": "f9eac1f97c2c4f4cc9fdbdb35c926e33",
"manifest.json": "2de99ccc797eb8b03d271436928b2e6e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
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
