import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import { signIn } from '../services/auth'
import { inputClass, labelClass } from '../components/ui/formStyles'
import { BrandMark } from '../components/ui/BrandMark'

export default function Login() {
  const { session, loading: sessionLoading } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!sessionLoading && session) {
    return <Navigate to="/dashboard" replace />
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    const { error: signInError } = await signIn(email, password)

    setSubmitting(false)

    if (signInError) {
      setError('Email ou mot de passe incorrect.')
      toast.error('Connexion refusée.')
      return
    }

    toast.success('Connexion réussie')
    navigate('/dashboard', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 dark:bg-slate-950">
      <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3">
          <BrandMark className="h-10 w-10 ring-1 ring-slate-200 dark:ring-0" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            SCAN-ETO
          </h1>
        </div>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Connectez-vous pour gérer vos prospects.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="password" className={labelClass}>
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClass}
            />
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60 dark:hover:bg-blue-500"
          >
            {submitting && <Loader2 size={16} className="motion-safe:animate-spin" />}
            {submitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
