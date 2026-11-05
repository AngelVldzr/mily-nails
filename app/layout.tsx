import type { Metadata, Viewport } from "next";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/figtree/index.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mily Nail's · Uñas acrílicas, gelish y nail art",
  description:
    "Manicure, uñas acrílicas, gelish y nail art con amor y detalle. Agenda tu cita por WhatsApp y únete al Club Mily para obtener descuentos.",
  openGraph: {
    title: "Mily Nail's",
    description: "Uñas bonitas, hechas con amor y detalle. Agenda por WhatsApp.",
    images: ["/logo.jpg"],
    locale: "es_MX",
    type: "website",
  },
  icons: { apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = { themeColor: "#f4e1f7", viewportFit: "cover", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-MX">
      <body>{children}</body>
    </html>
  );
}
