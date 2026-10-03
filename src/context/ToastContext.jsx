import { createContext, useCallback, useMemo, useRef, useState } from 'react'
import { ToastViewport } from '../components/ui/ToastViewport'

export const ToastContext = createContext(undefined)

const DURATION_MS = { success: 3500, error: 6000 }
const MAX_VISIBLE = 3

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback(
    (type, message) => {
      nextId.current += 1
      const id = nextId.current
      setToasts((current) => [...current.slice(-(MAX_VISIBLE - 1)), { id, type, message }])
      setTimeout(() => dismiss(id), DURATION_MS[type])
    },
    [dismiss],
  )

  const toast = useMemo(
    () => ({
      success: (message) => show('success', message),
      error: (message) => show('error', message),
    }),
    [show],
  )

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastViewport toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  )
}
