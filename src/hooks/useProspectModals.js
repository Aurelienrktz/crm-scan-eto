import { useState } from 'react'

export function useProspectModals() {
  const [viewingProspect, setViewingProspect] = useState(null)
  const [editingProspect, setEditingProspect] = useState(null) // null | 'new' | prospect
  const [quickFollowUpProspect, setQuickFollowUpProspect] = useState(null)
  const [deletingProspect, setDeletingProspect] = useState(null)

  // Opening an action replaces the detail view instead of stacking on top of it.
  function openAction(setter) {
    return (prospect) => {
      setViewingProspect(null)
      setter(prospect)
    }
  }

  return {
    viewingProspect,
    editingProspect,
    quickFollowUpProspect,
    deletingProspect,
    openView: (prospect) => setViewingProspect(prospect),
    closeView: () => setViewingProspect(null),
    openCreate: () => setEditingProspect('new'),
    openEdit: openAction(setEditingProspect),
    closeEdit: () => setEditingProspect(null),
    openQuickFollowUp: openAction(setQuickFollowUpProspect),
    closeQuickFollowUp: () => setQuickFollowUpProspect(null),
    openDelete: openAction(setDeletingProspect),
    closeDelete: () => setDeletingProspect(null),
  }
}
