import { Bell, Pencil, Trash2 } from 'lucide-react'
import { Modal } from '../ui/Modal'
import { StatusBadge } from './StatusBadge'
import { ContactLink } from './ContactLink'
import { formatDate } from '../../utils/date'
import { isFollowUpDue } from '../../utils/prospects'

function DetailRow({ label, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-sm text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium break-words text-slate-900 dark:text-slate-100">
        {children}
      </dd>
    </div>
  )
}

function ActionTile({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-lg border py-2.5 text-xs font-medium transition-colors ${
        danger
          ? 'border-red-200 text-red-600 hover:bg-red-50 dark:border-red-500/30 dark:text-red-400 dark:hover:bg-red-500/10'
          : 'border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
      }`}
    >
      <Icon size={18} />
      {label}
    </button>
  )
}

export function ProspectDetailModal({ prospect, onEdit, onQuickFollowUp, onDelete, onClose }) {
  const overdue = isFollowUpDue(prospect)

  return (
    <Modal title={prospect.name} onClose={onClose}>
      <StatusBadge status={prospect.status} />

      <dl className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
        <DetailRow label="Ville">{prospect.city || '—'}</DetailRow>
        <DetailRow label="Contact">
          <ContactLink value={prospect.contact} />
        </DetailRow>
        <DetailRow label="Dernier contact">
          <span className="tabular-nums">{formatDate(prospect.last_contact)}</span>
        </DetailRow>
        <DetailRow label="Prochaine relance">
          <span
            className={`tabular-nums ${overdue ? 'text-orange-600 dark:text-orange-400' : ''}`}
          >
            {formatDate(prospect.next_follow_up)}
          </span>
        </DetailRow>
        <DetailRow label="Ajouté le">
          <span className="tabular-nums">
            {new Date(prospect.created_at).toLocaleDateString('fr-FR')}
          </span>
        </DetailRow>
      </dl>

      {prospect.note && (
        <div className="mt-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800/60">
          <p className="text-xs font-medium tracking-wider text-slate-500 uppercase dark:text-slate-400">
            Note
          </p>
          <p className="mt-1 text-sm whitespace-pre-line text-slate-700 dark:text-slate-200">
            {prospect.note}
          </p>
        </div>
      )}

      <div className="mt-5 grid grid-cols-3 gap-2">
        <ActionTile icon={Bell} label="Suivi" onClick={() => onQuickFollowUp(prospect)} />
        <ActionTile icon={Pencil} label="Modifier" onClick={() => onEdit(prospect)} />
        <ActionTile icon={Trash2} label="Supprimer" danger onClick={() => onDelete(prospect)} />
      </div>
    </Modal>
  )
}
