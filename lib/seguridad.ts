import "server-only";
import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { supabaseServidor } from "./supabase";

/** Respuesta de error genérica: nunca devolvemos detalles internos de la base de datos. */
export function error(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status, headers: { "Cache-Control": "no-store" } });
}

/**
 * Bloquea peticiones que modifican datos si vienen de OTRO sitio web
 * (protección extra contra CSRF, además de la cookie SameSite=Strict).
 */
export function mismoOrigen(req: Request) {
  const origen = req.headers.get("origin");
  if (!origen) return req.headers.get("sec-fetch-site") !== "cross-site";
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origen).host === host;
  } catch {
    return false;
  }
}

/** Huella anónima de la IP (no guardamos IPs reales: privacidad de las clientas). */
export function huellaIP(req: Request) {
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "desconocida";
  return createHmac("sha256", process.env.ADMIN_SECRET ?? "mily").update(ip).digest("hex").slice(0, 32);
}

/**
 * Límite de intentos (rate limit) guardado en Supabase, para que funcione aunque
 * Vercel use varios servidores a la vez.
 * Devuelve true si TODAVÍA se permite el intento.
 */
export async function dentroDelLimite(clave: string, max: number, ventanaMin: number) {
  const sb = supabaseServidor();
  const desde = new Date(Date.now() - ventanaMin * 60_000).toISOString();
  const { count, error: e } = await sb
    .from("limites")
    .select("id", { count: "exact", head: true })
    .eq("clave", clave)
    .gte("creado_en", desde);
  if (e) {
    console.error("rate-limit", e.code);
    return false; // si no podemos verificar, preferimos bloquear (falla cerrado)
  }
  return (count ?? 0) < max;
}

export async function registrarIntento(clave: string) {
  const sb = supabaseServidor();
  await sb.from("limites").insert({ clave });
  // Limpieza ocasional de registros viejos (más de 1 día)
  if (Math.random() < 0.05) {
    await sb.from("limites").delete().lt("creado_en", new Date(Date.now() - 86_400_000).toISOString());
  }
}

export const esUUID = (v: unknown): v is string =>
  typeof v === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v);

/** Limpia texto libre: quita caracteres de control y recorta al largo máximo. */
export function textoLimpio(v: unknown, max: number) {
  if (typeof v !== "string") return "";
  return v.replace(/[\u0000-\u001F\u007F<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
}

/** Lee el cuerpo JSON con un tamaño máximo (evita que manden archivos gigantes). */
export async function leerJSON(req: Request, maxBytes = 2_000): Promise<Record<string, unknown> | null> {
  const largo = Number(req.headers.get("content-length") ?? 0);
  if (largo > maxBytes) return null;
  try {
    const txt = await req.text();
    if (txt.length > maxBytes) return null;
    const d = JSON.parse(txt);
    return d && typeof d === "object" && !Array.isArray(d) ? d : null;
  } catch {
    return null;
  }
}
