import { Modal } from './Modal'
import { Button } from './Button'
import { useToast } from '../../hooks/useToast'

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Confirmer',
  successMessage,
  errorMessage = 'Une erreur est survenue, réessayez.',
  onConfirm,
  onClose,
}) {
  const toast = useToast()

  function handleConfirm() {
    onConfirm()
      .then(() => {
        if (successMessage) toast.success(successMessage)
      })
      .catch((err) => {
        console.error('Failed to confirm action', err)
        toast.error(errorMessage)
      })
    onClose()
  }

  return (
    <Modal title={title} onClose={onClose}>
      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="secondary" onClick={onClose}>
          Annuler
        </Button>
        <Button variant="danger" onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  )
}
