import React, { useState } from "react";
import { motion } from "framer-motion";
import { getNASAImages } from "../utils/nasaApi";
import LoadingSpinner from "../components/LoadingSpinner";

const presets = ["nebula", "black hole", "galaxy", "mars", "moon", "saturn", "Jupiter", "apollo", "supernova", "earth from space"];

export default function Gallery() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const [searched, setSearched] = useState(false);
  const [currentQuery, setCurrentQuery] = useState("");

  const search = async (q, p = 1) => {
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    setCurrentQuery(q);
    try {
      const r = await getNASAImages(q, p);
      const items = r.data.collection.items.filter(i => i.links?.[0]?.href);
      setResults(items);
      setPage(p);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-space text-3xl font-bold text-white mb-1">
          🔭 <span className="text-space-purple">NASA Gallery</span>
        </h1>
        <p className="text-slate-400 text-sm">Search millions of NASA images and videos</p>
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && search(query)}
          placeholder="Search NASA's image library..."
          className="flex-1 bg-space-dark border border-space-cyan/30 text-white rounded-xl px-5 py-3 focus:outline-none focus:border-space-cyan placeholder-slate-600"
        />
        <button
          onClick={() => search(query)}
          className="px-6 py-3 bg-space-cyan/20 border border-space-cyan/40 text-space-cyan rounded-xl font-medium hover:bg-space-cyan/30 transition-all"
        >
          Search
        </button>
      </div>

      {/* Preset tags */}
      <div className="flex flex-wrap gap-2 mb-8">
        {presets.map(p => (
          <button
            key={p}
            onClick={() => { setQuery(p); search(p); }}
            className="px-3 py-1.5 text-xs rounded-full border border-white/10 text-slate-400 hover:border-space-cyan/30 hover:text-space-cyan transition-all capitalize"
          >
            {p}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="SEARCHING NASA ARCHIVES..." />
      ) : searched && results.length === 0 ? (
        <div className="glass-card p-8 text-center text-slate-400">No results found for "{currentQuery}".</div>
      ) : (
        <>
          {results.length > 0 && (
            <p className="text-slate-500 text-sm mb-4">
              Showing {results.length} results for "<span className="text-white">{currentQuery}</span>"
            </p>
          )}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((item, i) => {
              const meta = item.data[0];
              const thumb = item.links[0].href;
              return (
                <motion.div
                  key={meta.nasa_id || i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer border border-white/5 hover:border-space-cyan/30 transition-all"
                  onClick={() => setSelected({ thumb, meta })}
                >
                  <img
                    src={thumb}
                    alt={meta.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-white text-xs font-medium line-clamp-2">{meta.title}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Pagination */}
          {results.length > 0 && (
            <div className="flex justify-center gap-4 mt-8">
              {page > 1 && (
                <button
                  onClick={() => search(currentQuery, page - 1)}
                  className="px-6 py-2 border border-white/20 rounded-lg text-slate-400 hover:text-white hover:border-white/40 transition-all"
                >
                  ← Previous
                </button>
              )}
              <button
                onClick={() => search(currentQuery, page + 1)}
                className="px-6 py-2 border border-space-cyan/30 rounded-lg text-space-cyan hover:bg-space-cyan/10 transition-all"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelected(null)}
        >
          <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <img src={selected.thumb} alt={selected.meta.title} className="w-full rounded-xl max-h-[60vh] object-contain bg-black" />
            <div className="mt-4 glass-card p-5">
              <h3 className="font-space font-bold text-white text-lg mb-2">{selected.meta.title}</h3>
              {selected.meta.date_created && (
                <p className="text-space-cyan text-xs mb-3">{selected.meta.date_created.slice(0, 10)}</p>
              )}
              <p className="text-slate-400 text-sm leading-relaxed line-clamp-5">{selected.meta.description}</p>
              {selected.meta.photographer && (
                <p className="text-slate-500 text-xs mt-2">Photo: {selected.meta.photographer}</p>
              )}
            </div>
            <button
              onClick={() => setSelected(null)}
              className="mt-4 w-full py-3 border border-white/20 rounded-xl text-slate-400 hover:text-white transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
