import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getEPIC, getEONET, epicImageUrl } from "../utils/nasaApi";
import LoadingSpinner from "../components/LoadingSpinner";

const categoryIcons = {
  Wildfires: "🔥",
  Volcanoes: "🌋",
  "Sea and Lake Ice": "🧊",
  Severe_Storms: "🌪️",
  Drought: "🌵",
  Floods: "🌊",
  Earthquakes: "🌍",
  "Snow (Heavy)": "❄️",
};

export default function Earth() {
  const [epicImages, setEpicImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("epic");
  const [selectedImg, setSelectedImg] = useState(null);

  useEffect(() => {
    getEPIC()
      .then(r => setEpicImages((r.data || []).slice(0, 12)))
      .catch(() => setEpicImages([]))
      .finally(() => setLoading(false));
    getEONET()
      .then(r => setEvents(r.data.events || []))
      .catch(() => setEvents([]));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-space text-3xl font-bold text-white mb-1">
          🌍 <span className="text-space-green">Earth</span>
        </h1>
        <p className="text-slate-400 text-sm">Our home from space</p>
      </div>

      <div className="flex gap-3 mb-8">
        <button
          onClick={() => setTab("epic")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
            tab === "epic"
              ? "bg-green-500/20 text-green-400 border-green-500/40"
              : "text-slate-400 border-white/10 hover:border-white/20"
          }`}
        >
          📸 EPIC Camera
        </button>
        <button
          onClick={() => setTab("events")}
          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
            tab === "events"
              ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
              : "text-slate-400 border-white/10 hover:border-white/20"
          }`}
        >
          🌐 Natural Events ({events.length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="ACQUIRING EARTH DATA..." />
      ) : tab === "epic" ? (
        <>
          <p className="text-slate-500 text-sm mb-4">
            Images captured by NASA's EPIC camera aboard the DSCOVR spacecraft, 1.5M km from Earth.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {epicImages.map((img, i) => {
              const url = epicImageUrl(img.date.split(" ")[0], img.image);
              return (
                <motion.div
                  key={img.identifier}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative group cursor-pointer aspect-square overflow-hidden rounded-xl border border-white/10 hover:border-green-400/40 transition-all"
                  onClick={() => setSelectedImg({ url, img })}
                >
                  <img
                    src={url}
                    alt={`Earth ${img.date}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-white text-xs">{img.date}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Lightbox */}
          {selectedImg && (
            <div
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedImg(null)}
            >
              <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
                <img src={selectedImg.url} alt="Earth" className="w-full rounded-xl" />
                <div className="mt-4 text-center">
                  <p className="text-white font-space text-lg">Earth from DSCOVR/EPIC</p>
                  <p className="text-slate-400 text-sm mt-1">{selectedImg.img.date}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    Lat: {selectedImg.img.centroid_coordinates.lat.toFixed(2)}° ·
                    Lon: {selectedImg.img.centroid_coordinates.lon.toFixed(2)}°
                  </p>
                </div>
                <button
                  onClick={() => setSelectedImg(null)}
                  className="mt-4 w-full py-2 border border-white/20 rounded-lg text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-3">
          {events.map((ev, i) => {
            const cat = ev.categories?.[0]?.title || "Event";
            const icon = categoryIcons[cat] || "🌐";
            const lastDate = ev.geometry?.[ev.geometry.length - 1]?.date?.slice(0, 10) || "Unknown";
            return (
              <motion.div
                key={ev.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass-card p-4 flex items-start gap-4"
              >
                <span className="text-2xl">{icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium text-white text-sm">{ev.title}</h3>
                    <span className="text-xs bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
                      {cat}
                    </span>
                  </div>
                  <p className="text-slate-500 text-xs mt-1">Last update: {lastDate}</p>
                </div>
                <a
                  href={ev.sources?.[0]?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-space-cyan text-xs hover:underline whitespace-nowrap"
                >
                  Source →
                </a>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
