'use client'
import { useState, useEffect, useMemo } from 'react'
import Header from '@/components/Header'
import Chart from '@/components/Chart'
import BudgetCard from '@/components/budgets/BudgetCard'
import Modal from '@/components/DesignSystem/Modal'
import AddBudgetForm from '@/components/budgets/AddBudgetForm'
import EditBudgetForm from '@/components/budgets/EditBudgetForm'
import DeleteDialog from '@/components/DesignSystem/DeleteDialog'
import { fetchUserSubcollection } from '@/lib/firestore'
import { auth, db } from '@/lib/firebase'
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore'

type Budget = {
  id: string;
  category: string;
  theme: string;
  maximum: number;
};

type Transaction = {
  name: string;
  avatar: string;
  amount: number;
  date: string;
  category: string;
};

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [requiredAction, setRequiredAction] = useState('')
  const [targetedBudget, setTargetedBudget] = useState('')

  // Get current user id inside useEffect for safety
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await fetchData(user.uid)
      } else {
        setBudgets([])
        setTransactions([])
      }
    })

    return () => unsubscribe()
  }, [])

  const fetchData = async (userId: string) => {
    const [budgetsData, transactionsData] = await Promise.all([
      fetchUserSubcollection(userId, 'budgets'),
      fetchUserSubcollection(userId, 'transactions'),
    ])
    setBudgets(budgetsData)
    setTransactions(transactionsData)
  }

  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  const budgetDetails = useMemo(() => {
    return budgets.map((budget) => {
      const totalAmount = transactions
        .filter((transaction) => {
          const transactionDate = new Date(transaction.date)
          return (
            transaction.category === budget.category &&
            transactionDate.getMonth() === currentMonth &&
            transactionDate.getFullYear() === currentYear
          )
        })
        .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0)

      return {
        key: budget.id,
        maximum: budget.maximum,
        label: budget.category,
        color: budget.theme,
        amount: totalAmount,
      }
    })
  }, [budgets, transactions, currentMonth, currentYear])

  const budgetsChartDetails = budgetDetails.map((b) => ({
    name: b.label,
    value: b.maximum,
  }))
  const budgetsChartColors = budgetDetails.map((b) => b.color)

  const closeModal = () => setRequiredAction('')

  const [targetSpentAmount, setTargetSpentAmount] = useState(0)
  const editHandler = (budgetName: string) => {
    setTargetedBudget(budgetName)
    const targetetBudgetObject = budgetDetails.find(b => b.label === budgetName)
    const spentAmount = targetetBudgetObject?.amount
    setTargetSpentAmount(spentAmount ?? 0)
    setRequiredAction('edit-budget')
  }

  const popDeleteDialog = (budgetName: string) => {
    setTargetedBudget(budgetName)
    setRequiredAction('delete-budget')
  }

  const deleteHandler = async (budgetName: string) => {
    const userId = auth.currentUser?.uid
    if (!userId) return

    const colRef = collection(db, 'users', userId, 'budgets')
    const q = query(colRef, where('category', '==', budgetName))
    const snapshot = await getDocs(q)
    if (!snapshot.empty) {
      await deleteDoc(snapshot.docs[0].ref)
      await fetchData(userId)
    }
    closeModal()
  }

  // Refetch data AND close modal helper
  const refetchBudgetsAndCloseModal = async () => {
    const userId = auth.currentUser?.uid
    if (userId) {
      await fetchData(userId)
    }
    closeModal()
  }

  const getDropdownOptions = (budgetName: string) => [
    {
      key: 'edit',
      label: 'Edit Budget',
      onClick: () => editHandler(budgetName),
    },
    {
      key: 'delete',
      label: 'Delete Budget',
      onClick: () => popDeleteDialog(budgetName),
      color: 'var(--secondary-red)',
    },
  ]

  return (
    <>
      {requiredAction && (
        <Modal
          title={
            requiredAction === 'add-budget'
              ? 'Add New Budget'
              : 'Edit Budget'
          }
          onClose={closeModal}
        >
          {requiredAction === 'add-budget' && (
            <AddBudgetForm budgets={budgets} onSubmit={refetchBudgetsAndCloseModal} />
          )}
          {requiredAction === 'edit-budget' && (
            <EditBudgetForm
              targetBudget={targetedBudget}
              budgets={budgets}
              onSubmit={refetchBudgetsAndCloseModal}
              spentAmount={targetSpentAmount}
            />
          )}
          {requiredAction === 'delete-budget' && (
            <DeleteDialog
              title={targetedBudget}
              closeHandler={closeModal}
              deleteHandler={() => deleteHandler(targetedBudget)}
            />
          )}
        </Modal>
      )}

      <Header
        title="Budgets"
        buttonLabel="+ Add New Budget"
        onButtonClick={() => setRequiredAction('add-budget')}
      />

      <article className="w-full flex gap-6 rounded-xl">
        <div className="basis-[40%] h-fit bg-white rounded-xl p-8 flex flex-col gap-8 sticky top-0">
          <Chart data={budgetsChartDetails} colors={budgetsChartColors} />

          <div className="flex flex-col gap-6">
            <span className="bold text-preset-2" style={{ color: 'var(--grey-900)' }}>
              Spending Summary
            </span>

            <div>
              {budgetDetails.map((item, index) => (
                <div key={item.key}>
                  <div className="flex justify-between relative pl-4 rounded-xl">
                    <span
                      className="absolute w-[4px] rounded-xl h-full top-0 left-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-preset-4" style={{ color: 'var(--grey-500)' }}>
                      {item.label}
                    </span>
                    <div>
                      <span className="text-preset-4 bold" style={{ color: 'var(--grey-900)' }}>
                        ${item.amount}
                      </span>
                      <span className="text-preset-5" style={{ color: 'var(--grey-500)' }}>
                        {' '}of ${item.maximum}
                      </span>
                    </div>
                  </div>
                  {index !== budgetDetails.length - 1 && (
                    <div
                      className="my-4 w-full"
                      style={{ height: '1px', backgroundColor: 'var(--grey-100)' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="basis-[60%] flex flex-col gap-6">
          <div className="grid gap-6">
            {budgetDetails.map((item) => (
              <BudgetCard
                key={item.key}
                category={item.label}
                color={item.color}
                maximum={item.maximum}
                amount={item.amount}
                transactions={transactions}
                dropdownOptions={getDropdownOptions(item.label)}
              />
            ))}
          </div>
        </div>
      </article>
    </>
  )
}
