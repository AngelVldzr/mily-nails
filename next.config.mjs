// Cabeceras de seguridad que el navegador aplica a TODAS las páginas.
const esDev = process.env.NODE_ENV !== "production";

const csp = [
  "default-src 'self'",
  // Next.js inyecta pequeños scripts en línea; en desarrollo también necesita 'unsafe-eval'
  `script-src 'self' 'unsafe-inline'${esDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'",
  // Solo se permiten estos sitios dentro de recuadros (videos y mapa)
  "frame-src https://www.tiktok.com https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",      // nadie puede meter esta página dentro de otra (anti-clickjacking)
  "form-action 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  ...(esDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const cabeceras = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false, // no anunciar qué tecnología usa el sitio
  images: { formats: ["image/avif", "image/webp"] },
  async headers() {
    return [
      { source: "/:path*", headers: cabeceras },
      // El panel y la API nunca se guardan en caché ni en buscadores
      {
        source: "/(panel|api)/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
        ],
      },
      { source: "/panel", headers: [{ key: "Cache-Control", value: "no-store" }, { key: "X-Robots-Tag", value: "noindex, nofollow" }] },
    ];
  },
};

export default nextConfig;
