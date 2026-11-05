"use client";

import { useCallback, useEffect, useState } from "react";
import { Escalera } from "@/components/ClubMily";
import { CICLO } from "@/lib/rewards";

type Clienta = {
  id: string;
  nombre: string;
  telefono: string;
  visitas: number;
  enCiclo: number;
  descuentoSiguienteVisita: number;
  faltan: number;
  proximoNivel: { descuento: number };
};

const fmtTel = (t: string) => t.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");

type Sello = {
  nombre: string;
  telefono: string;
  enCiclo: number;
  descuento: number;
  descuentoSiguienteVisita: number;
  faltan: number;
  proximoNivel: { descuento: number };
};

/** Mensaje de WhatsApp para avisarle a la clienta su progreso */
function mensajeSello(v: Sello) {
  const nombre = v.nombre.split(" ")[0];
  const sitio = typeof window !== "undefined" ? window.location.origin : "";
  let txt = `¡Hola ${nombre}! 💅 Gracias por tu visita a Mily Nail's.\n`;
  if (v.descuento > 0) txt += `Hoy disfrutaste tu ${v.descuento}% de descuento del Club Mily 🎁\n`;
  if (v.enCiclo === CICLO) {
    txt += `¡Completaste tu tarjeta de ${CICLO} sellos! 👑 Desde tu próxima visita empiezas una nueva.\n`;
  } else {
    txt += `Ya llevas ${v.enCiclo} de ${CICLO} sellos ✨\n`;
    txt += v.descuentoSiguienteVisita > 0
      ? `¡Tu próxima visita tiene ${v.descuentoSiguienteVisita}% de descuento!\n`
      : `Te ${v.faltan === 1 ? "falta 1 visita" : `faltan ${v.faltan} visitas`} para tu ${v.proximoNivel.descuento}% de descuento.\n`;
  }
  txt += `Consulta tu tarjeta cuando quieras: ${sitio}/#club`;
  return `https://wa.me/52${v.telefono}?text=${encodeURIComponent(txt)}`;
}

