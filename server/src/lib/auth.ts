import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db/index.js'

const isProduction = process.env.NODE_ENV === 'production'

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  trustedOrigins: ['http://localhost:5173', 'https://offerly-job-tracker.vercel.app'],
  advanced: {
    defaultCookieAttributes: {
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      partitioned: isProduction,
    },
  },
})