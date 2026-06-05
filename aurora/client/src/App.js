import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import StarField from "./components/StarField";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

const Home         = lazy(() => import("./pages/Home"));
const APODPage     = lazy(() => import("./pages/APOD"));
const Asteroids    = lazy(() => import("./pages/Asteroids"));
const SpaceWeather = lazy(() => import("./pages/SpaceWeather"));
const Earth        = lazy(() => import("./pages/Earth"));
const ISSTracker   = lazy(() => import("./pages/ISSTracker"));
const Gallery      = lazy(() => import("./pages/Gallery"));
const News         = lazy(() => import("./pages/News"));
const Launches     = lazy(() => import("./pages/Launches"));
const NotFound     = lazy(() => import("./pages/NotFound"));

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  enter:   { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" } },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="enter"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/"              element={<Home />} />
          <Route path="/apod"          element={<APODPage />} />
          <Route path="/asteroids"     element={<Asteroids />} />
          <Route path="/space-weather" element={<SpaceWeather />} />
          <Route path="/earth"         element={<Earth />} />
          <Route path="/iss"           element={<ISSTracker />} />
          <Route path="/gallery"       element={<Gallery />} />
          <Route path="/news"          element={<News />} />
          <Route path="/launches"      element={<Launches />} />
          <Route path="*"              element={<NotFound />} />
        </Routes>
        <Footer />
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-space-black relative">
        <StarField />
        <Navbar />
        <main className="relative z-10">
          <Suspense fallback={
            <div className="pt-32 pb-16"><LoadingSpinner text="LOADING..." /></div>
          }>
            <AnimatedRoutes />
          </Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}
