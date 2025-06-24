"use client"
import { usePathname, useRouter } from "next/navigation";
import Header from "@/components/Header";
import BalanceCard from "@/components/overviews/BalanceCard";
import OverviewCard from "@/components/overviews/OverviewCard";
import IconPotsBig from "@/components/IconComponents/IconPotsBig";
import BudgetsChart from "@/components/Chart";
import dataJson from '@/data.json'
import { getRecurringBills } from "@/utils/getRecurringBills";
import { getBalanceCardDetails } from "@/utils/overview/getBalanceCardDetails";
import { getRecurringBillsOverview } from "@/utils/overview/getRecurringBillsOverview";
import { OverviewTransactions } from "@/components/overviews/OverviewTransactions";

export default function Home() {
  const router = useRouter()
  const pathname = usePathname()

  const balances = getBalanceCardDetails(dataJson.balance)
  const totalSaves = dataJson.pots.reduce((sum, pot) => sum + pot.total, 0);
  const potsDetails = dataJson.pots.map(pot => {
    return { label: pot.name, amount: `$${pot.total}`, color: pot.theme, key: Math.random() }
  }).slice(0,4)

  const budgetsDetails = dataJson.budgets.map(budget => {
    return { label: budget.category, amount: `$${budget.maximum}`, color: budget.theme, key: Math.random() }
  }).slice(0.4)
  const budgetsChartDetails = dataJson.budgets.map(budget => {
    return { name: budget.category, value: budget.maximum }
  })
  const budgetsChartColors = dataJson.budgets.map(budget => {
    return budget.theme
  })

  const sortedTransactions = dataJson.transactions && dataJson.transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const slicedSortedTransactions = sortedTransactions?.slice(0,5)
  const recurringBills = getRecurringBills(dataJson.transactions)
  const recurringBillsOverview = getRecurringBillsOverview(recurringBills)

  const basePath = pathname.split("/").slice(0, -1).join("/")
  const changePage = (url:string) => {
    router.push(`${basePath + url}`)
  }

  return (
    <>
      <Header title="Overview"/>
      <section className="flex gap-6 mb-8 shrink justify-between">
        {balances.map(({ key, ...rest }) => (
          <BalanceCard key={key} {...rest}/>
        ))}      
      </section>

      <section className="grid grid-cols-[11fr_9fr] gap-6">
        <div className="flex flex-col gap-6">
          <OverviewCard
            title="Pots"
            buttonLabel="See All"
            onButtonClick={() => changePage('/pots')}
            layout="grid"
            details={potsDetails}
          >
            <div className="flex items-center gap-4 rounded-xl p-4" style={{backgroundColor: 'var(--beige-100)'}}>
              <IconPotsBig color="var(--secondary-green)"/>
              <div className="flex flex-col gap-3">
                <span className="text-preset-4" style={{ color: 'var(--grey-500)' }}>Total Saved</span>
                <span className="text-preset-1 bold" style={{ color: 'var(--grey-900)' }}>${totalSaves}</span>
              </div>
            </div>
          </OverviewCard>

          <OverviewCard
            title="Transactions"
            buttonLabel="See All"
            onButtonClick={() => changePage('/transactions')}
          >
            <OverviewTransactions slicedSortedTransactions={slicedSortedTransactions}/>
          </OverviewCard>
        </div>

        <div className="flex flex-col gap-6">
          <OverviewCard
            title="Budgets"
            buttonLabel="See All"
            onButtonClick={() => changePage('/budgets')}
            layout="horizontal"
            details={budgetsDetails}
          >
            <BudgetsChart data={budgetsChartDetails} colors={budgetsChartColors}/>
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
    </>
  )
}
