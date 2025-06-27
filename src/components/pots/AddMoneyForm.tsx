"use client"
import { useState } from "react"
import Input from "../DesignSystem/Input"
import Button from "../DesignSystem/Button"
import dataJson from '@/data.json'

type formProps = {
    onSubmit: () => void;
    targetPot: string;
}

export default function addPotForm ({ onSubmit, targetPot }:formProps) {
    const [amount, setAmount] = useState('')
    const amountChangeHandler = (value:string) => setAmount(value)

    const addToPot = () => {
        const target = dataJson.pots.find(p => p.name === targetPot)
        if (target) {
            target.total = target.total + Number(amount);
            dataJson.balance.current = dataJson.balance.current - Number(amount)
        }
        onSubmit()
    }

    return (
        <>
        <p className="text-preset-4 text-grey-500">Add a specific amount to this pot. The amount will be withdrawn from your available balance and allocated to the selected pot.</p>
        <Input label="Amount to Add" placeholder="e.g. 2000" fullWidth onChange={amountChangeHandler}/>
        <Button label="Confirm Addition" onButtonClick={addToPot}/>
        </>
    )
}