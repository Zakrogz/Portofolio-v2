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

      // Ocultos desde ya (no en el momento del trigger): con gsap.from() el
      // estado inicial solo se aplica cuando el tween se crea dentro de
      // onEnter, así que el elemento se ve normal hasta ese instante y
      // entonces "salta" a oculto antes de animarse — justo el efecto raro.
      // Al fijarlo aquí con gsap.set(), ya está invisible de antemano y
      // gsap.to() solo anima hacia el estado visible, sin salto.
      gsap.set(items, { autoAlpha: 0, y: 48 });

      ScrollTrigger.batch(items, {
        start,
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
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
