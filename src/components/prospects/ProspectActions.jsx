import { Pencil, Bell, Trash2 } from 'lucide-react'

const neutralClass =
  'rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200'

export function ProspectActions({ onEdit, onQuickFollowUp, onDelete }) {
  return (
    <div className="flex items-center gap-0.5 sm:gap-1">
      <button
        type="button"
        onClick={onQuickFollowUp}
        title="Suivi : contacté aujourd'hui / prochaine relance"
        className={neutralClass}
      >
        <Bell size={16} />
      </button>
      <button type="button" onClick={onEdit} title="Modifier" className={neutralClass}>
        <Pencil size={16} />
      </button>
      <button
        type="button"
        onClick={onDelete}
        title="Supprimer"
        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 dark:text-slate-500 dark:hover:bg-red-500/10 dark:hover:text-red-400"
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
