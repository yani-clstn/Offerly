import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getApplication, updateApplication } from '../api/applications'
import StatusUpdater from '../components/StatusUpdater'
import NoteForm from '../components/NoteForm'
import DocumentForm from '../components/DocumentForm'
import FollowUpPicker from '../components/FollowUpPicker'

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
  salaryMin: number | null
  salaryMax: number | null
  salaryPeriod: 'hourly' | 'monthly' | 'yearly' | null
  currency: string | null
  status: string
  jobPostingUrl: string | null
  followUpDate: string | null
  statusHistory: StatusEntry[]
  notes: { id: number; content: string; createdAt: string }[]
  documents: { id: number; label: string; url: string; type: string }[]
}

interface SalaryEditorProps {
  applicationId: number
  salaryMin?: number | null
  salaryMax?: number | null
  salaryPeriod?: 'hourly' | 'monthly' | 'yearly' | null
  onUpdated: () => void
}

function SalaryEditor({
  applicationId,
  salaryMin,
  salaryMax,
  salaryPeriod,
  onUpdated,
}: SalaryEditorProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [min, setMin] = useState(salaryMin ? String(salaryMin) : '')
  const [max, setMax] = useState(salaryMax ? String(salaryMax) : '')
  const [period, setPeriod] = useState<'hourly' | 'monthly' | 'yearly'>(salaryPeriod || 'yearly')
  const [saving, setSaving] = useState(false)

  const formatSalaryDisplay = () => {
    if (!salaryMin && !salaryMax) return null
    const periodLabel = salaryPeriod ? ` / ${salaryPeriod.replace('ly', '')}` : ''
    if (salaryMin && salaryMax) {
      return `₱${Number(salaryMin).toLocaleString()} – ₱${Number(salaryMax).toLocaleString()}${periodLabel}`
    }
    if (salaryMin) return `From ₱${Number(salaryMin).toLocaleString()}${periodLabel}`
    return `Up to ₱${Number(salaryMax).toLocaleString()}${periodLabel}`
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      await updateApplication(applicationId, {
        salaryMin: min ? Number(min) : null,
        salaryMax: max ? Number(max) : null,
        salaryPeriod: period,
      })
      setIsEditing(false)
      onUpdated()
    } catch {
      alert('Failed to update salary details.')
    } finally {
      setSaving(false)
    }
  }

  const salaryDisplay = formatSalaryDisplay()

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        className="bg-cream border border-border px-2 py-0.5 rounded text-xs text-navy font-mono hover:border-terracotta transition-colors"
      >
        {salaryDisplay ? `💰 ${salaryDisplay}` : '➕ Add Salary'}
      </button>
    )
  }

  return (
    <form onSubmit={handleSave} className="flex flex-wrap items-center gap-2 bg-cream border border-border p-2 rounded-lg text-xs">
      <input
        type="number"
        placeholder="Min"
        value={min}
        onChange={(e) => setMin(e.target.value)}
        className="w-20 bg-offwhite border border-border rounded px-2 py-1 text-navy text-xs focus:outline-none"
      />
      <input
        type="number"
        placeholder="Max"
        value={max}
        onChange={(e) => setMax(e.target.value)}
        className="w-20 bg-offwhite border border-border rounded px-2 py-1 text-navy text-xs focus:outline-none"
      />
      <select
        value={period}
        onChange={(e) => setPeriod(e.target.value as any)}
        className="bg-offwhite border border-border rounded px-2 py-1 text-navy text-xs focus:outline-none"
      >
        <option value="yearly">/yr</option>
        <option value="monthly">/mo</option>
        <option value="hourly">/hr</option>
      </select>
      <button
        type="submit"
        disabled={saving}
        className="bg-navy text-cream px-2 py-1 rounded text-xs hover:bg-terracotta transition-colors"
      >
        {saving ? '...' : 'Save'}
      </button>
      <button
        type="button"
        onClick={() => setIsEditing(false)}
        className="text-gray text-xs hover:text-navy px-1"
      >
        Cancel
      </button>
    </form>
  )
}

export default function ApplicationDetail() {
  const { id } = useParams()
  const [application, setApplication] = useState<ApplicationWithRelations | null>(null)
  const [loading, setLoading] = useState(true)

  function reload() {
    if (!id) return
    getApplication(Number(id)).then(setApplication)
  }

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
      <Link to="/" className="text-xs text-gray hover:text-terracotta transition-colors">
        &larr; Back to dashboard
      </Link>

      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mt-4 mb-6">
        <div>
          <h1 className="font-display text-2xl text-navy">{application.company}</h1>
          <p className="text-sm text-gray mt-1 font-medium">{application.role}</p>
          
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray">
            {application.location && <span>📍 {application.location}</span>}
            <SalaryEditor
              applicationId={application.id}
              salaryMin={application.salaryMin}
              salaryMax={application.salaryMax}
              salaryPeriod={application.salaryPeriod}
              onUpdated={reload}
            />
            {application.jobPostingUrl && (
              <a
                href={application.jobPostingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-terracotta hover:underline inline-flex items-center gap-1"
              >
                Job listing &rarr;
              </a>
            )}
          </div>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-2 w-full sm:w-auto">
          <StatusUpdater
            applicationId={application.id}
            currentStatus={application.status as any}
            onUpdated={reload}
          />
          <FollowUpPicker
            applicationId={application.id}
            currentValue={application.followUpDate}
            onUpdated={reload}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Status timeline */}
        <div className="bg-offwhite border border-border rounded-xl p-4">
          <p className="text-xs font-mono text-gray mb-3">Status log</p>
          <div className="relative pl-4">
            <div className="absolute left-[3px] top-1 bottom-1 w-px bg-border" />
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
        <div className="bg-offwhite border border-border rounded-xl p-4">
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
          <NoteForm applicationId={application.id} onAdded={reload} />
        </div>

        {/* Documents */}
        <div className="bg-offwhite border border-border rounded-xl p-4">
          <p className="text-xs font-mono text-gray mb-3">Documents</p>
          {application.documents.length === 0 ? (
            <p className="text-xs text-gray">No documents yet.</p>
          ) : (
            application.documents.map((doc) => {
              const linkProps = {
                key: doc.id,
                href: doc.url,
                target: '_blank',
                rel: 'noopener noreferrer',
                className: 'block mb-2 group',
              }
              return (
                <a {...linkProps}>
                  <p className="text-xs text-navy group-hover:text-terracotta transition-colors">
                    {doc.label}
                  </p>
                  <p className="text-[10px] text-gray uppercase tracking-wide mt-0.5">
                    {doc.type.replace('_', ' ')}
                  </p>
                </a>
              )
            })
          )}
          <DocumentForm applicationId={application.id} onAdded={reload} />
        </div>
      </div>
    </div>
  )
}