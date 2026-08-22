import { Hono } from 'hono'
import { db } from '../db/index.js'
import { workExperiences } from '../db/schema.js'
import { eq, desc, and } from 'drizzle-orm'
import type { Variables } from '../types.js'

const app = new Hono<{ Variables: Variables }>()

// GET /api/experiences
app.get('/', async (c) => {
  const user = c.get('user')
  const list = await db
    .select()
    .from(workExperiences)
    .where(eq(workExperiences.userId, user.id))
    .orderBy(desc(workExperiences.startDate))

  return c.json(list)
})

// POST /api/experiences
app.post('/', async (c) => {
  const user = c.get('user')
  const { company, role, employmentType, startDate, endDate, description } = await c.req.json()

  const [created] = await db
    .insert(workExperiences)
    .values({
      userId: user.id,
      company,
      role,
      employmentType,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      description,
    })
    .returning()

  return c.json(created, 201)
})

export default app