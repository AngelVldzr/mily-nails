"use client";

/**
 * COTIZADOR DE UÑAS — los precios se editan en lib/precios.ts
 * Todo se calcula en el navegador de la clienta; no se envía ni guarda nada
 * hasta que ella decide mandar su cotización por WhatsApp.
 */
import { useMemo, useState } from "react";
import {
  MAX_UNAS, PRECIO_CAMBIO_FORMA, PRECIO_TONO_EXTRA, TONOS_INCLUIDOS,
  extrasPorUna, gruposDecoracion, preciosSoftGel, tecnicas,
} from "@/lib/precios";
import { linkWhatsApp } from "@/lib/whatsapp";
import { IcoWhatsApp } from "./Icons";

const todasDecoraciones = [...gruposDecoracion.flatMap((g) => g.items), ...extrasPorUna];
const limitar = (n: number) => Math.max(0, Math.min(MAX_UNAS, Math.floor(n) || 0));

function Contador({ valor, onCambio, etiqueta }: { valor: number; onCambio: (n: number) => void; etiqueta: string }) {
  return (
    <div className="contador" role="group" aria-label={etiqueta}>
      <button type="button" onClick={() => onCambio(limitar(valor - 1))} disabled={valor === 0} aria-label={`Quitar ${etiqueta}`}>−</button>
      <output aria-live="polite">{valor}</output>
      <button type="button" onClick={() => onCambio(limitar(valor + 1))} disabled={valor >= MAX_UNAS} aria-label={`Agregar ${etiqueta}`}>+</button>
    </div>
  );
}

