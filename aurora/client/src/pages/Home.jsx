import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAPOD, getAsteroids, getISSPosition } from "../utils/nasaApi";

const today = new Date().toISOString().split("T")[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

const features = [
  { to: "/apod",          icon: "🌅", title: "APOD",          desc: "Astronomy Picture of the Day",       color: "from-amber-500/20 to-orange-600/10",  border: "border-amber-500/25"  },
  { to: "/asteroids",     icon: "☄️", title: "Asteroids",     desc: "Near-Earth Object tracker",           color: "from-red-500/20 to-rose-600/10",      border: "border-red-500/25"    },
  { to: "/space-weather", icon: "🌦️", title: "Space Weather", desc: "Solar flares & geomagnetic storms",  color: "from-sky-500/20 to-blue-600/10",      border: "border-sky-500/25"    },
  { to: "/earth",         icon: "🌍", title: "Earth",         desc: "EPIC imagery & natural events",       color: "from-emerald-500/20 to-green-600/10", border: "border-emerald-500/25"},
  { to: "/iss",           icon: "🛸", title: "ISS Tracker",   desc: "Live International Space Station",   color: "from-cyan-500/20 to-teal-600/10",     border: "border-cyan-500/25"   },
  { to: "/gallery",       icon: "🔭", title: "Gallery",       desc: "Search millions of NASA images",     color: "from-violet-500/20 to-purple-600/10", border: "border-violet-500/25" },
  { to: "/news",          icon: "📰", title: "Space News",    desc: "Latest space & astronomy news",      color: "from-yellow-500/20 to-amber-600/10",  border: "border-yellow-500/25" },
  { to: "/launches",      icon: "🚀", title: "Launches",      desc: "Upcoming rocket launches",            color: "from-pink-500/20 to-rose-600/10",     border: "border-pink-500/25"   },
];

function StatCard({ value, label, color = "text-space-cyan", loading }) {
  return (
    <div className="glow-card p-5 text-center flex flex-col items-center justify-center gap-1">
      <div className={`text-2xl font-space font-bold ${color} min-h-[2rem] flex items-center`}>
        {loading
          ? <span className="skeleton inline-block w-12 h-7" />
          : value}
      </div>
      <div className="text-xs text-slate-400">{label}</div>
    </div>
  );
}

export default function Home() {
  const [apod, setApod] = useState(null);
  const [asteroidCount, setAsteroidCount] = useState(null);
  const [issPos, setIssPos] = useState(null);

  useEffect(() => {
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
    <div className="min-h-screen pt-20 relative">

      {/* Nebula background accents */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.08) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)" }} />
      </div>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative px-4 pt-16 pb-10 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-space-cyan/10 border border-space-cyan/25 text-space-cyan text-xs font-space px-4 py-1.5 rounded-full mb-6"
          >
            <span className="w-1.5 h-1.5 bg-space-cyan rounded-full animate-pulse" />
            LIVE NASA DATA
          </motion.div>

          <h1 className="font-space text-6xl md:text-8xl font-black text-white mb-4 tracking-wider leading-none">
            <span className="text-space-cyan cyan-glow-text">AURORA</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl mb-2 max-w-2xl mx-auto font-light">
            Your gateway to the cosmos — powered by NASA's open APIs
          </p>
          <p className="text-slate-500 text-sm mb-10">Real-time data from space, delivered to your screen</p>

          {/* Live stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-4">
            <StatCard
              value={asteroidCount}
              label="Near-Earth objects today"
              color="text-space-cyan"
              loading={asteroidCount === null}
            />
            <StatCard
              value={issPos ? `${parseFloat(issPos.latitude).toFixed(2)}° ${parseFloat(issPos.longitude).toFixed(2)}°` : null}
              label="ISS position (live)"
              color="text-emerald-400"
              loading={issPos === null}
            />
            <StatCard
              value="27,600 km/h"
              label="Orbital speed"
              color="text-space-purple"
              loading={false}
            />
          </div>
        </motion.div>
      </section>

      {/* ── Feature grid ─────────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-12">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-space text-lg font-bold text-slate-400 mb-5 text-center uppercase tracking-widest"
        >
          Explore the Universe
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f, i) => (
            <motion.div
              key={f.to}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i + 0.2 }}
            >
              <Link
                to={f.to}
                className={`group block rounded-2xl p-5 bg-gradient-to-br ${f.color} border ${f.border}
                  backdrop-blur-md transition-all duration-300
                  hover:scale-[1.04] hover:shadow-lg hover:shadow-black/40
                  flex flex-col items-center text-center`}
              >
                <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 block">
                  {f.icon}
                </span>
                <h3 className="font-space font-bold text-sm text-white mb-1">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Today's APOD ─────────────────────────────────── */}
      {apod && (
        <section className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-space text-lg font-bold text-slate-400 mb-5 text-center uppercase tracking-widest"
          >
            Today's Astronomy Picture
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card overflow-hidden"
            style={{ border: "1px solid rgba(0,212,255,0.15)", boxShadow: "0 0 40px rgba(0,212,255,0.06)" }}
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
                {apod.media_type === "image" ? (
                  <img
                    src={apod.url}
                    alt={apod.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                    style={{ minHeight: 320 }}
                  />
                ) : (
                  <iframe
                    src={apod.url}
                    title={apod.title}
                    className="w-full h-full"
                    style={{ minHeight: 320 }}
                    allowFullScreen
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
                <div className="absolute top-3 left-3 bg-space-cyan/20 border border-space-cyan/40 text-space-cyan text-xs font-space px-3 py-1 rounded-full backdrop-blur-sm">
                  APOD · {apod.date}
                </div>
              </div>
              <div className="p-7 flex flex-col justify-between bg-gradient-to-br from-white/[0.02] to-transparent">
                <div>
                  <h2 className="font-space text-xl font-bold text-white mb-3 leading-snug">{apod.title}</h2>
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-6">{apod.explanation}</p>
                </div>
                <Link
                  to="/apod"
                  className="mt-5 inline-flex items-center gap-2 text-space-cyan text-sm font-medium hover:gap-3 transition-all"
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
