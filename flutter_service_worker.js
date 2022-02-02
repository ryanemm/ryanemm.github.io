'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"index.html": "c8b6a3e9bd2784b40c22241c24f251fc",
"/": "c8b6a3e9bd2784b40c22241c24f251fc",
"version.json": "4ce2f20aab3a169b910e0d548d595f9c",
"assets/AssetManifest.json": "b26af0d4ea2effc2ce41538e2e654462",
"assets/kosi_connect_logo.png": "272bd72b18d32012a73dea4d80675f1a",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/assets/images/sign_2.png": "4dc695fe5a953deae41aea52255d3127",
"assets/assets/images/company_logo_hero.png": "66143025c5b12bab9888bc6fe6504d78",
"assets/assets/images/process_infographic.png": "148f35e71629f3f230d0091e99a4f45f",
"assets/assets/images/student_management_system.png": "125bba97205de186dbc3f997c63ca386",
"assets/assets/images/cover.jpg": "d77e2a943222d4deafd39a8ec7558270",
"assets/assets/images/ellie_writes_1.png": "6c1719025abc1745a30fca89b8ad10fb",
"assets/assets/images/process_infographic.webp": "77bedec8e223f111426a4c1a923fcbd8",
"assets/assets/images/logos/image%2520(1).png": "bde919017862cb4d6a77b65e261162da",
"assets/assets/images/logos/line.png": "6135730ee7e1e8016fe035acafd5d35b",
"assets/assets/images/logos/my_logo.png": "193f1b6991435012239a041722f42cfc",
"assets/assets/images/logos/my_logo_white.png": "5d146dfabe6450ef86f2ca717ce98dd9",
"assets/assets/images/logos/facebook.png": "ca912229abd9d49cb8269cd0b233a015",
"assets/assets/images/logos/image%2520(3).png": "da9b5ad2d8716e89724f367d34a9e2a3",
"assets/assets/images/logos/mysql.png": "754e01e49836a295574661a188161775",
"assets/assets/images/logos/github.png": "2e6084ee27087e22c1bbe564c4201742",
"assets/assets/images/logos/linkedin.png": "b6e100c1e6d00d5a8d0dbf6447608235",
"assets/assets/images/logos/pandas.png": "53a0683deff201585ff8b5dc9401e726",
"assets/assets/images/logos/twitter_1.png": "ffbac962c35c7bafdce8153acbc5f49e",
"assets/assets/images/logos/instagram.png": "59578e75ceea59fc0338ae197cea7e38",
"assets/assets/images/logos/image%2520(4).png": "5642a9a6cd9c993ce99e9d8da8f8bc5e",
"assets/assets/images/logos/dart.png": "46d44c788895a7ae380027051112aa39",
"assets/assets/images/logos/flutter.png": "d21f1eecaeaab081ba7efec1721c0712",
"assets/assets/images/logos/twitter.png": "b5bc5e8c9c63b7ef1c4093519977cccc",
"assets/assets/images/logos/php.png": "310403ec394e8cfe308af0e16af9db38",
"assets/assets/images/logos/python.png": "abfd56e8e8f263e793fda40eb657fe3d",
"assets/assets/images/logos/image%2520(5).png": "7f0c0b7f0e088f6dd5fcba34d41a614a",
"assets/assets/images/web_dev_fill.png": "92b3b530c57432f6f483721d7b1904f0",
"assets/assets/images/custom_software_1.png": "86fd6c6171ba0c14fb1f308ebb685355",
"assets/assets/images/custom_software.png": "b7c49c7625ab71d93d90687507f3cc2b",
"assets/assets/images/cover_1.jpg": "01a2948c7146d66e9cb2bf1ab617897f",
"assets/assets/images/ellie_writes.png": "5f9f1faa55c1ef89092ae7628742ca54",
"assets/assets/images/header.jpg": "b380d1fc5884ae13eb7179ce1db2025a",
"assets/assets/images/sign.png": "4910b606ae222a8cba8833fac6019c09",
"assets/assets/images/ellie_writes_2.png": "19d5d137f0b373c77ea3db8333ff702a",
"assets/assets/images/skyline.png": "f86a03d6422490bb095126830baa2db5",
"assets/assets/images/demo.gif": "99076a7d927229fb239ffab57b13dd26",
"assets/assets/images/mpumalanga_mobile.jpg": "0e0cf5efce9757d20bbc606cac73d7a5",
"assets/assets/images/company_logo%2520(copy).png": "fbb2809b7d20903ac10d4c322fca3317",
"assets/assets/images/ellie_writes-min.webp": "9b824937db9be4cbb4dc2abbf814ee66",
"assets/assets/images/cover_2.jpg": "5bff6330479aed404c38ef55e0ee9a5e",
"assets/assets/images/mobile_dev_fill.png": "79d6441b9abbe079af24bad270c955f6",
"assets/assets/images/phone.png": "a107ab9837dd676f8bef60c78afbd05f",
"assets/assets/images/header_desktop1.jpeg": "24c364b0ce07de14f7f87d4a6e06d752",
"assets/assets/images/mobile_dev_outline.png": "b7665404ec04dbe1f269fafac2c793d2",
"assets/assets/images/process_infographic_mobile.jpg": "913a9e3edf8859b57155a8947c52df5c",
"assets/assets/images/finger.jpg": "d8130d43c801c0302cef49d7719df0c5",
"assets/assets/images/skyline_grey.png": "0e905b3e9929d3772333f45d6729fcbf",
"assets/assets/images/web_dev_fill_1.png": "9097c7cebd5e1f7bb3dc6f6d534570e3",
"assets/assets/images/phone_1.jpg": "8619b14526012368c72a8913a5a52910",
"assets/assets/images/nelspruit_mobile.jpg": "e3a2732f5fa0e5b63049487b2ef9e7c1",
"assets/assets/images/mobile_dev_fill_1.png": "0393b3533ffff62a2c66c44a5f48f7ae",
"assets/assets/images/nelspruit1_mobile_blur.jpeg": "c61468d00a88a8cc2cfb00dd0cf2f53c",
"assets/assets/images/sign_1.png": "4ca811d70123dd1505f52a52fbf8c6ba",
"assets/assets/images/header_desktop.jpg": "3ca00d2f57d123b4282bf4fa1aaa4d76",
"assets/assets/images/web_dev_outline.png": "48dbd0d8275f10f2ecd3e6d45c4f5133",
"assets/assets/images/header.webp": "f69a62053aceed93a42b6ca0a3c15c2f",
"assets/assets/images/nelspruit.jpg": "028b82b2485783ea7db382f3fb9d43c4",
"assets/assets/images/mpumalanga.webp": "8656062835f26e23b996d3cbcf0d300e",
"assets/assets/images/IMG-20220122-WA0026.jpg": "1898a60374ff81d1b360ac88d54094ac",
"assets/assets/images/web_dev_graphic.png": "e8a012ca3abb17484474a104bc5b97e4",
"assets/assets/images/ellie_writes_mobile.jpg": "25aef7aa56354cdeb536dedd44d9fbb1",
"assets/assets/images/nelspruit.webp": "529687afd2dde62bb36d9393394fc87c",
"assets/assets/images/mail.png": "0836614f2d0a363392655da257655409",
"assets/assets/images/mpumalanga.jpg": "26434f9de7086d9b8fd8dad6811a58a9",
"assets/assets/images/nelspruit1_mobile.jpg": "87e55fe48bc32971d3097df3a768902e",
"assets/assets/images/cover_4.jpg": "6bb5f3a8a90f2f133c7924a80911bd6a",
"assets/assets/images/company_logo_navbar.png": "272bd72b18d32012a73dea4d80675f1a",
"assets/assets/images/company_logo.png": "fda14c14cb30297030f8cafd961f9817",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/NOTICES": "31bf71237c5a460e94a8388e12685286",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"main.dart.js": "faef3a19354ec0136ab54b77b0622d9d",
"manifest.json": "2de99ccc797eb8b03d271436928b2e6e",
"favicon.png": "5dcef449791fa27946b3d35ad8803796"
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
