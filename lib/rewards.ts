// ─────────────────────────────────────────────────────────────
//  PROGRAMA DE RECOMPENSAS "Club Mily"
//  Ciclo de 10 visitas. El descuento se aplica EN la visita indicada.
//  Al completar la visita 10 el ciclo vuelve a empezar.
//
//  Análisis (ticket promedio ~$400 MXN):
//   - Suma de descuentos del ciclo: 5 + 10 + 15 + 30 = 60 puntos
//   - Costo real para el negocio: 60 / 10 visitas = 6 % de lo vendido
//     (lo sano para un negocio pequeño es entre 5 % y 10 %)
//   - Ahorro de la clienta por ciclo ≈ $240 MXN; premio de la visita 10 ≈ $120
//   - Con citas cada 2–3 semanas, 10 visitas ≈ 5–7 meses de clienta fiel.
// ─────────────────────────────────────────────────────────────

export const CICLO = 10;

export type Nivel = { visita: number; descuento: number; nombre: string; icono: string };

export const niveles: Nivel[] = [
  { visita: 3, descuento: 5, nombre: "Brillo", icono: "✦" },
  { visita: 5, descuento: 10, nombre: "Gelish", icono: "💅" },
  { visita: 7, descuento: 15, nombre: "Glam", icono: "💎" },
  { visita: 10, descuento: 30, nombre: "Reina Mily", icono: "👑" },
];

/** Número de visita dentro del ciclo (1–10) para la visita n‑ésima total (1‑based). */
export function visitaEnCiclo(totalIncluyendoEsta: number) {
  return ((totalIncluyendoEsta - 1) % CICLO) + 1;
}

/** Descuento que corresponde a la visita n‑ésima total. */
export function descuentoParaVisita(totalIncluyendoEsta: number) {
  const n = visitaEnCiclo(totalIncluyendoEsta);
  return niveles.find((l) => l.visita === n)?.descuento ?? 0;
}

/** Estado de la clienta a partir de las visitas ya registradas. */
export function estadoClienta(visitasRegistradas: number) {
  const enCiclo = visitasRegistradas % CICLO; // visitas completadas en el ciclo actual
  const siguiente = visitasRegistradas + 1;
  const proximoNivel =
    niveles.find((l) => l.visita > enCiclo) ?? niveles[0];
  const faltan = proximoNivel.visita - enCiclo;
  return {
    enCiclo,
    ciclosCompletos: Math.floor(visitasRegistradas / CICLO),
    descuentoSiguienteVisita: descuentoParaVisita(siguiente),
    proximoNivel,
    faltan,
  };
}
