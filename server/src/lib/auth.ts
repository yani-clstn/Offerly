import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from '../db/index.js'

const isProduction = process.env.NODE_ENV === 'production'
const normalizeOrigin = (value: string) => value.trim().replace(/\/+$/, '')

const trustedOrigins = Array.from(
  new Set(
    [
      'http://localhost:5173',
      'https://offerly-job-tracker.vercel.app',
      process.env.FRONTEND_ORIGIN,
      ...(process.env.FRONTEND_ORIGINS?.split(',') ?? []),
    ]
      .filter((origin): origin is string => Boolean(origin))
      .map(normalizeOrigin)
  )
)

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'https://offerly-server.vercel.app',
  database: drizzleAdapter(db, { provider: 'pg' }),
  emailAndPassword: { enabled: true, requireEmailVerification: false },
  trustedOrigins,
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
    },
    defaultCookieAttributes: {
      sameSite: isProduction ? 'none' : 'lax',
      secure: isProduction,
      partitioned: isProduction,
    },
  },
})