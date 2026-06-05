const PREFIX = "aurora_";
const TTL = 5 * 60 * 1000; // 5 minutes default

export function getCached(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const { data, ts } = JSON.parse(raw);
    if (Date.now() - ts < TTL) return data;
    localStorage.removeItem(PREFIX + key);
  } catch {}
  return null;
}

export function setCached(key, data) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ data, ts: Date.now() }));
  } catch {}
}

// APOD favourites stored separately with no expiry
export function getFavourites() {
  try { return JSON.parse(localStorage.getItem(PREFIX + "favs") || "[]"); }
  catch { return []; }
}

export function toggleFavourite(apod) {
  const favs = getFavourites();
  const idx = favs.findIndex(f => f.date === apod.date);
  if (idx >= 0) favs.splice(idx, 1);
  else favs.unshift(apod);
  try { localStorage.setItem(PREFIX + "favs", JSON.stringify(favs)); } catch {}
  return idx < 0; // true = added
}

export function isFavourite(date) {
  return getFavourites().some(f => f.date === date);
}
