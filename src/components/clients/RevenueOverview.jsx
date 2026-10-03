import { AlertTriangle, Handshake, Wallet } from 'lucide-react'
import { formatAmount } from '../../utils/billing'

function Metric({ icon: Icon, label, value, hint, tone = 'default' }) {
  const valueClass =
    tone === 'danger' ? 'text-red-600 dark:text-red-400' : 'text-slate-900 dark:text-slate-50'

  return (
    <div className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/80 text-slate-500 ring-1 ring-slate-200/70 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className={`text-lg font-semibold tracking-tight tabular-nums ${valueClass}`}>{value}</p>
        {hint && <p className="text-xs text-slate-400 dark:text-slate-500">{hint}</p>}
      </div>
    </div>
  )
}

export function RevenueOverview({ summary, periodLabel }) {
  const progress =
    summary.monthlyExpected > 0
      ? Math.min(100, Math.round((summary.collectedThisMonth / summary.monthlyExpected) * 100))
      : 0

  return (
    <section className="grid gap-6 rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 via-white to-white p-5 shadow-sm sm:p-6 lg:grid-cols-[1.4fr_1fr] dark:border-blue-500/15 dark:from-blue-500/10 dark:via-slate-900 dark:to-slate-900">
      <div>
        <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
          Estimation de {periodLabel}
        </p>
        <p className="mt-1 text-4xl font-semibold tracking-tight text-slate-900 tabular-nums sm:text-5xl dark:text-white">
          {formatAmount(summary.monthlyExpected)}
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          {summary.billableCount} abonnement{summary.billableCount > 1 ? 's' : ''} attendu
          {summary.billableCount > 1 ? 's' : ''} ce mois
        </p>

        <div className="mt-5">
          <div className="flex items-baseline justify-between text-sm">
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {formatAmount(summary.collectedThisMonth)} encaissés
            </span>
            <span className="font-semibold text-slate-900 tabular-nums dark:text-slate-100">
              {progress}%
            </span>
          </div>
          <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-slate-200/70 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-linear-to-r from-green-400 to-green-500 transition-[width] duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
            {summary.remainingThisMonth > 0
              ? `Reste ${formatAmount(summary.remainingThisMonth)} à encaisser`
              : 'Tout est encaissé pour ce mois'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-blue-100 pt-5 sm:grid-cols-3 lg:grid-cols-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6 dark:border-slate-800">
        <Metric
          icon={Wallet}
          label="Total contrats"
          value={formatAmount(summary.contractsTotal)}
          hint="création des menus"
        />
        <Metric
          icon={Handshake}
          label="Clients actifs"
          value={summary.activeCount}
          hint={`sur ${summary.clientCount} client${summary.clientCount > 1 ? 's' : ''}`}
        />
        <Metric
          icon={AlertTriangle}
          label="En retard de paiement"
          value={summary.overdueCount}
          tone={summary.overdueCount > 0 ? 'danger' : 'default'}
          hint={summary.overdueCount > 0 ? 'à relancer' : 'aucun retard'}
        />
      </div>
    </section>
  )
}
