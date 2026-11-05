import { NextResponse } from "next/server";
import { COOKIE } from "@/lib/auth";
import { error, mismoOrigen } from "@/lib/seguridad";

export async function POST(req: Request) {
  if (!mismoOrigen(req)) return error("Origen no permitido", 403);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, "", {
    path: "/",
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return res;
}
