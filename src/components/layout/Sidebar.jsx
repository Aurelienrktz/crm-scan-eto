import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { LogOut, X } from 'lucide-react'
import { BrandMark } from '../ui/BrandMark'
import { navItems } from './navItems'
import { ThemeSwitcher } from './ThemeToggle'
import { useAuth } from '../../hooks/useAuth'
import { useToast } from '../../hooks/useToast'
import { signOut } from '../../services/auth'

// Static column on desktop; slide-in drawer on mobile, driven by `open`.
export function Sidebar({ open, onClose, dueCount }) {
  const { user } = useAuth()
  const toast = useToast()

  async function handleSignOut() {
    const { error } = await signOut()
    if (error) {
      toast.error('La déconnexion a échoué.')
    } else {
      toast.success('Vous êtes déconnecté')
    }
  }

  useEffect(() => {
    if (!open) return
    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-slate-950/50 transition-opacity duration-300 motion-reduce:transition-none md:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 flex-col overflow-y-auto bg-slate-900 transition-[transform,visibility] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none md:visible md:static md:z-auto md:translate-x-0 md:shadow-none dark:border-r dark:border-slate-800 ${
          open ? 'visible translate-x-0 shadow-2xl' : 'invisible -translate-x-full'
        }`}
      >
        <div className="flex items-center gap-2.5 px-6 py-6">
          <BrandMark className="h-9 w-9" />
          <span className="flex-1 text-lg font-bold tracking-tight text-white">SCAN-ETO</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="rounded-md p-1 text-slate-400 hover:bg-slate-800 hover:text-white md:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-2 flex-1 space-y-1 px-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {to === '/relances' && dueCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white tabular-nums">
                  {dueCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="space-y-3 border-t border-slate-800 px-3 py-4">
          <div className="px-3">
            <ThemeSwitcher />
          </div>

          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-semibold text-slate-300">
              {user?.email?.[0]?.toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 truncate text-sm text-slate-400" title={user?.email}>
              {user?.email}
            </span>
            <button
              type="button"
              onClick={handleSignOut}
              className="shrink-0 text-slate-400 hover:text-white"
              title="Déconnexion"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
