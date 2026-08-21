import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth.js'
import { requireAuth } from './middleware/auth.js'
import type { Variables } from './types.js'
import applications from './routes/applications.js'
import notes from './routes/notes.js'
import documents from './routes/documents.js'
import analytics from './routes/analytics.js'

const app = new Hono<{ Variables: Variables }>()

app.use('/api/*', cors({
  origin: ['http://localhost:5173', 'https://offerly-job-tracker.vercel.app'],
  credentials: true,
}))

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

app.get('/api/health', (c) => c.json({ status: 'ok' }))

app.use('/api/applications/*', requireAuth)
app.route('/api/applications', applications)
app.route('/api/applications', notes)
app.route('/api/applications', documents)
app.route('/api/applications', analytics)

export default app