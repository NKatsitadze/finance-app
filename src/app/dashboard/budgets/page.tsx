"use client"
import { useState } from "react";
import Header from "@/components/Header";
import Chart from "@/components/Chart";
import BudgetCard from "@/components/budgets/BudgetCard";
import dataJson from '@/data.json'
import Modal from "@/components/DesignSystem/Modal";
import AddBudgetForm  from "@/components/budgets/AddBudgetForm";
import EditBudgetForm  from "@/components/budgets/EditBudgetForm";
import DeleteDialog from "@/components/DesignSystem/DeleteDialog";

export default function Home() {
  const [requiredAction, setRequiredAction] = useState('')
  const actionKeys = {
    addBudget: 'add-budget',
    editBudget: 'edit-budget',
    deleteBudget: 'delete-budget'
  }

  const budgetsChartDetails = dataJson.budgets.map(budget => {
    return { name: budget.category, value: budget.maximum }
  })
  const budgetsChartColors = dataJson.budgets.map(budget => {
    return budget.theme
  })

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const budgetDetails = dataJson.budgets.map((budget) => {
    const totalAmount = dataJson.transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        return (
          transaction.category === budget.category &&
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
      })
      .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0); // abs in case amounts are negative

    return {
      key: Math.random(),
      maximum: budget.maximum,
      label: budget.category,
      color: budget.theme,
      amount: totalAmount,
    };
  });

    const [targetedBudget, setTargetedBudget] = useState('')
    const editHandler = (budgetName:string) => {
      setTargetedBudget(budgetName)
      setRequiredAction(actionKeys.editBudget)
    }

    const closeModal = () => setRequiredAction('')

    const popDeleteDialog = (budgetName:string) => {
      setTargetedBudget(budgetName)
      setRequiredAction(actionKeys.deleteBudget)      
    }

    const deleteHandler = (budgetName:string) => {
      const targetIndex = dataJson.budgets.findIndex(b => b.category === budgetName)
      dataJson.budgets.splice(targetIndex,1)
      closeModal()
    }

    const getDropdownOptions = (budgetName:string) => {
      return [
                {
                  key: Math.random().toString(),
                  label: 'Edit Budget',
                  onClick: () => editHandler(budgetName),
                },
                {
                  key: Math.random().toString(),
                  label: 'Delete Budget',
                  onClick: () => popDeleteDialog(budgetName),
                  color: 'var(--secondary-red)'
                }
              ]
    }


  return (
      <>  
          {requiredAction && 
          <Modal 
          title={`${requiredAction === 'add-budget' ? 'Add New Budget' : 'Edit Budget'}`}
          onClose={() => closeModal()}
          >
            {requiredAction === 'add-budget' && <AddBudgetForm onSubmit={() => closeModal()}/>}
            {requiredAction === 'edit-budget' && <EditBudgetForm targetBudget={targetedBudget} onSubmit={() => closeModal()}/>}
            {requiredAction === 'delete-budget' && <DeleteDialog title={targetedBudget} closeHandler={() => closeModal()} deleteHandler={deleteHandler}/>}
          </Modal>}

          <Header title="Budgets" buttonLabel="+ Add New Budget" onButtonClick={() => setRequiredAction(actionKeys.addBudget)}/>
          <article className="w-full flex gap-6 rounded-xl">

            <div className="basis-[40%] h-fit bg-white rounded-xl p-8 flex flex-col gap-8 sticky top-0">
              <Chart data={budgetsChartDetails} colors={budgetsChartColors} />
                
              <div className="flex flex-col gap-6">
                <span className="bold text-preset-2" style={{ color: 'var(--grey-900)' }}>Spending Summary</span>

                <div>
                  {budgetDetails.map((item, index) => (
                    <div key={item.key}>
                      <div className="flex justify-between relative pl-4 rounded-xl">
                        <span
                          className="absolute w-[4px] rounded-xl h-full top-0 left-0"
                          style={{ backgroundColor: item.color }}
                        ></span>
                        <span className="text-preset-4" style={{ color: 'var(--grey-500)' }}>
                          {item.label}
                        </span>
                        <div>
                          <span className="text-preset-4 bold"  style={{ color: 'var(--grey-900)' }}>${item.amount}</span>
                          <span className="text-preset-5" style={{ color: 'var(--grey-500)' }}> of ${item.maximum}</span>
                        </div>
                      </div>
                      {index !== budgetDetails.length - 1 && (
                        <div
                          className="my-4 w-full"
                          style={{ height: '1px', backgroundColor: 'var(--grey-100)' }}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="basis-[60%] flex flex-col gap-6">
                <div className="grid gap-6">
                  {budgetDetails.map((item) => (
                    <BudgetCard
                      key={item.key}
                      category={item.label}
                      color={item.color}
                      maximum={item.maximum}
                      amount={item.amount}
                      transactions={dataJson.transactions}
                      dropdownOptions={getDropdownOptions(item.label)}
                    />
                  ))}
                </div>
            </div>

          </article>

      </>    
  );
}
