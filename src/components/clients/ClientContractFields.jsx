import { dateInputClass, inputClass, labelClass } from '../ui/formStyles'
import { SUBSCRIPTION_STATUS_OPTIONS } from '../../utils/billing'

export function ClientContractFields({ form, onChange }) {
  return (
    <fieldset className="space-y-4 rounded-xl border border-blue-200 bg-blue-50/50 p-4 dark:border-blue-500/25 dark:bg-blue-500/5">
      <legend className="px-1 text-sm font-semibold text-blue-700 dark:text-blue-300">
        Contrat client
      </legend>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="min-w-0">
          <label htmlFor="contract_amount" className={labelClass}>
            Prix du contrat *
          </label>
          <input
            id="contract_amount"
            inputMode="numeric"
            placeholder="300 000"
            value={form.contract_amount}
            onChange={onChange('contract_amount')}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Création du menu, en Ar</p>
        </div>
        <div className="min-w-0">
          <label htmlFor="subscription_amount" className={labelClass}>
            Abonnement mensuel *
          </label>
          <input
            id="subscription_amount"
            inputMode="numeric"
            placeholder="20 000"
            value={form.subscription_amount}
            onChange={onChange('subscription_amount')}
            className={inputClass}
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Hébergement et support, en Ar
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="min-w-0">
          <label htmlFor="subscription_start" className={labelClass}>
            Début de l'abonnement *
          </label>
          <input
            id="subscription_start"
            type="date"
            value={form.subscription_start}
            onChange={onChange('subscription_start')}
            className={dateInputClass}
          />
        </div>
        <div className="min-w-0">
          <label htmlFor="subscription_status" className={labelClass}>
            Abonnement
          </label>
          <select
            id="subscription_status"
            value={form.subscription_status}
            onChange={onChange('subscription_status')}
            className={inputClass}
          >
            {SUBSCRIPTION_STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="text-xs text-slate-500 dark:text-slate-400">
        L'échéance mensuelle tombe le même jour que la date de début.
      </p>
    </fieldset>
  )
}
