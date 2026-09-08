import { Hono } from 'hono'
import { db } from '../db/index.js'
import { documents, applications } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'
import { r2, BUCKET } from '../lib/r2.js'
import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { Variables } from '../types.js'

const app = new Hono<{ Variables: Variables }>()

// paste-a-link doc
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

// real file upload
app.post('/:applicationId/documents/upload', async (c) => {
  const user = c.get('user')
  const applicationId = Number(c.req.param('applicationId'))

  const owned = await db.query.applications.findFirst({
    where: and(eq(applications.id, applicationId), eq(applications.userId, user.id)),
  })
  if (!owned) return c.json({ error: 'Application not found' }, 404)

  const body = await c.req.parseBody()
  const file = body['file']
  const type = body['type']
  const label = body['label']

  if (!(file instanceof File)) return c.json({ error: 'file is required' }, 400)
  if (typeof type !== 'string' || typeof label !== 'string') {
    return c.json({ error: 'type and label are required' }, 400)
  }
  if (file.type !== 'application/pdf') {
    return c.json({ error: 'only PDF files are allowed' }, 400)
  }
  if (file.size > 5 * 1024 * 1024) {
    return c.json({ error: 'file too large (max 5MB)' }, 400)
  }

  const path = `${user.id}/${applicationId}/${Date.now()}-${file.name}`
  const buffer = await file.arrayBuffer()

  await r2.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: path,
    Body: new Uint8Array(buffer),
    ContentType: file.type,
  }))

  const [newDoc] = await db
    .insert(documents)
    .values({ applicationId, type: type as any, label, storagePath: path })
    .returning()

  return c.json(newDoc, 201)
})

// fresh signed URL to view/download
app.get('/documents/:id/download', async (c) => {
  const user = c.get('user')
  const id = Number(c.req.param('id'))

  const doc = await db.query.documents.findFirst({ where: eq(documents.id, id) })
  if (!doc) return c.json({ error: 'Document not found' }, 404)

  const owned = await db.query.applications.findFirst({
    where: and(eq(applications.id, doc.applicationId), eq(applications.userId, user.id)),
  })
  if (!owned) return c.json({ error: 'Not found' }, 404)

  if (doc.url) return c.json({ url: doc.url })

  if (!doc.storagePath) return c.json({ error: 'No file attached' }, 404)

  const signedUrl = await getSignedUrl(
    r2,
    new GetObjectCommand({ Bucket: BUCKET, Key: doc.storagePath }),
    { expiresIn: 60 }
  )

  return c.json({ url: signedUrl })
})

app.delete('/documents/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const [deleted] = await db.delete(documents).where(eq(documents.id, id)).returning()
  if (!deleted) return c.json({ error: 'Document not found' }, 404)
  return c.json({ message: 'Deleted successfully' })
})

export default app