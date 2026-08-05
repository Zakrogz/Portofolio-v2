export const nav = [
  { label: "Trabajo", href: "#trabajo" },
  { label: "Proceso", href: "#proceso" },
  { label: "Servicios", href: "#servicios" },
  { label: "Contacto", href: "#contacto" },
];

export const hero = {
  title: "Edito el vídeo que hace que alguien se quede a ver el siguiente.",
  subtitle:
    "Trabajo con creadores de YouTube en el corte, el ritmo y el color: desde el long-form hasta los shorts que salen de ahí. Sin procesos eternos ni entregas a última hora.",
  ctaPrimary: { label: "Ver trabajo reciente", href: "#trabajo" },
  ctaSecondary: { label: "Hablemos de tu proyecto", href: "#contacto" },
};

// Datos de negocio reales del servicio — editables por Diego, no cifras de marketing.
export const process = [
  {
    step: "01",
    title: "Brief y material en bruto",
    description:
      "Me pasas el metraje, referencias y el objetivo del vídeo. Aclaramos duración, tono y dónde se va a publicar antes de tocar el timeline.",
  },
  {
    step: "02",
    title: "Primer corte",
    description:
      "Estructura, ritmo y selección de tomas. Entrego el primer corte en 3–5 días laborables según la duración del proyecto.",
  },
  {
    step: "03",
    title: "Revisiones",
    description:
      "Dos rondas de cambios incluidas en el precio. Feedback con timestamps, cambios aplicados y nueva versión en 48h.",
  },
  {
    step: "04",
    title: "Color, sonido y entrega",
    description:
      "Corrección de color, mezcla de audio y motion graphics si el proyecto lo lleva. Entrega en los formatos y resoluciones que necesites para cada plataforma.",
  },
];

export const services = [
  {
    title: "Edición long-form",
    description:
      "Montaje narrativo para vídeos de YouTube de formato largo: estructura, ritmo y cortes que sostienen la retención sin perder el mensaje.",
    video: "/timeline.mp4",
    mediaLabel: "Premiere Pro — Timeline",
  },
  {
    title: "Shorts y reels",
    description:
      "Recortes verticales pensados para el formato, no un long-form encogido: ganchos en el primer segundo, subtítulos y ritmo propio.",
  },
  {
    title: "Color grading",
    description:
      "Corrección y etalonaje para que el vídeo tenga una imagen consistente entre tomas y coherente con la identidad del canal.",
    video: "/color-grade.mp4",
    mediaLabel: "DaVinci Resolve — Color",
  },
  {
    title: "Motion graphics",
    description:
      "Lower thirds, transiciones y gráficos animados a medida para títulos, datos en pantalla o intros de canal.",
  },
];

// Placeholders de ejemplo — sustituir por testimonios reales de clientes cuando existan.
export const testimonials = [
  {
    quote:
      "Ejemplo de testimonio: aquí iría la valoración real de un cliente sobre el resultado y la forma de trabajar.",
    name: "Nombre del cliente",
    role: "Rol · Canal (ejemplo)",
    isPlaceholder: true,
  },
  {
    quote:
      "Ejemplo de testimonio: este espacio está reservado para una cita real, no debe publicarse tal cual.",
    name: "Nombre del cliente",
    role: "Rol · Canal (ejemplo)",
    isPlaceholder: true,
  },
  {
    quote:
      "Ejemplo de testimonio: sustituir por comentarios reales antes de publicar el sitio.",
    name: "Nombre del cliente",
    role: "Rol · Canal (ejemplo)",
    isPlaceholder: true,
  },
];

// Cada proyecto espera un vídeo en /public/work/<file>.mp4 (o una imagen de portada en /public/work/<file>.jpg).
// Mientras no exista el archivo, la tarjeta muestra el degradado de marca con el título como marcador visual.
export const work = [
  {
    title: "Serie documental — canal de viajes",
    tags: ["Long-form", "Color grading"],
    video: "/work/proyecto-01.mp4",
    poster: "/work/proyecto-01.jpg",
    views: "236K",
    duration: "18:24",
  },
  {
    title: "Shorts semanales — canal de tecnología",
    tags: ["Shorts", "Motion graphics"],
    video: "/work/proyecto-02.mp4",
    poster: "/work/proyecto-02.jpg",
    views: "84K",
    duration: "0:47",
  },
  {
    title: "Vlog semanal — creador de estilo de vida",
    tags: ["Long-form", "Sonido"],
    video: "/work/proyecto-03.mp4",
    poster: "/work/proyecto-03.jpg",
    views: "152K",
    duration: "12:03",
  },
  {
    title: "Reels de producto — marca de audio",
    tags: ["Shorts", "Color grading"],
    video: "/work/proyecto-04.mp4",
    poster: "/work/proyecto-04.jpg",
    views: "61K",
    duration: "0:31",
  },
  {
    title: "Entrevistas — podcast en vídeo",
    tags: ["Long-form", "Motion graphics"],
    video: "/work/proyecto-05.mp4",
    poster: "/work/proyecto-05.jpg",
    views: "198K",
    duration: "24:56",
  },
  {
    title: "Recap de evento — canal gaming",
    tags: ["Long-form", "Shorts"],
    video: "/work/proyecto-06.mp4",
    poster: "/work/proyecto-06.jpg",
    views: "117K",
    duration: "3:12",
  },
];

export const contact = {
  email: "hola@diegosoler.com",
  note: "Respondo en menos de 48h laborables. Cuéntame el canal, el tipo de vídeo y los plazos que manejas.",
};
