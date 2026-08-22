import React from 'react'
import { Pin } from 'lucide-react'

interface ApplicationGridProps {
  applications: Array<any>
  onEdit: (app: any) => void
  onTogglePin: (id: number, currentPinned: boolean) => void
}

export const ApplicationGrid: React.FC<ApplicationGridProps> = ({
  applications,
  onEdit,
  onTogglePin,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2 sm:p-4">
      {applications.map((app) => (
        <div
          key={app.id}
          className="relative flex flex-col justify-between p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow-md transition-shadow"
        >
          {/* Card Header */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 truncate">
                {app.role}
              </h3>
              <button
                onClick={() => onTogglePin(app.id, app.isPinned)}
                className={`p-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  app.isPinned
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                    : 'bg-zinc-100 text-zinc-500 hover:text-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200'
                }`}
                aria-label={app.isPinned ? 'Unpin application' : 'Pin application'}
              >
                <Pin className={`w-3.5 h-3.5 ${app.isPinned ? 'fill-current' : ''}`} />
                <span>{app.isPinned ? 'Pinned' : 'Pin'}</span>
              </button>
            </div>
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400 truncate">
              {app.company}
            </p>
          </div>

          {/* Badges & Metadata */}
          <div className="my-3 flex flex-wrap gap-1.5 text-xs">
            {app.workModel && (
              <span className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-medium">
                {app.workModel}
              </span>
            )}
            {app.employmentType && (
              <span className="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300 font-medium">
                {app.employmentType}
              </span>
            )}
            {app.distanceKm && (
              <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 font-medium">
                📍 {app.distanceKm} km
              </span>
            )}
          </div>

          {/* Card Actions */}
          <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs">
            <span className="capitalize px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
              {app.status}
            </span>
            <button
              onClick={() => onEdit(app)}
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline min-h-[36px] px-2 flex items-center"
            >
              Edit Details
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}