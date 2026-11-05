"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { trabajos } from "@/lib/config";

export default function Galeria() {
  const [abierta, setAbierta] = useState<number | null>(null);
  const inicioX = useRef<number | null>(null);
  const mover = (paso: number) => setAbierta((i) => ((i ?? 0) + paso + trabajos.length) % trabajos.length);

  // Evita que la página de atrás se mueva mientras el visor está abierto
  useEffect(() => {
    document.body.style.overflow = abierta !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [abierta]);

  useEffect(() => {
    if (abierta === null) return;
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAbierta(null);
      if (e.key === "ArrowRight") setAbierta((i) => ((i ?? 0) + 1) % trabajos.length);
      if (e.key === "ArrowLeft") setAbierta((i) => ((i ?? 0) - 1 + trabajos.length) % trabajos.length);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [abierta]);

  return (
    <>
      <div className="galeria">
        {trabajos.map((t, i) => (
          <button key={t.src} className={`galeria-item g-${i}`} onClick={() => setAbierta(i)} aria-label={`Ver: ${t.alt}`}>
            <Image src={t.src} alt={t.alt} fill sizes="(max-width: 700px) 50vw, 25vw" />
            <span className="galeria-tag">Trabajo real</span>
          </button>
        ))}
      </div>

      {abierta !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal
          onClick={() => setAbierta(null)}
          onTouchStart={(e) => (inicioX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (inicioX.current === null) return;
            const dx = e.changedTouches[0].clientX - inicioX.current;
            if (Math.abs(dx) > 50) mover(dx < 0 ? 1 : -1); // deslizar con el dedo
            inicioX.current = null;
          }}
        >
          <button className="lightbox-cerrar" aria-label="Cerrar">×</button>
          <button className="lightbox-flecha izq" aria-label="Anterior" onClick={(e) => { e.stopPropagation(); mover(-1); }}>‹</button>
          <button className="lightbox-flecha der" aria-label="Siguiente" onClick={(e) => { e.stopPropagation(); mover(1); }}>›</button>
          <div className="lightbox-img" onClick={(e) => e.stopPropagation()}>
            <Image src={trabajos[abierta].src} alt={trabajos[abierta].alt} fill sizes="90vw" />
          </div>
          <p className="lightbox-txt">{trabajos[abierta].alt} · {abierta + 1}/{trabajos.length}</p>
        </div>
      )}
    </>
  );
}
