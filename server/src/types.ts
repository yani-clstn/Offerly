import type { auth } from './lib/auth.js'

export type Variables = {
  user: typeof auth.$Infer.Session.user
}