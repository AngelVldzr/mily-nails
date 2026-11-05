/**
 * COTIZADOR DE UÑAS
 * ------------------------------------------------------------------
 * Espacio reservado para la calculadora que se integrará después.
 * Cuando tengas el archivo HTML, su lógica se convierte en este componente
 * (o se carga como /public/cotizador.html dentro de un iframe).
 */
import { linkWhatsApp } from "@/lib/whatsapp";
import { Pincel } from "./Icons";

export default function Cotizador() {
  return (
    <div className="cotizador tarjeta">
      <div className="cotizador-ico"><Pincel size={40} /></div>
      <h3>Calculadora de precio</h3>
      <p>
        Muy pronto podrás elegir largo, forma y decoración para saber cuánto cuestan tus uñas al instante.
      </p>
      <a className="btn btn-secundario" href={linkWhatsApp("¡Hola Mily! 💅 Quisiera una cotización para este diseño:")} target="_blank" rel="noopener noreferrer">
        Mientras tanto, cotiza por WhatsApp
      </a>
    </div>
  );
}
