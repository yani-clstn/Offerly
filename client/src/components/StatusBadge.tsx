import type { Status } from '../types/application'

export const STATUS_STYLES: Record<Status, string> = {
  wishlist: 'bg-[#EDECE7] text-gray',
  applied: 'bg-[#EDECE7] text-gray',
  phone_screen: 'bg-[#F7E4D3] text-[#8A4A1F]',
  interview: 'bg-[#F7E4D3] text-[#8A4A1F]',
  offer: 'bg-navy text-offwhite',
  accepted: 'bg-navy text-offwhite',
  rejected: 'bg-[#EDECE7] text-[#9A9890]',
  withdrawn: 'bg-[#EDECE7] text-[#9A9890]',
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
    <span className={`text-xs px-2 py-1 rounded-full ${STATUS_STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}