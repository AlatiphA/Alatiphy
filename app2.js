(function(){

// =======================
// DOM LAYER
// =======================
const DOM = {
  audio: document.getElementById("audio"),
  list: document.getElementById("list"),
  playBtn: document.getElementById("play"),
  muteBtn: document.getElementById("mute"),
  volume: document.getElementById("volume"),
  menuBtn: document.getElementById("menu-btn"),
  menuPopup: document.getElementById("menu"),
  menuDownload: document.getElementById("menu-download"),
  menuShare: document.getElementById("menu-share"),
  bar: document.getElementById("bar"),
  search: document.getElementById("search"),
  clearBtn: document.getElementById("clear-search"),
  tabFavorites: document.getElementById("tab-favorites"),
  repeatBtn: document.getElementById("repeat"),
  shuffleBtn: document.getElementById("shuffle"),
  player: document.querySelector(".player"),
  collapseBtn: document.getElementById("collapse-btn"),
  cover: document.getElementById("cover"),
  title: document.getElementById("title"),
  time: document.getElementById("time"),
  progress: document.getElementById("progress"),

  sideMenu: document.getElementById("side-menu"),
  overlay: document.getElementById("menu-overlay"),
  menuToggle: document.getElementById("menu-toggle")
};


// =======================
// DATA (SONGS)
// =======================

const COVER =
"https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi0_lQRpa_X50T-4zAAYHZUqeUjqDb-JkeOgmg31u_2Apnsut3Nfe_zrvW1rqOq7aKxEjzgxcv2ndc7CC-Jo_9O0pbmva3vn8N0xqiscfAah_frGjHgAsiSpwJSqnV976_5FtENJDnyuIcSEpW0T-LBQctvRczjy54IvEGCb86MXy2_CVCZphGwj2NjV6uc/s500/AlatiphA_Music_Animation.png";


const songs = [
{ 
   title:"Awake Ghana Youth - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Awake%2C%20Ghana%20Youth%20%28R%26B%29%20-%20AlatiphA%20AI.mp3", 
   tags: ["rnb"]
},

{ 
   title: "Bare Teeth of Hypocrisy (Rap) - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Bare%20Teeth%20of%20Hypocrisy%20-%20AlatiphA%20AI%28MP3_160K%29_1.mp3", 
   tags: ["rap"]
}, 

{ 
   title: "Chalk Dust Promises (Remix) - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Chalk%20Dust%20Promises%20%28Remix%29%20-%20AlatiphA%20AI%28MP3_160K%29.mp3",
    tags: ["rap", "remix"]
},

{ 
   title: "Geography of Greed - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Geography%20of%20greed%20-%20AlatiphA%20AI%28MP3_160K%29.mp3", 
   tags: ["rap"]
}, 
        
{ 
   title: "LGBTQ not a Priority - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/LGBTQ%20%20Not%20a%20Priority%20-%20AlatiphA%20AI%28MP3_160K%29.mp3", 
   tags: ["rap"]
},

{ 
   title: "Neutral no More - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Neutral%20No%20More%20-%20AlatiphA%20AI%28MP3_160K%29.mp3", 
   tags: ["rap"]
},

{ 
   title: "Preach Reset - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Preach%20Reset%20%28R%26B%29%20-%20AlatiphA%20AI.mp3", 
   tags: ["rnb"]
},  

{
   title: "Scorecard Flow - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Scorecard%20Flow%20-%20AlatiphA%20AI%28MP3_160K%29.mp3", 
   tags: ["rap"]
},

{
   title: "Stand or Fall - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Stand%20or%20fall%20-%20AlatiphA%20AI%28MP3_160K%29.mp3", 
   tags: ["rap"]
},

{
   title: "Agyapadie Promax (State Capture) (R&B) - AlatiphA", 
   src: "https://archive.org/download/no-be-pawn-remix-alatiph-a-mp-3-160-k/Agyapadie%20Promax%20%28State%20Capture%29%20%28R_B%29%20-%20AlatiphA%28MP3_160K%29.mp3", 
   tags: ["rnb"]
},

{
   title: "Still Standing - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Still%20Standing%20-%20AlatiphA%20AI%28MP3_160K%29.mp3", 
   tags: ["rap"]
},

{
   title: "Too Big for Their Games - AlatiphA",
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Too%20Big%20for%20Their%20Games%20-%20AlatiphA%20AI%28MP3_160K%29.mp3", 
   tags: ["rap"]
},

{ 
   title: "Weatherproof Lies (Rap) - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Weatherproof%20Lies%20%28Rap%29%20-%20AlatiphA%20AI%28MP3_160K%29.mp3", 
   tags: ["rap"]
},

{ 
   title: "Wo de ya ka - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Wo%20de%20ya%20ka%20-%20AlatiphA%20AI%28MP3_160K%29.mp3", 
   tags: ["rap", "afrobeats"]
},

{ title: "Yawa Season (Remix) - AlatiphA", 
  src: "https://archive.org/download/no-be-pawn-remix-alatiph-a-mp-3-160-k/Yawa%20Season%20%28Remix%29%20-%20AlatiphA%28MP3_160K%29.mp3", 
   tags: ["rap", "remix"]
},

{ 
   title: "ORAL vs OCAL (Remix) - AlatiphA", 
   src: "https://archive.org/download/no-be-pawn-remix-alatiph-a-mp-3-160-k/ORAL%20vs%20OCAL%20%28Remix%29%20-%20AlatiphA%28MP3_160K%29.mp3", 
   tags: ["rap", "remix"]
},

{ 
   title: "Weatherproof Lies (R&B) - AlatiphA",  
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Weatherproof%20Lies%20%28R%26B%29%20-%20AlatiphA%20AI.mp3", 
   tags: ["rnb"]
},

{ 
   title: "Chalk Dust Promises - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Chalk%20Dust%20Promises%20-%20AlatiphA%20AI%28MP3_160K%29.mp3", 
   tags: ["rap"]
},

{
   title: 'Rap Lyric Tribute: "Shield and Pillar" - AlatiphA', 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Rap%20Lyric%20Tribute%20%E2%80%93%20_Shield%20and%20Pillar_%28From%20Black%20Maria%20to%20their%20Commander%29%20-%20AlatiphA%20AI%28MP3_160K%29.mp3", 
   tags: ["rap"]
},

{ 
   title: "Preach Reset (Rap) - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Preach%20Reset%20%28Rap%29%20-%20AlatiphA%20AI.mp3", 
   tags: ["rap"]
},

{ 
   title: "No Be Pawn (Remix) - AlatiphA", 
   src: "https://archive.org/download/no-be-pawn-remix-alatiph-a-mp-3-160-k/No%20Be%20Pawn%20%28Remix%29%20-%20AlatiphA%28MP3_160K%29.mp3", 
   tags: ["rap", "remix"]
},

{
   title: "Agyapadie Promax (State Capture) (Rap) - AlatiphA", 
   src: "https://archive.org/download/no-be-pawn-remix-alatiph-a-mp-3-160-k/Agyapadie%20Promax%20%28State%20Capture%29%20%28Rap%29%20-%20AlatiphA%28MP3_160K%29.mp3", 
   tags: ["rap"]
},

{ 
   title: "Awake, Ghana Youth (Rap) - AlatiphA", 
   src: "https://archive.org/download/no-be-pawn-remix-alatiph-a-mp-3-160-k/Awake_%20Ghana%20Youth%20%28Rap%29%20-%20AlatiphA%28MP3_160K%29.mp3", 
   tags: ["rap"]
},

{
   title: "Shee mungani - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Shee%20mungani%20-%20AlatiphA%20AI%28MP3_160K%29.mp3", 
   tags: ["rap", "afrobeats"]
},

{ 
   title: "ORAL vs OCAL (Afrobeat) - AlatiphA",     
   src: "https://archive.org/download/no-be-pawn-remix-alatiph-a-mp-3-160-k/ORAL%20vs%20OCAL%20-%20AlatiphA%28MP3_160K%29.mp3", 
   tags: ["rap", "afrobeats"]
},

{ 
   title: "Preach Reset (Rap) - AlatiphA", 
   src: "https://archive.org/download/no-be-pawn-remix-alatiph-a-mp-3-160-k/Preach%20Reset%20%28Rap%29%20-%20AlatiphA%28MP3_160K%29.mp3", 
   tags: ["rap"]
},

{
   title: "Yawa Season - AlatiphA", 
   src: "https://archive.org/download/no-be-pawn-remix-alatiph-a-mp-3-160-k/Yawa%20Season%20-%20AlatiphA%28MP3_160K%29.mp3", 
   tags: ["rap"]
}, 

{
   title: "No Be Pawn - AlatiphA", 
   src: "https://archive.org/download/no-be-pawn-remix-alatiph-a-mp-3-160-k/No%20Be%20Pawn%20-%20AlatiphA%28MP3_160K%29.mp3", 
   tags: ["rap", "recentlyadded"]
}, 

{ 
   title: "Wins Only (Reset On Course) (Rap) - AlatiphA", 
   src: "https://archive.org/download/wins-only-reset-on-course-rap-alatiph-a/Wins%20Only%20%28Reset%20On%20Course%29%20%28Rap%29%20-%20AlatiphA.mp3", 
   tags: ["rap", "recentlyadded"]
},

{ 
   title: "Galamsey Tears & Church Power (Rap) - AlatiphA", 
   src: "https://archive.org/download/wins-only-reset-on-course-rap-alatiph-a/Galamsey%20Tears%20%26%20Church%20Power%20%28Rap%29%20-%20AlatiphA.mp3", 
   tags: ["rap", "recentlyadded"]
},

{ 
   title: "Aku Deception (Rap) - AlatiphA", 
   src: "https://archive.org/download/wins-only-reset-on-course-rap-alatiph-a/Aku%20Deception%20%28Rap%29%20-%20AlatiphA.mp3", 
   tags: ["rap", "recentlyadded"]
}, 

{ 
   title: "1 Job_ 3 Shifts... Now Hustle - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/1%20Job_%203%20Shifts...%20Now%20Hustle%28MP3_160K%29.mp3", 
   tags: ["rap", "recentlyadded"]
},

{ 
   title: "Weatherproof Lies (Remix) - AlatiphA", 
   src: "https://archive.org/download/too-big-for-their-games-alatiph-a-ai-mp-3-160-k/Weatherproof%20Lies%20%28Remix%29%20-%20AlatiphA%20AI.mp3", 
   tags: ["remix", "recentlyadded"]
},

{ 
   title: "Today is yours, Mama (Afrobeat) - AlatiphA", 
   src: "https://archive.org/download/today-is-yours-mama-remix-alatiph-a/Today%20is%20yours%2C%20Mama%20%28Afrobeat%29%20-%20AlatiphA.mp3", 
   tags: ["rap", "afrobeats", "recentlyadded"]
},

{ 
   title: "Today is yours, Mama (R&B) - AlatiphA", 
   src: "https://archive.org/download/today-is-yours-mama-remix-alatiph-a/Today%20is%20yours%2C%20Mama%20%28R%26B%29%20-%20AlatiphA.mp3", 
   tags: ["rnb", "recentlyadded"]
},

{ 
   title: "Today is yours, Mama (Remix) - AlatiphA", 
   src: "https://archive.org/download/today-is-yours-mama-remix-alatiph-a/Today%20is%20yours%2C%20Mama%20%28Remix%29%20-%20AlatiphA.mp3", 
   tags: ["remix", "recentlyadded"]
},

{ 
   title: "Beyond the headlines (Nyaba Diaries) - AlatiphA", 
   src: "https://archive.org/download/beyond-the-headlines-nyaba-diaries-alatiph-a/Beyond%20the%20headlines%20%28Nyaba%20Diaries%29%20-%20AlatiphA.mp3", 
   tags: ["rap", "recentlyadded"]
},

{ 
   title: "Defending Chains - AlatiphA", 
   src: "https://archive.org/download/beyond-the-headlines-nyaba-diaries-alatiph-a/Defending%20Chains%20-%20AlatiphA.mp3", 
   tags: ["rap", "recentlyadded"]
},

{ 
   title: "No Fear Law - AlatiphA", 
   src: "https://archive.org/download/beyond-the-headlines-nyaba-diaries-alatiph-a/No%20Fear%20Law%20-%20AlatiphA.mp3", 
   tags: ["rap", "recentlyadded"]
},

{ 
   title: "Built on Pillars - AlatiphA", 
   src: "https://archive.org/download/built-on-pillars-alatiph-a/Built%20on%20Pillars%20-%20AlatiphA.mp3", 
   tags: ["rap", "recentlyadded"]
},

{ 
   title: "Built on Pillars (Remix) - AlatiphA", 
   src: "https://archive.org/download/built-on-pillars-alatiph-a/Built%20on%20Pillars%20%28Remix%29%20-%20AlatiphA.mp3", 
   tags: ["remix", "recentlyadded"]
}, 

{ 
   title: "Republic of Dumsor - AlatiphA", 
   src: "https://archive.org/download/beyond-the-headlines-nyaba-diaries-alatiph-a_202606/Republic%20of%20Dumsor%20-%20AlatiphA.mp3", 
   tags: ["rap", "recentlyadded"]
},

{ 
   title: "Watered Down - AlatiphA", 
   src: "https://archive.org/download/beyond-the-headlines-nyaba-diaries-alatiph-a_202606/Watered%20Down%20-%20AlatiphA.mp3", 
   tags: ["rap", "recentlyadded"]
},

{ 
   title: "Scam season - AlatiphA", 
   src: "https://archive.org/download/beyond-the-headlines-nyaba-diaries-alatiph-a_202606/Scam%20season%20-%20AlatiphA.mp3", 
   tags: ["rap", "recentlyadded"]
},

{ 
   title: "Unholy Alliance - AlatiphA", 
   src: "https://archive.org/download/beyond-the-headlines-nyaba-diaries-alatiph-a_202606/Unholy%20Alliance%20-%20AlatiphA.mp3", 
   tags: ["rap", "recentlyadded"]
}

  ];



// =======================
// STATE LAYER
// =======================
const STATE = {
  songs: songs,
  
  db: null,
  downloadedSongs: {}, 

  currentIndex: (() => {
  const i = parseInt(localStorage.getItem("index"));
  return isNaN(i) ? 0 : i;
})(),

  favorites: JSON.parse(localStorage.getItem("favorites")) || [],
  activePlaylist: "all",
  showFavoritesOnly: false,
  shuffle: false,
  repeat: localStorage.getItem("repeat") || "off",
  isMuted: JSON.parse(localStorage.getItem("muted")) || false,
lastVolume: parseFloat(localStorage.getItem("volume")) || 1,
  isMini: false,
  isSeeking: false,
  view: "home", 
  touchStartTime: 0,
  isSwipeAllowed: false,
  durations: {}, 
  renderTimer: null, 
  nextBufferAudio: new Audio()
};


/* ====== DURATION_KEY - Change if songs change ====== */

const DURATION_KEY = "alatiphy_durations_v1";

try {
  const cached = JSON.parse(localStorage.getItem(DURATION_KEY));

  if (cached && typeof cached === "object") {
    STATE.durations = cached.durations || {};
    STATE.durationHash = cached.hash || "";
  }

} catch (e) {
  STATE.durations = {};
  STATE.durationHash = "";
}

function generateSongHash() {
  return STATE.songs.map(s => s.src).join("|");
}

console.log("Songs loaded:", STATE.songs.length);

//DURATION LOADER 
function loadDurations() {

  const currentHash = generateSongHash();

  // ✅ If songs unchanged and durations exist → STOP
  if (
    STATE.durationHash === currentHash &&
    Object.keys(STATE.durations).length === STATE.songs.length
  ) {
    console.log("Durations already cached. Skipping scan.");
    return;
  }

  console.log("Scanning durations...");

  STATE.durationHash = currentHash;

  let index = 0;

  function scanNext() {

    if (index >= STATE.songs.length) {
      console.log("Duration scan complete.");
      saveDurations();
      return;
    }

    // skip already cached
    if (STATE.durations[index]) {
      index++;
      scanNext();
      return;
    }

    const audio = new Audio();
    audio.src = STATE.songs[index].src;
    audio.preload = "metadata";

    audio.addEventListener("loadedmetadata", () => {

      const duration = audio.duration;

      if (duration && isFinite(duration)) {
        STATE.durations[index] = duration;

        // Save progressively (safe)
        saveDurations();

        // Update only that item visually
        updateSingleDuration(index, duration);
      }

      index++;

      // throttle to avoid UI lag
      setTimeout(scanNext, 150);
    });

    audio.addEventListener("error", () => {
      index++;
      setTimeout(scanNext, 150);
    });
  }

  scanNext();
}

/* ===== UPDATE DURATION ===== */

function updateSingleDuration(index, duration) {

  const el = DOM.list.querySelector(
    `.song[data-index="${index}"] .duration`
  );

  if (el) {
    el.textContent = formatTime(duration);
  }
}

/* ===== SAVE DURATIONS ===== */
function saveDurations() {
  try {
    localStorage.setItem(
      DURATION_KEY,
      JSON.stringify({
        durations: STATE.durations,
        hash: STATE.durationHash
      })
    );
  } catch (e) {
    console.log("Duration save failed", e);
  }
}


// =======================
// INDEXED DB
// =======================

const DB = {
  name: "AlatiphAMusicDB",
  version: 1,
  database: null
};

// OPEN DATABASE
function openDatabase() {

  return new Promise((resolve, reject) => {

    const request = indexedDB.open(
      DB.name,
      DB.version
    );

    // CREATE TABLES
    request.onupgradeneeded = function (event) {

      const db = event.target.result;

      // SONG STORAGE
      if (!db.objectStoreNames.contains("songs")) {

        const store = db.createObjectStore(
          "songs",
          { keyPath: "id" }
        );

        store.createIndex(
          "title",
          "title",
          { unique: false }
        );
      }
    };

    // SUCCESS
    request.onsuccess = function (event) {

      DB.database = event.target.result;

      console.log("IndexedDB ready");

      resolve(DB.database);
    };

    // ERROR
    request.onerror = function (event) {

      console.error(
        "IndexedDB failed",
        event.target.error
      );

      reject(event.target.error);
    };
  });
}

/* ===== SAVE SONG ===== */
  
function saveSongToDB(songData) {

  return new Promise((resolve, reject) => {

    try {

      const transaction = DB.database.transaction(
        ["songs"],
        "readwrite"
      );

      const store = transaction.objectStore("songs");

      const request = store.put(songData);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = (event) => {

        console.error(
          "Failed to save song",
          event.target.error
        );

        reject(event.target.error);
      };

    } catch (err) {

      console.error(err);

      reject(err);
    }
  });
}

/* ===== GET SONGS ===== */
  
function getSongFromDB(id) {

  return new Promise((resolve, reject) => {

    try {

      const transaction = DB.database.transaction(
        ["songs"],
        "readonly"
      );

      const store = transaction.objectStore("songs");

      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = (event) => {

        console.error(
          "Failed to get song",
          event.target.error
        );

        reject(event.target.error);
      };

    } catch (err) {

      console.error(err);

      reject(err);
    }
  });
}

// GET ALL DOWNLOADED SONGS
function getAllDownloadedSongs() {

  return new Promise((resolve, reject) => {

    try {

      const transaction = DB.database.transaction(
        ["songs"],
        "readonly"
      );

      const store = transaction.objectStore("songs");

      const request = store.getAll();

      request.onsuccess = () => {
        resolve(request.result || []);
      };

      request.onerror = (event) => {

        console.error(
          "Failed to load downloads",
          event.target.error
        );

        reject(event.target.error);
      };

    } catch (err) {

      console.error(err);

      reject(err);
    }
  });
}


// =======================
// LOGIC
// =======================

/* ===== SCHEDULE RENDER ===== */
function scheduleRender() {

  if (STATE.renderTimer) return;

  STATE.renderTimer = requestAnimationFrame(() => {
    renderList(DOM.search.value);
    STATE.renderTimer = null;
  });
}

/* ===== LOAD SONG ===== */
async function loadSong() {

  const song = STATE.songs[STATE.currentIndex];
  if (!song) return;

  try {

    let src = song.src;

    // USE DOWNLOADED BLOB IF AVAILABLE
    if (STATE.downloadedSongs[song.src]) {

      src = URL.createObjectURL(
        STATE.downloadedSongs[song.src].blob
      );
    }

    DOM.audio.src = src;

    DOM.cover.src = song.cover || COVER || "";

    if (!DOM.cover.src) {
      DOM.cover.src = COVER;
    }

    DOM.title.innerHTML =
      `<span data-title="${song.title}">
        ${song.title}
      </span>`;

    DOM.cover.classList.add("loading");

    DOM.audio.addEventListener("canplay", () => {
      DOM.cover.classList.remove("loading");
    }, { once: true });

    updateMarquee();

    DOM.playBtn.innerHTML =
      '<i class="fas fa-play"></i>';

    DOM.playBtn.classList.remove("pause");

    highlightActiveTrack();

  } catch (err) {

    console.error("loadSong failed", err);
  }
}

/* ===== PLAY SONG ===== */
function playSong() {

  DOM.audio.play()

    .then(() => {

      DOM.playBtn.innerHTML =
        '<i class="fas fa-pause"></i>';

      DOM.playBtn.classList.add("pause");

      DOM.cover.classList.add("playing");

      setTimeout(preloadNextTrack, 200);

      savePlaybackState(true);
    })

    .catch(err => {

      console.error("Playback failed", err);

      DOM.playBtn.innerHTML =
        '<i class="fas fa-play"></i>';

      DOM.playBtn.classList.remove("pause");

      DOM.cover.classList.remove("playing");

      savePlaybackState(false);
    });
}

/* ===== PLAY SONG ===== */
function pauseSong(){

  DOM.audio.pause();

  savePlaybackState(false);

  DOM.playBtn.innerHTML =
    '<i class="fas fa-play"></i>';

  DOM.playBtn.classList.remove("pause");

  DOM.cover.classList.remove("playing");
}

/* ===== NEXT SONG ===== */
function nextSong(){
  STATE.currentIndex =
    (STATE.currentIndex + 1) % STATE.songs.length;

  saveState();
  loadSong();
  playSong();
}

/* ===== PREVIOUS SONG ===== */
function prevSong(){
  STATE.currentIndex =
    (STATE.currentIndex - 1 + STATE.songs.length) % STATE.songs.length;

  saveState();
  loadSong();
  playSong();
}

/* ===== UPDATE REPEAT BUTTON ===== */
function updateRepeatButton() {

  DOM.repeatBtn.classList.remove("active");

  if (STATE.repeat === "off") {
    DOM.repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
  }

  if (STATE.repeat === "one") {
    DOM.repeatBtn.classList.add("active");
    DOM.repeatBtn.innerHTML = '<i class="fas fa-redo"></i>';
  }

  if (STATE.repeat === "all") {
    DOM.repeatBtn.classList.add("active");
    DOM.repeatBtn.innerHTML = '<i class="fas fa-repeat"></i>';
  }
}

/* ===== PRELOAD NEXT TRACK ===== */
function preloadNextTrack() {

  const nextIndex = getNextIndex("next");
  if (nextIndex === null) return;

  const nextSong = STATE.songs[nextIndex];
  if (!nextSong) return;

  if (STATE.nextBufferAudio.src === nextSong.src) return;

  STATE.nextSongIndex = nextIndex;

  STATE.nextBufferAudio.src = nextSong.src;
  STATE.nextBufferAudio.load();

  STATE.nextBufferAudio.play()
    .then(() => {
      STATE.nextBufferAudio.pause();
      STATE.nextBufferAudio.currentTime = 0;
    })
    .catch(() => {});
}

/* ===== SAVE STATE ===== */
function saveState(){
  localStorage.setItem("index", STATE.currentIndex);
}

/* ===== SAVE PLAYLIST STATE ===== */
function savePlaybackState(isPlaying) {
  localStorage.setItem("isPlaying", isPlaying);
}

/* ===== RENDER LIST ===== */
function renderList(filter=""){

  DOM.list.innerHTML = "";

  const playlist = getCurrentPlaylist();

  playlist.forEach(item => {

    const song = item.song;
    const i = item.index;

    const hasFilter = filter.trim() !== "";
    const isMatch = song.title.toLowerCase().includes(filter.toLowerCase());
    const isCurrent = i === STATE.currentIndex;

// Only filter when user is actually searching
if (hasFilter && !isMatch && !isCurrent) return;

    const div = document.createElement("div");
    div.className = "song";
    
    if (isDownloaded(i)) {
  div.classList.add("downloaded");
}

    div.dataset.index = i;

    const isFav = STATE.favorites.includes(i);

    const duration = STATE.durations[i];

div.innerHTML = `
  <img src="${song.cover || COVER}">
  <span>${song.title}</span>

  <div class="song-right">
    <span class="duration">
      ${duration ? formatTime(duration) : "…"}
    </span>

    <button class="heart ${isFav ? "liked" : ""}">
      <i class="${isFav ? "fas" : "far"} fa-heart"></i>
    </button>
  </div>
`;

    // play
    div.onclick = (e) => {

  if (e.target.closest(".heart")) return;

  if (STATE.currentIndex === i) {
    // toggle play/pause instead
    DOM.audio.paused ? playSong() : pauseSong();
    return;
  }

  STATE.currentIndex = i;

  loadSong();
  playSong();
  highlightActiveTrack();
  saveState();
};

    // favorite
    div.querySelector(".heart").onclick = (e)=>{
      e.stopPropagation();

      if(STATE.favorites.includes(i)){
        STATE.favorites =
          STATE.favorites.filter(x=>x!==i);
      }else{
        STATE.favorites.push(i);
      }

      localStorage.setItem(
        "favorites",
        JSON.stringify(STATE.favorites)
      );

      renderList(DOM.search.value);
      highlightActiveTrack();
    };

    DOM.list.appendChild(div);
  });

}

/* ===== UPDATE MARQUEE ===== */
function updateMarquee() {

  const span = DOM.title.querySelector("span");
  if (!span) return;

  // reset first
  DOM.title.classList.remove("marquee");
  span.style.animationDuration = "0s";

  // WAIT for layout to settle properly
  setTimeout(() => {

    const textWidth = span.scrollWidth;
    const containerWidth = DOM.title.clientWidth;

    // debug (optional)
    // console.log({ textWidth, containerWidth });

    if (textWidth > containerWidth) {

      // slower base speed
let speed = 30;

// even slower in mini player (feels more natural)
if (STATE.isMini) speed = 22;

const gap = STATE.isMini ? 40 : 60;
const distance = textWidth + gap;

// minimum duration so short overflow doesn't rush
let duration = distance / speed;
duration = Math.max(duration, 6); // never faster than 6s

span.style.animationDuration = duration + "s";

      span.style.animationDuration = duration + "s";

      DOM.title.classList.add("marquee");
    }

  }, 50); // small delay is key
}

/* ===== UPDATE TIME ===== */
function updateTime(){
  if(!DOM.audio.duration) return;

  if (!STATE.isSeeking) {
  DOM.progress.style.width =
    (DOM.audio.currentTime / DOM.audio.duration) * 100 + "%";
}

  DOM.time.textContent =
    formatTime(DOM.audio.currentTime) +
    " / " +
    formatTime(DOM.audio.duration);
}

/* ===== FORMAT TIME ===== */
function formatTime(s) {

  if (
    s === undefined ||
    s === null ||
    isNaN(s) ||
    !isFinite(s)
  ) {
    return "0:00";
  }

  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);

  return m + ":" + (sec < 10 ? "0" : "") + sec;
}

function getPlaylistByTag(tag){

  const normalized = (tag || "").toLowerCase();

  return STATE.songs
    .map((song, index) => ({ song, index }))
    .filter(item => {

      if(normalized === "all") return true;

      if(!item.song.tags) return false;

      return item.song.tags
        .map(t => t.toLowerCase())
        .includes(normalized);

    });
}

/* ===== GET CURRENT PLAYLIST ===== */
function getCurrentPlaylist(){

  // DOWNLOADS VIEW
  if (STATE.view === "downloads") {

    return STATE.songs
      .map((song, index) => ({ song, index }))
      .filter(item => isDownloaded(item.index));
  }

  // FAVORITES VIEW
  if (STATE.showFavoritesOnly){

    return STATE.songs
      .map((song,index)=>({song,index}))
      .filter(item => STATE.favorites.includes(item.index));
  }

  // NORMAL PLAYLISTS
  return getPlaylistByTag(STATE.activePlaylist);
}

// SWITCH VIEW HELPER 

function resetUIState() {
  DOM.search.value = "";
  DOM.clearBtn.style.display = "none";
}

// SWITCH VIEW 
function switchView(view) {

  STATE.view = view;

  resetUIState();

  // RESET FAVORITES MODE
  STATE.showFavoritesOnly = false;

  if (view === "home") {

    STATE.activePlaylist = "all";

    renderList();

    setTimeout(highlightActiveTrack, 50);
  }

  else if (view === "favorites") {

    STATE.showFavoritesOnly = true;

    renderList();

    setTimeout(highlightActiveTrack, 50);
  }

  else if (view === "downloads") {

    renderDownloads();
  }

  else if (view === "about") {

    showAbout();
  }

  updateActiveTab();
}


/* =========================
   RENDER DOWNLOADS
========================= */

async function renderDownloads() {

  DOM.list.innerHTML =
    `<div style="padding:15px;">
      Loading downloads...
    </div>`;

  try {

    const downloads = await getAllDownloadedSongs();

    DOM.list.innerHTML = "";

    if (!downloads.length) {

      DOM.list.innerHTML =
        `<div style="padding:15px;">
          No downloaded songs yet
        </div>`;

      return;
    }

    STATE.songs.forEach((song, originalIndex) => {

  const download =
    STATE.downloadedSongs[song.src];

  if (!download) return;

      const div = document.createElement("div");

      div.className = "song";
      div.dataset.index = originalIndex;

      const isFav =
        STATE.favorites.includes(originalIndex);

      div.innerHTML = `
        <img src="${song.cover || COVER}">

        <span>${song.title}</span>

        <div class="song-right">

          <button class="heart ${isFav ? "liked" : ""}">
            <i class="${isFav ? "fas" : "far"} fa-heart"></i>
          </button>

        </div>
      `;

      // PLAY
      div.onclick = (e) => {

  if (e.target.closest(".heart")) return;

  STATE.currentIndex = originalIndex;

  loadSong();
  playSong();
  highlightActiveTrack();
  saveState();
};

      // FAVORITE
      div.querySelector(".heart").onclick = (e) => {

        e.stopPropagation();

        if (STATE.favorites.includes(originalIndex)) {

          STATE.favorites =
            STATE.favorites.filter(
              x => x !== originalIndex
            );

        } else {

          STATE.favorites.push(originalIndex);
        }

        localStorage.setItem(
          "favorites",
          JSON.stringify(STATE.favorites)
        );

        renderDownloads();
      };

      DOM.list.appendChild(div);
    });

    highlightActiveTrack();

  } catch (err) {

    console.error(err);

    DOM.list.innerHTML =
      `<div style="padding:15px;">
        Failed to load downloads
      </div>`;
  }
}
  

/* =========================
   ***** ABOUT *****
========================= */

function showAbout() {

  DOM.list.innerHTML = `
    <div style="padding:15px; line-height:1.6;">
      <h3>Alatiphy - AlatiphA Music</h3>

      <p>Alatiphy is a progressive web app (PWA) music player for streaming and offline listening to AlatiphA's original tracks.</p>
      <p>With Alatiphy, it’s easy to listen to tailored online and offline music on your phone, your computer, your tablet and many more devices.</p>
    </div>
  `;
}


/* =========================
   NAVIGATION 
========================= */

/* 🔥 SOURCE OF TRUTH FOR NAVIGATION */
function getNextIndex(direction = "next") {

  const playlist = getCurrentPlaylist();
  if (!playlist.length) return null;

  const currentPos = playlist.findIndex(
    item => item.index === STATE.currentIndex
  );

  if (currentPos === -1) return null;

  // REPEAT ONE
  if (STATE.repeat === "one") {
    return STATE.currentIndex;
  }

  // SHUFFLE
  if (STATE.shuffle) {

    if (playlist.length === 1) return STATE.currentIndex;

    let newPos;

    do {
      newPos = Math.floor(Math.random() * playlist.length);
    } while (playlist[newPos].index === STATE.currentIndex);

    return playlist[newPos].index;
  }

  // NORMAL MOVE
  let newPos = direction === "next"
    ? currentPos + 1
    : currentPos - 1;

  // REPEAT ALL
  if (STATE.repeat === "all") {
    if (newPos >= playlist.length) newPos = 0;
    if (newPos < 0) newPos = playlist.length - 1;
  }

  // REPEAT OFF
  if (STATE.repeat === "off") {
    if (newPos >= playlist.length || newPos < 0) {
      return null;
    }
  }

  return playlist[newPos].index;
}

//SHUFFLE 
function updateShuffleButton() {
  DOM.shuffleBtn.classList.toggle("active", STATE.shuffle);
}

//VOLUME & MUTE 
function updateVolumeUI() {

  DOM.volume.value = STATE.isMuted ? 0 : STATE.lastVolume;

  if (STATE.isMuted || STATE.lastVolume === 0) {
    DOM.muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    DOM.muteBtn.classList.add("active");
  } else {
    DOM.muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    DOM.muteBtn.classList.remove("active");
  }
}

function applyVolume() {

  DOM.audio.volume = STATE.isMuted ? 0 : STATE.lastVolume;

  updateVolumeUI();
}

//TIME UPDATER 
function seek(e) {

  const rect = DOM.bar.getBoundingClientRect();
  const x = e.touches ? e.touches[0].clientX : e.clientX;

  let percent = (x - rect.left) / rect.width;

  percent = Math.max(0, Math.min(1, percent));

  DOM.progress.style.width = (percent * 100) + "%";

  if (DOM.audio.duration) {
    DOM.audio.currentTime = percent * DOM.audio.duration;
  }
}

DOM.bar.addEventListener("click", seek);

//Start dragging
DOM.bar.addEventListener("mousedown", (e) => {
  STATE.isSeeking = true;
  seek(e);
});

DOM.bar.addEventListener("touchstart", (e) => {
  STATE.isSeeking = true;
  seek(e);
});

//Move while dragging
document.addEventListener("mousemove", (e) => {
  if (!STATE.isSeeking) return;
  seek(e);
});

document.addEventListener("touchmove", (e) => {
  if (!STATE.isSeeking) return;
  seek(e);
});

//End dragging
document.addEventListener("mouseup", () => {
  STATE.isSeeking = false;
});

document.addEventListener("touchend", () => {
  STATE.isSeeking = false;
});

//Prevent page scroll while dragging on mobile:
DOM.bar.addEventListener("touchmove", (e) => {
  if (STATE.isSeeking) e.preventDefault();
}, { passive: false });

//HIGHLIGHTING TRACKS
function highlightActiveTrack() {

  const current = document.querySelector(".song.active");
  if (current) current.classList.remove("active");

  const active = DOM.list.querySelector(
    `.song[data-index="${STATE.currentIndex}"]`
  );

  if (active) {
    active.classList.add("active");

    requestAnimationFrame(() => {
      active.scrollIntoView({
        block: "nearest",
        behavior: "smooth"
      });
    });
  }
}

/* ===== DEBOUNCE ===== */
function debounce(fn, delay = 200) {
  let timer;

  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

const handleSearch = debounce((value) => {
  renderList(value);

  // only scroll when search is empty
  if (!value) {
    setTimeout(() => {
      highlightActiveTrack();
    }, 50);
  }
}, 200);


/* ===== GET CURRENT SONG ===== */
function getCurrentSong() {
  return STATE.songs[STATE.currentIndex] || null;
}

/* ===== DOWNLOADED ===== */
function isDownloaded(index) {

  const song = STATE.songs[index];
  if (!song) return false;

  return !!STATE.downloadedSongs[song.src];
}

async function loadDownloadedSongsMap() {

  try {

    const downloads = await getAllDownloadedSongs();

    STATE.downloadedSongs = {};

    downloads.forEach(item => {
      STATE.downloadedSongs[item.id] = item;
    });

  } catch (err) {

    console.error("Failed loading download map", err);
  }
}


// =======================
// SWIPE GESTURES
// =======================

DOM.player.addEventListener("touchstart", (e) => {

  STATE.isSwipeAllowed = !e.target.closest(
    ".bar, #volume, button, input"
  );

  if (!STATE.isSwipeAllowed) return;

  const touch = e.touches[0];

  STATE.touchStartX = touch.clientX;
  STATE.touchStartY = touch.clientY;
  STATE.touchStartTime = Date.now();
});

DOM.player.addEventListener("touchend", (e) => {

  if (!STATE.isSwipeAllowed || STATE.isSeeking) return;

  const touch = e.changedTouches[0];

  STATE.touchEndX = touch.clientX;
  STATE.touchEndY = touch.clientY;

  const timeTaken = Date.now() - STATE.touchStartTime;

  handleSwipe(timeTaken);
});

function handleSwipe(timeTaken) {

  const dx = STATE.touchEndX - STATE.touchStartX;
  const dy = STATE.touchEndY - STATE.touchStartY;

  const absX = Math.abs(dx);
  const absY = Math.abs(dy);

  // distance thresholds
  const minDistance = 60;

  // velocity (px per ms)
  const velocityX = absX / timeTaken;
  const velocityY = absY / timeTaken;

  // fast swipe threshold
  const fastSwipe = 0.4;

  // ignore tiny movement
  if (absX < 20 && absY < 20) return;

  // HORIZONTAL
  if (absX > absY) {

    const isFast = velocityX > fastSwipe;

    if (absX > minDistance || isFast) {

      if (dx < 0) {

  const nextIndex = getNextIndex("next");

  if (nextIndex === null) return;

  STATE.currentIndex = nextIndex;

} else {

  const prevIndex = getNextIndex("prev");

  if (prevIndex === null) return;

  STATE.currentIndex = prevIndex;
}

saveState();
loadSong();
playSong();
highlightActiveTrack();     
    }
  }

  // VERTICAL
  else {

    const isFast = velocityY > fastSwipe;

    if (absY > minDistance || isFast) {

      if (dy > 0) {
        // DOWN → COLLAPSE
        STATE.isMini = true;
        DOM.player.classList.add("mini");
        document.querySelector(".app").classList.add("mini-player");
           setTimeout(updateMarquee, 80);
      } else {
        // UP → EXPAND
        STATE.isMini = false;
        DOM.player.classList.remove("mini");
        document.querySelector(".app").classList.remove("mini-player");
          setTimeout(updateMarquee, 80);
      }
    }
  }
}


// =======================
// EVENTS
// =======================

DOM.playBtn.onclick = () => {
  DOM.audio.paused ? playSong() : pauseSong();
};

//NEXT BUTTON 
document.getElementById("next").onclick = () => {

  const nextIndex = getNextIndex("next");

  if (nextIndex === null) {
    pauseSong();
    return;
  }

  STATE.currentIndex = nextIndex;

  loadSong();
  playSong();
  highlightActiveTrack();
  saveState();
};

//PREVIOUS BUTTON  
document.getElementById("prev").onclick = () => {

  const prevIndex = getNextIndex("prev");

  if (prevIndex === null) return;

  STATE.currentIndex = prevIndex;

  loadSong();
  playSong();
  highlightActiveTrack();
  saveState();
};

DOM.clearBtn.onclick = () => {

  DOM.search.value = "";

  DOM.clearBtn.style.display = "none";

  renderList("");

setTimeout(() => {
  highlightActiveTrack();
}, 50);

  DOM.search.focus();
};

DOM.audio.addEventListener("timeupdate", updateTime);

//AUDIO
DOM.audio.addEventListener("ended", function () {

  // REPEAT ONE
  if (STATE.repeat === "one") {

    DOM.audio.currentTime = 0;
    playSong();
    return;
  }

  const nextIndex = getNextIndex("next");

  // END OF PLAYLIST
  if (nextIndex === null) {

    // repeat all fallback
    if (STATE.repeat === "all") {

      const playlist = getCurrentPlaylist();

      if (playlist.length) {

        STATE.currentIndex = playlist[0].index;

        loadSong();
        playSong();
        highlightActiveTrack();
        saveState();
      }
    }

    else {

      pauseSong();
      DOM.audio.currentTime = 0;
    }

    return;
  }

  STATE.currentIndex = nextIndex;

  loadSong();
  playSong();
  highlightActiveTrack();
  saveState();
});

// MENU
if (DOM.menuToggle && DOM.overlay && DOM.sideMenu) {

  DOM.menuToggle.onclick = () => {
    DOM.sideMenu.classList.add("open");
    DOM.overlay.classList.add("show");
  };

  DOM.overlay.onclick = () => {
    DOM.sideMenu.classList.remove("open");
    DOM.overlay.classList.remove("show");
  };
}

// SIDE MENU NAVIGATION 
document.querySelectorAll(".menu-item").forEach(btn => {
  btn.onclick = () => {

    const view = btn.dataset.view;
    STATE.view = view;

    DOM.sideMenu.classList.remove("open");
    DOM.overlay.classList.remove("show");

    switchView(view);
  };
});


// COLLAPSE PLAYER
DOM.collapseBtn.onclick = () => {

  STATE.isMini = !STATE.isMini;

  DOM.player.classList.toggle("mini", STATE.isMini);
  document.querySelector(".app").classList.toggle("mini-player", STATE.isMini);

  // re-measure title after layout change
  setTimeout(updateMarquee, 80);
};


//TAB CLICK LOGIC 
document.querySelectorAll(".tab-btn[data-playlist]").forEach(btn => {

  btn.onclick = function(){

    // RETURN TO HOME VIEW
    STATE.view = "home";

    STATE.showFavoritesOnly = false;

    STATE.activePlaylist =
      this.dataset.playlist.toLowerCase();

    renderList(DOM.search.value);

    highlightActiveTrack();

    updateActiveTab();
  };

});

//FAVORITES TAB 
DOM.tabFavorites.onclick = ()=>{

  STATE.view = "favorites";

  STATE.showFavoritesOnly = true;

  renderList(DOM.search.value);

  highlightActiveTrack();

  updateActiveTab();
};

//ACTIVE TAB HIGHLIGHT 
function updateActiveTab(){

  document.querySelectorAll(".tab-btn")
    .forEach(btn => btn.classList.remove("active"));

  if(STATE.showFavoritesOnly){
    DOM.tabFavorites.classList.add("active");
    return;
  }

  const btn = [...document.querySelectorAll(".tab-btn[data-playlist]")]
    .find(b => b.dataset.playlist.toLowerCase() === STATE.activePlaylist);

  if(btn) btn.classList.add("active");
}

//SHUFFLE 
DOM.shuffleBtn.onclick = () => {

  STATE.shuffle = !STATE.shuffle;

  localStorage.setItem("shuffle", STATE.shuffle);

  updateShuffleButton();
  
};

//REPEAT 
DOM.repeatBtn.onclick = () => {

  if (STATE.repeat === "off") {
    STATE.repeat = "one";
  }
  else if (STATE.repeat === "one") {
    STATE.repeat = "all";
  }
  else {
    STATE.repeat = "off";
  }

  localStorage.setItem("repeat", STATE.repeat);

  updateRepeatButton();
};

//VOLUME SLIDER
DOM.volume.oninput = () => {

  STATE.lastVolume = parseFloat(DOM.volume.value);
  STATE.isMuted = STATE.lastVolume === 0;

  localStorage.setItem("volume", STATE.lastVolume);
  localStorage.setItem("muted", STATE.isMuted);

  applyVolume();
};

//MUTE
DOM.muteBtn.onclick = () => {

  STATE.isMuted = !STATE.isMuted;

  localStorage.setItem("muted", STATE.isMuted);

  applyVolume();
};


DOM.search.oninput = (e) => {

  const value = e.target.value;

  DOM.clearBtn.style.display = value ? "flex" : "none";

  handleSearch(value);
};

//PLAYER MENU
DOM.menuBtn.onclick = (e) => {

  e.stopPropagation();

  const rect = DOM.menuBtn.getBoundingClientRect();

  DOM.menuPopup.style.right =
    (window.innerWidth - rect.right) + "px";

  DOM.menuPopup.style.bottom =
    (window.innerHeight - rect.top + 10) + "px";

  DOM.menuPopup.style.display =
    DOM.menuPopup.style.display === "flex"
      ? "none"
      : "flex";
};

// close when clicking outside
document.addEventListener("click", () => {
  DOM.menuPopup.style.display = "none";
});

// prevent closing when clicking inside menu
DOM.menuPopup.onclick = (e) => {
  e.stopPropagation();
};

// Menu Download 
// MENU DOWNLOAD
// MENU DOWNLOAD
DOM.menuDownload.onclick = async () => {

  try {

    const song = getCurrentSong();

    if (!song) return;

    DOM.menuDownload.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Downloading...';

    // already downloaded?
    const existing = await getSongFromDB(song.src);

    if (existing) {

      alert("Song already downloaded");

      DOM.menuDownload.innerHTML =
        '<i class="fas fa-download"></i> Download';

      return;
    }

    // FETCH SONG
const response = await fetch(song.src, {
  mode: "cors",
  cache: "no-cache"
});

if (!response.ok) {
  throw new Error(
    "Server blocked download or file unavailable"
  );
}

// validate content
const contentType =
  response.headers.get("content-type") || "";

if (
  !contentType.includes("audio") &&
  !contentType.includes("mpeg")
) {
  throw new Error("Invalid audio response");
}

// CONVERT TO BLOB
const blob = await response.blob();

if (!blob || blob.size === 0) {
  throw new Error("Empty download");
}

    // SAVE TO INDEXEDDB
    await saveSongToDB({

      id: song.src,
      title: song.title,
      blob: blob,
      cover: song.cover || COVER,
      downloadedAt: Date.now()
    });

    // REFRESH MEMORY MAP
    await loadDownloadedSongsMap();

    alert("Song downloaded for offline use");

    // refresh UI
    renderList(DOM.search.value);

    if (STATE.view === "downloads") {
      renderDownloads();
    }

  } catch (err) {

    console.error(err);

    alert("Download failed");

  } finally {

    DOM.menuDownload.innerHTML =
      '<i class="fas fa-download"></i> Download';

    DOM.menuPopup.style.display = "none";
  }
};

//Share
DOM.menuShare.onclick = async () => {

  const song = getCurrentSong();
  if (!song) return;

  const shareData = {
    title: song.title,
    text: "Listen to this track on AlatiphA Music",
    url: song.src
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(song.src);
      alert("Link copied to clipboard");
    }
  } catch (err) {
    console.log("Share failed", err);
  }

  DOM.menuPopup.style.display = "none";
};

  
// =======================
// INIT
// =======================

async function init(){

  await openDatabase();
  await loadDownloadedSongsMap();

  renderList();

  loadSong();

  // 🔥 Force UI sync AFTER everything is ready
  setTimeout(() => {
    highlightActiveTrack();
    updateMarquee();
  }, 50);

  updateActiveTab();
  
  STATE.shuffle =
  JSON.parse(localStorage.getItem("shuffle")) || false;

updateShuffleButton();
  updateRepeatButton();
  applyVolume();
  loadDurations();

  DOM.clearBtn.style.display = "none";
  
  const wasPlaying = JSON.parse(localStorage.getItem("isPlaying"));

  if (wasPlaying) {
    playSong();
  }

  // Reveal UI now that songs are rendered
  document.body.classList.add("app-ready");
}

if ("serviceWorker" in navigator) {

  navigator.serviceWorker.register("./sw.js")
    .then((registration) => {

      console.log("Service Worker registered");

      // force update check
      registration.update();

      navigator.serviceWorker.addEventListener(
        "message",
        (event) => {

          if (
            event.data &&
            event.data.type === "RELOAD"
          ) {

            window.location.reload();
          }
        }
      );
    })

    .catch((err) => {
      console.error(
        "Service Worker registration failed",
        err
      );
    });
}

init();

})();
