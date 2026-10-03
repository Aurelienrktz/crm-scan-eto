-- SCAN-ETO — Données de TEST (à exécuter dans le SQL Editor de Supabase, après 002_clients.sql)
-- Toutes les lignes ont une note qui commence par "[TEST]".
-- Pour tout effacer ensuite : exécutez supabase/delete_test_data.sql
-- Les dates sont calculées à partir d'aujourd'hui : l'interface est cohérente quel que soit le jour.

-- 1. Prospects (non clients) : couvrent tous les statuts et tous les cas de relance
insert into prospects (name, city, contact, status, created_at, last_contact, next_follow_up, note) values
  ('Restaurant Le Nil',     'Antananarivo', '034 12 345 67',                'contacted',      now() - interval '9 days',  current_date - 9,  current_date - 2,  '[TEST] Pas de réponse, relance en retard'),
  ('Snack Chez Fara',       'Toamasina',    'https://facebook.com/chezfara', 'contacted',      now() - interval '5 days',  current_date - 5,  current_date,      '[TEST] Relance prévue aujourd''hui'),
  ('Pâtisserie Mofo Gasy',  'Antsirabe',    'mofogasy@gmail.com',           'interested',     now() - interval '12 days', current_date - 3,  current_date + 2,  '[TEST] Intéressée, veut voir une démo'),
  ('Hôtel Colbert Café',    'Antananarivo', '+261 32 11 222 33',            'follow_up',      now() - interval '20 days', current_date - 6,  current_date - 1,  '[TEST] Décision avec l''équipe de direction'),
  ('Le Pirate Grill',       'Mahajanga',    'Messenger : Le Pirate Grill',  'follow_up',      now() - interval '15 days', current_date - 4,  current_date + 5,  '[TEST] Rappeler après la réunion des associés'),
  ('Kebab Tsara',           'Fianarantsoa', '033 45 678 90',                'contacted',      now() - interval '2 days',  current_date - 2,  current_date + 3,  '[TEST] Nouveau prospect'),
  ('La Varangue Express',   'Antananarivo', 'www.lavarangue-express.mg',    'interested',     now() - interval '30 days', current_date - 10, null,              '[TEST] Intéressé, pas encore de date de relance'),
  ('Pizza Bella Tana',      'Antananarivo', '034 98 765 43',                'not_interested', now() - interval '25 days', current_date - 25, null,              '[TEST] Déjà un menu papier, pas intéressé'),
  ('Brochettes du Port',    'Toamasina',    '032 55 444 33',                'contacted',      now() - interval '1 day',   current_date - 1,  current_date + 4,  '[TEST] Contacté hier sur WhatsApp');

-- 2. Clients : un exemple pour chaque état d'abonnement du mois
insert into prospects (name, city, contact, status, created_at, last_contact, next_follow_up, note,
                       contract_amount, subscription_amount, subscription_start, subscription_status) values
  -- En retard : échéance hier, pas encore payé
  ('King''s Kebab',         'Toamasina',    '034 11 222 33',      'client', now() - interval '70 days',  current_date - 30, null, '[TEST] Client en retard de paiement',
   300000, 20000, (current_date - interval '2 months' - interval '1 day')::date, 'active'),
  -- Échéance proche : dans 3 jours
  ('Snack Le Gourmand',     'Antananarivo', '033 22 333 44',      'client', now() - interval '40 days',  current_date - 20, null, '[TEST] Échéance dans 3 jours',
   250000, 15000, (current_date - interval '1 month' + interval '3 days')::date, 'active'),
  -- À venir : échéance dans environ 15 jours
  ('Hôtel Les Flamboyants', 'Mahajanga',    'contact@flamboyants.mg', 'client', now() - interval '80 days', current_date - 15, null, '[TEST] Échéance plus tard dans le mois',
   500000, 35000, (current_date - interval '2 months' + interval '15 days')::date, 'active'),
  -- Payés ce mois (voir paiements plus bas)
  ('Restaurant Sakamanga',  'Antananarivo', '034 33 444 55',      'client', now() - interval '120 days', current_date - 7,  null, '[TEST] Client payé ce mois',
   400000, 25000, (current_date - interval '3 months')::date, 'active'),
  ('Café de la Gare',       'Antsirabe',    '032 66 777 88',      'client', now() - interval '100 days', current_date - 5,  null, '[TEST] Client payé ce mois',
   300000, 20000, (current_date - interval '3 months' + interval '2 days')::date, 'active'),
  -- Pas encore commencé : début dans 40 jours
  ('Pâtisserie Ambohidahy', 'Antananarivo', '033 77 888 99',      'client', now() - interval '3 days',   current_date - 3,  null, '[TEST] Contrat signé, abonnement démarre plus tard',
   350000, 20000, (current_date + 40)::date, 'active'),
  -- Suspendu
  ('Grill Ivato',           'Antananarivo', '034 44 555 66',      'client', now() - interval '150 days', current_date - 40, null, '[TEST] Abonnement suspendu (travaux)',
   300000, 20000, (current_date - interval '4 months')::date, 'suspended'),
  -- Résilié
  ('Le Glacier',            'Toamasina',    '032 11 000 99',      'client', now() - interval '200 days', current_date - 60, null, '[TEST] Abonnement résilié',
   200000, 15000, (current_date - interval '6 months')::date, 'cancelled');

-- 3. Paiements : mois en cours pour 2 clients + historique des mois précédents
insert into payments (prospect_id, amount, period, paid_at)
select p.id, p.subscription_amount, m.period, m.paid_at
from prospects p
join (values
  ('Restaurant Sakamanga', date_trunc('month', current_date)::date,                        current_date - 1),
  ('Café de la Gare',      date_trunc('month', current_date)::date,                        current_date),
  ('Restaurant Sakamanga', (date_trunc('month', current_date) - interval '1 month')::date, (current_date - interval '1 month')::date),
  ('Café de la Gare',      (date_trunc('month', current_date) - interval '1 month')::date, (current_date - interval '1 month')::date),
  ('King''s Kebab',        (date_trunc('month', current_date) - interval '1 month')::date, (current_date - interval '1 month')::date),
  ('Snack Le Gourmand',    (date_trunc('month', current_date) - interval '1 month')::date, (current_date - interval '1 month')::date)
) as m(name, period, paid_at) on m.name = p.name
where p.note like '[TEST]%';
