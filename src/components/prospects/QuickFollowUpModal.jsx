import { useState } from 'react'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { inputClass, labelClass } from '../ui/formStyles'
import { useToast } from '../../hooks/useToast'
import { addDaysISO, formatDate, isTodayOrPast, todayISODate } from '../../utils/date'
import { DEFAULT_FOLLOW_UP_DAYS } from '../../utils/prospects'

const PRESETS = [
  { days: 2, label: 'Dans 2 jours' },
  { days: 5, label: 'Dans 5 jours' },
  { days: 7, label: 'Dans 1 semaine' },
  { days: 14, label: 'Dans 2 semaines' },
]

function initialFollowUpDate(prospect) {
  const current = prospect.next_follow_up
  return current && !isTodayOrPast(current) ? current : addDaysISO(DEFAULT_FOLLOW_UP_DAYS)
}

export function QuickFollowUpModal({ prospect, onSave, onClose }) {
  const [contactedToday, setContactedToday] = useState(true)
  const [date, setDate] = useState(() => initialFollowUpDate(prospect))
  const toast = useToast()
  const today = todayISODate()

  function handleSubmit(event) {
    event.preventDefault()
    const payload = {
      next_follow_up: date,
      ...(contactedToday ? { last_contact: today } : {}),
    }

    onSave(prospect.id, payload)
      .then(() =>
        toast.success(
          contactedToday
            ? `Contact enregistré, relance le ${formatDate(date)}`
            : `Relance prévue le ${formatDate(date)}`,
        ),
      )
      .catch((err) => {
        console.error('Failed to save follow-up', err)
        toast.error("Le suivi n'a pas pu être enregistré.")
      })
    onClose()
  }

  return (
    <Modal title={`Suivi de ${prospect.name}`} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 px-3 py-2.5 dark:border-slate-700">
          <input
            type="checkbox"
            checked={contactedToday}
            onChange={(event) => setContactedToday(event.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
          />
          <span className="text-sm">
            <span className="block font-medium text-slate-900 dark:text-slate-100">
              Contacté aujourd'hui
            </span>
            <span className="block text-xs text-slate-500 dark:text-slate-400">
              Le dernier contact passe au {formatDate(today)}
            </span>
          </span>
        </label>

        <div>
          <label htmlFor="next_follow_up" className={labelClass}>
            Prochaine relance
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {PRESETS.map(({ days, label }) => {
              const value = addDaysISO(days)
              const active = date === value
              return (
                <button
                  key={days}
                  type="button"
                  onClick={() => setDate(value)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    active
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400/50 dark:bg-blue-500/15 dark:text-blue-300'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
          <input
            id="next_follow_up"
            type="date"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className={inputClass}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit">Enregistrer</Button>
        </div>
      </form>
    </Modal>
  )
}
