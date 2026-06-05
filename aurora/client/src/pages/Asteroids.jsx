import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAsteroids } from "../utils/nasaApi";
import LoadingSpinner from "../components/LoadingSpinner";

function kmToMiles(km) { return (km * 0.621371).toFixed(0); }

function sizeComparison(km) {
  const m = km * 1000;
  if (m < 1)    return `🪨 grain of sand (${(m * 100).toFixed(0)} cm)`;
  if (m < 5)    return `🚗 car-sized (${m.toFixed(1)} m)`;
  if (m < 20)   return `🏠 house-sized (${m.toFixed(0)} m)`;
  if (m < 100)  return `⚽ football field (${m.toFixed(0)} m)`;
  if (m < 500)  return `🏙️ city block (${m.toFixed(0)} m)`;
  if (km < 2)   return `🌆 small city (${km.toFixed(1)} km)`;
  if (km < 10)  return `🏙️ major city (${km.toFixed(1)} km)`;
  return `🌍 country-sized (${km.toFixed(0)} km)`;
}
function formatDist(d) {
  const km = parseFloat(d.kilometers).toFixed(0);
  return `${parseInt(km).toLocaleString()} km`;
}

export default function Asteroids() {
  const [asteroids, setAsteroids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0];
    getAsteroids(weekAgo, today)
      .then(r => {
        const all = Object.values(r.data.near_earth_objects).flat();
        all.sort((a, b) =>
          parseFloat(a.close_approach_data[0].miss_distance.kilometers) -
          parseFloat(b.close_approach_data[0].miss_distance.kilometers)
        );
        setAsteroids(all);
      })
      .catch(() => setAsteroids([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "hazardous"
    ? asteroids.filter(a => a.is_potentially_hazardous_asteroid)
    : asteroids;

  const hazardCount = asteroids.filter(a => a.is_potentially_hazardous_asteroid).length;

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="font-space text-3xl font-bold text-white mb-1">
          ☄️ <span className="text-space-gold">Asteroid Watch</span>
        </h1>
        <p className="text-slate-400 text-sm">Near-Earth objects tracked in the last 7 days</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="glass-card p-4 text-center">
          <div className="font-space text-3xl font-bold text-white">{asteroids.length}</div>
          <div className="text-slate-400 text-xs mt-1">Total tracked</div>
        </div>
        <div className="glass-card p-4 text-center border-red-500/30">
          <div className="font-space text-3xl font-bold text-red-400">{hazardCount}</div>
          <div className="text-slate-400 text-xs mt-1">Potentially hazardous</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="font-space text-3xl font-bold text-space-cyan">
            {asteroids.length > 0
              ? formatDist(asteroids[0].close_approach_data[0].miss_distance)
              : "—"}
          </div>
          <div className="text-slate-400 text-xs mt-1">Closest approach</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-3 mb-6">
        {["all", "hazardous"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? "bg-space-cyan/20 text-space-cyan border border-space-cyan/40"
                : "text-slate-400 border border-white/10 hover:border-white/20"
            }`}
          >
            {f === "all" ? "All Objects" : "⚠️ Hazardous Only"}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="SCANNING NEAR-EARTH SPACE..." />
      ) : (
        <div className="space-y-3">
          {filtered.map((ast, i) => {
            const approach = ast.close_approach_data[0];
            const sizeKm = (
              (ast.estimated_diameter.kilometers.estimated_diameter_min +
                ast.estimated_diameter.kilometers.estimated_diameter_max) / 2
            ).toFixed(3);
            const isHazardous = ast.is_potentially_hazardous_asteroid;

            return (
              <motion.div
                key={ast.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`glass-card p-4 flex flex-wrap md:flex-nowrap items-center gap-4 ${isHazardous ? "border-red-500/30 hazardous" : ""}`}
              >
                <div className="text-2xl">{isHazardous ? "⚠️" : "☄️"}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-space font-bold text-white text-sm truncate">{ast.name}</h3>
                    {isHazardous && (
                      <span className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full">
                        HAZARDOUS
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {approach.close_approach_date} · {approach.orbiting_body}
                  </p>
                </div>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-space-cyan font-space text-sm font-bold">
                      {formatDist(approach.miss_distance)}
                    </div>
                    <div className="text-slate-500 text-xs">Miss distance</div>
                  </div>
                  <div>
                    <div className="text-space-gold font-space text-sm font-bold">
                      {parseFloat(approach.relative_velocity.kilometers_per_hour).toFixed(0)} km/h
                    </div>
                    <div className="text-slate-500 text-xs">Velocity</div>
                  </div>
                  <div>
                    <div className="text-slate-300 font-space text-sm font-bold">{sizeKm} km</div>
                    <div className="text-slate-500 text-xs">Est. diameter</div>
                    <div className="text-slate-600 text-[10px] mt-0.5">{sizeComparison(parseFloat(sizeKm))}</div>
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
