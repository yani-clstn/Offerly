import { Hono } from 'hono'
import { db } from '../db/index.js'
import { applications, statusHistory } from '../db/schema.js'
import { eq, desc, and } from 'drizzle-orm'
import type { Variables } from '../types.js'

const app = new Hono<{ Variables: Variables }>()

// GET /api/applications — list all applications for the logged-in user
app.get('/', async (c) => {
  const user = c.get('user')
  const allApplications = await db
    .select()
    .from(applications)
    .where(eq(applications.userId, user.id))
    .orderBy(desc(applications.createdAt))

  return c.json(allApplications)
})

// GET /api/applications/:id — get one application with relations
app.get('/:id', async (c) => {
  const user = c.get('user')
  const id = Number(c.req.param('id'))

  const application = await db.query.applications.findFirst({
    where: and(eq(applications.id, id), eq(applications.userId, user.id)),
    with: {
      statusHistory: { orderBy: (sh, { desc }) => [desc(sh.changedAt)] },
      notes: { orderBy: (n, { desc }) => [desc(n.createdAt)] },
      documents: true,
    },
  })

  if (!application) {
    return c.json({ error: 'Application not found' }, 404)
  }

  return c.json(application)
})

// POST /api/applications — create a new application
app.post('/', async (c) => {
  const user = c.get('user')
  const body = await c.req.json()

  const {
    company,
    role,
    jobPostingUrl,
    location,
    distanceKm,
    employmentType,
    workModel,
    salaryMin,
    salaryMax,
    source,
    appliedAt,
    status,
  } = body

  if (!company || !role) {
    return c.json({ error: 'company and role are required' }, 400)
  }

  const initialStatus = status || 'wishlist'

  const [newApplication] = await db
    .insert(applications)
    .values({
      userId: user.id,
      company,
      role,
      jobPostingUrl: jobPostingUrl || null,
      location: location || null,
      distanceKm: distanceKm !== undefined && distanceKm !== null ? String(distanceKm) : null,
      employmentType: employmentType || null,
      workModel: workModel || null,
      salaryMin: salaryMin !== undefined && salaryMin !== null ? String(salaryMin) : null,
      salaryMax: salaryMax !== undefined && salaryMax !== null ? String(salaryMax) : null,
      source: source || null,
      appliedAt: appliedAt ? new Date(appliedAt) : null,
      status: initialStatus,
    })
    .returning()

  await db.insert(statusHistory).values({
    applicationId: newApplication.id,
    status: initialStatus,
  })

  return c.json(newApplication, 201)
})

// PATCH /api/applications/:id — update application fields
app.patch('/:id', async (c) => {
  const user = c.get('user')
  const id = Number(c.req.param('id'))
  const body = await c.req.json()

  const {
    company,
    role,
    jobPostingUrl,
    location,
    distanceKm,
    employmentType,
    workModel,
    salaryMin,
    salaryMax,
    source,
    appliedAt,
    followUpDate,
    status,
  } = body

  const updateData: Record<string, any> = {
    updatedAt: new Date(),
  }

  if (company !== undefined) updateData.company = company
  if (role !== undefined) updateData.role = role
  if (jobPostingUrl !== undefined) updateData.jobPostingUrl = jobPostingUrl
  if (location !== undefined) updateData.location = location
  if (distanceKm !== undefined) updateData.distanceKm = distanceKm !== null ? String(distanceKm) : null
  if (employmentType !== undefined) updateData.employmentType = employmentType
  if (workModel !== undefined) updateData.workModel = workModel
  if (salaryMin !== undefined) updateData.salaryMin = salaryMin !== null ? String(salaryMin) : null
  if (salaryMax !== undefined) updateData.salaryMax = salaryMax !== null ? String(salaryMax) : null
  if (source !== undefined) updateData.source = source
  if (status !== undefined) updateData.status = status
  if (appliedAt !== undefined) updateData.appliedAt = appliedAt ? new Date(appliedAt) : null
  if (followUpDate !== undefined) updateData.followUpDate = followUpDate ? new Date(followUpDate) : null

  const [updated] = await db
    .update(applications)
    .set(updateData)
    .where(and(eq(applications.id, id), eq(applications.userId, user.id)))
    .returning()

  if (!updated) {
    return c.json({ error: 'Application not found' }, 404)
  }

  return c.json(updated)
})

// PATCH /api/applications/:id/status — update status + log to history
app.patch('/:id/status', async (c) => {
  const user = c.get('user')
  const id = Number(c.req.param('id'))
  const { status, note } = await c.req.json()

  if (!status) {
    return c.json({ error: 'status is required' }, 400)
  }

  const [updated] = await db
    .update(applications)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(applications.id, id), eq(applications.userId, user.id)))
    .returning()

  if (!updated) {
    return c.json({ error: 'Application not found' }, 404)
  }

  await db.insert(statusHistory).values({
    applicationId: id,
    status,
    note,
  })

  return c.json(updated)
})

// DELETE /api/applications/:id
app.delete('/:id', async (c) => {
  const user = c.get('user')
  const id = Number(c.req.param('id'))

  const [deleted] = await db
    .delete(applications)
    .where(and(eq(applications.id, id), eq(applications.userId, user.id)))
    .returning()

  if (!deleted) {
    return c.json({ error: 'Application not found' }, 404)
  }

  return c.json({ message: 'Deleted successfully' })
})

export default app