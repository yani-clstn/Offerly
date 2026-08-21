import type { Application, Status } from '../types/application'

function computeStats(applications: Application[]) {
  const active = applications.filter(
    (a) => !['rejected', 'withdrawn', 'accepted'].includes(a.status)
  ).length

  const interviewing = applications.filter((a) =>
    ['phone_screen', 'interview'].includes(a.status)
  ).length

  const offers = applications.filter((a) =>
    ['offer', 'accepted'].includes(a.status)
  ).length

  return { active, interviewing, offers, total: applications.length }
}

interface StatsBarProps {
  applications: Application[]
  activeStatusFilter?: Status | 'all'
  onSelectStatus?: (status: Status | 'all') => void
}

export default function StatsBar({
  applications,
  activeStatusFilter,
  onSelectStatus,
}: StatsBarProps) {
  const stats = computeStats(applications)

  const items = [
    { label: 'Active', value: stats.active, color: 'text-navy', filterValue: 'all' as const },
    { label: 'Interviewing', value: stats.interviewing, color: 'text-terracotta', filterValue: 'interview' as const },
    { label: 'Offers', value: stats.offers, color: 'text-navy', filterValue: 'offer' as const },
    { label: 'Total logged', value: stats.total, color: 'text-navy', filterValue: 'all' as const },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => {
        const isActive = activeStatusFilter === item.filterValue && item.filterValue !== 'all'

        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelectStatus?.(item.filterValue)}
            disabled={!onSelectStatus}
            className={`text-left rounded-lg p-3 border transition-all ${
              onSelectStatus ? 'cursor-pointer hover:border-terracotta' : ''
            } ${
              isActive
                ? 'bg-cream border-terracotta shadow-xs'
                : 'bg-offwhite border-border'
            }`}
          >
            <p className="text-xs text-gray font-medium mb-1">{item.label}</p>
            <p className={`font-display text-2xl ${item.color}`}>{item.value}</p>
          </button>
        )
      })}
    </div>
  )
}