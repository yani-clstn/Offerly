import { useState } from 'react'
import { addNote } from '../api/applications.ts'

export default function NoteForm({ applicationId, onAdded }: { applicationId: number; onAdded: () => void }) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!content.trim()) return
    setSubmitting(true)
    try {
      await addNote(applicationId, content)
      setContent('')
      onAdded()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-3 pt-3 border-t border-border">
      <input
        className="flex-1 bg-cream border border-border rounded-lg px-2 py-1.5 text-xs text-navy placeholder:text-gray focus:outline-none focus:border-terracotta"
        placeholder="Add a note..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button
        type="submit"
        disabled={submitting}
        className="text-xs bg-navy text-offwhite px-3 py-1.5 rounded-lg hover:bg-terracotta transition-colors disabled:opacity-50"
      >
        Add
      </button>
    </form>
  )
}