'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '@/lib/firebase'
import loginImage from '/assets/images/login.png'
import IconLogoLarge from '@/components/IconComponents/IconLogoLarge'
import Button from '@/components/DesignSystem/Button'

export default function LoginPage() {
  const router = useRouter()
  const [error, setError] = useState('')

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider)
      router.replace('/dashboard/overview')
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Google sign-in failed')
      }
    }
  }

  return (
    <main className="flex h-screen overflow-hidden background-beige-100 p-4 gap-10" aria-label="Login page">

      <aside className="hidden overflow-hidden items-center flex md:block md:w-2/5 rounded-xl relative" aria-hidden="true">
        <img
          src={loginImage.src}
          alt="login page hero"
          className="w-full h-full object-cover object-top rounded-xl"
        />

        <div className='absolute top-0 left-0 p-10 text-white h-full w-full flex flex-col justify-between'>
          <header>
            <IconLogoLarge/>
          </header>
          <section className="flex flex-col gap-6">
            <h1 className="text-preset-1 font-bold"
              style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}
            >
              Keep track of your money and save for your future
            </h1>
            <p className="text-preset-4"
              style={{ textShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)' }}
            >
              Personal finance app puts you in control of your spending. Track transactions, set budgets, and add to savings pots easily.
            </p>
          </section>
        </div>
      </aside>

      <section className="w-full md:w-3/5 flex items-center justify-center">
        <div className="bg-white p-8 flex flex-col gap-8 rounded-xl shadow-md w-full max-w-[560px]" aria-label="login form">
          <h2 className="text-preset-1 bold text-grey-900 text-center">Login</h2>

          {error && <p className="text-red-600 text-sm mb-3" role="alert">{error}</p>}

          <Button label='Sign in with Google' onButtonClick={handleGoogleLogin} />
        </div>
      </section>
    </main>
  )
}
