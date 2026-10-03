import { StatusBadge } from './StatusBadge'
import { ProspectActions } from './ProspectActions'
import { formatDate, formatShortDate } from '../../utils/date'
import { isFollowUpDue } from '../../utils/prospects'

// Same columns on every screen: only what is needed at a glance. Contact and last
// contact are shown in the detail card opened by clicking the name.
// The container is `relative` so the sr-only header label stays inside the scroll area
// instead of widening the whole page.
export function ProspectTable({ prospects, onOpen, onEdit, onQuickFollowUp, onDelete }) {
  return (
    <div className="relative overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-xs font-medium tracking-wider text-slate-500 uppercase dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-400">
          <tr>
            <th className="px-3 py-3 sm:px-4">Établissement</th>
            <th className="px-2 py-3 sm:px-4">Statut</th>
            <th className="px-2 py-3 whitespace-nowrap sm:px-4">
              <span className="sm:hidden">Relance</span>
              <span className="hidden sm:inline">Prochaine relance</span>
            </th>
            <th className="px-2 py-3 sm:px-4">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {prospects.map((prospect) => {
            const overdue = isFollowUpDue(prospect)
            return (
              <tr
                key={prospect.id}
                className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
              >
                <td className="w-full max-w-0 px-3 py-3 sm:px-4">
                  <button
                    type="button"
                    onClick={() => onOpen(prospect)}
                    title="Voir la fiche"
                    className="group block w-full min-w-0 text-left"
                  >
                    <span className="block truncate font-medium text-slate-900 group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                      {prospect.name}
                    </span>
                    <span className="block truncate text-xs text-slate-500 dark:text-slate-400">
                      {prospect.city || '—'}
                    </span>
                  </button>
                </td>
                <td className="px-2 py-3 sm:px-4">
                  <StatusBadge status={prospect.status} compact />
                </td>
                <td
                  className={`px-2 py-3 whitespace-nowrap tabular-nums sm:px-4 ${
                    overdue
                      ? 'font-medium text-orange-600 dark:text-orange-400'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  <span className="sm:hidden">{formatShortDate(prospect.next_follow_up)}</span>
                  <span className="hidden sm:inline">{formatDate(prospect.next_follow_up)}</span>
                </td>
                <td className="px-1 py-3 sm:px-4">
                  <ProspectActions
                    onEdit={() => onEdit(prospect)}
                    onQuickFollowUp={() => onQuickFollowUp(prospect)}
                    onDelete={() => onDelete(prospect)}
                  />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {prospects.length === 0 && (
        <p className="px-4 py-8 text-center text-sm text-slate-400 dark:text-slate-500">
          Aucun prospect trouvé.
        </p>
      )}
    </div>
  )
}
