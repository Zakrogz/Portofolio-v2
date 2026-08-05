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

      const links = nav
        .map((item) => ({ href: item.href, el: document.querySelector(item.href) }))
        .filter((l) => l.el);

      if (!links.length) return;

      // Cuál link está activo: la última sección (en orden de página) cuyo
      // borde superior ya ha cruzado el centro de la pantalla, medido EN VIVO
      // en cada scroll (getBoundingClientRect, no coordenadas cacheadas). Con
      // Hero/Trabajo/Servicios fijados (pin) de por medio, un ScrollTrigger
      // por sección con start/end fijo calcula esas coordenadas en el
      // momento de crearse — como el Nav se monta antes que esas secciones
      // creen su pin, quedan obsoletas en cuanto el pin añade su hueco extra
      // de scroll. Medir en vivo lo evita sin depender del orden de montaje.
      ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        onUpdate: () => {
          const centerY = window.innerHeight / 2;
          let current = null;
          for (const link of links) {
            if (link.el.getBoundingClientRect().top <= centerY) {
              current = link.href;
            }
          }
          setActive((prev) => (prev === current ? prev : current));
        },
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
