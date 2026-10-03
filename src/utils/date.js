function parseDateOnly(value) {
  if (!value) return null
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatDate(value) {
  const date = parseDateOnly(value)
  if (!date) return '—'
  return date.toLocaleDateString('fr-FR')
}

export function formatShortDate(value) {
  const date = parseDateOnly(value)
  if (!date) return '—'
  return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
}

function startOfToday() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return today
}

export function isTodayOrPast(value) {
  const date = parseDateOnly(value)
  if (!date) return false
  return date <= startOfToday()
}

export function isPast(value) {
  const date = parseDateOnly(value)
  if (!date) return false
  return date < startOfToday()
}

export function isWithinNextDays(value, days) {
  const date = parseDateOnly(value)
  if (!date) return false
  const today = startOfToday()
  const limit = new Date(today)
  limit.setDate(limit.getDate() + days)
  return date > today && date <= limit
}

function toISODate(date) {
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${date.getFullYear()}-${month}-${day}`
}

export function todayISODate() {
  return toISODate(startOfToday())
}

export function addDaysISO(days) {
  const date = startOfToday()
  date.setDate(date.getDate() + days)
  return toISODate(date)
}

export function formatLongDate(date = new Date()) {
  const formatted = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}
