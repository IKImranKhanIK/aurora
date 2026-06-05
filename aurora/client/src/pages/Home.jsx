import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getAPOD, getAsteroids, getISSPosition } from "../utils/nasaApi";
import { getCached, setCached } from "../utils/cache";
import { getMoonPhase } from "../utils/moonPhase";

function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

const today    = localToday();
const yesterday = (() => { const d = new Date(); d.setDate(d.getDate()-1); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; })();

const features = [
  { to: "/apod",          icon: "🌅", title: "APOD",          desc: "Astronomy Picture of the Day",      color: "from-amber-500/20 to-orange-600/10",  border: "border-amber-500/25"  },
  { to: "/asteroids",     icon: "☄️", title: "Asteroids",     desc: "Near-Earth Object tracker",          color: "from-red-500/20 to-rose-600/10",      border: "border-red-500/25"    },
  { to: "/space-weather", icon: "🌦️", title: "Space Weather", desc: "Solar flares & geomagnetic storms", color: "from-sky-500/20 to-blue-600/10",      border: "border-sky-500/25"    },
  { to: "/earth",         icon: "🌍", title: "Earth",         desc: "EPIC imagery & natural events",      color: "from-emerald-500/20 to-green-600/10", border: "border-emerald-500/25"},
  { to: "/iss",           icon: "🛸", title: "ISS Tracker",   desc: "Live International Space Station",  color: "from-cyan-500/20 to-teal-600/10",     border: "border-cyan-500/25"   },
  { to: "/gallery",       icon: "🔭", title: "Gallery",       desc: "Search millions of NASA images",    color: "from-violet-500/20 to-purple-600/10", border: "border-violet-500/25" },
  { to: "/news",          icon: "📰", title: "Space News",    desc: "Latest space & astronomy news",     color: "from-yellow-500/20 to-amber-600/10",  border: "border-yellow-500/25" },
  { to: "/launches",      icon: "🚀", title: "Launches",      desc: "Upcoming rocket launches",           color: "from-pink-500/20 to-rose-600/10",     border: "border-pink-500/25"   },
];

function Skeleton({ w = "w-12", h = "h-7" }) {
  return <span className={`skeleton inline-block ${w} ${h}`} />;
}

export default function Home() {
  const [apod, setApod]               = useState(null);
  const [asteroidCount, setAsteroid]  = useState(null);
  const [issPos, setIssPos]           = useState(null);
  const moon                          = getMoonPhase();

  useEffect(() => {
    // APOD
    const cachedApod = getCached(`apod_${today}`);
    if (cachedApod) setApod(cachedApod);
    else getAPOD(today).then(r => { setApod(r.data); setCached(`apod_${today}`, r.data); }).catch(() => {});

    // Asteroids
    const cachedAst = getCached("home_asteroids");
    if (cachedAst !== null) setAsteroid(cachedAst);
    else getAsteroids(yesterday, today)
      .then(r => { const n = r.data.element_count; setAsteroid(n); setCached("home_asteroids", n); })
      .catch(() => setAsteroid("—"));

    // ISS
    getISSPosition()
      .then(r => setIssPos({ lat: r.data.latitude, lng: r.data.longitude }))
      .catch(() => {});

    const issInterval = setInterval(() => {
      getISSPosition()
        .then(r => setIssPos({ lat: r.data.latitude, lng: r.data.longitude }))
        .catch(() => {});
    }, 5000);
    return () => clearInterval(issInterval);
  }, []);

  return (
    <div className="min-h-screen pt-20 relative">
      {/* Nebula blobs */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.07) 0%, transparent 70%)" }} />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)" }} />
      </div>

      {/* ── Hero ─────────────────────────────────────── */}
      <section className="relative z-10 px-4 pt-16 pb-10 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9 }}
          className="max-w-4xl mx-auto">

          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-space-cyan/10 border border-space-cyan/25 text-space-cyan text-xs font-space px-4 py-1.5 rounded-full mb-6">
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

          {/* Stats grid — always 2 cols on mobile, 4 on md+ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-4">
            {/* Asteroid count */}
            <div className="glow-card p-4 text-center">
              <div className="text-xl font-space font-bold text-space-cyan min-h-[1.75rem] flex items-center justify-center">
                {asteroidCount === null ? <Skeleton /> : asteroidCount}
              </div>
              <div className="text-xs text-slate-400 mt-1">Asteroids today</div>
            </div>
            {/* ISS */}
            <div className="glow-card p-4 text-center">
              <div className="text-xs font-space font-bold text-emerald-400 min-h-[1.75rem] flex items-center justify-center">
                {issPos
                  ? `${parseFloat(issPos.lat).toFixed(1)}° ${parseFloat(issPos.lng).toFixed(1)}°`
                  : <Skeleton w="w-20" h="h-5" />}
              </div>
              <div className="text-xs text-slate-400 mt-1">ISS position</div>
            </div>
            {/* Moon phase */}
            <div className="glow-card p-4 text-center">
              <div className="text-xl font-space font-bold text-space-purple min-h-[1.75rem] flex items-center justify-center gap-1">
                <span>{moon.emoji}</span>
                <span className="text-sm">{moon.illumination}%</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">{moon.name}</div>
            </div>
            {/* Orbital speed */}
            <div className="glow-card p-4 text-center">
              <div className="text-sm font-space font-bold text-space-gold min-h-[1.75rem] flex items-center justify-center">
                27,600 km/h
              </div>
              <div className="text-xs text-slate-400 mt-1">ISS speed</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ── Feature grid ─────────────────────────────── */}
      <section className="relative z-10 max-w-6xl mx-auto px-4 pb-12">
        <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="font-space text-sm font-bold text-slate-500 mb-5 text-center uppercase tracking-widest">
          Explore the Universe
        </motion.h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {features.map((f, i) => (
            <motion.div key={f.to} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i + 0.2 }}>
              <Link to={f.to}
                className={`group block rounded-2xl p-5 bg-gradient-to-br ${f.color} border ${f.border}
                  backdrop-blur-md transition-all duration-300 hover:scale-[1.04] hover:shadow-lg hover:shadow-black/40
                  flex flex-col items-center text-center`}
              >
                <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300 block">{f.icon}</span>
                <h3 className="font-space font-bold text-sm text-white mb-1">{f.title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed">{f.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Today's APOD ─────────────────────────────── */}
      {apod && (
        <section className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
          <motion.h2 initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="font-space text-sm font-bold text-slate-500 mb-5 text-center uppercase tracking-widest">
            Today's Astronomy Picture
          </motion.h2>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            className="glass-card overflow-hidden"
            style={{ border: "1px solid rgba(0,212,255,0.15)", boxShadow: "0 0 40px rgba(0,212,255,0.06)" }}>
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative overflow-hidden" style={{ minHeight: 320 }}>
                {apod.media_type === "image" ? (
                  <img src={apod.url} alt={apod.title}
                    className="w-full h-full object-cover" loading="lazy" decoding="async" style={{ minHeight: 320 }} />
                ) : (
                  <iframe src={apod.url} title={apod.title} className="w-full h-full" style={{ minHeight: 320 }} allowFullScreen />
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
                <Link to="/apod"
                  className="mt-5 inline-flex items-center gap-2 text-space-cyan text-sm font-medium hover:gap-3 transition-all">
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
