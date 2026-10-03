-- SCAN-ETO Prospect Manager — schema + RLS
-- À exécuter dans le SQL Editor de Supabase.

create table if not exists prospects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  contact text,
  status text not null default 'contacted'
    check (status in ('contacted', 'interested', 'follow_up', 'not_interested', 'client')),
  created_at timestamptz not null default now(),
  last_contact date,
  next_follow_up date,
  note text
);

alter table prospects enable row level security;

-- Accès mono-utilisateur : tout compte authentifié (et lui seul) peut lire/écrire.
-- Pensez à désactiver l'auto-inscription publique dans Authentication > Providers,
-- sinon toute personne créant un compte obtiendrait le même accès.

create policy "authenticated users can read prospects"
  on prospects for select
  using (auth.role() = 'authenticated');

create policy "authenticated users can insert prospects"
  on prospects for insert
  with check (auth.role() = 'authenticated');

create policy "authenticated users can update prospects"
  on prospects for update
  using (auth.role() = 'authenticated');

create policy "authenticated users can delete prospects"
  on prospects for delete
  using (auth.role() = 'authenticated');
