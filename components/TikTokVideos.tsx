import { redes, videosTikTok } from "@/lib/config";
import { IcoTikTok } from "./Icons";

function idDeVideo(url: string) {
  return url.match(/video\/(\d+)/)?.[1] ?? null;
}

export default function TikTokVideos() {
  const ids = videosTikTok.map(idDeVideo).filter(Boolean) as string[];

  if (ids.length === 0) {
    // Mientras no haya videos configurados, se muestran tarjetas que llevan al perfil
    return (
      <div className="tiktok-grid">
        {["Proceso de acrílico", "Nail art a mano", "Antes y después"].map((t) => (
          <a key={t} className="tiktok-placeholder" href={redes.tiktok} target="_blank" rel="noopener noreferrer">
            <span className="tiktok-play">▶</span>
            <strong>{t}</strong>
            <span className="tiktok-user"><IcoTikTok size={16} /> @{redes.tiktokUsuario}</span>
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="tiktok-grid">
      {ids.map((id) => (
        <div key={id} className="tiktok-video">
          <iframe
            src={`https://www.tiktok.com/player/v1/${id}?music_info=0&description=0&rel=0`}
            title="Video de TikTok de Mily Nail's"
            allow="encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
}
