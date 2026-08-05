import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, EASE } from "../lib/gsap";

// Revela en bloque (batch) los elementos marcados con data-reveal dentro del scope.
// useGSAP se encarga de revertir timelines y ScrollTriggers al desmontar o en
// doble-render de StrictMode, así que no se acumulan triggers duplicados.
export function useScrollReveal({ start = "top 82%", stagger = 0.12 } = {}) {
  const scope = useRef(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray("[data-reveal]", scope.current);
      if (!items.length) return;

      ScrollTrigger.batch(items, {
        start,
        once: true,
        onEnter: (batch) =>
          gsap.from(batch, {
            autoAlpha: 0,
            y: 48,
            duration: 0.8,
            ease: EASE,
            stagger,
            overwrite: true,
          }),
      });
    },
    { scope }
  );

  return scope;
}
