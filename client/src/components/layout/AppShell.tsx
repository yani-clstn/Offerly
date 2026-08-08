import type { ReactNode } from 'react'

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream font-body">
      <header className="flex items-center justify-between px-6 py-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-2">
          <span className="font-display font-medium text-lg text-navy">Offerly</span>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 pb-12">
        {children}
      </main>
    </div>
  )
}