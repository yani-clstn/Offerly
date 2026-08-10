import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signIn, useSession } from '../lib/auth-client'

export default function Login() {
  const navigate = useNavigate()
  const { data: session } = useSession()
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

    const { error: signInError } = await signIn.email({ email, password })

    if (signInError) {
      setError(signInError.message || 'Failed to sign in')
      setSubmitting(false)
      return
    }

    navigate('/')
  }

  return (
    <div className="mt-16 max-w-sm mx-auto">
      <h1 className="font-display text-xl text-navy mb-1">Welcome back</h1>
      <p className="text-sm text-gray mb-6">Log in to your Offerly account.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          className="w-full bg-offwhite border border-[#DEDCD3] rounded-lg px-3 py-2 text-sm text-navy placeholder:text-gray focus:outline-none focus:border-terracotta"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full bg-offwhite border border-[#DEDCD3] rounded-lg px-3 py-2 text-sm text-navy placeholder:text-gray focus:outline-none focus:border-terracotta"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-xs text-terracotta">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-navy text-offwhite text-sm font-medium px-4 py-2 rounded-lg hover:bg-terracotta transition-colors disabled:opacity-50"
        >
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className="text-xs text-gray mt-4">
        Don't have an account?{' '}
        <Link to="/signup" className="text-terracotta hover:underline">Sign up</Link>
      </p>
    </div>
  )
}