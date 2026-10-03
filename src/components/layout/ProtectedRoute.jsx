import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { BrandMark } from '../ui/BrandMark'
import { useAuth } from '../../hooks/useAuth'

export function ProtectedRoute() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div
        role="status"
        aria-label="Chargement"
        className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-950"
      >
        <BrandMark className="h-12 w-12 rounded-xl shadow-sm" />
        <Loader2
          size={20}
          className="text-slate-400 motion-safe:animate-spin dark:text-slate-500"
        />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
