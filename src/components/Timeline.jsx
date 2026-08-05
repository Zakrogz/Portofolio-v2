import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../lib/gsap";
import styles from "./Timeline.module.css";

const SECTIONS = [
  { id: "top", label: "Hero" },
  { id: "trabajo", label: "Trabajo" },
  { id: "proceso", label: "Proceso" },
  { id: "servicios", label: "Servicios" },
  { id: "testimonios", label: "Testimonios" },
  { id: "contacto", label: "Contacto" },
];

// Reparto inicial a partes iguales, solo como primer pintado antes de que
// ScrollTrigger haya medido nada. Se recalcula en cuanto se puede (ver abajo).
const fallbackWaypoints = () =>
  SECTIONS.map((_, i) => ({
    x: i % 2 === 0 ? 68 : 32,
    y: (i / (SECTIONS.length - 1)) * 100,
  }));

// Curva suave entre puntos (beziers cúbicas con el punto de control a mitad
// de camino en Y, para que el giro no sea en ángulo recto).
function buildPath(points) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midY = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
  }
  return d;
}

export default function Timeline() {
  const railRef = useRef(null);
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const tickRefs = useRef([]);
  tickRefs.current = [];
  const [active, setActive] = useState(SECTIONS[0].id);

  const registerTick = (el) => {
    if (el) tickRefs.current.push(el);
  };

  useGSAP(
    () => {
      // Un ScrollTrigger por sección: sirve para (a) saber cuál está activa
      // y (b) — más abajo — leer su posición real de inicio en píxeles.
      const sectionTriggers = SECTIONS.map((s) => {
        const el = document.getElementById(s.id);
        if (!el) return null;
        return ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActive(s.id);
          },
        });
      });

      // Hero y Trabajo van fijados (pin) con scroll extendido, así que
      // consumen mucho más recorrido real que las demás secciones. Si
      // repartimos las marcas a partes iguales por índice, el trazado no
      // refleja eso. En su lugar, colocamos cada marca según la fracción
      // real de scroll en la que empieza su sección (trigger.start /
      // scroll máximo del documento).
      //
      // Esto solo puede calcularse una vez todos los ScrollTrigger de la
      // página (incluidos los pines) están registrados y medidos, así que
      // esperamos al evento global "refresh" en vez de intentarlo aquí
      // mismo (mismo motivo por el que el pin del vídeo del Hero se creaba
      // mal en su momento: medir antes de tiempo da coordenadas obsoletas).
      const applyProportionalWaypoints = () => {
        const max = ScrollTrigger.maxScroll(window);
        if (!max) return;

        const points = sectionTriggers.map((t, i) => ({
          x: i % 2 === 0 ? 68 : 32,
          y: t ? (t.start / max) * 100 : (i / (SECTIONS.length - 1)) * 100,
        }));

        pathRef.current?.setAttribute("d", buildPath(points));
        tickRefs.current.forEach((circle, i) => {
          circle.setAttribute("cx", points[i].x);
          circle.setAttribute("cy", points[i].y);
        });
      };

      ScrollTrigger.addEventListener("refresh", applyProportionalWaypoints);
      applyProportionalWaypoints(); // por si ya hay datos válidos (recarga en caliente, etc.)

      // El punto recorre el trazado entero según el progreso de scroll de
      // TODA la página (no de una sección) — ScrollTrigger ya mide el alto
      // real del documento por sí solo, incluidos los huecos de los pines.
      gsap.to(dotRef.current, {
        motionPath: {
          path: pathRef.current,
          align: pathRef.current,
          alignOrigin: [0.5, 0.5],
        },
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });

      return () =>
        ScrollTrigger.removeEventListener("refresh", applyProportionalWaypoints);
    },
    { scope: railRef }
  );

  const initial = fallbackWaypoints();

  return (
    <div className={styles.rail} ref={railRef} aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svg}>
        <path ref={pathRef} d={buildPath(initial)} className={styles.track} />
        {initial.map((p, i) => (
          <circle
            key={SECTIONS[i].id}
            ref={registerTick}
            cx={p.x}
            cy={p.y}
            r="2.4"
            className={active === SECTIONS[i].id ? styles.tickActive : styles.tick}
          />
        ))}
      </svg>
      <div className={styles.dot} ref={dotRef} />
    </div>
  );
}
