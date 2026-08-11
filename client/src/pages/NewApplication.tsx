import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createApplication } from '../api/applications.ts'

export default function NewApplication() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jobPostingUrl, setJobPostingUrl] = useState('')
  const [location, setLocation] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const created = await createApplication({ company, role, jobPostingUrl, location })
      navigate(`/applications/${created.id}`)
    } catch {
      setSubmitting(false)
    }
  }

  return (
    <div className="mt-8 max-w-md">
      <h1 className="font-display text-xl text-navy mb-4">New application</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full bg-offwhite border border-border rounded-lg px-3 py-2 text-sm text-navy placeholder:text-gray focus:outline-none focus:border-terracotta"
          placeholder="Company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          required
        />
        <input
          className="w-full bg-offwhite border border-border rounded-lg px-3 py-2 text-sm text-navy placeholder:text-gray focus:outline-none focus:border-terracotta"
          placeholder="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        <input
          className="w-full bg-offwhite border border-border rounded-lg px-3 py-2 text-sm text-navy placeholder:text-gray focus:outline-none focus:border-terracotta"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          className="w-full bg-offwhite border border-border rounded-lg px-3 py-2 text-sm text-navy placeholder:text-gray focus:outline-none focus:border-terracotta"
          placeholder="Job posting URL"
          value={jobPostingUrl}
          onChange={(e) => setJobPostingUrl(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="bg-navy text-offwhite text-sm font-medium px-4 py-2 rounded-lg hover:bg-terracotta transition-colors disabled:opacity-50"
        >
          {submitting ? 'Adding...' : 'Add application'}
        </button>
      </form>
    </div>
  )
}