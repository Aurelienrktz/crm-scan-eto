import { BILLING_STATES } from '../../utils/billing'

export function BillingBadge({ state }) {
  const config = BILLING_STATES[state]
  if (!config) return null

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${config.badgeClass}`}
    >
      {config.label}
    </span>
  )
}
