import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { auth } from './lib/auth'
import { requireAuth } from './middleware/auth'
import type { Variables } from './types'
import applications from './routes/applications'
import notes from './routes/notes'
import documents from './routes/documents'

const app = new Hono<{ Variables: Variables }>()

app.use('/api/*', cors({
  origin: ['http://localhost:5173', 'https://offerly.vercel.app'],
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

export default app