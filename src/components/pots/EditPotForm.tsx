"use client"
import { useState } from "react"
import Select from "../DesignSystem/Select"
import Input from "../DesignSystem/Input"
import Button from "../DesignSystem/Button"
import dataJson from '@/data.json'
import { getCategoryOptions, getThemeOptions } from "@/utils/budgets/getAddFormOptions"

type formProps = {
    onSubmit: () => void;
    targetPot: string;
}

export default function editPotForm ({ onSubmit, targetPot }:formProps) {
    const targetPotObj = dataJson.pots.find(p => p.name === targetPot)

    const [potName, setPotName] = useState(targetPotObj?.name ?? '')
    const [target, setTarget] = useState(targetPotObj?.target ?? '')
    const [theme, setTheme] = useState(targetPotObj?.theme ?? '#277C78')

    const themeOptions = getThemeOptions(dataJson.budgets, 'all')

    const potNameHandler = (value:string) => setPotName(value)
    const targetHandler = (value:string) => setTarget(value)
    const selectTheme = (theme:string) => setTheme(theme)

    const editPot = () => {
        targetPotObj!.name = potName
        targetPotObj!.target = Number(target)
        targetPotObj!.theme = theme
        onSubmit()
    }


    return (
        <>
        <p className="text-preset-4 text-grey-500">Choose a category to set a spending budget. These categories can help you monitor spending.</p>
        <Input label="Pot Name" value={targetPotObj?.name} placeholder="Pot Name" fullWidth onChange={potNameHandler}/>
        <Input label="Target" value={String(targetPotObj?.target)} placeholder="e.g. 2000" fullWidth onChange={targetHandler}/>
        <Select label="Theme" selectedValue={targetPotObj?.theme} fullWidth options={themeOptions} onChange={selectTheme}/>
        <Button label="Save Changes" onButtonClick={editPot}/>
        </>
    )
}