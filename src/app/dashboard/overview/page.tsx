"use client"
import { Fragment } from "react";
import Header from "@/components/Header";
import BalanceCard from "@/components/BalanceCard";
import OverviewCard from "@/components/overviews/OverviewCard";
import IconPotsBig from "@/components/IconComponents/IconPotsBig";
import BudgetsChart from "@/components/Chart";
import dataJson from '@/data.json'

export default function Home() {
  const balances = [
    {
      key: 'current',
      label: 'Current Balance',
      amount: dataJson.balance.current,
      active: true
    },
        {
      key: 'income',
      label: 'Income',
      amount: dataJson.balance.income,
    },
    {
      key: 'expenses',
      label: 'Expenses',
      amount: dataJson.balance.expenses,
    }
  ]

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


  const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' }); // 'Aug'
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const sortedTransactions = dataJson.transactions && dataJson.transactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  const slicedSortedTransactions = sortedTransactions?.slice(0,5)

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
            title="budgets"
            buttonLabel="See All"
            onButtonClick={() => console.log('Clicked')}
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
            onButtonClick={() => console.log('Clicked')}
          >
            {slicedSortedTransactions &&
              slicedSortedTransactions.map(({ avatar, name, category, date, amount, recurring }, index) => (
                <Fragment key={index}>
                  <div className="grid grid-cols-2 justify-between">
                    <div className="flex items-center gap-4">
                      <img src={avatar} alt="avatar" className="w-[40px] rounded-[50%]" />
                      <span className="bold text-preset-4" style={{ color: 'var(--grey-900)' }}>{name}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="bold" style={{ color: amount > 0 ? 'var(--secondary-green)' : 'var(--grey-900)' }}>
                        {amount >= 0 ? `+$${amount}` : `${String(amount).slice(0, 1)}$${String(amount).slice(1)}`}
                      </span>
                      <span style={{ color: 'var(--grey-500)' }}>{formatDate(date)}</span>
                    </div>
                  </div>

                  {index !== slicedSortedTransactions.length - 1 && (
                    <div className="mt-4 mb-4" style={{ backgroundColor: 'var(--grey-100)', width: '100%', height: '1px' }}></div>
                  )}
                </Fragment>
            ))}
          </OverviewCard>
        </div>


        <div className="flex flex-col gap-6">
          <OverviewCard
            title="Budgets"
            buttonLabel="See All"
            onButtonClick={() => console.log('Clicked')}
            layout="horizontal"
            details={budgetsDetails}
          >
            <BudgetsChart data={budgetsChartDetails} colors={budgetsChartColors}/>
          </OverviewCard>

          <OverviewCard
            title="Recurring bills"
            buttonLabel="See All"
            onButtonClick={() => console.log('Clicked')}
            layout="horizontal-full"
            details={[
              { label: 'Groceries', amount: '$320', color: 'var(--secondary-green)', key: 1 },
              { label: 'Rent', amount: '$1200', color: 'var(--secondary-cyan)', key: 2 },
              { label: 'Utilities', amount: '$150', color: 'var(--secondary-navy)', key: 3 },
              { label: 'Other', amount: '$150', color: 'var(--secondary-yellow)', key: 4 },
            ]}
          >
          </OverviewCard>
        </div>
      </section>
    </>
);
}
