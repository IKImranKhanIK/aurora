import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getDONKI } from "../utils/nasaApi";
import { getCached, setCached } from "../utils/cache";
import LoadingSpinner from "../components/LoadingSpinner";

function getDateRange() {
  const end = new Date();
  const start = new Date(end - 30 * 86400000);
  return {
    end: end.toISOString().split("T")[0],
    start: start.toISOString().split("T")[0],
  };
}

const classColors = {
  X: "text-red-400 bg-red-500/20 border-red-500/30",
  M: "text-orange-400 bg-orange-500/20 border-orange-500/30",
  C: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
  B: "text-green-400 bg-green-500/20 border-green-500/30",
};

function EmptyState({ msg }) {
  return (
    <div className="glass-card p-12 text-center">
      <div className="text-5xl mb-4">🌤️</div>
      <p className="text-white font-space font-bold mb-1">All Clear</p>
      <p className="text-slate-500 text-sm">{msg}</p>
    </div>
  );
}

export default function SpaceWeather() {
  const [flares, setFlares] = useState(null);
  const [cmes, setCmes] = useState(null);
  const [storms, setStorms] = useState(null);
  const [tab, setTab] = useState("flares");

  useEffect(() => {
    const { start, end } = getDateRange();

    const fetch1 = () => {
      const c = getCached("sw_flares");
      if (c) { setFlares(c); return; }
      getDONKI("FLR", start, end)
        .then(r => { const d = r.data || []; setFlares(d); setCached("sw_flares", d); })
        .catch(() => setFlares([]));
    };
    const fetch2 = () => {
      const c = getCached("sw_cmes");
      if (c) { setCmes(c); return; }
      getDONKI("CME", start, end)
        .then(r => { const d = r.data || []; setCmes(d); setCached("sw_cmes", d); })
        .catch(() => setCmes([]));
    };
    const fetch3 = () => {
      const c = getCached("sw_storms");
      if (c) { setStorms(c); return; }
      getDONKI("GST", start, end)
        .then(r => { const d = r.data || []; setStorms(d); setCached("sw_storms", d); })
        .catch(() => setStorms([]));
    };

    fetch1(); fetch2(); fetch3();
  }, []);

  const tabs = [
    { id: "flares", label: "Solar Flares",      icon: "🔥", count: flares?.length ?? "…" },
    { id: "cmes",   label: "CMEs",               icon: "💨", count: cmes?.length   ?? "…" },
    { id: "storms", label: "Geomagnetic Storms", icon: "⚡", count: storms?.length ?? "…" },
  ];

  const current = { flares, cmes, storms }[tab];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-space text-3xl font-bold text-white mb-1">
          🌦️ <span className="text-space-purple">Space Weather</span>
        </h1>
        <p className="text-slate-400 text-sm">Solar activity from the last 30 days · NASA DONKI</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              tab === t.id
                ? "bg-space-purple/20 text-purple-300 border-purple-500/40 shadow-[0_0_12px_rgba(124,58,237,0.2)]"
                : "text-slate-400 border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full font-space ${tab === t.id ? "bg-purple-500/30 text-purple-200" : "bg-white/10"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          {current === null ? (
            <LoadingSpinner text="READING SOLAR DATA..." />
          ) : current.length === 0 ? (
            <EmptyState msg={
              tab === "flares" ? "No solar flares recorded in the last 30 days." :
              tab === "cmes"   ? "No CMEs recorded in the last 30 days." :
              "No geomagnetic storms in the last 30 days. Clear skies! ✨"
            } />
          ) : (
            <div className="space-y-3">
              {tab === "flares" && [...current].reverse().map((f, i) => {
                const cls = f.classType?.[0] || "C";
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className="glass-card p-4 flex items-center gap-4 hover:border-white/15 transition-colors">
                    <span className={`font-space font-black text-xl px-3 py-1.5 rounded-lg border min-w-[3.5rem] text-center ${classColors[cls] || classColors.C}`}>
                      {f.classType || "C?"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm">{f.beginTime?.slice(0, 10)} at {f.beginTime?.slice(11, 16)} UTC</p>
                      <p className="text-slate-400 text-xs mt-0.5">Peak: {f.peakTime?.slice(11, 16)} · End: {f.endTime?.slice(11, 16) || "ongoing"} · {f.sourceLocation || "Unknown location"}</p>
                    </div>
                    {f.link && <a href={f.link} target="_blank" rel="noreferrer" className="text-space-cyan text-xs hover:underline shrink-0">Details →</a>}
                  </motion.div>
                );
              })}

              {tab === "cmes" && [...current].reverse().map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className="glass-card p-5">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="text-white font-medium text-sm">💨 {c.startTime?.slice(0, 10)} at {c.startTime?.slice(11, 16)} UTC</p>
                      <p className="text-slate-400 text-xs mt-1 leading-relaxed">{c.note || "Coronal Mass Ejection detected"}</p>
                    </div>
                    {c.link && <a href={c.link} target="_blank" rel="noreferrer" className="text-space-cyan text-xs hover:underline shrink-0">Details →</a>}
                  </div>
                  {c.cmeAnalyses?.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-white/[0.05] rounded-xl p-3">
                        <div className="text-space-gold font-space text-sm font-bold">{c.cmeAnalyses[0].speed} km/s</div>
                        <div className="text-slate-500 text-xs mt-0.5">Speed</div>
                      </div>
                      <div className="bg-white/[0.05] rounded-xl p-3">
                        <div className="text-space-cyan font-space text-sm font-bold">{c.cmeAnalyses[0].type || "—"}</div>
                        <div className="text-slate-500 text-xs mt-0.5">Type</div>
                      </div>
                      <div className="bg-white/[0.05] rounded-xl p-3">
                        <div className="text-slate-300 font-space text-sm font-bold">{c.cmeAnalyses[0].halfAngle}°</div>
                        <div className="text-slate-500 text-xs mt-0.5">Half angle</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}

              {tab === "storms" && [...current].reverse().map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                  className="glass-card p-5 border-purple-500/15">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm mb-2">⚡ Storm began {s.startTime?.slice(0, 10)}</p>
                      {s.allKpIndex?.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {s.allKpIndex.map((kp, j) => (
                            <span key={j} className={`text-xs px-2.5 py-1 rounded-full font-space ${
                              kp.kpIndex >= 7 ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                              kp.kpIndex >= 5 ? "bg-orange-500/20 text-orange-400 border border-orange-500/30" :
                              "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                            }`}>
                              Kp{kp.kpIndex} · {kp.observedTime?.slice(11, 16)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {s.link && <a href={s.link} target="_blank" rel="noreferrer" className="text-space-cyan text-xs hover:underline shrink-0">Details →</a>}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
