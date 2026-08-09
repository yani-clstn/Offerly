import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getApplication } from '../api/applications.ts'
import StatusUpdater from '../components/StatusUpdater'
import NoteForm from '../components/NoteForm'

interface StatusEntry {
  id: number
  status: string
  changedAt: string
  note: string | null
}

interface ApplicationWithRelations {
  id: number
  company: string
  role: string
  location: string | null
  status: string
  jobPostingUrl: string | null
  statusHistory: StatusEntry[]
  notes: { id: number; content: string; createdAt: string }[]
  documents: { id: number; label: string; url: string; type: string }[]
}

export default function ApplicationDetail() {
  const { id } = useParams()
  const [application, setApplication] = useState<ApplicationWithRelations | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    getApplication(Number(id))
      .then(setApplication)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <p className="text-gray text-sm mt-8">Loading...</p>
  if (!application) return <p className="text-terracotta text-sm mt-8">Application not found.</p>

  return (
    <div className="mt-8">
      <Link to="/" className="text-xs text-gray hover:text-terracotta">&larr; Back to dashboard</Link>

      <div className="flex justify-between items-start mt-4 mb-6">
        <div>
          <h1 className="font-display text-2xl text-navy">{application.company}</h1>
          <p className="text-sm text-gray mt-1">{application.role}</p>
          {application.location && (
            <p className="text-xs text-gray mt-0.5">{application.location}</p>
          )}
        </div>
        <StatusUpdater
            applicationId={application.id}
            currentStatus={application.status as any}
            onUpdated={() => getApplication(Number(id)).then(setApplication)}
/>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status timeline */}
        <div className="bg-offwhite border border-[#DEDCD3] rounded-xl p-4">
          <p className="text-xs font-mono text-gray mb-3">Status log</p>
          <div className="relative pl-4">
            <div className="absolute left-[3px] top-1 bottom-1 w-px bg-[#DEDCD3]" />
            {application.statusHistory.map((entry, i) => (
              <div key={entry.id} className="relative mb-3 last:mb-0">
                <div
                  className={`absolute -left-4 top-1 w-2 h-2 rounded-full ${
                    i === 0 ? 'bg-terracotta' : 'bg-[#C9C7BE]'
                  }`}
                />
                <p className="font-mono text-xs text-navy">{entry.status}</p>
                <p className="font-mono text-[10px] text-gray mt-0.5">
                  {new Date(entry.changedAt).toLocaleDateString()}
                </p>
                {entry.note && <p className="text-xs text-gray mt-1">{entry.note}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-offwhite border border-[#DEDCD3] rounded-xl p-4">
        <p className="text-xs font-mono text-gray mb-3">Notes</p>
        {application.notes.length === 0 ? (
            <p className="text-xs text-gray mb-3">No notes yet.</p>
        ) : (
            application.notes.map((note) => (
            <div key={note.id} className="mb-3">
                <p className="text-xs text-navy">{note.content}</p>
                <p className="font-mono text-[10px] text-gray mt-0.5">
                {new Date(note.createdAt).toLocaleDateString()}
                </p>
            </div>
            ))
        )}
        <NoteForm
            applicationId={application.id}
            onAdded={() => getApplication(Number(id)).then(setApplication)}
        />
        </div>
      </div>
    </div>
  )
}