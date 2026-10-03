import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useProspects } from '../hooks/useProspects'
import { useProspectModals } from '../hooks/useProspectModals'
import { usePayments } from '../hooks/usePayments'
import { useToast } from '../hooks/useToast'
import { CollectThisWeek } from '../components/dashboard/CollectThisWeek'
import { formatAmount, getCollectThisWeek } from '../utils/billing'
import { StatsGrid } from '../components/dashboard/StatsGrid'
import { FollowUpTodayList } from '../components/dashboard/FollowUpTodayList'
import { StatusBreakdown } from '../components/dashboard/StatusBreakdown'
import { ProspectFormModal } from '../components/prospects/ProspectFormModal'
import { QuickFollowUpModal } from '../components/prospects/QuickFollowUpModal'
import { BreakdownSkeleton, ListSkeleton, StatCardSkeleton } from '../components/ui/Skeleton'
import { formatLongDate } from '../utils/date'
import { isFollowUpDue } from '../utils/prospects'
import { getDisplayName } from '../utils/user'

const FOLLOW_UP_PREVIEW_LIMIT = 5

export default function Dashboard() {
  const { user } = useAuth()
  const { prospects, loading, error, editProspect } = useProspects()
  const modals = useProspectModals()

  const dueProspects = prospects
    .filter(isFollowUpDue)
    .sort((a, b) => new Date(a.next_follow_up) - new Date(b.next_follow_up))
  const previewProspects = dueProspects.slice(0, FOLLOW_UP_PREVIEW_LIMIT)
  const hiddenCount = dueProspects.length - previewProspects.length

  const toast = useToast()
  const { payments, loading: paymentsLoading, error: paymentsError, markPaid } = usePayments()
  const collect = getCollectThisWeek(prospects, payments)

  function handleMarkPaid({ client, billing }) {
    markPaid(client, billing.period)
      .then(() =>
        toast.success(`${formatAmount(client.subscription_amount)} encaissés pour ${client.name}`),
      )
      .catch((err) => {
        console.error('Failed to record payment', err)
        toast.error("Le paiement n'a pas pu être enregistré.")
      })
  }

  return (
    <div className="max-w-6xl">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Bonjour, {getDisplayName(user)}
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Voici ce qui se passe avec vos prospects aujourd'hui.
          </p>
        </div>
        <p className="hidden text-sm font-medium text-slate-400 sm:block dark:text-slate-500">
          {formatLongDate()}
        </p>
      </div>

      {error && <p className="mt-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <StatCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <StatsGrid prospects={prospects} />
        )}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              À relancer aujourd'hui
              {!loading && dueProspects.length > 0 && (
                <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600 tabular-nums dark:bg-red-500/10 dark:text-red-300">
                  {dueProspects.length}
                </span>
              )}
            </h2>
            <Link
              to="/relances"
              className="shrink-0 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
            >
              Voir tout →
            </Link>
          </div>

          <div className="mt-3 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            {loading ? (
              <ListSkeleton rows={FOLLOW_UP_PREVIEW_LIMIT} />
            ) : (
              <>
                <FollowUpTodayList
                  prospects={previewProspects}
                  onEdit={modals.openEdit}
                  onQuickFollowUp={modals.openQuickFollowUp}
                />
                {hiddenCount > 0 && (
                  <Link
                    to="/relances"
                    className="block border-t border-slate-100 px-4 py-3 text-center text-sm font-medium text-blue-600 transition-colors hover:bg-slate-50 dark:border-slate-800 dark:text-blue-400 dark:hover:bg-slate-800/40"
                  >
                    + {hiddenCount} autre{hiddenCount > 1 ? 's' : ''} relance
                    {hiddenCount > 1 ? 's' : ''} à traiter →
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Hidden until supabase/002_clients.sql has been run (payments table missing). */}
          {!paymentsError && (
            <>
              <div className="mt-8 flex items-center justify-between gap-3">
                <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
                  À encaisser cette semaine
                  {!loading && !paymentsLoading && collect.rows.length > 0 && (
                    <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 tabular-nums dark:bg-green-500/10 dark:text-green-300">
                      {formatAmount(collect.total)}
                    </span>
                  )}
                </h2>
                <Link
                  to="/clients"
                  className="shrink-0 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Voir les clients →
                </Link>
              </div>

              <div className="mt-3 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                {loading || paymentsLoading ? (
                  <ListSkeleton rows={3} />
                ) : (
                  <CollectThisWeek rows={collect.rows} onMarkPaid={handleMarkPaid} />
                )}
              </div>
            </>
          )}
        </div>

        <div>
          {loading ? <BreakdownSkeleton /> : <StatusBreakdown prospects={prospects} />}
        </div>
      </div>

      {modals.editingProspect && (
        <ProspectFormModal
          prospect={modals.editingProspect}
          onSave={(payload) => editProspect(modals.editingProspect.id, payload)}
          onClose={modals.closeEdit}
        />
      )}

      {modals.quickFollowUpProspect && (
        <QuickFollowUpModal
          prospect={modals.quickFollowUpProspect}
          onSave={editProspect}
          onClose={modals.closeQuickFollowUp}
        />
      )}
    </div>
  )
}
