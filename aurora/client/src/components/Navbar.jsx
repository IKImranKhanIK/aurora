import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/",              label: "Home",          icon: "🏠" },
  { to: "/apod",          label: "APOD",          icon: "🌅" },
  { to: "/asteroids",     label: "Asteroids",     icon: "☄️" },
  { to: "/space-weather", label: "Space Weather", icon: "🌦️" },
  { to: "/earth",         label: "Earth",         icon: "🌍" },
  { to: "/iss",           label: "ISS Tracker",   icon: "🛸" },
  { to: "/gallery",       label: "Gallery",       icon: "🔭" },
  { to: "/news",          label: "News",          icon: "📰" },
  { to: "/launches",      label: "Launches",      icon: "🚀" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#030712]/90 backdrop-blur-xl border-b border-white/[0.07] shadow-[0_1px_30px_rgba(0,212,255,0.07)]"
          : "bg-[#030712]/70 backdrop-blur-md border-b border-white/[0.04]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-8 h-8 rounded-lg bg-space-cyan/15 border border-space-cyan/30 flex items-center justify-center text-base">
            🌌
          </div>
          <span className="font-space font-black text-lg text-space-cyan cyan-glow-text tracking-widest">
            AURORA
          </span>
        </NavLink>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-0.5">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-space-cyan/15 text-space-cyan border border-space-cyan/30 shadow-[0_0_12px_rgba(0,212,255,0.15)]"
                    : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                }`
              }
            >
              <span className="text-sm">{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 space-y-[5px]">
            <span className={`block h-[2px] bg-current rounded transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block h-[2px] bg-current rounded transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-[2px] bg-current rounded transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#030712]/98 backdrop-blur-xl border-t border-white/[0.06] px-4 py-4">
          <div className="grid grid-cols-3 gap-2">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `p-3 rounded-xl text-xs font-medium text-center transition-all duration-200 ${
                    isActive
                      ? "bg-space-cyan/15 text-space-cyan border border-space-cyan/30"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
                  }`
                }
              >
                <div className="text-xl mb-1">{l.icon}</div>
                <div>{l.label}</div>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
