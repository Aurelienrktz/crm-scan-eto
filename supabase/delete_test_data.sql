-- SCAN-ETO — Supprime UNIQUEMENT les données de test (note commençant par "[TEST]").
-- Leurs paiements sont supprimés automatiquement (on delete cascade).
-- Vos vrais prospects et clients ne sont pas touchés.

delete from prospects where note like '[TEST]%';
