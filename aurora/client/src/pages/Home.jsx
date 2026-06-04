import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAPOD, getAsteroids, getISSPosition } from "../utils/nasaApi";

const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

const features = [
  { to: "/apod", icon: "🌅", title: "APOD", desc: "Astronomy Picture of the Day" },
  { to: "/asteroids", icon: "☄️", title: "Asteroids", desc: "Near-Earth Object tracker" },
  { to: "/space-weather", icon: "🌦️", title: "Space Weather", desc: "Solar flares & geomagnetic storms" },
  { to: "/earth", icon: "🌍", title: "Earth", desc: "EPIC imagery & natural events" },
  { to: "/iss", icon: "🛸", title: "ISS Tracker", desc: "Live International Space Station" },
  { to: "/gallery", icon: "🔭", title: "NASA Gallery", desc: "Search millions of NASA images" },
  { to: "/news", icon: "📰", title: "Space News", desc: "Latest space & astronomy news" },
  { to: "/launches", icon: "🚀", title: "Launches", desc: "Upcoming rocket launches" },
];

export default function Home() {
  const [apod, setApod] = useState(null);
  const [asteroidCount, setAsteroidCount] = useState(null);
  const [issPos, setIssPos] = useState(null);

  useEffect(() => {
    // Fire all requests independently — page renders immediately,
    // each stat fills in as its own response arrives
    getAPOD().then(r => setApod(r.data)).catch(() => {});
    getAsteroids(yesterday, today)
      .then(r => setAsteroidCount(r.data.element_count))
      .catch(() => {});
    getISSPosition()
      .then(r => setIssPos({ latitude: r.data.latitude, longitude: r.data.longitude }))
      .catch(() => {});

    const issInterval = setInterval(() => {
      getISSPosition()
        .then(r => setIssPos({ latitude: r.data.latitude, longitude: r.data.longitude }))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(issInterval);
  }, []);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="relative px-4 py-16 text-center overflow-hidden">
        <div className="absolute inset-0 bg-cyan-glow opacity-30 pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 max-w-4xl mx-auto"
        >
          <h1 className="font-space text-5xl md:text-7xl font-black text-white mb-4 tracking-wider">
            <span className="text-space-cyan cyan-glow-text">AURORA</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl mb-2 max-w-2xl mx-auto">
            Your gateway to the cosmos — powered by NASA's open APIs
          </p>
          <p className="text-slate-500 text-sm mb-8">Real-time data from space</p>

          {/* Live stats — each fills in independently */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 max-w-2xl mx-auto">
            <div className="glass-card p-4 border-space-cyan/20">
              <div className="text-2xl font-space font-bold text-space-cyan">
                {asteroidCount !== null
                  ? asteroidCount
                  : <span className="inline-block w-8 h-6 bg-white/10 rounded animate-pulse" />}
              </div>
              <div className="text-xs text-slate-400 mt-1">Near-Earth objects today</div>
            </div>
            <div className="glass-card p-4 border-space-cyan/20">
              <div className="text-sm font-space font-bold text-space-green">
                {issPos
                  ? `${parseFloat(issPos.latitude).toFixed(2)}° ${parseFloat(issPos.longitude).toFixed(2)}°`
                  : <span className="inline-block w-24 h-5 bg-white/10 rounded animate-pulse" />}
              </div>
              <div className="text-xs text-slate-400 mt-1">ISS position (live)</div>
            </div>
            <div className="glass-card p-4 border-space-cyan/20">
              <div className="text-2xl">🛰️</div>
              <div className="text-xs text-slate-400 mt-1">Tracking in real time</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Feature grid — always visible immediately */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="font-space text-2xl font-bold text-white mb-6 text-center">
          <span className="text-space-purple">EXPLORE</span> THE UNIVERSE
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <Link
                to={f.to}
                className="glass-card p-5 flex flex-col items-center text-center hover:border-space-cyan/30 hover:bg-white/[0.06] transition-all duration-300 group block"
              >
                <span className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </span>
                <h3 className="font-space font-bold text-sm text-white mb-1">{f.title}</h3>
                <p className="text-slate-500 text-xs">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Today's APOD — fades in when ready */}
      {apod && (
        <section className="max-w-6xl mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="glass-card overflow-hidden"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative overflow-hidden" style={{ minHeight: 300 }}>
                {apod.media_type === "image" ? (
                  <img
                    src={apod.url}
                    alt={apod.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    style={{ minHeight: 300 }}
                  />
                ) : (
                  <iframe
                    src={apod.url}
                    title={apod.title}
                    className="w-full h-full"
                    style={{ minHeight: 300 }}
                    allowFullScreen
                  />
                )}
                <div className="absolute top-3 left-3 bg-space-cyan/20 border border-space-cyan/40 text-space-cyan text-xs font-space px-3 py-1 rounded-full">
                  APOD · {apod.date}
                </div>
              </div>
              <div className="p-6 flex flex-col justify-between">
                <div>
                  <h2 className="font-space text-xl font-bold text-white mb-3">{apod.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-6">{apod.explanation}</p>
                </div>
                <Link
                  to="/apod"
                  className="mt-4 inline-flex items-center gap-2 text-space-cyan text-sm hover:underline"
                >
                  Explore APOD archive →
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      )}
    </div>
  );
}
