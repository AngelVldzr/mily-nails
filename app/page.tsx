import Image from "next/image";
import ScrollBackground from "@/components/ScrollBackground";
import Chispitas from "@/components/Chispitas";
import Galeria from "@/components/Galeria";
import TikTokVideos from "@/components/TikTokVideos";
import ClubMily from "@/components/ClubMily";
import Cotizador from "@/components/Cotizador";
import Agendar from "@/components/Agendar";
import { Destello, IcoFacebook, IcoInstagram, IcoPin, IcoReloj, IcoTikTok, IcoWhatsApp } from "@/components/Icons";
import { negocio, redes, servicios } from "@/lib/config";
import { linkWhatsApp } from "@/lib/whatsapp";

const saludoWA = linkWhatsApp("¡Hola Mily! 💅 Me gustaría agendar una cita, ¿qué disponibilidad tienes?");

function Titulo({ eyebrow, children, sub }: { eyebrow: string; children: React.ReactNode; sub?: string }) {
  return (
    <header className="titulo">
      <span className="eyebrow"><Destello size={12} /> {eyebrow}</span>
      <h2>{children}</h2>
      {sub && <p>{sub}</p>}
    </header>
  );
}

export const revalidate = 86400; // vuelve a generar la página 1 vez al día (videos de TikTok)

export default function Home() {
  return (
    <>
      <ScrollBackground />
      <Chispitas />

      <nav className="nav">
        <a href="#inicio" className="nav-logo">
          <Image src="/logo.jpg" alt="Mily Nail's" width={44} height={44} priority />
          <span>Mily Nail&apos;s</span>
        </a>
        <div className="nav-links">
          <a href="#servicios">Servicios</a>
          <a href="#trabajos">Trabajos</a>
          <a href="#club">Club Mily</a>
          <a href="#cotiza">Cotiza</a>
          <a href="#ubicacion">Ubicación</a>
        </div>
        <a className="btn btn-primario btn-chico" href="#agenda">Agendar</a>
      </nav>

      <main>
        {/* ── INICIO ───────────────────────────── */}
        <section id="inicio" className="hero" data-scene="0">
          <div className="hero-texto">
            <span className="eyebrow"><Destello size={12} /> Nail studio</span>
            <h1>
              Tus uñas,<br />
              <em>tu mejor</em> accesorio
            </h1>
            <p>
              Acrílicas, gelish y nail art hechos con paciencia y detalle. Un espacio tranquilo para consentirte.
            </p>
            <div className="hero-cta">
              <a className="btn btn-primario" href="#agenda">Agenda tu cita</a>
              <a className="btn btn-secundario" href="#trabajos">Ver trabajos reales</a>
            </div>
            <ul className="hero-chips">
              <li>💅 Gelish</li>
              <li>✨ Acrílico</li>
              <li>🎨 Nail art</li>
              <li>👑 Club de recompensas</li>
            </ul>
          </div>
          <div className="hero-logo">
            <div className="hero-aro" />
            <Image src="/logo.jpg" alt="Logo de Mily Nail's" width={420} height={420} priority />
            <Destello className="chispa c1" size={30} />
            <Destello className="chispa c2" size={18} />
            <Destello className="chispa c3" size={24} />
          </div>
        </section>

        {/* ── SERVICIOS ────────────────────────── */}
        <section id="servicios" className="seccion" data-scene="1">
          <Titulo eyebrow="Servicios" sub="Precios de referencia; el total depende del largo y la decoración.">
            Lo que podemos hacer por tus manos
          </Titulo>
          <div className="servicios">
            {servicios.map((s) => (
              <article key={s.nombre} className="servicio tarjeta">
                <h3>{s.nombre}</h3>
                <p>{s.desc}</p>
                <span className="precio">
                  desde <b>${s.desde}</b> {s.unidad ?? ""}
                </span>
              </article>
            ))}
          </div>
        </section>

        {/* ── TRABAJOS ─────────────────────────── */}
        <section id="trabajos" className="seccion" data-scene="2">
          <Titulo eyebrow="Trabajos reales" sub="Fotos de clientas reales, sin filtros. Toca una para verla en grande.">
            Hechos aquí, con estas manos
          </Titulo>
          <Galeria />

          <div className="subtitulo">
            <h3><IcoTikTok size={20} /> Míranos trabajar en TikTok</h3>
            <a href={redes.tiktok} target="_blank" rel="noopener noreferrer">@{redes.tiktokUsuario} →</a>
          </div>
          <TikTokVideos />
        </section>

        {/* ── CLUB MILY ────────────────────────── */}
        <section id="club" className="seccion" data-scene="3">
          <Titulo eyebrow="Club Mily" sub="Entre más nos visitas, más te consentimos. Tu tarjeta de sellos vive en la nube: no se pierde.">
            Tu fidelidad tiene premio
          </Titulo>
          <ClubMily />
        </section>

        {/* ── COTIZA ───────────────────────────── */}
        <section id="cotiza" className="seccion seccion-angosta" data-scene="3">
          <Titulo eyebrow="Cotiza">¿Cuánto cuestan mis uñas?</Titulo>
          <Cotizador />
        </section>

        {/* ── AGENDA ───────────────────────────── */}
        <section id="agenda" className="seccion seccion-angosta" data-scene="4">
          <Titulo eyebrow="Agenda" sub="Llena tus datos y te respondemos por WhatsApp con los horarios disponibles.">
            Aparta tu lugar
          </Titulo>
          <Agendar />
        </section>

        {/* ── UBICACIÓN ────────────────────────── */}
        <section id="ubicacion" className="seccion" data-scene="4">
          <Titulo eyebrow="Visítanos">Aquí te esperamos</Titulo>
          <div className="ubicacion">
            <div className="mapa tarjeta">
              {negocio.mapsEmbed ? (
                <iframe
                  src={negocio.mapsEmbed}
                  title="Ubicación de Mily Nail's en Google Maps"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              ) : (
                <a className="mapa-vacio" href={negocio.mapsLink} target="_blank" rel="noopener noreferrer">
                  <IcoPin size={40} />
                  <span>Ver ubicación en Google Maps</span>
                </a>
              )}
            </div>
            <div className="info tarjeta">
              <h3><IcoReloj /> Horario</h3>
              <p className="horario-disp"><b>{negocio.horario}</b><br />{negocio.horarioNota}</p>
              <a className="btn btn-wa" href={saludoWA} target="_blank" rel="noopener noreferrer">
                <IcoWhatsApp /> Consultar disponibilidad
              </a>
              {negocio.direccion && (
                <p className="direccion"><IcoPin /> {negocio.direccion}</p>
              )}
              <a className="btn btn-secundario" href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(negocio.direccion)}`} target="_blank" rel="noopener noreferrer">
                Cómo llegar
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="pie" data-scene="4">
        <Image src="/logo.jpg" alt="" width={72} height={72} />
        <p className="pie-frase">Gracias por confiar tus manos en nosotras 💜</p>
        <div className="redes">
          <a href={redes.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><IcoFacebook size={24} /></a>
          <a href={redes.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><IcoInstagram size={24} /></a>
          <a href={redes.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok"><IcoTikTok size={24} /></a>
          <a href={saludoWA} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><IcoWhatsApp size={24} /></a>
        </div>
        <small>© {new Date().getFullYear()} Mily Nail&apos;s · Todos los derechos reservados</small>
      </footer>

      <a className="wa-flotante" href={saludoWA} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp">
        <IcoWhatsApp size={28} />
      </a>
    </>
  );
}
