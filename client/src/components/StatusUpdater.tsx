import { useState } from 'react'
import { updateApplicationStatus } from '../api/applications.ts'
import type { Status } from '../types/application'

const STATUSES: Status[] = [
  'wishlist', 'applied', 'phone_screen', 'interview', 'offer', 'accepted', 'rejected', 'withdrawn',
]

export default function StatusUpdater({
  applicationId,
  currentStatus,
  onUpdated,
}: {
  applicationId: number
  currentStatus: Status
  onUpdated: () => void
}) {
  const [updating, setUpdating] = useState(false)

  async function handleChange(status: Status) {
    setUpdating(true)
    try {
      await updateApplicationStatus(applicationId, status)
      onUpdated()
    } finally {
      setUpdating(false)
    }
  }

  return (
    <select
      value={currentStatus}
      disabled={updating}
      onChange={(e) => handleChange(e.target.value as Status)}
      className="text-xs bg-offwhite border border-[#DEDCD3] rounded-lg px-2 py-1.5 text-navy focus:outline-none focus:border-terracotta"
    >
      {STATUSES.map((s) => (
        <option key={s} value={s}>{s.replace('_', ' ')}</option>
      ))}
    </select>
  )
}