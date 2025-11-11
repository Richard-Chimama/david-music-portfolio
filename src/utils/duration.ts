// Utilities for audio duration formatting and probing

export const formatDuration = (seconds: number): string => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "—";
  const total = Math.round(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
};

export type ProbeOpts = {
  timeoutMs?: number;
  headBytes?: number; // bytes to try from the file start
  tailBytes?: number; // bytes to try from the file end
  fullDecodeMaxBytes?: number; // if file <= this, download full for decode
};

export async function getAudioDurationSeconds(
  url: string,
  opts: ProbeOpts = {}
): Promise<number | null> {
  const timeoutMs = opts.timeoutMs ?? 15000;
  const headBytes = Math.max(128 * 1024, opts.headBytes ?? 1_500_000); // 128KB–1.5MB
  const tailBytes = Math.max(128 * 1024, opts.tailBytes ?? 1_500_000);
  const fullDecodeMaxBytes = Math.max(512 * 1024, opts.fullDecodeMaxBytes ?? 8_000_000); // 0.5–8MB

  const cacheBusted = url + (url.includes("?") ? "&" : "?") + "t=" + Date.now();

  const inferFormat = () => {
    const low = cacheBusted.toLowerCase();
    if (/\.(m4a|mp4)(\?|$)/.test(low)) return "aac";
    if (/\.mp3(\?|$)/.test(low)) return "mp3";
    if (/\.ogg(\?|$)/.test(low)) return "ogg";
    if (/\.opus(\?|$)/.test(low)) return "ogg";
    if (/\.flac(\?|$)/.test(low)) return "flac";
    if (/\.wav(\?|$)/.test(low)) return "wav";
    return "unknown";
  };

  const bitrateBps = (() => {
    switch (inferFormat()) {
      // Use more conservative (higher) bitrates so size-based fallbacks do not overestimate duration
      case "mp3": return 320_000;    // 320 kbps (common for high-quality MP3)
      case "aac": return 256_000;    // 256 kbps (typical for AAC/M4A)
      case "ogg": return 160_000;    // 160 kbps
      case "flac": return 1_000_000; // ~1 Mbps (lossless)
      case "wav": return 1_411_200;  // 1411.2 kbps (16-bit 44.1kHz stereo)
      default:    return 256_000;    // default to 256 kbps
    }
  })();

  const estimateFromSize = (bytes: number) => {
    const estimatedSeconds = Math.max(1, Math.round((bytes * 8) / bitrateBps));
    // Add reasonable upper limit - no single track should be longer than 2 hours (7200s)
    const cappedSeconds = Math.min(estimatedSeconds, 7200);
    console.log(`[Duration] Size estimation: ${bytes} bytes, ${bitrateBps} bps → ${estimatedSeconds}s${estimatedSeconds !== cappedSeconds ? ` (capped to ${cappedSeconds}s)` : ''} (${formatDuration(cappedSeconds)})`);
    return cappedSeconds;
  };

  const getTotalSize = async (): Promise<number | null> => {
    try {
      const controller = new AbortController();
      const to = window.setTimeout(() => controller.abort(), timeoutMs);
      // Ask for first byte to trigger Content-Range: bytes 0-0/FILESIZE
      const resp = await fetch(cacheBusted, {
        method: "GET",
        headers: { Range: "bytes=0-0" },
        signal: controller.signal,
        cache: "no-store",
      });
      window.clearTimeout(to);
      // If server doesn’t support range, fallback to Content-Length
      const cr = resp.headers.get("Content-Range"); // e.g., "bytes 0-0/1234567"
      if (cr && /\/(\d+)$/.test(cr)) {
        const m = cr.match(/\/(\d+)$/);
        return m ? Number(m[1]) : null;
      }
      const cl = resp.headers.get("Content-Length");
      return cl ? Number(cl) : null;
    } catch {
      return null;
    }
  };

  const htmlAudioProbe = async (): Promise<number | null> =>
    new Promise((resolve) => {
      const audio = new Audio();
      audio.preload = "metadata";
      audio.crossOrigin = "anonymous";
      let done = false;
      const finish = (v: number | null) => {
        if (done) return;
        done = true;
        try { audio.src = ""; } catch {}
        resolve(v);
      };
      const to = window.setTimeout(() => finish(null), timeoutMs);

      const tryResolve = () => {
        const d = audio.duration;
        if (Number.isFinite(d) && d > 0) {
          window.clearTimeout(to);
          finish(d);
          return true;
        }
        return false;
      };

      audio.onloadedmetadata = () => {
        if (audio.duration === Infinity) {
          try {
            audio.currentTime = 0.01;
            audio.currentTime = 1e9;
          } catch {}
        } else {
          if (tryResolve()) return;
        }
      };

      audio.ondurationchange = () => { tryResolve(); };
      audio.ontimeupdate = () => { tryResolve(); };
      audio.onerror = () => { window.clearTimeout(to); finish(null); };

      try {
        audio.src = cacheBusted;
        audio.load();
      } catch {
        window.clearTimeout(to);
        finish(null);
      }
    });

  const webAudioDecode = async (rangeHeader?: string): Promise<number | null> => {
    const AudioContextCtor: typeof AudioContext | undefined =
      typeof window !== "undefined"
        ? (window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)
        : undefined;
    if (!AudioContextCtor) return null;
    try {
      const controller = new AbortController();
      const to = window.setTimeout(() => controller.abort(), timeoutMs);
      const resp = await fetch(cacheBusted, {
        headers: rangeHeader ? { Range: rangeHeader } : undefined,
        signal: controller.signal,
        cache: "no-store",
      });
      window.clearTimeout(to);
      if (!resp.ok) return null;
      const buf = await resp.arrayBuffer();
      const ctx = new AudioContextCtor();
      try {
        const decoded = await ctx.decodeAudioData(buf.slice(0));
        if (decoded && Number.isFinite(decoded.duration) && decoded.duration > 0) {
          return decoded.duration;
        }
      } catch {
        return null;
      } finally {
        try { ctx.close(); } catch {}
      }
    } catch {
      return null;
    }
    return null;
  };

  // 1) Fast path: <audio> metadata + large seek
  console.log(`[Duration] Trying HTML audio probe for: ${url}`);
  const d1 = await htmlAudioProbe();
  if (d1 && d1 > 0) {
    console.log(`[Duration] HTML audio probe succeeded: ${d1}s (${formatDuration(d1)})`);
    return d1;
  }
  console.log(`[Duration] HTML audio probe failed or returned: ${d1}`);

  // 2) Web Audio from HEAD range
  console.log(`[Duration] Trying Web Audio HEAD range probe (${headBytes} bytes)`);
  const d2 = await webAudioDecode(`bytes=0-${headBytes - 1}`);
  if (d2 && d2 > 0) {
    console.log(`[Duration] Web Audio HEAD probe succeeded: ${d2}s (${formatDuration(d2)})`);
    return d2;
  }
  console.log(`[Duration] Web Audio HEAD probe failed or returned: ${d2}`);

  // 3) Try TAIL range (handles MP4 with moov atom at end)
  const total = await getTotalSize();
  console.log(`[Duration] Total file size: ${total} bytes`);
  if (total && total > headBytes) {
    const start = Math.max(0, total - tailBytes);
    console.log(`[Duration] Trying Web Audio TAIL range probe (bytes ${start}-${total - 1})`);
    const d3 = await webAudioDecode(`bytes=${start}-${total - 1}`);
    if (d3 && d3 > 0) {
      console.log(`[Duration] Web Audio TAIL probe succeeded: ${d3}s (${formatDuration(d3)})`);
      return d3;
    }
    console.log(`[Duration] Web Audio TAIL probe failed or returned: ${d3}`);

    // 4) If file is small enough, fetch full and decode once
    if (total <= fullDecodeMaxBytes) {
      console.log(`[Duration] Trying full file decode (${total} <= ${fullDecodeMaxBytes} bytes)`);
      const d4 = await webAudioDecode(); // no range
      if (d4 && d4 > 0) {
        console.log(`[Duration] Full decode succeeded: ${d4}s (${formatDuration(d4)})`);
        return d4;
      }
      console.log(`[Duration] Full decode failed or returned: ${d4}`);
    }

    // 5) Final fallback: size estimate
    console.log(`[Duration] Using size-based estimation as final fallback`);
    return estimateFromSize(total);
  }

  console.log(`[Duration] All probing methods failed, returning null`);
  return null;
}