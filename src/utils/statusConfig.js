export const STATUS_CONFIG = {
  contacted: {
    label: 'Contacté / En attente',
    shortLabel: 'Contacté',
    badgeClass:
      'border border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/25 dark:bg-amber-500/10 dark:text-amber-300',
    dotClass: 'bg-amber-400',
  },
  interested: {
    label: 'Intéressé',
    badgeClass:
      'border border-green-200 bg-green-50 text-green-700 dark:border-green-500/25 dark:bg-green-500/10 dark:text-green-300',
    dotClass: 'bg-green-400',
  },
  follow_up: {
    label: 'À relancer',
    badgeClass:
      'border border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-500/25 dark:bg-orange-500/10 dark:text-orange-300',
    dotClass: 'bg-orange-400',
  },
  not_interested: {
    label: 'Pas intéressé',
    badgeClass:
      'border border-red-200 bg-red-50 text-red-700 dark:border-red-500/25 dark:bg-red-500/10 dark:text-red-300',
    dotClass: 'bg-red-400',
  },
  client: {
    label: 'Client',
    badgeClass:
      'border border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-500/25 dark:bg-blue-500/10 dark:text-blue-300',
    dotClass: 'bg-blue-400',
  },
}

export const STATUS_OPTIONS = Object.entries(STATUS_CONFIG).map(([value, { label }]) => ({
  value,
  label,
}))

// Clients live on the Clients page, so the Prospects list and its filter exclude them.
export const PROSPECT_STATUS_OPTIONS = STATUS_OPTIONS.filter((option) => option.value !== 'client')

export const ACTIVE_STATUSES = Object.keys(STATUS_CONFIG).filter(
  (status) => status !== 'client' && status !== 'not_interested',
)
