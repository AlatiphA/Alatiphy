/* =====================================================
   Alatiphy — Service Worker
   ─────────────────────────────────────────────────
   HOW TO UPDATE:
   Bump APP_VERSION on every release (e.g. "1.0").
   The cache name updates automatically. Users will
   get a "New version available" prompt on next visit.
===================================================== */

const APP_VERSION = "v3.1";
const SONG_CACHE = "v1.0";

const SONG_CACHE = `alatiphy-music-pwa-${APP_VERSION}`;
const SONG_CACHE = `alatiphy-songs-pwa-${SONG_CACHE}`;



/* ====================
   APP SHELL
==================== */
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./css/all.min.css"
];

/* ====================
   INSTALL
==================== */
self.addEventListener("install", (event) => {

  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
  );
});

/* ====================
   ACTIVATE
==================== */
self.addEventListener("activate", (event) => {

  event.waitUntil(

    (async () => {

      const keys = await caches.keys();

      await Promise.all(

        keys.map((key) => {

          if (
            key !== CACHE_NAME &&
            key !== SONG_CACHE
          ) {
            return caches.delete(key);
          }
        })
      );

      await self.clients.claim();

      // force reload all tabs
      const clientsList =
        await self.clients.matchAll();

      clientsList.forEach((client) => {

        client.postMessage({
          type: "RELOAD"
        });
      });

    })()
  );
});

/* ====================
   FETCH
==================== */
self.addEventListener("fetch", (event) => {

  const request = event.request;

  /* ====================
     1. MANUAL DOWNLOADS
     BYPASS SERVICE WORKER
  ==================== */

  if (
    request.headers.get("x-download-request") === "true"
  ) {

    event.respondWith(
      fetch(request)
    );

    return;
  }

  /* ====================
     2. AUDIO STREAMS
     CACHE FIRST
  ==================== */

  if (
    request.destination === "audio" &&
    request.method === "GET"
  ) {

    event.respondWith(
      cacheAudioFirst(request)
    );

    return;
  }

  /* ====================
     3. FONTS
     CACHE FIRST
  ==================== */

  if (request.destination === "font") {

    event.respondWith(

      caches.match(request)
        .then((cached) => {

          if (cached) {
            return cached;
          }

          return fetch(request)
            .then((response) => {

              if (
                response &&
                response.status === 200
              ) {

                caches.open(CACHE_NAME)
                  .then((cache) => {

                    cache.put(
                      request,
                      response.clone()
                    );
                  });
              }

              return response;
            });
        })
    );

    return;
  }

  /* ====================
     4. HTML NAVIGATION
     NETWORK FIRST
  ==================== */

  if (request.mode === "navigate") {

    event.respondWith(

      fetch(request, {
        cache: "no-store"
      })

      .then((response) => {

        if (
          response &&
          response.status === 200
        ) {

          caches.open(CACHE_NAME)
            .then((cache) => {

              cache.put(
                request,
                response.clone()
              );
            });
        }

        return response;
      })

      .catch(() => {

        return caches.match("./index.html");
      })
    );

    return;
  }

  /* ====================
     5. OTHER ASSETS
     CACHE FIRST
  ==================== */

  event.respondWith(

    caches.match(request)

      .then((cached) => {

        if (cached) {
          return cached;
        }

        return fetch(request)

          .then((networkResponse) => {

            if (
              networkResponse &&
              networkResponse.status === 200 &&
              networkResponse.type === "basic"
            ) {

              caches.open(CACHE_NAME)
                .then((cache) => {

                  cache.put(
                    request,
                    networkResponse.clone()
                  );
                });
            }

            return networkResponse;
          })

          .catch(() => {

            return new Response(
              "Offline",
              {
                status: 503,
                statusText: "Service Unavailable"
              }
            );
          });
      })
  );
});

/* ====================
   AUDIO CACHE STRATEGY
==================== */

async function cacheAudioFirst(request) {

  const cache =
    await caches.open(SONG_CACHE);

  const cached =
    await cache.match(request);

  if (cached) {
    return cached;
  }

  try {

    const response =
      await fetch(request);

    if (
      response &&
      response.status === 200
    ) {

      await cache.put(
        request,
        response.clone()
      );
    }

    return response;

  } catch (err) {

    return new Response(
      "Audio not available offline",
      {
        status: 404,
        statusText: "Not Found"
      }
    );
  }
}

/* ====================
   MANUAL UPDATE CONTROL
==================== */

self.addEventListener("message", (event) => {

  if (
    event.data &&
    event.data.type === "SKIP_WAITING"
  ) {

    self.skipWaiting();
  }
});
