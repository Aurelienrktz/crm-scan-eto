import { addDaysISO, isTodayOrPast, isPast, isWithinNextDays, todayISODate } from './date'
import { normalizeText } from './text'
import { parseAmount } from './billing'

export const DEFAULT_FOLLOW_UP_DAYS = 5

const FORM_FIELDS = {
  name: '',
  city: '',
  contact: '',
  last_contact: '',
  next_follow_up: '',
  note: '',
  status: 'contacted',
  contract_amount: '',
  subscription_amount: '',
  subscription_start: '',
  subscription_status: 'active',
}

// New prospects start in the follow-up cycle: contacted today, follow-up in 5 days.
// New clients (created directly from the Clients page) need no follow-up and start
// their subscription today. For edits, Supabase returns null for empty columns;
// the form needs strings so .trim() and controlled inputs work.
export function getProspectFormValues(prospect, { asClient = false } = {}) {
  if (!prospect && asClient) {
    return {
      ...FORM_FIELDS,
      status: 'client',
      last_contact: todayISODate(),
      subscription_start: todayISODate(),
    }
  }
  if (!prospect) {
    return {
      ...FORM_FIELDS,
      last_contact: todayISODate(),
      next_follow_up: addDaysISO(DEFAULT_FOLLOW_UP_DAYS),
    }
  }
  return Object.fromEntries(
    Object.entries(FORM_FIELDS).map(([key, fallback]) => [key, prospect[key] ?? fallback]),
  )
}

// Returns an error message, or null when the form can be saved.
export function validateProspectForm(form) {
  if (!form.name.trim()) {
    return "Le nom de l'établissement est obligatoire."
  }
  if (form.status === 'follow_up' && !form.next_follow_up) {
    return 'Le statut « À relancer » nécessite une date de prochaine relance.'
  }
  if (form.status === 'client') {
    const contract = parseAmount(form.contract_amount)
    const subscription = parseAmount(form.subscription_amount)
    if (contract === null || Number.isNaN(contract)) {
      return 'Indiquez le prix du contrat (création du menu), en Ariary.'
    }
    if (subscription === null || Number.isNaN(subscription)) {
      return "Indiquez le prix de l'abonnement mensuel, en Ariary."
    }
    if (!form.subscription_start) {
      return "Indiquez la date de début de l'abonnement."
    }
  }
  return null
}

// New regular prospects keep the database default status ("contacted");
// only edits and direct client creation send a status.
export function buildProspectPayload(form, isEditing) {
  const payload = {
    name: form.name.trim(),
    city: form.city.trim() || null,
    contact: form.contact.trim() || null,
    last_contact: form.last_contact || null,
    next_follow_up: form.next_follow_up || null,
    note: form.note.trim() || null,
  }
  if (!isEditing && form.status !== 'client') return payload

  payload.status = form.status
  if (form.status === 'client') {
    payload.contract_amount = parseAmount(form.contract_amount)
    payload.subscription_amount = parseAmount(form.subscription_amount)
    payload.subscription_start = form.subscription_start
    payload.subscription_status = form.subscription_status
  }
  return payload
}

export function matchesSearch(prospect, query) {
  const term = normalizeText(query).trim()
  if (!term) return true
  return [prospect.name, prospect.city, prospect.contact].some((field) =>
    normalizeText(field).includes(term),
  )
}

export function isFollowUpDue(prospect) {
  return (
    isTodayOrPast(prospect.next_follow_up) &&
    prospect.status !== 'client' &&
    prospect.status !== 'not_interested'
  )
}

export function isFollowUpOverdue(prospect) {
  return isFollowUpDue(prospect) && isPast(prospect.next_follow_up)
}

export function isFollowUpToday(prospect) {
  return isFollowUpDue(prospect) && !isPast(prospect.next_follow_up)
}

export function isFollowUpUpcoming(prospect, days = 7) {
  return (
    isWithinNextDays(prospect.next_follow_up, days) &&
    prospect.status !== 'client' &&
    prospect.status !== 'not_interested'
  )
}
