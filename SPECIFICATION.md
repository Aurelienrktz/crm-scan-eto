Je veux que tu développes une petite application web de gestion de prospects pour mon projet SCAN-ETO.

SCAN-ETO est un service de menus digitaux accessibles par QR code destiné aux restaurants, snacks, hôtels, pâtisseries, etc. Je contacte des établissements à Madagascar pour leur proposer ce service et j'ai besoin d'une interface simple pour suivre mes prospects.

IMPORTANT :
Je vais également te fournir une image de référence montrant le style visuel que je souhaite pour l'application.

Analyse attentivement cette image avant de commencer.

Je ne veux PAS copier exactement le contenu ou créer un CRM aussi complexe que celui de l'image. Je veux reprendre son PRINCIPAL LANGAGE VISUEL :
- sidebar sombre à gauche
- interface moderne et professionnelle
- beaucoup d'espace blanc
- cartes et tableaux propres
- coins légèrement arrondis
- badges colorés pour les statuts
- typographie moderne et lisible
- hiérarchie visuelle claire
- design SaaS moderne
- interface minimaliste mais élégante
- responsive desktop + mobile

==================================================
1. STACK TECHNIQUE
==================================================

Utilise :

- React.js
- Vite
- Tailwind CSS
- Supabase
- PostgreSQL via Supabase
- Supabase Authentication
- React Router si nécessaire
- Lucide React pour les icônes

L'application doit être simple, légère et facilement déployable sur Vercel.

N'utilise PAS de backend séparé.
N'utilise PAS Firebase.
N'utilise PAS de système de base de données local.
Toutes les données doivent être persistées dans Supabase.

==================================================
2. AUTHENTIFICATION
==================================================

L'application doit avoir une authentification avec Supabase Auth.

Pages :

/login

Après connexion :

/dashboard

L'utilisateur non authentifié ne doit pas pouvoir accéder au dashboard.

Utilise les protections appropriées côté Supabase avec Row Level Security.

Pour le moment, l'application est destinée à mon usage personnel, mais structure correctement l'authentification afin qu'elle puisse évoluer plus tard.

==================================================
3. BASE DE DONNÉES
==================================================

Nous voulons volontairement garder une base de données très simple.

Il n'y aura qu'une seule table principale :

prospects

Structure :

id
- UUID
- primary key
- génération automatique

name
- text
- nom du restaurant / établissement

city
- text
- ville

contact
- text
- peut contenir un numéro de téléphone, lien Facebook, WhatsApp, Messenger, etc.

status
- text
- pour le moment, la valeur par défaut est :
  "contacted"

created_at
- timestamp

last_contact
- date ou timestamp

next_follow_up
- date

note
- text

IMPORTANT :

Je ne veux PAS de table "interactions".

Je ne veux PAS de système CRM complexe.

Je ne veux PAS de table séparée pour les messages ou les relances.

Tout doit rester dans la table prospects.

Le statut peut être conçu de manière extensible pour permettre plus tard :

contacted
interested
follow_up
not_interested
client

Mais pour la première version, nous utiliserons principalement :

"Contacté / En attente"

==================================================
4. DASHBOARD
==================================================

Le dashboard est la page principale.

Je veux une sidebar sombre à gauche inspirée de l'image de référence.

Sidebar :

Logo / nom :
SCAN-ETO

Navigation :

- Dashboard
- Prospects
- À relancer

En bas :

- Settings éventuellement
- utilisateur connecté
- bouton déconnexion

Sur mobile, la sidebar doit devenir un menu mobile ou une navigation adaptée.

==================================================
5. DASHBOARD PRINCIPAL
==================================================

En haut :

"Bonjour 👋"

puis une petite phrase :

"Suivez facilement vos prospects SCAN-ETO."

Ajouter quelques statistiques simples sous forme de petites cartes :

- Total prospects
- En attente
- À relancer
- Clients

Même si certaines statistiques sont à 0 pour le moment.

Ces cartes doivent rester sobres et modernes.

==================================================
6. LISTE DES PROSPECTS
==================================================

La partie principale doit reprendre l'idée du tableau présent dans l'image de référence.

Titre :

"Prospects"

À côté :

"+ Ajouter un prospect"

Au-dessus du tableau :

- barre de recherche
- filtre par statut
- éventuellement filtre par ville
- bouton de tri

La recherche doit fonctionner rapidement sur :

- nom
- ville
- contact

==================================================
7. TABLEAU
==================================================

Le tableau doit contenir seulement les informations utiles.

Colonnes :

#
Établissement
Ville
Contact
Statut
Dernier contact
Prochaine relance
Actions

Exemple :

1 | King's Kebab | Toamasina | Facebook | Contacté | 23/09/2026 | 27/09/2026 | ...

Le statut doit être affiché sous forme de badge.

Exemple :

🟡 Contacté / En attente

Plus tard nous pourrons avoir :

🟢 Intéressé
🔵 Client
🟠 À relancer
🔴 Pas intéressé

Mais ne rends pas l'interface inutilement complexe maintenant.

==================================================
8. AJOUTER UN PROSPECT
==================================================

