export function getInitials(name) {
  return (name ?? '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

// Lowercase, strip accents ("hotel" matches "Hôtel") and unify apostrophes, since
// names typed on a phone use ’ while a PC keyboard types '.
export function normalizeText(value) {
  return (value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[‘’ʼ`´]/g, "'")
    .toLowerCase()
}
