"use client";

import { useEffect, useState } from "react";
import { Corazon, Corona, Destello, Esmalte, Flor, Gema, Gota, Pincel, Una } from "./Icons";

/**
 * Fondo fijo que cambia de "escena" según la sección visible.
 * Cada sección de la página lleva data-scene="0..4".
 */
type Escena = { clase: string; iconos: React.FC<{ size?: number; className?: string }>[] };

const escenas: Escena[] = [
  { clase: "esc-0", iconos: [Esmalte, Destello, Una, Destello] },      // Inicio
  { clase: "esc-1", iconos: [Una, Pincel, Destello, Esmalte] },        // Servicios
  { clase: "esc-2", iconos: [Gema, Flor, Destello, Una] },             // Trabajos
  { clase: "esc-3", iconos: [Corona, Destello, Gema, Corazon] },       // Club Mily
  { clase: "esc-4", iconos: [Gota, Corazon, Flor, Esmalte] },          // Agenda / contacto
];

// Posiciones fijas (en %) para que no salten entre renders
const posiciones = [
  [6, 12, 46, -12], [86, 9, 34, 14], [16, 70, 30, 8], [74, 62, 52, -8],
  [44, 88, 26, 20], [92, 40, 24, -18], [3, 42, 22, 10], [58, 22, 20, 0],
  [30, 30, 18, -6], [66, 92, 30, 12],
];

export default function ScrollBackground() {
  const [activa, setActiva] = useState(0);

  useEffect(() => {
    const secciones = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    const obs = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) setActiva(Number(e.target.getAttribute("data-scene")) || 0);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    secciones.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="fondo" aria-hidden>
      {escenas.map((esc, i) => (
        <div key={i} className={`fondo-escena ${esc.clase} ${i === activa ? "activa" : ""}`}>
          {posiciones.map(([x, y, s, r], j) => {
            const Ico = esc.iconos[j % esc.iconos.length];
            return (
              <span
                key={j}
                className="fondo-ico"
                style={{ left: `${x}%`, top: `${y}%`, ["--r" as string]: `${r}deg`, animationDelay: `${j * -1.7}s` }}
              >
                <Ico size={s} />
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
