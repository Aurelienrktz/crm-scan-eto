import { Users, Clock, Bell, Award } from 'lucide-react'
import { StatCard } from '../ui/StatCard'
import { isFollowUpDue } from '../../utils/prospects'
import { isPast } from '../../utils/date'

// "Prospects" excludes clients; the conversion rate compares clients to everyone ever entered.
export function StatsGrid({ prospects }) {
  const pipeline = prospects.filter((p) => p.status !== 'client')
  const total = pipeline.length
  const waiting = pipeline.filter((p) => p.status === 'contacted').length
  const dueProspects = prospects.filter(isFollowUpDue)
  const dueCount = dueProspects.length
  const overdueCount = dueProspects.filter((p) => isPast(p.next_follow_up)).length
  const clients = prospects.length - total
  const cityCount = new Set(pipeline.map((p) => p.city).filter(Boolean)).size

  const percentOfTotal = (count) =>
    total > 0 ? `${Math.round((count / total) * 100)}% des prospects` : undefined
  const conversionRate =
    prospects.length > 0
      ? `${Math.round((clients / prospects.length) * 100)}% de conversion`
      : undefined

  const dueCaption = overdueCount > 0
    ? `${overdueCount} en retard`
    : dueCount > 0
      ? "à traiter aujourd'hui"
      : 'à jour'

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      <StatCard
        label="Total prospects"
        value={total}
        icon={Users}
        color="indigo"
        caption={cityCount > 0 ? `${cityCount} ville${cityCount > 1 ? 's' : ''}` : undefined}
      />
      <StatCard
        label="En attente"
        value={waiting}
        icon={Clock}
        color="amber"
        caption={percentOfTotal(waiting)}
      />
      <StatCard
        label="À relancer"
        value={dueCount}
        icon={Bell}
        color="orange"
        caption={dueCaption}
      />
      <StatCard
        label="Clients"
        value={clients}
        icon={Award}
        color="blue"
        caption={conversionRate}
      />
    </div>
  )
}
