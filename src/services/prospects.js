import { supabase } from '../lib/supabase'

export async function fetchProspects() {
  const { data, error } = await supabase
    .from('prospects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createProspect(payload) {
  const { data, error } = await supabase
    .from('prospects')
    .insert(payload)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateProspect(id, payload) {
  const { data, error } = await supabase
    .from('prospects')
    .update(payload)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteProspect(id) {
  const { error } = await supabase.from('prospects').delete().eq('id', id)
  if (error) throw error
}
