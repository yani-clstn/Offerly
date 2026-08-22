import { Hono } from 'hono'
import { db } from '../db/index.js'
import { applications } from '../db/schema.js'
import { eq, isNotNull, asc, and } from 'drizzle-orm'
import type { Variables } from '../types.js'

const app = new Hono<{ Variables: Variables }>()

app.get('/stage-durations', async (c) => {
  const user = c.get('user')

  const userApplications = await db.query.applications.findMany({
    where: eq(applications.userId, user.id),
    with: {
      statusHistory: { orderBy: (sh, { asc }) => [asc(sh.changedAt)] },
    },
  })

  const durationsByStatus: Record<string, number[]> = {}

  for (const app of userApplications) {
    const history = app.statusHistory
    for (let i = 0; i < history.length; i++) {
      const current = history[i]
      const next = history[i + 1]
      if (!next) continue // skip the current/ongoing stage — only count completed transitions

      const durationMs = new Date(next.changedAt).getTime() - new Date(current.changedAt).getTime()
      const durationDays = durationMs / (1000 * 60 * 60 * 24)

      if (!durationsByStatus[current.status]) durationsByStatus[current.status] = []
      durationsByStatus[current.status].push(durationDays)
    }
  }

  const result = Object.entries(durationsByStatus).map(([status, durations]) => ({
    status,
    avgDays: durations.reduce((sum, d) => sum + d, 0) / durations.length,
    count: durations.length,
  }))

  return c.json(result)
})

app.get('/location', async (c) => {
  const user = c.get('user')

  const locatedApps = await db
    .select({
      id: applications.id,
      company: applications.company,
      role: applications.role,
      location: applications.location,
      distanceKm: applications.distanceKm,
      status: applications.status,
    })
    .from(applications)
    .where(and(eq(applications.userId, user.id), isNotNull(applications.distanceKm)))
    .orderBy(asc(applications.distanceKm))

  const nearestJob = locatedApps.length > 0 ? locatedApps[0] : null
  
  // Safely parse distanceKm to number and pass 0 as initial value
  const totalDistance = locatedApps.reduce((sum, app) => {
    const dist = app.distanceKm ? Number(app.distanceKm) : 0
    return sum + dist
  }, 0)

  const avgDistance = locatedApps.length > 0 ? Math.round((totalDistance / locatedApps.length) * 10) / 10 : 0

  return c.json({
    nearestJob,
    totalLocatedJobs: locatedApps.length,
    averageDistanceKm: avgDistance,
  })
})

export default app