import { NextResponse } from "next/server";
import { supabaseServidor, normalizarTelefono } from "@/lib/supabase";
import { estadoClienta } from "@/lib/rewards";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { telefono } = await req.json();
    const tel = normalizarTelefono(telefono);
    if (tel.length !== 10) {
      return NextResponse.json({ error: "Escribe tu número a 10 dígitos." }, { status: 400 });
    }
    const sb = supabaseServidor();
    const { data: clienta } = await sb
      .from("clientas")
      .select("id, nombre")
      .eq("telefono", tel)
      .maybeSingle();

    if (!clienta) {
      return NextResponse.json({ encontrada: false });
    }
    const { count } = await sb
      .from("visitas")
      .select("id", { count: "exact", head: true })
      .eq("clienta_id", clienta.id);

    const visitas = count ?? 0;
    return NextResponse.json({
      encontrada: true,
      nombre: String(clienta.nombre).split(" ")[0], // solo el primer nombre
      visitas,
      ...estadoClienta(visitas),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "No pudimos consultar en este momento." }, { status: 500 });
  }
}
