'use client'
import { useEffect, useState } from 'react'
import Select from '../DesignSystem/Select'
import Input from '../DesignSystem/Input'
import Button from '../DesignSystem/Button'
import { getThemeOptions } from '@/utils/budgets/getAddFormOptions'
import { useDashboardData } from '@/contexts/DashboardContext'
import { db, auth } from '@/lib/firebase'
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore'

type FormProps = {
  onSubmit: () => void;
  targetPot: string;
};

export default function EditPotForm({ onSubmit, targetPot }: FormProps) {
  const { pots, refetchData } = useDashboardData()
  const potObj = pots.find((p) => p.name === targetPot)

  const [potName, setPotName] = useState(potObj?.name ?? '')
  const [target, setTarget] = useState(potObj?.target?.toString() ?? '')
  const [theme, setTheme] = useState(potObj?.theme ?? '#277C78')
  const [potNameInputError, setPotNameInputError] = useState('')
  const [potNameInputState, setPotNameInputState] = useState('initial')
  const [potTargetInputError, setPotTargetInputError] = useState('')
  const [potTargetInputState, setPotTargetInputState] = useState('initial')

  const themeOptions = getThemeOptions(pots) // updated from real pots

  useEffect(() => {
    // In case props or context updates
    setPotName(potObj?.name ?? '')
    setTarget(potObj?.target?.toString() ?? '')
    setTheme(potObj?.theme ?? '#277C78')
  }, [potObj])

  const inputPotName = (val:string) => {
    setPotNameInputError('')
    setPotNameInputState('initial')
    setPotName(val)
  }

  const inputPotTarget = (val:string) => {
    setPotTargetInputError('')
    setPotTargetInputState('initial')
    setTarget(val)
  }

  const handleSubmit = async () => {
    const user = auth.currentUser
    if (!user || !potObj) return

    const targetPotObject = pots.find(p => p.name === potName)
    const nameIsEmpty = !potName
    const nameAlreadyUsed = pots
      .filter(pot => pot.id !== potObj.id)
      .some(pot => pot.name.trim().toLowerCase() === potName.trim().toLowerCase())

    const targetIsInvalid = target.trim() === '' || isNaN(Number(target))
    const targetLessThanTotal = targetPotObject?.total && (Number(target) < targetPotObject.total)

    if(nameIsEmpty || nameAlreadyUsed || targetIsInvalid || targetLessThanTotal) {
      if(nameIsEmpty || nameAlreadyUsed) {
        if(nameIsEmpty) setPotNameInputError('Name is required.')
        if(nameAlreadyUsed) setPotNameInputError('This name is already taken.')
        setPotNameInputState('error')
      }
      if(targetIsInvalid || targetLessThanTotal) {
        if(targetIsInvalid) setPotTargetInputError('Invalid amount.')
        if(targetLessThanTotal) setPotTargetInputError('Target can not be less than saved amount.')
        setPotTargetInputState('error')
      }
      return
    }

    try {
      const potsRef = collection(db, 'users', user.uid, 'pots')
      const q = query(potsRef, where('name', '==', targetPot))
      const snapshot = await getDocs(q)

      if (snapshot.empty) {
        console.warn('Pot not found for editing.')
        return
      }

      const potDocRef = snapshot.docs[0].ref

      await updateDoc(potDocRef, {
        name: potName,
        target: Number(target),
        theme,
      })

      await refetchData() // refresh UI
      onSubmit()
    } catch (err) {
      console.error('Failed to update pot:', err)
    }
  }

  return (
    <>
      <p className="text-preset-4 text-grey-500">
        Choose a name, savings target, and theme for your pot.
      </p>

      <Input
        label="Pot Name"
        value={potName}
        placeholder="e.g. Travel Fund"
        fullWidth
        onChange={(val) => inputPotName(val)}
        errorMessage={potNameInputError}
        state={potNameInputState}
      />

      <Input
        label="Target"
        value={target}
        placeholder="e.g. 2000"
        fullWidth
        onChange={(val) => inputPotTarget(val)}
        errorMessage={potTargetInputError}
        state={potTargetInputState}
      />

      <Select
        label="Theme"
        selectedValue={theme}
        fullWidth
        options={themeOptions}
        onChange={setTheme}
      />

      <Button label="Save Changes" onButtonClick={handleSubmit} />
    </>
  )
}
