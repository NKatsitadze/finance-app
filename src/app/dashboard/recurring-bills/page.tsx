'use client'

import { useEffect, useState, useMemo } from 'react'
import Header from '@/components/Header'
import IconBills from '@/components/IconComponents/IconBills'
import RecurringBillsTable from '@/components/recurring-bills/billsTable'
import { fetchUserSubcollection } from '@/lib/firestore'
import { auth } from '@/lib/firebase'

type Transaction = {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring: boolean;
};

export default function RecurringBills() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    const user = auth.currentUser
    if (!user) return

    async function loadData() {
      const data = await fetchUserSubcollection(user!.uid, 'transactions')
      setTransactions(data as Transaction[])
    }

    loadData()
  }, [])

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const fiveDaysLater = new Date(now)
  fiveDaysLater.setDate(now.getDate() + 5)

  const recurringTransactions = useMemo(
    () => transactions.filter((tx) => tx.recurring),
    [transactions]
  )

  const paidBills = recurringTransactions.filter((tx) => {
    const date = new Date(tx.date)
    return date >= startOfMonth && date <= now
  })
  const paidSum = Math.abs(paidBills.reduce((acc, curr) => acc + curr.amount, 0))

  const upcomingBills = recurringTransactions.filter((tx) => {
    const date = new Date(tx.date)
    return date > now && date <= endOfMonth
  })
  const upcomingSum = upcomingBills.reduce((acc, curr) => acc + curr.amount, 0)

  const dueSoonBills = upcomingBills.filter((tx) => {
    const date = new Date(tx.date)
    return date <= fiveDaysLater
  })
  const dueSoonSum = dueSoonBills.reduce((acc, curr) => acc + curr.amount, 0)

  const summaryCardDetails = [
    {
      label: 'Paid Bills',
      count: paidBills.length,
      sum: paidSum,
      color: 'text-grey-900',
    },
    {
      label: 'Total Upcoming',
      count: upcomingBills.length,
      sum: upcomingSum,
      color: 'text-grey-900',
    },
    {
      label: 'Due Soon',
      count: dueSoonBills.length,
      sum: dueSoonSum,
      color: 'text-red',
    },
  ]

  return (
    <>
      <Header title="Recurring Bills" />

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-6">
          {/* Total Bills Card */}
          <div
            className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-8"
            style={{ backgroundColor: 'var(--grey-900)' }}
          >
            <IconBills color="var(--white)" />
            <div className="flex flex-col gap-3">
              <h2 className="text-preset-4 text-white">Total Bills</h2>
              <div className="text-preset-1 bold text-white">${paidSum}</div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="text-preset-5 bg-white rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="text-preset-3 bold text-grey-900 pb-5">Summary</h3>

            {summaryCardDetails.map((item, idx, arr) => (
              <div key={item.label}>
                <div className="flex justify-between">
                  <span className="text-grey-500">{item.label}</span>
                  <span className={`${item.color} bold text-preset-5`}>
                    {item.count} (${Math.abs(item.sum)})
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <div
                    className="h-px my-4"
                    style={{ backgroundColor: 'var(--grey-100)' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4">
          <RecurringBillsTable transactions={recurringTransactions} />
        </div>
      </section>
    </>
  )
}
