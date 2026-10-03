import { STATUS_CONFIG } from '../../utils/statusConfig'

// `compact` shows the short label on phones (e.g. "Contacté" instead of "Contacté / En attente").
export function StatusBadge({ status, compact = false }) {
  const config = STATUS_CONFIG[status]
  if (!config) return null
  const showShort = compact && config.shortLabel

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap sm:px-2.5 ${config.badgeClass}`}
    >
      {showShort ? (
        <>
          <span className="sm:hidden">{config.shortLabel}</span>
          <span className="hidden sm:inline">{config.label}</span>
        </>
      ) : (
        config.label
      )}
    </span>
  )
}
