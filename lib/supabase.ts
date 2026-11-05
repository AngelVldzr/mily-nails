import "server-only"; // impide que este archivo (y la llave secreta) termine en el navegador
import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cliente: SupabaseClient | null = null;

/** Cliente de Supabase SOLO para el servidor (usa la service role key). */
export function supabaseServidor() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.");
  }
  if (!url.startsWith("https://")) throw new Error("SUPABASE_URL debe usar https://");
  if (!cliente) cliente = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return cliente;
}

/** Deja solo los 10 dígitos del teléfono (quita +52, espacios, guiones). */
export function normalizarTelefono(t: unknown) {
  const d = String(t ?? "").replace(/\D/g, "").slice(0, 15);
  return d.slice(-10);
}
