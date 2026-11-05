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

export const servicios = [
  { nombre: "Manicure clásico", desc: "Limado, cutícula, hidratación y esmalte tradicional.", desde: 150 },
  { nombre: "Gelish", desc: "Color que dura de 2 a 3 semanas con brillo intacto.", desde: 250 },
  { nombre: "Uñas acrílicas", desc: "Largo y forma a tu gusto: almendra, cuadrada, coffin…", desde: 400 },
  { nombre: "Rubber / Base niveladora", desc: "Fortalece tu uña natural con acabado natural y elegante.", desde: 300 },
  { nombre: "Nail art", desc: "Francés, líneas, puntos, piedras, efectos y diseños a mano.", desde: 20, unidad: "por uña" },
  { nombre: "Pedicure", desc: "Exfoliación, cuidado completo y esmalte o gelish.", desde: 250 },
];

export const trabajos = [
  { src: "/trabajos/trabajo-1.webp", alt: "Uñas acrílicas cuadradas con diseño rosa, lila y puntos" },
  { src: "/trabajos/trabajo-2.webp", alt: "Uñas almendra nude con detalles en color chocolate" },
  { src: "/trabajos/trabajo-3.webp", alt: "Francés clásico sobre uña natural" },
  { src: "/trabajos/trabajo-4.webp", alt: "Uñas almendra con diseño cromado, piedras y tonos cálidos" },
];
