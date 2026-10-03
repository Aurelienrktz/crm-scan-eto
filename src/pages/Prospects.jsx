import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useProspects } from '../hooks/useProspects'
import { useProspectModals } from '../hooks/useProspectModals'
import { Button } from '../components/ui/Button'
import { ConfirmDialog } from '../components/ui/ConfirmDialog'
import { TableSkeleton } from '../components/ui/Skeleton'
import { FiltersBar } from '../components/prospects/FiltersBar'
import { ProspectTable } from '../components/prospects/ProspectTable'
import { ProspectDetailModal } from '../components/prospects/ProspectDetailModal'
import { ProspectFormModal } from '../components/prospects/ProspectFormModal'
import { QuickFollowUpModal } from '../components/prospects/QuickFollowUpModal'
import { matchesSearch } from '../utils/prospects'

export default function Prospects() {
  const { prospects, loading, error, addProspect, editProspect, removeProspect } =
    useProspects()
  const modals = useProspectModals()

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [city, setCity] = useState('')
  const [sort, setSort] = useState('recent')

  // Clients have their own page; this list only shows people still being prospected.
  const pipeline = useMemo(() => prospects.filter((p) => p.status !== 'client'), [prospects])

  const cityOptions = useMemo(
    () => [...new Set(pipeline.map((p) => p.city).filter(Boolean))].sort(),
    [pipeline],
  )

  const filteredProspects = useMemo(() => {
    const filtered = pipeline.filter(
      (prospect) =>
        matchesSearch(prospect, search) &&
        (!status || prospect.status === status) &&
        (!city || prospect.city === city),
    )

    return [...filtered].sort((a, b) => {
      if (sort === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at)
      }
      if (sort === 'follow_up') {
        if (!a.next_follow_up) return 1
        if (!b.next_follow_up) return -1
        return new Date(a.next_follow_up) - new Date(b.next_follow_up)
      }
      return new Date(b.created_at) - new Date(a.created_at)
    })
  }, [pipeline, search, status, city, sort])

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
          Prospects
        </h1>
        <Button onClick={modals.openCreate}>
          <Plus size={16} />
          Ajouter un prospect
        </Button>
      </div>

      <div className="mt-4">
        <FiltersBar
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          city={city}
          onCityChange={setCity}
          cityOptions={cityOptions}
          sort={sort}
          onSortChange={setSort}
        />
      </div>

      <div className="mt-4">
        {loading && <TableSkeleton />}
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        {!loading && !error && (
          <>
            <p className="mb-3 text-sm text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-900 tabular-nums dark:text-slate-100">
                {filteredProspects.length}
              </span>{' '}
              prospect{filteredProspects.length > 1 ? 's' : ''}
            </p>
            <ProspectTable
              prospects={filteredProspects}
              onOpen={modals.openView}
              onEdit={modals.openEdit}
              onQuickFollowUp={modals.openQuickFollowUp}
              onDelete={modals.openDelete}
            />
          </>
        )}
      </div>

      {modals.viewingProspect && (
        <ProspectDetailModal
          prospect={modals.viewingProspect}
          onEdit={modals.openEdit}
          onQuickFollowUp={modals.openQuickFollowUp}
          onDelete={modals.openDelete}
          onClose={modals.closeView}
        />
      )}

      {modals.editingProspect && (
        <ProspectFormModal
          prospect={modals.editingProspect === 'new' ? null : modals.editingProspect}
          onSave={(payload) =>
            modals.editingProspect === 'new'
              ? addProspect(payload)
              : editProspect(modals.editingProspect.id, payload)
          }
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

      {modals.deletingProspect && (
        <ConfirmDialog
          title="Supprimer ce prospect ?"
          message={`« ${modals.deletingProspect.name} » sera définitivement supprimé. Cette action est irréversible.`}
          confirmLabel="Supprimer"
          successMessage="Prospect supprimé"
          errorMessage="La suppression a échoué, réessayez."
          onConfirm={() => removeProspect(modals.deletingProspect.id)}
          onClose={modals.closeDelete}
        />
      )}
    </div>
  )
}
