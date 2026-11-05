import { NextResponse } from "next/server";
import { COOKIE, DURACION_SESION, configuracionSegura, crearToken, passwordCorrecta } from "@/lib/auth";
import { dentroDelLimite, error, huellaIP, leerJSON, mismoOrigen, registrarIntento } from "@/lib/seguridad";

export const dynamic = "force-dynamic";

const MAX_FALLOS = 5;     // intentos fallidos permitidos…
const VENTANA_MIN = 15;   // …cada 15 minutos por dispositivo/red

export async function POST(req: Request) {
  if (!mismoOrigen(req)) return error("Origen no permitido", 403);
  if (!configuracionSegura()) {
    console.error("Panel deshabilitado: ADMIN_PASSWORD (mín. 10) o ADMIN_SECRET (mín. 32) faltan o son débiles.");
    return error("El panel no está configurado todavía.", 503);
  }

  const clave = `login:${huellaIP(req)}`;
  try {
    if (!(await dentroDelLimite(clave, MAX_FALLOS, VENTANA_MIN))) {
      return error("Demasiados intentos. Espera 15 minutos e intenta de nuevo.", 429);
    }

    const body = await leerJSON(req, 500);
    const password = typeof body?.password === "string" ? body.password.slice(0, 200) : "";

    if (!passwordCorrecta(password)) {
      await registrarIntento(clave);
      await new Promise((r) => setTimeout(r, 600));
      return error("Contraseña incorrecta", 401);
    }
  } catch (e) {
    console.error("login", (e as Error).message);
    return error("No se pudo iniciar sesión en este momento.", 500);
  }

  const res = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  res.cookies.set(COOKIE, crearToken(), {
    httpOnly: true,                                   // JavaScript no puede leerla
    secure: process.env.NODE_ENV === "production",    // solo por HTTPS
    sameSite: "strict",                               // no viaja desde otros sitios
    path: "/",
    maxAge: DURACION_SESION,
  });
  return res;
}
