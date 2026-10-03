import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useProspects } from '../hooks/useProspects'
import { usePayments } from '../hooks/usePayments'
import { useToast } from '../hooks/useToast'
import { Button } from '../components/ui/Button'
import { CardSkeleton, Skeleton } from '../components/ui/Skeleton'
import { RevenueOverview } from '../components/clients/RevenueOverview'
import { ClientsBoard } from '../components/clients/ClientsBoard'
import { ProspectFormModal } from '../components/prospects/ProspectFormModal'
import {
  compareBillingRows,
  currentPeriod,
  formatAmount,
  formatPeriod,
  getBillingSummary,
  getMonthlyBilling,
} from '../utils/billing'

export default function Clients() {
  const {
    prospects,
    loading: prospectsLoading,
    error: prospectsError,
    addProspect,
    editProspect,
  } = useProspects()
  const { payments, loading: paymentsLoading, error: paymentsError, markPaid, cancelPayment } =
    usePayments()
  const toast = useToast()
  const [editingClient, setEditingClient] = useState(null)
  const [creatingClient, setCreatingClient] = useState(false)

  const loading = prospectsLoading || paymentsLoading
  const error = prospectsError || paymentsError
  const periodLabel = formatPeriod(currentPeriod())

  const rows = useMemo(
    () =>
      prospects
        .filter((p) => p.status === 'client')
        .map((client) => ({ client, billing: getMonthlyBilling(client, payments) }))
        .sort(compareBillingRows),
    [prospects, payments],
  )
  const summary = useMemo(() => getBillingSummary(prospects, payments), [prospects, payments])

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

  function handleCancelPayment({ client, billing }) {
    cancelPayment(billing.payment)
      .then(() => toast.success(`Paiement de ${client.name} annulé`))
      .catch((err) => {
        console.error('Failed to cancel payment', err)
        toast.error("Le paiement n'a pas pu être annulé.")
      })
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            Clients
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Contrats, abonnements et encaissements de {periodLabel}.
          </p>
        </div>
        <Button onClick={() => setCreatingClient(true)} className="shrink-0">
          <Plus size={16} />
          <span className="hidden sm:inline">Ajouter un client</span>
          <span className="sm:hidden">Ajouter</span>
        </Button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300">
          <p className="font-medium">Impossible de charger les clients.</p>
          <p className="mt-1">
            Si c'est la première utilisation, exécutez le fichier{' '}
            <code className="font-mono">supabase/002_clients.sql</code> dans le SQL Editor de
            Supabase.
          </p>
          <p className="mt-1 text-xs opacity-80">Détail : {error}</p>
        </div>
      )}

      {loading ? (
        <div role="status" aria-label="Chargement" className="mt-6 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="mt-3 h-12 w-64" />
            <Skeleton className="mt-6 h-2.5 w-full rounded-full" />
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {Array.from({ length: 3 }, (_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        </div>
      ) : (
        !error && (
          <>
            <div className="mt-6">
              <RevenueOverview summary={summary} periodLabel={periodLabel} />
            </div>

            <h2 className="mt-8 mb-3 text-base font-semibold tracking-tight text-slate-900 dark:text-slate-50">
              Suivi des abonnements
            </h2>
            <ClientsBoard
              rows={rows}
              onEdit={setEditingClient}
              onMarkPaid={handleMarkPaid}
              onCancelPayment={handleCancelPayment}
            />
          </>
        )
      )}

      {editingClient && (
        <ProspectFormModal
          prospect={editingClient}
          onSave={(payload) => editProspect(editingClient.id, payload)}
          onClose={() => setEditingClient(null)}
        />
      )}

      {creatingClient && (
        <ProspectFormModal
          asClient
          prospect={null}
          onSave={addProspect}
          onClose={() => setCreatingClient(false)}
        />
      )}
    </div>
  )
}
