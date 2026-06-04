import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getLaunches } from "../utils/nasaApi";
import LoadingSpinner from "../components/LoadingSpinner";

function timeUntil(dateStr) {
  const diff = new Date(dateStr) - new Date();
  if (diff < 0) return "Launched";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `T-${d}d ${h}h`;
  if (h > 0) return `T-${h}h ${m}m`;
  return `T-${m}m`;
}

const statusColors = {
  "Go for Launch": "text-green-400 bg-green-500/20 border-green-500/30",
  "To Be Determined": "text-yellow-400 bg-yellow-500/20 border-yellow-500/30",
  "To Be Confirmed": "text-orange-400 bg-orange-500/20 border-orange-500/30",
  "Launch Successful": "text-blue-400 bg-blue-500/20 border-blue-500/30",
};

export default function Launches() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getLaunches()
      .then(r => setLaunches(r.data.results || []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-space text-3xl font-bold text-white mb-1">
          🚀 <span className="text-space-red">Upcoming Launches</span>
        </h1>
        <p className="text-slate-400 text-sm">Next rocket launches worldwide · Launch Library 2</p>
      </div>

      {loading ? (
        <LoadingSpinner text="QUERYING LAUNCH MANIFEST..." />
      ) : error ? (
        <div className="glass-card p-8 text-center">
          <p className="text-slate-400 mb-2">Launch data temporarily unavailable</p>
          <p className="text-slate-500 text-sm">The Launch Library API has rate limits. Try again in a moment.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {launches.map((launch, i) => {
            const status = launch.status?.name || "TBD";
            const statusClass = statusColors[status] || statusColors["To Be Determined"];
            const timeStr = timeUntil(launch.net || launch.window_start);

            return (
              <motion.div
                key={launch.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card overflow-hidden"
              >
                <div className="grid md:grid-cols-3 gap-0">
                  {/* Image */}
                  <div className="relative overflow-hidden" style={{ minHeight: 160 }}>
                    <img
                      src={launch.image || "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/1200px-NASA_logo.svg.png"}
                      alt={launch.name}
                      className="w-full h-full object-cover"
                      style={{ minHeight: 160 }}
                      onError={e => { e.target.src = "https://via.placeholder.com/400x200?text=Launch"; }}
                    />
                    {/* Countdown */}
                    <div className="absolute bottom-3 left-3">
                      <div className="font-space font-black text-2xl text-white" style={{ textShadow: "0 0 15px rgba(0,212,255,0.8)" }}>
                        {timeStr}
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-5 md:col-span-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
                        <h3 className="font-space font-bold text-white text-base leading-tight">
                          {launch.name}
                        </h3>
                        <span className={`text-xs px-3 py-1 rounded-full border font-medium ${statusClass}`}>
                          {status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">
                        {launch.mission?.description || "Mission details pending."}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div>
                        <div className="text-slate-500 text-xs">Launch date</div>
                        <div className="text-white text-sm font-medium mt-0.5">
                          {launch.net
                            ? new Date(launch.net).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric"
                              })
                            : "TBD"}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs">Launch site</div>
                        <div className="text-white text-sm font-medium mt-0.5 truncate">
                          {launch.pad?.location?.name || "TBD"}
                        </div>
                      </div>
                      <div>
                        <div className="text-slate-500 text-xs">Launch provider</div>
                        <div className="text-white text-sm font-medium mt-0.5 truncate">
                          {launch.launch_service_provider?.name || "TBD"}
                        </div>
                      </div>
                    </div>
                    {launch.webcast_live && (
                      <div className="mt-3 flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-red-400 text-xs font-medium">LIVE NOW</span>
                        {launch.vid_urls?.[0] && (
                          <a href={launch.vid_urls[0].url} target="_blank" rel="noreferrer"
                            className="text-space-cyan text-xs hover:underline ml-2">Watch →</a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
