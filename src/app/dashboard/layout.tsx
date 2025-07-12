'use client'

import { ReactNode, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore'
import mockData from '@/data.json'

import Sidebar from '@/components/Sidebar'
import Page from '@/components/Page'
import FullscreenLoader from '@/components/FullscreenLoader'
import { DashboardProvider } from '@/contexts/DashboardContext'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { balance, transactions, budgets, pots } = mockData
  const router = useRouter()
  const pathname = usePathname()
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [loadingMessage, setLoadingMessage] = useState('Loading dashboard...')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingMessage('This is taking longer than usual...')
    }, 7000)

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        clearTimeout(timeout)
        router.replace('/login')
      } else {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
          await setDoc(userRef, balance)

          const seedCollection = async <T extends object>(name: string, data: T[]) => {
            const colRef = collection(userRef, name)
            for (const docData of data) {
              await addDoc(colRef, docData)
            }
          }

          await Promise.all([
            seedCollection('transactions', transactions),
            seedCollection('budgets', budgets),
            seedCollection('pots', pots),
          ])
        }

        clearTimeout(timeout)
        setUserId(user.uid)
        setCheckingAuth(false)
      }
    })

    return () => {
      clearTimeout(timeout)
      unsubscribe()
    }
  }, [router])

  if (checkingAuth || !userId) {
    return <FullscreenLoader message={loadingMessage} />
  }

  return (
    <DashboardProvider userId={userId}>
      <div className={'responsive-flex flex h-svh overflow-hidden flex-row'}>
        <Sidebar />
        <Page>{children}</Page>
      </div>
    </DashboardProvider>
  )
}