export default function Panel() {
  const [auth, setAuth] = useState<"cargando" | "no" | "si">("cargando");
  const [pass, setPass] = useState("");
  const [q, setQ] = useState("");
  const [lista, setLista] = useState<Clienta[]>([]);
  const [aviso, setAviso] = useState<{ tipo: "ok" | "error"; txt: string } | null>(null);
  const [nueva, setNueva] = useState({ nombre: "", telefono: "" });
  const [sellarHoy, setSellarHoy] = useState(true);
  const [ultimo, setUltimo] = useState<Sello | null>(null);
  const [ocupado, setOcupado] = useState<string | null>(null);

  const buscar = useCallback(async (texto = q) => {
    const r = await fetch(`/api/admin/clientas?q=${encodeURIComponent(texto)}`);
    if (r.status === 401) return setAuth("no");
    const d = await r.json();
    if (!r.ok) return setAviso({ tipo: "error", txt: d.error });
    setAuth("si");
    setLista(d.clientas);
  }, [q]);

  useEffect(() => { buscar(""); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function entrar(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pass }) });
    if (r.ok) { setPass(""); setAviso(null); buscar(""); }
    else {
      const d = await r.json().catch(() => ({}));
      setAviso({ tipo: "error", txt: d.error || "No se pudo entrar" });
    }
  }

  async function salir() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth("no");
  }

  async function registrar(c: Pick<Clienta, "id" | "nombre" | "telefono">) {
    setOcupado(c.id);
    const r = await fetch("/api/admin/visitas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientaId: c.id }) });
    const d = await r.json();
    setOcupado(null);
    if (!r.ok) return setAviso({ tipo: "error", txt: d.error });
    setUltimo({ ...d, nombre: c.nombre, telefono: c.telefono });
    setAviso({
      tipo: "ok",
      txt: d.descuento > 0
        ? `✅ Visita ${d.enCiclo}/${CICLO} de ${c.nombre}: ¡aplica ${d.descuento}% de descuento hoy!`
        : `✅ Visita ${d.enCiclo}/${CICLO} registrada para ${c.nombre} (sin descuento esta vez).`,
    });
    buscar();
  }

  async function deshacer(c: Clienta) {
    if (!confirm(`¿Quitar la última visita de ${c.nombre}?`)) return;
    const r = await fetch("/api/admin/visitas", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientaId: c.id }) });
    const d = await r.json();
    if (!r.ok) return setAviso({ tipo: "error", txt: d.error });
    setAviso({ tipo: "ok", txt: `Se quitó la última visita de ${c.nombre}.` });
    buscar();
  }

  async function crear(e: React.FormEvent) {
    e.preventDefault();
    const r = await fetch("/api/admin/clientas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(nueva) });
    const d = await r.json();
    if (!r.ok) return setAviso({ tipo: "error", txt: d.error });
    const tel = nueva.telefono.replace(/\D/g, "").slice(-10);
    setNueva({ nombre: "", telefono: "" });
    setQ(tel);
    if (sellarHoy) {
      await registrar({ id: d.id, nombre: nueva.nombre.trim(), telefono: tel });
      buscar(tel);
    } else {
      setAviso({ tipo: "ok", txt: `💜 ${nueva.nombre} ya es parte del Club Mily.` });
      buscar(tel);
    }
  }

  if (auth === "cargando") return <main className="panel"><p>Cargando…</p></main>;

  if (auth === "no")
    return (
      <main className="panel panel-login">
        <form className="tarjeta" onSubmit={entrar}>
          <h1>Panel de Mily</h1>
          <p>Ingresa la contraseña para administrar el Club Mily.</p>
          <input type="password" autoComplete="current-password" maxLength={200} value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Contraseña" autoFocus />
          <button className="btn btn-primario">Entrar</button>
          {aviso?.tipo === "error" && <p className="msg msg-error">{aviso.txt}</p>}
        </form>
      </main>
    );

  return (
    <main className="panel">
      <header className="panel-top">
        <h1>Club Mily · Panel</h1>
        <button className="btn btn-secundario btn-chico" onClick={salir}>Salir</button>
      </header>

      {aviso && <p className={`msg ${aviso.tipo === "ok" ? "msg-ok" : "msg-error"}`} onClick={() => setAviso(null)}>{aviso.txt}</p>}

      {ultimo && (
        <div className="tarjeta panel-sello">
          <p>¿Le avisas a <b>{ultimo.nombre}</b> cuántos sellos lleva?</p>
          <div className="panel-acciones">
            <a className="btn btn-wa" href={mensajeSello(ultimo)} target="_blank" rel="noopener noreferrer" onClick={() => setUltimo(null)}>
              Enviar por WhatsApp
            </a>
            <button className="btn btn-link" onClick={() => setUltimo(null)}>Ahora no</button>
          </div>
        </div>
      )}

      <form className="tarjeta panel-nueva" onSubmit={crear}>
        <h2>Registrar clienta nueva</h2>
        <div className="fila-input">
          <input placeholder="Nombre" maxLength={60} value={nueva.nombre} onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })} required />
          <input placeholder="WhatsApp (10 dígitos)" inputMode="numeric" maxLength={16} value={nueva.telefono} onChange={(e) => setNueva({ ...nueva, telefono: e.target.value })} required />
          <button className="btn btn-primario">Agregar</button>
        </div>
        <label className="check">
          <input type="checkbox" checked={sellarHoy} onChange={(e) => setSellarHoy(e.target.checked)} />
          Darle también su primer sello (visita de hoy)
        </label>
        <p className="nota">Antes de registrarla, pregúntale si está de acuerdo en guardar su nombre y WhatsApp para el Club Mily.</p>
      </form>

      <form className="panel-buscar" onSubmit={(e) => { e.preventDefault(); buscar(); }}>
        <input placeholder="Buscar por nombre o teléfono…" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn btn-secundario">Buscar</button>
      </form>

      <ul className="panel-lista">
        {lista.length === 0 && <li className="tarjeta">No hay clientas que coincidan.</li>}
        {lista.map((c) => (
          <li key={c.id} className="tarjeta panel-clienta">
            <div className="panel-clienta-top">
              <div>
                <strong>{c.nombre}</strong>
                <span>{fmtTel(c.telefono)} · {c.visitas} visitas en total</span>
              </div>
              <span className={`pill ${c.descuentoSiguienteVisita ? "pill-premio" : ""}`}>
                {c.descuentoSiguienteVisita ? `Hoy: -${c.descuentoSiguienteVisita}%` : `Faltan ${c.faltan} para -${c.proximoNivel.descuento}%`}
              </span>
            </div>
            <Escalera marcadas={c.enCiclo} />
            <div className="panel-acciones">
              <button className="btn btn-primario" disabled={ocupado === c.id} onClick={() => registrar(c)}>
                {ocupado === c.id ? "Guardando…" : "＋ Registrar visita de hoy"}
              </button>
              {c.visitas > 0 && <button className="btn btn-link" onClick={() => deshacer(c)}>Deshacer última</button>}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
