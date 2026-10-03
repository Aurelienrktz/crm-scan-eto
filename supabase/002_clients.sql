-- SCAN-ETO — Suivi des clients et des abonnements
-- À exécuter UNE FOIS dans le SQL Editor de Supabase, après schema.sql.
-- Montants en Ariary (entiers).

-- 1. Informations de contrat, sur la fiche du client (un client = un abonnement)
alter table prospects
  add column if not exists contract_amount integer check (contract_amount >= 0),
  add column if not exists subscription_amount integer check (subscription_amount >= 0),
  add column if not exists subscription_start date,
  add column if not exists subscription_status text not null default 'active'
    check (subscription_status in ('active', 'suspended', 'cancelled'));

-- 2. Historique des paiements d'abonnement (un paiement par client et par mois)
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  prospect_id uuid not null references prospects(id) on delete cascade,
  amount integer not null check (amount >= 0),
  period date not null, -- premier jour du mois payé, ex. 2026-10-01
  paid_at date not null default current_date,
  created_at timestamptz not null default now(),
  unique (prospect_id, period)
);

alter table payments enable row level security;

create policy "authenticated users can read payments"
  on payments for select
  using (auth.role() = 'authenticated');

create policy "authenticated users can insert payments"
  on payments for insert
  with check (auth.role() = 'authenticated');

create policy "authenticated users can update payments"
  on payments for update
  using (auth.role() = 'authenticated');

create policy "authenticated users can delete payments"
  on payments for delete
  using (auth.role() = 'authenticated');
