const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const URL_REGEX = /^https?:\/\//i
const WWW_REGEX = /^www\./i
const PHONE_REGEX = /^\+?\d{7,15}$/

// Simple, best-effort detection: no heavy parsing, falls back to plain text.
export function parseContact(raw) {
  if (!raw) return null
  const value = raw.trim()
  if (!value) return null

  if (EMAIL_REGEX.test(value)) {
    return { href: `mailto:${value}`, external: false }
  }

  if (URL_REGEX.test(value)) {
    return { href: value, external: true }
  }

  if (WWW_REGEX.test(value)) {
    return { href: `https://${value}`, external: true }
  }

  const digitsOnly = value.replace(/[\s().-]/g, '')
  if (PHONE_REGEX.test(digitsOnly)) {
    return { href: `tel:${digitsOnly}`, external: false }
  }

  return null
}
