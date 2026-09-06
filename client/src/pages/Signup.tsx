import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { signupSchema, type SignupInput } from '../lib/auth-schemas'
import { authClient } from '../lib/auth-client'

export default function Signup() {
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: SignupInput) => {
    setServerError(null)
    const { error } = await authClient.signUp.email({
      name: data.name,
      email: data.email,
      password: data.password,
    })

    if (error) {
      setServerError(error.message || 'Could not create account')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0d1117] text-white p-4">
      <div className="w-full max-w-sm p-6 bg-[#141824] border border-slate-800 rounded-2xl shadow-lg">
        <h2 className="text-xl font-bold text-center text-slate-100 mb-1">Create an account</h2>
        <p className="text-xs text-slate-400 text-center mb-6">Start tracking your applications with Offerly.</p>

        {serverError && (
          <div className="p-2.5 mb-4 text-xs text-terracotta bg-terracotta/10 border border-terracotta/20 rounded-lg">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
            <input
              {...register('name')}
              type="text"
              className="w-full px-3 py-2 text-sm bg-[#1e2536] border border-slate-700/80 rounded-lg text-slate-100 focus:outline-none focus:border-terracotta"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-terracotta">{errors.name.message}</p>
            )}
          </div>

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

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
            <input
              {...register('confirmPassword')}
              type="password"
              className="w-full px-3 py-2 text-sm bg-[#1e2536] border border-slate-700/80 rounded-lg text-slate-100 focus:outline-none focus:border-terracotta"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-terracotta">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 px-4 bg-terracotta hover:bg-terracotta/90 text-white font-medium text-sm rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
      </div>
    </div>
  )
}