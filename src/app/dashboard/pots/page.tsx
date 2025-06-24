"use client";
import Header from "@/components/Header";
import dataJson from "@/data.json";
import PotCard from "@/components/pots/PotCard";

export default function Pots() {
  const potsDropdowns = [
  
  ]

  dataJson.pots.forEach((pot) => {
    potsDropdowns.push({
      key: Math.random(),
      // label:

      
    })
  })

  const editHandler = (potName: string) => {
    console.log('edit ',potName)
  }

  const deleteHandler = (potName: string) => {
    console.log('delete ',potName)
  }

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
                onClick: () => deleteHandler(potName),
                color: 'var(--secondary-red)'
              }
            ]
  }

  return (
    <>
      <Header title="Pots" buttonLabel="+ Add New Pot" />

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {dataJson.pots.map((pot, index) => (
          <PotCard
            key={index}
            name={pot.name}
            total={pot.total}
            target={pot.target}
            theme={pot.theme}
            dropdownOptions={getDropdownOptions(pot.name)}
          />
        ))}
      </section>
    </>
  )
}
