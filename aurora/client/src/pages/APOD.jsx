import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getAPOD, getAPODRange } from "../utils/nasaApi";
import { getCached, setCached, getFavourites, toggleFavourite, isFavourite } from "../utils/cache";
import LoadingSpinner from "../components/LoadingSpinner";

// Use local date to avoid UTC-offset "tomorrow" bug
function localToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function formatDate(d) {
  return new Date(d + "T12:00:00").toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

export default function APODPage() {
  const today = localToday();
  const [apod, setApod] = useState(null);
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(today);
  const [archiveLoading, setArchiveLoading] = useState(false);
  const [fav, setFav] = useState(false);
  const [favs, setFavs] = useState([]);
  const [showFavs, setShowFavs] = useState(false);
  const [shared, setShared] = useState(false);

  // Fetch selected APOD with caching
  useEffect(() => {
    setLoading(true);
    const cacheKey = `apod_${selectedDate}`;
    const cached = getCached(cacheKey);
    if (cached) {
      setApod(cached);
      setFav(isFavourite(cached.date));
      setLoading(false);
      return;
    }
    getAPOD(selectedDate)
      .then(r => {
        setApod(r.data);
        setCached(cacheKey, r.data);
        setFav(isFavourite(r.data.date));
      })
      .catch(() => setApod(null))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  // Fetch recent archive with caching
  useEffect(() => {
    setArchiveLoading(true);
    const cached = getCached("apod_archive");
    if (cached) { setArchive(cached); setArchiveLoading(false); return; }
    const end = new Date();
    const start = new Date(end - 13 * 86400000);
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    getAPODRange(startStr, endStr)
      .then(r => {
        const sorted = [...r.data].reverse();
        setArchive(sorted);
        setCached("apod_archive", sorted);
      })
      .catch(() => setArchive([]))
      .finally(() => setArchiveLoading(false));
  }, []);

  // Reload favs when toggling
  const refreshFavs = useCallback(() => setFavs(getFavourites()), []);
  useEffect(() => { refreshFavs(); }, [refreshFavs]);

  const handleFav = () => {
    if (!apod) return;
    const added = toggleFavourite(apod);
    setFav(added);
    refreshFavs();
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/apod?date=${apod?.date}`;
    const text = `${apod?.title} — NASA Astronomy Picture of the Day`;
    if (navigator.share) {
      try { await navigator.share({ title: text, url }); return; } catch {}
    }
    await navigator.clipboard.writeText(url).catch(() => {});
    setShared(true);
    setTimeout(() => setShared(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-space text-3xl font-bold text-white">
            🌅 <span className="text-space-cyan">APOD</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Astronomy Picture of the Day</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowFavs(!showFavs)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm border transition-all ${
              showFavs
                ? "bg-space-gold/20 text-space-gold border-space-gold/40"
                : "text-slate-400 border-white/10 hover:border-white/20"
            }`}
          >
            ⭐ Favourites {favs.length > 0 && `(${favs.length})`}
          </button>
          <label className="text-slate-400 text-sm">Select date:</label>
          <input
            type="date"
            max={today}
            min="1995-06-16"
            value={selectedDate}
            onChange={e => { setSelectedDate(e.target.value); setShowFavs(false); }}
            className="bg-space-dark border border-space-cyan/30 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-space-cyan"
          />
        </div>
      </div>

      {/* Favourites panel */}
      <AnimatePresence>
        {showFavs && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-8"
          >
            <div className="glass-card p-5">
              <h3 className="font-space font-bold text-white text-sm mb-4">⭐ Your Favourites</h3>
              {favs.length === 0 ? (
                <p className="text-slate-500 text-sm">No favourites yet. Click the star on any APOD to save it.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                  {favs.map(f => (
                    <button
                      key={f.date}
                      onClick={() => { setSelectedDate(f.date); setShowFavs(false); }}
                      className="group relative overflow-hidden rounded-xl aspect-square border border-white/10 hover:border-space-gold/50 transition-all"
                    >
                      {f.media_type === "image"
                        ? <img src={f.url} alt={f.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        : <div className="w-full h-full bg-space-navy flex items-center justify-center text-2xl">🎬</div>
                      }
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                        <p className="text-white text-xs line-clamp-2">{f.title}</p>
                      </div>
                      <div className="absolute top-1 right-1 text-xs bg-black/70 text-space-gold px-1.5 py-0.5 rounded font-space">{f.date.slice(5)}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main APOD */}
      {loading ? (
        <LoadingSpinner text="FETCHING TODAY'S PICTURE..." />
      ) : apod ? (
        <motion.div key={apod.date} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="glass-card overflow-hidden mb-10"
          style={{ border: "1px solid rgba(0,212,255,0.12)", boxShadow: "0 0 40px rgba(0,212,255,0.05)" }}
        >
          {/* Media */}
          <div className="relative">
            {apod.media_type === "image" ? (
              <img
                src={apod.hdurl || apod.url}
                alt={apod.title}
                className="w-full max-h-[70vh] object-contain bg-black"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <iframe src={apod.url} title={apod.title} className="w-full" style={{ height: "60vh" }} allowFullScreen />
            )}
            {/* Overlay badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-space-cyan/20 border border-space-cyan/40 text-space-cyan text-xs font-space px-3 py-1 rounded-full backdrop-blur-sm">
                {formatDate(apod.date)}
              </span>
              {apod.copyright && (
                <span className="bg-black/60 text-slate-300 text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                  © {apod.copyright.trim()}
                </span>
              )}
            </div>
            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleFav}
                title={fav ? "Remove from favourites" : "Add to favourites"}
                className={`w-9 h-9 rounded-full backdrop-blur-sm border flex items-center justify-center text-base transition-all ${
                  fav
                    ? "bg-space-gold/30 border-space-gold/60 text-space-gold"
                    : "bg-black/50 border-white/20 text-slate-400 hover:text-space-gold hover:border-space-gold/40"
                }`}
              >
                {fav ? "★" : "☆"}
              </button>
              <button
                onClick={handleShare}
                title="Share"
                className="w-9 h-9 rounded-full backdrop-blur-sm bg-black/50 border border-white/20 text-slate-400 hover:text-space-cyan hover:border-space-cyan/40 flex items-center justify-center text-sm transition-all"
              >
                {shared ? "✓" : "↗"}
              </button>
            </div>
          </div>

          {/* Text */}
          <div className="p-6 md:p-8">
            <h2 className="font-space text-2xl font-bold text-white mb-4">{apod.title}</h2>
            <p className="text-slate-300 leading-relaxed">{apod.explanation}</p>
            {apod.hdurl && apod.media_type === "image" && (
              <a
                href={apod.hdurl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 mt-5 text-space-cyan text-sm hover:underline"
              >
                View full HD image ↗
              </a>
            )}
          </div>
        </motion.div>
      ) : (
        <div className="glass-card p-12 text-center mb-10">
          <div className="text-5xl mb-4">🌌</div>
          <p className="text-white font-space font-bold mb-2">No picture for this date</p>
          <p className="text-slate-500 text-sm">Try a different date — APOD started on June 16, 1995.</p>
          <button onClick={() => setSelectedDate(today)} className="mt-4 text-space-cyan text-sm hover:underline">
            Back to today →
          </button>
        </div>
      )}

      {/* Archive strip */}
      <h2 className="font-space text-lg font-bold text-white mb-4 uppercase tracking-wider">Recent Pictures</h2>
      {archiveLoading ? (
        <div className="flex gap-3">
          {Array.from({length: 7}).map((_,i) => (
            <div key={i} className="skeleton rounded-xl aspect-square flex-1" style={{minHeight:80}} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-14 gap-2">
          {archive.map(item => (
            <button
              key={item.date}
              onClick={() => setSelectedDate(item.date)}
              className={`group relative overflow-hidden rounded-xl aspect-square cursor-pointer border-2 transition-all ${
                selectedDate === item.date
                  ? "border-space-cyan shadow-[0_0_12px_rgba(0,212,255,0.4)]"
                  : "border-transparent hover:border-space-cyan/40"
              }`}
            >
              {item.media_type === "image" ? (
                <img src={item.url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" loading="lazy" />
              ) : (
                <div className="w-full h-full bg-space-navy flex items-center justify-center text-xl">🎬</div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-1.5">
                <p className="text-white text-xs line-clamp-2 leading-tight">{item.title}</p>
              </div>
              <div className="absolute top-1 right-1 bg-black/70 text-space-cyan text-xs px-1 py-0.5 rounded font-space text-[10px]">
                {item.date.slice(5)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
