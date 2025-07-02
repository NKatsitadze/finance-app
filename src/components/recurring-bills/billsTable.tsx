'use client'

import { useState, useMemo } from 'react'
import Input from '@/components/DesignSystem/Input'
import Select from '@/components/DesignSystem/Select'

type Transaction = {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number
  recurring: boolean
}

type Props = {
  transactions: Transaction[];
};

export default function RecurringBillsRight({ transactions }: Props) {
  const now = new Date()
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const fiveDaysLater = new Date(now)
  fiveDaysLater.setDate(now.getDate() + 5)

  const [sortBy, setSortBy] = useState('latest')
  const [searchQuery, setSearchQuery] = useState('')

  const recurringTransactions = useMemo(() => {
    let filtered = [...transactions]

    // Filter by input
    if (searchQuery.trim()) {
      filtered = filtered.filter((tx) =>
        tx.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    switch (sortBy) {
      case 'latest':
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case 'az':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'za':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'highest':
        filtered.sort((a, b) => b.amount - a.amount)
        break
      case 'lowest':
        filtered.sort((a, b) => a.amount - b.amount)
        break
    }

    return filtered.slice(0, 8)
  }, [transactions, sortBy, searchQuery])

  const getDateColor = (dateStr: string) => {
    const date = new Date(dateStr)
    if (date < now) return 'var(--secondary-green)'
    if (date <= fiveDaysLater) return 'var(--red)'
    return 'var(--grey-500)'
  }

  return (
    <div className="bg-white flex flex-col gap-6 p-8 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center">
        <Input
          placeholder="Search recurring bills"
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
        />
        <Select
          label="Sort by"
          labelAside
          options={[
            { label: 'Latest', value: 'latest', key: Math.random() },
            { label: 'Oldest', value: 'oldest', key: Math.random() },
            { label: 'A to Z', value: 'az', key: Math.random() },
            { label: 'Z to A', value: 'za', key: Math.random() },
            { label: 'Highest', value: 'highest', key: Math.random() },
            { label: 'Lowest', value: 'lowest', key: Math.random() },
          ]}
          onChange={setSortBy}
        />
      </div>

      {/* Table Headings */}
      <div
        className="grid py-4 px-4 text-preset-5 border-b"
        style={{
          gridTemplateColumns: '2fr 1fr 1fr',
          borderColor: 'var(--grey-100)',
          color: 'var(--grey-500)',
        }}
      >
        <span>Bill Title</span>
        <span>Due Date</span>
        <span className="text-right">Amount</span>
      </div>

      {/* Transactions */}
      <ul className="divide-y divide-grey-100">
        {recurringTransactions.map((tx, index) => {
          const color = getDateColor(tx.date)
          const date = new Date(tx.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })

          return (
            <li
              key={index}
              className="grid items-center px-4 py-4 text-sm"
              style={{ gridTemplateColumns: '2fr 1fr 1fr' }}
            >
              {/* Bill Title */}
              <div className="flex items-center gap-3">
                <img src={tx.avatar} alt={tx.name} className="w-[32px] h-[32px] rounded-full" />
                <span className="text-grey-900 bold text-preset-5">{tx.name}</span>
              </div>

              {/* Due Date */}
              <span className="text-preset-5" style={{ color }}>{date}</span>

              {/* Amount */}
              <span className="text-right font-semibold" style={{ color }}>
                ${Math.abs(tx.amount)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
