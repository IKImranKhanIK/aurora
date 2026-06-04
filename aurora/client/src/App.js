import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import StarField from "./components/StarField";
import LoadingSpinner from "./components/LoadingSpinner";

const Home = lazy(() => import("./pages/Home"));
const APODPage = lazy(() => import("./pages/APOD"));
const Asteroids = lazy(() => import("./pages/Asteroids"));
const SpaceWeather = lazy(() => import("./pages/SpaceWeather"));
const Earth = lazy(() => import("./pages/Earth"));
const ISSTracker = lazy(() => import("./pages/ISSTracker"));
const Gallery = lazy(() => import("./pages/Gallery"));
const News = lazy(() => import("./pages/News"));
const Launches = lazy(() => import("./pages/Launches"));

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-space-black relative">
        <StarField />
        <Navbar />
        <main className="relative z-10">
          <Suspense fallback={<div className="pt-32"><LoadingSpinner text="LOADING..." /></div>}>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/apod" element={<APODPage />} />
                <Route path="/asteroids" element={<Asteroids />} />
                <Route path="/space-weather" element={<SpaceWeather />} />
                <Route path="/earth" element={<Earth />} />
                <Route path="/iss" element={<ISSTracker />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/news" element={<News />} />
                <Route path="/launches" element={<Launches />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}
