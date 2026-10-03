const COLOR_STYLES = {
  slate: {
    chip: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    border: 'border-l-slate-300 dark:border-l-slate-600',
  },
  indigo: {
    chip: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300',
    border: 'border-l-indigo-400 dark:border-l-indigo-400',
  },
  amber: {
    chip: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
    border: 'border-l-amber-400 dark:border-l-amber-400',
  },
  orange: {
    chip: 'bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-300',
    border: 'border-l-orange-400 dark:border-l-orange-400',
  },
  green: {
    chip: 'bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300',
    border: 'border-l-green-400 dark:border-l-green-400',
  },
  blue: {
    chip: 'bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300',
    border: 'border-l-blue-400 dark:border-l-blue-400',
  },
}

export function StatCard({ label, value, icon: Icon, color = 'slate', caption }) {
  const styles = COLOR_STYLES[color] ?? COLOR_STYLES.slate

  return (
    <div
      className={`rounded-2xl border border-l-4 border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${styles.border}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</span>
        {Icon && (
          <span className={`flex h-8 w-8 items-center justify-center rounded-full ${styles.chip}`}>
            <Icon size={16} />
          </span>
        )}
      </div>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-slate-50">
        {value}
      </p>
      {caption && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{caption}</p>}
    </div>
  )
}
