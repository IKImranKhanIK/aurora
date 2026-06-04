import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getDONKI } from "../utils/nasaApi";
import LoadingSpinner from "../components/LoadingSpinner";

function getDateRange() {
  const end = new Date().toISOString().split("T")[0];
  const start = new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0];
  return { start, end };
}

const classColors = {
  X: "text-red-400 bg-red-500/20 border-red-500/30",
  M: "text-orange-400 bg-orange-500/20 border-orange-500/30",
  C: "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
  B: "text-green-400 bg-green-500/20 border-green-500/30",
};

export default function SpaceWeather() {
  const [flares, setFlares] = useState([]);
  const [cmes, setCmes] = useState([]);
  const [storms, setStorms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("flares");
  useEffect(() => {
    const { start, end } = getDateRange();
    Promise.all([
      getDONKI("FLR", start, end).then(r => setFlares(r.data || [])).catch(() => setFlares([])),
      getDONKI("CME", start, end).then(r => setCmes(r.data || [])).catch(() => setCmes([])),
      getDONKI("GST", start, end).then(r => setStorms(r.data || [])).catch(() => setStorms([])),
    ]).finally(() => setLoading(false));
  }, []);

  const tabs = [
    { id: "flares", label: "Solar Flares", icon: "🔥", count: flares.length },
    { id: "cmes", label: "CMEs", icon: "💨", count: cmes.length },
    { id: "storms", label: "Geomagnetic Storms", icon: "⚡", count: storms.length },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-space text-3xl font-bold text-white mb-1">
          🌦️ <span className="text-space-purple">Space Weather</span>
        </h1>
        <p className="text-slate-400 text-sm">Solar activity from the last 30 days · NASA DONKI</p>
      </div>

      <div className="flex gap-3 mb-8 flex-wrap">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all border ${
              tab === t.id
                ? "bg-space-purple/20 text-purple-300 border-purple-500/40"
                : "text-slate-400 border-white/10 hover:border-white/20"
            }`}
          >
            <span>{t.icon}</span>
            <span>{t.label}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${tab === t.id ? "bg-purple-500/30" : "bg-white/10"}`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="READING SOLAR DATA..." />
      ) : (
        <div className="space-y-3">
          {tab === "flares" && (
            flares.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-400">No solar flares recorded in the last 30 days.</div>
            ) : (
              [...flares].reverse().map((f, i) => {
                const cls = f.classType?.[0] || "C";
                return (
                  <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                    className="glass-card p-4 flex items-center gap-4">
                    <span className={`font-space font-black text-xl px-3 py-1 rounded-lg border ${classColors[cls] || classColors.C}`}>
                      {f.classType || "C"}
                    </span>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{f.beginTime?.slice(0, 10)} at {f.beginTime?.slice(11, 16)} UTC</p>
                      <p className="text-slate-400 text-xs">Peak: {f.peakTime?.slice(11, 16)} · End: {f.endTime?.slice(11, 16) || "ongoing"}</p>
                      <p className="text-slate-500 text-xs mt-0.5">Source: {f.sourceLocation || "Unknown"}</p>
                    </div>
                    <div className="text-right">
                      <a href={f.link} target="_blank" rel="noreferrer"
                        className="text-space-cyan text-xs hover:underline">Details →</a>
                    </div>
                  </motion.div>
                );
              })
            )
          )}

          {tab === "cmes" && (
            cmes.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-400">No CMEs recorded in the last 30 days.</div>
            ) : (
              [...cmes].reverse().map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="glass-card p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-white font-medium text-sm">💨 {c.startTime?.slice(0, 10)} at {c.startTime?.slice(11, 16)} UTC</p>
                      <p className="text-slate-400 text-xs mt-1">{c.note || "Coronal Mass Ejection detected"}</p>
                    </div>
                    <a href={c.link} target="_blank" rel="noreferrer"
                      className="text-space-cyan text-xs hover:underline whitespace-nowrap">Details →</a>
                  </div>
                  {c.cmeAnalyses?.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                      <div className="bg-white/5 rounded-lg p-2">
                        <div className="text-space-gold font-space text-sm font-bold">
                          {c.cmeAnalyses[0].speed} km/s
                        </div>
                        <div className="text-slate-500 text-xs">Speed</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2">
                        <div className="text-space-cyan font-space text-sm font-bold">
                          {c.cmeAnalyses[0].type || "—"}
                        </div>
                        <div className="text-slate-500 text-xs">Type</div>
                      </div>
                      <div className="bg-white/5 rounded-lg p-2">
                        <div className="text-slate-300 font-space text-sm font-bold">
                          {c.cmeAnalyses[0].halfAngle}°
                        </div>
                        <div className="text-slate-500 text-xs">Half angle</div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))
            )
          )}

          {tab === "storms" && (
            storms.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-400">No geomagnetic storms in the last 30 days. Clear skies! ✨</div>
            ) : (
              [...storms].reverse().map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  className="glass-card p-4 border-purple-500/20">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">⚡ Storm began {s.startTime?.slice(0, 10)}</p>
                      {s.allKpIndex?.length > 0 && (
                        <div className="flex gap-2 mt-2 flex-wrap">
                          {s.allKpIndex.map((kp, j) => (
                            <span key={j} className={`text-xs px-2 py-0.5 rounded-full font-space ${
                              kp.kpIndex >= 7 ? "bg-red-500/20 text-red-400" :
                              kp.kpIndex >= 5 ? "bg-orange-500/20 text-orange-400" :
                              "bg-yellow-500/20 text-yellow-400"
                            }`}>
                              Kp{kp.kpIndex} · {kp.observedTime?.slice(11, 16)}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <a href={s.link} target="_blank" rel="noreferrer"
                      className="text-space-cyan text-xs hover:underline">Details →</a>
                  </div>
                </motion.div>
              ))
            )
          )}
        </div>
      )}
    </div>
  );
}
