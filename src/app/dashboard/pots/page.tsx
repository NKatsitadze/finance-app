'use client'
import { useState } from 'react'
import Header from '@/components/Header'
import PotCard from '@/components/pots/PotCard'
import Modal from '@/components/DesignSystem/Modal'
import AddPotForm from '@/components/pots/AddPotForm'
import EditPotForm from '@/components/pots/EditPotForm'
import DeleteDialog from '@/components/DesignSystem/DeleteDialog'
import AddMoneyForm from '@/components/pots/AddMoneyForm'
import WithdrawMoneyForm from '@/components/pots/WithdrawMoneyForm'
import { useDashboardData } from '@/contexts/DashboardContext'
import { db, auth } from '@/lib/firebase'
import {
  collection,
  getDocs,
  deleteDoc,
  query,
  where,
  doc,
  getDoc,
  setDoc
} from 'firebase/firestore'


export default function Pots() {
  const { pots, refetchData } = useDashboardData()
  const [requiredAction, setRequiredAction] = useState<ActionKey | ''>('')
  const [targetPot, setTargetPot] = useState('')

  const actionKeys = {
    addPot: 'add-pot',
    editPot: 'edit-pot',
    deletePot: 'delete-pot',
    addMoney: 'add-money',
    withdrawMoney: 'withdraw-money'
  } as const

  type ActionKey = typeof actionKeys[keyof typeof actionKeys];

  const modalTitlesMap: Record<Exclude<ActionKey, 'delete-pot'>, string> = {
    'add-pot': 'Add New Pot',
    'edit-pot': 'Edit Pot',
    'add-money': 'Add to',
    'withdraw-money': 'Withdraw from',
  }

  const isMoneyAction = (action: ActionKey): action is 'add-money' | 'withdraw-money' =>
    action === actionKeys.addMoney || action === actionKeys.withdrawMoney

  const editHandler = (potName: string) => {
    setTargetPot(potName)
    setRequiredAction(actionKeys.editPot)
  }

  const popDeleteDialog = (potName: string) => {
    setTargetPot(potName)
    setRequiredAction(actionKeys.deletePot)
  }

const deletePotHandler = async (potName: string) => {
  const user = auth.currentUser
  if (!user) return

  try {
    const potsRef = collection(db, 'users', user.uid, 'pots')
    const q = query(potsRef, where('name', '==', potName))
    const snapshot = await getDocs(q)

    if (snapshot.empty) {
      console.warn(`No pot found with name: ${potName}`)
      return
    }

    const potDoc = snapshot.docs[0]
    const potData = potDoc.data()
    const totalToReturn = potData.total ?? 0

    // Step 2: Fetch user balance
    const balanceRef = doc(db, 'users', user.uid)
    const balanceSnap = await getDoc(balanceRef)

    if (!balanceSnap.exists()) {
      console.warn('No balance document found for user.')
      return
    }

    const balanceData = balanceSnap.data()
    const updatedBalance = {
      ...balanceData,
      current: (balanceData.current ?? 0) + totalToReturn,
    }

    // Step 3: Update balance
    await setDoc(balanceRef, updatedBalance)

    // Step 4: Delete the pot
    await deleteDoc(potDoc.ref)

    // Step 5: Close modal and refresh
    closeModal()
    await refetchData()
  } catch (error) {
    console.error('Failed to delete pot and update balance:', error)
  }
}

  const closeModal = () => setRequiredAction('')

  const getDropdownOptions = (potName: string) => [
    {
      key: 'edit',
      label: 'Edit Pot',
      onClick: () => editHandler(potName),
    },
    {
      key: 'delete',
      label: 'Delete Pot',
      onClick: () => popDeleteDialog(potName),
      color: 'var(--secondary-red)',
    },
  ]

  const addMoneyToPot = (potName: string) => {
    setTargetPot(potName)
    setRequiredAction(actionKeys.addMoney)
  }

  const withdrawMoney = (potName: string) => {
    setTargetPot(potName)
    setRequiredAction(actionKeys.withdrawMoney)
  }

  return (
    <>
      <Header title="Pots" buttonLabel="+ Add New Pot" onButtonClick={() => setRequiredAction(actionKeys.addPot)} />

      {requiredAction && (
        <Modal
          title={`${modalTitlesMap[requiredAction as keyof typeof modalTitlesMap] ?? ''}${isMoneyAction(requiredAction) ? ' ' + targetPot : ''}`}
          onClose={closeModal}
        >
          {requiredAction === actionKeys.addPot && <AddPotForm onSubmit={closeModal} />}
          {requiredAction === actionKeys.editPot && <EditPotForm onSubmit={closeModal} targetPot={targetPot} />}
          {requiredAction === actionKeys.deletePot && <DeleteDialog title={targetPot} closeHandler={closeModal} deleteHandler={() => deletePotHandler(targetPot)} />}
          {requiredAction === actionKeys.addMoney && <AddMoneyForm targetPot={targetPot} onSubmit={closeModal} />}
          {requiredAction === actionKeys.withdrawMoney && <WithdrawMoneyForm targetPot={targetPot} onSubmit={closeModal} />}
        </Modal>
      )}

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {pots.map((pot, index) => (
          <PotCard
            key={index}
            name={pot.name}
            total={pot.total}
            target={pot.target}
            theme={pot.theme}
            dropdownOptions={getDropdownOptions(pot.name)}
            addMoney={addMoneyToPot}
            withdrawMoney={withdrawMoney}
          />
        ))}
      </section>
    </>
  )
}
