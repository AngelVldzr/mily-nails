"use client";

import { useState } from "react";
import { CICLO, niveles } from "@/lib/rewards";

type Resultado =
  | { encontrada: false }
  | {
      encontrada: true;
      nombre: string;
      visitas: number;
      enCiclo: number;
      ciclosCompletos: number;
      descuentoSiguienteVisita: number;
      proximoNivel: { visita: number; descuento: number; nombre: string };
      faltan: number;
    };

export function Escalera({ marcadas = 0 }: { marcadas?: number }) {
  return (
    <ol className="escalera" aria-label={`Ciclo de ${CICLO} visitas`}>
      {Array.from({ length: CICLO }, (_, i) => {
        const n = i + 1;
        const nivel = niveles.find((l) => l.visita === n);
        return (
          <li key={n} className={`peldano ${nivel ? "premio" : ""} ${n <= marcadas ? "hecho" : ""}`}>
            <span className="peldano-num">{n <= marcadas ? "✓" : n}</span>
            {nivel && (
              <span className="peldano-premio">
                <b>-{nivel.descuento}%</b>
                <small>{nivel.nombre}</small>
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function ClubMily() {
  const [tel, setTel] = useState("");
  const [cargando, setCargando] = useState(false);
  const [res, setRes] = useState<Resultado | null>(null);
  const [error, setError] = useState("");

  async function consultar(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setRes(null);
    setCargando(true);
    try {
      const r = await fetch("/api/recompensas/consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefono: tel }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || "Error");
      setRes(data);
    } catch (err: any) {
      setError(err.message || "No pudimos consultar ahora, intenta más tarde.");
    } finally {
      setCargando(false);
    }
  }

  return (
    <div className="club">
      <Escalera marcadas={res && res.encontrada ? res.enCiclo : 0} />

      <div className="club-grid">
        <div className="club-reglas">
          <h3>¿Cómo funciona?</h3>
          <ul>
            <li>Te registramos con tu número de WhatsApp en tu primera cita.</li>
            <li>Cada visita suma un sello automáticamente.</li>
            <li>El descuento se aplica <b>en</b> la visita 3, 5, 7 y 10.</li>
            <li>Al llegar a la visita 10 tu tarjeta vuelve a empezar 💜</li>
          </ul>
          <p className="nota">Descuento aplicable a un servicio por visita. No acumulable con otras promociones.</p>
        </div>

        <form className="club-consulta tarjeta" onSubmit={consultar}>
          <h3>Consulta tus sellos</h3>
          <label htmlFor="tel">Tu número de WhatsApp</label>
          <div className="fila-input">
            <input
              id="tel"
              inputMode="numeric"
              autoComplete="tel"
              placeholder="744 123 4567"
              value={tel}
              onChange={(e) => setTel(e.target.value)}
              required
            />
            <button className="btn btn-primario" disabled={cargando}>
              {cargando ? "Buscando…" : "Ver"}
            </button>
          </div>

          {error && <p className="msg msg-error">{error}</p>}

          {res && !res.encontrada && (
            <p className="msg">
              Aún no estás en el Club Mily. ¡Pide que te registren en tu próxima cita y empieza a sumar! ✨
            </p>
          )}

          {res && res.encontrada && (
            <div className="msg msg-ok">
              <p className="saludo">¡Hola, {res.nombre}! 💅</p>
              <p>
                Llevas <b>{res.enCiclo}</b> de {CICLO} visitas en tu tarjeta
                {res.ciclosCompletos > 0 && <> · ya completaste {res.ciclosCompletos} {res.ciclosCompletos === 1 ? "tarjeta" : "tarjetas"} 👑</>}.
              </p>
              {res.descuentoSiguienteVisita > 0 ? (
                <p className="destacado">¡Tu próxima visita tiene {res.descuentoSiguienteVisita}% de descuento!</p>
              ) : (
                <p>
                  Te {res.faltan === 1 ? "falta 1 visita" : `faltan ${res.faltan} visitas`} para tu{" "}
                  <b>{res.proximoNivel.descuento}%</b> de descuento.
                </p>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
