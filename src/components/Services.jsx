import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE } from "../lib/gsap";
import { services } from "../data/content.js";
import { publicUrl } from "../lib/publicUrl.js";
import styles from "./Services.module.css";

// Colores literales (no var(--...)) porque GSAP necesita interpolar entre
// dos valores de color reales, no una referencia a variable CSS.
const TEXT = "#f4f5f3";
const TEXT_MUTED = "#9aa3af";

export default function Services() {
  const scope = useRef(null);
  const headingRef = useRef(null);
  const panelRef = useRef(null);
  const titleRefs = useRef([]);
  const descRefs = useRef([]);
  const mediaRefs = useRef([]);
  const sweepRef = useRef(null);
  titleRefs.current = [];
  descRefs.current = [];
  mediaRefs.current = [];
  const [active, setActive] = useState(0);
  // Espejo del índice activo para leer en callbacks de ScrollTrigger
  // (onEnter/onEnterBack) creados una sola vez al montar: `active` ahí
  // quedaría congelado en su valor inicial (closure), este ref siempre
  // lee el valor actual.
  const activeRef = useRef(0);

  const registerTitle = (el) => {
    if (el) titleRefs.current.push(el);
  };
  const registerDesc = (el) => {
    if (el) descRefs.current.push(el);
  };
  const registerMedia = (el) => {
    if (el) mediaRefs.current.push(el);
  };

  const goToStep = (i) => {
    activeRef.current = i;
    setActive(i);
  };

  // Reproduce el vídeo del servicio i (si tiene) y pausa el resto — evita
  // decodificar de fondo dos vídeos 4K a la vez sin motivo. i = -1 pausa todos.
  // mediaRefs guarda el <div class="mediaLayer"> (lo que anima el wipe), no
  // el <video> — hay que buscarlo dentro.
  const setPlaying = (i) => {
    mediaRefs.current.forEach((layer, idx) => {
      const video = layer.querySelector("video");
      if (!video) return;
      if (idx === i) video.play().catch(() => {});
      else video.pause();
    });
  };

  useGSAP(
    () => {
      const titles = titleRefs.current;
      const descs = descRefs.current;
      const total = descs.length;

      // Todo oculto/pequeño/mudo desde el principio (no en el momento del
      // trigger) — mismo motivo que en useScrollReveal: si el estado inicial
      // se aplica tarde, se ve un salto feo justo al entrar en la sección.
      gsap.set([headingRef.current, panelRef.current], {
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

      // Frame de vídeo: el servicio activo (0) empieza totalmente revelado,
      // el resto totalmente oculto tras el borde derecho — mismo lenguaje
      // que un wipe de escaneo, solo que en reposo. clip-path en vez de
      // autoAlpha porque el barrido necesita animar el propio recorte, no
      // solo la opacidad.
      gsap.set(mediaRefs.current, { clipPath: "inset(0 100% 0 0)" });
      gsap.set(mediaRefs.current[0], { clipPath: "inset(0 0% 0 0)" });
      gsap.set(sweepRef.current, { autoAlpha: 0, left: "0%" });

      // Timeline único fijado (pin): primero la entrada (título, caja, lista
      // de servicios) y, como último paso de esa misma entrada,
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
          // El vídeo del servicio activo solo se reproduce mientras la
          // sección está a la vista — evita decodificar 4K de fondo cuando
          // el usuario todavía no ha llegado a Servicios (o ya la pasó).
          onEnter: () => setPlaying(activeRef.current),
          onEnterBack: () => setPlaying(activeRef.current),
          onLeave: () => setPlaying(-1),
          onLeaveBack: () => setPlaying(-1),
        },
      });

      // Entrada acortada a propósito: con scrub, cuanto más dura, más scroll
      // hace falta para verla completa (le "roba" recorrido al ciclo).
      tl.to(headingRef.current, { autoAlpha: 1, y: 0, duration: 0.28, ease: EASE })
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
              onStart: () => goToStep(i),
              onReverseComplete: () => goToStep(i - 1),
            },
            `step${i}`
          );

        // Barrido de escaneo: una línea roja (acento de marca) cruza el frame de vídeo de
        // izquierda a derecha; el clip-path de la tarjeta saliente se retira
        // exactamente al mismo ritmo que se revela el de la entrante, así el
        // "borde" siempre coincide con la posición de la línea. Se conduce
        // con un proxy (mismo patrón que el scrub de vídeo del Hero) porque
        // hace falta actualizar dos clip-path y una posición a la vez, no
        // una sola propiedad.
        const outgoing = mediaRefs.current[i - 1];
        const incoming = mediaRefs.current[i];
        const wipe = { p: 0 };
        tl.to(
          wipe,
          {
            p: 1,
            duration: 0.5,
            ease: EASE,
            onUpdate: () => {
              const pct = wipe.p * 100;
              gsap.set(outgoing, { clipPath: `inset(0 0% 0 ${pct}%)` });
              gsap.set(incoming, { clipPath: `inset(0 ${100 - pct}% 0 0)` });
              gsap.set(sweepRef.current, { left: `${pct}%` });
            },
            onStart: () => {
              gsap.set(sweepRef.current, { autoAlpha: 1 });
              setPlaying(i);
            },
            onComplete: () => gsap.set(sweepRef.current, { autoAlpha: 0 }),
            onReverseComplete: () => {
              gsap.set(sweepRef.current, { autoAlpha: 0 });
              setPlaying(i - 1);
            },
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

        <div className={styles.mediaCol}>
          <div className={styles.mediaFrame} aria-hidden="true">
            {services.map((service) => (
              <div
                className={`${styles.mediaLayer} ${service.video ? "" : styles.idle}`}
                key={service.title}
                ref={registerMedia}
              >
                {service.video ? (
                  <video className={styles.mediaVideo} muted loop playsInline preload="none">
                    <source src={publicUrl(service.video)} type="video/mp4" />
                  </video>
                ) : (
                  <span className={styles.idleText}>Sin vista previa</span>
                )}
              </div>
            ))}
            <div className={styles.sweepBar} ref={sweepRef} />
            <div className={styles.frameChrome}>
              <span className={styles.recDot} />
              <span className={styles.frameLabel}>
                {services[active].mediaLabel || "Sin vista previa"}
              </span>
            </div>
          </div>

          <div className={styles.descStage}>
            {services.map((service) => (
              <p className={styles.descItem} key={service.title} ref={registerDesc}>
                {service.description}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
