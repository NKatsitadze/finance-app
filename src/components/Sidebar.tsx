'use client'

import { useState } from 'react'
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
import IconLogoLarge from './IconComponents/IconLogoLarge'
import IconLogoSmall from './IconComponents/IconLogoSmall'
import IconMinimize from './IconComponents/IconMinimize'
import IconLogout from './IconComponents/IconLogout'

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
  const [isMinimized, setIsMinimized] = useState(false)

  const handleLogout = async () => {
    await signOut(auth)
    router.replace('/login')
  }

  const toggleSidebar = () => {
    setIsMinimized(prev => !prev)
  }

  return (
    <aside
      className={`
        ${styles['sidebar-background']}
        ${isMinimized ? 'w-20 pr-3' : 'w-60 pr-4'}
        bg-white shadow pt-10 pb-6 flex flex-col justify-between min-h-screen transition-all duration-300
      `}
    >
      <div className="h-full flex flex-col">
        <div className={`mb-6 px-8 pb-10`}>
          {isMinimized ? <IconLogoSmall /> : <IconLogoLarge />}
        </div>

        <nav className="space-y-2">
          {menuItems.map(({ label, href, Icon }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--beige-100)',
                        color: 'var(--grey-900)',
                        borderLeft: '4px solid var(--secondary-green)',
                      }
                    : { borderLeft: '4px solid transparent' }
                }
                className={`
                  ${styles['sidebar-menu-item']}
                  spacing-6 bold py-3 rounded-r-xl flex items-center gap-4 transition-all duration-200
                  ${isMinimized ? 'px-4 pl-6' : 'px-8'}
                `}
              >
                <div className='w-[20px] h-[20px]'>

                <Icon color={isActive ? 'var(--secondary-green)' : undefined} />
                </div>
                <span className='duration-200' style={isMinimized ? { opacity: 0, width: '0px' } : undefined}>{label}</span>
              </Link>
            )
          })}
        </nav>

        <div className={`mt-auto ${!isMinimized ? 'px-8' : 'pl-6'} py-4 flex flex-col gap-4 duration-200`}>
          <button
            className="flex items-center gap-4 pointer"
            onClick={toggleSidebar}
          >
            <div className={`w-[20px] h-[20px]`}>
              <IconMinimize />
            </div>
            <span className="text-preset-3 bold text-grey-300 whitespace-nowrap duration-200" 
            style={isMinimized ? { opacity: 0, width: '0px' } : undefined}>
              Minimize Menu
            </span>
          </button>

          <button
            className="flex items-center gap-4 pointer"
            onClick={handleLogout}
          >
            <div className={`w-[20px] h-[20px]`}>
              <IconLogout />
            </div>
            <span className="text-preset-3 bold text-grey-300 whitespace-nowrap duration-200" 
            style={isMinimized ? { opacity: 0, width: '0px' } : undefined}>
              Logout
            </span>
          </button>
        </div>
      </div>
    </aside>
  )
}
