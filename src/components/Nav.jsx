import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, ScrollTrigger } from "../lib/gsap";
import { nav } from "../data/content.js";
import styles from "./Nav.module.css";

export default function Nav() {
  const scope = useRef(null);
  const [active, setActive] = useState(null);

  useGSAP(
    () => {
      gsap.from(scope.current, {
        autoAlpha: 0,
        y: -16,
        duration: 0.7,
        ease: EASE,
      });

      // Un ScrollTrigger por sección enlazada: mientras esté cruzando el
      // centro de la pantalla, marca su link como activo en el nav.
      nav.forEach((item) => {
        const target = document.querySelector(item.href);
        if (!target) return;

        ScrollTrigger.create({
          trigger: target,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) setActive(item.href);
          },
        });
      });
    },
    { scope }
  );

  return (
    <header ref={scope} className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.logo}>
          Diego Soler
        </a>
        <nav className={styles.links}>
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={item.href === active ? styles.active : undefined}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <a href="#contacto" className={`btn btn-secondary ${styles.cta}`}>
          Hablemos
        </a>
      </div>
    </header>
  );
}
