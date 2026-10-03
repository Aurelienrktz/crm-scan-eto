import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { MobileTopbar } from './MobileTopbar'
import { useProspects } from '../../hooks/useProspects'
import { isFollowUpDue } from '../../utils/prospects'

export function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const { prospects } = useProspects()
  const dueCount = prospects.filter(isFollowUpDue).length

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar open={menuOpen} onClose={closeMenu} dueCount={dueCount} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar onOpenMenu={() => setMenuOpen(true)} />
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
