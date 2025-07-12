'use client'

import { useState, useEffect, useMemo } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { fetchUserSubcollection } from '@/lib/firestore'
import Header from '@/components/Header'
import Pagination from '@/components/DesignSystem/Pagination'
import Input from '@/components/DesignSystem/Input'
import Select from '@/components/DesignSystem/Select'
import OverlaySpinner from '@/components/OverlayScreenSpinner'

type Transaction = {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
};

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)

  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('latest')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [isTabletOrMobile, setIsTabletOrMobile] = useState(false)

  const transactionsPerPage = 10

  useEffect(() => {
    function handleResize() {
      setIsTabletOrMobile(window.innerWidth < 689)
    }
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const data = await fetchUserSubcollection(user.uid, 'transactions')
        setTransactions(data as Transaction[])
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  const categories = useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.category)))
  }, [transactions])

  const sortedAndFiltered = useMemo(() => {
    let filtered = [...transactions]

    if (categoryFilter) {
      filtered = filtered.filter(
        (t) => t.category.toLowerCase() === categoryFilter.toLowerCase()
      )
    }

    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        break
      case 'az':
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'za':
        filtered.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'high':
        filtered.sort((a, b) => b.amount - a.amount)
        break
      case 'low':
        filtered.sort((a, b) => a.amount - b.amount)
        break
      default:
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
    }

    return filtered
  }, [sortBy, categoryFilter, searchTerm, transactions])

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * transactionsPerPage
    return sortedAndFiltered.slice(start, start + transactionsPerPage)
  }, [currentPage, sortedAndFiltered])

  if (loading) {
    return <OverlaySpinner/>
  }

  return (
    <>
      <Header title="Transactions" />

      <main className="transactions-main bg-white w-full flex-1 flex flex-col rounded-xl p-8">
        {/* Filter/Search/Sort Header */}
        <section className="flex items-center justify-between mb-6">
          <Input
            placeholder="Search transaction"
            onChange={(v) => {
              setSearchTerm(v)
              setCurrentPage(1)
            }}
            aria-label="Search transactions"
          />

          <div className="transactions-selects flex items-center justify-end gap-6 ml-6">
            <Select
              label="Sort by"
              labelAside
              options={[
                { label: 'Latest', value: 'latest', key: 'latest' },
                { label: 'Oldest', value: 'oldest', key: 'oldest' },
                { label: 'A to Z', value: 'az', key: 'az' },
                { label: 'Z to A', value: 'za', key: 'za' },
                { label: 'Highest', value: 'high', key: 'high' },
                { label: 'Lowest', value: 'low', key: 'low' },
              ]}
              type='sort'
              iconSelector={isTabletOrMobile}
              onChange={(v) => {
                setSortBy(v)
                setCurrentPage(1)
              }}
            />

            <Select
              label="Category"
              labelAside
              options={[
                { label: 'All', value: '', key: 'all' },
                ...categories.map((cat) => ({
                  label: cat,
                  value: cat,
                  key: cat,
                })),
              ]}
              type='filter'
              iconSelector={isTabletOrMobile}
              onChange={(v) => {
                setCategoryFilter(v)
                setCurrentPage(1)
              }}
            />
          </div>
        </section>

        {/* Transactions Table */}
        <section>
          <table className="w-full text-sm">
            <thead className="transactions-tbh text-preset-5 border-b py-6 px-4" style={{ color: 'var(--grey-500)', borderColor: 'var(--grey-100)' }}>
              <tr className="grid px-4 py-2" style={{ gridTemplateColumns: '2fr 0.8fr 0.8fr 1.2fr' }}>
                <th className="text-left">Recipient / Sender</th>
                <th className="text-left">Category</th>
                <th className="text-left">Date</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map(({ avatar, name, category, date, amount }, index) => (
            <tr
                  key={index}
                  className="transaction-item grid items-center py-4 px-4 border-b border-gray-100 grid-cols-[1fr_1fr] sm:grid-cols-[2fr_0.8fr_0.8fr_1.2fr]"
>
                  <td className="flex items-center gap-3">
                    <img src={avatar} alt={name} className="w-[40px] h-[40px] rounded-full" />
                    <span className="sm:block hidden text-gray-900">{name}</span>
                    <div className='sm:hidden block flex flex-col'>
                      <span className="text-gray-900 bold">{name}</span>
                      <span className="text-gray-700 truncate">{category}</span>
                    </div>
                  </td>
                  <td className="sm:block hidden text-gray-700 truncate">{category}</td>
                  <td className="sm:block hidden text-gray-500">
                    {new Date(date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td className={`sm:block hidden text-right font-semibold ${amount > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                    {amount >= 0 ? `+$${amount}` : `-$${Math.abs(amount)}`}
                  </td>
                  <td className='sm:hidden block flex flex-col text-right'>
                    <span className="text-gray-500">
                      {new Date(date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className={`font-semibold ${amount > 0 ? 'text-green-600' : 'text-gray-800'}`}>
                      {amount >= 0 ? `+$${amount}` : `-$${Math.abs(amount)}`}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Pagination */}
        <div className="transactions-pagination mt-6">
          <Pagination
            totalPages={Math.ceil(sortedAndFiltered.length / transactionsPerPage)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </>
  )
}
