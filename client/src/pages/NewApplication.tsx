import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createApplication } from '../api/applications.ts'

export default function NewApplication() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jobPostingUrl, setJobPostingUrl] = useState('')
  const [location, setLocation] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      const created = await createApplication({
        company: company.trim(),
        role: role.trim(),
        status: 'applied',
        jobPostingUrl: jobPostingUrl.trim() || undefined,
        location: location.trim() || undefined,
      })
      navigate(`/applications/${created.id}`)
    } catch {
      setError('Could not create application. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-8 max-w-xl mx-auto">
      <Link 
        to="/" 
        className="text-xs text-gray hover:text-terracotta transition-colors mb-4 inline-block"
      >
        &larr; Back to dashboard
      </Link>

      <div className="mb-6">
        <h1 className="font-display text-2xl text-navy">New application</h1>
        <p className="text-xs text-gray mt-1">Track a new job application and stay on top of your job hunt.</p>
      </div>

      <div className="bg-offwhite border border-border rounded-xl p-6 shadow-sm">
        {error && (
          <p className="text-xs text-terracotta bg-cream p-3 rounded-lg border border-border mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="company" className="block text-xs font-mono text-navy mb-1.5">
                Company <span className="text-terracotta">*</span>
              </label>
              <input
                id="company"
                className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-sm text-navy placeholder:text-gray/60 focus:outline-none focus:border-terracotta transition-colors"
                placeholder="e.g. Accenture"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-xs font-mono text-navy mb-1.5">
                Role <span className="text-terracotta">*</span>
              </label>
              <input
                id="role"
                className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-sm text-navy placeholder:text-gray/60 focus:outline-none focus:border-terracotta transition-colors"
                placeholder="e.g. Data Analyst"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-xs font-mono text-navy mb-1.5">
              Location
            </label>
            <input
              id="location"
              className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-sm text-navy placeholder:text-gray/60 focus:outline-none focus:border-terracotta transition-colors"
              placeholder="e.g. Makati, Metro Manila"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="jobPostingUrl" className="block text-xs font-mono text-navy mb-1.5">
              Job posting URL
            </label>
            <input
              id="jobPostingUrl"
              type="url"
              className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-sm text-navy placeholder:text-gray/60 focus:outline-none focus:border-terracotta transition-colors"
              placeholder="https://..."
              value={jobPostingUrl}
              onChange={(e) => setJobPostingUrl(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
            <Link
              to="/"
              className="text-xs text-gray hover:text-navy transition-colors px-3 py-2"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitting}
              className="bg-navy text-cream text-xs font-medium px-5 py-2 rounded-lg hover:bg-terracotta transition-colors disabled:opacity-50 cursor-pointer"
            >
              {submitting ? 'Adding...' : 'Add application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}