// Íconos decorativos (dibujados a mano en SVG) para el fondo y la interfaz
type P = { size?: number; className?: string };

const base = (size = 24) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const Destello = ({ size, className }: P) => (
  <svg {...base(size)} className={className} fill="currentColor" stroke="none">
    <path d="M12 1.5c.5 4.8 2.7 7.6 7.5 8.4-4.8.8-7 3.6-7.5 10.6-.5-7-2.7-9.8-7.5-10.6 4.8-.8 7-3.6 7.5-8.4z" />
  </svg>
);

export const Esmalte = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <rect x="9.5" y="1.8" width="5" height="7" rx="1.2" />
    <path d="M8 9.5h8a2.5 2.5 0 0 1 2.5 2.5v7.5a2.7 2.7 0 0 1-2.7 2.7H8.2a2.7 2.7 0 0 1-2.7-2.7V12A2.5 2.5 0 0 1 8 9.5z" />
    <path d="M8.5 14.5c2 1 5 1 7 0" />
  </svg>
);

export const Una = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 2c3.6 0 5.8 4.6 5.8 10.2V20a2 2 0 0 1-2 2H8.2a2 2 0 0 1-2-2v-7.8C6.2 6.6 8.4 2 12 2z" />
    <path d="M7.6 8.2C9 6.6 15 6.6 16.4 8.2" />
  </svg>
);

export const Pincel = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M14.5 3.5l6 6-8.5 8.5-6-6z" />
    <path d="M6 12l-2.8 6.6c-.3.7.4 1.4 1.1 1.1L11 17" />
  </svg>
);

export const Gema = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M6.5 3.5h11L22 9l-10 12L2 9z" />
    <path d="M2 9h20M9 3.5L12 21l3-17.5M6.5 3.5 9 9l3-5.5L15 9l2.5-5.5" />
  </svg>
);

export const Flor = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <circle cx="12" cy="12" r="2.2" />
    <path d="M12 9.8c-2.6-3.8-.3-7 0-7s2.6 3.2 0 7zM12 14.2c-2.6 3.8-.3 7 0 7s2.6-3.2 0-7zM9.8 12c-3.8-2.6-7-.3-7 0s3.2 2.6 7 0zM14.2 12c3.8-2.6 7-.3 7 0s-3.2 2.6-7 0z" />
  </svg>
);

export const Corazon = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 20.5s-8-4.7-8-10.6A4.4 4.4 0 0 1 12 7.3a4.4 4.4 0 0 1 8 2.6c0 5.9-8 10.6-8 10.6z" />
  </svg>
);

export const Corona = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 10H5z" />
    <path d="M5 21h14" />
  </svg>
);

export const Gota = ({ size, className }: P) => (
  <svg {...base(size)} className={className}>
    <path d="M12 2.5S5.5 10 5.5 14.5a6.5 6.5 0 0 0 13 0C18.5 10 12 2.5 12 2.5z" />
  </svg>
);

/* Íconos de redes y utilidades (rellenos) */
export const IcoWhatsApp = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.3-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3z" />
  </svg>
);

export const IcoFacebook = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M13.5 21.9v-7.7h2.6l.4-3h-3V9.3c0-.9.3-1.5 1.5-1.5h1.6V5.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H7.8v3h2.6v7.7A10 10 0 1 1 13.5 21.9z" />
  </svg>
);

export const IcoInstagram = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
  </svg>
);

export const IcoTikTok = ({ size = 22 }: P) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M16.6 2h-3.3v13.4a2.9 2.9 0 1 1-2.9-2.9c.3 0 .6 0 .8.1V9.2h-.8a6.3 6.3 0 1 0 6.2 6.2V8.7a8 8 0 0 0 4.6 1.5V6.9A4.7 4.7 0 0 1 16.6 2z" />
  </svg>
);

export const IcoPin = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </svg>
);

export const IcoReloj = ({ size = 20 }: P) => (
  <svg {...base(size)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </svg>
);
