// Vite solo reescribe las rutas absolutas que él mismo procesa en index.html
// (favicon, script de entrada). Cualquier ruta a public/ escrita a mano en
// JS/CSS (vídeos, iconos...) hay que resolverla contra BASE_URL, o se rompe
// en cuanto el sitio no se sirve desde la raíz del dominio (GitHub Pages).
export function publicUrl(path) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
