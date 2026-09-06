import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginInput } from '../lib/auth-schemas'
import { authClient } from '../lib/auth-client'

export default function Login() {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (data: LoginInput) => {
    setServerError(null)
    const { error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setServerError(error.message || 'Invalid credentials')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1117] text-white p-4">
      <div className="w-full max-full max-w-sm p-6 bg-[#141824] border border-slate-800 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-center text-slate-100 mb-1">Welcome back</h2>
        <p className="text-xs text-slate-400 text-center mb-6">Log in to your Offerly account.</p>

        {serverError && (
          <div className="p-2.5 mb-4 text-xs text-terracotta bg-terracotta/10 border border-terracotta/20 rounded-lg">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full px-3 py-2 text-sm bg-[#1e2536] border border-slate-700/80 rounded-lg text-slate-100 focus:outline-none focus:border-terracotta"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-terracotta">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-3 py-2 text-sm bg-[#1e2536] border border-slate-700/80 rounded-lg text-slate-100 focus:outline-none focus:border-terracotta"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-terracotta">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-terracotta hover:bg-terracotta/90 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  )
}