import { useEffect } from 'react'
import { X } from 'lucide-react'

export function Modal({ title, onClose, children, className = '' }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 dark:bg-slate-950/70">
      <div
        role="presentation"
        className="absolute inset-0"
        onClick={onClose}
      />
      <div
        className={`relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-5 shadow-lg sm:p-6 dark:border dark:border-slate-800 dark:bg-slate-900 ${className}`}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
