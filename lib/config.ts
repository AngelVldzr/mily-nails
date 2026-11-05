// ─────────────────────────────────────────────────────────────
//  CONFIGURACIÓN DEL NEGOCIO — edita aquí textos, precios y enlaces
// ─────────────────────────────────────────────────────────────

export const negocio = {
  nombre: "Mily Nail's",
  slogan: "Uñas bonitas, hechas con amor y detalle",
  // WhatsApp en formato internacional SIN "+" ni espacios (México: 52 + 10 dígitos)
  whatsapp: "527441584351",
  whatsappVisible: "+52 744 158 4351",
  horario: [
    { dias: "Lunes a Viernes", horas: "10:00 – 19:00" },
    { dias: "Sábado", horas: "10:00 – 16:00" },
    { dias: "Domingo", horas: "Cerrado" },
  ],
  // Texto de la dirección (opcional). Déjalo vacío si no quieres mostrarla.
  direccion: "",
  mapsLink: "https://maps.app.goo.gl/mCnMTn22KEdRpwht7?g_st=iw",
  // Pega aquí el "src" del iframe de Google Maps → Compartir → Insertar un mapa
  mapsEmbed: "",
};

export const redes = {
  facebook: "https://www.facebook.com/share/1CT2BqYQLf/?mibextid=wwXIfr",
  instagram: "https://www.instagram.com/mily_nailssss",
  tiktok: "https://www.tiktok.com/@mily_nails50",
  tiktokUsuario: "mily_nails50",
};

// Videos de TikTok a mostrar: pega el link completo de cada video
// ej. "https://www.tiktok.com/@mily_nails50/video/7412345678901234567"
export const videosTikTok: string[] = [];

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
