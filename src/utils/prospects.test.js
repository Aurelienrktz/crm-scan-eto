import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildProspectPayload,
  getProspectFormValues,
  isFollowUpDue,
  isFollowUpOverdue,
  isFollowUpToday,
  isFollowUpUpcoming,
  matchesSearch,
  validateProspectForm,
} from './prospects'

const TODAY = '2026-09-24'
const YESTERDAY = '2026-09-23'
const TOMORROW = '2026-09-25'

function prospect(overrides) {
  return {
    name: 'King’s Kebab',
    city: 'Toamasina',
    contact: '034 12 345 67',
    status: 'contacted',
    next_follow_up: null,
    ...overrides,
  }
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 8, 24, 10, 0))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('isFollowUpDue', () => {
  it.each(['contacted', 'interested', 'follow_up'])(
    'is due today or overdue for active status "%s"',
    (status) => {
      expect(isFollowUpDue(prospect({ status, next_follow_up: TODAY }))).toBe(true)
      expect(isFollowUpDue(prospect({ status, next_follow_up: YESTERDAY }))).toBe(true)
    },
  )

  it('is not due for a future date or without a date', () => {
    expect(isFollowUpDue(prospect({ next_follow_up: TOMORROW }))).toBe(false)
    expect(isFollowUpDue(prospect({ next_follow_up: null }))).toBe(false)
  })

  it.each(['client', 'not_interested'])('never flags closed status "%s"', (status) => {
    expect(isFollowUpDue(prospect({ status, next_follow_up: YESTERDAY }))).toBe(false)
  })
})

describe('isFollowUpOverdue / isFollowUpToday', () => {
  it('splits due prospects into overdue and today', () => {
    const overdue = prospect({ next_follow_up: YESTERDAY })
    const today = prospect({ next_follow_up: TODAY })

    expect(isFollowUpOverdue(overdue)).toBe(true)
    expect(isFollowUpToday(overdue)).toBe(false)
    expect(isFollowUpOverdue(today)).toBe(false)
    expect(isFollowUpToday(today)).toBe(true)
  })

  it('ignores closed prospects', () => {
    expect(isFollowUpOverdue(prospect({ status: 'client', next_follow_up: YESTERDAY }))).toBe(false)
    expect(isFollowUpToday(prospect({ status: 'client', next_follow_up: TODAY }))).toBe(false)
  })
})

describe('isFollowUpUpcoming', () => {
  it('covers the next 7 days, excluding today', () => {
    expect(isFollowUpUpcoming(prospect({ next_follow_up: TOMORROW }))).toBe(true)
    expect(isFollowUpUpcoming(prospect({ next_follow_up: '2026-10-01' }))).toBe(true)
    expect(isFollowUpUpcoming(prospect({ next_follow_up: '2026-10-02' }))).toBe(false)
    expect(isFollowUpUpcoming(prospect({ next_follow_up: TODAY }))).toBe(false)
  })

  it('ignores closed prospects', () => {
    expect(isFollowUpUpcoming(prospect({ status: 'not_interested', next_follow_up: TOMORROW }))).toBe(
      false,
    )
  })
})

describe('getProspectFormValues', () => {
  it('pre-fills a new prospect: contacted today, follow-up in 5 days', () => {
    expect(getProspectFormValues(null)).toEqual({
      name: '',
      city: '',
      contact: '',
      last_contact: TODAY,
      next_follow_up: '2026-09-29',
      note: '',
      status: 'contacted',
      contract_amount: '',
      subscription_amount: '',
      subscription_start: '',
      subscription_status: 'active',
    })
  })

  it('pre-fills a new client: status client, subscription from today, no follow-up', () => {
    expect(getProspectFormValues(null, { asClient: true })).toMatchObject({
      status: 'client',
      last_contact: TODAY,
      next_follow_up: '',
      subscription_start: TODAY,
      subscription_status: 'active',
    })
  })

  // Regression: null columns from Supabase used to crash .trim() and block "Enregistrer".
  it('turns null columns into empty strings when editing', () => {
    const values = getProspectFormValues(
      prospect({ city: null, contact: null, note: null, last_contact: null }),
    )
    expect(values.city).toBe('')
    expect(values.contact).toBe('')
    expect(values.note).toBe('')
    expect(values.last_contact).toBe('')
    expect(() => values.city.trim()).not.toThrow()
  })

  it('keeps existing values and ignores non-form fields when editing', () => {
    const values = getProspectFormValues(
      prospect({ id: 'abc', created_at: '2026-09-01T08:00:00Z', next_follow_up: TOMORROW }),
    )
    expect(values.next_follow_up).toBe(TOMORROW)
    expect(values.name).toBe('King’s Kebab')
    expect(values).not.toHaveProperty('id')
    expect(values).not.toHaveProperty('created_at')
  })
})

