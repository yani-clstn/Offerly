import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Navigation, Compass } from 'lucide-react'
import { getStageDurations, type StageDuration } from '../api/applications'

const STATUS_LABELS: Record<string, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  phone_screen: 'Phone screen',
  interview: 'Interview',
  offer: 'Offer',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface LocationAnalytics {
  nearestJob: {
    id: string
    company: string
    role: string
    location: string | null
    distanceKm: number
    status: string
  } | null
  totalLocatedJobs: number
  averageDistanceKm: number
}

export default function Analytics() {
  const [stageData, setStageData] = useState<StageDuration[]>([])
  const [locationData, setLocationData] = useState<LocationAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [durations, locRes] = await Promise.all([
          getStageDurations(),
          fetch(`${API_BASE}/api/analytics/location`, { credentials: 'include' }).then((r) =>
            r.ok ? r.json() : null
          ),
        ])
        setStageData(durations)
        setLocationData(locRes)
      } catch (err) {
        console.error('Failed to load analytics data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) return <p className="text-gray text-sm mt-8">Loading analytics...</p>

  const maxDays = Math.max(...stageData.map((d) => d.avgDays), 1)

  return (
    <div className="mt-8 space-y-10">
      <div>
        <Link to="/" className="text-xs text-gray hover:text-terracotta">
          &larr; Back to dashboard
        </Link>
        <h1 className="font-display text-2xl text-navy mt-4 mb-1">Analytics & Insights</h1>
        <p className="text-sm text-gray">
          Track stage transition speeds and commute metrics across your applications.
        </p>
      </div>

      {/* --- Location & Commute Section --- */}
      <section className="space-y-4">
        <h2 className="font-display text-lg text-navy flex items-center gap-2">
          <Navigation className="w-4 h-4 text-terracotta" />
          Location & Commute Insights
        </h2>

        {!locationData || !locationData.nearestJob ? (
          <div className="text-center py-8 bg-offwhite border border-border rounded-xl">
            <MapPin className="w-5 h-5 text-gray mx-auto mb-2" />
            <p className="text-xs text-navy font-medium">No distance data available</p>
            <p className="text-[11px] text-gray mt-1">
              Specify locations and calculate driving distances on your applications to surface your nearest opportunities.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Closest Job Card */}
            <div className="md:col-span-2 bg-offwhite border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-terracotta font-semibold bg-cream px-2 py-0.5 rounded border border-border">
                    Closest Opportunity
                  </span>
                  <span className="text-xs font-mono text-navy font-bold">
                    {locationData.nearestJob.distanceKm} km away
                  </span>
                </div>

                <h3 className="text-base font-semibold text-navy">{locationData.nearestJob.role}</h3>
                <p className="text-xs text-gray">{locationData.nearestJob.company}</p>

                <div className="mt-3 flex items-center gap-1.5 text-xs text-navy/80">
                  <MapPin className="w-3.5 h-3.5 text-gray shrink-0" />
                  <span>{locationData.nearestJob.location || 'Location provided'}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-gray capitalize">
                  Status: {STATUS_LABELS[locationData.nearestJob.status] || locationData.nearestJob.status}
                </span>
                <Link
                  to={`/applications/${locationData.nearestJob.id}`}
                  className="text-xs text-terracotta font-medium hover:underline"
                >
                  View application &rarr;
                </Link>
              </div>
            </div>

            {/* Aggregate Stats Card */}
            <div className="bg-offwhite border border-border rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-mono text-gray mb-3">
                  <Compass className="w-4 h-4 text-navy" />
                  <span>Pipeline Distance</span>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-display text-navy">
                      {locationData.averageDistanceKm} <span className="text-xs font-sans text-gray">km</span>
                    </p>
                    <p className="text-[11px] text-gray">Average commute distance</p>
                  </div>

                  <div>
                    <p className="text-lg font-display text-navy">{locationData.totalLocatedJobs}</p>
                    <p className="text-[11px] text-gray font-sans">Applications with mapped locations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* --- Time in Each Stage Section --- */}
      <section className="space-y-4">
        <h2 className="font-display text-lg text-navy">Time in each stage</h2>
        <p className="text-xs text-gray">
          Average days spent before moving to the next stage, calculated from transition timestamps.
        </p>

        {stageData.length === 0 ? (
          <div className="text-center py-12 bg-offwhite border border-border rounded-xl">
            <p className="text-gray text-xs">
              Not enough data yet — this populates once applications move through multiple stages.
            </p>
          </div>
        ) : (
          <div className="bg-offwhite border border-border rounded-xl p-6 space-y-4 shadow-sm">
            {stageData.map((item) => (
              <div key={item.status}>
                <div className="flex justify-between items-baseline mb-1">
                  <span className="text-sm text-navy font-medium">
                    {STATUS_LABELS[item.status] || item.status}
                  </span>
                  <span className="text-xs text-gray">
                    {item.avgDays.toFixed(1)} days avg &middot; {item.count} {item.count === 1 ? 'sample' : 'samples'}
                  </span>
                </div>
                <div className="h-2 bg-cream rounded-full overflow-hidden">
                  <div
                    className="h-full bg-terracotta rounded-full transition-all duration-300"
                    style={{ width: `${(item.avgDays / maxDays) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}