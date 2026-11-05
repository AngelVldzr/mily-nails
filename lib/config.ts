// ─────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DEL NEGOCIO — edita aquí textos, precios y enlaces
// ─────────────────────────────────────────────────────────────

export const negocio = {
  nombre: "Mily Nail's",
  slogan: "Uñas bonitas, hechas con amor y detalle",
  // WhatsApp en formato internacional SIN "+" ni espacios (México: 52 + 10 dígitos)
  whatsapp: "527441584351",
  whatsappVisible: "+52 744 158 4351",
  // Las citas se dan según disponibilidad (se confirma por WhatsApp)
  horario: "Citas según disponibilidad",
  horarioNota: "Escríbenos por WhatsApp y te compartimos los espacios libres de la semana.",
  direccion: "Condominio Venus 60, Granjas del Marqués, 39890 Acapulco de Juárez, Gro.",
  mapsLink: "https://maps.app.goo.gl/mCnMTn22KEdRpwht7?g_st=iw",
  // Mapa incrustado (no requiere API key)
  mapsEmbed:
    "https://www.google.com/maps?q=" +
    encodeURIComponent("Condominio Venus 60, Granjas del Marqués, 39890 Acapulco de Juárez, Gro.") +
    "&z=17&output=embed",
};

export const redes = {
  facebook: "https://www.facebook.com/share/1CT2BqYQLf/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/mily_nailssss",
  tiktok: "https://www.tiktok.com/@mily_nails50",
  tiktokUsuario: "mily_nails50",
};

// Videos de TikTok a mostrar. Acepta links cortos (vt.tiktok.com/...) o completos
// (https://www.tiktok.com/@mily_nails50/video/7412345678901234567).
// Los links cortos se convierten solos en el servidor al publicar en Vercel.
export const videosTikTok: string[] = [
  "https://vt.tiktok.com/ZSp2njVGv/",
  "https://vt.tiktok.com/ZSp2nJdpR/",
  "https://vt.tiktok.com/ZSp2tovb6/",
];

// Precios reales "desde" (el detalle completo está en lib/precios.ts → cotizador)
export const servicios = [
  { nombre: "Soft Gel", desc: "Extensión ligera y natural en 9 largos, con 2 tonos lisos incluidos.", desde: 280 },
  { nombre: "Rubber · Manos", desc: "Gel semipermanente con base rubber que fortalece tu uña natural.", desde: 200 },
  { nombre: "Rubber · Pies", desc: "Gel semipermanente con rubber para unos pies impecables.", desde: 200 },
  { nombre: "Efectos y nail art", desc: "Espejo, aurora, ojo de gato, francés, 3D, encapsulado y más.", desde: 5, unidad: "por uña" },
  { nombre: "Cristales", desc: "Desde detalles pequeños hasta uña completa de cristal.", desde: 20, unidad: "por uña" },
  { nombre: "Retiros y reposiciones", desc: "Retiro de Soft Gel o acrílico y reposición de uñas.", desde: 10, unidad: "por uña" },
];

export const trabajos = [
  { src: "/trabajos/trabajo-1.webp", alt: "Uñas largas cuadradas con diseño rosa, lila y puntos" },
  { src: "/trabajos/trabajo-2.webp", alt: "Uñas almendra nude con detalles en color chocolate" },
  { src: "/trabajos/trabajo-3.webp", alt: "Francés clásico sobre uña natural" },
  { src: "/trabajos/trabajo-4.webp", alt: "Uñas almendra con diseño cromado, piedras y tonos cálidos" },
];
