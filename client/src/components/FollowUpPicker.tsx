import { useState } from 'react'
import { updateFollowUpDate } from '../api/applications'

export default function FollowUpPicker({
  applicationId,
  currentValue,
  onUpdated,
}: {
  applicationId: number
  currentValue: string | null
  onUpdated: () => void
}) {
  const [draft, setDraft] = useState(currentValue ? currentValue.slice(0, 16) : '')
  const [saving, setSaving] = useState(false)

  const hasChanged = draft !== (currentValue ? currentValue.slice(0, 16) : '')

  async function handleSet() {
    setSaving(true)
    try {
      const value = draft ? new Date(draft).toISOString() : null
      await updateFollowUpDate(applicationId, value)
      onUpdated()
    } finally {
      setSaving(false)
    }
  }

  async function handleClear() {
    setDraft('')
    setSaving(true)
    try {
      await updateFollowUpDate(applicationId, null)
      onUpdated()
    } finally {
      setSaving(false)
    }
  }

  const isOverdue = currentValue && new Date(currentValue) <= new Date()

  return (
    <div className="flex flex-col items-end gap-1.5">
      <div className="flex items-center gap-1.5">
        <label className="text-[10px] text-gray">Follow-up:</label>
        <input
          type="datetime-local"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="text-[11px] bg-offwhite border border-border rounded-md px-1.5 py-1 text-navy focus:outline-none focus:border-terracotta"
        />
        {hasChanged && (
          <button
            onClick={handleSet}
            disabled={saving}
            className="text-[11px] bg-navy text-offwhite px-2 py-1 rounded-md hover:bg-terracotta transition-colors disabled:opacity-50"
          >
            Set
          </button>
        )}
        {currentValue && !hasChanged && (
          <button
            onClick={handleClear}
            disabled={saving}
            className="text-[11px] text-gray hover:text-terracotta transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      {isOverdue && <p className="text-[11px] text-terracotta">Follow-up overdue</p>}
    </div>
  )
}