create extension if not exists "pgcrypto";

create table if not exists public.readings (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  cards jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists readings_session_created_idx
  on public.readings (session_id, created_at desc);

alter table public.readings enable row level security;

