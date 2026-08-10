import { useEffect, useMemo, useState } from 'react'
import { getApplications } from '../api/applications'
import type { Application, Status } from '../types/application'
import ApplicationCard from '../components/ApplicationCard'
import StatsBar from '../components/StatsBar'
import FilterBar, { type SortOption } from '../components/FilterBar'
import { useSession } from '../lib/auth-client'

export default function Dashboard() {
  const { data: session } = useSession()
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all')
  const [sortOption, setSortOption] = useState<SortOption>('newest')

  useEffect(() => {
    getApplications()
      .then(setApplications)
      .catch(() => setError('Could not load applications. Is the server running?'))
      .finally(() => setLoading(false))
  }, [])

  const visibleApplications = useMemo(() => {
    let result = applications

    if (statusFilter !== 'all') {
      result = result.filter((a) => a.status === statusFilter)
    }

    result = [...result].sort((a, b) => {
      if (sortOption === 'company') return a.company.localeCompare(b.company)
      const diff = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sortOption === 'newest' ? -diff : diff
    })

    return result
  }, [applications, statusFilter, sortOption])

  const firstName = session?.user?.name?.split(' ')[0]

  if (loading) return <p className="text-gray text-sm mt-8">Loading...</p>
  if (error) return <p className="text-terracotta text-sm mt-8">{error}</p>

  if (applications.length === 0) {
    return (
      <div className="mt-8">
        {firstName && (
          <h1 className="font-display text-2xl text-navy mb-6">
            Hello there, <span className="font-script italic text-terracotta text-3xl">{firstName}</span>
          </h1>
        )}
        <div className="text-center py-16 bg-offwhite border border-[#DEDCD3] rounded-xl">
          <p className="font-display text-navy text-lg mb-1">No applications yet</p>
          <p className="text-gray text-sm">Add your first application to start tracking.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-6">
      {firstName && (
        <h1 className="font-display text-2xl text-navy">
          Hello there, <span className="font-script italic text-terracotta text-3xl">{firstName}</span>
        </h1>
      )}
      <StatsBar applications={applications} />
      <FilterBar
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      {visibleApplications.length === 0 ? (
        <p className="text-gray text-sm">No applications match this filter.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {visibleApplications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  )
}