import { Menu } from 'lucide-react'
import { BrandMark } from '../ui/BrandMark'

export function MobileTopbar({ onOpenMenu }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 md:hidden dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={onOpenMenu}
        aria-label="Ouvrir le menu"
        className="-ml-1 rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100"
      >
        <Menu size={22} />
      </button>

      <span className="flex items-center gap-2">
        <BrandMark className="h-7 w-7" />
        <span className="text-base font-bold tracking-tight text-slate-900 dark:text-slate-100">
          SCAN-ETO
        </span>
      </span>
    </header>
  )
}
