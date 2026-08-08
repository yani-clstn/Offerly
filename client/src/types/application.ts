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
  company: string
  role: string
  jobPostingUrl: string | null
  location: string | null
  workType: 'remote' | 'hybrid' | 'onsite' | null
  salaryMin: string | null
  salaryMax: string | null
  status: Status
  source: string | null
  appliedAt: string | null
  createdAt: string
  updatedAt: string
}