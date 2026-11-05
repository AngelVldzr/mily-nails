"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { trabajos } from "@/lib/config";

export default function Galeria() {
  const [abierta, setAbierta] = useState<number | null>(null);

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
        <div className="lightbox" role="dialog" aria-modal onClick={() => setAbierta(null)}>
          <button className="lightbox-cerrar" aria-label="Cerrar">×</button>
          <div className="lightbox-img" onClick={(e) => e.stopPropagation()}>
            <Image src={trabajos[abierta].src} alt={trabajos[abierta].alt} fill sizes="90vw" />
          </div>
          <p className="lightbox-txt">{trabajos[abierta].alt}</p>
        </div>
      )}
    </>
  );
}
