import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useSession } from '../lib/auth-client'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { data: session, isPending } = useSession()

  if (isPending) return <p className="text-gray text-sm mt-8">Loading...</p>
  if (!session) return <Navigate to="/login" replace />

  return <>{children}</>
}