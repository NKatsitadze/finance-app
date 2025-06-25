"use client"
import { useState } from "react"
import Select from "../DesignSystem/Select"
import Input from "../DesignSystem/Input"
import Button from "../DesignSystem/Button"
import dataJson from '@/data.json'
import { getCategoryOptions, getThemeOptions } from "@/utils/budgets/getEditFormOptions"

type formProps = {
    onSubmit: () => void;
}

export default function addBudgetForm ({ onSubmit }:formProps) {
    const [category, setSelectedCategory] = useState('General')
    const [maximum, setMaximum] = useState('')
    const [theme, setTheme] = useState('#277C78')

    const categoryOptions = getCategoryOptions(dataJson.budgets)
    const themeOptions = getThemeOptions(dataJson.budgets)

    const selectCategory = (category:string) => setSelectedCategory(category)
    const inputHandler = (value:string) => setMaximum(value)
    const selectTheme = (theme:string) => setTheme(theme)

    const addBudget = () => {
        dataJson.budgets.push({
            category,
            theme,
            maximum: Number(maximum)
        })
        onSubmit()
    }

    return (
        <>
        <p className="text-preset-4 text-grey-500">As your budgets change, feel free to update your spending limits.</p>
        <Select label="Budget Category" options={categoryOptions} onChange={selectCategory} fullWidth/>
        <Input label="Maximum Spend" placeholder="e.g. 2000" fullWidth onChange={inputHandler}/>
        <Select label="Theme" fullWidth options={themeOptions} onChange={selectTheme}/>
        <Button label="Save Changes" onButtonClick={addBudget}/>
        </>
    )
}