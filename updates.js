/* Manual update checks never interrupt playback. Only Install update refreshes. */
(() => {
  "use strict";
  const running = document.documentElement.dataset.appVersion;
  const check = document.getElementById("check-updates");
  const install = document.getElementById("install-update");
  const status = document.getElementById("update-status");
  let registration, latest, active, busy = false, installing = false;
  let reloadRequested = false;
  const say = text => { status.textContent = text; };
  const valid = value => /^\d+\.\d+\.\d+$/.test(value || "");
  function newer(a, b) {
    if (!valid(a) || !valid(b)) return false;
    const left = a.split(".").map(Number), right = b.split(".").map(Number);
    for (let i = 0; i < 3; i++) if (left[i] !== right[i]) return left[i] > right[i];
    return false;
  }
  const available = () => !!registration?.waiting || newer(active, running) || newer(latest, running);
  function render() {
    check.disabled = !registration || busy || installing;
    install.hidden = !available();
    install.disabled = busy || installing || !!registration?.installing;
    install.textContent = installing ? "Installing…" : registration?.waiting ? "Install update" : "Reload app";
  }
  function describe(verified = false) {
    if (installing) return;
    if (registration?.waiting) say("Update ready. Select Install update when you are ready to refresh.");
    else if (registration?.installing) say("Preparing an update. Your music can keep playing.");
    else if (available()) say("A newer release is available. Reload the app to finish updating.");
    else if (verified && latest === running && active === running) say(`You are up to date. Version ${running}.`);
    else say(`Current version: ${running}. Check for a newer release.`);
    render();
  }
  function timeout(promise, milliseconds, message) {
    let timer;
    return Promise.race([promise, new Promise((_, reject) => {
      timer = setTimeout(() => reject(Error(message)), milliseconds);
    })]).finally(() => clearTimeout(timer));
  }
  function workerVersion(worker) {
    return new Promise(resolve => {
      if (!worker) return resolve(null);
      const channel = new MessageChannel();
      const timer = setTimeout(() => { channel.port1.close(); resolve(null); }, 2500);
      channel.port1.onmessage = event => {
        clearTimeout(timer); channel.port1.close();
        resolve(valid(event.data) ? event.data : null);
      };
      try { worker.postMessage("GET_VERSION", [channel.port2]); }
      catch { clearTimeout(timer); channel.port1.close(); resolve(null); }
    });
  }
  function waitForWorker(worker, states) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => finish(Error("Update timed out")), 30000);
      function finish(error) {
        clearTimeout(timer); worker.removeEventListener("statechange", changed);
        error ? reject(error) : resolve();
      }
      function changed() {
        if (states.includes(worker.state)) finish();
        else if (worker.state === "redundant") finish(Error("Update could not be installed"));
      }
      worker.addEventListener("statechange", changed); changed();
    });
  }
  function watch(worker) {
    if (!worker) return;
    worker.addEventListener("statechange", () => {
      if (!busy && !installing) describe();
    });
  }
  async function publishedVersion() {
    const url = new URL("./version.json", window.location.href);
    url.searchParams.set("release-check", Date.now());
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, { cache: "no-store", signal: controller.signal });
      if (!response.ok) throw Error("Release check unavailable");
      const version = (await response.json()).version;
      if (!valid(version)) throw Error("Invalid release metadata");
      return version;
    } finally { clearTimeout(timer); }
  }
  async function checkUpdates() {
    if (!registration || busy || installing) return;
    if (!navigator.onLine) { say("Connect to the internet to check for updates."); return; }
    busy = true; say("Checking for updates…"); render();
    try {
      latest = await publishedVersion();
      await timeout(registration.update(), 30000, "Update check timed out");
      if (registration.installing) await waitForWorker(registration.installing, ["installed", "activated"]);
      active = await workerVersion(registration.active || navigator.serviceWorker.controller);
      if (!available() && active !== running) say("Could not verify the app cache. Please check again.");
      else describe(true);
    } catch (error) {
      say("Could not check for updates. Check your connection and try again.");
      console.warn("Update check failed", error);
    } finally { busy = false; render(); }
  }
  async function installUpdate() {
    if (busy || installing || reloadRequested || !available()) return;
    if (!navigator.onLine) { say("Connect to the internet to finish updating."); return; }
    if (!window.confirm("Update Alatiphy now? Music will briefly pause while the app refreshes, then resume from the saved position. Your downloads and favorites will be kept.")) return;
    installing = true; say("Installing update…"); render();
    try {
      // Do not reload into an old worker if publication is still being prepared.
      if (!registration.waiting && newer(latest, running) && !newer(active, running)) {
        await timeout(registration.update(), 30000, "Update check timed out");
        if (registration.installing) await waitForWorker(registration.installing, ["installed", "activated"]);
        active = await workerVersion(registration.active || navigator.serviceWorker.controller);
        if (!registration.waiting && !newer(active, running)) throw Error("New app cache is not ready");
      }
      window.dispatchEvent(new Event("alatiphy:before-update"));
      const worker = registration.waiting;
      if (worker) {
        const activated = waitForWorker(worker, ["activated"]);
        worker.postMessage({ type: "SKIP_WAITING" });
        await activated;
      }
      reloadRequested = true;
      window.location.reload();
    } catch (error) {
      window.dispatchEvent(new Event("alatiphy:update-failed"));
      installing = false; say("Could not finish the update. Please try again."); render();
      console.warn("Update installation failed", error);
    }
  }
  check.addEventListener("click", checkUpdates);
  install.addEventListener("click", installUpdate);
  if (!("serviceWorker" in navigator)) {
    say("App updates are not supported in this browser."); return;
  }
  navigator.serviceWorker.addEventListener("controllerchange", async () => {
    // Updates in another tab must not force this listening session to reload.
    if (installing) return;
    active = await workerVersion(navigator.serviceWorker.controller); describe();
  });
  navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).then(async value => {
    registration = value;
    registration.addEventListener("updatefound", () => { watch(registration.installing); describe(); });
    watch(registration.installing);
    active = await workerVersion(registration.active || navigator.serviceWorker.controller);
    describe();
  }).catch(error => {
    say("Update checks are unavailable. Reopen Alatiphy online and try again.");
    console.warn("Update service unavailable", error);
  });
})();
