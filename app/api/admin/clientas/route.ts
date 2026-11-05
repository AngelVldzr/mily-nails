import { NextResponse } from "next/server";
import { esAdmin } from "@/lib/auth";
import { supabaseServidor, normalizarTelefono } from "@/lib/supabase";
import { estadoClienta } from "@/lib/rewards";

export const dynamic = "force-dynamic";

const noAutorizado = () => NextResponse.json({ error: "No autorizado" }, { status: 401 });

// GET /api/admin/clientas?q=texto  → busca por nombre o teléfono
export async function GET(req: Request) {
  if (!(await esAdmin())) return noAutorizado();
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  const sb = supabaseServidor();

  let query = sb
    .from("clientas")
    .select("id, nombre, telefono, creado_en, visitas(count)")
    .order("creado_en", { ascending: false })
    .limit(30);

  if (q) {
    const digitos = q.replace(/\D/g, "");
    const limpio = q.replace(/[%,()]/g, "");
    query = digitos.length >= 3
      ? query.ilike("telefono", `%${digitos}%`)
      : query.ilike("nombre", `%${limpio}%`);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const clientas = (data ?? []).map((c: any) => {
    const visitas = c.visitas?.[0]?.count ?? 0;
    return { id: c.id, nombre: c.nombre, telefono: c.telefono, visitas, ...estadoClienta(visitas) };
  });
  return NextResponse.json({ clientas });
}

// POST /api/admin/clientas { nombre, telefono } → crea clienta
export async function POST(req: Request) {
  if (!(await esAdmin())) return noAutorizado();
  const { nombre, telefono } = await req.json();
  const tel = normalizarTelefono(telefono);
  if (!nombre?.trim() || tel.length !== 10) {
    return NextResponse.json({ error: "Nombre y teléfono a 10 dígitos son obligatorios." }, { status: 400 });
  }
  const { data, error } = await supabaseServidor()
    .from("clientas")
    .insert({ nombre: nombre.trim(), telefono: tel })
    .select("id")
    .single();
  if (error) {
    const msg = error.code === "23505" ? "Ese teléfono ya está registrado." : error.message;
    return NextResponse.json({ error: msg }, { status: 400 });
  }
  return NextResponse.json({ id: data.id });
}
