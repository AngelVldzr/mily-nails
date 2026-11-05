"use client";

import { useEffect, useRef, useState } from "react";
import { Corazon, Corona, Destello, Esmalte, Flor, Gema, Gota, Pincel, Una } from "./Icons";

/**
 * Fondo fijo que:
 *  1. Cambia de "escena" según la sección visible (cada sección lleva data-scene="0..4").
 *  2. Mueve las piezas con efecto de profundidad (parallax) siguiendo el mouse o el dedo.
 *  3. Hace que las piezas "se columpien" al hacer scroll y luego regresen suavemente.
 * Solo usa transform (GPU) y se detiene cuando no hay movimiento para cuidar la batería.
 */
type Escena = { clase: string; iconos: React.FC<{ size?: number; className?: string }>[] };

const escenas: Escena[] = [
  { clase: "esc-0", iconos: [Esmalte, Destello, Una, Destello] },      // Inicio
  { clase: "esc-1", iconos: [Una, Pincel, Destello, Esmalte] },        // Servicios
  { clase: "esc-2", iconos: [Gema, Flor, Destello, Una] },             // Trabajos
  { clase: "esc-3", iconos: [Corona, Destello, Gema, Corazon] },       // Club Mily
  { clase: "esc-4", iconos: [Gota, Corazon, Flor, Esmalte] },          // Agenda / contacto
];

// [x %, y %, tamaño px, rotación°]. Las piezas grandes se mueven más (están "más cerca").
const posiciones = [
  [6, 12, 46, -12], [86, 9, 34, 14], [16, 70, 30, 8], [74, 62, 52, -8],
  [44, 88, 26, 20], [92, 40, 24, -18], [3, 42, 22, 10], [58, 22, 20, 0],
  [30, 30, 18, -6], [66, 92, 30, 12], [82, 80, 40, -14], [24, 52, 16, 18],
];

export default function ScrollBackground() {
  const [activa, setActiva] = useState(0);
  const fondo = useRef<HTMLDivElement>(null);

  // Escena según la sección visible
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

  // Movimiento con mouse / dedo / scroll
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = fondo.current;
    if (!el) return;

    const objetivo = { x: 0, y: 0 };  // hacia dónde queremos ir (-1 … 1)
    const actual = { x: 0, y: 0 };    // dónde estamos (se acerca suavemente)
    let empujeScroll = 0;             // impulso extra al hacer scroll
    let ultimoScroll = window.scrollY;
    let raf = 0;

    const animar = () => {
      empujeScroll *= 0.9; // el impulso se apaga poco a poco
      actual.x += (objetivo.x - actual.x) * 0.08;
      actual.y += (objetivo.y + empujeScroll - actual.y) * 0.08;
      el.style.setProperty("--mx", actual.x.toFixed(3));
      el.style.setProperty("--my", actual.y.toFixed(3));
      const quieto =
        Math.abs(objetivo.x - actual.x) < 0.002 &&
        Math.abs(objetivo.y + empujeScroll - actual.y) < 0.002 &&
        Math.abs(empujeScroll) < 0.002;
      raf = quieto ? 0 : requestAnimationFrame(animar);
    };
    const despertar = () => { if (!raf) raf = requestAnimationFrame(animar); };

    const mover = (cx: number, cy: number) => {
      objetivo.x = (cx / window.innerWidth) * 2 - 1;
      objetivo.y = (cy / window.innerHeight) * 2 - 1;
      despertar();
    };
    const alPuntero = (e: PointerEvent) => mover(e.clientX, e.clientY);
    const alTocar = (e: TouchEvent) => { const t = e.touches[0]; if (t) mover(t.clientX, t.clientY); };
    const alSoltar = () => { objetivo.x *= 0.4; objetivo.y *= 0.4; despertar(); };
    const alScroll = () => {
      const y = window.scrollY;
      const delta = y - ultimoScroll;
      ultimoScroll = y;
      empujeScroll = Math.max(-1.4, Math.min(1.4, empujeScroll + delta * 0.012));
      despertar();
    };

    window.addEventListener("pointermove", alPuntero, { passive: true });
    window.addEventListener("touchmove", alTocar, { passive: true });
    window.addEventListener("touchend", alSoltar, { passive: true });
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", alPuntero);
      window.removeEventListener("touchmove", alTocar);
      window.removeEventListener("touchend", alSoltar);
      window.removeEventListener("scroll", alScroll);
    };
  }, []);

  return (
    <div className="fondo" aria-hidden ref={fondo}>
      {escenas.map((esc, i) => (
        <div key={i} className={`fondo-escena ${esc.clase} ${i === activa ? "activa" : ""}`}>
          {posiciones.map(([x, y, s, r], j) => {
            const Ico = esc.iconos[j % esc.iconos.length];
            return (
              <span
                key={j}
                className="fondo-pieza"
                style={{ left: `${x}%`, top: `${y}%`, ["--d" as string]: (s * 0.9).toFixed(0) }}
              >
                <span className="fondo-ico" style={{ ["--r" as string]: `${r}deg`, animationDelay: `${j * -1.7}s` }}>
                  <Ico size={s} />
                </span>
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
