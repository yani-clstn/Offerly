import type { Application } from '../types/application'

const STALE_DAYS = 7
const TERMINAL_STATUSES = ['accepted', 'rejected', 'withdrawn']

export function getReminderStatus(app: Application): 'overdue' | 'stale' | null {
  const now = new Date()

  if (app.followUpDate) {
    const followUp = new Date(app.followUpDate)
    if (followUp <= now) return 'overdue'
  }

  if (!TERMINAL_STATUSES.includes(app.status)) {
    const daysSinceUpdate = (now.getTime() - new Date(app.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
    if (daysSinceUpdate >= STALE_DAYS) return 'stale'
  }

  return null
}