# 🌌 AURORA — Space Explorer

> Your gateway to the cosmos, powered by NASA's open APIs.

Live site → **[aurora-heroku.vercel.app](https://aurora-heroku.vercel.app)**

---

## Features

| Page | Description |
|------|-------------|
| 🏠 **Home** | Live APOD preview, real-time ISS coords & asteroid count |
| 🌅 **APOD** | Astronomy Picture of the Day archive — browse any date |
| ☄️ **Asteroids** | Near-Earth object tracker with hazard ratings & miss distances |
| 🌦️ **Space Weather** | Solar flares, CMEs & geomagnetic storm data via NASA DONKI |
| 🌍 **Earth** | EPIC satellite imagery + EONET natural event feed |
| 🛸 **ISS Tracker** | Live ISS position on an interactive map, updated every 5 s |
| 🔭 **Gallery** | Search millions of images from NASA's image library |
| 📰 **News** | Latest space & astronomy articles from Spaceflight News API |
| 🚀 **Launches** | Upcoming rocket launches via Launch Library 2 |

---

## Tech Stack

- **React 18** — code-split pages with `React.lazy` + `Suspense`
- **React Router v6** — client-side routing
- **Tailwind CSS** — custom space theme (dark glass-card aesthetic)
- **Framer Motion** — page & element animations
- **Axios** — API requests
- **Leaflet** — interactive ISS map
- **Recharts** — space weather charts

---

## APIs Used

| API | Data |
|-----|------|
| [NASA APOD](https://api.nasa.gov/) | Astronomy Picture of the Day |
| [NASA NeoWs](https://api.nasa.gov/) | Near-Earth asteroid feed |
| [NASA DONKI](https://api.nasa.gov/) | Space weather events |
| [NASA EPIC](https://api.nasa.gov/) | Earth polychromatic imaging |
| [NASA EONET](https://eonet.gsfc.nasa.gov/) | Natural events |
| [NASA Image Library](https://images.nasa.gov/) | Photo search |
| [wheretheiss.at](https://wheretheiss.at/) | Live ISS position |
| [Spaceflight News API](https://spaceflightnewsapi.net/) | Space news |
| [Launch Library 2](https://thespacedevs.com/) | Upcoming launches |

---

## Deployment

Deployed on **Vercel** with:
- SPA rewrites for React Router (direct URL navigation)
- Long-lived cache headers for static assets (`max-age=31536000`)
- Environment variable `REACT_APP_NASA_API_KEY` for NASA APIs

```json
{
  "buildCommand": "cd aurora/client && CI=false npm run build",
  "outputDirectory": "aurora/client/build"
}
```

---

## Local Development

```bash
cd aurora/client
npm install
echo "REACT_APP_NASA_API_KEY=your_key_here" > .env
npm start
```

Get a free NASA API key at [api.nasa.gov](https://api.nasa.gov/).
