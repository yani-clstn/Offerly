export type Status =
  | 'wishlist'
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'

export interface Application {
  id: number
  userId: string
  company: string
  role: string
  jobPostingUrl?: string | null
  location?: string | null
  salaryMin?: number | null
  salaryMax?: number | null
  salaryPeriod?: 'hourly' | 'monthly' | 'yearly' | null
  currency?: string | null
  status: Status
  source?: string | null
  appliedAt?: string | null
  followUpDate?: string | null
  createdAt: string
  updatedAt: string
}