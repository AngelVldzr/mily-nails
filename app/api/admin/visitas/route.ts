import { NextResponse } from "next/server";
import { esAdmin } from "@/lib/auth";
import { supabaseServidor } from "@/lib/supabase";
import { descuentoParaVisita, estadoClienta, visitaEnCiclo } from "@/lib/rewards";
import { error, esUUID, leerJSON, mismoOrigen, textoLimpio } from "@/lib/seguridad";

export const dynamic = "force-dynamic";

const noAutorizado = () => error("No autorizado", 401);

async function contar(clientaId: string) {
  const { count, error: e } = await supabaseServidor()
    .from("visitas")
    .select("id", { count: "exact", head: true })
    .eq("clienta_id", clientaId);
  if (e) throw e;
  return count ?? 0;
}

// POST { clientaId, nota? } → registra una visita y devuelve el descuento aplicado
export async function POST(req: Request) {
  if (!mismoOrigen(req)) return error("Origen no permitido", 403);
  if (!(await esAdmin())) return noAutorizado();

  const body = await leerJSON(req, 600);
  const clientaId = body?.clientaId;
  if (!esUUID(clientaId)) return error("Clienta no válida.");
  const nota = textoLimpio(body?.nota, 200) || null;

  try {
    const numero = (await contar(clientaId)) + 1;
    const descuento = descuentoParaVisita(numero);
    const { error: e } = await supabaseServidor()
      .from("visitas")
      .insert({ clienta_id: clientaId, numero, descuento, nota });
    if (e) {
      // La base de datos no permite dos visitas con el mismo número (evita doble toque)
      if (e.code === "23505") return error("Esa visita ya se había registrado. Recarga la lista.", 409);
      if (e.code === "23503") return error("La clienta ya no existe.", 404);
      throw e;
    }
    return NextResponse.json({
      ...estadoClienta(numero),
      numero,
      enCiclo: visitaEnCiclo(numero), // 1–10 (la visita 10 se muestra como 10, no como 0)
      descuento,
    });
  } catch (e) {
    console.error("visitas POST", (e as any)?.code ?? (e as Error).message);
    return error("No se pudo registrar la visita.", 500);
  }
}

// DELETE { clientaId } → quita la última visita (para corregir errores)
export async function DELETE(req: Request) {
  if (!mismoOrigen(req)) return error("Origen no permitido", 403);
  if (!(await esAdmin())) return noAutorizado();

  const body = await leerJSON(req, 300);
  const clientaId = body?.clientaId;
  if (!esUUID(clientaId)) return error("Clienta no válida.");

  try {
    const sb = supabaseServidor();
    const { data } = await sb
      .from("visitas")
      .select("id")
      .eq("clienta_id", clientaId)
      .order("numero", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!data) return error("No hay visitas para quitar.");
    const { error: e } = await sb.from("visitas").delete().eq("id", data.id);
    if (e) throw e;
    return NextResponse.json({ ok: true, visitas: await contar(clientaId) });
  } catch (e) {
    console.error("visitas DELETE", (e as any)?.code ?? (e as Error).message);
    return error("No se pudo quitar la visita.", 500);
  }
}
