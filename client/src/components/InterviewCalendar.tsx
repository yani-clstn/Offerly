import React from 'react'

interface Interview {
  id: number
  title: string
  company: string
  role: string
  interviewDate: string
  locationOrLink?: string
}

export const InterviewCalendar: React.FC<{ interviews: Interview[] }> = ({ interviews }) => {
  return (
    <div className="w-full bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
      {/* Mobile Agenda View (<640px) */}
      <div className="block sm:hidden">
        <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-3">
          Upcoming Schedule Agenda
        </h2>
        {interviews.length === 0 ? (
          <p className="text-sm text-zinc-500 py-4 text-center">No scheduled interviews found.</p>
        ) : (
          <div className="space-y-3">
            {interviews.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/50"
              >
                <div className="flex justify-between items-start">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                    {new Date(item.interviewDate).toLocaleDateString([], {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400">{item.company}</span>
                </div>
                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 mt-1">
                  {item.title} — {item.role}
                </p>
                {item.locationOrLink && (
                  <a
                    href={item.locationOrLink}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-blue-500 underline truncate block mt-1"
                  >
                    {item.locationOrLink}
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Monthly Grid View (>=640px) */}
      <div className="hidden sm:block">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">
            Interview Calendar
          </h2>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-zinc-500 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-1">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 min-h-[320px]">
          {Array.from({ length: 35 }).map((_, idx) => {
            const dayNum = idx + 1
            const hasInterview = interviews.some(
              (i) => new Date(i.interviewDate).getDate() === dayNum
            )

            return (
              <div
                key={idx}
                className={`p-2 border rounded-lg flex flex-col justify-between text-xs transition-colors ${
                  hasInterview
                    ? 'bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800'
                    : 'border-zinc-100 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/40'
                }`}
              >
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {dayNum <= 31 ? dayNum : ''}
                </span>
                {hasInterview && dayNum <= 31 && (
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600 self-end"></span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}