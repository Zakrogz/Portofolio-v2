import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { process } from "../data/content.js";
import styles from "./Process.module.css";

export default function Process() {
  const scope = useScrollReveal({ stagger: 0.15 });

  return (
    <section id="proceso" ref={scope} className="section">
      <div className="container">
        <p className="eyebrow" data-reveal>
          Cómo trabajo
        </p>
        <h2 className={styles.heading} data-reveal>
          Cuatro pasos, sin sorpresas
        </h2>

        <ol className={styles.list}>
          {process.map((item) => (
            <li className={styles.item} key={item.step} data-reveal>
              <span className={styles.step}>{item.step}</span>
              <div>
                <h3 className={styles.title}>{item.title}</h3>
                <p className={styles.description}>{item.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
