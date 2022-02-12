// This service worker is just for caching requested files in order to provide offline capability.
// Offline caching is required to be installed as Progressive Web App.

const OFFLINE_VERSION = 1;
const urlsToCache = [
    "/",
    "/assets/app.js",
    "/assets/style.css"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open("essential");
            let requests = [];
            for (let url of urlsToCache)
                requests.push(new Request(url, {cache: "reload"}));
            await cache.addAll(requests);
        })()
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil((async () => {
        if ("navigationPreload" in self.registration) await self.registration.navigationPreload.enable();
    })());
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        (async () => {
            try {
                const preloadResponse = await event.preloadResponse;
                if (preloadResponse) return preloadResponse;
            } catch (error) {
            }
            return fetch(event.request).then(function (response) {
                if (!response || response.status !== 200 || response.type !== 'basic')
                    return response;
                let responseToCache = response.clone();
                caches.open(urlsToCache.includes(event.request.url.replaceAll(/.*:\/\/?([^\/]+)/g, "")) ? "essential" : "other")
                    .then(function (cache) {
                        cache.put(event.request, responseToCache);
                    });
                return response;
            }).catch(function () {
                return caches.match(event.request);
            });
        })()
    );
});
