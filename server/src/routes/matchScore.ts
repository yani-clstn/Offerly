import { Hono } from 'hono'
import { db } from '../db/index.js'
import { documents, applications } from '../db/schema.js'
import { eq, and } from 'drizzle-orm'
import { r2, BUCKET } from '../lib/r2.js'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { gemini, matchScoreSchema } from '../lib/gemini.js'
// @ts-ignore — pdf-parse subpath has no types; workaround for a Vercel-bundling bug in the main entry
import pdfParse from 'pdf-parse/lib/pdf-parse.js'
import type { Variables } from '../types.js'

const app = new Hono<{ Variables: Variables }>()

app.post('/:applicationId/match-score', async (c) => {
  const user = c.get('user')
  const applicationId = Number(c.req.param('applicationId'))
  const { jobDescription, documentId } = await c.req.json()

  if (!jobDescription || !documentId) {
    return c.json({ error: 'jobDescription and documentId are required' }, 400)
  }

  const owned = await db.query.applications.findFirst({
    where: and(eq(applications.id, applicationId), eq(applications.userId, user.id)),
  })
  if (!owned) return c.json({ error: 'Application not found' }, 404)

  const doc = await db.query.documents.findFirst({ where: eq(documents.id, documentId) })
  if (!doc || !doc.storagePath) return c.json({ error: 'Resume file not found' }, 404)

  const obj = await r2.send(new GetObjectCommand({ Bucket: BUCKET, Key: doc.storagePath }))
  const buffer = Buffer.from(await obj.Body!.transformToByteArray())

  const { text: resumeText } = await pdfParse(buffer)

  const prompt = `Compare this resume against the job description. Give a fit score 0-100, list matching skills/keywords, missing skills/keywords the job wants but the resume lacks, and a short summary.

RESUME:
${resumeText.slice(0, 8000)}

JOB DESCRIPTION:
${jobDescription.slice(0, 4000)}`

  const response = await gemini.models.generateContent({
    model: 'gemini-flash-latest',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: matchScoreSchema,
    },
  })

  const result = JSON.parse(response.text ?? '{}')
  return c.json(result)
})

export default app