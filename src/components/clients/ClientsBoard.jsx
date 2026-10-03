import { useState } from 'react'
import { CheckCircle2, ChevronDown, ChevronUp, Pencil, Undo2 } from 'lucide-react'
import { BillingBadge } from './BillingBadge'
import { formatAmount, isBillable } from '../../utils/billing'
import { formatDate } from '../../utils/date'
import { getInitials } from '../../utils/text'

const LANE_PREVIEW_LIMIT = 5

const LANES = [
  {
    key: 'todo',
    title: 'À encaisser',
    states: ['overdue', 'due_soon', 'upcoming', 'incomplete'],
    dot: 'bg-amber-400',
    empty: 'Rien à encaisser pour le moment.',
  },
  {
    key: 'paid',
    title: 'Payés ce mois',
    states: ['paid'],
    dot: 'bg-green-400',
    empty: 'Aucun paiement enregistré ce mois-ci.',
  },
  {
    key: 'inactive',
    title: 'Hors facturation ce mois',
    states: ['not_started', 'suspended', 'cancelled'],
    dot: 'bg-slate-400',
    empty: 'Aucun abonnement à venir, suspendu ou résilié.',
  },
]

const AVATAR_TONES = {
  overdue: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  due_soon: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  paid: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-300',
}
const DEFAULT_AVATAR_TONE = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'

const iconButtonClass =
  'rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200'

function ClientTile({ row, onEdit, onMarkPaid, onCancelPayment }) {
  const { client, billing } = row
  const canMarkPaid = isBillable(billing) && billing.state !== 'paid'

  return (
    <article className="rounded-xl border border-slate-200/70 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start gap-3">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
            AVATAR_TONES[billing.state] ?? DEFAULT_AVATAR_TONE
          }`}
        >
          {getInitials(client.name)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-slate-900 dark:text-slate-100">{client.name}</p>
          <p className="truncate text-xs text-slate-500 dark:text-slate-400">
            {client.city || '—'}
            {billing.dueDate && (
              <span className="tabular-nums"> · échéance le {formatDate(billing.dueDate)}</span>
            )}
            {billing.state === 'not_started' && (
              <span className="tabular-nums">
                {' '}
                · démarre le {formatDate(client.subscription_start)}
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onEdit(client)}
          title="Modifier le contrat"
          className={iconButtonClass}
        >
          <Pencil size={15} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-base font-semibold text-slate-900 tabular-nums dark:text-slate-100">
            {client.subscription_amount != null ? formatAmount(client.subscription_amount) : '—'}
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400"> / mois</span>
          </p>
          <div className="mt-1">
            <BillingBadge state={billing.state} />
          </div>
        </div>

        {canMarkPaid && (
          <button
            type="button"
            onClick={() => onMarkPaid(row)}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-green-700 dark:hover:bg-green-500"
          >
            <CheckCircle2 size={14} />
            Payé
          </button>
        )}
        {billing.state === 'paid' && (
          <button
            type="button"
            onClick={() => onCancelPayment(row)}
            title="Annuler le paiement du mois"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <Undo2 size={14} />
            Annuler
          </button>
        )}
      </div>
    </article>
  )
}

export function ClientsBoard({ rows, onEdit, onMarkPaid, onCancelPayment }) {
  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 px-6 py-12 text-center dark:border-slate-700">
        <p className="font-medium text-slate-700 dark:text-slate-200">Aucun client pour l'instant</p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Passez un prospect au statut « Client » pour suivre son abonnement ici.
        </p>
      </div>
    )
  }

  return (
    <div className="grid items-start gap-4 lg:grid-cols-3">
      {LANES.map((lane) => (
        <Lane
          key={lane.key}
          lane={lane}
          rows={rows.filter((row) => lane.states.includes(row.billing.state))}
          onEdit={onEdit}
          onMarkPaid={onMarkPaid}
          onCancelPayment={onCancelPayment}
        />
      ))}
    </div>
  )
}

function Lane({ lane, rows, onEdit, onMarkPaid, onCancelPayment }) {
  const [expanded, setExpanded] = useState(false)
  const laneTotal = rows.reduce((total, row) => total + (row.client.subscription_amount ?? 0), 0)
  const hiddenCount = rows.length - LANE_PREVIEW_LIMIT
  const visibleRows = expanded ? rows : rows.slice(0, LANE_PREVIEW_LIMIT)

  return (
    <section className="flex flex-col rounded-2xl bg-slate-100/70 p-3 dark:bg-slate-900/60">
      <header className="mb-3 flex items-center justify-between px-1">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          <span className={`h-2 w-2 rounded-full ${lane.dot}`} />
          {lane.title}
          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-600 tabular-nums dark:bg-slate-800 dark:text-slate-300">
            {rows.length}
          </span>
        </h3>
        {lane.key !== 'inactive' && rows.length > 0 && (
          <span className="text-xs font-medium text-slate-500 tabular-nums dark:text-slate-400">
            {formatAmount(laneTotal)}
          </span>
        )}
      </header>

      <div className="space-y-2.5">
        {visibleRows.map((row) => (
          <ClientTile
            key={row.client.id}
            row={row}
            onEdit={onEdit}
            onMarkPaid={onMarkPaid}
            onCancelPayment={onCancelPayment}
          />
        ))}
        {rows.length === 0 && (
          <p className="px-1 py-6 text-center text-xs text-slate-400 dark:text-slate-500">
            {lane.empty}
          </p>
        )}
      </div>

      {hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          aria-expanded={expanded}
          className="mt-2.5 flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-white hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
          {expanded ? (
            <>
              <ChevronUp size={14} />
              Réduire
            </>
          ) : (
            <>
              <ChevronDown size={14} />
              Voir {hiddenCount} autre{hiddenCount > 1 ? 's' : ''}
            </>
          )}
        </button>
      )}
    </section>
  )
}
