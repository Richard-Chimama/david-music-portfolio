"use client";
import { useEffect, useRef, useState } from "react";

type MusicalWaveProps = {
  className?: string;
  ariaLabel?: string;
  decorative?: boolean; // if true, hide from assistive tech
  speed?: number; // animation speed
  thickness?: number; // line thickness
};

export function MusicalWave({
  className,
  ariaLabel,
  decorative = true,
  speed = 0.6,
  thickness = 2.5,
}: MusicalWaveProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [dpr, setDpr] = useState(1);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const prefersReduced = mq.matches;

    const onDPRChange = () => setDpr(Math.max(1, Math.min(2, window.devicePixelRatio || 1)));
    onDPRChange();
    window.addEventListener("resize", onDPRChange);

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return () => {};

    const ctx = canvas.getContext("2d");
    if (!ctx) return () => {};

    // Resize observer to keep canvas resolution in sync with container
    const ro = new ResizeObserver(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    });
    ro.observe(container);

    // Animation state
    let t = 0;
    const gradient = () => {
      const g = ctx.createLinearGradient(0, 0, canvas.width, 0);
      g.addColorStop(0, getComputedStyle(document.documentElement).getPropertyValue("--neon-pink").trim() || "#ff3cac");
      g.addColorStop(0.5, getComputedStyle(document.documentElement).getPropertyValue("--neon-purple").trim() || "#784ba0");
      g.addColorStop(1, getComputedStyle(document.documentElement).getPropertyValue("--neon-blue").trim() || "#2b86c5");
      return g;
    };

    const noise = (x: number, time: number) => {
      // layered sines to simulate musical undulation
      return (
        Math.sin(x * 0.012 + time * 0.9) * 0.6 +
        Math.sin(x * 0.024 - time * 0.7) * 0.3 +
        Math.sin(x * 0.006 + time * 0.4) * 0.2
      );
    };

    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      const mid = height / 2;

      ctx.clearRect(0, 0, width, height);

      // Neon glow styling
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.shadowColor = "rgba(0, 230, 255, 0.35)";
      ctx.shadowBlur = 14 * dpr;
      ctx.strokeStyle = gradient();
      ctx.lineWidth = thickness * dpr;

      ctx.beginPath();
      const step = Math.max(1, Math.floor(width / 140));
      for (let x = 0; x <= width; x += step) {
        const nx = x / dpr;
        const amp = (height / 6) * (1 - Math.abs((nx / (width / dpr)) - 0.5)); // slight taper at edges
        const y = mid + noise(nx, t) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const animate = () => {
      draw();
      t += (speed * 0.016) * (prefersReduced ? 0 : 1);
      rafRef.current = requestAnimationFrame(animate);
    };

    const handleVisibility = () => {
      const hidden = document.hidden;
      if (hidden) {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      } else if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      ro.disconnect();
      window.removeEventListener("resize", onDPRChange);
    };
  }, [dpr, speed, thickness]);

  return (
    <div
      ref={containerRef}
      className={className}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : ariaLabel || "Musical waveform visualization"}
      aria-hidden={decorative || undefined}
    >
      <canvas ref={canvasRef} />
    </div>
  );
}