import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  compareBillingRows,
  currentPeriod,
  dueDateForPeriod,
  formatAmount,
  getBillingSummary,
  getCollectThisWeek,
  getMonthlyBilling,
  parseAmount,
} from './billing'

const NBSP = ' '

function client(overrides) {
  return {
    id: 'c1',
    name: 'King’s Kebab',
    status: 'client',
    contract_amount: 300000,
    subscription_amount: 20000,
    subscription_start: '2026-08-15',
    subscription_status: 'active',
    ...overrides,
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 9, 10, 10, 0)) // 10/10/2026
})

afterEach(() => {
  vi.useRealTimers()
})

describe('parseAmount / formatAmount', () => {
  it.each([
    ['300000', 300000],
    ['300 000', 300000],
    ['300 000 Ar', 300000],
    [`20${NBSP}000`, 20000],
    ['0', 0],
  ])('parses "%s" as %d', (input, expected) => {
    expect(parseAmount(input)).toBe(expected)
  })

  it('returns null when empty and NaN when invalid', () => {
    expect(parseAmount('')).toBeNull()
    expect(parseAmount(null)).toBeNull()
    expect(parseAmount('trois cents')).toBeNaN()
    expect(parseAmount('-500')).toBeNaN()
    expect(parseAmount('20,5')).toBeNaN()
  })

  it('formats with French thousand separators', () => {
    expect(formatAmount(1500000)).toBe(`1${NBSP}500${NBSP}000${NBSP}Ar`)
    expect(formatAmount(20000)).toBe(`20${NBSP}000${NBSP}Ar`)
    expect(formatAmount(0)).toBe(`0${NBSP}Ar`)
    expect(formatAmount(null)).toBe(`0${NBSP}Ar`)
  })
})

describe('currentPeriod / dueDateForPeriod', () => {
  it('uses the first day of the current month', () => {
    expect(currentPeriod()).toBe('2026-10-01')
  })

  it('falls on the same day as the subscription start', () => {
    expect(dueDateForPeriod('2026-08-15', '2026-10-01')).toBe('2026-10-15')
  })

  it('clamps to the last day of shorter months', () => {
    expect(dueDateForPeriod('2026-01-31', '2026-02-01')).toBe('2026-02-28')
    expect(dueDateForPeriod('2026-01-31', '2026-04-01')).toBe('2026-04-30')
  })
})

describe('getMonthlyBilling', () => {
  it('is overdue once the due day has passed without payment', () => {
    expect(getMonthlyBilling(client({ subscription_start: '2026-08-05' }), []).state).toBe(
      'overdue',
    )
  })

  it('is "due soon" from today up to 7 days ahead', () => {
    expect(getMonthlyBilling(client({ subscription_start: '2026-08-10' }), []).state).toBe(
      'due_soon',
    )
    expect(getMonthlyBilling(client({ subscription_start: '2026-08-17' }), []).state).toBe(
      'due_soon',
    )
    expect(getMonthlyBilling(client({ subscription_start: '2026-08-18' }), []).state).toBe(
      'upcoming',
    )
  })

  it('is paid when a payment exists for this month only', () => {
    const lastMonth = [{ id: 'p0', prospect_id: 'c1', period: '2026-09-01', amount: 20000 }]
    const thisMonth = [{ id: 'p1', prospect_id: 'c1', period: '2026-10-01', amount: 20000 }]
    const overdueClient = client({ subscription_start: '2026-08-05' })

    expect(getMonthlyBilling(overdueClient, lastMonth).state).toBe('overdue')
    expect(getMonthlyBilling(overdueClient, thisMonth).state).toBe('paid')
    expect(getMonthlyBilling(overdueClient, thisMonth).payment.id).toBe('p1')
  })

  it('ignores payments of other clients', () => {
    const other = [{ id: 'p2', prospect_id: 'c2', period: '2026-10-01', amount: 20000 }]
    expect(getMonthlyBilling(client({ subscription_start: '2026-08-05' }), other).state).toBe(
      'overdue',
    )
  })

  it('bills the first month on the start date itself', () => {
    expect(getMonthlyBilling(client({ subscription_start: '2026-10-12' }), []).state).toBe(
      'due_soon',
    )
  })

  it('does not bill before the subscription starts', () => {
    expect(getMonthlyBilling(client({ subscription_start: '2026-11-03' }), []).state).toBe(
      'not_started',
    )
  })

  it('reports suspended, cancelled and incomplete subscriptions', () => {
    expect(getMonthlyBilling(client({ subscription_status: 'suspended' }), []).state).toBe(
      'suspended',
    )
    expect(getMonthlyBilling(client({ subscription_status: 'cancelled' }), []).state).toBe(
      'cancelled',
    )
    expect(getMonthlyBilling(client({ subscription_start: null }), []).state).toBe('incomplete')
  })
})

