"use client"
import { useState } from "react"
import Input from "../DesignSystem/Input"
import Button from "../DesignSystem/Button"
import dataJson from '@/data.json'

type formProps = {
    onSubmit: () => void;
    targetPot: string;
}

export default function WithdrawMoneyFromPotForm ({ onSubmit, targetPot }:formProps) {
    const [amount, setAmount] = useState('')
    const amountChangeHandler = (value:string) => setAmount(value)

    const withdrawFromPot = () => {
        const target = dataJson.pots.find(p => p.name === targetPot)
        if (target) {
            target.total = target.total - Number(amount);
            dataJson.balance.current = dataJson.balance.current + Number(amount)
        }
        onSubmit()
    }

    return (
        <>
        <p className="text-preset-4 text-grey-500">Withdraw a specific amount from this pot. The amount will be withdrawn from your pot and allocated to your current balance.</p>
        <Input label="Amount to Withdraw" placeholder="e.g. 2000" fullWidth onChange={amountChangeHandler}/>
        <Button label="Confirm Withdrawal" onButtonClick={withdrawFromPot}/>
        </>
    )
}