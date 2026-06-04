/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        space: {
          black: "#030712",
          dark: "#0a0f1e",
          navy: "#0d1b2a",
          blue: "#1a2744",
          cyan: "#00d4ff",
          purple: "#7c3aed",
          gold: "#f59e0b",
          red: "#ef4444",
          green: "#10b981",
        },
      },
      fontFamily: {
        space: ["Orbitron", "monospace"],
        body: ["Inter", "sans-serif"],
      },
      animation: {
        twinkle: "twinkle 3s infinite",
        pulse_slow: "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        orbit: "orbit 20s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.2 },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "space-gradient": "linear-gradient(135deg, #030712 0%, #0a0f1e 50%, #0d1b2a 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
        "cyan-glow": "radial-gradient(ellipse at center, rgba(0,212,255,0.15) 0%, transparent 70%)",
        "purple-glow": "radial-gradient(ellipse at center, rgba(124,58,237,0.15) 0%, transparent 70%)",
      },
      boxShadow: {
        "cyan-glow": "0 0 20px rgba(0,212,255,0.3), 0 0 60px rgba(0,212,255,0.1)",
        "purple-glow": "0 0 20px rgba(124,58,237,0.3), 0 0 60px rgba(124,58,237,0.1)",
        "gold-glow": "0 0 20px rgba(245,158,11,0.3)",
        glass: "0 8px 32px rgba(0,0,0,0.4)",
      },
    },
  },
  plugins: [],
};
