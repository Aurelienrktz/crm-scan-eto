import { Search } from 'lucide-react'
import { PROSPECT_STATUS_OPTIONS } from '../../utils/statusConfig'

const SORT_OPTIONS = [
  { value: 'recent', label: 'Plus récent' },
  { value: 'oldest', label: 'Plus ancien' },
  { value: 'follow_up', label: 'Prochaine relance' },
]

const controlClass =
  'rounded-lg border border-slate-200 bg-white text-sm text-slate-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200'

export function FiltersBar({
  search,
  onSearchChange,
  status,
  onStatusChange,
  city,
  onCityChange,
  cityOptions,
  sort,
  onSortChange,
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center">
      <div className="relative flex-1 md:max-w-xs">
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
        <input
          type="text"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Rechercher un nom, une ville, un contact..."
          className={`w-full py-2 pr-3 pl-9 placeholder:text-slate-400 dark:placeholder:text-slate-500 ${controlClass}`}
        />
      </div>

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className={`px-3 py-2 ${controlClass}`}
      >
        <option value="">Tous les statuts</option>
        {PROSPECT_STATUS_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <select
        value={city}
        onChange={(event) => onCityChange(event.target.value)}
        className={`px-3 py-2 ${controlClass}`}
      >
        <option value="">Toutes les villes</option>
        {cityOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        value={sort}
        onChange={(event) => onSortChange(event.target.value)}
        className={`px-3 py-2 ${controlClass}`}
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
