# Aurora — Space Explorer

A space exploration web app powered by NASA's open APIs. Browse astronomy photos, track the ISS in real time, watch asteroids fly past Earth, and explore satellite imagery and space weather — all in one dark, animated interface.

---

## Live Deployment

| | |
|---|---|
| **Production URL** | https://aurora-imran-khans-projects-458b6e01.vercel.app |
| **Vercel Project** | `aurora` (team: `imran-khans-projects-458b6e01`) |
| **Build command** | `cd aurora/client && CI=false npm run build` |
| **Output directory** | `aurora/client/build` |

---

## Pages

| Page | Route | Description |
|------|-------|-------------|
| **Home** | `/` | Live APOD preview, real-time ISS coordinates, today's asteroid count — stats stream in as each API responds |
| **APOD** | `/apod` | Astronomy Picture of the Day — browse any date from the full NASA archive |
| **Asteroids** | `/asteroids` | Near-Earth object tracker with hazard ratings, miss distances, velocity, and size comparisons |
| **Space Weather** | `/space-weather` | Solar flares, CMEs, and geomagnetic storm data from NASA DONKI, with Recharts graphs |
| **Earth** | `/earth` | EPIC satellite imagery (true-colour Earth photos from DSCOVR) + EONET natural event feed |
| **ISS Tracker** | `/iss` | Live ISS position on a Leaflet map, updated every 5 seconds — no loading gate, map renders immediately |
| **Gallery** | `/gallery` | Search millions of NASA images and videos from the NASA Image & Video Library |
| **News** | `/news` | Latest space and astronomy articles from the Spaceflight News API |
| **Launches** | `/launches` | Upcoming rocket launches worldwide via Launch Library 2 |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 (Create React App) |
| Routing | React Router v6 (client-side SPA) |
| Styling | Tailwind CSS — dark glass-card space theme |
| Animation | Framer Motion — page transitions and element animations |
| HTTP | Axios |
| Maps | Leaflet + react-leaflet (ISS Tracker) |
| Charts | Recharts (Space Weather graphs) |
| Background | Canvas-based animated starfield (`StarField.jsx`) |
| Caching | In-memory API response cache (`src/utils/cache.js`) |
| Deployment | Vercel with SPA rewrites |

---

## APIs Used

| API | Endpoint | Data |
|-----|----------|------|
| [NASA APOD](https://api.nasa.gov/) | `api.nasa.gov/planetary/apod` | Astronomy Picture of the Day |
| [NASA NeoWs](https://api.nasa.gov/) | `api.nasa.gov/neo/rest/v1/feed` | Near-Earth asteroid feed |
| [NASA DONKI](https://api.nasa.gov/) | `api.nasa.gov/DONKI/...` | Solar flares, CMEs, geomagnetic storms |
| [NASA EPIC](https://api.nasa.gov/) | `api.nasa.gov/EPIC/api/natural` | Earth polychromatic imagery |
| [NASA EONET](https://eonet.gsfc.nasa.gov/) | `eonet.gsfc.nasa.gov/api/v3/events` | Natural events (wildfires, storms, etc.) |
| [NASA Image Library](https://images.nasa.gov/) | `images-api.nasa.gov/search` | NASA photo & video search |
| [wheretheiss.at](https://wheretheiss.at/) | `api.wheretheiss.at/v1/satellites/25544` | Live ISS position (replaced deprecated open-notify) |
| [Spaceflight News API](https://spaceflightnewsapi.net/) | `api.spaceflightnewsapi.net/v4/articles` | Space news articles |
| [Launch Library 2](https://thespacedevs.com/) | `ll.thespacedevs.com/2.2.0/launch/upcoming` | Upcoming rocket launches |

All NASA endpoints require a free API key from [api.nasa.gov](https://api.nasa.gov/).

---

## Project Structure

```
aurora/
├── client/                         # React app (everything the user sees)
│   ├── public/
│   └── src/
│       ├── App.js                  # Route definitions (React Router v6)
│       ├── pages/
│       │   ├── Home.jsx            # Streaming stats home — each API loads independently
│       │   ├── APOD.jsx            # Date picker + image/video display
│       │   ├── Asteroids.jsx       # NeoWs feed with hazard badges + size comparisons
│       │   ├── SpaceWeather.jsx    # DONKI events with Recharts graphs
│       │   ├── Earth.jsx           # EPIC imagery + EONET events (independent fetches)
│       │   ├── ISSTracker.jsx      # Leaflet map, 5s poll, no loading gate
│       │   ├── Gallery.jsx         # NASA image search with lazy-loaded grid
│       │   ├── News.jsx            # Spaceflight News article feed
│       │   ├── Launches.jsx        # Launch Library upcoming launch cards
│       │   └── NotFound.jsx        # 404 page
│       ├── components/
│       │   ├── Navbar.jsx          # Top navigation bar
│       │   ├── NavTabs.js          # Tab navigation component
│       │   ├── Footer.jsx          # Site footer with attribution
│       │   ├── LoadingSpinner.jsx  # Reusable spinner
│       │   └── StarField.jsx       # Animated canvas starfield background
│       └── utils/
│           ├── nasaApi.js          # Axios wrappers for all NASA endpoints
│           ├── cache.js            # In-memory API response caching
│           └── moonPhase.js        # Moon phase calculation utility
└── server.js                       # Minimal Express server (not used in production)
vercel.json                         # Build config + SPA rewrites
```

---

## Key Implementation Notes

### SPA Routing on Vercel
React Router handles all routing client-side. `vercel.json` rewrites all routes to `index.html` so direct URL navigation works:

```json
{
  "buildCommand": "cd aurora/client && CI=false npm run build",
  "outputDirectory": "aurora/client/build",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### ISS Tracker — No Loading Gate
The map renders immediately with a default position. The ISS marker appears as soon as the first API response arrives, then polls `wheretheiss.at` every 5 seconds. The page never blocks on a loading spinner.

### Home Page — Streaming Stats
Each API (APOD, ISS, NeoWs) fetches independently. Stats fill in as they arrive — the page is never blank waiting for the slowest request.

### Earth Page — Independent Fetches
EPIC imagery and EONET events fetch in parallel (`Promise.all`), so a slow EONET response doesn't delay the satellite images.

### Asteroids — Size Comparisons
Each asteroid's diameter is shown alongside a real-world size reference (bus, football field, etc.) for intuitive scale.

### API Response Caching
`src/utils/cache.js` caches responses in memory with a TTL to avoid hammering the NASA rate limit during development and repeated page visits.

### Static Asset Caching
`vercel.json` sets `Cache-Control: max-age=31536000` on static assets for fast repeat loads.

---

## Local Development

```bash
cd aurora/client
npm install
```

Create `.env` in `aurora/client/`:

```env
REACT_APP_NASA_API_KEY=your_nasa_api_key
```

Get a free key at [api.nasa.gov](https://api.nasa.gov/) (instant, no approval needed).

```bash
npm start
```

Opens at [http://localhost:3000](http://localhost:3000).

---

## Design System

Dark glass-card space aesthetic:

| Element | Style |
|---------|-------|
| Background | Deep space black (`#0a0a0f`) with animated canvas starfield |
| Cards | Dark glass with subtle border and backdrop blur |
| Accents | Nebula purples, cosmic blues, warm orange-reds for hazard indicators |
| Typography | Clean sans-serif, generous letter-spacing for headings |
| Animations | Framer Motion page transitions + element entrance animations |
