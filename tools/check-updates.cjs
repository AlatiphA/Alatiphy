const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'updates.js'), 'utf8');
const running = JSON.parse(fs.readFileSync(path.join(root, 'version.json'))).version;
const flush = () => new Promise(resolve => setImmediate(resolve));
class Channel {
  constructor() {
    this.port1 = { close() {}, onmessage: null };
    this.port2 = { postMessage: data => queueMicrotask(() => this.port1.onmessage?.({ data })) };
  }
}
class Worker extends EventTarget {
  constructor(version, state = 'activated') { super(); this.version = version; this.state = state; }
  postMessage(data, ports) {
    if (data === 'GET_VERSION') ports[0].postMessage(this.version);
    else if (data.type === 'SKIP_WAITING') {
      this.state = 'activated'; this.dispatchEvent(new Event('statechange'));
    }
  }
}
async function setup(options = {}) {
  const elements = {};
  for (const id of ['check-updates', 'install-update', 'update-status']) {
    elements[id] = { addEventListener: (event, fn) => { elements[id][event] = fn; } };
  }
  const events = [], sw = new EventTarget(), registration = new EventTarget();
  registration.active = new Worker(options.active || running);
  registration.waiting = options.waiting ? new Worker('99.0.0', 'installed') : null;
  registration.update = async () => { if (options.updateError) throw Error('Network error'); };
  sw.register = async () => registration;
  const window = new EventTarget();
  window.location = { href: 'https://example.com/Alatiphy/', reload: () => events.push('reload') };
  window.confirm = () => options.confirm !== false;
  window.addEventListener('alatiphy:before-update', () => events.push('save-position'));
  window.addEventListener('alatiphy:update-failed', () => events.push('resume-on-error'));
  const context = vm.createContext({
    document: { documentElement: { dataset: { appVersion: running } }, getElementById: id => elements[id] },
    navigator: { onLine: options.online !== false, serviceWorker: sw }, window,
    MessageChannel: Channel, Event, URL, AbortController, Date, setTimeout, clearTimeout,
    console: { warn() {} },
    fetch: async () => {
      if (options.fetchError) throw Error('Network unavailable');
      return { ok: true, json: async () => ({ version: options.latest || running }) };
    }
  });
  vm.runInContext(source, context); await flush();
  return { elements, events, registration, sw };
}
(async () => {
  let app = await setup();
  await app.elements['check-updates'].click();
  assert.match(app.elements['update-status'].textContent, /up to date/);
  assert.deepEqual(app.events, [], 'checking never saves/stops/reloads music');

  app = await setup({ online: false }); await app.elements['check-updates'].click();
  assert.match(app.elements['update-status'].textContent, /internet/);
  assert.doesNotMatch(app.elements['update-status'].textContent, /up to date/);

  app = await setup({ fetchError: true }); await app.elements['check-updates'].click();
  assert.match(app.elements['update-status'].textContent, /Could not check/);
  assert.equal(app.elements['check-updates'].disabled, false);

  app = await setup({ latest: 'bad-version' }); await app.elements['check-updates'].click();
  assert.match(app.elements['update-status'].textContent, /Could not check/);

  app = await setup({ waiting: true }); await app.elements['install-update'].click();
  assert.deepEqual(app.events, ['save-position', 'reload'], 'save before activating and reload once');
  await app.elements['install-update'].click(); assert.equal(app.events.length, 2);

  app = await setup({ waiting: true, confirm: false }); await app.elements['install-update'].click();
  assert.deepEqual(app.events, [], 'cancel keeps music playing');

  app = await setup({ latest: '99.0.0' }); await app.elements['check-updates'].click();
  await app.elements['install-update'].click();
  assert.equal(app.events.includes('reload'), false, 'do not reload until new app cache is ready');

  app = await setup({ active: '99.0.0' }); await app.elements['install-update'].click();
  assert.deepEqual(app.events, ['save-position', 'reload'], 'already active update can reload');

  app = await setup(); app.sw.controller = new Worker('99.0.0');
  app.sw.dispatchEvent(new Event('controllerchange')); await flush();
  assert.deepEqual(app.events, [], 'another tab must not reload this one');
  assert.equal(app.elements['install-update'].hidden, false);

  const workerSource = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
  const appSource = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
  const updateWindow = new EventTarget(); let savedPlayback, recoveredAt, recoveredPlaying = false;
  const audio = { currentTime: 82, paused: false, ended: false, readyState: 1,
    pause() { this.paused = true; }, removeAttribute() {}, load() { this.readyState = 0; } };
  const playbackContext = vm.createContext({ window: updateWindow, DOM: { audio },
    clearingData: false, loadedSongSrc: 'song-a', PLAYBACK_KEY: 'playback', console,
    localStorage: { setItem: (_, value) => { savedPlayback = JSON.parse(value); } },
    loadSong: async time => { recoveredAt = time; }, playSong: () => { recoveredPlaying = true; } });
  vm.runInContext(appSource.slice(appSource.indexOf('let updatePlayback ='), appSource.indexOf('// Add only one Back step')), playbackContext);
  vm.runInContext(appSource.slice(appSource.indexOf('function savePlaybackPosition()'), appSource.indexOf('DOM.audio.addEventListener("timeupdate", () => {')), playbackContext);
  updateWindow.dispatchEvent(new Event('alatiphy:before-update'));
  vm.runInContext('savePlaybackPosition()', playbackContext);
  assert.equal(savedPlayback.time, 82); assert.equal(savedPlayback.playing, true, 'pause for update must not overwrite resume intent');
  updateWindow.dispatchEvent(new Event('alatiphy:update-failed')); await flush();
  assert.equal(recoveredAt, 82); assert.equal(recoveredPlaying, true, 'failed update restores music');
  const handlers = {}, cached = []; let skipped = 0, failCore = false;
  const self = { location: { origin: 'https://example.com' }, registration: { scope: 'https://example.com/Alatiphy/' },
    addEventListener: (type, fn) => { handlers[type] = fn; }, skipWaiting: () => { skipped++; } };
  vm.runInNewContext(workerSource, { self, URL, console: { warn() {} }, caches: {
    open: async () => ({ add: async url => { cached.push(url); if (failCore && url === './app.js') throw Error('fail'); } })
  } });
  let installation; handlers.install({ waitUntil: promise => { installation = promise; } }); await installation;
  assert.equal(skipped, 0, 'install must wait for user choice');
  assert.ok(cached.includes('./updates.js'));
  failCore = true; handlers.install({ waitUntil: promise => { installation = promise; } });
  await assert.rejects(installation, /required app files/);
  let intercepted = false;
  handlers.fetch({ request: { url: 'https://example.com/Alatiphy/version.json?release-check=123' }, respondWith: () => { intercepted = true; } });
  assert.equal(intercepted, false, 'release check bypasses service-worker cache');
  let version;
  handlers.message({ data: 'GET_VERSION', ports: [{ postMessage: value => { version = value; } }] });
  assert.equal(version, running);
  handlers.message({ data: { type: 'SKIP_WAITING' } }); assert.equal(skipped, 1);
  console.log('PASS: current, offline, network failure, invalid metadata, install, cancel, publication lag, multi-tab, precache failure, fresh release checks and worker versions.');
})().catch(error => { console.error(error); process.exitCode = 1; });
