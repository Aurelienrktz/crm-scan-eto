import { describe, expect, it } from 'vitest'
import { parseContact } from './contact'

describe('parseContact', () => {
  it('turns an email into a mailto link', () => {
    expect(parseContact('contact@kingskebab.mg')).toEqual({
      href: 'mailto:contact@kingskebab.mg',
      external: false,
    })
  })

  it('opens http(s) URLs in a new tab', () => {
    expect(parseContact('https://facebook.com/kingskebab')).toEqual({
      href: 'https://facebook.com/kingskebab',
      external: true,
    })
  })

  it('adds https:// to www. addresses', () => {
    expect(parseContact('www.kingskebab.mg')).toEqual({
      href: 'https://www.kingskebab.mg',
      external: true,
    })
  })

  it.each([
    ['034 12 345 67', 'tel:0341234567'],
    ['+261 34 12 345 67', 'tel:+261341234567'],
    ['034.12.345.67', 'tel:0341234567'],
    ['(034) 12-345-67', 'tel:0341234567'],
  ])('turns the phone number "%s" into %s', (input, href) => {
    expect(parseContact(input)).toEqual({ href, external: false })
  })

  it('leaves unrecognised text as plain text', () => {
    expect(parseContact('Facebook')).toBeNull()
    expect(parseContact('Messenger : King Kebab')).toBeNull()
    expect(parseContact('12345')).toBeNull()
  })

  it('returns null for empty values', () => {
    expect(parseContact(null)).toBeNull()
    expect(parseContact('')).toBeNull()
    expect(parseContact('   ')).toBeNull()
  })
})
