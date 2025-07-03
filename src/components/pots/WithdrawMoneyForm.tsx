'use client'
import { useState } from 'react'
import Input from '../DesignSystem/Input'
import Button from '../DesignSystem/Button'
import OverlaySpinner from '../OverlayScreenSpinner'
import { useDashboardData } from '@/contexts/DashboardContext'
import { db, auth } from '@/lib/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  updateDoc,
  doc,
  setDoc,
} from 'firebase/firestore'

type FormProps = {
  onSubmit: () => void;
  targetPot: string;
};

export default function WithdrawMoneyForm({ onSubmit, targetPot }: FormProps) {
  const [amount, setAmount] = useState('')
  const [inputErrorMessage, setInputErrorMessage] = useState('')
  const [inputState, setInputState] = useState('initial')
  const [loading, setLoading] = useState(false)
  const { refetchData } = useDashboardData()

  const amountChangeHandler = (value: string) => {
    setInputErrorMessage('')
    setInputState('initial')
    setAmount(value)
  }

  const handleWithdraw = async () => {
    const user = auth.currentUser
    if (!user) return

    const amountToWithdraw = Number(amount)
    if (isNaN(amountToWithdraw) || amountToWithdraw <= 0) {
      setInputErrorMessage('Invalid amount.')
      setInputState('error')
      return
    }

    try {
      const potsRef = collection(db, 'users', user.uid, 'pots')
      const q = query(potsRef, where('name', '==', targetPot))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        console.warn('Target pot not found.')
        return
      }

      const potDoc = snapshot.docs[0]
      const potData = potDoc.data()

      const newPotTotal = (potData.total ?? 0) - amountToWithdraw
      if (newPotTotal < 0) {
        setInputErrorMessage('Not enough funds in this pot.')
        setInputState('error')
        return
      }

      await updateDoc(potDoc.ref, {
        total: newPotTotal,
      })

      const balanceRef = doc(db, 'users', user.uid)
      const balanceSnap = await getDoc(balanceRef)

      if (!balanceSnap.exists()) {
        console.warn('User balance not found.')
        return
      }

      setLoading(true)
      const balanceData = balanceSnap.data()
      await setDoc(balanceRef, {
        ...balanceData,
        current: (balanceData.current ?? 0) + amountToWithdraw,
      })

      await refetchData()
      onSubmit()
    } catch (err) {
      setLoading(false)
      console.error('Failed to withdraw money:', err)
    }
    setLoading(false)
  }

  return (
    <>
      {loading && <OverlaySpinner/>}
      <p className="text-preset-4 text-grey-500">
        Withdraw a specific amount from this pot. The amount will be removed from your pot and added to your available balance.
      </p>
      <Input
        label="Amount to Withdraw"
        placeholder="e.g. 2000"
        fullWidth
        onChange={amountChangeHandler}
        errorMessage={inputErrorMessage}
        state={inputState}
      />
      <Button label="Confirm Withdrawal" onButtonClick={handleWithdraw} />
    </>
  )
}
