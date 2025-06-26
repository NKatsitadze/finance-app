"use client"
import { useState } from "react"
import Select from "../DesignSystem/Select"
import Input from "../DesignSystem/Input"
import Button from "../DesignSystem/Button"
import dataJson from '@/data.json'
import { getCategoryOptions, getThemeOptions } from "@/utils/budgets/getEditFormOptions"

type formProps = {
    onSubmit: () => void;
    targetBudget: string;
}

export default function EditBudgetForm ({ onSubmit, targetBudget }:formProps) {
    const targetedBudgetObj = dataJson.budgets.find(b => b.category === targetBudget)
    const [selectedCategory, setSelectedCategory] = useState(targetedBudgetObj?.category)
    const [theme, setTheme] = useState(targetedBudgetObj?.theme)
    const [maximum, setMaximum] = useState(targetedBudgetObj?.maximum)

    const categoryOptions = getCategoryOptions(dataJson.budgets)
    const themeOptions = getThemeOptions(dataJson.budgets)

    const selectCategory = (category:string) => setSelectedCategory(category)
    const inputHandler = (value:string) => setMaximum(Number(value))
    const selectTheme = (theme:string) => setTheme(theme)

    const saveChanges = () => {
        const target = dataJson.budgets.find(b => b.category === selectedCategory)
        if(target && maximum) target.maximum = Number(maximum)
        if(target && theme) target.theme = theme
        onSubmit()
    }

    return (
        <>
        <p className="text-preset-4 text-grey-500">As your budgets change, feel free to update your spending limits.</p>
        <Select label="Budget Category" selectedValue={targetBudget} options={categoryOptions} onChange={selectCategory} fullWidth/>
        <Input label="Maximum Spend" value={maximum?.toString()} placeholder="e.g. 2000" fullWidth onChange={inputHandler}/>
        <Select label="Theme" fullWidth options={themeOptions} onChange={selectTheme}/>
        <Button label="Save Changes" onButtonClick={saveChanges}/>
        </>
    )
}