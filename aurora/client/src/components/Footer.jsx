import React from "react";
import { Link } from "react-router-dom";

const links = [
  { to: "/apod",          label: "APOD"          },
  { to: "/asteroids",     label: "Asteroids"     },
  { to: "/space-weather", label: "Space Weather" },
  { to: "/earth",         label: "Earth"         },
  { to: "/iss",           label: "ISS Tracker"   },
  { to: "/gallery",       label: "Gallery"       },
  { to: "/news",          label: "News"          },
  { to: "/launches",      label: "Launches"      },
];

const apis = [
  { label: "NASA Open APIs",        href: "https://api.nasa.gov" },
  { label: "wheretheiss.at",        href: "https://wheretheiss.at" },
  { label: "Spaceflight News",      href: "https://spaceflightnewsapi.net" },
  { label: "Launch Library 2",      href: "https://thespacedevs.com" },
];

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] mt-16 bg-[#030712]/60 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-space-cyan/15 border border-space-cyan/30 flex items-center justify-center">
                🌌
              </div>
              <span className="font-space font-black text-lg text-space-cyan cyan-glow-text tracking-widest">
                AURORA
              </span>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Your gateway to the cosmos. Real-time data from NASA's open APIs, delivered to your screen.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-white font-space font-bold text-sm mb-4 tracking-wider uppercase">Explore</h3>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4">
              {links.map(l => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-slate-500 text-sm hover:text-space-cyan transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Data sources */}
          <div>
            <h3 className="text-white font-space font-bold text-sm mb-4 tracking-wider uppercase">Data Sources</h3>
            <ul className="space-y-2">
              {apis.map(a => (
                <li key={a.href}>
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-500 text-sm hover:text-space-cyan transition-colors"
                  >
                    {a.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.05] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-600 text-xs">
            Built with React 18 · Deployed on Vercel · Data from NASA Open APIs
          </p>
          <p className="text-slate-600 text-xs">
            Aurora is not affiliated with NASA
          </p>
        </div>
      </div>
    </footer>
  );
}
