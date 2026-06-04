import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAPOD, getAPODRange } from "../utils/nasaApi";
import LoadingSpinner from "../components/LoadingSpinner";

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function APODPage() {
  const today = new Date().toISOString().split("T")[0];
  const [apod, setApod] = useState(null);
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(today);
  const [archiveLoading, setArchiveLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getAPOD(selectedDate)
      .then(r => setApod(r.data))
      .catch(() => setApod(null))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  useEffect(() => {
    setArchiveLoading(true);
    const end = new Date();
    const start = new Date(end - 6 * 86400000);
    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];
    getAPODRange(startStr, endStr)
      .then(r => setArchive(r.data.reverse()))
      .catch(() => setArchive([]))
      .finally(() => setArchiveLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-space text-3xl font-bold text-white">
            🌅 <span className="text-space-cyan">APOD</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">Astronomy Picture of the Day</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-slate-400 text-sm">Select date:</label>
          <input
            type="date"
            max={today}
            min="1995-06-16"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
            className="bg-space-dark border border-space-cyan/30 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-space-cyan"
          />
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="FETCHING TODAY'S PICTURE..." />
      ) : apod ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card overflow-hidden mb-12">
          <div className="relative">
            {apod.media_type === "image" ? (
              <img
                src={apod.hdurl || apod.url}
                alt={apod.title}
                className="w-full max-h-[70vh] object-contain bg-black"
              />
            ) : (
              <iframe
                src={apod.url}
                title={apod.title}
                className="w-full"
                style={{ height: "60vh" }}
                allowFullScreen
              />
            )}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-space-cyan/20 border border-space-cyan/40 text-space-cyan text-xs font-space px-3 py-1 rounded-full">
                {apod.date}
              </span>
              {apod.copyright && (
                <span className="bg-black/50 text-slate-300 text-xs px-3 py-1 rounded-full">
                  © {apod.copyright.trim()}
                </span>
              )}
            </div>
          </div>
          <div className="p-6 md:p-8">
            <h2 className="font-space text-2xl font-bold text-white mb-4">{apod.title}</h2>
            <p className="text-slate-300 leading-relaxed">{apod.explanation}</p>
          </div>
        </motion.div>
      ) : (
        <div className="glass-card p-8 text-center text-slate-400">No data available for this date.</div>
      )}

      {/* Recent archive */}
      <h2 className="font-space text-xl font-bold text-white mb-4">Recent Pictures</h2>
      {archiveLoading ? (
        <LoadingSpinner text="LOADING ARCHIVE..." />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {archive.map(item => (
            <button
              key={item.date}
              onClick={() => setSelectedDate(item.date)}
              className={`group relative overflow-hidden rounded-xl aspect-square cursor-pointer border-2 transition-all ${
                selectedDate === item.date ? "border-space-cyan" : "border-transparent hover:border-space-cyan/40"
              }`}
            >
              {item.media_type === "image" ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-space-navy flex items-center justify-center text-2xl">🎬</div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <p className="text-white text-xs font-medium line-clamp-2">{item.title}</p>
              </div>
              <div className="absolute top-1 right-1 bg-black/70 text-space-cyan text-xs px-1.5 py-0.5 rounded font-space">
                {item.date.slice(5)}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
