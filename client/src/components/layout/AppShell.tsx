import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream font-body">
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display font-medium text-lg text-navy">Offerly</span>
        </Link>
        <Link
          to="/applications/new"
          className="bg-navy text-offwhite text-xs font-medium px-3 py-2 rounded-lg hover:bg-terracotta transition-colors"
        >
          New application
        </Link>
      </header>
      <main className="max-w-5xl mx-auto px-6 pb-12">
        {children}
      </main>
    </div>
  )
}