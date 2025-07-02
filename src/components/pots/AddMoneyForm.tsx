'use client'
import { useState } from 'react'
import Input from '../DesignSystem/Input'
import Button from '../DesignSystem/Button'
import { useDashboardData } from '@/contexts/DashboardContext'
import { db, auth } from '@/lib/firebase'
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore'

type FormProps = {
  onSubmit: () => void
  targetPot: string
}

export default function AddMoneyForm({ onSubmit, targetPot }: FormProps) {
  const [amount, setAmount] = useState('')
  const [inputErrorMessage, setInputErrorMessage] = useState('')
  const [inputState, setInputState] = useState('initial')
  const { refetchData } = useDashboardData()

  const amountChangeHandler = (value: string) => {
    setInputState('initial')
    setInputErrorMessage('')
    setAmount(value)
  }

const handleAdd = async () => {
  const user = auth.currentUser
  if (!user) return

  const amountToAdd = Number(amount)
  if (isNaN(amountToAdd) || amountToAdd <= 0) {
    setInputState('error')
    setInputErrorMessage('Invalid amount.')
    return
  }

  try {
    const potRef = collection(db, 'users', user.uid, 'pots')
    const q = query(potRef, where('name', '==', targetPot))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      console.warn('Target pot not found.')
      return
    }

    const potDoc = snapshot.docs[0]
    const potData = potDoc.data()

    const currentPotTotal = potData.total ?? 0
    const potTarget = potData.target ?? Infinity

    if (currentPotTotal + amountToAdd > potTarget) {
      setInputState('error')
      setInputErrorMessage('Cannot add money: exceeds pot target.')
      return
    }

    const balanceRef = doc(db, 'users', user.uid)
    const balanceSnap = await getDoc(balanceRef)

    if (!balanceSnap.exists()) {
      console.warn('User balance not found.')
      return
    }

    const balanceData = balanceSnap.data()
    const currentBalance = balanceData.current ?? 0

    if (amountToAdd > currentBalance) {
      setInputState('error')
      setInputErrorMessage('Cannot add money: insufficient balance.')
      return
    }

    await updateDoc(potDoc.ref, {
      total: currentPotTotal + amountToAdd,
    })

    await setDoc(balanceRef, {
      ...balanceData,
      current: currentBalance - amountToAdd,
    })

    await refetchData()
    onSubmit()
  } catch (err) {
    console.error('Failed to add money to pot:', err)
  }
}

  return (
    <>
      <p className="text-preset-4 text-grey-500">
        Add a specific amount to this pot. The amount will be withdrawn from your available balance and allocated to the selected pot.
      </p>
      <Input
        label="Amount to Add"
        placeholder="e.g. 2000"
        fullWidth
        onChange={amountChangeHandler}
        errorMessage={inputErrorMessage}
        state={inputState}
      />
      <Button label="Confirm Addition" onButtonClick={handleAdd} />
    </>
  )
}
