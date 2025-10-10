"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type AdvancedMusicalWaveProps = {
  className?: string;
  ariaLabel?: string;
  decorative?: boolean;
  audioSource?: string; // URL to audio file
  enableMicrophone?: boolean; // Enable microphone input
  waveCount?: number; // Number of wave layers
  amplitude?: number; // Wave amplitude multiplier
  frequency?: number; // Base frequency
  speed?: number; // Animation speed
  thickness?: number; // Line thickness
  glowIntensity?: number; // Glow effect intensity
  particleCount?: number; // Number of floating particles
  enablePhysics?: boolean; // Enable physics-based movement
};

interface AudioData {
  frequencyData: Uint8Array;
  timeData: Uint8Array;
  volume: number;
}

export function AdvancedMusicalWave({
  className = "",
  ariaLabel,
  decorative = true,
  audioSource,
  enableMicrophone = false,
  waveCount = 3,
  amplitude = 1,
  frequency = 0.02,
  speed = 1,
  thickness = 2.5,
  glowIntensity = 1,
  particleCount = 20,
  enablePhysics = true,
}: AdvancedMusicalWaveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<AudioBufferSourceNode | MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  
  const [dpr, setDpr] = useState(1);
  const [audioData, setAudioData] = useState<AudioData>({
    frequencyData: new Uint8Array(256),
    timeData: new Uint8Array(256),
    volume: 0
  });
  const [isAudioActive, setIsAudioActive] = useState(false);

  // Particle system for enhanced visual effects
  const particlesRef = useRef<Array<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
  }>>([]);

  // Physics simulation state
  const waveStateRef = useRef<Array<{
    phase: number;
    velocity: number;
    amplitude: number;
  }>>([]);

  // Initialize audio context and analyser
  const initializeAudio = useCallback(async () => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 512;
      analyserRef.current.smoothingTimeConstant = 0.8;

      if (enableMicrophone) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);
        setIsAudioActive(true);
      } else if (audioSource) {
        audioElementRef.current = new Audio(audioSource);
        audioElementRef.current.crossOrigin = "anonymous";
        audioElementRef.current.loop = true;
        
        const mediaSource = audioContextRef.current.createMediaElementSource(audioElementRef.current);
        sourceRef.current = mediaSource;
        mediaSource.connect(analyserRef.current);
        analyserRef.current.connect(audioContextRef.current.destination);
        
        audioElementRef.current.play().then(() => {
          setIsAudioActive(true);
        }).catch(console.warn);
      }
    } catch (error) {
      console.warn("Audio initialization failed:", error);
    }
  }, [audioSource, enableMicrophone]);

  // Update audio data
  const updateAudioData = useCallback(() => {
    if (!analyserRef.current) return;

    const frequencyData = new Uint8Array(analyserRef.current.frequencyBinCount);
    const timeData = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    analyserRef.current.getByteFrequencyData(frequencyData);
    analyserRef.current.getByteTimeDomainData(timeData);

    // Calculate volume (RMS)
    let sum = 0;
    for (let i = 0; i < timeData.length; i++) {
      const sample = (timeData[i] - 128) / 128;
      sum += sample * sample;
    }
    const volume = Math.sqrt(sum / timeData.length);

    setAudioData({ frequencyData, timeData, volume });
  }, []);

  // Initialize particles
  const initializeParticles = useCallback(() => {
    particlesRef.current = Array.from({ length: particleCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.002,
      vy: (Math.random() - 0.5) * 0.002,
      life: Math.random(),
      maxLife: 0.5 + Math.random() * 0.5,
      size: 1 + Math.random() * 2
    }));
  }, [particleCount]);

  // Initialize wave states
  const initializeWaveStates = useCallback(() => {
    waveStateRef.current = Array.from({ length: waveCount }, (_, i) => ({
      phase: (i * Math.PI * 2) / waveCount,
      velocity: 0,
      amplitude: 1
    }));
  }, [waveCount]);

  // Update particles with physics
  const updateParticles = useCallback((deltaTime: number, audioVolume: number) => {
    particlesRef.current.forEach(particle => {
      // Physics-based movement
      particle.x += particle.vx * deltaTime * 60;
      particle.y += particle.vy * deltaTime * 60;
      
      // Audio-reactive behavior
      const audioInfluence = audioVolume * 0.1;
      particle.vy -= audioInfluence * deltaTime;
      
      // Boundary wrapping
      if (particle.x < 0) particle.x = 1;
      if (particle.x > 1) particle.x = 0;
      if (particle.y < 0) particle.y = 1;
      if (particle.y > 1) particle.y = 0;
      
      // Life cycle
      particle.life -= deltaTime / particle.maxLife;
      if (particle.life <= 0) {
        particle.life = 1;
        particle.x = Math.random();
        particle.y = Math.random();
      }
    });
  }, []);

  // Main animation loop
  const animate = useCallback((currentTime: number) => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerY = height / 2;

    // Update audio data if available
    if (isAudioActive) {
      updateAudioData();
    }

    // Clear canvas with subtle fade effect
    ctx.fillStyle = "rgba(11, 12, 16, 0.1)";
    ctx.fillRect(0, 0, width, height);

    // Update particles
    updateParticles(0.016, audioData.volume);

    // Draw particles
    particlesRef.current.forEach(particle => {
      const alpha = particle.life * 0.6;
      const size = particle.size * dpr;
      
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = `rgba(0, 230, 255, ${alpha})`;
      ctx.shadowColor = "rgba(0, 230, 255, 0.8)";
      ctx.shadowBlur = 10 * dpr;
      
      ctx.beginPath();
      ctx.arc(particle.x * width, particle.y * height, size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // Create dynamic gradient based on audio
    const createGradient = (intensity: number = 1) => {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);
      const colors = [
        getComputedStyle(document.documentElement).getPropertyValue("--neon-pink").trim() || "#ff3cac",
        getComputedStyle(document.documentElement).getPropertyValue("--neon-purple").trim() || "#784ba0",
        getComputedStyle(document.documentElement).getPropertyValue("--neon-blue").trim() || "#2b86c5",
        getComputedStyle(document.documentElement).getPropertyValue("--neon-cyan").trim() || "#00e6ff"
      ];
      
      gradient.addColorStop(0, colors[0]);
      gradient.addColorStop(0.33, colors[1]);
      gradient.addColorStop(0.66, colors[2]);
      gradient.addColorStop(1, colors[3]);
      
      return gradient;
    };

    // Draw multiple wave layers
    for (let layer = 0; layer < waveCount; layer++) {
      const waveState = waveStateRef.current[layer];
      if (!waveState) continue;

      // Physics-based wave evolution
      if (enablePhysics) {
        const targetAmplitude = isAudioActive ? 
          (audioData.volume * 2 + 0.5) * amplitude : 
          amplitude * 0.7;
        
        waveState.velocity += (targetAmplitude - waveState.amplitude) * 0.02;
        waveState.velocity *= 0.95; // Damping
        waveState.amplitude += waveState.velocity;
        waveState.phase += speed * 0.02 * (1 + layer * 0.1);
      }

      // Calculate wave properties
      const layerAlpha = 1 - (layer * 0.3);
      const layerThickness = thickness * (1 - layer * 0.2) * dpr;
      const layerAmplitude = waveState.amplitude * (height / 6) * (1 - layer * 0.1);

      // Set up drawing style
      ctx.save();
      ctx.globalAlpha = layerAlpha;
      ctx.strokeStyle = createGradient();
      ctx.lineWidth = layerThickness;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = "rgba(0, 230, 255, 0.4)";
      ctx.shadowBlur = (14 + layer * 4) * glowIntensity * dpr;

      // Draw wave
      ctx.beginPath();
      const step = Math.max(1, Math.floor(width / 200));
      
      for (let x = 0; x <= width; x += step) {
        const normalizedX = x / width;
        let y = centerY;

        // Base wave calculation
        const baseWave = Math.sin(normalizedX * Math.PI * 4 * frequency + waveState.phase) * layerAmplitude;
        
        // Audio-reactive modifications
        if (isAudioActive && audioData.frequencyData.length > 0) {
          const freqIndex = Math.floor(normalizedX * audioData.frequencyData.length * 0.5);
          const freqValue = audioData.frequencyData[freqIndex] / 255;
          const audioWave = Math.sin(normalizedX * Math.PI * 8 + currentTime * 0.003) * freqValue * layerAmplitude * 0.5;
          y += baseWave + audioWave;
        } else {
          // Fallback procedural animation
          const proceduralWave = 
            Math.sin(normalizedX * Math.PI * 6 + currentTime * 0.002 + layer) * layerAmplitude * 0.3 +
            Math.sin(normalizedX * Math.PI * 12 + currentTime * 0.001 - layer) * layerAmplitude * 0.2;
          y += baseWave + proceduralWave;
        }

        // Edge tapering for natural look
        const edgeFactor = 1 - Math.pow(Math.abs(normalizedX - 0.5) * 2, 2);
        y = centerY + (y - centerY) * edgeFactor;

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      ctx.restore();
    }

    rafRef.current = requestAnimationFrame(animate);
  }, [
    audioData, 
    isAudioActive, 
    updateAudioData, 
    updateParticles, 
    waveCount, 
    amplitude, 
    frequency, 
    speed, 
    thickness, 
    glowIntensity, 
    enablePhysics, 
    dpr
  ]);

  // Setup and cleanup
  useEffect(() => {
    const updateDPR = () => setDpr(Math.max(1, Math.min(2, window.devicePixelRatio || 1)));
    updateDPR();
    window.addEventListener("resize", updateDPR);

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Initialize systems
    initializeParticles();
    initializeWaveStates();
    
    // Setup canvas
    const resizeObserver = new ResizeObserver(() => {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    });
    resizeObserver.observe(container);

    // Initialize audio if needed
    if (audioSource || enableMicrophone) {
      initializeAudio();
    }

    // Start animation
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = 0;
        }
      } else if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    rafRef.current = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("resize", updateDPR);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      resizeObserver.disconnect();
      
      // Audio cleanup
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [animate, initializeAudio, initializeParticles, initializeWaveStates, audioSource, enableMicrophone, dpr]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : ariaLabel || "Advanced musical waveform visualization"}
      aria-hidden={decorative || undefined}
    >
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
        style={{ 
          background: 'transparent',
          imageRendering: 'auto'
        }}
      />
      {/* Audio controls for accessibility */}
      {audioSource && !decorative && (
        <div className="sr-only">
          <button
            onClick={() => {
              if (audioElementRef.current) {
                if (audioElementRef.current.paused) {
                  audioElementRef.current.play();
                } else {
                  audioElementRef.current.pause();
                }
              }
            }}
            aria-label="Toggle audio visualization"
          >
            Toggle Audio
          </button>
        </div>
      )}
    </div>
  );
}