import { useContext } from 'react'
import { ProspectsContext } from '../context/ProspectsContext'

export function useProspects() {
  const context = useContext(ProspectsContext)
  if (context === undefined) {
    throw new Error('useProspects must be used within a ProspectsProvider')
  }
  return context
}
