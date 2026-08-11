import { useState } from 'react'
import { addDocument } from '../api/applications'

export default function DocumentForm({ applicationId, onAdded }: { applicationId: number; onAdded: () => void }) {
  const [type, setType] = useState<'resume' | 'cover_letter' | 'other'>('resume')
  const [label, setLabel] = useState('')
  const [url, setUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!label.trim() || !url.trim()) return
    setSubmitting(true)
    try {
      await addDocument(applicationId, { type, label, url })
      setLabel('')
      setUrl('')
      onAdded()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 pt-3 border-t border-border space-y-2">
      <div className="flex gap-2">
        <select
          value={type}
          onChange={(e) => setType(e.target.value as typeof type)}
          className="text-xs bg-cream border border-border rounded-lg px-2 py-1.5 text-navy focus:outline-none focus:border-terracotta"
        >
          <option value="resume">Resume</option>
          <option value="cover_letter">Cover letter</option>
          <option value="other">Other</option>
        </select>
        <input
          className="flex-1 bg-cream border border-border rounded-lg px-2 py-1.5 text-xs text-navy placeholder:text-gray focus:outline-none focus:border-terracotta"
          placeholder="Label (e.g. Resume v3 - Backend)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 bg-cream border border-border rounded-lg px-2 py-1.5 text-xs text-navy placeholder:text-gray focus:outline-none focus:border-terracotta"
          placeholder="Google Drive link"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="text-xs bg-navy text-offwhite px-3 py-1.5 rounded-lg hover:bg-terracotta transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          Add
        </button>
      </div>
    </form>
  )
}