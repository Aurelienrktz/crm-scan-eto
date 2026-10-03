export function getDisplayName(user) {
  if (!user) return ''

  const metaName = user.user_metadata?.full_name || user.user_metadata?.name
  if (metaName) return metaName.split(' ')[0]

  if (user.email) {
    const localPart = user.email.split('@')[0]
    return localPart.charAt(0).toUpperCase() + localPart.slice(1)
  }

  return ''
}
