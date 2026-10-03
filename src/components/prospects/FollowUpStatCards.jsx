import { AlertTriangle, CalendarClock, CalendarDays } from 'lucide-react'
import { isFollowUpOverdue, isFollowUpToday, isFollowUpUpcoming } from '../../utils/prospects'

const CARD_STYLES = {
  red: {
    card: 'border-red-200/70 from-red-100 to-red-50/40 dark:border-red-500/20 dark:from-red-500/20 dark:to-red-500/5',
    icon: 'bg-red-500/15 text-red-600 dark:bg-red-400/15 dark:text-red-300',
    label: 'text-red-700 dark:text-red-300',
  },
  amber: {
    card: 'border-amber-200/70 from-amber-100 to-amber-50/40 dark:border-amber-500/20 dark:from-amber-500/20 dark:to-amber-500/5',
    icon: 'bg-amber-500/15 text-amber-600 dark:bg-amber-400/15 dark:text-amber-300',
    label: 'text-amber-700 dark:text-amber-300',
  },
  blue: {
    card: 'border-blue-200/70 from-blue-100 to-blue-50/40 dark:border-blue-500/20 dark:from-blue-500/20 dark:to-blue-500/5',
    icon: 'bg-blue-500/15 text-blue-600 dark:bg-blue-400/15 dark:text-blue-300',
    label: 'text-blue-700 dark:text-blue-300',
  },
}

function FollowUpStatCard({ label, value, hint, icon: Icon, color }) {
  const styles = CARD_STYLES[color]

  return (
    <div className={`rounded-2xl border bg-linear-to-br p-5 shadow-sm ${styles.card}`}>
      <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${styles.icon}`}>
        <Icon size={20} />
      </span>
      <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums dark:text-white">
        {value}
      </p>
      <p className={`text-sm font-medium ${styles.label}`}>{label}</p>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
    </div>
  )
}

export function FollowUpStatCards({ prospects }) {
  const overdueCount = prospects.filter(isFollowUpOverdue).length
  const todayCount = prospects.filter(isFollowUpToday).length
  const upcomingCount = prospects.filter((p) => isFollowUpUpcoming(p)).length

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <FollowUpStatCard
        label="En retard"
        value={overdueCount}
        hint="à traiter en priorité"
        icon={AlertTriangle}
        color="red"
      />
      <FollowUpStatCard
        label="Aujourd'hui"
        value={todayCount}
        hint="relances prévues aujourd'hui"
        icon={CalendarClock}
        color="amber"
      />
      <FollowUpStatCard
        label="Prochains jours"
        value={upcomingCount}
        hint="dans les 7 prochains jours"
        icon={CalendarDays}
        color="blue"
      />
    </div>
  )
}
