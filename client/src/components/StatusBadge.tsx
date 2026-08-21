import type { Status } from '../types/application'

export const STATUS_STYLES: Record<Status, string> = {
  wishlist: 'bg-offwhite text-gray border border-border',
  applied: 'bg-offwhite text-navy border border-border',
  phone_screen: 'bg-cream text-terracotta border border-border',
  interview: 'bg-cream text-terracotta border border-border',
  offer: 'bg-navy text-cream border border-navy',
  accepted: 'bg-navy text-cream border border-navy',
  rejected: 'bg-offwhite text-gray/60 border border-border',
  withdrawn: 'bg-offwhite text-gray/60 border border-border',
}

export const STATUS_LABELS: Record<Status, string> = {
  wishlist: 'Wishlist',
  applied: 'Applied',
  phone_screen: 'Phone screen',
  interview: 'Interview',
  offer: 'Offer',
  accepted: 'Accepted',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
}

export default function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}