describe('validateProspectForm', () => {
  const form = (overrides) => ({ name: 'King’s Kebab', status: 'contacted', next_follow_up: '', ...overrides })

  it('requires a name', () => {
    expect(validateProspectForm(form({ name: '' }))).toMatch(/nom/)
    expect(validateProspectForm(form({ name: '   ' }))).toMatch(/nom/)
  })

  it('requires a follow-up date for the "À relancer" status', () => {
    expect(validateProspectForm(form({ status: 'follow_up' }))).toMatch(/relance/)
    expect(validateProspectForm(form({ status: 'follow_up', next_follow_up: TOMORROW }))).toBeNull()
  })

  it('requires the contract details for the "Client" status', () => {
    const client = (overrides) =>
      form({
        status: 'client',
        contract_amount: '300 000',
        subscription_amount: '20000',
        subscription_start: TODAY,
        ...overrides,
      })
    expect(validateProspectForm(client())).toBeNull()
    expect(validateProspectForm(client({ contract_amount: '' }))).toMatch(/contrat/)
    expect(validateProspectForm(client({ contract_amount: 'trois cents' }))).toMatch(/contrat/)
    expect(validateProspectForm(client({ subscription_amount: '' }))).toMatch(/abonnement/)
    expect(validateProspectForm(client({ subscription_start: '' }))).toMatch(/début/)
  })

  it('does not require a date for other statuses', () => {
    expect(validateProspectForm(form({ status: 'contacted' }))).toBeNull()
    expect(validateProspectForm(form({ status: 'interested' }))).toBeNull()
  })
})

describe('buildProspectPayload', () => {
  const base = getProspectFormValues(null)

  it('lets the database default the status when creating a regular prospect', () => {
    const payload = buildProspectPayload({ ...base, name: 'Le Nil' }, false)
    expect(payload).not.toHaveProperty('status')
    expect(payload).not.toHaveProperty('contract_amount')
  })

  it('sends the client status and contract when creating a client directly', () => {
    const form = {
      ...getProspectFormValues(null, { asClient: true }),
      name: 'Le Nil',
      contract_amount: '300000',
      subscription_amount: '20000',
    }
    expect(buildProspectPayload(form, false)).toMatchObject({
      status: 'client',
      contract_amount: 300000,
      subscription_amount: 20000,
      subscription_start: TODAY,
      next_follow_up: null,
    })
  })

  it('sends parsed contract amounts when a prospect becomes a client', () => {
    const payload = buildProspectPayload(
      {
        ...base,
        name: 'Le Nil',
        status: 'client',
        contract_amount: '300 000',
        subscription_amount: '20 000 Ar',
        subscription_start: TODAY,
      },
      true,
    )
    expect(payload).toMatchObject({
      status: 'client',
      contract_amount: 300000,
      subscription_amount: 20000,
      subscription_start: TODAY,
      subscription_status: 'active',
    })
  })

  it('leaves stored contract data untouched for non-client statuses', () => {
    const payload = buildProspectPayload({ ...base, name: 'Le Nil', status: 'interested' }, true)
    expect(payload.status).toBe('interested')
    expect(payload).not.toHaveProperty('contract_amount')
  })
})

describe('matchesSearch', () => {
  it('matches everything for an empty query', () => {
    expect(matchesSearch(prospect(), '')).toBe(true)
    expect(matchesSearch(prospect(), '   ')).toBe(true)
  })

  it('ignores accents and case in both directions', () => {
    const hotel = prospect({ name: 'Hôtel Colbert' })
    expect(matchesSearch(hotel, 'hotel')).toBe(true)
    expect(matchesSearch(hotel, 'HÔTEL')).toBe(true)
    expect(matchesSearch(prospect({ name: 'Hotel Colbert' }), 'hôtel')).toBe(true)
  })

  it('searches name, city and contact', () => {
    expect(matchesSearch(prospect(), 'kebab')).toBe(true)
    expect(matchesSearch(prospect(), 'toamasina')).toBe(true)
    expect(matchesSearch(prospect(), '345')).toBe(true)
    expect(matchesSearch(prospect(), 'antananarivo')).toBe(false)
  })

  it('treats phone (’) and keyboard (\') apostrophes the same', () => {
    expect(matchesSearch(prospect({ name: 'King’s Kebab' }), "king's")).toBe(true)
    expect(matchesSearch(prospect({ name: "L'Arrivage" }), 'l’arrivage')).toBe(true)
  })

  it('handles empty fields without crashing', () => {
    expect(matchesSearch(prospect({ city: null, contact: null }), 'kebab')).toBe(true)
  })
})
