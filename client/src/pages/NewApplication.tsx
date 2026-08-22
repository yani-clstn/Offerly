import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { createApplication } from '../api/applications.ts'

// Fetch Lat/Lng coordinates for a location string via Nominatim
async function getCoordinates(query: string): Promise<{ lat: number; lon: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`
    )
    const data = await res.json()
    if (!data || data.length === 0) return null
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) }
  } catch {
    return null
  }
}

// Fetch actual driving distance in km using Open-Source Routing Machine (OSRM)
async function getDrivingDistanceKm(
  start: { lat: number; lng: number },
  end: { lat: number; lon: number }
): Promise<number | null> {
  try {
    // OSRM expects coordinates in {longitude},{latitude} format
    const url = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lon},${end.lat}?overview=false`
    const res = await fetch(url)
    const data = await res.json()

    if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
      const distanceMeters = data.routes[0].distance
      const distanceKm = distanceMeters / 1000
      return Math.round(distanceKm * 10) / 10 // Round to 1 decimal place
    }
    return null
  } catch {
    return null
  }
}

export default function NewApplication() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [jobPostingUrl, setJobPostingUrl] = useState('')
  const [location, setLocation] = useState('')
  const [distanceKm, setDistanceKm] = useState('')
  const [employmentType, setEmploymentType] = useState('')
  const [workModel, setWorkModel] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Geolocation states
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [locatingUser, setLocatingUser] = useState(false)
  const [calculatingDistance, setCalculatingDistance] = useState(false)
  const [geoStatus, setGeoStatus] = useState<string | null>(null)

  // Fetch current user position
  function handleGetLocation() {
    if (!('geolocation' in navigator)) {
      setGeoStatus('Geolocation is not supported by your browser.')
      return
    }

    setLocatingUser(true)
    setGeoStatus(null)

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        setUserCoords(coords)
        setLocatingUser(false)
        setGeoStatus('Location saved!')

        if (location.trim()) {
          computeDistance(coords, location.trim())
        }
      },
      () => {
        setLocatingUser(false)
        setGeoStatus('Permission denied or position unavailable.')
      },
      { timeout: 10000 }
    )
  }

  // Geocode location string and fetch actual OSRM driving distance
  async function computeDistance(coords: { lat: number; lng: number }, destination: string) {
    if (!destination) return
    setCalculatingDistance(true)

    try {
      const targetCoords = await getCoordinates(destination)
      if (targetCoords) {
        const realRoadDistance = await getDrivingDistanceKm(coords, targetCoords)
        if (realRoadDistance !== null) {
          setDistanceKm(String(realRoadDistance))
        }
      }
    } catch {
      // Graceful fallback to manual entry if request fails
    } finally {
      setCalculatingDistance(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    // Ensure URL has a protocol if user entered a raw domain (e.g., linkedin.com)
    let formattedUrl = jobPostingUrl.trim()
    if (formattedUrl && !/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = `https://${formattedUrl}`
    }

    // Safely parse numeric distance
    const parsedDistance = distanceKm ? parseFloat(distanceKm) : undefined

    try {
      const created = await createApplication({
        company: company.trim(),
        role: role.trim(),
        status: 'applied',
        jobPostingUrl: formattedUrl || undefined,
        location: location.trim() || undefined,
        distanceKm: parsedDistance && !isNaN(parsedDistance) ? parsedDistance : undefined,
        employmentType: employmentType ? (employmentType as any) : undefined,
        workModel: workModel ? (workModel as any) : undefined,
      })
      navigate(`/applications/${created.id}`)
    } catch (err: any) {
      setError(err?.message || 'Could not create application. Please try again.')
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="location" className="block text-xs font-mono text-navy">
                  Location
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locatingUser}
                  className="inline-flex items-center gap-1 text-[10px] text-terracotta hover:underline disabled:opacity-50 cursor-pointer"
                >
                  <MapPin className="w-3 h-3" />
                  {locatingUser ? 'Locating...' : 'Use my location'}
                </button>
              </div>
              <input
                id="location"
                className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-sm text-navy placeholder:text-gray/60 focus:outline-none focus:border-terracotta transition-colors"
                placeholder="e.g. Makati, Metro Manila"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onBlur={() => {
                  if (userCoords && location.trim()) {
                    computeDistance(userCoords, location.trim())
                  }
                }}
              />
              {geoStatus && <p className="text-[10px] text-gray mt-1">{geoStatus}</p>}
            </div>

            <div>
              <label htmlFor="distanceKm" className="block text-xs font-mono text-navy mb-1.5">
                Distance (km) {calculatingDistance && <span className="text-[10px] text-terracotta">(Calculating...)</span>}
              </label>
              <input
                id="distanceKm"
                type="number"
                step="0.1"
                min="0"
                className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-sm text-navy placeholder:text-gray/60 focus:outline-none focus:border-terracotta transition-colors"
                placeholder="e.g. 12.5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="employmentType" className="block text-xs font-mono text-navy mb-1.5">
                Employment Type
              </label>
              <select
                id="employmentType"
                className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:border-terracotta transition-colors"
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
              >
                <option value="">Select arrangement</option>
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract / Freelance</option>
                <option value="temporary">Temporary / Seasonal</option>
                <option value="internship">Internship</option>
              </select>
            </div>

            <div>
              <label htmlFor="workModel" className="block text-xs font-mono text-navy mb-1.5">
                Work Model
              </label>
              <select
                id="workModel"
                className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-sm text-navy focus:outline-none focus:border-terracotta transition-colors"
                value={workModel}
                onChange={(e) => setWorkModel(e.target.value)}
              >
                <option value="">Select model</option>
                <option value="onsite">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
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