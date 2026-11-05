const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8').replace(/\r\n/g, '\n');
const flush = () => new Promise(resolve => setImmediate(resolve));
class Element extends EventTarget {
  constructor() {
    super(); this.src = ''; this.paused = true; this.ended = false;
    this.currentTime = 0; this.duration = 180; this.readyState = 0;
    this.playbackRate = 1; this.style = {}; this.dataset = {}; this.textContent = ''; this.loads = [];
    this.playCalls = 0; this.loadToken = 0; this.holdMetadata = false;
    this.classList = { add() {}, remove() {}, toggle() {} };
  }
  removeAttribute(key) { if (key === 'src') this.src = ''; }
  replaceChildren(...children) { this.children = children; }
  load() {
    this.currentTime = 0; this.readyState = 0; this.ended = false; this.error = null; this.loads.push(this.src);
    const token = ++this.loadToken;
    if (!this.src || this.holdMetadata) return;
    queueMicrotask(() => {
      if (token !== this.loadToken) return;
      if (this.src.includes('broken')) { this.error = { code: 4 }; this.dispatchEvent(new Event('error')); }
      else { this.readyState = 1; this.dispatchEvent(new Event('loadedmetadata')); }
    });
  }
  play() {
    this.playCalls++; this.playBeforeMetadata = this.readyState === 0;
    this.paused = false; this.dispatchEvent(new Event('playing'));
    return Promise.resolve();
  }
  pause() { this.pauseCalls = (this.pauseCalls || 0) + 1; this.paused = true; this.dispatchEvent(new Event('pause')); }
}
function setup() {
  const elements = {};
  for (const key of ['audio','nextBufferAudio','cover','playBtn','title','status']) elements[key] = new Element();
  const songs = ['a','b','c','d'].map(src => ({src, title:src, tags:['rap']}));
  const saved = { a:{blob:new Blob(['audio-a']),isRealDownload:true}, c:{blob:new Blob(['audio-c'])} };
  const state = { songs, currentIndex:0, downloadedSongs:saved, view:'home', activePlaylist:'all', favorites:[0,2],
    showFavoritesOnly:false, repeat:'off', shuffle:false, playbackQueue:null, nextBufferAudio:elements.nextBufferAudio };
  const revoked = [], handlers = {}, allocations = []; let serial = 0;
  const navigator = { onLine:true, mediaSession: { setPositionState() {}, setActionHandler(action, handler) {
    if (action === 'seekbackward') throw Error('Unsupported on this browser'); handlers[action] = handler;
  } } };
  const context = vm.createContext({ STATE:state, DOM:elements, Blob, Event, navigator, MediaMetadata:class { constructor(value) {Object.assign(this,value);} },
    URL: { createObjectURL(blob) { const url='blob:'+ ++serial;allocations.push(url);return url; }, revokeObjectURL(url) {revoked.push(url);} },
    document: { getElementById:()=>elements.status, createElement:()=>new Element() }, COVER:'cover', loadedSongSrc:null, updatePlayback:null,
    console:{warn(){},error(){},debug(){}}, savePlaybackPosition(){}, savePlaybackState(){}, saveState(){},
    updateTime(){}, updateMarquee(){}, highlightActiveTrack(){}, silentCacheSong(){}, setTimeout:()=>0 });
  const include = (from,to) => vm.runInContext(source.slice(source.indexOf(from),source.indexOf(to,source.indexOf(from))),context);
  include('/* ===== PLAYBACK SOURCES ===== */','/* ===== SILENT BACKGROUND CACHE ===== */');
  include('/* ===== PLAY SONG ===== */','/* ===== UPDATE REPEAT BUTTON ===== */');
  include('/* ===== PRELOAD NEXT TRACK ===== */','/* ===== SAVE STATE ===== */');
  include('function getPlaylistByTag','// FAQ is a view');
  include('function getNextIndex','//SHUFFLE');
  include('function isDownloaded','async function loadDownloadedSongsMap');
  return {context,state,elements,navigator,revoked,allocations,handlers,run:code=>vm.runInContext(code,context)};
}
(async () => {
  let x=setup(); x.navigator.onLine=false; x.state.playbackQueue=[0,1,2];
  assert.equal(x.run('getNextIndex("next")'),2,'offline queue skips unsaved song b');
  x.state.currentIndex=2; assert.equal(x.run('getNextIndex("next")'),null,'repeat off ends saved queue');
  x.state.repeat='all'; assert.equal(x.run('getNextIndex("next")'),0,'repeat all wraps saved queue');
  x.state.playbackQueue=[1]; assert.equal(x.run('getNextIndex("next")'),null,'no saved songs means no network attempt');
  x.state.playbackQueue=[0,1]; x.state.currentIndex=1; x.state.shuffle=true;
  assert.equal(x.run('getNextIndex("next")'),0,'one saved shuffle candidate never selects unsaved current song');
  x.state.downloadedSongs.b={blob:new Blob([])}; assert.equal(x.run('isOfflineAvailable(1)'),false);
  x.state.downloadedSongs.b={blob:'not an audio Blob'}; assert.equal(x.run('isOfflineAvailable(1)'),false);

  x=setup(); x.state.view='downloads'; x.run('capturePlaybackQueue()'); x.state.view='about';
  assert.deepEqual(Array.from(x.run('getPlaybackPlaylist()'),item=>item.index),[0,2],'browsing About preserves Downloads queue');
  await x.run('startTrack(0)');
  assert.ok(x.elements.audio.src.startsWith('blob:'),'saved audio plays locally while online');
  assert.ok(x.elements.nextBufferAudio.src.startsWith('blob:'),'preload also uses local copy');
  assert.equal(x.elements.nextBufferAudio.playCalls,0,'preloading never plays a second audio element');
  const first=x.elements.audio.src, prepared=x.elements.nextBufferAudio.src;
  x.run('updateMediaSession()'); await x.handlers.nexttrack();
  assert.equal(x.state.currentIndex,2,'lock-screen Next respects Downloads');
  assert.equal(x.elements.audio.src,prepared,'prepared local source transfers to main player');
  assert.equal(x.elements.audio.pauseCalls || 0,0,'valid track transitions do not explicitly pause background audio');
  assert.ok(x.revoked.includes(first),'previous source URL is released');
  assert.ok(!x.revoked.includes(prepared),'active source must remain valid');
  assert.ok(x.handlers.seekforward,'unsupported action must not prevent subsequent handlers');

  x=setup(); x.elements.audio.holdMetadata=true;
  const start=x.run('startTrack(1)');
  assert.equal(x.elements.audio.playCalls,1,'stream Play is issued before metadata returns');
  assert.equal(x.elements.audio.playBeforeMetadata,true);
  x.elements.audio.readyState=1; x.elements.audio.dispatchEvent(new Event('loadedmetadata')); await start;

  x=setup();x.state.playbackQueue=[0,2];x.elements.audio.holdMetadata=true;
  vm.runInContext(source.slice(source.indexOf('// Track transitions issue play immediately'), source.indexOf('// MENU\n',source.indexOf('// Track transitions issue play immediately'))),x.context);
  x.elements.audio.ended=true;x.elements.audio.dispatchEvent(new Event('ended'));
  assert.equal(x.state.currentIndex,2,'automatic transition uses the same queue');
  assert.equal(x.elements.audio.playCalls,1,'ended starts next track without waiting for metadata');
  x.elements.audio.readyState=1;x.elements.audio.dispatchEvent(new Event('loadedmetadata'));await flush();

  x=setup(); x.elements.audio.holdMetadata=true;
  const old=x.run('loadSong()'); x.state.currentIndex=2; const newer=x.run('loadSong()');
  assert.equal(await old,false,'rapid track changes cancel old metadata wait');
  x.elements.audio.readyState=1;x.elements.audio.dispatchEvent(new Event('loadedmetadata'));
  assert.equal(await newer,true); assert.equal(x.run('loadedSongSrc'),'c');

  x=setup(); x.navigator.onLine=false; await x.run('startTrack(1)');
  assert.equal(x.elements.audio.playCalls,0,'direct unsaved selection cannot start network playback offline');
  assert.match(x.elements.status.textContent,/not saved/);

  x=setup();await x.run('startTrack(1)');
  x.state.downloadedSongs.b={blob:new Blob(['completed-background-download'])};
  x.elements.audio.currentTime=42;x.elements.audio.error={code:2};x.elements.audio.dispatchEvent(new Event('error'));
  await flush();
  assert.ok(x.elements.audio.src.startsWith('blob:'),'a failed stream can recover from a completed local copy');
  assert.equal(x.elements.audio.currentTime,42,'recovery preserves playback position');

  x=setup(); x.state.songs[1].src='broken';
  const failed=x.run('loadSong()'); await failed; // First verify the working source.
  x.state.currentIndex=1; assert.equal(await x.run('loadSong()'),false,'metadata error is a failed load');
  assert.match(x.elements.status.textContent,/unavailable/);

  const dbContext=vm.createContext({console,DB:{database:{transaction:()=>transaction}}});
  const request={},transaction={objectStore:()=>({put:()=>request})};
  vm.runInContext(source.slice(source.indexOf('function saveSongToDB'),source.indexOf('/* ===== GET SONGS ===== */')),dbContext);
  let complete=false;const save=vm.runInContext('saveSongToDB({})',dbContext).then(()=>{complete=true});
  request.onsuccess?.(); await flush();assert.equal(complete,false,'request success is not a committed offline save');
  transaction.oncomplete();await save;assert.equal(complete,true);
  const aborted=vm.runInContext('saveSongToDB({})',dbContext); transaction.onabort();await assert.rejects(aborted,/interrupted/);
  console.log('PASS: offline queue, repeat/shuffle, saved-file validation, lock-screen queue, local preloading, URL cleanup, immediate background play, rapid skips, load errors and durable saves.');
})().catch(error=>{console.error(error);process.exitCode=1});
