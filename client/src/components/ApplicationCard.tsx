import { Link } from 'react-router-dom'
import type { Application } from '../types/application'
import StatusBadge from './StatusBadge'
import { getReminderStatus } from '../lib/reminders'

export default function ApplicationCard({ application }: { application: Application }) {
  const reminder = getReminderStatus(application)

  return (
    <Link
      to={`/applications/${application.id}`}
      className="block bg-offwhite border border-border rounded-xl p-4 hover:border-terracotta transition-colors"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-medium text-sm text-navy">{application.company}</p>
            {reminder && (
              <span
                className="w-1.5 h-1.5 rounded-full bg-terracotta"
                title={reminder === 'overdue' ? 'Follow-up overdue' : 'No update in 7+ days'}
              />
            )}
          </div>
          <p className="text-xs text-gray mt-0.5">{application.role}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>
    </Link>
  )
}