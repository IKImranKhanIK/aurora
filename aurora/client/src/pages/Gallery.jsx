import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getNASAImages } from "../utils/nasaApi";
import LoadingSpinner from "../components/LoadingSpinner";

const PRESETS = [
  { label: "Nebula",         q: "nebula"          },
  { label: "Black Hole",     q: "black hole"      },
  { label: "Galaxy",         q: "galaxy"          },
  { label: "Mars",           q: "mars surface"    },
  { label: "Moon",           q: "moon"            },
  { label: "Saturn",         q: "saturn rings"    },
  { label: "Jupiter",        q: "jupiter"         },
  { label: "Apollo",         q: "apollo mission"  },
  { label: "Supernova",      q: "supernova"       },
  { label: "James Webb",     q: "james webb telescope" },
  { label: "Earth",          q: "earth from space" },
  { label: "Astronaut",      q: "astronaut spacewalk" },
];

export default function Gallery() {
  const [query, setQuery]             = useState("nebula");
  const [results, setResults]         = useState([]);
  const [loading, setLoading]         = useState(false);
  const [selected, setSelected]       = useState(null);
  const [page, setPage]               = useState(1);
  const [currentQuery, setCurrentQuery] = useState("nebula");
  const [activePreset, setActivePreset] = useState("nebula");

  const search = useCallback(async (q, p = 1) => {
    if (!q.trim()) return;
    setLoading(true);
    setCurrentQuery(q);
    setPage(p);
    try {
      const r = await getNASAImages(q, p);
      setResults(r.data.collection.items.filter(i => i.links?.[0]?.href));
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load default on mount
  useEffect(() => { search("nebula", 1); }, [search]);

  const handlePreset = (preset) => {
    setQuery(preset.q);
    setActivePreset(preset.q);
    search(preset.q, 1);
  };

  const handleSearch = () => {
    setActivePreset("");
    search(query, 1);
  };

  // Keyboard nav in lightbox
  useEffect(() => {
    if (!selected) return;
    const idx = results.findIndex(r => r === selected.item);
    const handler = (e) => {
      if (e.key === "Escape") setSelected(null);
      if (e.key === "ArrowRight" && idx < results.length - 1) {
        const next = results[idx + 1];
        setSelected({ item: next, meta: next.data[0], thumb: next.links[0].href });
      }
      if (e.key === "ArrowLeft" && idx > 0) {
        const prev = results[idx - 1];
        setSelected({ item: prev, meta: prev.data[0], thumb: prev.links[0].href });
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selected, results]);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-space text-3xl font-bold text-white mb-1">
          🔭 <span className="text-space-purple">NASA Gallery</span>
        </h1>
        <p className="text-slate-400 text-sm">Search millions of images from NASA's archive</p>
      </div>

      {/* Search bar */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSearch()}
          placeholder="Search NASA's image library..."
          className="flex-1 bg-space-dark border border-space-cyan/30 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-space-cyan placeholder-slate-600 text-sm"
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-space-cyan/20 border border-space-cyan/40 text-space-cyan rounded-xl font-medium hover:bg-space-cyan/30 transition-all text-sm"
        >
          Search
        </button>
      </div>

      {/* Preset tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {PRESETS.map(p => (
          <button
            key={p.q}
            onClick={() => handlePreset(p)}
            className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
              activePreset === p.q
                ? "bg-space-cyan/20 border-space-cyan/50 text-space-cyan"
                : "border-white/10 text-slate-400 hover:border-space-cyan/30 hover:text-space-cyan"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!loading && results.length > 0 && (
        <p className="text-slate-500 text-sm mb-4">
          {results.length} results for "<span className="text-slate-300">{currentQuery}</span>"
          {page > 1 && <span> · Page {page}</span>}
        </p>
      )}

      {loading ? (
        <LoadingSpinner text="SEARCHING NASA ARCHIVES..." />
      ) : results.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-5xl mb-4">🔭</div>
          <p className="text-white font-space font-bold mb-2">No results found</p>
          <p className="text-slate-500 text-sm">Try a different search term or pick one of the presets above.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {results.map((item, i) => {
              const meta  = item.data[0];
              const thumb = item.links[0].href;
              return (
                <motion.div
                  key={meta.nasa_id || i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: Math.min(i * 0.025, 0.4) }}
                  className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer border border-white/[0.06] hover:border-space-cyan/35 transition-all hover:shadow-[0_0_16px_rgba(0,212,255,0.1)]"
                  onClick={() => setSelected({ item, meta, thumb })}
                >
                  <img
                    src={thumb}
                    alt={meta.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <div>
                      <p className="text-white text-xs font-medium line-clamp-2 leading-tight">{meta.title}</p>
                      {meta.date_created && (
                        <p className="text-slate-400 text-[10px] mt-1">{meta.date_created.slice(0, 4)}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-4 mt-10">
            {page > 1 && (
              <button onClick={() => search(currentQuery, page - 1)}
                className="px-6 py-2.5 border border-white/15 rounded-xl text-slate-400 hover:text-white hover:border-white/30 transition-all text-sm">
                ← Previous
              </button>
            )}
            <button onClick={() => search(currentQuery, page + 1)}
              className="px-6 py-2.5 border border-space-cyan/30 rounded-xl text-space-cyan hover:bg-space-cyan/10 transition-all text-sm">
              Next →
            </button>
          </div>
        </>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="max-w-3xl w-full"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={selected.thumb}
                alt={selected.meta.title}
                className="w-full rounded-xl max-h-[60vh] object-contain bg-black"
              />
              <div className="mt-4 glass-card p-5" style={{ border: "1px solid rgba(0,212,255,0.12)" }}>
                <h3 className="font-space font-bold text-white text-lg mb-2 leading-snug">{selected.meta.title}</h3>
                <div className="flex items-center gap-3 mb-3">
                  {selected.meta.date_created && (
                    <span className="text-space-cyan text-xs bg-space-cyan/10 border border-space-cyan/25 px-2.5 py-1 rounded-full">
                      {selected.meta.date_created.slice(0, 10)}
                    </span>
                  )}
                  {selected.meta.center && (
                    <span className="text-slate-400 text-xs">NASA {selected.meta.center}</span>
                  )}
                </div>
                {selected.meta.description && (
                  <p className="text-slate-400 text-sm leading-relaxed line-clamp-5">{selected.meta.description}</p>
                )}
                {selected.meta.photographer && (
                  <p className="text-slate-500 text-xs mt-3">📷 {selected.meta.photographer}</p>
                )}
              </div>
              <div className="flex gap-3 mt-3">
                <a href={selected.thumb} target="_blank" rel="noreferrer"
                  className="flex-1 py-2.5 border border-space-cyan/30 rounded-xl text-space-cyan text-sm text-center hover:bg-space-cyan/10 transition-all">
                  Open full size ↗
                </a>
                <button onClick={() => setSelected(null)}
                  className="flex-1 py-2.5 border border-white/15 rounded-xl text-slate-400 hover:text-white text-sm transition-all">
                  Close
                </button>
              </div>
              <p className="text-center text-slate-600 text-xs mt-3">← → arrow keys to navigate</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
