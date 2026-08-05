import { useScrollReveal } from "../hooks/useScrollReveal.js";
import {
  AdobePremiereIcon,
  AdobeAfterEffectsIcon,
  DaVinciResolveIcon,
  FilmoraIcon,
} from "./icons/ToolIcons.jsx";
import styles from "./Process.module.css";

const TOOLS = [
  { name: "Premiere Pro", Icon: AdobePremiereIcon, native: true },
  { name: "After Effects", Icon: AdobeAfterEffectsIcon, native: true },
  { name: "DaVinci Resolve", Icon: DaVinciResolveIcon, native: false },
  { name: "Filmora", Icon: FilmoraIcon, native: false },
];

export default function Process() {
  const scope = useScrollReveal({ stagger: 0.15 });

  return (
    <section id="proceso" ref={scope} className="section">
      <div className="container">
        <p className={styles.toolsLabel} data-reveal>
          Con qué edito
        </p>
        <ul className={styles.toolsGrid}>
          {TOOLS.map(({ name, Icon, native }) => (
            <li className={styles.toolCard} key={name} data-reveal>
              <span className={`${styles.toolIcon} ${native ? styles.toolIconNative : ""}`}>
                <Icon />
              </span>
              <span className={styles.toolName}>{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
