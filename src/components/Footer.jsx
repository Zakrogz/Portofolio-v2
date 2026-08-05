import { contact } from "../data/content.js";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <span>Diego Soler — Edición de vídeo</span>
        <a href={`mailto:${contact.email}`}>{contact.email}</a>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}
