import { contact } from "../data/content.js";
import styles from "./Footer.module.css";

// Solo decorativas, a propósito sin enlazar a ningún sitio: Diego Soler es
// una marca de ejemplo para este portfolio, no existe una cuenta real detrás.
const SOCIALS = [
  { icon: "/icons/insta.png", label: "Instagram (ejemplo, sin cuenta real)" },
  { icon: "/icons/x.png", label: "X (ejemplo, sin cuenta real)" },
  { icon: "/icons/fb.png", label: "Facebook (ejemplo, sin cuenta real)" },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span>Diego Soler — Edición de vídeo</span>

        <span className={styles.socials} aria-hidden="true">
          {SOCIALS.map((s) => (
            <img key={s.icon} src={s.icon} alt="" title={s.label} className={styles.socialIcon} />
          ))}
        </span>

        <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
