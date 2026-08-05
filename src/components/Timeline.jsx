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

// Zigzag suave dentro de un viewBox 0-100: alterna x entre 68 y 32 en cada
// sección, repartidas a partes iguales en el alto del trazado.
const WAYPOINTS = SECTIONS.map((_, i) => ({
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

const PATH_D = buildPath(WAYPOINTS);

export default function Timeline() {
  const railRef = useRef(null);
  const pathRef = useRef(null);
  const dotRef = useRef(null);
  const [active, setActive] = useState(SECTIONS[0].id);

  useGSAP(
    () => {
      // El punto recorre el trazado entero según el progreso de scroll de
      // TODA la página (no de una sección) — así no hay que calcular a mano
      // la posición de cada sección teniendo en cuenta los pines del Hero y
      // Trabajo; ScrollTrigger ya mide el alto real del documento por sí solo.
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

      // Qué marca se ilumina: un ScrollTrigger ligero por sección, igual
      // que el que ya usa el Nav para resaltar el link activo.
      SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActive(s.id);
          },
        });
      });
    },
    { scope: railRef }
  );

  return (
    <div className={styles.rail} ref={railRef} aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svg}>
        <path ref={pathRef} d={PATH_D} className={styles.track} />
        {WAYPOINTS.map((p, i) => (
          <circle
            key={SECTIONS[i].id}
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
