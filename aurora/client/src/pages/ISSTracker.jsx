import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { getISSPosition, getISSCrew } from "../utils/nasaApi";

export default function ISSTracker() {
  const [pos, setPos] = useState(null);
  const [crew, setCrew] = useState([]);
  const [trail, setTrail] = useState([]);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const leafletMapRef = useRef(null);
  const markerRef = useRef(null);
  const polylineRef = useRef(null);

  useEffect(() => {
    getISSCrew().then(r => setCrew(r.data.people || [])).catch(() => setCrew([]));

    const fetchPos = () => {
      getISSPosition().then(r => {
        const lat = parseFloat(r.data.latitude);
        const lng = parseFloat(r.data.longitude);
        setPos({ lat, lng });
        setTrail(prev => [...prev, [lat, lng]].slice(-60));
      }).catch(() => {});
    };

    fetchPos();
    const interval = setInterval(fetchPos, 5000);
    return () => clearInterval(interval);
  }, []);

  // Initialize Leaflet map
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;
    setMapReady(false);
    import("leaflet").then(L => {
      const map = L.map(mapRef.current, {
        center: [0, 0],
        zoom: 2,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        attribution: "CartoDB",
        maxZoom: 18,
      }).addTo(map);

      const issIcon = L.divIcon({
        html: '<div style="font-size:28px;filter:drop-shadow(0 0 8px cyan)">🛸</div>',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        className: "",
      });

      markerRef.current = L.marker([0, 0], { icon: issIcon }).addTo(map);
      polylineRef.current = L.polyline([], { color: "#00d4ff", weight: 2, opacity: 0.6 }).addTo(map);
      leafletMapRef.current = map;
      setMapReady(true);
    });

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [mapRef]);

  // Update marker position
  useEffect(() => {
    if (!pos || !leafletMapRef.current || !markerRef.current) return;
    markerRef.current.setLatLng([pos.lat, pos.lng]);
    if (polylineRef.current && trail.length > 1) {
      polylineRef.current.setLatLngs(trail);
    }
    leafletMapRef.current.panTo([pos.lat, pos.lng], { animate: true, duration: 1 });
  }, [pos, trail]);

  const issOnNightSide = pos && (pos.lng > 90 || pos.lng < -90);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="font-space text-3xl font-bold text-white mb-1">
          🛸 <span className="text-space-cyan">ISS Tracker</span>
        </h1>
        <p className="text-slate-400 text-sm">Live position of the International Space Station</p>
      </div>

      {/* Live coords — show placeholder cards until first pos arrives */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="glass-card p-4 text-center">
          <div className="font-space text-xl font-bold text-space-cyan min-h-[1.75rem] flex items-center justify-center">
            {pos ? `${pos.lat.toFixed(4)}°` : "—"}
          </div>
          <div className="text-slate-500 text-xs mt-1">Latitude</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="font-space text-xl font-bold text-space-cyan min-h-[1.75rem] flex items-center justify-center">
            {pos ? `${pos.lng.toFixed(4)}°` : "—"}
          </div>
          <div className="text-slate-500 text-xs mt-1">Longitude</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="font-space text-xl font-bold text-space-gold">~408 km</div>
          <div className="text-slate-500 text-xs mt-1">Altitude</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="font-space text-xl font-bold text-space-green">27,600 km/h</div>
          <div className="text-slate-500 text-xs mt-1">Orbital speed</div>
        </div>
      </div>

      {/* Map */}
      <div className="glass-card overflow-hidden mb-6 relative" style={{ height: 400 }}>
        {!mapReady && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-space-dark/80">
            <p className="text-slate-400 text-sm font-space animate-pulse">LOADING MAP...</p>
          </div>
        )}
        <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      </div>

      {/* Crew */}
      <div>
        <h2 className="font-space text-xl font-bold text-white mb-4">
          👨‍🚀 Current Crew ({crew.filter(c => c.craft === "ISS").length} aboard ISS)
        </h2>
        {crew.length === 0 ? (
          <div className="glass-card p-6 text-center text-slate-500 text-sm">Loading crew data...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {crew.filter(c => c.craft === "ISS").map((person, i) => (
              <motion.div
                key={person.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-space-cyan/20 border border-space-cyan/30 flex items-center justify-center text-lg">
                  👨‍🚀
                </div>
                <div>
                  <p className="text-white font-medium text-sm">{person.name}</p>
                  <p className="text-slate-500 text-xs">{person.craft}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        {crew.filter(c => c.craft !== "ISS").length > 0 && (
          <div className="mt-4">
            <h3 className="text-slate-400 text-sm mb-2">Other spacecraft:</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {crew.filter(c => c.craft !== "ISS").map((person) => (
                <div key={person.name} className="glass-card p-3 flex items-center gap-2">
                  <span>🚀</span>
                  <div>
                    <p className="text-white text-sm">{person.name}</p>
                    <p className="text-slate-500 text-xs">{person.craft}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2 text-slate-500 text-xs">
        <div className="w-2 h-2 bg-space-cyan rounded-full animate-pulse" />
        Updates every 5 seconds · wheretheiss.at
      </div>
    </div>
  );
}
