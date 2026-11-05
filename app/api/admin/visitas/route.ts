import { NextResponse } from "next/server";
import { esAdmin } from "@/lib/auth";
import { supabaseServidor } from "@/lib/supabase";
import { descuentoParaVisita, estadoClienta, visitaEnCiclo } from "@/lib/rewards";

export const dynamic = "force-dynamic";

const noAutorizado = () => NextResponse.json({ error: "No autorizado" }, { status: 401 });

async function contar(clientaId: string) {
  const { count } = await supabaseServidor()
    .from("visitas")
    .select("id", { count: "exact", head: true })
    .eq("clienta_id", clientaId);
  return count ?? 0;
}

// POST { clientaId, nota? } → registra una visita y devuelve el descuento aplicado
export async function POST(req: Request) {
  if (!(await esAdmin())) return noAutorizado();
  const { clientaId, nota } = await req.json();
  if (!clientaId) return NextResponse.json({ error: "Falta clientaId" }, { status: 400 });

  const numero = (await contar(clientaId)) + 1;
  const descuento = descuentoParaVisita(numero);
  const { error } = await supabaseServidor()
    .from("visitas")
    .insert({ clienta_id: clientaId, numero, descuento, nota: nota || null });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    ...estadoClienta(numero),
    numero,
    enCiclo: visitaEnCiclo(numero), // 1–10 (la visita 10 se muestra como 10, no como 0)
    descuento,
  });
}

// DELETE { clientaId } → quita la última visita (para corregir errores)
export async function DELETE(req: Request) {
  if (!(await esAdmin())) return noAutorizado();
  const { clientaId } = await req.json();
  const sb = supabaseServidor();
  const { data } = await sb
    .from("visitas")
    .select("id")
    .eq("clienta_id", clientaId)
    .order("fecha", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!data) return NextResponse.json({ error: "No hay visitas para quitar." }, { status: 400 });
  await sb.from("visitas").delete().eq("id", data.id);
  return NextResponse.json({ ok: true, visitas: await contar(clientaId) });
}
