import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE } from "../lib/gsap";
import { work } from "../data/content.js";
import { publicUrl } from "../lib/publicUrl.js";
import styles from "./Work.module.css";

const SPACING = 230; // separación horizontal entre el centro y cada lateral (px)

// Vars de una tarjeta según su "slot": 0 = centro (grande), ±1 = laterales
// (pequeñas), resto = fuera de la vista. offset positivo cae a la derecha.
function slotVars(offset) {
  const abs = Math.abs(offset);
  return {
    x: offset * SPACING,
    scale: abs === 0 ? 1 : abs === 1 ? 0.72 : 0.55,
    autoAlpha: abs === 0 ? 1 : abs === 1 ? 0.55 : 0,
    zIndex: 10 - abs,
  };
}

function EyeIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function PlayIcon(props) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" {...props}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export default function Work() {
  const scope = useRef(null);
  const titleRef = useRef(null);
  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  cardRefs.current = [];

  const registerCard = (el) => {
    if (el) cardRefs.current.push(el);
  };

  useGSAP(
    () => {
      const cards = cardRefs.current;
      const total = cards.length;

      // Posición inicial: centrado permanente (xPercent/yPercent) + el slot
      // de cada tarjeta según su índice (la 0 empieza en el centro), pero
      // ocultas (autoAlpha:0) — aparecen después del texto de cabecera.
      cards.forEach((card, i) => {
        gsap.set(card, {
          xPercent: -50,
          yPercent: -50,
          ...slotVars(0 - i),
          autoAlpha: 0,
        });
      });

      // Timeline único, fijado (pin) en pantalla: primero el texto, luego el
      // carrusel. Un solo ScrollTrigger para toda la sección, para no
      // depender de que otro trigger (p. ej. el pin async del Hero) haya
      // recalculado antes las posiciones.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * (1 + total * 0.8),
          pin: true,
          scrub: 0.6,
        },
      });

      tl.fromTo(
        titleRef.current,
        { autoAlpha: 0, y: 24 },
        // Ease pedido explícitamente para este titular, distinto del ease
        // de marca que usa el resto del sitio.
        { autoAlpha: 1, y: 0, duration: 0.45, ease: "power1.inOut" }
      );

      // Solapado con el título ("-=0.2"): antes esperaba a que el título
      // terminara del todo, dejando un tramo de scroll en blanco (el pin ya
      // había enganchado pero no había nada que ver) antes de que aparecieran
      // las tarjetas.
      tl.to(
        cards,
        {
          autoAlpha: (i) => slotVars(0 - i).autoAlpha,
          duration: 0.35,
          stagger: { each: 0.05, from: "center" },
          ease: EASE,
        },
        "-=0.2"
      );

      // En cada paso, el "centro" avanza una tarjeta: todas se reubican en
      // su nuevo slot a la vez (el índice que gana el centro se mueve desde
      // la izquierda; el que lo pierde se desplaza a la derecha y sale).
      for (let cur = 1; cur < total; cur++) {
        tl.addLabel(`card${cur}`, "+=0.15");
        cards.forEach((card, idx) => {
          tl.to(card, { ...slotVars(cur - idx), duration: 0.9, ease: EASE }, `card${cur}`);
        });
      }

    },
    { scope }
  );

  return (
    <section id="trabajo" ref={scope} className={styles.section}>
      <div className={`container ${styles.header}`}>
        <h2 ref={titleRef} className={styles.heading}>
          Una muestra de proyectos recientes
        </h2>
      </div>

      <div className={styles.stage} ref={stageRef}>
        {work.map((project) => (
          <div className={styles.card} key={project.title} ref={registerCard}>
            {/* Coloca el vídeo del proyecto en public/work/ (formato vertical 9:16). */}
            <video
              className={styles.video}
              muted
              loop
              playsInline
              preload="none"
              poster={publicUrl(project.poster)}
            >
              <source src={publicUrl(project.video)} type="video/mp4" />
            </video>
            {/* Mockup de marcador mientras no hay vídeo/captura real: textura +
                timecode + botón de play, en el mismo lenguaje visual que el
                reproductor del Hero. No es una captura del proyecto. */}
            <div className={styles.mediaFallback} aria-hidden="true">
              <span className={styles.timecode}>0:00 / {project.duration}</span>
              <span className={styles.playBadge}>
                <PlayIcon />
              </span>
            </div>

            <div className={styles.views}>
              <EyeIcon className={styles.eyeIcon} />
              <span>{project.views}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
