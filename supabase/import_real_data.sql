-- SCAN-ETO — Import des vrais prospects (liste du téléphone)
-- À exécuter UNE FOIS dans le SQL Editor de Supabase.
--
-- 1. Supprime d'abord les données de test (note commençant par "[TEST]") et leurs paiements.
-- 2. Insère les vrais prospects. Un nom déjà présent (sans tenir compte des majuscules)
--    n'est pas réinséré : relancer ce script par erreur ne crée pas de doublons.
--
-- Dates de premier contact inconnues : "Dernier contact" reste vide.
-- Intéressés : relance prévue dans 5 jours. Sans réponse : aucune relance planifiée.

delete from prospects where note like '[TEST]%';

insert into prospects (name, city, status, last_contact, next_follow_up, note)
select v.name, v.city, v.status, null,
       case when v.status = 'interested' then current_date + 5 end,
       v.note
from (values
  -- Intéressés
  ('Izy M’kaly',                          null,           'interested', 'Intéressé — relance prévue à J+5'),
  ('Bounty Ocean Bristo',                 null,           'interested', 'Intéressé — relance prévue à J+5'),
  ('Ocean 501',                           null,           'interested', 'Intéressé — relance prévue à J+5'),
  ('Restaurant le Nil',                   null,           'interested', 'Intéressé — relance prévue à J+5'),
  ('L’insolite',                          null,           'interested', 'Intéressé — relance prévue à J+5'),
  ('Nosy Be Joie',                        null,           'interested', 'Intéressé — relance prévue à J+5'),
  ('Grill Shake Restaurant',              null,           'interested', 'Intéressé — relance prévue à J+5'),
  ('Korean Restaurant Hang Kang',         null,           'interested', 'Intéressé — relance prévue à J+5'),

  -- Pas encore répondu — Antananarivo
  ('Soleil d’orient',                     'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Le Carpe Diem',                       'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('La Varangue',                         'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Dune Coffee Shop',                    'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Les Plats de Mihary - Restaurant',    'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Café du Musé',                        'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Chez Melissa',                        'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Extra Pizza',                         'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Point Goût2',                         'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('La Petite Brasserie',                 'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Spoon Café',                          'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('L''Arrivage',                         'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Deli’break.mg',                       'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Smash N Heat',                        'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('La Plantation',                       'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Miam Miam',                           'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Tend’a-kanina',                       'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Nosy Manga',                          'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Le Goût d’Afrique',                   'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Blitz Food',                          'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Mbrgr',                               'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Le Plan B',                           'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Le Petit Verdout',                    'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Marais Restaurant',                   'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('La Gastronomie Pizza',                'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Sakamanga',                           'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Café de la Gare',                     'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Akany La Terasse',                    'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Chez Arnaud',                         'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Koob',                                'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Buble Bar',                           'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Le Fred',                             'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('King’s Kebab',                        'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Pizza Matsiro',                       'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Top Sushi Madagascar',                'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Bogota Fast Casual',                  'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Le Brazero Ivandry',                  'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Grillade Beef Coin',                  'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Restaurant Chez Riz Antsahamanitra',  'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Soleya',                              'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Vary sy Loka',                        'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Chez Les K-Chicken House',            'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Golden Wok',                          'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Escale Andriandro',                   'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Napolionwheels.mg',                   'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('La Rose de Tana',                     'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Gouthé Point Chaud',                  'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Sushi & Chill Tana',                  'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Pizzafy',                             'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Nooro Tower',                         'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Iray Residence',                      'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('La Ribaudière Hôtel-Restaurant',      'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Lotus Bleu',                          'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Hôtel Colbert Antananarivo',          'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Auberge Borabora',                    'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Cheerz Bypass',                       'Antananarivo', 'contacted', 'Premier message envoyé, pas encore de réponse'),

  -- Pas encore répondu — Toamasina
  ('Zanatany Beach',                      'Toamasina',    'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Pôk’pôkony',                          'Toamasina',    'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('La Braise Côté Cour',                 'Toamasina',    'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('La Terasse',                          'Toamasina',    'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Grillade et Saveurs Foulpointe',      'Toamasina',    'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('O’gagneur',                           'Toamasina',    'contacted', 'Premier message envoyé, pas encore de réponse'),

  -- Pas encore répondu — Antsirabe
  ('Valahara',                            'Antsirabe',    'contacted', 'Premier message envoyé, pas encore de réponse'),

  -- Pas encore répondu — Mahajanga
  ('Kitchen Diaries',                     'Mahajanga',    'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Chez Aly',                            'Mahajanga',    'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Cocoloko',                            'Mahajanga',    'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('C’bon Mahajanga',                     'Mahajanga',    'contacted', 'Premier message envoyé, pas encore de réponse'),

  -- Pas encore répondu — Nosy Be
  ('Les Seciliens Nosy Be',               'Nosy Be',      'contacted', 'Premier message envoyé, pas encore de réponse'),
  ('Villa Palissandre',                   'Nosy Be',      'contacted', 'Premier message envoyé, pas encore de réponse'),

  -- Pas encore répondu — Toliara
  ('Vahine Eco-Resort',                   'Toliara',      'contacted', 'Premier message envoyé, pas encore de réponse'),

  -- Pas intéressé
  ('Kafé Grille',                         null,           'not_interested', 'Pas intéressé')
) as v(name, city, status, note)
where not exists (
  select 1 from prospects p where lower(p.name) = lower(v.name)
);

-- Vérification : nombre de prospects par statut après l'import
select status, count(*) from prospects group by status order by status;
