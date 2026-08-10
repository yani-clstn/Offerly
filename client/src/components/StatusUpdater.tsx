import { useEffect, useRef, useState } from 'react'
import { updateApplicationStatus } from '../api/applications'
import type { Status } from '../types/application'
import { STATUS_STYLES, STATUS_LABELS } from './StatusBadge'

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
  const [open, setOpen] = useState(false)
  const [updating, setUpdating] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleSelect(status: Status) {
    setOpen(false)
    if (status === currentStatus) return
    setUpdating(true)
    try {
      await updateApplicationStatus(applicationId, status)
      onUpdated()
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        disabled={updating}
        onClick={() => setOpen((o) => !o)}
        className={`text-xs px-2 py-1 rounded-full flex items-center gap-1.5 disabled:opacity-50 ${STATUS_STYLES[currentStatus]}`}
      >
        {STATUS_LABELS[currentStatus]}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 bg-offwhite border border-[#DEDCD3] rounded-lg shadow-lg py-1.5 z-10 min-w-[140px]">
          {STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => handleSelect(status)}
              className="w-full text-left px-3 py-1.5 hover:bg-cream transition-colors flex items-center gap-2"
            >
              <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}>
                {STATUS_LABELS[status]}
              </span>
              {status === currentStatus && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="ml-auto text-terracotta">
                  <path d="M2.5 6l2.5 2.5L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}