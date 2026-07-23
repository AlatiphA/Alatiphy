# Alatiphy - AlatiphA Music

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
- Download any track to the device via the `⋮` player menu
- Downloads stored in **IndexedDB** — survive app restarts and offline use
- Downloaded tracks play from local storage, bypassing the network
- Downloaded songs marked with a `⬇` indicator in the list
- **Downloads view** in the sidebar shows all locally saved tracks

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
- Automatically adapts to **light and dark mode** via `prefers-color-scheme`
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
- **IndexedDB** — offline song storage
- **localStorage** — preferences, favorites, durations cache, playback state
- **Service Worker** — offline support and update detection
- **Web App Manifest** — PWA install and standalone mode
- **Web Share API** — native share on mobile
- **Font Awesome 7** — icons

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
