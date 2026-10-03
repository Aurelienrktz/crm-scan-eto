import { CheckCircle2, Wallet } from 'lucide-react'
import { formatAmount } from '../../utils/billing'
import { formatDate } from '../../utils/date'
import { getInitials } from '../../utils/text'

export function CollectThisWeek({ rows, onMarkPaid }) {
  if (rows.length === 0) {
    return (
      <div className="flex flex-col items-center px-4 py-10 text-center">
        <Wallet size={28} className="text-slate-300 dark:text-slate-600" />
        <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Rien à encaisser cette semaine
        </p>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          Aucun abonnement en retard ni à échéance dans les 7 jours.
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {rows.map((row) => {
        const { client, billing } = row
        const overdue = billing.state === 'overdue'

        return (
          <div key={client.id} className="flex items-center gap-3 px-4 py-3">
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                overdue
                  ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300'
                  : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300'
              }`}
            >
              {getInitials(client.name)}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {client.name}
              </p>
              <p
                className={`truncate text-xs tabular-nums ${
                  overdue ? 'text-red-600 dark:text-red-400' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {overdue ? 'En retard depuis le' : 'Échéance le'} {formatDate(billing.dueDate)}
              </p>
            </div>

            <span className="shrink-0 text-sm font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {formatAmount(client.subscription_amount)}
            </span>
            <button
              type="button"
              onClick={() => onMarkPaid(row)}
              title="Marquer comme payé"
              className="shrink-0 rounded-md p-1.5 text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-500/10"
            >
              <CheckCircle2 size={18} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
