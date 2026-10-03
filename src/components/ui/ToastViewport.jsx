import { AlertCircle, CheckCircle2, X } from 'lucide-react'

export function ToastViewport({ toasts, onDismiss }) {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-60 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error'
        const Icon = isError ? AlertCircle : CheckCircle2

        return (
          <div
            key={toast.id}
            role={isError ? 'alert' : 'status'}
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg transition duration-300 ease-out motion-reduce:transition-none starting:translate-y-2 starting:opacity-0 dark:border-slate-700 dark:bg-slate-800"
          >
            <Icon
              size={18}
              className={`shrink-0 ${isError ? 'text-red-500 dark:text-red-400' : 'text-green-500 dark:text-green-400'}`}
            />
            <p className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-100">
              {toast.message}
            </p>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Fermer la notification"
              className="shrink-0 rounded-md p-0.5 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