export default function Cotizador() {
  const [tecnica, setTecnica] = useState<string>("");
  const [largo, setLargo] = useState(1);
  const [tonos, setTonos] = useState(0);
  const [forma, setForma] = useState(false);
  const [cant, setCant] = useState<Record<string, number>>({});
  const [grupo, setGrupo] = useState(0);

  const setItem = (id: string, n: number) => setCant((c) => ({ ...c, [id]: n }));

  const { total, lineas } = useMemo(() => {
    const lineas: { txt: string; monto: number }[] = [];
    const t = tecnicas.find((x) => x.id === tecnica);
    if (t) {
      const precio = t.conLargo ? preciosSoftGel[largo] : (t.precio as number);
      lineas.push({ txt: t.conLargo ? `${t.nombre} (largo ${largo})` : t.nombre, monto: precio });
    }
    if (tonos > 0) lineas.push({ txt: `Tonos extra ×${tonos}`, monto: tonos * PRECIO_TONO_EXTRA });
    if (forma) lineas.push({ txt: "Cambio de forma", monto: PRECIO_CAMBIO_FORMA });
    for (const d of todasDecoraciones) {
      const n = cant[d.id] ?? 0;
      if (n > 0) lineas.push({ txt: `${d.nombre} ×${n}`, monto: n * d.precio });
    }
    return { total: lineas.reduce((s, l) => s + l.monto, 0), lineas };
  }, [tecnica, largo, tonos, forma, cant]);

  const conteoGrupo = (i: number) => gruposDecoracion[i].items.reduce((s, d) => s + (cant[d.id] ?? 0), 0);

  function reiniciar() {
    setTecnica(""); setLargo(1); setTonos(0); setForma(false); setCant({});
  }

  const mensaje =
    `¡Hola Mily! 💅 Hice mi cotización en la página:\n` +
    lineas.map((l) => `• ${l.txt}: $${l.monto}`).join("\n") +
    `\n*Total estimado: $${total}*\n¿Tienes disponibilidad?`;

  return (
    <div className="cotizador-app">
      <div className="cot-pasos">
        {/* 1. Técnica */}
        <fieldset className="tarjeta cot-paso">
          <legend><span>1</span> Técnica base</legend>
          <div className="cot-tecnicas">
            {tecnicas.map((t) => (
              <label key={t.id} className={`cot-opcion ${tecnica === t.id ? "activa" : ""}`}>
                <input type="radio" name="tecnica" value={t.id} checked={tecnica === t.id} onChange={() => setTecnica(t.id)} />
                <strong>{t.nombre}</strong>
                <small>{t.conLargo ? `desde $${preciosSoftGel[1]}` : `$${t.precio}`}</small>
              </label>
            ))}
          </div>
          {tecnica === "soft_gel" && (
            <div className="cot-largos">
              <p className="cot-sub">Largo de la uña</p>
              <div className="cot-largo-grid">
                {Object.entries(preciosSoftGel).map(([l, p]) => (
                  <button
                    type="button"
                    key={l}
                    className={`cot-largo ${largo === Number(l) ? "activa" : ""}`}
                    onClick={() => setLargo(Number(l))}
                    aria-pressed={largo === Number(l)}
                  >
                    <b>L{l}</b>
                    <small>${p}</small>
                  </button>
                ))}
              </div>
            </div>
          )}
        </fieldset>

        {/* 2. Color y forma */}
        <fieldset className="tarjeta cot-paso">
          <legend><span>2</span> Color y estructura</legend>
          <div className="cot-fila">
            <div>
              <strong>Tonos extra</strong>
              <small>${PRECIO_TONO_EXTRA} c/u · {TONOS_INCLUIDOS} tonos lisos ya incluidos</small>
            </div>
            <Contador valor={tonos} onCambio={setTonos} etiqueta="tono extra" />
          </div>
          <label className="check cot-check">
            <input type="checkbox" checked={forma} onChange={(e) => setForma(e.target.checked)} />
            Cambio de forma (+${PRECIO_CAMBIO_FORMA})
          </label>
        </fieldset>

        {/* 3. Decoración */}
        <fieldset className="tarjeta cot-paso">
          <legend><span>3</span> Nail art y decoración</legend>
          <p className="cot-sub">¿En cuántas uñitas quieres cada uno? (precio por uña)</p>
          <div className="cot-tabs" role="tablist">
            {gruposDecoracion.map((g, i) => (
              <button
                type="button"
                role="tab"
                key={g.titulo}
                aria-selected={grupo === i}
                className={grupo === i ? "activa" : ""}
                onClick={() => setGrupo(i)}
              >
                {g.titulo}
                {conteoGrupo(i) > 0 && <span className="cot-badge">{conteoGrupo(i)}</span>}
              </button>
            ))}
          </div>
          <div className="cot-lista">
            {gruposDecoracion[grupo].items.map((d) => (
              <div key={d.id} className={`cot-fila ${(cant[d.id] ?? 0) > 0 ? "con-valor" : ""}`}>
                <div>
                  <strong>{d.nombre}</strong>
                  <small>${d.precio} por uña</small>
                </div>
                <Contador valor={cant[d.id] ?? 0} onCambio={(n) => setItem(d.id, n)} etiqueta={d.nombre} />
              </div>
            ))}
          </div>
        </fieldset>

        {/* 4. Retiros */}
        <fieldset className="tarjeta cot-paso">
          <legend><span>4</span> Retiros y reposiciones</legend>
          <div className="cot-lista">
            {extrasPorUna.map((d) => (
              <div key={d.id} className={`cot-fila ${(cant[d.id] ?? 0) > 0 ? "con-valor" : ""}`}>
                <div>
                  <strong>{d.nombre}</strong>
                  <small>${d.precio} por uña</small>
                </div>
                <Contador valor={cant[d.id] ?? 0} onCambio={(n) => setItem(d.id, n)} etiqueta={d.nombre} />
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Resumen (fijo a un lado en computadora, abajo en celular) */}
      <aside className="cot-resumen tarjeta" aria-live="polite">
        <div className="cot-resumen-cabeza">
          <p className="cot-resumen-titulo">Tu presupuesto</p>
          <p className="cot-total">${total}<small> MXN</small></p>
          {lineas.length > 0 && <p className="cot-conceptos">{lineas.length} {lineas.length === 1 ? "concepto" : "conceptos"}</p>}
        </div>
        {lineas.length === 0 ? (
          <p className="cot-vacio">Elige una técnica para comenzar ✨</p>
        ) : (
          <ul className="cot-desglose">
            {lineas.map((l) => (
              <li key={l.txt}><span>{l.txt}</span><b>${l.monto}</b></li>
            ))}
          </ul>
        )}
        <a
          className={`btn btn-wa ${lineas.length === 0 ? "deshabilitado" : ""}`}
          href={lineas.length ? linkWhatsApp(mensaje) : undefined}
          aria-disabled={lineas.length === 0}
          target="_blank"
          rel="noopener noreferrer"
        >
          <IcoWhatsApp /> Enviar cotización
        </a>
        {lineas.length > 0 && (
          <button type="button" className="btn btn-link" onClick={reiniciar}>Empezar de nuevo</button>
        )}
        <p className="nota">Precio estimado. El total final se confirma con Mily según tu diseño.</p>
      </aside>
    </div>
  );
}