Quand je clique sur :

"+ Ajouter un prospect"

ouvrir un modal ou une page dédiée.

Champs :

Nom de l'établissement *
Ville
Contact
Dernier contact
Prochaine relance
Note

Le statut ne doit PAS être demandé dans le formulaire.

Tout nouveau prospect ajouté doit automatiquement avoir :

status = "contacted"

Boutons :

Annuler
Ajouter le prospect

Validation simple des champs.

==================================================
9. MODIFIER UN PROSPECT
==================================================

Chaque prospect doit pouvoir être modifié.

Je dois pouvoir modifier :

- nom
- ville
- contact
- statut
- dernier contact
- prochaine relance
- note

==================================================
10. SUPPRESSION
==================================================

Ajouter une possibilité de supprimer un prospect.

Mais demander une confirmation avant suppression.

Exemple :

"Supprimer ce prospect ?"

"Cette action est irréversible."

Boutons :

Annuler
Supprimer

==================================================
11. À RELANCER
==================================================

Créer une section/page :

"À relancer"

Elle doit automatiquement afficher les prospects dont :

next_follow_up <= aujourd'hui

et qui ne sont pas encore :

client
ou
not_interested

Cette page doit permettre de voir rapidement les prospects auxquels je dois envoyer une relance.

Afficher par exemple :

Restaurant Le Nil
Antananarivo
Dernier contact : 20/09/2026
Relance prévue : 23/09/2026

avec un badge :

🔔 À relancer

==================================================
12. DESIGN
==================================================

Utilise l'image fournie comme référence visuelle.

Je veux un design qui donne l'impression d'une vraie petite application SaaS professionnelle.

IMPORTANT :

Ne surcharge pas l'interface.

Je préfère :

- beaucoup d'espace
- peu de couleurs
- contraste clair
- composants simples
- bordures discrètes
- ombres très légères
- badges propres
- icônes cohérentes
- boutons modernes
- animations très légères

Palette générale :

Sidebar :
très sombre, bleu nuit / navy.

Contenu :
blanc ou gris très clair.

Texte :
gris foncé / presque noir.

Accent :
reprendre une couleur bleue moderne pour les actions principales.

Les statuts peuvent avoir leurs propres couleurs.

Ne mets PAS de gradients excessifs.

==================================================
13. RESPONSIVE
==================================================

L'application doit être parfaitement utilisable sur :

- ordinateur
- tablette
- téléphone

Sur mobile, le tableau peut devenir :

des cartes de prospects

plutôt que de forcer un tableau horizontal difficile à utiliser.

Le bouton "+ Ajouter" doit rester facilement accessible.

==================================================
14. UX
==================================================

Je veux pouvoir faire les opérations principales très rapidement.

Workflow :

Connexion
↓
Dashboard
↓
Voir mes prospects
↓
Ajouter un prospect
↓
Rechercher / filtrer
↓
Voir les prospects à relancer
↓
Modifier le prospect
↓
Ajouter une note ou modifier la prochaine relance

L'application doit être pensée pour quelqu'un qui l'utilise tous les jours pour contacter beaucoup de restaurants.

Évite donc les étapes inutiles.

==================================================
15. ARCHITECTURE DU CODE
==================================================

Organise proprement le projet.

Par exemple :

src/
├── components/
│   ├── layout/
│   ├── ui/
│   ├── prospects/
│   └── dashboard/
│
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Prospects.jsx
│   └── FollowUps.jsx
│
├── lib/
│   └── supabase.js
│
├── hooks/
│
├── services/
│   └── prospects.js
│
├── App.jsx
└── main.jsx

Tu peux adapter cette structure si tu as une meilleure organisation.

Je veux éviter d'avoir tout le code dans App.jsx.

==================================================
16. SUPABASE
==================================================

Prépare :

- connexion Supabase
- authentification
- récupération des prospects
- création
- modification
- suppression
- recherche / filtrage
- RLS

Donne-moi également le SQL nécessaire pour créer la table prospects et les policies RLS.

Je veux pouvoir copier-coller ce SQL directement dans Supabase SQL Editor.

==================================================
17. IMPORTANT : NE PAS SUR-ENGINEER
==================================================

C'est un petit outil personnel.

NE PAS ajouter :

- système de tâches complexe
- calendrier complexe
- notifications push
- emails automatiques
- WhatsApp API
- système de facturation
- CRM complet
- analytics complexes
- rôles complexes
- interactions multiples
- pipeline commercial complexe

Nous pourrons ajouter ces fonctionnalités plus tard si nécessaire.

Pour cette première version :

SIMPLE + RAPIDE + PROPRE + FIABLE.

==================================================
18. AVANT DE CODER
==================================================

Avant de générer le code complet :

1. Analyse l'image de référence.
2. Explique brièvement comment tu vas reprendre son design.
3. Présente l'architecture proposée.
4. Présente la structure de la base Supabase.
5. Présente les principales pages et composants.
6. Attends ma validation.

NE COMMENCE PAS immédiatement à générer tous les fichiers.

Je veux d'abord valider l'architecture et le design proposés.