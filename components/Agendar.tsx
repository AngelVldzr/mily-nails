"use client";

import { useState } from "react";
import { negocio, servicios } from "@/lib/config";
import { linkWhatsApp } from "@/lib/whatsapp";
import { IcoWhatsApp } from "./Icons";

export default function Agendar() {
  const [nombre, setNombre] = useState("");
  const [servicio, setServicio] = useState(servicios[1].nombre);
  const [fecha, setFecha] = useState("");
  const [turno, setTurno] = useState("Mañana");
  const [nota, setNota] = useState("");

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    const f = fecha
      ? new Date(fecha + "T12:00").toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" })
      : "lo antes posible";
    const msg =
      `¡Hola Mily! 💅 Soy ${nombre || "una clienta"}.\n` +
      `Me gustaría agendar: *${servicio}*\n` +
      `Fecha: ${f} · Horario: ${turno}\n` +
      (nota ? `Detalles: ${nota}\n` : "") +
      `¿Tienes disponibilidad?`;
    window.open(linkWhatsApp(msg), "_blank", "noopener");
  }

  const hoy = new Date().toISOString().slice(0, 10);

  return (
    <form className="agenda tarjeta" onSubmit={enviar}>
      <div className="campo">
        <label htmlFor="ag-nombre">Tu nombre</label>
        <input id="ag-nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej. Fernanda" required />
      </div>
      <div className="campo">
        <label htmlFor="ag-servicio">Servicio</label>
        <select id="ag-servicio" value={servicio} onChange={(e) => setServicio(e.target.value)}>
          {servicios.map((s) => (
            <option key={s.nombre}>{s.nombre}</option>
          ))}
        </select>
      </div>
      <div className="campo-doble">
        <div className="campo">
          <label htmlFor="ag-fecha">Fecha preferida</label>
          <input id="ag-fecha" type="date" min={hoy} value={fecha} onChange={(e) => setFecha(e.target.value)} />
        </div>
        <div className="campo">
          <label htmlFor="ag-turno">Horario</label>
          <select id="ag-turno" value={turno} onChange={(e) => setTurno(e.target.value)}>
            <option>Mañana</option>
            <option>Tarde</option>
            <option>Cualquier hora</option>
          </select>
        </div>
      </div>
      <div className="campo">
        <label htmlFor="ag-nota">¿Alguna idea o diseño? (opcional)</label>
        <textarea id="ag-nota" rows={3} value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Largo, forma, colores… también puedes mandar foto por WhatsApp" />
      </div>
      <button className="btn btn-wa">
        <IcoWhatsApp /> Pedir disponibilidad por WhatsApp
      </button>
      <p className="nota">Se abrirá WhatsApp con tu mensaje listo para enviar al {negocio.whatsappVisible}.</p>
    </form>
  );
}
