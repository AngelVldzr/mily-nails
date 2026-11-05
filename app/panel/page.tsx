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

export default function Panel() {
  const [auth, setAuth] = useState<"cargando" | "no" | "si">("cargando");
  const [pass, setPass] = useState("");
  const [q, setQ] = useState("");
  const [lista, setLista] = useState<Clienta[]>([]);
  const [aviso, setAviso] = useState<{ tipo: "ok" | "error"; txt: string } | null>(null);
  const [nueva, setNueva] = useState({ nombre: "", telefono: "" });
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
    if (r.ok) { setPass(""); buscar(""); }
    else setAviso({ tipo: "error", txt: "Contraseña incorrecta" });
  }

  async function salir() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuth("no");
  }

  async function registrar(c: Clienta) {
    setOcupado(c.id);
    const r = await fetch("/api/admin/visitas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ clientaId: c.id }) });
    const d = await r.json();
    setOcupado(null);
    if (!r.ok) return setAviso({ tipo: "error", txt: d.error });
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
    setAviso({ tipo: "ok", txt: `💜 ${nueva.nombre} ya es parte del Club Mily. Registra su visita de hoy abajo.` });
    setQ(nueva.telefono);
    buscar(nueva.telefono);
    setNueva({ nombre: "", telefono: "" });
  }

  if (auth === "cargando") return <main className="panel"><p>Cargando…</p></main>;

  if (auth === "no")
    return (
      <main className="panel panel-login">
        <form className="tarjeta" onSubmit={entrar}>
          <h1>Panel de Mily</h1>
          <p>Ingresa la contraseña para administrar el Club Mily.</p>
          <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Contraseña" autoFocus />
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

      <form className="tarjeta panel-nueva" onSubmit={crear}>
        <h2>Registrar clienta nueva</h2>
        <div className="fila-input">
          <input placeholder="Nombre" value={nueva.nombre} onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })} required />
          <input placeholder="WhatsApp (10 dígitos)" inputMode="numeric" value={nueva.telefono} onChange={(e) => setNueva({ ...nueva, telefono: e.target.value })} required />
          <button className="btn btn-primario">Agregar</button>
        </div>
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
