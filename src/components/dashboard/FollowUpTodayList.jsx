import { Bell, CheckCircle2, Pencil } from 'lucide-react'
import { formatDate, isPast } from '../../utils/date'
import { getInitials as initials } from '../../utils/text'

function DueBadge({ date }) {
  const overdue = isPast(date)

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ${
        overdue
          ? 'border border-red-200 bg-red-50 text-red-600 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300'
          : 'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300'
      }`}
    >
      {overdue ? 'En retard' : "Aujourd'hui"}
    </span>
  )
}

const actionClass =
  'rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200'

export function FollowUpTodayList({ prospects, onEdit, onQuickFollowUp }) {
  if (prospects.length === 0) {
    return (
      <div className="flex flex-col items-center px-4 py-10 text-center">
        <CheckCircle2 size={28} className="text-green-500 dark:text-green-400" />
        <p className="mt-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
          Tout est à jour
        </p>
        <p className="mt-1 text-sm text-slate-400 dark:text-slate-500">
          Aucune relance prévue aujourd'hui.
        </p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800">
      {prospects.map((prospect) => (
        <div key={prospect.id} className="flex items-center gap-3 px-4 py-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {initials(prospect.name)}
          </span>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {prospect.name}
            </p>
            <p className="truncate text-xs text-slate-500 tabular-nums dark:text-slate-400">
              {prospect.city || '—'} · Dernier contact : {formatDate(prospect.last_contact)}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <DueBadge date={prospect.next_follow_up} />
            <button
              type="button"
              onClick={() => onEdit(prospect)}
              title="Modifier"
              className={actionClass}
            >
              <Pencil size={14} />
            </button>
            <button
              type="button"
              onClick={() => onQuickFollowUp(prospect)}
              title="Suivi : contacté aujourd'hui / prochaine relance"
              className={actionClass}
            >
              <Bell size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
