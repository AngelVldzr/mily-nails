// ─────────────────────────────────────────────────────────────
//  LISTA DE PRECIOS DEL COTIZADOR — edita aquí los precios (MXN)
// ─────────────────────────────────────────────────────────────

export const tecnicas = [
  { id: "soft_gel", nombre: "Soft Gel", precio: null as number | null, conLargo: true },
  { id: "rubber_manos", nombre: "Gel semipermanente con Rubber (manos)", precio: 200, conLargo: false },
  { id: "rubber_pies", nombre: "Gel semipermanente con Rubber (pies)", precio: 200, conLargo: false },
] as const;

export const preciosSoftGel: Record<number, number> = {
  1: 280, 2: 290, 3: 300, 4: 300, 5: 320, 6: 350, 7: 400, 8: 430, 9: 450,
};

export const TONOS_INCLUIDOS = 2;
export const PRECIO_TONO_EXTRA = 5;
export const PRECIO_CAMBIO_FORMA = 20;
export const MAX_UNAS = 10;

export type Decoracion = { id: string; nombre: string; precio: number };

export const gruposDecoracion: { titulo: string; items: Decoracion[] }[] = [
  {
    titulo: "Efectos",
    items: [
      { id: "espejo", nombre: "Espejo", precio: 5 },
      { id: "aurora", nombre: "Aurora", precio: 5 },
      { id: "azucar", nombre: "Azúcar", precio: 5 },
      { id: "sueter", nombre: "Suéter", precio: 5 },
      { id: "perla", nombre: "Perla", precio: 5 },
      { id: "glitter", nombre: "Glitter", precio: 5 },
      { id: "blooming", nombre: "Blooming", precio: 5 },
      { id: "ojo_gato", nombre: "Ojo de gato", precio: 5 },
      { id: "carey", nombre: "Carey", precio: 15 },
    ],
  },
  {
    titulo: "Diseños",
    items: [
      { id: "frances", nombre: "Francés", precio: 5 },
      { id: "art_simple", nombre: "Nail art simple", precio: 5 },
      { id: "art_comp", nombre: "Nail art complicado", precio: 15 },
      { id: "relieve", nombre: "Relieve", precio: 10 },
      { id: "3d", nombre: "Diseño 3D", precio: 15 },
      { id: "encapsulado", nombre: "Encapsulado", precio: 10 },
      { id: "nat_muerta", nombre: "Naturaleza muerta", precio: 10 },
      { id: "baby_boomer", nombre: "Baby boomer", precio: 15 },
      { id: "sticker", nombre: "Sticker", precio: 5 },
      { id: "dijes", nombre: "Dijes", precio: 5 },
    ],
  },
  {
    titulo: "Cristales",
    items: [
      { id: "cristal_ch", nombre: "Diseño cristales Ch", precio: 20 },
      { id: "cristal_m", nombre: "Diseño cristales M", precio: 30 },
      { id: "cristal_g", nombre: "Diseño cristales G", precio: 40 },
      { id: "full_cristal_ch", nombre: "Uña completa cristal Ch (L1–3)", precio: 50 },
      { id: "full_cristal_m", nombre: "Uña completa cristal M (L4–6)", precio: 80 },
      { id: "full_cristal_g", nombre: "Uña completa cristal G (L7–9)", precio: 100 },
    ],
  },
];

export const extrasPorUna: Decoracion[] = [
  { id: "retiro_soft", nombre: "Retiro Soft Gel", precio: 10 },
  { id: "retiro_acri", nombre: "Retiro Acrílico", precio: 15 },
  { id: "repo_poly", nombre: "Reposición Polygel", precio: 15 },
  { id: "repo_soft", nombre: "Reposición Soft Gel", precio: 10 },
];
