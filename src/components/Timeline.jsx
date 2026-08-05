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
const WAYPOINT_X = (i) => (i % 2 === 0 ? 58 : 42);

const fallbackWaypoints = () =>
  SECTIONS.map((_, i) => ({
    x: WAYPOINT_X(i),
    y: (i / (SECTIONS.length - 1)) * 100,
  }));

// Si dos marcas caen muy cerca en la proporción real de scroll (p. ej. una
// sección corta y sin pin justo después de una fijada), la curva tiene que
// girar en muy poco espacio vertical y sale en pico en vez de suave. Aquí
// forzamos una separación mínima entre marcas consecutivas, empujando hacia
// abajo las que queden demasiado juntas.
function enforceMinSpacing(points, minGap) {
  for (let i = 1; i < points.length; i++) {
    if (points[i].y < points[i - 1].y + minGap) {
      points[i].y = points[i - 1].y + minGap;
    }
  }
  const last = points[points.length - 1].y;
  if (last > 100) {
    const scale = 100 / last;
    points.forEach((p) => (p.y *= scale));
  }
  return points;
}

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

      // Hero, Trabajo y Servicios van fijados (pin) con scroll extendido, así
      // que consumen mucho más recorrido real que las demás secciones. Si
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
      let dotTween = null;

      const rebuildTrack = () => {
        const max = ScrollTrigger.maxScroll(window);
        if (!max) return;

        const rawPoints = sectionTriggers.map((t, i) => ({
          x: WAYPOINT_X(i),
          y: t ? (t.start / max) * 100 : (i / (SECTIONS.length - 1)) * 100,
        }));
        // Separación mínima: al menos la mitad de lo que tocaría con reparto
        // uniforme, para que ninguna curva quede demasiado apretada.
        const minGap = (100 / (SECTIONS.length - 1)) * 0.5;
        const points = enforceMinSpacing(rawPoints, minGap);

        pathRef.current?.setAttribute("d", buildPath(points));
        tickRefs.current.forEach((circle, i) => {
          circle.setAttribute("cx", points[i].x);
          circle.setAttribute("cy", points[i].y);
        });

        // El tween de motionPath cachea la forma del <path> en el momento en
        // que se crea: si el trazado cambia después (justo lo que hacemos
        // arriba), hay que matar y recrear el tween para que lea la forma
        // actualizada. Si no, el punto sigue el trazado viejo mientras la
        // línea dibujada ya es otra — se ve completamente descuadrado.
        dotTween?.scrollTrigger?.kill();
        dotTween?.kill();
        dotTween = gsap.to(dotRef.current, {
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
      };

      ScrollTrigger.addEventListener("refresh", rebuildTrack);
      rebuildTrack(); // por si ya hay datos válidos (recarga en caliente, etc.)

      return () => {
        ScrollTrigger.removeEventListener("refresh", rebuildTrack);
        dotTween?.scrollTrigger?.kill();
        dotTween?.kill();
      };
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
