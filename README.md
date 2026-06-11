<div align="center">

# 🌌 AURORA

### Space Explorer — Your Gateway to the Cosmos

[![Live Site](https://img.shields.io/badge/🚀_Live_Site-aurora--vercel-blueviolet?style=for-the-badge)](https://aurora-imran-khans-projects-458b6e01.vercel.app)
[![Built with React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![Powered by NASA](https://img.shields.io/badge/Powered_by-NASA_APIs-0B3D91?style=for-the-badge)](https://api.nasa.gov)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

*Real-time asteroids. Live ISS tracking. NASA's entire photo archive. All in one dark, animated app.*

**[→ Open Aurora](https://aurora-imran-khans-projects-458b6e01.vercel.app)**

</div>

---

## ✨ What It Does

Aurora pulls live data from 9 NASA and space APIs and presents it in a dark glass-card interface with animated starfields, Framer Motion page transitions, and zero loading gates. Every page renders instantly — data streams in as it arrives.

---

## 🪐 Pages

### 🏠 Home — Mission Control
The dashboard. APOD preview, live ISS coordinates, and today's asteroid count load **independently and stream in as each API responds** — the page is never blank waiting for the slowest request. First meaningful paint in under a second.

### 🌅 APOD — Astronomy Picture of the Day
Browse NASA's full archive dating back to June 16, 1995. Pick any date with a date picker and the universe delivers — photos, illustrations, or embedded videos with full NASA captions.

### ☄️ Asteroids — Near-Earth Object Tracker
Pulls NASA's NeoWs feed for the current week. Every asteroid shows:
- Closest approach distance (in lunar distances + km)
- Relative velocity (km/s)
- Estimated diameter range
- **Real-world size comparison** — is it the size of a bus? A football field? A skyscraper?
- Hazard rating with colour-coded badge (potentially hazardous / safe)

### 🌦️ Space Weather — Solar Activity Monitor
NASA DONKI data visualised with Recharts. Tracks:
- Solar flares (class A → X) with timestamps
- Coronal Mass Ejections (CMEs) with speed and direction
- Geomagnetic storm events (Kp index)

### 🌍 Earth — From 1.5 Million Kilometres Away
Two independent data sources fetched in parallel:
- **EPIC imagery** — true-colour photographs of Earth taken by NASA's DSCOVR satellite
- **EONET events** — active natural events (wildfires, severe storms, volcanic activity, sea ice)

### 🛸 ISS Tracker — Live, Every 5 Seconds
Interactive Leaflet map with the ISS marker appearing the moment the first API call returns. **No loading gate** — the map renders immediately. Position updates every 5 seconds via `wheretheiss.at` (switched from the deprecated `open-notify.org`). Shows current latitude, longitude, altitude, and velocity.

### 🔭 Gallery — NASA's Entire Image Library
Search across millions of NASA photos, illustrations, and videos. Lazy-loaded image grid with smooth entrance animations. Click any result for full resolution and metadata.

### 📰 News — Space Headlines
Latest articles from the Spaceflight News API. Cards show headline, source, publish time, and a preview image. Opens original source in a new tab.

### 🚀 Launches — What's Going Up Next
Upcoming rocket launches worldwide from Launch Library 2. Shows vehicle, launch site, mission, and countdown. Covers SpaceX, Rocket Lab, ULA, ISRO, ESA, and more.

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | React 18 (Create React App) | Fast SPA with lazy-loaded code-split pages |
| **Routing** | React Router v6 | Client-side navigation, SPA rewrites on Vercel |
| **Styling** | Tailwind CSS | Dark glass-card space theme, fully responsive |
| **Animation** | Framer Motion | Page transitions + element entrance animations |
| **HTTP** | Axios | API requests with clean interceptors |
| **Maps** | Leaflet + react-leaflet | Interactive ISS map |
| **Charts** | Recharts | Space weather data visualisation |
| **Background** | Canvas API (`StarField.jsx`) | Animated procedural starfield — no GIFs, no video |
| **Caching** | In-memory TTL cache (`utils/cache.js`) | Avoids hammering NASA rate limits on repeat visits |
| **Deployment** | Vercel | SPA rewrites, long-lived static asset cache headers |

---

## 🌐 APIs

| API | What It Provides |
|-----|-----------------|
| **NASA APOD** `api.nasa.gov/planetary/apod` | Astronomy Picture of the Day — photos, illustrations, videos |
| **NASA NeoWs** `api.nasa.gov/neo/rest/v1/feed` | Near-Earth asteroids, approach data, hazard classification |
| **NASA DONKI** `api.nasa.gov/DONKI/...` | Solar flares, CMEs, geomagnetic storm alerts |
| **NASA EPIC** `api.nasa.gov/EPIC/api/natural` | True-colour Earth satellite photos from DSCOVR |
| **NASA EONET** `eonet.gsfc.nasa.gov/api/v3/events` | Active natural events on Earth's surface |
| **NASA Image Library** `images-api.nasa.gov/search` | Searchable archive of millions of NASA media assets |
| **wheretheiss.at** `api.wheretheiss.at/v1/satellites/25544` | Live ISS position — lat, lng, altitude, velocity |
| **Spaceflight News API** `api.spaceflightnewsapi.net/v4/articles` | Curated space and astronomy news |
| **Launch Library 2** `ll.thespacedevs.com/2.2.0/launch/upcoming` | Global upcoming rocket launch manifest |

All NASA APIs use a single free key — get yours instantly at [api.nasa.gov](https://api.nasa.gov/).

---

## 📁 Project Structure

```
aurora/
├── vercel.json                         # Build config, SPA rewrites, cache headers
└── client/
    └── src/
        ├── App.js                      # Route tree — React.lazy + Suspense per page
        ├── pages/
        │   ├── Home.jsx                # Streaming stats — each API fetches independently
        │   ├── APOD.jsx                # Date picker + full NASA archive
        │   ├── Asteroids.jsx           # NeoWs feed, hazard badges, size comparisons
        │   ├── SpaceWeather.jsx        # DONKI events, Recharts graphs
        │   ├── Earth.jsx               # EPIC imagery + EONET events (parallel fetches)
        │   ├── ISSTracker.jsx          # Leaflet map, 5s poll, instant render
        │   ├── Gallery.jsx             # NASA image search, lazy-loaded grid
        │   ├── News.jsx                # Spaceflight news article cards
        │   ├── Launches.jsx            # Launch Library upcoming missions
        │   └── NotFound.jsx            # 404
        ├── components/
        │   ├── Navbar.jsx              # Top navigation
        │   ├── Footer.jsx              # Attribution links
        │   ├── LoadingSpinner.jsx      # Reusable spinner
        │   └── StarField.jsx           # Animated canvas starfield (procedural, no assets)
        └── utils/
            ├── nasaApi.js              # Axios wrappers for every NASA endpoint
            ├── cache.js                # In-memory response cache with TTL
            └── moonPhase.js            # Moon phase calculation
```

---

## ⚡ Performance Decisions

**No loading gates on the ISS Tracker** — the Leaflet map renders at the default position immediately. The ISS marker drops in as soon as the first API call resolves. No spinner blocking a fully functional map.

**Home page streaming** — three API calls fire in parallel. Each stat card renders the moment its own request completes. No waiting for the slowest one.

**Earth page parallel fetch** — EPIC and EONET requests run concurrently with `Promise.all`. If EONET is slow, you still see satellite images immediately.

**Code splitting** — every page is `React.lazy` + `Suspense`. You only download the code for the page you're on.

**API caching** — responses are cached in memory with a TTL. Switching between pages and back doesn't re-hit NASA's rate limit.

**Asset caching** — `vercel.json` sets `Cache-Control: max-age=31536000, immutable` on all static assets. Repeat visits are near-instant.

---

## 🎨 Design System

Dark space aesthetic — built to feel like you're looking through a viewport.

| Element | Style |
|---------|-------|
| **Page background** | Near-black `#0a0a0f` with animated canvas starfield |
| **Cards** | Dark glass — semi-transparent background, subtle border, backdrop blur |
| **Primary accent** | Deep cosmic blue / violet |
| **Hazard indicators** | Warm red-orange for dangerous asteroids, green for safe |
| **Solar flare classes** | Colour-coded A → X (green → yellow → orange → red) |
| **Typography** | Clean sans-serif, wide letter-spacing on headings |
| **Transitions** | Framer Motion — fade + slide on page change, staggered list entrance |
| **Starfield** | Canvas API — procedurally placed stars with subtle twinkle, no external assets |

---

## 🚀 Run It Locally

```bash
git clone https://github.com/IKImranKhanIK/aurora.git
cd aurora/client
npm install
```

Create `aurora/client/.env`:

```env
REACT_APP_NASA_API_KEY=your_key_here
```

Get a free key instantly at **[api.nasa.gov](https://api.nasa.gov/)** — no approval needed, just sign up.

```bash
npm start
# → http://localhost:3000
```

---

## ☁️ Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/IKImranKhanIK/aurora)

Or manually:

1. Import the repo in [vercel.com/new](https://vercel.com/new)
2. Vercel auto-detects the `vercel.json` build config
3. Add one environment variable: `REACT_APP_NASA_API_KEY`
4. Deploy — done

The `vercel.json` handles everything: custom build command, output directory, SPA rewrites, and static asset cache headers.

```json
{
  "buildCommand": "cd aurora/client && CI=false npm run build",
  "outputDirectory": "aurora/client/build",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
  "headers": [{
    "source": "/static/(.*)",
    "headers": [{ "key": "Cache-Control", "value": "max-age=31536000, immutable" }]
  }]
}
```

---

<div align="center">

Built with data from NASA's Open APIs · Not affiliated with NASA

*"The cosmos is within us. We are made of star-stuff."* — Carl Sagan

</div>
