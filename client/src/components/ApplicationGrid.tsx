import React from 'react'
import { Pin, MapPin, Pencil, GripVertical } from 'lucide-react'

interface ApplicationGridProps {
  applications: Array<any>
  onEdit: (app: any) => void
  onTogglePin: (id: number, currentPinned: boolean) => void
}

// 1. Helper function for dynamic status colors
const getStatusCardStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'offer':
      return 'bg-emerald-950/20 border-emerald-800/50 hover:border-emerald-600'
    case 'interview':
    case 'phone_screen':
      return 'bg-amber-950/20 border-amber-800/50 hover:border-amber-600'
    case 'applied':
      return 'bg-[#121824] border-[#1E2638] hover:border-gray-700'
    default:
      return 'bg-[#121824] border-[#1E2638] hover:border-gray-700'
  }
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
          /* 2. Swapped static classes with dynamic status styles */
          className={`relative flex flex-col justify-between p-5 rounded-xl shadow-sm transition-all duration-200 ${getStatusCardStyles(
            app.status
          )}`}
        >
          {/* Card Header */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5 min-w-0">
                <button
                  type="button"
                  className="cursor-grab active:cursor-grabbing text-gray-500 hover:text-gray-300 p-0.5 -ml-1 rounded transition-colors shrink-0"
                  aria-label="Drag to reorder"
                >
                  <GripVertical className="w-4 h-4" />
                </button>

                <h3 className="font-bold text-lg text-white truncate">
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
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-[#1C2433] text-gray-400 hover:text-white border border-[#2A3447]'
                }`}
                aria-label={app.isPinned ? 'Unpin application' : 'Pin application'}
              >
                <Pin className={`w-3.5 h-3.5 ${app.isPinned ? 'fill-current' : ''}`} />
                <span>{app.isPinned ? 'Pinned' : 'Pin'}</span>
              </button>
            </div>
            <p className="text-sm font-medium text-gray-400 truncate mt-0.5 pl-5">
              {app.company}
            </p>
          </div>

          {/* Badges & Metadata */}
          <div className="my-4 flex flex-wrap gap-2 text-xs">
            {app.workModel && (
              <span className="px-2.5 py-1 rounded-md bg-[#1C2433] text-gray-300 font-medium border border-[#2A3447]">
                {app.workModel}
              </span>
            )}
            {app.employmentType && (
              <span className="px-2.5 py-1 rounded-md bg-blue-950/60 text-blue-400 border border-blue-800/40 font-medium">
                {app.employmentType}
              </span>
            )}
            {app.distanceKm && (
              <span className="px-2.5 py-1 rounded-md bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 font-medium inline-flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{app.distanceKm} km</span>
              </span>
            )}
          </div>

          {/* Card Actions */}
          <div className="pt-3 border-t border-[#1E2638] flex items-center justify-between text-xs mt-auto">
            <span className="capitalize px-2.5 py-1 rounded bg-[#1C2433] text-gray-300 border border-[#2A3447] font-medium">
              {app.status}
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(app);
              }}
              className="text-orange-400 hover:text-orange-300 font-semibold flex items-center gap-1 px-2 py-1 transition-colors"
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