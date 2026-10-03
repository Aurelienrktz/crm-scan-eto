import { addDaysISO, todayISODate } from './date'

const DUE_SOON_DAYS = 7

export const SUBSCRIPTION_STATUS_OPTIONS = [
  { value: 'active', label: 'Actif' },
  { value: 'suspended', label: 'Suspendu' },
  { value: 'cancelled', label: 'Résilié' },
]

// State of a client's subscription for the current month.
export const BILLING_STATES = {
  overdue: {
    label: 'En retard',
    badgeClass:
      'border border-red-200 bg-red-50 text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300',
  },
  due_soon: {
    label: 'Échéance proche',
    badgeClass:
      'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300',
  },
  upcoming: {
    label: 'À venir',
    badgeClass:
      'border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  paid: {
    label: 'Payé',
    badgeClass:
      'border border-green-200 bg-green-50 text-green-700 dark:border-green-500/25 dark:bg-green-500/10 dark:text-green-300',
  },
  incomplete: {
    label: 'Contrat à compléter',
    badgeClass:
      'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300',
  },
  not_started: {
    label: 'Pas encore commencé',
    badgeClass:
      'border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300',
  },
  suspended: {
    label: 'Suspendu',
    badgeClass:
      'border border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400',
  },
  cancelled: {
    label: 'Résilié',
    badgeClass:
      'border border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400',
  },
}

// States where a monthly payment is expected this month.
const BILLABLE_STATES = ['overdue', 'due_soon', 'upcoming', 'paid']

const STATE_ORDER = [
  'overdue',
  'due_soon',
  'upcoming',
  'incomplete',
  'paid',
  'not_started',
  'suspended',
  'cancelled',
]

// Accepts "300000", "300 000", "300 000 Ar". Returns null when empty, NaN when invalid.
export function parseAmount(value) {
  if (value === null || value === undefined) return null
  const cleaned = String(value)
    .replace(/[\s  ]/g, '')
    .replace(/ar$/i, '')
  if (cleaned === '') return null
  return /^\d+$/.test(cleaned) ? Number(cleaned) : NaN
}

export function formatAmount(amount) {
  const rounded = Math.round(amount ?? 0)
  return `${String(rounded).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} Ar`
}

// First day of the current month, e.g. "2026-10-01".
export function currentPeriod() {
  return `${todayISODate().slice(0, 7)}-01`
}

export function formatPeriod(period) {
  const [year, month] = period.split('-').map(Number)
  const label = new Date(year, month - 1, 1).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

// Due on the same day of the month as the subscription start,
// clamped to the month length (a start on the 31st is due on Feb 28).
export function dueDateForPeriod(subscriptionStart, period) {
  const startDay = Number(subscriptionStart.slice(8, 10))
  const [year, month] = period.split('-').map(Number)
  const lastDay = new Date(year, month, 0).getDate()
  const day = String(Math.min(startDay, lastDay)).padStart(2, '0')
  return `${period.slice(0, 7)}-${day}`
}

export function getMonthlyBilling(client, payments) {
  const period = currentPeriod()
  const status = client.subscription_status ?? 'active'

  if (status !== 'active') return { state: status, period }
  if (!client.subscription_start || !client.subscription_amount) {
    return { state: 'incomplete', period }
  }

  const dueDate = dueDateForPeriod(client.subscription_start, period)
  if (dueDate < client.subscription_start) return { state: 'not_started', period }

  const payment = payments.find((p) => p.prospect_id === client.id && p.period === period)
  if (payment) return { state: 'paid', period, dueDate, payment }

  if (dueDate < todayISODate()) return { state: 'overdue', period, dueDate }
  if (dueDate <= addDaysISO(DUE_SOON_DAYS)) return { state: 'due_soon', period, dueDate }
  return { state: 'upcoming', period, dueDate }
}

export function isBillable(billing) {
  return BILLABLE_STATES.includes(billing.state)
}

export function compareBillingRows(a, b) {
  const byState = STATE_ORDER.indexOf(a.billing.state) - STATE_ORDER.indexOf(b.billing.state)
  if (byState !== 0) return byState
  return (a.billing.dueDate ?? '').localeCompare(b.billing.dueDate ?? '')
}

// Unpaid subscriptions that are overdue or due within the next 7 days.
export function getCollectThisWeek(prospects, payments) {
  const rows = prospects
    .filter((p) => p.status === 'client')
    .map((client) => ({ client, billing: getMonthlyBilling(client, payments) }))
    .filter((row) => row.billing.state === 'overdue' || row.billing.state === 'due_soon')
    .sort(compareBillingRows)

  return {
    rows,
    total: rows.reduce((sum, row) => sum + (row.client.subscription_amount ?? 0), 0),
  }
}

export function getBillingSummary(prospects, payments) {
  const period = currentPeriod()
  const clients = prospects.filter((p) => p.status === 'client')
  const rows = clients.map((client) => ({ client, billing: getMonthlyBilling(client, payments) }))
  const billable = rows.filter((row) => isBillable(row.billing))
  const sum = (items, pick) => items.reduce((total, item) => total + (pick(item) ?? 0), 0)

  return {
    clientCount: clients.length,
    activeCount: clients.filter((c) => (c.subscription_status ?? 'active') === 'active').length,
    contractsTotal: sum(clients, (c) => c.contract_amount),
    monthlyExpected: sum(billable, (row) => row.client.subscription_amount),
    collectedThisMonth: sum(
      payments.filter((p) => p.period === period),
      (p) => p.amount,
    ),
    remainingThisMonth: sum(
      billable.filter((row) => row.billing.state !== 'paid'),
      (row) => row.client.subscription_amount,
    ),
    overdueCount: rows.filter((row) => row.billing.state === 'overdue').length,
    paidCount: rows.filter((row) => row.billing.state === 'paid').length,
    billableCount: billable.length,
  }
}
