import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { services } from "../data/content.js";
import styles from "./Services.module.css";

export default function Services() {
  const scope = useScrollReveal();

  return (
    <section id="servicios" ref={scope} className="section">
      <div className="container">
        <p className="eyebrow" data-reveal>
          Servicios
        </p>
        <h2 className={styles.heading} data-reveal>
          En qué puedo ayudarte
        </h2>

        <div className={styles.grid}>
          {services.map((service) => (
            <article className={styles.card} key={service.title} data-reveal>
              <h3 className={styles.title}>{service.title}</h3>
              <p className={styles.description}>{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
