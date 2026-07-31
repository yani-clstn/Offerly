import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import applications from './routes/applications'

const app = new Hono()

app.get('/api/health', (c) => c.json({ status: 'ok' }))
app.route('/api/applications', applications)

const port = 3000
serve({ fetch: app.fetch, port }, () => {
  console.log(`Server running on http://localhost:${port}`)
})