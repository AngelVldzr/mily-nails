import type { Metadata } from "next";
import Link from "next/link";
import { negocio } from "@/lib/config";

export const metadata: Metadata = {
  title: "Aviso de privacidad · Mily Nail's",
  description: "Cómo cuida Mily Nail's los datos personales de sus clientas.",
};

/*
 * PLANTILLA de aviso de privacidad simplificado/integral.
 * Revísala con un asesor antes de publicarla de forma definitiva.
 */
export default function Privacidad() {
  return (
    <main className="legal">
      <Link href="/" className="legal-volver">← Volver al inicio</Link>
      <article className="tarjeta">
        <h1>Aviso de privacidad</h1>
        <p className="nota">Última actualización: noviembre de 2026</p>

        <h2>¿Quién es responsable de tus datos?</h2>
        <p>
          {negocio.nombre}, con domicilio en {negocio.direccion}, es responsable del uso y protección de
          tus datos personales. Puedes contactarnos por WhatsApp al {negocio.whatsappVisible}.
        </p>

        <h2>¿Qué datos usamos?</h2>
        <ul>
          <li>Tu nombre.</li>
          <li>Tu número de WhatsApp.</li>
          <li>Las fechas de tus visitas y los descuentos aplicados del Club Mily.</li>
        </ul>
        <p>No solicitamos datos financieros ni datos sensibles.</p>

        <h2>¿Para qué los usamos?</h2>
        <ul>
          <li>Administrar tu tarjeta de sellos y aplicar tus descuentos del Club Mily.</li>
          <li>Contactarte por WhatsApp para confirmar citas o avisarte de tu progreso.</li>
        </ul>
        <p>No usamos tus datos para publicidad de terceros ni los vendemos.</p>

        <h2>¿Con quién se comparten?</h2>
        <p>
          Solo con los proveedores tecnológicos que hacen funcionar la página (alojamiento web y base de
          datos), que los guardan de forma cifrada y no pueden usarlos para fines propios. Al consultar tus
          sellos en la página solo se muestra tu progreso, nunca tu nombre ni tu número.
        </p>

        <h2>Tus derechos</h2>
        <p>
          Puedes pedir en cualquier momento <b>ver, corregir o borrar</b> tus datos, u oponerte a su uso,
          escribiéndonos por WhatsApp. Al borrar tus datos también se elimina tu historial de sellos.
        </p>

        <h2>Información técnica</h2>
        <p>
          Esta página no usa cookies de rastreo ni publicidad. Para evitar abusos guardamos temporalmente
          (24 horas) una huella cifrada e irreconocible de la conexión, nunca tu dirección IP real.
        </p>

        <h2>Cambios a este aviso</h2>
        <p>Cualquier cambio se publicará en esta misma página.</p>
      </article>
    </main>
  );
}
