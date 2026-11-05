import { redes, videosTikTok } from "@/lib/config";
import { IcoTikTok } from "./Icons";

const extraerId = (url: string) => url.match(/(?:video|\/v)\/(\d{8,})/)?.[1] ?? null;

/**
 * Convierte un link de TikTok (corto o completo) en el ID del video.
 * Los links cortos (vt.tiktok.com) se resuelven en el servidor siguiendo la
 * redirección; si falla se intenta con el oEmbed oficial de TikTok.
 * El resultado se guarda en caché 1 día (ISR) para no consultar en cada visita.
 */
async function resolverId(url: string): Promise<string | null> {
  const directo = extraerId(url);
  if (directo) return directo;

  const ua = { "User-Agent": "Mozilla/5.0 (compatible; MilyNailsBot/1.0)" };
  try {
    const r = await fetch(url, { redirect: "manual", headers: ua, next: { revalidate: 86400 } });
    const destino = r.headers.get("location") ?? "";
    const id = extraerId(destino);
    if (id) return id;
  } catch {}
  try {
    const r = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
      headers: ua,
      next: { revalidate: 86400 },
    });
    if (r.ok) {
      const d = await r.json();
      return d.embed_product_id ?? extraerId(d.html ?? "") ?? null;
    }
  } catch {}
  return null;
}

const titulos = ["Proceso de acrílico", "Nail art a mano", "Antes y después"];

export default async function TikTokVideos() {
  const videos = await Promise.all(videosTikTok.map(async (url) => ({ url, id: await resolverId(url) })));

  if (videos.length === 0) {
    videos.push(...titulos.map((t) => ({ url: redes.tiktok, id: null })));
  }

  return (
    <div className="tiktok-grid">
      {videos.map(({ url, id }, i) =>
        id ? (
          <div key={url + i} className="tiktok-video">
            <iframe
              src={`https://www.tiktok.com/player/v1/${id}?music_info=0&description=0&rel=0`}
              title={`Video de TikTok de Mily Nail's ${i + 1}`}
              allow="encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>
        ) : (
          // Respaldo: si no se pudo convertir el link, tarjeta que abre el video en TikTok
          <a key={url + i} className="tiktok-placeholder" href={url} target="_blank" rel="noopener noreferrer">
            <span className="tiktok-play">▶</span>
            <strong>{titulos[i % titulos.length]}</strong>
            <span className="tiktok-user"><IcoTikTok size={16} /> Ver en TikTok</span>
          </a>
        )
      )}
    </div>
  );
}
