import type { Status } from '../types/application'

const STATUSES: Status[] = [
  'wishlist', 'applied', 'phone_screen', 'interview', 'offer', 'accepted', 'rejected', 'withdrawn',
]

export type SortOption = 'newest' | 'oldest' | 'company'

export default function FilterBar({
  statusFilter,
  onStatusFilterChange,
  sortOption,
  onSortChange,
}: {
  statusFilter: Status | 'all'
  onStatusFilterChange: (status: Status | 'all') => void
  sortOption: SortOption
  onSortChange: (sort: SortOption) => void
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value as Status | 'all')}
        className="text-xs bg-offwhite border border-border rounded-lg px-2 py-1.5 text-navy focus:outline-none focus:border-terracotta"
      >
        <option value="all">All statuses</option>
        {STATUSES.map((s) => (
          <option key={s} value={s}>{s.replace('_', ' ')}</option>
        ))}
      </select>

      <select
        value={sortOption}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="text-xs bg-offwhite border border-border rounded-lg px-2 py-1.5 text-navy focus:outline-none focus:border-terracotta"
      >
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="company">Company (A–Z)</option>
      </select>
    </div>
  )
}