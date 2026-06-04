import axios from "axios";

const NASA_KEY = process.env.REACT_APP_NASA_API_KEY || "DEMO_KEY";
const NASA_BASE = "https://api.nasa.gov";

export const nasa = axios.create({ baseURL: NASA_BASE });

export const getAPOD = (date) =>
  nasa.get(`/planetary/apod?api_key=${NASA_KEY}${date ? `&date=${date}` : ""}`);

export const getAPODRange = (start, end) =>
  nasa.get(`/planetary/apod?api_key=${NASA_KEY}&start_date=${start}&end_date=${end}`);

export const getAsteroids = (start, end) =>
  nasa.get(`/neo/rest/v1/feed?start_date=${start}&end_date=${end}&api_key=${NASA_KEY}`);

export const getDONKI = (type, start, end) =>
  nasa.get(`/DONKI/${type}?startDate=${start}&endDate=${end}&api_key=${NASA_KEY}`);

export const getEPIC = () =>
  nasa.get(`/EPIC/api/natural?api_key=${NASA_KEY}`);

export const getEONET = () =>
  axios.get("https://eonet.gsfc.nasa.gov/api/v3/events?limit=20&status=open");

export const getNASAImages = (query, page = 1) =>
  axios.get(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image&page=${page}`);

export const getISSPosition = () =>
  axios.get("http://api.open-notify.org/iss-now.json");

export const getISSCrew = () =>
  axios.get("http://api.open-notify.org/astros.json");

export const getSpaceNews = (limit = 20, offset = 0) =>
  axios.get(`https://api.spaceflightnewsapi.net/v4/articles/?limit=${limit}&offset=${offset}`);

export const getLaunches = () =>
  axios.get("https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10&format=json");

export const epicImageUrl = (date, image) => {
  const [y, m, d] = date.split("-");
  return `https://epic.gsfc.nasa.gov/archive/natural/${y}/${m}/${d}/png/${image}.png`;
};
