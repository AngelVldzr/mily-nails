import { NextResponse } from "next/server";
import { esAdmin } from "@/lib/auth";
import { supabaseServidor, normalizarTelefono } from "@/lib/supabase";
import { estadoClienta } from "@/lib/rewards";
import { error, leerJSON, mismoOrigen, textoLimpio } from "@/lib/seguridad";

export const dynamic = "force-dynamic";

const noAutorizado = () => error("No autorizado", 401);

// GET /api/admin/clientas?q=texto  → busca por nombre o teléfono
export async function GET(req: Request) {
  if (!(await esAdmin())) return noAutorizado();
  try {
    const q = textoLimpio(new URL(req.url).searchParams.get("q"), 60);
    const sb = supabaseServidor();

    let query = sb
      .from("clientas")
      .select("id, nombre, telefono, creado_en, visitas(count)")
      .order("creado_en", { ascending: false })
      .limit(30);

    if (q) {
      const digitos = q.replace(/\D/g, "");
      // Escapamos los comodines de búsqueda para que se busquen como texto normal
      const seguro = q.replace(/[\\%_]/g, (c) => `\\${c}`);
      query = digitos.length >= 3 ? query.ilike("telefono", `%${digitos}%`) : query.ilike("nombre", `%${seguro}%`);
    }

    const { data, error: e } = await query;
    if (e) throw e;

    const clientas = (data ?? []).map((c: any) => {
      const visitas = c.visitas?.[0]?.count ?? 0;
      return { id: c.id, nombre: c.nombre, telefono: c.telefono, visitas, ...estadoClienta(visitas) };
    });
    return NextResponse.json({ clientas }, { headers: { "Cache-Control": "no-store" } });
  } catch (e) {
    console.error("clientas GET", (e as any)?.code ?? (e as Error).message);
    return error("No se pudo cargar la lista.", 500);
  }
}

// POST /api/admin/clientas { nombre, telefono } → crea clienta
export async function POST(req: Request) {
  if (!mismoOrigen(req)) return error("Origen no permitido", 403);
  if (!(await esAdmin())) return noAutorizado();

  const body = await leerJSON(req, 500);
  const nombre = textoLimpio(body?.nombre, 60);
  const tel = normalizarTelefono(body?.telefono);
  if (nombre.length < 2 || tel.length !== 10) {
    return error("Nombre (2 a 60 letras) y teléfono a 10 dígitos son obligatorios.");
  }

  const { data, error: e } = await supabaseServidor()
    .from("clientas")
    .insert({ nombre, telefono: tel })
    .select("id")
    .single();
  if (e) {
    if (e.code === "23505") return error("Ese teléfono ya está registrado.");
    console.error("clientas POST", e.code);
    return error("No se pudo registrar a la clienta.", 500);
  }
  return NextResponse.json({ id: data.id });
}
