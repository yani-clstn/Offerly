import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUp, useSession } from '../lib/auth-client'

export default function Signup() {
  const navigate = useNavigate()
  const { data: session } = useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (session) navigate('/')
  }, [session, navigate])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const { error: signUpError } = await signUp.email({ name, email, password })

    if (signUpError) {
      setError(signUpError.message || 'Failed to sign up')
      setSubmitting(false)
      return
    }

    navigate('/')
  }

  return (
    <div className="mt-20 max-w-sm mx-auto">
      <div className="text-center mb-8">
        <img src="/icons/Offerly.svg" alt="Offerly logo" className="w-10 h-10 mx-auto mb-3" />
        <h1 className="font-display text-2xl text-navy mb-1">Create your account</h1>
        <p className="text-sm text-gray">Start tracking your job search.</p>
      </div>

      <div className="bg-offwhite border border-border rounded-2xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-gray mb-1 block">Name</label>
            <input
              className="w-full bg-cream border border-border rounded-lg px-3 py-2.5 text-sm text-navy placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta transition-all"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray mb-1 block">Email</label>
            <input
              type="email"
              className="w-full bg-cream border border-border rounded-lg px-3 py-2.5 text-sm text-navy placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-xs text-gray mb-1 block">Password</label>
            <input
              type="password"
              className="w-full bg-cream border border-border rounded-lg px-3 py-2.5 text-sm text-navy placeholder:text-gray focus:outline-none focus:ring-2 focus:ring-terracotta/40 focus:border-terracotta transition-all"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
          </div>
          {error && (
            <p className="text-xs text-terracotta bg-terracotta/10 rounded-lg px-3 py-2">{error}</p>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-navy text-offwhite text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-terracotta transition-colors disabled:opacity-50 mt-1"
          >
            {submitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
      </div>

      <p className="text-xs text-gray mt-5 text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-terracotta hover:underline font-medium">Log in</Link>
      </p>
    </div>
  )
}   