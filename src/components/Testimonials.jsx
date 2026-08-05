import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { testimonials } from "../data/content.js";
import styles from "./Testimonials.module.css";

export default function Testimonials() {
  const scope = useScrollReveal();

  return (
    <section id="testimonios" ref={scope} className="section">
      <div className="container">
        <p className="eyebrow" data-reveal>
          Testimonios
        </p>
        <h2 className={styles.heading} data-reveal>
          Ejemplos de cómo se vería esta sección
        </h2>
        <p className={styles.disclaimer} data-reveal>
          Los testimonios de abajo son marcadores de ejemplo, no citas reales
          de clientes. Sustitúyelos antes de publicar el sitio.
        </p>

        <div className={styles.grid}>
          {testimonials.map((item, i) => (
            <figure className={styles.card} key={i} data-reveal>
              {item.isPlaceholder && (
                <span className={styles.badge}>Ejemplo — no es real</span>
              )}
              <blockquote className={styles.quote}>“{item.quote}”</blockquote>
              <figcaption className={styles.caption}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.role}>{item.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
