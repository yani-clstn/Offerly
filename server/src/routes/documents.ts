import { Hono } from 'hono'
import { db } from '../db/index.js'
import { documents } from '../db/schema.js'
import { eq } from 'drizzle-orm'
import type { Variables } from '../types.js'

const app = new Hono<{ Variables: Variables }>()

// POST /api/applications/:applicationId/documents
app.post('/:applicationId/documents', async (c) => {
  const applicationId = Number(c.req.param('applicationId'))
  const { type, label, url } = await c.req.json()

  if (!type || !label || !url) {
    return c.json({ error: 'type, label, and url are required' }, 400)
  }

  const [newDoc] = await db
    .insert(documents)
    .values({ applicationId, type, label, url })
    .returning()

  return c.json(newDoc, 201)
})

// DELETE /api/applications/documents/:id
app.delete('/documents/:id', async (c) => {
  const id = Number(c.req.param('id'))

  const [deleted] = await db.delete(documents).where(eq(documents.id, id)).returning()

  if (!deleted) return c.json({ error: 'Document not found' }, 404)
  return c.json({ message: 'Deleted successfully' })
})

export default app