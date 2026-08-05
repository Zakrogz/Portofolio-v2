import { useEffect, useRef, useState } from "react";
import { gsap } from "./gsap";

function formatTimecode(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = Math.floor(totalSeconds % 60);
  const f = Math.floor((totalSeconds % 1) * 24); // 24fps display
  const pad = (n, len = 2) => String(n).padStart(len, "0");
  return `${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`;
}

// Timecode que avanza en bucle, como el contador de un editor de vídeo.
// Usa gsap.ticker en lugar de setInterval para mantenerse sincronizado con el frame rate.
export function useTimecode({ loopSeconds = 217, running = true } = {}) {
  const [display, setDisplay] = useState(formatTimecode(0));
  const elapsed = useRef(0);

  useEffect(() => {
    if (!running) return;

    // gsap.ticker invoca con (time, deltaTime, frame); deltaTime llega en milisegundos.
    const tick = (_time, deltaTime) => {
      elapsed.current = (elapsed.current + deltaTime / 1000) % loopSeconds;
      setDisplay(formatTimecode(elapsed.current));
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [loopSeconds, running]);

  return display;
}
