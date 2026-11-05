import { NextResponse } from "next/server";
import { supabaseServidor, normalizarTelefono } from "@/lib/supabase";
import { estadoClienta } from "@/lib/rewards";
import { dentroDelLimite, error, huellaIP, leerJSON, mismoOrigen, registrarIntento } from "@/lib/seguridad";

export const dynamic = "force-dynamic";

const MAX_CONSULTAS = 10; // por dispositivo/red…
const VENTANA_MIN = 15;   // …cada 15 minutos

/**
 * Consulta pública de sellos.
 * PRIVACIDAD: no devuelve el nombre ni el teléfono de la clienta, solo su progreso.
 * Así nadie puede probar números al azar para averiguar quién es clienta.
 */
export async function POST(req: Request) {
  if (!mismoOrigen(req)) return error("Origen no permitido", 403);
  try {
    const clave = `consulta:${huellaIP(req)}`;
    if (!(await dentroDelLimite(clave, MAX_CONSULTAS, VENTANA_MIN))) {
      return error("Hiciste muchas consultas seguidas. Intenta en unos minutos 💜", 429);
    }
    await registrarIntento(clave);

    const body = await leerJSON(req, 300);
    const tel = normalizarTelefono(body?.telefono);
    if (tel.length !== 10) return error("Escribe tu número a 10 dígitos.");

    const sb = supabaseServidor();
    const { data: clienta } = await sb.from("clientas").select("id").eq("telefono", tel).maybeSingle();

    if (!clienta) {
      return NextResponse.json({ encontrada: false }, { headers: { "Cache-Control": "no-store" } });
    }
    const { count } = await sb
      .from("visitas")
      .select("id", { count: "exact", head: true })
      .eq("clienta_id", clienta.id);

    const visitas = count ?? 0;
    return NextResponse.json(
      { encontrada: true, visitas, ...estadoClienta(visitas) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (e) {
    console.error("consulta", (e as Error).message);
    return error("No pudimos consultar en este momento.", 500);
  }
}
