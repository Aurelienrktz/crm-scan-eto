import { supabase } from '../lib/supabase'

export async function fetchPayments() {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .order('period', { ascending: false })

  if (error) throw error
  return data
}

export async function createPayment(payload) {
  const { data, error } = await supabase.from('payments').insert(payload).select().single()

  if (error) throw error
  return data
}

export async function deletePayment(id) {
  const { error } = await supabase.from('payments').delete().eq('id', id)
  if (error) throw error
}
