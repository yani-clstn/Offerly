export type ApplicationStatus =
  | 'wishlist'
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'accepted'
  | 'rejected'
  | 'withdrawn'

// Export Status as an alias so components importing Status don't break
export type Status = ApplicationStatus

export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'temporary'
  | 'internship'

export type WorkModel = 'onsite' | 'remote' | 'hybrid'

export type SalaryPeriod = 'hourly' | 'monthly' | 'yearly'

export interface Application {
  id: number
  userId: string
  company: string
  role: string
  jobPostingUrl?: string | null
  location?: string | null
  distanceKm?: number | null
  employmentType?: EmploymentType | null
  workModel?: WorkModel | null
  salaryMin?: number | null
  salaryMax?: number | null
  salaryPeriod?: SalaryPeriod | null
  currency?: string | null
  status: ApplicationStatus
  isPinned: boolean
  displayOrder: number
  isArchived: boolean
  source?: string | null
  appliedAt?: string | null
  followUpDate?: string | null
  createdAt: string
  updatedAt: string
}