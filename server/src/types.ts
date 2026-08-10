import type { auth } from './lib/auth'

export type Variables = {
  user: typeof auth.$Infer.Session.user
}