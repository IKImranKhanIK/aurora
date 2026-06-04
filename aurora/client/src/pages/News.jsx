import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSpaceNews } from "../utils/nasaApi";
import LoadingSpinner from "../components/LoadingSpinner";

export default function News() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [query, setQuery] = useState("");
  const LIMIT = 20;

  const fetchNews = async (off = 0) => {
    setLoading(true);
    try {
      const r = await getSpaceNews(LIMIT, off);
      setArticles(r.data.results || []);
      setTotal(r.data.count || 0);
      setOffset(off);
    } catch {
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNews(0); }, []);

  const filtered = query
    ? articles.filter(a =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.summary?.toLowerCase().includes(query.toLowerCase())
      )
    : articles;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-space text-3xl font-bold text-white mb-1">
            📰 <span className="text-space-gold">Space News</span>
          </h1>
          <p className="text-slate-400 text-sm">Latest from the cosmos · Spaceflight News API</p>
        </div>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Filter articles..."
          className="bg-space-dark border border-white/10 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-space-gold/50 placeholder-slate-600"
        />
      </div>

      {loading ? (
        <LoadingSpinner text="FETCHING LATEST NEWS..." />
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-5">
            {filtered.map((art, i) => (
              <motion.a
                key={art.id}
                href={art.url}
                target="_blank"
                rel="noreferrer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card overflow-hidden flex flex-col hover:border-space-gold/30 hover:bg-white/[0.06] transition-all duration-300 group block"
              >
                {art.image_url && (
                  <div className="relative overflow-hidden" style={{ height: 180 }}>
                    <img
                      src={art.image_url}
                      alt={art.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-space-gold/20 border border-space-gold/40 text-space-gold text-xs px-2 py-0.5 rounded-full">
                      {art.news_site}
                    </div>
                  </div>
                )}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-medium text-white text-sm leading-snug mb-2 line-clamp-2 group-hover:text-space-gold transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed line-clamp-3 flex-1">{art.summary}</p>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                    <span className="text-slate-500 text-xs">
                      {new Date(art.published_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric"
                      })}
                    </span>
                    <span className="text-space-gold text-xs">Read more →</span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Pagination */}
          {!query && (
            <div className="flex justify-center gap-4 mt-8">
              {offset > 0 && (
                <button
                  onClick={() => fetchNews(offset - LIMIT)}
                  className="px-6 py-2 border border-white/20 rounded-lg text-slate-400 hover:text-white transition-all"
                >
                  ← Previous
                </button>
              )}
              {offset + LIMIT < total && (
                <button
                  onClick={() => fetchNews(offset + LIMIT)}
                  className="px-6 py-2 border border-space-gold/30 rounded-lg text-space-gold hover:bg-space-gold/10 transition-all"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
