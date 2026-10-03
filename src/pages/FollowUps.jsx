import { useMemo } from "react";
import { useProspects } from "../hooks/useProspects";
import { useProspectModals } from "../hooks/useProspectModals";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { ProspectCard } from "../components/prospects/ProspectCard";
import { ProspectFormModal } from "../components/prospects/ProspectFormModal";
import { QuickFollowUpModal } from "../components/prospects/QuickFollowUpModal";
import { FollowUpStatCards } from "../components/prospects/FollowUpStatCards";
import { CardSkeleton, StatCardSkeleton } from "../components/ui/Skeleton";
import { isFollowUpDue } from "../utils/prospects";

export default function FollowUps() {
  const { prospects, loading, error, editProspect, removeProspect } =
    useProspects();
  const modals = useProspectModals();

  const dueProspects = useMemo(
    () =>
      prospects
        .filter(isFollowUpDue)
        .sort(
          (a, b) => new Date(a.next_follow_up) - new Date(b.next_follow_up),
        ),
    [prospects],
  );

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-slate-50">
        À relancer
      </h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        Prospects dont la relance est prévue aujourd'hui ou déjà dépassée.
      </p>

      {loading && (
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <StatCardSkeleton key={index} />
          ))}
        </div>
      )}

      {!loading && !error && (
        <div className="mt-4">
          <FollowUpStatCards prospects={prospects} />
        </div>
      )}

      <div className="mt-6">
        {loading && (
          <div role="status" aria-label="Chargement" className="grid gap-3 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <CardSkeleton key={index} />
            ))}
          </div>
        )}
        {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

        {!loading && !error && (
          <div className="grid gap-3 md:grid-cols-2">
            {dueProspects.map((prospect) => (
              <ProspectCard
                key={prospect.id}
                prospect={prospect}
                onEdit={modals.openEdit}
                onQuickFollowUp={modals.openQuickFollowUp}
                onDelete={modals.openDelete}
              />
            ))}
            {dueProspects.length === 0 && (
              <p className="py-8 text-sm text-slate-400 dark:text-slate-500">
                Aucune relance en attente.
              </p>
            )}
          </div>
        )}
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
  );
}
