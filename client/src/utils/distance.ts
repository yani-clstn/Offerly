// Haversine formula to calculate distance between two lat/lng points in km
function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c * 10) / 10 // Round to 1 decimal place
}

// Geocode a text address to coordinates using OpenStreetMap Nominatim
export async function calculateDistanceToJob(
  userLat: number,
  userLng: number,
  jobLocation: string
): Promise<number | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(jobLocation)}`
    )
    const data = await res.json()
    if (!data || data.length === 0) return null

    const jobLat = parseFloat(data[0].lat)
    const jobLng = parseFloat(data[0].lon)

    return calculateHaversineDistance(userLat, userLng, jobLat, jobLng)
  } catch (error) {
    console.error('Error calculating distance:', error)
    return null
  }
}