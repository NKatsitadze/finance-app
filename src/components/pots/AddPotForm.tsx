"use client"
import { useState } from "react"
import Select from "../DesignSystem/Select"
import Input from "../DesignSystem/Input"
import Button from "../DesignSystem/Button"
import dataJson from '@/data.json'
import { getThemeOptions } from "@/utils/budgets/getAddFormOptions"

type formProps = {
    onSubmit: () => void;
}

export default function addPotForm ({ onSubmit }:formProps) {
    const [potName, setPotName] = useState('')
    const [target, setTarget] = useState('')
    const [theme, setTheme] = useState('')

    const themeOptions = getThemeOptions(dataJson.pots)

    const targetChangeHandler = (value:string) => setTarget(value)
    const nameChangeHandler = (value:string) => setPotName(value)
    const selectTheme = (theme:string) => setTheme(theme)

    const addBudget = () => {
        dataJson.pots.push({
            name: potName,
            target: Number(target),
            total: 0,
            theme: theme || '#277C78',
        })
        onSubmit()
    }

    return (
        <>
        <p className="text-preset-4 text-grey-500">Create a pot to set savings targets. These can help keep you on track as you save for special purchases.</p>
        <Input label="Pot Name" placeholder="e.g. 2000" fullWidth onChange={nameChangeHandler}/>
        <Input label="Target" placeholder="e.g. 2000" fullWidth onChange={targetChangeHandler}/>
        <Select label="Theme" fullWidth options={themeOptions} onChange={selectTheme}/>
        <Button label="Add Pot" onButtonClick={addBudget}/>
        </>
    )
}