describe('getBillingSummary', () => {
  // The user's own example: 5 clients, 300 000 Ar contract and 20 000 Ar/month each.
  const fiveClients = Array.from({ length: 5 }, (_, i) =>
    client({ id: `c${i}`, subscription_start: '2026-08-20' }),
  )

  it('totals contracts and the expected monthly revenue', () => {
    const summary = getBillingSummary(fiveClients, [])
    expect(summary.clientCount).toBe(5)
    expect(summary.contractsTotal).toBe(1500000)
    expect(summary.monthlyExpected).toBe(100000)
    expect(summary.collectedThisMonth).toBe(0)
    expect(summary.remainingThisMonth).toBe(100000)
  })

  it('splits collected and remaining amounts for the month', () => {
    const payments = [
      { id: 'p0', prospect_id: 'c0', period: '2026-10-01', amount: 20000 },
      { id: 'p1', prospect_id: 'c1', period: '2026-10-01', amount: 20000 },
      { id: 'old', prospect_id: 'c2', period: '2026-09-01', amount: 20000 },
    ]
    const summary = getBillingSummary(fiveClients, payments)
    expect(summary.collectedThisMonth).toBe(40000)
    expect(summary.remainingThisMonth).toBe(60000)
    expect(summary.paidCount).toBe(2)
  })

  it('keeps cancelled contracts in the total but not in the monthly estimate', () => {
    const clients = [...fiveClients.slice(0, 4), client({ id: 'c4', subscription_status: 'cancelled' })]
    const summary = getBillingSummary(clients, [])
    expect(summary.contractsTotal).toBe(1500000)
    expect(summary.monthlyExpected).toBe(80000)
    expect(summary.activeCount).toBe(4)
  })

  it('ignores prospects that are not clients', () => {
    const summary = getBillingSummary([...fiveClients, client({ id: 'x', status: 'interested' })], [])
    expect(summary.clientCount).toBe(5)
    expect(summary.contractsTotal).toBe(1500000)
  })

  it('counts overdue clients', () => {
    const summary = getBillingSummary([client({ subscription_start: '2026-08-05' })], [])
    expect(summary.overdueCount).toBe(1)
  })
})

describe('getCollectThisWeek', () => {
  it('keeps unpaid overdue and due-within-7-days subscriptions, overdue first', () => {
    const prospects = [
      client({ id: 'soon', subscription_start: '2026-08-14', subscription_amount: 15000 }),
      client({ id: 'late', subscription_start: '2026-08-05', subscription_amount: 20000 }),
      client({ id: 'later', subscription_start: '2026-08-25' }), // due 25/10: not this week
      client({ id: 'paid', subscription_start: '2026-08-12' }),
      client({ id: 'off', subscription_start: '2026-08-05', subscription_status: 'suspended' }),
      client({ id: 'prospect', status: 'interested', subscription_start: '2026-08-05' }),
    ]
    const payments = [{ id: 'p', prospect_id: 'paid', period: '2026-10-01', amount: 20000 }]

    const { rows, total } = getCollectThisWeek(prospects, payments)
    expect(rows.map((row) => row.client.id)).toEqual(['late', 'soon'])
    expect(total).toBe(35000)
  })

  it('is empty when nothing is due', () => {
    expect(getCollectThisWeek([], [])).toEqual({ rows: [], total: 0 })
  })
})

describe('compareBillingRows', () => {
  it('lists overdue first, then upcoming by due date, then paid', () => {
    const row = (state, dueDate) => ({ billing: { state, dueDate } })
    const sorted = [
      row('paid', '2026-10-01'),
      row('upcoming', '2026-10-25'),
      row('overdue', '2026-10-05'),
      row('upcoming', '2026-10-20'),
    ].sort(compareBillingRows)
    expect(sorted.map((r) => `${r.billing.state}:${r.billing.dueDate}`)).toEqual([
      'overdue:2026-10-05',
      'upcoming:2026-10-20',
      'upcoming:2026-10-25',
      'paid:2026-10-01',
    ])
  })
})
