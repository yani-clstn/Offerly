import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth.js'
import { requireAuth } from './middleware/auth.js'
import type { Variables } from './types.js'

import applications from './routes/applications.js'
import notes from './routes/notes.js'
import documents from './routes/documents.js'
import analytics from './routes/analytics.js'
import statusLogs from './routes/statusLogs.js'
import interviews from './routes/interviews.js'
import experiences from './routes/experiences.js'

const app = new Hono<{ Variables: Variables }>()

app.use('/api/*', cors({
  origin: ['http://localhost:5173', 'https://offerly-job-tracker.vercel.app'],
  credentials: true,
}))

app.on(['POST', 'GET'], '/api/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

app.get('/api/health', (c) => c.json({ status: 'ok' }))

// Apply auth middleware to all protected routes
app.use('/api/applications/*', requireAuth)
app.use('/api/analytics/*', requireAuth)
app.use('/api/status-logs/*', requireAuth)
app.use('/api/interviews/*', requireAuth)
app.use('/api/experiences/*', requireAuth)

// Mount application sub-routes
app.route('/api/applications', applications)
app.route('/api/applications', notes)
app.route('/api/applications', documents)

// Mount standalone feature routers
app.route('/api/analytics', analytics)
app.route('/api/status-logs', statusLogs)
app.route('/api/interviews', interviews)
app.route('/api/experiences', experiences)

export default app