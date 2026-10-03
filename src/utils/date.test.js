import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addDaysISO,
  formatDate,
  formatShortDate,
  isPast,
  isTodayOrPast,
  isWithinNextDays,
  todayISODate,
} from './date'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date(2026, 8, 24, 10, 0)) // 24/09/2026 10:00, local time
})

afterEach(() => {
  vi.useRealTimers()
})

describe('todayISODate / addDaysISO', () => {
  it('returns today as YYYY-MM-DD', () => {
    expect(todayISODate()).toBe('2026-09-24')
    expect(addDaysISO(0)).toBe('2026-09-24')
  })

  it('adds days, including across a month boundary', () => {
    expect(addDaysISO(5)).toBe('2026-09-29')
    expect(addDaysISO(7)).toBe('2026-10-01')
  })

  it('adds days across a year boundary', () => {
    vi.setSystemTime(new Date(2026, 11, 30, 10, 0))
    expect(addDaysISO(3)).toBe('2027-01-02')
  })
})

describe('isTodayOrPast / isPast', () => {
  it('treats today as due but not past', () => {
    expect(isTodayOrPast('2026-09-24')).toBe(true)
    expect(isPast('2026-09-24')).toBe(false)
  })

  it('treats yesterday as due and past', () => {
    expect(isTodayOrPast('2026-09-23')).toBe(true)
    expect(isPast('2026-09-23')).toBe(true)
  })

  it('treats tomorrow as neither', () => {
    expect(isTodayOrPast('2026-09-25')).toBe(false)
    expect(isPast('2026-09-25')).toBe(false)
  })

  it('keeps today "not past" at the very start and end of the day', () => {
    vi.setSystemTime(new Date(2026, 8, 24, 0, 1))
    expect(isPast('2026-09-24')).toBe(false)
    vi.setSystemTime(new Date(2026, 8, 24, 23, 59))
    expect(isPast('2026-09-24')).toBe(false)
    expect(isTodayOrPast('2026-09-24')).toBe(true)
  })

  it('returns false when there is no date', () => {
    expect(isTodayOrPast(null)).toBe(false)
    expect(isTodayOrPast('')).toBe(false)
    expect(isPast(undefined)).toBe(false)
  })
})

describe('isWithinNextDays', () => {
  it('excludes today and the past', () => {
    expect(isWithinNextDays('2026-09-24', 7)).toBe(false)
    expect(isWithinNextDays('2026-09-20', 7)).toBe(false)
  })

  it('includes tomorrow up to and including the last day', () => {
    expect(isWithinNextDays('2026-09-25', 7)).toBe(true)
    expect(isWithinNextDays('2026-10-01', 7)).toBe(true)
    expect(isWithinNextDays('2026-10-02', 7)).toBe(false)
  })

  it('returns false when there is no date', () => {
    expect(isWithinNextDays(null, 7)).toBe(false)
  })
})

describe('formatDate / formatShortDate', () => {
  it('formats in French without shifting the day', () => {
    expect(formatDate('2026-09-24')).toBe('24/09/2026')
    expect(formatDate('2026-01-01')).toBe('01/01/2026')
    expect(formatShortDate('2026-09-24')).toBe('24/09')
  })

  it('shows a dash when there is no date', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatShortDate('')).toBe('—')
  })
})
