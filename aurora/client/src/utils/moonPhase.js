// Known new moon: Jan 6, 2000. Synodic period: 29.53059 days.
const KNOWN_NEW_MOON = new Date("2000-01-06T18:14:00Z").getTime();
const CYCLE = 29.53059 * 24 * 60 * 60 * 1000;

const PHASES = [
  { name: "New Moon",        emoji: "🌑", min: 0,     max: 0.0625 },
  { name: "Waxing Crescent", emoji: "🌒", min: 0.0625, max: 0.25   },
  { name: "First Quarter",   emoji: "🌓", min: 0.25,   max: 0.3125 },
  { name: "Waxing Gibbous",  emoji: "🌔", min: 0.3125, max: 0.5    },
  { name: "Full Moon",       emoji: "🌕", min: 0.5,    max: 0.5625 },
  { name: "Waning Gibbous",  emoji: "🌖", min: 0.5625, max: 0.75   },
  { name: "Last Quarter",    emoji: "🌗", min: 0.75,   max: 0.8125 },
  { name: "Waning Crescent", emoji: "🌘", min: 0.8125, max: 1      },
];

export function getMoonPhase(date = new Date()) {
  const elapsed = (date.getTime() - KNOWN_NEW_MOON + CYCLE * 1000) % CYCLE;
  const fraction = elapsed / CYCLE; // 0–1 through the cycle
  const phase = PHASES.find(p => fraction >= p.min && fraction < p.max) || PHASES[0];
  const illumination = Math.round(
    fraction <= 0.5
      ? fraction * 2 * 100
      : (1 - fraction) * 2 * 100
  );
  return { ...phase, fraction, illumination };
}
