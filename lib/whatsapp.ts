import { negocio } from "./config";

export function linkWhatsApp(texto: string) {
  return `https://wa.me/${negocio.whatsapp}?text=${encodeURIComponent(texto)}`;
}
