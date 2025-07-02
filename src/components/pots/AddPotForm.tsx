'use client'
import { useState } from 'react'
import Select from '../DesignSystem/Select'
import Input from '../DesignSystem/Input'
import Button from '../DesignSystem/Button'
import { getThemeOptions } from '@/utils/budgets/getAddFormOptions'
import { useDashboardData } from '@/contexts/DashboardContext'
import { db, auth } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

type FormProps = {
  onSubmit: () => void;
}

export default function AddPotForm({ onSubmit }: FormProps) {
  const [potName, setPotName] = useState('')
  const [target, setTarget] = useState('')
  const [theme, setTheme] = useState('')
  const [nameInputError, setNameInputError] = useState('')
  const [nameInputState, setNameInputState] = useState('initial')
  const [targetInputError, setTargetInputError] = useState('')
  const [targetInputState, setTargetInputState] = useState('initial')
  const { pots, refetchData } = useDashboardData()

  const themeOptions = getThemeOptions(pots)

  const handleSubmit = async () => {
    const user = auth.currentUser
    if (!user) return

    const emptyName = !potName
    const alreadyExists = potName === pots.find(p => p.name === potName)?.name
    const lessThanZero = Number(target) <= 0
    const notNumber = isNaN(Number(target))
    if (emptyName || alreadyExists) {
      if(emptyName) setNameInputError('Name is required.')
      if(alreadyExists) setNameInputError('Pot with provided name already exists.')
      setNameInputState('error')
    }
    if(lessThanZero || notNumber) {
      setTargetInputError('Invalid pot target.')
      setTargetInputState('error')
    }
    if(lessThanZero || emptyName || alreadyExists || notNumber) return

    try {
      const newPot = {
        name: potName,
        target: Number(target),
        total: 0,
        theme: theme || '#277C78',
      }

      const potsRef = collection(db, 'users', user.uid, 'pots')
      await addDoc(potsRef, newPot)

      await refetchData()
      onSubmit()
    } catch (err) {
      console.error('Failed to add pot:', err)
    }
  }

  const inputPotName = (val:string) => {
    setNameInputError('')
    setNameInputState('initial')
    setPotName(val)
  }

  const inputPotTarget = (val: string) => {
    setTargetInputError('')
    setTargetInputState('initial')
    setTarget(val)
  }

  return (
    <>
      <p className="text-preset-4 text-grey-500">
        Create a pot to set savings targets. These can help keep you on track as you save for special purchases.
      </p>

      <Input
        label="Pot Name"
        placeholder="e.g. Travel Fund"
        fullWidth
        onChange={(val) => inputPotName(val)}
        errorMessage={nameInputError}
        state={nameInputState}
      />
      <Input
        label="Target"
        placeholder="e.g. 2000"
        fullWidth
        onChange={(val) => inputPotTarget(val)}
        errorMessage={targetInputError}
        state={targetInputState}
      />
      <Select
        label="Theme"
        fullWidth
        options={themeOptions}
        onChange={setTheme}
      />

      <Button label="Add Pot" onButtonClick={handleSubmit} />
    </>
  )
}
