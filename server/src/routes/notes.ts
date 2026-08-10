import { Hono } from 'hono'
import { db } from '../db'
import { notes } from '../db/schema'
import { eq } from 'drizzle-orm'
import type { Variables } from '../types'

const app = new Hono<{ Variables: Variables }>()

// POST /api/applications/:applicationId/notes
app.post('/:applicationId/notes', async (c) => {
  const applicationId = Number(c.req.param('applicationId'))
  const { content } = await c.req.json()

  if (!content) return c.json({ error: 'content is required' }, 400)

  const [newNote] = await db
    .insert(notes)
    .values({ applicationId, content })
    .returning()

  return c.json(newNote, 201)
})

// DELETE /api/applications/notes/:id
app.delete('/notes/:id', async (c) => {
  const id = Number(c.req.param('id'))

  const [deleted] = await db.delete(notes).where(eq(notes.id, id)).returning()

  if (!deleted) return c.json({ error: 'Note not found' }, 404)
  return c.json({ message: 'Deleted successfully' })
})

export default app