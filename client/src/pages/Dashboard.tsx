import { useEffect, useState } from 'react'
import { getApplications } from '../api/applications.ts'
import type { Application } from '../types/application'
import ApplicationCard from '../components/ApplicationCard'

export default function Dashboard() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getApplications()
      .then(setApplications)
      .catch(() => setError('Could not load applications. Is the server running?'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <p className="text-gray text-sm mt-8">Loading...</p>
  if (error) return <p className="text-terracotta text-sm mt-8">{error}</p>

  if (applications.length === 0) {
    return (
      <div className="mt-8 text-center py-16 bg-offwhite border border-[#DEDCD3] rounded-xl">
        <p className="font-display text-navy text-lg mb-1">No applications yet</p>
        <p className="text-gray text-sm">Add your first application to start tracking.</p>
      </div>
    )
  }

  return (
    <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
      {applications.map((app) => (
        <ApplicationCard key={app.id} application={app} />
      ))}
    </div>
  )
}