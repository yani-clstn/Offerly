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

  const { company, role, jobPostingUrl, location, workType, salaryMin, salaryMax, source, appliedAt } = body

  if (!company || !role) {
    return c.json({ error: 'company and role are required' }, 400)
  }

  const [newApplication] = await db
    .insert(applications)
    .values({
      userId: user.id,
      company,
      role,
      jobPostingUrl,
      location,
      workType,
      salaryMin,
      salaryMax,
      source,
      appliedAt: appliedAt ? new Date(appliedAt) : undefined,
      status: 'wishlist',
    })
    .returning()

  await db.insert(statusHistory).values({
    applicationId: newApplication.id,
    status: 'wishlist',
  })

  return c.json(newApplication, 201)
})

// PATCH /api/applications/:id — update application fields
app.patch('/:id', async (c) => {
  const user = c.get('user')
  const id = Number(c.req.param('id'))
  const body = await c.req.json()

  const [updated] = await db
    .update(applications)
    .set({ ...body, updatedAt: new Date() })
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