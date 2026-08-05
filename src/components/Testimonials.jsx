import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, EASE } from "../lib/gsap";
import { testimonials } from "../data/content.js";
import styles from "./Testimonials.module.css";

function QuoteIcon(props) {
  return (
    <svg viewBox="0 0 32 24" fill="currentColor" {...props}>
      <path d="M13.6 0 8 12.8h4.8V24H0V13.867L5.6 0zm18.4 0-5.6 12.8H31.2V24H18.4V13.867L24 0z" />
    </svg>
  );
}

function AvatarIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" {...props}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M4.5 20c1.4-3.6 4.3-5.6 7.5-5.6s6.1 2 7.5 5.6" strokeLinecap="round" />
    </svg>
  );
}

export default function Testimonials() {
  const scope = useRef(null);

  useGSAP(
    () => {
      // Cabecera: revelación simple, igual que el resto del sitio.
      gsap.set(`.${styles.header} > *`, { autoAlpha: 0, y: 20 });
      ScrollTrigger.create({
        trigger: scope.current,
        start: "top 85%",
        once: true,
        onEnter: () =>
          gsap.to(`.${styles.header} > *`, {
            autoAlpha: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: EASE,
          }),
      });

      // Tarjetas: entran asentándose (leve rotación + escala), no solo un
      // fade — sin fijar la sección, un único paso al llegar a la vista.
      const cards = gsap.utils.toArray(`.${styles.card}`, scope.current);
      gsap.set(cards, {
        autoAlpha: 0,
        y: 46,
        scale: 0.94,
        rotate: (i) => (i % 2 === 0 ? -1.4 : 1.4),
      });

      ScrollTrigger.batch(cards, {
        start: "top 85%",
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotate: 0,
            duration: 0.8,
            stagger: 0.12,
            ease: EASE,
          }),
      });
    },
    { scope }
  );

  return (
    <section id="testimonios" ref={scope} className="section">
      <div className={`container ${styles.header}`}>
        <h2 className={styles.heading}>Lo que dicen mis clientes</h2>
        <p className={styles.disclaimer}>
          Los testimonios de abajo son marcadores de ejemplo, no citas reales de
          clientes. Sustitúyelos antes de publicar el sitio.
        </p>
      </div>

      <div className={`container ${styles.grid}`}>
        {testimonials.map((item, i) => (
          <figure className={styles.card} key={i}>
            {item.isPlaceholder && (
              <span className={styles.badge}>Ejemplo — no es real</span>
            )}
            <QuoteIcon className={styles.quoteMark} />
            <blockquote className={styles.quote}>{item.quote}</blockquote>
            <figcaption className={styles.caption}>
              <span className={styles.avatar}>
                <AvatarIcon width="20" height="20" />
              </span>
              <span>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.role}>{item.role}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
