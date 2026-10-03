import { parseContact } from '../../utils/contact'

export function ContactLink({ value }) {
  if (!value) return <span className="text-slate-300 dark:text-slate-600">—</span>

  const contact = parseContact(value)
  if (!contact) return <span className="text-slate-700 dark:text-slate-300">{value}</span>

  return (
    <a
      href={contact.href}
      target={contact.external ? '_blank' : undefined}
      rel={contact.external ? 'noreferrer' : undefined}
      className="text-blue-600 hover:underline dark:text-blue-400"
      onClick={(event) => event.stopPropagation()}
    >
      {value}
    </a>
  )
}
