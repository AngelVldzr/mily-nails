import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const COOKIE = "mily_admin";

function firma() {
  const secreto = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "";
  return createHmac("sha256", secreto).update("mily-admin-v1").digest("hex");
}

export function passwordCorrecta(p: string) {
  const real = process.env.ADMIN_PASSWORD || "";
  if (!real) return false;
  const a = Buffer.from(p);
  const b = Buffer.from(real);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function valorCookie() {
  return firma();
}

export async function esAdmin() {
  const c = (await cookies()).get(COOKIE)?.value;
  if (!c || !process.env.ADMIN_PASSWORD) return false;
  const a = Buffer.from(c);
  const b = Buffer.from(firma());
  return a.length === b.length && timingSafeEqual(a, b);
}
