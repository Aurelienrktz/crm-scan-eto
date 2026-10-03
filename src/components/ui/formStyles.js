export const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300'

const fieldBase =
  'mt-1.5 w-full min-w-0 rounded-lg border border-slate-200 bg-white py-2 text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500'

export const inputClass = `${fieldBase} px-3 text-sm`

// Native date pickers have a wide intrinsic width; compact on mobile so two fit side by side.
// The calendar icon is also hidden on mobile (see index.css): tapping the field opens the picker.
export const dateInputClass = `${fieldBase} px-2 text-xs leading-5 sm:px-3 sm:text-sm`
