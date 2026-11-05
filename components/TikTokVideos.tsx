import { redes, videosTikTok } from "@/lib/config";
import { IcoTikTok } from "./Icons";

const extraerId = (url: string) => url.match(/(?:video|\/v)\/(\d{8,25})/)?.[1] ?? null;

/**
 * Convierte un link de TikTok (corto o completo) en el ID del video.
 * Los links cortos (vt.tiktok.com) se resuelven en el servidor siguiendo la
 * redirección; si falla se intenta con el oEmbed oficial de TikTok.
 * El resultado se guarda en caché 1 día (ISR) para no consultar en cada visita.
 */
const HOSTS_PERMITIDOS = ["tiktok.com", "www.tiktok.com", "vt.tiktok.com", "vm.tiktok.com", "m.tiktok.com"];
const esTikTok = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && HOSTS_PERMITIDOS.includes(u.hostname);
  } catch {
    return false;
  }
};

async function resolverId(url: string): Promise<string | null> {
  if (!esTikTok(url)) return null; // solo consultamos links reales de TikTok
  const directo = extraerId(url);
  if (directo) return directo;

  const ua = { "User-Agent": "Mozilla/5.0 (compatible; MilyNailsBot/1.0)" };
  try {
    const r = await fetch(url, { redirect: "manual", headers: ua, next: { revalidate: 86400 } });
    const destino = r.headers.get("location") ?? "";
    const id = esTikTok(destino) ? extraerId(destino) : null;
    if (id) return id;
  } catch {}
  try {
    const r = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
      headers: ua,
      next: { revalidate: 86400 },
    });
    if (r.ok) {
      const d = await r.json();
      const id = String(d.embed_product_id ?? "");
      return /^\d{8,25}$/.test(id) ? id : null; // solo números: nada raro entra al iframe
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
              sandbox="allow-scripts allow-same-origin allow-popups allow-presentation"
              referrerPolicy="strict-origin-when-cross-origin"
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
