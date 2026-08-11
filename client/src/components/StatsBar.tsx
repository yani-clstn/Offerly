import type { Application } from '../types/application'

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

export default function StatsBar({ applications }: { applications: Application[] }) {
  const stats = computeStats(applications)

  const items = [
    { label: 'Active', value: stats.active, color: 'text-navy' },
    { label: 'Interviewing', value: stats.interviewing, color: 'text-terracotta' },
    { label: 'Offers', value: stats.offers, color: 'text-navy' },
    { label: 'Total logged', value: stats.total, color: 'text-navy' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item) => (
        <div key={item.label} className="bg-offwhite border border-border rounded-lg p-3">
          <p className={`font-display text-2xl ${item.color}`}>{item.value}</p>
        </div>
      ))}
    </div>
  )
}