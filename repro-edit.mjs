const EMPTY_FORM = { name: '', city: '', contact: '', last_contact: '', next_follow_up: '', note: '', status: 'contacted' }
// Shape returned by Supabase for "fsdvqdvd": empty columns are null
const prospect = { id: 'x', name: 'fsdvqdvd', city: null, contact: null, last_contact: null, next_follow_up: '2026-09-25', note: null, status: 'contacted', created_at: '2026-09-24T10:00:00Z' }

const buildPayload = (form) => ({
  name: form.name.trim(),
  city: form.city.trim() || null,
  contact: form.contact.trim() || null,
  last_contact: form.last_contact || null,
  next_follow_up: form.next_follow_up || null,
  note: form.note.trim() || null,
  status: form.status,
})

try {
  buildPayload({ ...EMPTY_FORM, ...prospect })
  console.log('OLD: ok')
} catch (e) {
  console.log('OLD: CRASH ->', e.message)
}

const toFormValues = (p) => Object.fromEntries(Object.entries(EMPTY_FORM).map(([k, f]) => [k, p?.[k] ?? f]))
console.log('NEW:', JSON.stringify(buildPayload(toFormValues(prospect))))
console.log('NEW (create):', JSON.stringify(buildPayload(toFormValues(null))))
