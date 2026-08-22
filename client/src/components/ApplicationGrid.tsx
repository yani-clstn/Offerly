import React from 'react'
import { Pin, MapPin, Edit3 } from 'lucide-react'

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {applications.map((app) => (
        <div
          key={app.id}
          className="group relative flex flex-col justify-between p-4 bg-[#12161f] border border-slate-800/80 rounded-2xl hover:border-slate-700 transition-all duration-200"
        >
          {/* Top Row: Company, Role & Pin/Edit Actions */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base text-slate-100 truncate">
                  {app.company}
                </h3>
                {app.isPinned && (
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                )}
              </div>
              <p className="text-sm text-slate-400 truncate mt-0.5">
                {app.role}
              </p>
            </div>

            {/* Top Right Action Controls */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onTogglePin(app.id, app.isPinned)}
                className={`p-1.5 rounded-lg transition-colors ${
                  app.isPinned
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/60'
                }`}
                title={app.isPinned ? 'Unpin' : 'Pin'}
                aria-label={app.isPinned ? 'Unpin application' : 'Pin application'}
              >
                <Pin className={`w-3.5 h-3.5 ${app.isPinned ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => onEdit(app)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/60 transition-colors"
                title="Edit Details"
                aria-label="Edit Details"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Details & Location Bar */}
          {(app.location || app.distanceKm || app.workModel || app.employmentType) && (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
              {(app.location || app.distanceKm !== undefined) && (
                <span className="flex items-center gap-1 bg-slate-800/40 border border-slate-800 px-2 py-0.5 rounded-md text-slate-300">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  {app.location && <span>{app.location}</span>}
                  {app.distanceKm !== undefined && (
                    <span className="text-slate-400">({app.distanceKm} km)</span>
                  )}
                </span>
              )}

              {app.workModel && (
                <span className="bg-slate-800/40 border border-slate-800 px-2 py-0.5 rounded-md text-slate-300">
                  {app.workModel}
                </span>
              )}

              {app.employmentType && (
                <span className="bg-slate-800/40 border border-slate-800 px-2 py-0.5 rounded-md text-slate-300">
                  {app.employmentType}
                </span>
              )}
            </div>
          )}

          {/* Bottom Status Badge */}
          <div className="mt-3 pt-2.5 border-t border-slate-800/40 flex items-center justify-between">
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-200 capitalize">
              {app.status}
            </span>

            <button
              onClick={() => onEdit(app)}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors font-medium"
            >
              Edit details
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}