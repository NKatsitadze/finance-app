"use client";
import { useState } from "react";
import Header from "@/components/Header";
import dataJson from "@/data.json";
import PotCard from "@/components/pots/PotCard";
import Modal from "@/components/DesignSystem/Modal";
import AddPotForm from "@/components/pots/AddPotForm";
import EditPotForm from "@/components/pots/EditPotForm";
import DeleteDialog from "@/components/DesignSystem/DeleteDialog";
import AddMoneyForm from "@/components/pots/AddMoneyForm";
import WithdrawMoneyForm from "@/components/pots/WithdrawMoneyForm";


export default function Pots() {
const [requiredAction, setRequiredAction] = useState<ActionKey | ''>('');
  const [targetPot, setTargetPot] = useState('')

  const actionKeys = {
    addPot: 'add-pot',
    editPot: 'edit-pot',
    deletePot: 'delete-pot',
    addMoney: 'add-money',
    withdrawMoney: 'withdraw-money'
  } as const;

  type ActionKey = typeof actionKeys[keyof typeof actionKeys];

  const modalTitlesMap: Record<Exclude<ActionKey, 'delete-pot'>, string> = {
    'add-pot': 'Add New Pot',
    'edit-pot': 'Edit Pot',
    'add-money': 'Add to',
    'withdraw-money': 'Withdraw from',
  };

  const isMoneyAction = (action: ActionKey): action is 'add-money' | 'withdraw-money' =>
    action === actionKeys.addMoney || action === actionKeys.withdrawMoney;

  const editHandler = (potName: string) => {
    setTargetPot(potName)
    setRequiredAction(actionKeys.editPot)
  }

  const popDeleteDialog = (potName: string) => {
    setTargetPot(potName)
    setRequiredAction(actionKeys.deletePot)
  }

  const deletePotHandler = (potName:string) => {
    const targetIndex = dataJson.pots.findIndex(p => p.name === potName)
    dataJson.pots.splice(targetIndex,1)
    closeModal()
  }

  const closeModal = () => setRequiredAction('')

  const getDropdownOptions = (potName:string) => {
    return [
              {
                key: Math.random().toString(),
                label: 'Edit Pot',
                onClick: () => editHandler(potName),
              },
              {
                key: Math.random().toString(),
                label: 'Delete Pot',
                onClick: () => popDeleteDialog(potName),
                color: 'var(--secondary-red)'
              }
            ]
  }

  const addMoneyToPot = (potName:string) => {
    setTargetPot(potName)
    setRequiredAction(actionKeys.addMoney)

  }

  const withdrawMoney = (potName:string) => {
    setTargetPot(potName)
    setRequiredAction(actionKeys.withdrawMoney)

  }

  return (
    <>
      <Header title="Pots" buttonLabel="+ Add New Pot" onButtonClick={() => setRequiredAction(actionKeys.addPot)}/>
      {requiredAction && 
        <Modal
          title={`${modalTitlesMap[requiredAction as keyof typeof modalTitlesMap] ?? ''}${isMoneyAction(requiredAction) ? ' ' + targetPot : ''}`}
          onClose={closeModal}
        >
          {requiredAction === actionKeys.addPot && <AddPotForm onSubmit={closeModal}/>}
          {requiredAction === actionKeys.editPot && <EditPotForm onSubmit={closeModal} targetPot={targetPot}/>}
          {requiredAction === actionKeys.deletePot && <DeleteDialog title={targetPot} closeHandler={closeModal} deleteHandler={deletePotHandler}/>}
          {requiredAction === actionKeys.addMoney && <AddMoneyForm targetPot={targetPot} onSubmit={closeModal}/>}
          {requiredAction === actionKeys.withdrawMoney && <WithdrawMoneyForm targetPot={targetPot} onSubmit={closeModal}/>}
        </Modal>
      }

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {dataJson.pots.map((pot, index) => (
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
