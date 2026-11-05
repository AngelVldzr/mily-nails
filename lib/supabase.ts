import { createClient, SupabaseClient } from "@supabase/supabase-js";

let cliente: SupabaseClient | null = null;

/** Cliente de Supabase SOLO para el servidor (usa la service role key). */
export function supabaseServidor() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Faltan SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY en las variables de entorno.");
  }
  if (!cliente) cliente = createClient(url, key, { auth: { persistSession: false } });
  return cliente;
}

/** Deja solo los 10 dígitos del teléfono (quita +52, espacios, guiones). */
export function normalizarTelefono(t: string) {
  const d = (t || "").replace(/\D/g, "");
  return d.slice(-10);
}
