import { createContext, useCallback, useEffect, useState } from 'react'
import * as prospectsService from '../services/prospects'

// Single shared store: the sidebar badge and every page read the same list,
// so a change made anywhere is reflected everywhere without refetching.
export const ProspectsContext = createContext(undefined)

export function ProspectsProvider({ children }) {
  const [prospects, setProspects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await prospectsService.fetchProspects()
      setProspects(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function addProspect(payload) {
    // Local placeholder id only; crypto.randomUUID is unavailable on plain-HTTP LAN origins.
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`
    const optimisticProspect = {
      id: tempId,
      status: 'contacted',
      created_at: new Date().toISOString(),
      ...payload,
    }
    setProspects((prev) => [optimisticProspect, ...prev])

    try {
      const created = await prospectsService.createProspect(payload)
      setProspects((prev) => prev.map((p) => (p.id === tempId ? created : p)))
      return created
    } catch (err) {
      setProspects((prev) => prev.filter((p) => p.id !== tempId))
      throw err
    }
  }

  // Optimistic: the UI updates immediately, then reconciles with the
  // server response. Rolls back if the request fails.
  async function editProspect(id, payload) {
    const original = prospects.find((p) => p.id === id)
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, ...payload } : p)))

    try {
      const updated = await prospectsService.updateProspect(id, payload)
      setProspects((prev) => prev.map((p) => (p.id === id ? updated : p)))
      return updated
    } catch (err) {
      setProspects((prev) => prev.map((p) => (p.id === id ? original : p)))
      throw err
    }
  }

  async function removeProspect(id) {
    const removed = prospects.find((p) => p.id === id)
    setProspects((prev) => prev.filter((p) => p.id !== id))

    try {
      await prospectsService.deleteProspect(id)
    } catch (err) {
      setProspects((prev) => [...prev, removed])
      throw err
    }
  }

  return (
    <ProspectsContext.Provider
      value={{
        prospects,
        loading,
        error,
        addProspect,
        editProspect,
        removeProspect,
        reload: load,
      }}
    >
      {children}
    </ProspectsContext.Provider>
  )
}
