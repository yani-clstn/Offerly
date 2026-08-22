import React from 'react'
import { Pin, MapPin, Edit3 } from 'lucide-react'
import type { Application } from '../types/application'

interface ApplicationGridProps {
  applications: Application[]
  onEdit: (app: Application) => void
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
          className="group relative flex flex-col justify-between p-4 bg-[#141824] text-white rounded-2xl border border-slate-800/80 shadow-xs hover:border-slate-700 transition-all duration-200"
        >
          {/* Top Section: Company, Role & Quick Action Icons */}
          <div>
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

              {/* Top Right Action Icons */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => onTogglePin(app.id, !!app.isPinned)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    app.isPinned
                      ? 'text-amber-400 bg-amber-400/10'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                  }`}
                  title={app.isPinned ? 'Unpin application' : 'Pin application'}
                  aria-label={app.isPinned ? 'Unpin application' : 'Pin application'}
                >
                  <Pin className={`w-3.5 h-3.5 ${app.isPinned ? 'fill-current' : ''}`} />
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(app)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  title="Edit application"
                  aria-label="Edit application"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Middle Section: Location, Distance & Work Model Pills */}
            {(app.location || app.distanceKm !== undefined || app.workModel || app.employmentType) && (
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                {(app.location || app.distanceKm !== undefined) && (
                  <span className="inline-flex items-center gap-1.5 bg-[#1e2536] border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-medium">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {app.location}
                      {app.distanceKm !== undefined && app.distanceKm !== null && (
                        <span className="text-slate-400 ml-1">({app.distanceKm} km)</span>
                      )}
                    </span>
                  </span>
                )}

                {app.workModel && (
                  <span className="bg-[#1e2536] border border-slate-800 text-slate-300 px-2 py-1 rounded-md font-medium">
                    {app.workModel}
                  </span>
                )}

                {app.employmentType && (
                  <span className="bg-[#1e2536] border border-slate-800 text-slate-300 px-2 py-1 rounded-md font-medium">
                    {app.employmentType}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Bottom Footer: Status Badge & Edit Action */}
          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1e2536] border border-slate-700/60 text-slate-200 capitalize tracking-wide">
              {app.status?.replace('_', ' ')}
            </span>

            <button
              type="button"
              onClick={() => onEdit(app)}
              className="text-xs text-slate-400 hover:text-slate-100 font-medium transition-colors cursor-pointer"
            >
              Edit details
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}