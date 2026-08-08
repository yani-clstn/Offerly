import { Hono } from 'hono'
import { cors } from 'hono/cors'
import applications from './routes/applications'
import notes from './routes/notes'
import documents from './routes/documents'

const app = new Hono()

app.use('/api/*', cors({
  origin: ['http://localhost:5173', 'https://offerly.vercel.app'],
}))
app.get('/api/health', (c) => c.json({ status: 'ok' }))
app.route('/api/applications', applications)
app.route('/api/applications', notes)
app.route('/api/applications', documents)

export default app