import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getLaunches } from "../utils/nasaApi";
import { getCached, setCached } from "../utils/cache";
import LoadingSpinner from "../components/LoadingSpinner";

function useCountdown(dateStr) {
  const [display, setDisplay] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = new Date(dateStr) - new Date();
      if (diff <= 0) { setDisplay("Launched"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (d > 0) setDisplay(`T-${d}d ${h}h ${m}m`);
      else if (h > 0) setDisplay(`T-${h}h ${m}m ${s}s`);
      else setDisplay(`T-${m}m ${s}s`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [dateStr]);
  return display;
}

const STATUS_STYLE = {
  "Go for Launch":    "text-green-400  bg-green-500/15  border-green-500/30",
  "To Be Determined": "text-yellow-400 bg-yellow-500/15 border-yellow-500/30",
  "To Be Confirmed":  "text-orange-400 bg-orange-500/15 border-orange-500/30",
  "Launch Successful":"text-blue-400   bg-blue-500/15   border-blue-500/30",
  "Launch Failure":   "text-red-400    bg-red-500/15    border-red-500/30",
};

function LaunchCard({ launch, index }) {
  const status = launch.status?.name || "To Be Determined";
  const statusClass = STATUS_STYLE[status] || STATUS_STYLE["To Be Determined"];
  const dateStr = launch.net || launch.window_start;
  const countdown = useCountdown(dateStr);
  const isUpcoming = new Date(dateStr) > new Date();
  const isLive = launch.webcast_live;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      className={`glass-card overflow-hidden transition-all ${
        isLive ? "border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.15)]" :
        isUpcoming ? "border-space-cyan/15" : ""
      }`}
    >
      <div className="grid md:grid-cols-[280px_1fr] gap-0">
        {/* Image with countdown overlay */}
        <div className="relative overflow-hidden bg-space-navy" style={{ minHeight: 180 }}>
          <img
            src={launch.image || ""}
            alt={launch.name}
            className="w-full h-full object-cover opacity-80"
            style={{ minHeight: 180 }}
            onError={e => { e.target.style.display = "none"; }}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Live badge */}
          {isLive && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500/90 text-white text-xs font-space px-3 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              LIVE
            </div>
          )}

          {/* Countdown */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className={`font-space font-black text-xl ${
              countdown === "Launched" ? "text-slate-400" :
              isUpcoming && new Date(dateStr) - new Date() < 3600000 ? "text-red-400" :
              "text-white"
            }`}
              style={{ textShadow: "0 0 20px rgba(0,0,0,0.8)" }}
            >
              {countdown}
            </div>
            {dateStr && (
              <div className="text-slate-300 text-xs mt-0.5">
                {new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {" · "}
                {new Date(dateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZoneName: "short" })}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-start justify-between gap-2 flex-wrap mb-2">
              <h3 className="font-space font-bold text-white text-sm leading-snug flex-1">{launch.name}</h3>
              <span className={`text-xs px-3 py-1 rounded-full border font-medium shrink-0 ${statusClass}`}>
                {status}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
              {launch.mission?.description || "Mission details pending confirmation."}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Launch site",     value: launch.pad?.location?.name || "TBD" },
              { label: "Provider",        value: launch.launch_service_provider?.name || "TBD" },
              { label: "Mission orbit",   value: launch.mission?.orbit?.name || "TBD" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-slate-500 text-xs">{label}</div>
                <div className="text-white text-xs font-medium mt-0.5 truncate" title={value}>{value}</div>
              </div>
            ))}
          </div>

          {/* Watch link */}
          {(launch.vid_urls?.length > 0 || isLive) && (
            <div className="flex items-center gap-2">
              {isLive && <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
              {launch.vid_urls?.[0] && (
                <a href={launch.vid_urls[0].url} target="_blank" rel="noreferrer"
                  className={`text-xs font-medium hover:underline ${isLive ? "text-red-400" : "text-space-cyan"}`}>
                  {isLive ? "Watch live →" : "Watch webcast →"}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Launches() {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const cached = getCached("launches");
    if (cached) { setLaunches(cached); setLoading(false); return; }
    getLaunches()
      .then(r => {
        const data = r.data.results || [];
        setLaunches(data);
        setCached("launches", data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-space text-3xl font-bold text-white mb-1">
            🚀 <span className="text-space-red">Upcoming Launches</span>
          </h1>
          <p className="text-slate-400 text-sm">Next rocket launches worldwide · Launch Library 2</p>
        </div>
        {launches.length > 0 && (
          <div className="text-slate-500 text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-2">
            {launches.filter(l => new Date(l.net || l.window_start) > new Date()).length} upcoming
            {" · "}
            {launches.filter(l => l.webcast_live).length > 0 && (
              <span className="text-red-400">{launches.filter(l => l.webcast_live).length} LIVE now</span>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <LoadingSpinner text="QUERYING LAUNCH MANIFEST..." />
      ) : error ? (
        <div className="glass-card p-12 text-center">
          <div className="text-5xl mb-4">🚀</div>
          <p className="text-white font-space font-bold mb-2">Launch data unavailable</p>
          <p className="text-slate-500 text-sm">The Launch Library API has rate limits. Try again in a moment.</p>
        </div>
      ) : launches.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <div className="text-5xl mb-4">🔭</div>
          <p className="text-white font-space font-bold mb-2">No launches found</p>
          <p className="text-slate-500 text-sm">Check back soon for upcoming missions.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {launches.map((launch, i) => (
            <LaunchCard key={launch.id} launch={launch} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
