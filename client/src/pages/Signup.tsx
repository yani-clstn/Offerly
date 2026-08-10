import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signUp } from '../lib/auth-client'

export default function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

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
    <div className="mt-16 max-w-sm mx-auto">
      <h1 className="font-display text-xl text-navy mb-1">Create your account</h1>
      <p className="text-sm text-gray mb-6">Start tracking your job search.</p>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full bg-offwhite border border-[#DEDCD3] rounded-lg px-3 py-2 text-sm text-navy placeholder:text-gray focus:outline-none focus:border-terracotta"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          minLength={8}
        />
        {error && <p className="text-xs text-terracotta">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-navy text-offwhite text-sm font-medium px-4 py-2 rounded-lg hover:bg-terracotta transition-colors disabled:opacity-50"
        >
          {submitting ? 'Creating account...' : 'Sign up'}
        </button>
      </form>

      <p className="text-xs text-gray mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-terracotta hover:underline">Log in</Link>
      </p>
    </div>
  )
}