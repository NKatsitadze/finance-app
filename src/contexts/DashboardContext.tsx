'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { fetchUserSubcollection, fetchUserDocument } from '@/lib/firestore'

type Balance = {
  current: number;
  income: number;
  expenses: number;
};

type Transaction = {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
  recurring?: boolean;
};

type Budget = {
  category: string;
  maximum: number;
  theme: string;
};

type Pot = {
  id?: string;
  name: string;
  target: number;
  total: number;
  theme: string;
};


type DashboardData = {
  balance: Balance;
  transactions: Transaction[];
  budgets: Budget[];
  pots: Pot[];
};

type DashboardContextValue = DashboardData & {
  refetchData: () => void;
};

const DashboardContext = createContext<DashboardContextValue | null>(null)
export function useDashboardData() {
  const context = useContext(DashboardContext)
  if (!context) {
    throw new Error('useDashboardData must be used within DashboardProvider')
  }
  return context
}

export function DashboardProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const [data, setData] = useState<DashboardData>({
    balance: { current: 0, income: 0, expenses: 0 },
    transactions: [],
    budgets: [],
    pots: [],
  })

  const fetchAllData = async () => {
    const [userDoc, transactions, budgets, pots] = await Promise.all([
      fetchUserDocument(userId),
      fetchUserSubcollection(userId, 'transactions'),
      fetchUserSubcollection(userId, 'budgets'),
      fetchUserSubcollection(userId, 'pots'),
    ])

    setData({
      balance: userDoc
        ? {
            current: userDoc.current,
            income: userDoc.income,
            expenses: userDoc.expenses,
          }
        : { current: 0, income: 0, expenses: 0 },
      transactions: transactions as Transaction[],
      budgets: budgets as Budget[],
      pots: pots as Pot[],
    })
  }

  useEffect(() => {
    if (!userId) return
    fetchAllData()
  }, [userId])

  return (
    <DashboardContext.Provider value={{ ...data, refetchData: fetchAllData }}>
      {children}
    </DashboardContext.Provider>
  )
}

