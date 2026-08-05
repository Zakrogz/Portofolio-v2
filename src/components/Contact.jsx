import { useState } from "react";
import { useScrollReveal } from "../hooks/useScrollReveal.js";
import { contact } from "../data/content.js";
import styles from "./Contact.module.css";

const initialForm = { name: "", email: "", projectType: "", message: "" };

function MailIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" {...props}>
      <rect x="2.5" y="4.5" width="19" height="15" rx="2.5" />
      <path d="m3.5 6 8.5 7 8.5-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Contact() {
  const scope = useScrollReveal();
  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = `Proyecto de vídeo — ${form.name || "Sin nombre"}`;
    const body = [
      `Nombre: ${form.name}`,
      `Email: ${form.email}`,
      `Tipo de proyecto: ${form.projectType}`,
      "",
      form.message,
    ].join("\n");

    const mailto = `mailto:${contact.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
  };

  return (
    <section id="contacto" ref={scope} className="section">
      <div className={`container ${styles.layout}`}>
        <div className={styles.info}>
          <p className="eyebrow" data-reveal>
            Contacto
          </p>
          <h2 className={styles.heading} data-reveal>
            Cuéntame de tu proyecto
          </h2>
          <p className={styles.note} data-reveal>
            {contact.note}
          </p>
          <a href={`mailto:${contact.email}`} className={styles.emailLink} data-reveal>
            <MailIcon width="18" height="18" />
            {contact.email}
          </a>
        </div>

        <form className={`${styles.form} ${styles.panel}`} onSubmit={handleSubmit} data-reveal>
          <div className={styles.row}>
            <label className={styles.field}>
              <span>Nombre</span>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
              />
            </label>
            <label className={styles.field}>
              <span>Email</span>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
              />
            </label>
          </div>

          <label className={styles.field}>
            <span>Tipo de proyecto</span>
            <input
              type="text"
              name="projectType"
              placeholder="Ej: serie de YouTube long-form + shorts"
              value={form.projectType}
              onChange={handleChange}
            />
          </label>

          <label className={styles.field}>
            <span>Cuéntame más</span>
            <textarea
              name="message"
              rows={5}
              required
              value={form.message}
              onChange={handleChange}
            />
          </label>

          <button type="submit" className="btn btn-primary">
            Enviar por email
          </button>
        </form>
      </div>
    </section>
  );
}
