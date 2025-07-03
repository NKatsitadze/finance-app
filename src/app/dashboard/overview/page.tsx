'use client'
import { useState, useEffect } from 'react'
import { useDashboardData } from '@/contexts/DashboardContext'
import { useRouter, usePathname } from 'next/navigation'
import Header from '@/components/Header'
import BalanceCard from '@/components/overviews/BalanceCard'
import OverviewCard from '@/components/overviews/OverviewCard'
import IconPotsBig from '@/components/IconComponents/IconPotsBig'
import BudgetsChart from '@/components/Chart'
import OverlaySpinner from '@/components/OverlayScreenSpinner'
import { getRecurringBills } from '@/utils/getRecurringBills'
import { getBalanceCardDetails } from '@/utils/overview/getBalanceCardDetails'
import { getRecurringBillsOverview } from '@/utils/overview/getRecurringBillsOverview'
import { OverviewTransactions } from '@/components/overviews/OverviewTransactions'

export default function Home() {
  const [showSpinner, setShowSpinner] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const data = useDashboardData()
  const { balance, transactions, budgets, pots } = data

  const balanceCards = getBalanceCardDetails(balance)

  const totalSaves = pots.reduce((sum, pot) => sum + pot.total, 0)

  const potsDetails = pots.map(pot => ({
    label: pot.name,
    amount: `$${pot.total}`,
    color: pot.theme,
    key: pot.name.toLowerCase()
  })).slice(0, 4)

  const budgetsDetails = budgets.map(budget => ({
    label: budget.category,
    amount: `$${budget.maximum}`,
    color: budget.theme,
    key: budget.category.toLowerCase()
  })).slice(0, 4)

  const budgetsChartDetails = budgets.map(budget => ({
    name: budget.category,
    value: budget.maximum
  }))

  const budgetsChartColors = budgets.map(budget => budget.theme)

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const slicedSortedTransactions = sortedTransactions.slice(0, 5)
  const recurringBills = getRecurringBills(transactions)
  const recurringBillsOverview = getRecurringBillsOverview(recurringBills)

  const basePath = pathname.split('/').slice(0, -1).join('/')
  const changePage = (url: string) => {
    router.push(`${basePath}${url}`)
  }

  useEffect(() => {
  if (balance.current !== 0) {
    setShowSpinner(false)
  }
}, [balance.current])

  return (
    <>
      <Header title="Overview" />

      <main className="flex flex-col gap-8" aria-label="Financial overview dashboard">
        {showSpinner && <OverlaySpinner />}
        {/* Balance Cards */}
        <section
          className="flex gap-6 shrink justify-between"
          aria-label="Balance cards section"
        >
          {balanceCards.map(({ key, ...rest }) => (
            <BalanceCard key={key} {...rest} />
          ))}
        </section>

        {/* Overview Main Grid */}
        <section
          className="grid grid-cols-[11fr_9fr] gap-6"
          aria-label="Detailed overview sections"
        >
          {/* Left Column: Pots + Transactions */}
          <div className="flex flex-col gap-6">
            <OverviewCard
              title="Pots"
              buttonLabel="See All"
              onButtonClick={() => changePage('/pots')}
              layout="grid"
              details={potsDetails}
            >
              <div
                className="flex items-center gap-4 rounded-xl p-4"
                style={{ backgroundColor: 'var(--beige-100)' }}
                role="region"
                aria-label="Total saved across pots"
              >
                <IconPotsBig color="var(--secondary-green)" aria-hidden="true" />
                <div className="flex flex-col gap-3">
                  <span className="text-preset-4" style={{ color: 'var(--grey-500)' }}>
                    Total Saved
                  </span>
                  <span
                    className="text-preset-1 bold"
                    style={{ color: 'var(--grey-900)' }}
                    aria-live="polite"
                  >
                    ${totalSaves}
                  </span>
                </div>
              </div>
            </OverviewCard>

            <OverviewCard
              title="Transactions"
              buttonLabel="See All"
              onButtonClick={() => changePage('/transactions')}
            >
              <OverviewTransactions slicedSortedTransactions={slicedSortedTransactions} />
            </OverviewCard>
          </div>

          {/* Right Column: Budgets + Bills */}
          <div className="flex flex-col gap-6">
            <OverviewCard
              title="Budgets"
              buttonLabel="See All"
              onButtonClick={() => changePage('/budgets')}
              layout="horizontal"
              details={budgetsDetails}
            >
              <div role="region" aria-label="Budgets chart">
                <BudgetsChart data={budgetsChartDetails} colors={budgetsChartColors} />
              </div>
            </OverviewCard>

            <OverviewCard
              title="Recurring bills"
              buttonLabel="See All"
              onButtonClick={() => changePage('/recurring-bills')}
              layout="horizontal-full"
              details={recurringBillsOverview}
            >
            </OverviewCard>
          </div>
        </section>
      </main>
    </>
  )
}
