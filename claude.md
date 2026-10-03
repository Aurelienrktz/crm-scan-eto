# SCAN-ETO Prospect Manager

## Project

Internal web application for managing SCAN-ETO prospects.

SCAN-ETO provides QR-code digital menus for restaurants, snacks, hotels,
patisseries and other establishments in Madagascar.

## Stack

- React.js
- Vite
- Tailwind CSS
- Supabase
- PostgreSQL via Supabase
- Supabase Auth
- React Router
- Lucide React
- Vercel

Do not use Firebase.

Do not create a separate backend.

All persistent data must be stored in Supabase.

## Core principles

The application must remain:

- simple
- lightweight
- modern
- fast
- responsive
- maintainable

Do not over-engineer the application.

Avoid unnecessary dependencies and abstractions.

Before adding a new major feature, explain briefly why it is useful
and make sure it does not unnecessarily complicate the application.

## Database

The main table is `prospects`.

Fields:

- id
- name
- city
- contact
- status
- created_at
- last_contact
- next_follow_up
- note
- contract_amount (one-time price for building the menu, Ariary)
- subscription_amount (monthly hosting & support price, Ariary)
- subscription_start (monthly due date = same day of the month)
- subscription_status (active | suspended | cancelled)

The only other table is `payments` (subscription payments history):
id, prospect_id, amount, period (first day of the paid month), paid_at.
One payment per client and per month. See `supabase/002_clients.sql`.

There is NO interactions table.

There is NO separate messages table.

There is NO separate follow-ups table.

Keep the database intentionally minimal.

## Statuses

Database values:

- contacted
- interested
- follow_up
- not_interested
- client

UI labels:

- contacted → Contacté / En attente
- interested → Intéressé
- follow_up → À relancer
- not_interested → Pas intéressé
- client → Client

New prospects must automatically use:

`contacted`

## Authentication

Use Supabase Auth.

Unauthenticated users must not access the dashboard.

Use Supabase Row Level Security.

Never expose a Supabase service-role key in the frontend.

Use environment variables:

- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

## Main features

- Authentication
- Dashboard
- Prospect management
- Search
- Filtering
- Sorting
- Follow-up tracking
- "À relancer" page
- Simple statistics
- "Clients" page: contract totals, expected monthly revenue,
  who paid this month's subscription (simple tracking only)

## Design reference

The visual reference is located at:

`docs/design-reference.png`

Inspect this image when implementing the UI.

Use it only as visual inspiration.

Do not copy its content, data or exact layout.

Visual language:

- dark sidebar
- modern SaaS interface
- clean tables
- spacious layout
- subtle badges
- rounded cards
- modern typography
- clear hierarchy
- responsive design

The application should feel professional without becoming visually complex.

## Code architecture

Do not put the entire application logic inside `App.jsx`.

Keep pages, components, services, hooks and utilities separated when useful.

Reuse existing components and utilities instead of duplicating code.

## Before modifying the project

Always:

1. Inspect the existing project structure.
2. Inspect relevant existing files.
3. Reuse existing code when appropriate.
4. Avoid rewriting working code unnecessarily.
5. Avoid introducing new dependencies without a clear reason.

## Responsive design

The application must work properly on:

- desktop
- tablet
- mobile

On mobile, tables may become cards when appropriate.

## Important

This is a small personal prospect-management tool.

Do NOT turn it into a complex CRM.

Do not add:

- complex task management
- complex calendar
- push notifications
- automatic emails
- WhatsApp API
- invoicing, PDF invoices or online payments (subscription tracking
  on the Clients page is allowed, but stays a simple paid / not paid record)
- complex analytics
- complex roles
- interaction history
- complex sales pipelines
