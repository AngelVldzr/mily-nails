-- Ejecuta este script en Supabase → SQL Editor → New query → Run
-- Se puede correr varias veces sin problema.

create table if not exists clientas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null check (char_length(nombre) between 2 and 60),
  telefono text not null unique check (telefono ~ '^[0-9]{10}$'),   -- 10 dígitos exactos
  creado_en timestamptz not null default now()
);

create table if not exists visitas (
  id uuid primary key default gen_random_uuid(),
  clienta_id uuid not null references clientas(id) on delete cascade,
  fecha timestamptz not null default now(),
  numero int not null check (numero > 0),          -- número de visita total de la clienta
  descuento int not null default 0 check (descuento between 0 and 100),
  nota text check (nota is null or char_length(nota) <= 200),
  unique (clienta_id, numero)                       -- evita registrar dos veces la misma visita
);

create index if not exists visitas_clienta_idx on visitas(clienta_id);

-- Registro anónimo de intentos (límite de intentos de login y de consultas).
-- No guarda IPs reales, solo una huella cifrada. Se limpia sola después de 1 día.
create table if not exists limites (
  id bigint generated always as identity primary key,
  clave text not null check (char_length(clave) <= 80),
  creado_en timestamptz not null default now()
);
create index if not exists limites_clave_idx on limites(clave, creado_en);

-- ─── SEGURIDAD ─────────────────────────────────────────────────────
-- RLS activado SIN políticas públicas: nadie puede leer/escribir con la llave pública (anon).
-- Solo el servidor de la página (con la service role key) tiene acceso.
alter table clientas enable row level security;
alter table visitas  enable row level security;
alter table limites  enable row level security;

-- Doble candado: quitamos permisos a los roles públicos
revoke all on clientas, visitas, limites from anon, authenticated;
