/* =====================================================
   Alatiphy — Service Worker
   ─────────────────────────────────────────────────
   HOW TO UPDATE:
   Run node tools/release.cjs MAJOR.MINOR.PATCH.
   version.json is the source of truth; the release
   command synchronizes the app, worker and manifest.
   Existing listening sessions are not reloaded.
===================================================== */

const APP_VERSION = "7.12.2";

const CACHE_NAME = `alatiphy-beta-pwa-${APP_VERSION}`;
const SONG_CACHE = `alatiphy-songs-pwa-${APP_VERSION}`;



/* ====================
   APP SHELL
==================== */
const ASSETS = [
  "./",
  "./index.html",
  "./faq.html",
  "./app.js",
  "./updates.js",
  "./sw.js",
  "./install.js",
  "./style.css",
  "./manifest.json",
  "./version.json",
  "./icon-192.png",
  "./icon-512.png",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css",
];

/* ====================
   INSTALL
==================== */
self.addEventListener("install", (event) => {

  // Updates wait for the listener to choose Install update.

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {

        // Cache each asset independently so one missing/
        // failing file (e.g. a wrong path) can't sink the
        // entire precache and leave the app with ZERO
        // offline support.
        const results = await Promise.allSettled(
          // A new cache must contain the published release, not a still-fresh
          // HTTP-cached script from the previous release.
          ASSETS.map((url) => cache.add(new Request(new URL(url, self.registration.scope), { cache: "reload" })))
        );

        // Never offer an update that is missing the files needed to run the app.
        const required = ["./", "./index.html", "./app.js", "./updates.js", "./style.css", "./manifest.json", "./version.json"];
        if (results.some((result, i) => result.status === "rejected" && required.includes(ASSETS[i]))) {
          throw new Error("The update could not download all required app files.");
        }

        results.forEach((result, i) => {
          if (result.status === "rejected") {
            console.warn(
              "Precache failed for:",
              ASSETS[i],
              result.reason
            );
          }
        });
      })
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
            (key.startsWith("alatiphy-beta-pwa-") || key.startsWith("alatiphy-songs-pwa-")) &&
            key !== CACHE_NAME &&
            key !== SONG_CACHE
          ) {
            return caches.delete(key);
          }
        })
      );

      await self.clients.claim();

      // Existing player pages keep running; updates apply on the next visit.

    })()
  );
});

/* ====================
   FETCH
==================== */
self.addEventListener("fetch", (event) => {

  const request = event.request;
  const url = new URL(request.url);
  // Release checks must reach the network, never a cached version.json.
  if (url.origin === self.location.origin &&
      url.pathname === new URL("./version.json", self.registration.scope).pathname) return;


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
     3b. IMAGES (covers, icons)
     CACHE FIRST
     Handles both same-origin (status 200) and
     cross-origin/no-cors responses (opaque, status 0)
     — cover art hosted off-site still gets cached.
  ==================== */

  if (request.destination === "image") {

    event.respondWith(

      caches.match(request)
        .then((cached) => {

          if (cached) {
            return cached;
          }

          return fetch(request)
            .then((response) => {

              const isCacheable =
                response &&
                (response.status === 200 ||
                  response.type === "opaque");

              if (isCacheable) {

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
            .catch(() => cached);
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
  if (event.data === "GET_VERSION") {
    event.ports[0]?.postMessage(APP_VERSION);
    return;
  }


  if (
    event.data &&
    event.data.type === "SKIP_WAITING"
  ) {

    self.skipWaiting();
  }
});
