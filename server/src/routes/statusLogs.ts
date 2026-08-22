import { Hono } from 'hono'
import { db } from '../db/index.js'
import { statusHistory } from '../db/schema.js'
import { eq } from 'drizzle-orm'

const app = new Hono()

// PATCH /api/status-logs/:id — Modify existing status log
app.patch('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const { status, note, changedAt } = await c.req.json()

  const [updated] = await db
    .update(statusHistory)
    .set({
      ...(status && { status }),
      ...(note !== undefined && { note }),
      ...(changedAt && { changedAt: new Date(changedAt) }),
    })
    .where(eq(statusHistory.id, id))
    .returning()

  if (!updated) return c.json({ error: 'Log entry not found' }, 404)
  return c.json(updated)
})

// DELETE /api/status-logs/:id
app.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  await db.delete(statusHistory).where(eq(statusHistory.id, id))
  return c.json({ message: 'Log deleted' })
})

export default app