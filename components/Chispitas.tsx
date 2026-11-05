"use client";

import { useEffect } from "react";

/**
 * Al tocar o hacer clic en cualquier parte, salen unas chispitas ✦ donde está el dedo.
 * Pequeño detalle "mágico" que invita a seguir interactuando con la página.
 */
const colores = ["#7a76b0", "#e3b24f", "#e2a9c8", "#b6a6e2"];

export default function Chispitas() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const capa = document.createElement("div");
    capa.className = "chispitas";
    capa.setAttribute("aria-hidden", "true");
    document.body.appendChild(capa);

    const alTocar = (e: PointerEvent) => {
      if (capa.childElementCount > 30) return; // límite por rendimiento
      for (let i = 0; i < 6; i++) {
        const c = document.createElement("span");
        const ang = (Math.PI * 2 * i) / 6 + Math.random() * 0.6;
        const dist = 28 + Math.random() * 26;
        c.textContent = "✦";
        c.style.left = `${e.clientX}px`;
        c.style.top = `${e.clientY}px`;
        c.style.color = colores[i % colores.length];
        c.style.setProperty("--dx", `${Math.cos(ang) * dist}px`);
        c.style.setProperty("--dy", `${Math.sin(ang) * dist}px`);
        c.style.fontSize = `${10 + Math.random() * 8}px`;
        capa.appendChild(c);
        setTimeout(() => c.remove(), 750);
      }
    };
    window.addEventListener("pointerdown", alTocar, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", alTocar);
      capa.remove();
    };
  }, []);
  return null;
}
