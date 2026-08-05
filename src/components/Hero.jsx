import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE } from "../lib/gsap";
import { hero } from "../data/content.js";
import { publicUrl } from "../lib/publicUrl.js";
import styles from "./Hero.module.css";

export default function Hero() {
  const scope = useRef(null);
  const videoRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      // Con una sola condición, mm.add() solo dispara el handler cuando ESA
      // condición hace match (aquí: solo si el usuario prefiere movimiento
      // reducido). Añadimos "noPreference" como complementaria para que el
      // handler se ejecute siempre y podamos ramificar dentro con el booleano.
      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          noPreference: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions;

          // Timeline maestro de entrada: cada pieza se solapa con la anterior
          // en vez de esperar a que termine (position parameter "-=").
          const tl = gsap.timeline({
            defaults: { ease: EASE, duration: reduceMotion ? 0 : 0.9 },
          });

          // Título: fromTo explícito y lento, para que la aparición se note.
          tl.fromTo(
            `.${styles.word}`,
            { yPercent: 130, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: reduceMotion ? 0 : 1.4,
              stagger: 0.09,
            }
          )
            // Sin "-=": el subtítulo espera a que el título termine del todo.
            .from(`.${styles.subtitle}`, { autoAlpha: 0, y: 20 });

          const video = videoRef.current;
          let removeSeekedListener = null;

          if (video) {
            if (reduceMotion) {
              // Con reduced-motion evitamos atar el vídeo al scroll: bucle simple y ya.
              video.loop = true;
              video.play().catch(() => {});
            } else {
              video.pause();

              // Animamos un progreso 0→1, no video.currentTime directamente:
              // así decidimos nosotros cuándo se lanza cada seek real (ver
              // más abajo) y, sobre todo, el ScrollTrigger/pin se crea AQUÍ
              // MISMO, de forma síncrona, sin esperar a los metadatos del
              // vídeo. Si esperáramos (con un listener "loadedmetadata"),
              // este pin se registraría más tarde que el de otras secciones,
              // que ya habrían medido su posición sin contar el hueco que
              // añade este pin — y se dispararían antes de tiempo, montándose
              // unas encima de otras. Al ser síncrono, todas las secciones
              // se miden en el mismo momento y en el orden correcto.
              const proxy = { progress: 0 };
              let seeking = false;
              let pendingProgress = null;

              const applyProgress = (p) => {
                if (!video.duration) return; // metadatos aún no listos: no hay nada que buscar todavía
                seeking = true;
                video.currentTime = p * video.duration;
              };

              // Mientras el navegador resuelve un seek, cualquier valor nuevo se
              // guarda como "pendiente" en vez de lanzar otro seek encima; eso es
              // lo que causaba la cola de saltos al scrollear rápido.
              const onSeeked = () => {
                seeking = false;
                if (pendingProgress !== null) {
                  const p = pendingProgress;
                  pendingProgress = null;
                  applyProgress(p);
                }
              };
              video.addEventListener("seeked", onSeeked);
              removeSeekedListener = () =>
                video.removeEventListener("seeked", onSeeked);

              gsap.to(proxy, {
                progress: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: scope.current,
                  start: "top top",
                  // Recorrido de scroll mientras el Hero está fijado: menos
                  // que antes (150%), para que el vídeo no tarde tanto en
                  // soltar y pasar a la siguiente sección.
                  end: "+=80%",
                  pin: true,
                  scrub: 0.5,
                },
                onUpdate: () => {
                  if (seeking) {
                    pendingProgress = proxy.progress;
                  } else {
                    applyProgress(proxy.progress);
                  }
                },
              });

              // "Outro": el texto se mantiene como está durante los primeros
              // dos tercios del pin y se retira en el último tercio — así la
              // sección no suelta de golpe (corte seco), sino que ya se está
              // despidiendo justo cuando Trabajo empieza a asomar por abajo.
              // Comparte el mismo trigger/rango que el scrub del vídeo, pero
              // sin pin (ese ya lo pone el tween de arriba).
              gsap
                .timeline({
                  scrollTrigger: {
                    trigger: scope.current,
                    start: "top top",
                    end: "+=80%",
                    scrub: 0.5,
                  },
                })
                .to({}, { duration: 0.7 })
                .to(`.${styles.copy}`, { autoAlpha: 0.15, y: -24, duration: 0.3, ease: EASE });
            }
          }

          return () => removeSeekedListener?.();
        }
      );

      return () => mm.revert();
    },
    { scope }
  );

  const titleWords = hero.title.split(" ");

  return (
    <section id="top" ref={scope} className={styles.hero}>
      <video
        ref={videoRef}
        className={styles.bgVideo}
        muted
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source src={publicUrl("/hero-loop.mp4")} type="video/mp4" />
      </video>
      <div className={styles.bgDuotone} aria-hidden="true" />
      <div className={styles.bgOverlay} aria-hidden="true" />

      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <h1 className={styles.title}>
            {titleWords.map((word, i) => (
              <span className={styles.wordMask} key={i}>
                <span className={styles.word}>{word}</span>
              </span>
            ))}
          </h1>
          <p className={styles.subtitle}>{hero.subtitle}</p>
        </div>
      </div>
    </section>
  );
}
