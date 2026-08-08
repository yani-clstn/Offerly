import { Link } from 'react-router-dom'
import type { Application } from '../types/application'
import StatusBadge from './StatusBadge'

export default function ApplicationCard({ application }: { application: Application }) {
  return (
    <Link
      to={`/applications/${application.id}`}
      className="block bg-offwhite border border-[#DEDCD3] rounded-xl p-4 hover:border-terracotta transition-colors"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="font-medium text-sm text-navy">{application.company}</p>
          <p className="text-xs text-gray mt-0.5">{application.role}</p>
        </div>
        <StatusBadge status={application.status} />
      </div>
    </Link>
  )
}