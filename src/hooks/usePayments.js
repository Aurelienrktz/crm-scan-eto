import { useCallback, useEffect, useState } from 'react'
import * as paymentsService from '../services/payments'
import { todayISODate } from '../utils/date'

export function usePayments() {
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setPayments(await paymentsService.fetchPayments())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  // Optimistic, like prospects: the row flips to "Payé" immediately.
  async function markPaid(client, period) {
    const payload = {
      prospect_id: client.id,
      amount: client.subscription_amount,
      period,
      paid_at: todayISODate(),
    }
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setPayments((prev) => [{ id: tempId, ...payload }, ...prev])

    try {
      const created = await paymentsService.createPayment(payload)
      setPayments((prev) => prev.map((p) => (p.id === tempId ? created : p)))
      return created
    } catch (err) {
      setPayments((prev) => prev.filter((p) => p.id !== tempId))
      throw err
    }
  }

  async function cancelPayment(payment) {
    setPayments((prev) => prev.filter((p) => p.id !== payment.id))
    try {
      await paymentsService.deletePayment(payment.id)
    } catch (err) {
      setPayments((prev) => [payment, ...prev])
      throw err
    }
  }

  return { payments, loading, error, markPaid, cancelPayment }
}
