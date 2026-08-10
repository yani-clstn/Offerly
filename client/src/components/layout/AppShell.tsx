import type { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSession, signOut } from '../../lib/auth-client'
import ThemeToggle from '../ThemeToggle'

export default function AppShell({ children }: { children: ReactNode }) {
  const { data: session } = useSession()
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-cream font-body">
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img src="/icons/Offerly.svg" alt="Offerly logo" className="w-8 h-8" />
          <span className="font-display font-medium text-lg text-navy">Offerly</span>
        </Link>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          {session && (
            <>
              <Link
                to="/applications/new"
                className="bg-navy text-offwhite text-xs font-medium px-3 py-2 rounded-lg hover:bg-terracotta transition-colors"
              >
                New application
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs text-gray hover:text-terracotta transition-colors"
              >
                Log out
              </button>
            </>
          )}
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 pb-12">
        {children}
      </main>
    </div>
  )
}