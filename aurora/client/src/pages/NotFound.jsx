import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className="text-8xl mb-6 float">🛸</div>
        <h1 className="font-space text-6xl font-black text-space-cyan cyan-glow-text mb-2">404</h1>
        <h2 className="font-space text-xl font-bold text-white mb-4">Lost in Space</h2>
        <p className="text-slate-400 text-sm max-w-xs mx-auto mb-8 leading-relaxed">
          This page drifted out of orbit. It doesn't exist, or got sucked into a black hole.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-space-cyan/15 border border-space-cyan/35 text-space-cyan px-6 py-3 rounded-xl font-space font-bold text-sm hover:bg-space-cyan/25 transition-all"
        >
          ← Return to Mission Control
        </Link>
      </motion.div>
    </div>
  );
}
