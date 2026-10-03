import { StatusBadge } from './StatusBadge'
import { ContactLink } from './ContactLink'
import { ProspectActions } from './ProspectActions'
import { formatDate } from '../../utils/date'
import { isFollowUpDue } from '../../utils/prospects'

export function ProspectCard({ prospect, onEdit, onQuickFollowUp, onDelete }) {
  const overdue = isFollowUpDue(prospect)

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900 dark:text-slate-100">
            {prospect.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">{prospect.city || '—'}</p>
        </div>
        <StatusBadge status={prospect.status} />
      </div>

      <div className="mt-3 space-y-1 text-sm text-slate-600 tabular-nums dark:text-slate-300">
        <p>
          <ContactLink value={prospect.contact} />
        </p>
        <p>Dernier contact : {formatDate(prospect.last_contact)}</p>
        <p className={overdue ? 'font-medium text-orange-600 dark:text-orange-400' : ''}>
          Prochaine relance : {formatDate(prospect.next_follow_up)}
        </p>
      </div>

      <div className="mt-3 flex justify-end border-t border-slate-100 pt-3 dark:border-slate-800">
        <ProspectActions
          onEdit={() => onEdit(prospect)}
          onQuickFollowUp={() => onQuickFollowUp(prospect)}
          onDelete={() => onDelete(prospect)}
        />
      </div>
    </div>
  )
}
