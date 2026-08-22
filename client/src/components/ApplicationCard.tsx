import React from 'react'
import { Pin, MapPin, Edit3 } from 'lucide-react'
import type { Application } from '../types/application'

interface ApplicationCardProps {
  application: Application
  onEdit?: (app: Application) => void
  onTogglePin?: (id: number, currentPinned: boolean) => void
}

export const ApplicationCard: React.FC<ApplicationCardProps> = ({
  application,
  onEdit,
  onTogglePin,
}) => {
  const isPinned = application.isPinned ?? false

  return (
    <div className="group relative flex flex-col justify-between p-4 bg-[#141824] text-white rounded-2xl border border-slate-800/80 shadow-xs hover:border-slate-700 transition-all duration-200">
      {/* Top Section: Title & Controls */}
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-base text-slate-100 truncate">
                {application.company}
              </h3>
              {isPinned && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
              )}
            </div>
            <p className="text-sm text-slate-400 truncate mt-0.5">
              {application.role}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1 shrink-0">
            {onTogglePin && (
              <button
                type="button"
                onClick={() => onTogglePin(application.id, isPinned)}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isPinned
                    ? 'text-amber-400 bg-amber-400/10'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
                }`}
                title={isPinned ? 'Unpin' : 'Pin'}
                aria-label={isPinned ? 'Unpin application' : 'Pin application'}
              >
                <Pin className={`w-3.5 h-3.5 ${isPinned ? 'fill-current' : ''}`} />
              </button>
            )}

            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(application)}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800/50 transition-colors cursor-pointer"
                title="Edit application"
                aria-label="Edit application"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Location & Employment Info */}
        {(application.location || application.distanceKm !== undefined || application.workModel || application.employmentType) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
            {(application.location || application.distanceKm !== undefined) && (
              <span className="inline-flex items-center gap-1.5 bg-[#1e2536] border border-slate-800 text-slate-300 px-2.5 py-1 rounded-md font-medium">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">
                  {application.location}
                  {application.distanceKm !== undefined && application.distanceKm !== null && (
                    <span className="text-slate-400 ml-1">({application.distanceKm} km)</span>
                  )}
                </span>
              </span>
            )}

            {application.workModel && (
              <span className="bg-[#1e2536] border border-slate-800 text-slate-300 px-2 py-1 rounded-md font-medium">
                {application.workModel}
              </span>
            )}

            {application.employmentType && (
              <span className="bg-[#1e2536] border border-slate-800 text-slate-300 px-2 py-1 rounded-md font-medium">
                {application.employmentType}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer: Status Badge & Edit Link */}
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#1e2536] border border-slate-700/60 text-slate-200 capitalize tracking-wide">
          {application.status?.replace('_', ' ')}
        </span>

        {onEdit && (
          <button
            type="button"
            onClick={() => onEdit(application)}
            className="text-xs text-slate-400 hover:text-slate-100 font-medium transition-colors cursor-pointer"
          >
            Edit details
          </button>
        )}
      </div>
    </div>
  )
}

export default ApplicationCard