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

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace('/login')
      } else {
        const userRef = doc(db, 'users', user.uid)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) {
          await setDoc(userRef, balance)

          const seedCollection = async (name: string, data: any[]) => {
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

        setUserId(user.uid)
        setCheckingAuth(false)
      }
    })

    return () => unsubscribe()
  }, [router])

  if (checkingAuth || !userId) {
    return <FullscreenLoader message="Loading dashboard..." />
  }

  return (
    <DashboardProvider userId={userId}>
      <div
        className={`responsive-flex flex h-screen overflow-hidden flex-row`}
      >
        <Sidebar />
        <Page>{children}</Page>
      </div>
    </DashboardProvider>
  )
}
