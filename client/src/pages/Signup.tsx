import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
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
    <div className="flex-1 flex flex-col items-center justify-center p-6">
      {/* Logo Image from public directory */}
      <div className="mb-4">
        <img
          src="/icons/Offerly.svg"
          alt="Offerly Logo"
          className="w-10 h-10 object-contain"
        />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
        Create your account
      </h1>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-8">
        Start tracking your job search.
      </p>

      {/* Form Card */}
      <div className="w-full max-w-105 bg-white dark:bg-[#141a23] border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 shadow-xl transition-colors">
        {serverError && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-600 dark:text-red-400">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs text-slate-700 dark:text-slate-400 mb-1.5 font-medium">
              Name
            </label>
            <input
              {...register('name')}
              type="text"
              placeholder="Your name"
              className="w-full bg-slate-50 dark:bg-[#0d121a] border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-terracotta/80 focus:ring-1 focus:ring-terracotta/80 transition-colors"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-terracotta">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-700 dark:text-slate-400 mb-1.5 font-medium">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              placeholder="you@example.com"
              className="w-full bg-slate-50 dark:bg-[#0d121a] border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-terracotta/80 focus:ring-1 focus:ring-terracotta/80 transition-colors"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-terracotta">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs text-slate-700 dark:text-slate-400 mb-1.5 font-medium">
              Password
            </label>
            <input
              {...register('password')}
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-50 dark:bg-[#0d121a] border border-slate-200 dark:border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:outline-none focus:border-terracotta/80 focus:ring-1 focus:ring-terracotta/80 transition-colors"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-terracotta">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-[#f4efea] dark:hover:bg-[#e8e2dc] text-white dark:text-slate-900 font-semibold text-sm rounded-lg transition-colors cursor-pointer"
          >
            {isSubmitting ? 'Creating account...' : 'Sign up'}
          </button>
        </form>
      </div>

      {/* Footer Link */}
      <p className="mt-6 text-xs text-slate-600 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="text-terracotta font-semibold hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}