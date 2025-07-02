'use client'

import styles from './Sidebar.module.css'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'

import IconOverview from './IconComponents/IconOverview'
import IconBudgets from './IconComponents/IconBudgets'
import IconRecurringBills from './IconComponents/IconRecurringBills'
import IconTransactions from './IconComponents/IconTransactions'
import IconPots from './IconComponents/IconPots'

const menuItems = [
  { label: 'Overview', href: '/dashboard/overview', Icon: IconOverview },
  { label: 'Transactions', href: '/dashboard/transactions', Icon: IconTransactions },
  { label: 'Budgets', href: '/dashboard/budgets', Icon: IconBudgets },
  { label: 'Pots', href: '/dashboard/pots', Icon: IconPots },
  { label: 'Recurring bills', href: '/dashboard/recurring-bills', Icon: IconRecurringBills },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut(auth)
    router.replace('/login')
  }

  return (
    <aside className={`${styles['sidebar-background']} w-60 bg-white shadow p-4 flex flex-col justify-between min-h-screen`}>
      <div>
        <h2 className={`${styles['sidebar-title']} text-xl font-bold mb-6`}>finance</h2>
        <nav className="space-y-2">
          {menuItems.map(({ label, href, Icon }) => (
            <Link
              key={href}
              href={href}
              style={pathname === href ? { backgroundColor: 'var(--beige-100)', color: 'var(--grey-900)' } : undefined}
              className={`${styles['sidebar-menu-item']} spacing-6 bold px-3 py-2 rounded`}
            >
              <Icon color={pathname === href ? 'var(--secondary-green)': undefined}/>
              {label}
            </Link>
          ))}
        </nav>
      </div>
        <button
        onClick={handleLogout}
        className="block w-full text-left px-3 py-2 rounded hover:bg-red-100 text-red-600"
        >
        Logout
        </button>
    </aside>
  )
}
