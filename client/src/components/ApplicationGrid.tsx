import React from 'react'
import { Pin, MapPin, Pencil, GripVertical } from 'lucide-react'

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
          className="relative flex flex-col justify-between p-5 bg-white border border-stone-200 hover:border-stone-300 dark:bg-[#121824] dark:border-[#1E2638] dark:hover:border-gray-700 rounded-xl shadow-sm transition-all duration-200"
        >
          {/* Card Header */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                {/* Drag Handle Icon */}
                <button
                  type="button"
                  className="cursor-grab active:cursor-grabbing text-stone-400 hover:text-stone-600 dark:text-gray-500 dark:hover:text-gray-300 p-0.5 -ml-1 rounded transition-colors shrink-0"
                  aria-label="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </button>

                <h3 className="font-bold text-lg text-stone-900 dark:text-white truncate">
                  {app.role}
                </h3>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(app.id, app.isPinned);
                }}
                className={`p-1.5 rounded-md text-xs font-medium transition-colors flex items-center gap-1 shrink-0 ${
                  app.isPinned
                    ? 'bg-amber-100 text-amber-800 border border-amber-300 dark:bg-amber-500/20 dark:text-amber-300 dark:border-amber-500/30'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 border border-stone-200 dark:bg-[#1C2433] dark:text-gray-400 dark:hover:text-white dark:border-[#2A3447]'
                }`}
                aria-label={app.isPinned ? 'Unpin application' : 'Pin application'}
              >
                <Pin className={`w-3.5 h-3.5 ${app.isPinned ? 'fill-current' : ''}`} />
                <span>{app.isPinned ? 'Pinned' : 'Pin'}</span>
              </button>
            </div>
            <p className="text-sm font-medium text-stone-500 dark:text-gray-400 truncate mt-0.5 pl-5">
              {app.company}
            </p>
          </div>

          {/* Badges & Metadata */}
          <div className="my-4 flex flex-wrap gap-2 text-xs">
            {app.workModel && (
              <span className="px-2.5 py-1 rounded-md bg-stone-100 text-stone-700 border border-stone-200 dark:bg-[#1C2433] dark:text-gray-300 dark:border-[#2A3447] font-medium">
                {app.workModel}
              </span>
            )}
            {app.employmentType && (
              <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/60 dark:text-blue-400 dark:border-blue-800/40 font-medium">
                {app.employmentType}
              </span>
            )}
            {app.distanceKm && (
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/40 font-medium inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{app.distanceKm} km</span>
              </span>
            )}
          </div>

          {/* Card Actions */}
          <div className="pt-3 border-t border-stone-100 dark:border-[#1E2638] flex items-center justify-between text-xs mt-auto">
            <span className="capitalize px-2.5 py-1 rounded bg-stone-100 text-stone-700 border border-stone-200 dark:bg-[#1C2433] dark:text-gray-300 dark:border-[#2A3447] font-medium">
              {app.status}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(app);
              }}
              className="text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 font-semibold flex items-center gap-1 px-2 py-1 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}