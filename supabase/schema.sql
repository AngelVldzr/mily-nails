-- Ejecuta este script en Supabase → SQL Editor → New query → Run

create table if not exists clientas (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  telefono text not null unique,          -- 10 dígitos
  creado_en timestamptz not null default now()
);

create table if not exists visitas (
  id uuid primary key default gen_random_uuid(),
  clienta_id uuid not null references clientas(id) on delete cascade,
  fecha timestamptz not null default now(),
  numero int not null,                    -- número de visita total de la clienta
  descuento int not null default 0,       -- % aplicado en esta visita
  nota text
);

create index if not exists visitas_clienta_idx on visitas(clienta_id);

-- Seguridad: activamos RLS SIN políticas públicas.
-- Solo el servidor (con la service role key) puede leer/escribir.
alter table clientas enable row level security;
alter table visitas enable row level security;
