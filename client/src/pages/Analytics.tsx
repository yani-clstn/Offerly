import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getStageDurations, type StageDuration } from '../api/applications'

const STATUS_LABELS: Record<string, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  phone_screen: 'Phone screen',
  interview: 'Interview',
  offer: 'Offer',
}

export default function Analytics() {
  const [data, setData] = useState<StageDuration[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStageDurations()
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray text-sm mt-8">Loading...</p>

  const maxDays = Math.max(...data.map((d) => d.avgDays), 1)

  return (
    <div className="mt-8">
      <Link to="/" className="text-xs text-gray hover:text-terracotta">&larr; Back to dashboard</Link>

      <h1 className="font-display text-2xl text-navy mt-4 mb-1">Time in each stage</h1>
      <p className="text-sm text-gray mb-6">
        Average days spent before moving to the next stage, based on your status history.
      </p>

      {data.length === 0 ? (
        <div className="text-center py-16 bg-offwhite border border-border rounded-xl">
          <p className="text-gray text-sm">
            Not enough data yet — this fills in once applications move through multiple stages.
          </p>
        </div>
      ) : (
        <div className="bg-offwhite border border-border rounded-xl p-6 space-y-4">
          {data.map((item) => (
            <div key={item.status}>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm text-navy">
                  {STATUS_LABELS[item.status] || item.status}
                </span>
                <span className="text-xs text-gray">
                  {item.avgDays.toFixed(1)} days avg &middot; {item.count} {item.count === 1 ? 'sample' : 'samples'}
                </span>
              </div>
              <div className="h-2 bg-cream rounded-full overflow-hidden">
                <div
                  className="h-full bg-terracotta rounded-full"
                  style={{ width: `${(item.avgDays / maxDays) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}