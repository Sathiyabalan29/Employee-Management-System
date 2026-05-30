import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LoginLeftSide from './LoginLeftSide'
import { ArrowLeftIcon, EyeIcon, EyeOffIcon, Loader2Icon } from 'lucide-react'


const LoginForm = ({role, title, subtitle}) => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false) 
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
  }
  
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <LoginLeftSide />
      <div className='flex-1 flex items-center justify-center p-6 sm:p-12 bg-white'> 
        <div className='w-full max-w-md animate-fade-in'>
        <Link to='/login' className='inline-flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm mb-10 transition-colors'>
          <ArrowLeftIcon size={16} />Back to portals
        </Link>

        <div className='mb-8'>
          <h1 className='text-2xl sm:text-3xl font-medium text-zinc-800'>{title}</h1>
          <p className='text-slate-500 text-sm sm:text-base mt-2'>{subtitle}</p>
        </div>
        {error && (
          <div className='mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700
          text-sm rounded-xl flex items-start gap-3'>
              <div className='w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0'/>
              {error}
          </div>
        )} 

        <form className='space-y-5' onSubmit={handleSubmit}>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Email address</label>
            <input
              type='email'
              value={email ?? ''}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder='name@example.com'
              className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100'
            />
          </div>

          <div>
            <label className='block text-sm font-medium text-slate-700 mb-2'>Password</label>
            <div className='relative'>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password ?? ''}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 placeholder:text-slate-400 shadow-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100'
                placeholder='.......'
              />
              <button
                type='button'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
              </button>
            </div>
            
          </div>

          <button
            type='submit'
            disabled={loading}
            className='flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:from-indigo-700 hover:to-indigo-600 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50'
          >
            {loading && <Loader2Icon className='mr-2 h-4 w-4 animate-spin' />}
            Sign in
          </button>

        </form>

      </div>
      </div>
      
    </div>
  )
}

export default LoginForm 