import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Home", icon: "🏠" },
  { to: "/apod", label: "APOD", icon: "🌅" },
  { to: "/asteroids", label: "Asteroids", icon: "☄️" },
  { to: "/space-weather", label: "Space Weather", icon: "🌦️" },
  { to: "/earth", label: "Earth", icon: "🌍" },
  { to: "/iss", label: "ISS Tracker", icon: "🛸" },
  { to: "/gallery", label: "Gallery", icon: "🔭" },
  { to: "/news", label: "News", icon: "📰" },
  { to: "/launches", label: "Launches", icon: "🚀" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-space-dark/95 backdrop-blur-md border-b border-space-cyan/20 shadow-cyan-glow"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2 group">
          <span className="text-2xl">🌌</span>
          <span
            className="font-space font-bold text-xl text-space-cyan cyan-glow-text tracking-widest"
          >
            AURORA
          </span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-space-cyan/20 text-space-cyan border border-space-cyan/30"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`
              }
              end={l.to === "/"}
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-slate-400 hover:text-white p-2"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <div className="space-y-1.5">
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-6 h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-space-dark/98 backdrop-blur-md border-t border-space-cyan/20 px-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `p-2 rounded-lg text-xs font-medium text-center transition-all ${
                    isActive
                      ? "bg-space-cyan/20 text-space-cyan border border-space-cyan/30"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`
                }
                end={l.to === "/"}
              >
                <div className="text-lg">{l.icon}</div>
                <div>{l.label}</div>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
