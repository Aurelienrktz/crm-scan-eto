import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

const OPTIONS = [
  { value: 'light', label: 'Clair', icon: Sun },
  { value: 'dark', label: 'Sombre', icon: Moon },
]

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  return (
    <div role="radiogroup" aria-label="Thème" className="flex rounded-lg bg-slate-800/70 p-1">
      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const active = theme === value
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setTheme(value)}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors ${
              active ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        )
      })}
    </div>
  )
}
