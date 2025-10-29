import React from "react";

interface WaveformProps {
  // Color of the bars (any valid CSS color)
  color?: string;
  // Width (thickness) of each bar in pixels
  barWidth?: number;
  // Alias for barWidth to match common naming
  width?: number;
  // Scale factor applied to the default bar heights
  heightScale?: number;
  // Optional max height (in px). If provided, bars are scaled so their tallest bar equals this height.
  height?: number;
  // Optionally provide your own bar heights to override the default pattern
  bars?: number[];
  // Optional className to extend/override the wrapper styles
  className?: string;
}

const DEFAULT_BARS = [
  60, 90, 120, 70, 40, 30, 70, 110, 130, 90, 70, 40, 60, 100, 130, 100, 70, 40, 20, 60, 80, 100, 70, 50, 30,
];

const Waveform: React.FC<WaveformProps> = ({
  color = "#000000",
  barWidth = 4,
  width,
  heightScale = 1,
  height,
  bars = DEFAULT_BARS,
  className,
}) => {
  const maxBase = Math.max(...bars);
  const scale = height != null ? height / maxBase : heightScale;
  const effectiveBarWidth = width != null ? width : barWidth;
  const usedBars = bars.map((h) => Math.max(1, Math.round(h * scale)));

  return (
    <div className={`flex items-center justify-center space-x-1 ${className ?? ""}`}>
      {usedBars.map((barHeight, i) => (
        <div
          key={i}
          className="rounded-full"
          style={{
            width: `${effectiveBarWidth}px`,
            height: `${barHeight}px`,
            backgroundColor: color,
            animation: `pulse ${usedBars.length / 10}s ease-in-out infinite`,
            animationDelay: `${i * 0.1}s`,
          }}
        />
      ))}

      {/* Add animation styling */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scaleY(1); opacity: 0.8; }
          50% { transform: scaleY(1.4); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default Waveform;
