import { STATUS_CONFIG } from '../../utils/statusConfig'

export function StatusBreakdown({ prospects }) {
  const total = prospects.length
  const rows = Object.entries(STATUS_CONFIG).map(([status, { label, dotClass }]) => ({
    status,
    label,
    dotClass,
    count: prospects.filter((p) => p.status === status).length,
  }))

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        Répartition
      </h2>

      <div className="mt-4 space-y-3">
        {rows.map(({ status, label, dotClass, count }) => {
          const percent = total > 0 ? Math.round((count / total) * 100) : 0
          return (
            <div key={status}>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <span className={`h-2 w-2 rounded-full ${dotClass}`} />
                  {label}
                </span>
                <span className="font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                  {count}
                </span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                <div
                  className={`h-1.5 rounded-full ${dotClass}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
