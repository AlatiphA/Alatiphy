# Alatiphy - Music Player 

A progressive web app (PWA) music player for streaming and offline listening to AlatiphA's original tracks — built with vanilla HTML, CSS, and JavaScript, hosted on GitHub Pages.

---

## Features

### Playback
- Play, pause, skip to next/previous track
- Seek bar with click and drag support (mouse and touch)
- Real-time playback time display (`current / total`)
- Next track preloading for smooth transitions
- Restores last played track and playback position on relaunch

### Repeat & Shuffle
- **Repeat Off** — plays through the playlist once and stops
- **Repeat One** — loops the current track indefinitely
- **Repeat All** — loops the entire playlist
- **Shuffle** — randomly selects the next track, never repeating the current one

### Volume & Mute
- Volume slider with persistent state across sessions
- Mute/unmute toggle with icon feedback
- Volume and mute state saved to `localStorage`

### Song List & Playlists
- Filter tabs: **All Songs**, **Recently Added**, **Rap**, **R&B**, **Remix**, **Afrobeats**
- **Favorites** tab — heart any song to save it; persists across sessions
- Song duration displayed per track (scanned progressively on first load, then cached)
- Active track highlighted and auto-scrolled into view

### Search
- Live search filters the current playlist as you type
- Current playing track always stays visible even when it doesn't match the search
- Clear button to reset search instantly

### Player UI
- Spinning vinyl cover art with glow animation while loading, slower spin while playing
- Scrolling marquee title for long song names
- **Mini player mode** — collapse to a slim bar at the bottom; swipe up to expand
- Collapse/expand button always accessible

### Swipe Gestures (Mobile)
- Swipe **left/right** on the player to skip to next/previous track
- Swipe **down** to collapse into mini player
- Swipe **up** to expand the full player
- Velocity-based detection — fast flick or slow drag both work
- Ignores swipes on interactive controls (seek bar, volume, buttons)

### Downloads & Offline
- **Auto-cache** — every song you play while online is silently saved to IndexedDB in the background, so it plays offline next time — no action needed
- **Download** — tap Download in the `⋮` player menu to explicitly save a song; this also saves a real `.mp3` file to your device's Downloads folder
- Only explicit downloads show the `⬇` indicator and appear in the **Downloads view** — auto-cached songs stay invisible in the UI
- Both auto-cached and downloaded songs play from local storage when offline, bypassing the network

### Share
- Share button in the `⋮` player menu
- Uses the native Web Share API on mobile; falls back to copying the link on desktop

### PWA & Install
- Installable on Android (Chrome/Samsung Browser) and iOS (Safari)
- **Android/Desktop** — native install banner slides up after 4 seconds
- **iOS** — step-by-step "Add to Home Screen" instruction banner
- Once dismissed or installed, the prompt never shows again (`localStorage` flag)
- Service Worker for offline caching and background updates
- Web App Manifest with icons, theme colour, and standalone display mode

### Sidebar Navigation
- Hamburger menu opens a slide-in sidebar
- Views: **Home**, **Favorites**, **Downloads**, **About**
- Tap outside (overlay) to close
- About section pinned at the bottom of the sidebar with app icon, version, and developer credit

### Theme
- **Auto, Light, or Dark** — toggle in the sidebar's Theme switcher
- Auto mode follows the system's `prefers-color-scheme` and updates live if the system theme changes
- Manual selection persists across sessions via `localStorage`
- Accent colour: warm gold/brown (`#956433`)

---

## File Structure

```
/
├── index.html        # Main app (HTML + JS)
├── style.css         # All styles
├── manifest.json     # PWA manifest
├── sw.js             # Service Worker
├── icon-192.png      # App icon (192×192)
└── icon-512.png      # App icon (512×512)
```

---

## Tech Stack

