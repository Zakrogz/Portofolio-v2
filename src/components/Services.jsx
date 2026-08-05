import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE } from "../lib/gsap";
import { services } from "../data/content.js";
import styles from "./Services.module.css";

// Colores literales (no var(--...)) porque GSAP necesita interpolar entre
// dos valores de color reales, no una referencia a variable CSS.
const TEXT = "#f4f5f3";
const TEXT_MUTED = "#9aa3af";

export default function Services() {
  const scope = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const panelRef = useRef(null);
  const titleRefs = useRef([]);
  const descRefs = useRef([]);
  titleRefs.current = [];
  descRefs.current = [];
  const [active, setActive] = useState(0);

  const registerTitle = (el) => {
    if (el) titleRefs.current.push(el);
  };
  const registerDesc = (el) => {
    if (el) descRefs.current.push(el);
  };

  useGSAP(
    () => {
      const titles = titleRefs.current;
      const descs = descRefs.current;
      const total = descs.length;

      // Todo oculto/pequeño/mudo desde el principio (no en el momento del
      // trigger) — mismo motivo que en useScrollReveal: si el estado inicial
      // se aplica tarde, se ve un salto feo justo al entrar en la sección.
      gsap.set([eyebrowRef.current, headingRef.current, panelRef.current], {
        autoAlpha: 0,
        y: 20,
      });
      gsap.set(titles, {
        autoAlpha: 0,
        x: -16,
        scale: 0.72,
        color: TEXT_MUTED,
        transformOrigin: "left center",
      });
      gsap.set(descs, { autoAlpha: 0, y: 16 });

      // Timeline único fijado (pin): primero la entrada (eyebrow, título,
      // caja, lista de servicios) y, como último paso de esa misma entrada,
      // el primer título "activa" su tamaño y aparece su descripción — así
      // no hay salto raro entre la entrada y el primer título, es continuo.
      // Después, un paso por servicio: el título activo encoge y se apaga,
      // el siguiente crece y se enciende, y su descripción entra mientras
      // la anterior sale.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: scope.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * (total * 0.7 + 0.2),
          pin: true,
          scrub: 0.6,
        },
      });

      // Entrada acortada a propósito: con scrub, cuanto más dura, más scroll
      // hace falta para verla completa (le "roba" recorrido al ciclo).
      tl.to(eyebrowRef.current, { autoAlpha: 1, y: 0, duration: 0.22, ease: EASE })
        .to(headingRef.current, { autoAlpha: 1, y: 0, duration: 0.28, ease: EASE }, "-=0.14")
        .to(panelRef.current, { autoAlpha: 1, y: 0, duration: 0.28, ease: EASE }, "-=0.14")
        .to(titles, { autoAlpha: 1, x: 0, duration: 0.26, stagger: 0.05, ease: EASE }, "-=0.14")
        .to(titles[0], { scale: 1, color: TEXT, duration: 0.22, ease: EASE }, "-=0.06")
        .to(descs[0], { autoAlpha: 1, y: 0, duration: 0.26, ease: EASE }, "<");

      for (let i = 1; i < total; i++) {
        tl.addLabel(`step${i}`, "+=0.2");
        tl.to(titles[i - 1], { scale: 0.72, color: TEXT_MUTED, duration: 0.5, ease: EASE }, `step${i}`)
          .to(titles[i], { scale: 1, color: TEXT, duration: 0.5, ease: EASE }, `step${i}`)
          .to(descs[i - 1], { autoAlpha: 0, y: -16, duration: 0.5, ease: EASE }, `step${i}`)
          .to(
            descs[i],
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.5,
              ease: EASE,
              onStart: () => setActive(i),
              onReverseComplete: () => setActive(i - 1),
            },
            `step${i}`
          );
      }
    },
    { scope }
  );

  return (
    <section id="servicios" ref={scope} className={styles.section}>
      <div className={`container ${styles.header}`}>
        <p className="eyebrow" ref={eyebrowRef}>
          Servicios
        </p>
        <h2 ref={headingRef} className={styles.heading}>
          En qué puedo ayudarte
        </h2>
      </div>

      <div className={`container ${styles.panel}`} ref={panelRef}>
        <ul className={styles.titleList}>
          {services.map((service, i) => (
            <li
              key={service.title}
              ref={registerTitle}
              className={i === active ? styles.titleActive : styles.titleItem}
            >
              {service.title}
            </li>
          ))}
        </ul>

        <div className={styles.descStage}>
          {services.map((service) => (
            <p className={styles.descItem} key={service.title} ref={registerDesc}>
              {service.description}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
