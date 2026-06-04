import React, { useEffect, useRef } from "react";

export default function StarField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    const STAR_COUNT = 180;
    let animFrameId;
    let stars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initStars = () => {
      stars = Array.from({ length: STAR_COUNT }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        alpha: Math.random(),
        speed: Math.random() * 0.008 + 0.003,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    resize();
    initStars();

    const draw = (t) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const time = t * 0.001;
      stars.forEach((s) => {
        const alpha = 0.2 + 0.8 * Math.abs(Math.sin(time * s.speed * 10 + s.phase));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
        ctx.fill();
      });
      animFrameId = requestAnimationFrame(draw);
    };

    animFrameId = requestAnimationFrame(draw);
    window.addEventListener("resize", () => { resize(); initStars(); });

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ display: "block" }}
    />
  );
}
