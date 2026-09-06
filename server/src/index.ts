import { serve } from '@hono/node-server'
import app from './app.js'

// Export app for Vercel serverless handler
export default app

// Run server locally when executed directly
if (process.env.NODE_ENV !== 'production') {
  const port = 3000
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
}