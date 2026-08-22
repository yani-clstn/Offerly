import { Hono } from 'hono'
import { db } from '../db/index.js'
import { interviews, applications } from '../db/schema.js'
import { eq, gte, lte, and, asc } from 'drizzle-orm'
import type { Variables } from '../types.js'

const app = new Hono<{ Variables: Variables }>()

// GET /api/interviews — Fetch upcoming interviews for calendar view
app.get('/', async (c) => {
  const user = c.get('user')
  const start = c.req.query('start')
  const end = c.req.query('end')

  const results = await db
    .select({
      interview: interviews,
      company: applications.company,
      role: applications.role,
    })
    .from(interviews)
    .innerJoin(applications, eq(interviews.applicationId, applications.id))
    .where(
      and(
        eq(applications.userId, user.id),
        start ? gte(interviews.interviewDate, new Date(start)) : undefined,
        end ? lte(interviews.interviewDate, new Date(end)) : undefined
      )
    )
    .orderBy(asc(interviews.interviewDate))

  return c.json(results)
})

// POST /api/interviews — Schedule interview
app.post('/', async (c) => {
  const { applicationId, title, interviewDate, locationOrLink, notes } = await c.req.json()

  const [newInterview] = await db
    .insert(interviews)
    .values({
      applicationId,
      title,
      interviewDate: new Date(interviewDate),
      locationOrLink,
      notes,
    })
    .returning()

  return c.json(newInterview, 201)
})

export default app