- **HTML / CSS / JavaScript** — no frameworks, no build tools
- **IndexedDB** — auto-cached and downloaded song storage for offline playback
- **localStorage** — preferences, favorites, durations cache, playback state
- **Service Worker** — offline support and update detection
- **Web App Manifest** — PWA install and standalone mode
- **Web Share API** — native share on mobile
- **Font Awesome 7** — icons

### Release version

`version.json` is the source of truth for the active release. From the repository
folder, run this command with the next release number:

```powershell
node tools/release.cjs 7.10.0
node tools/release.cjs --check
```

The command synchronizes `version.json`, the `APP_VERSION` constants in `app.js`
and `sw.js`, the visible version in `index.html`, and the `version` metadata in
`manifest.json`. Commit and deploy those files together. Running without a version
argument synchronizes files to the current `version.json` value.

The manifest's `version` is custom app metadata, not a standard PWA update trigger.
The service worker's versioned cache names control this app's cached releases.
The IndexedDB schema version is independent and changes only for database migrations.
Historical alternate files have been removed; `index.html` is the active entry point.

### Check for updates

Open **About → App updates → Check for updates** from the sidebar. Alatiphy compares a
fresh `version.json` with the running app and active service worker. It reports
offline/network errors without claiming the app is up to date. Available updates
show **Install update** (or **Reload app** if already activated in another tab).

Checking leaves music playing. Installing asks before refreshing, saves playback
position, and keeps IndexedDB downloads, favorites and settings. Automatic playback
after refresh still depends on browser autoplay permission. Updates wait until
installed by the listener or until all old app tabs close; another tab's update
does not force a listening tab to reload. Core app files must download successfully
before a new worker can finish installation.

### Offline and background playback

Select songs in Downloads for a queue stored on this device. Saving is confirmed
only after the IndexedDB transaction commits; partial HTTP responses and empty
audio blobs are not accepted as offline saves. Both streamed and saved tracks use
the same audio element. When the browser reports offline, queue navigation skips
unsaved tracks. The player reports unavailable or failed audio instead of silently
treating a failed load as ready.

On-screen buttons, swipes, automatic track transitions and Android lock-screen
controls use one captured playback queue. Browsing About or FAQ does not change
it. Saved audio is preferred for playback and preloading even while online. Local
preload URLs transfer to the main player and are released after use. Automatic
transitions issue Play immediately instead of waiting for a metadata callback or
timer. Lock-screen playback state and position follow native audio events.

Run `node tools/check-playback.cjs` and `node tools/check-updates.cjs` to check
the playback and update flows. These simulate browser/media events; they cannot
verify a physical Android phone's battery policy or screen-off behavior. For a
device check, play at least two downloaded tracks in airplane mode with the screen
locked, then repeat with unsaved streamed tracks while online. Browser storage can
still be cleared or evicted, and Android/browser suspension cannot be prevented
by this web app. Repeat off intentionally stops at the end of the queue.

---

## Songs (12 Tracks)

| Title | Tags |
|---|---|
| Wo de ya ka | Rap, Afrobeats |
| Yawa Season (Remix) | Rap, Remix |
| ORAL vs OCAL (Remix) | Rap, Remix |
| No Be Pawn (Remix) | Rap, Remix |
| Shee mungani | Rap, Afrobeats |
| ORAL vs OCAL (Afrobeat) | Rap, Afrobeats |
| Galamsey Tears & Church Power | Rap, Recently Added |
| Aku Deception | Rap, Recently Added |
| 1 Job, 3 Shifts… Now Hustle | Rap, Recently Added |
| Defending Chains | Rap, Recently Added |
| No Fear Law | Rap, Recently Added |
| Built on Pillars (Remix) | Remix, Recently Added |

Audio hosted on [Internet Archive](https://archive.org).

---

## Developer

**Abdul-Latif Ahmed [AlatiphA]**
GitHub: [@AlatiphA](https://github.com/AlatiphA)
Site: [alatipha.github.io](https://alatipha.github.io)

© All Rights Reserved 
