import "server-only";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * SESIÓN DEL PANEL DE MILY
 * - La cookie lleva una fecha de vencimiento firmada (no se puede alterar sin el secreto).
 * - En producción usa el prefijo "__Host-": solo viaja por HTTPS y solo a este dominio.
 * - Si las variables de entorno faltan o son débiles, el panel NO abre (falla cerrado).
 * - Para cerrar TODAS las sesiones abiertas (ej. si pierdes el celular): cambia ADMIN_SECRET en Vercel.
 */
export const COOKIE = process.env.NODE_ENV === "production" ? "__Host-mily_admin" : "mily_admin";
export const DURACION_SESION = 60 * 60 * 24 * 7; // 7 días

const MIN_SECRETO = 32;
const MIN_PASSWORD = 10;

export function configuracionSegura() {
  const s = process.env.ADMIN_SECRET ?? "";
  const p = process.env.ADMIN_PASSWORD ?? "";
  return s.length >= MIN_SECRETO && p.length >= MIN_PASSWORD && s !== p;
}

function firmar(datos: string) {
  return createHmac("sha256", process.env.ADMIN_SECRET as string).update(datos).digest("base64url");
}

function iguales(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function passwordCorrecta(p: string) {
  if (!configuracionSegura()) return false;
  // Comparamos las huellas (mismo largo siempre) para no revelar nada por el tiempo de respuesta
  const h = (v: string) => createHmac("sha256", process.env.ADMIN_SECRET as string).update(v).digest("hex");
  return iguales(h(p), h(process.env.ADMIN_PASSWORD as string));
}

export function crearToken() {
  const exp = Math.floor(Date.now() / 1000) + DURACION_SESION;
  const datos = Buffer.from(JSON.stringify({ exp, v: 1 })).toString("base64url");
  return `${datos}.${firmar(datos)}`;
}

export function tokenValido(token: string | undefined) {
  if (!token || !configuracionSegura()) return false;
  const [datos, firma] = token.split(".");
  if (!datos || !firma || !iguales(firma, firmar(datos))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(datos, "base64url").toString());
    return typeof exp === "number" && exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export async function esAdmin() {
  return tokenValido((await cookies()).get(COOKIE)?.value);
}
