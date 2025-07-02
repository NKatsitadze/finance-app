import { useMemo } from 'react'
import { Dropdown } from '../DesignSystem/Dropdown'
import Button from '../DesignSystem/Button'

type Transaction = {
  name: string;
  avatar: string;
  amount: number;
  date: string;
  category: string;
};

type dropdownOptionsType = {
  key: string;
  label: string;
  onClick: () => void;
  color?: string;
};

type BudgetCardProps = {
  category: string;
  color: string;
  maximum: number;
  amount: number;
  transactions: Transaction[];
  dropdownOptions: dropdownOptionsType[];
};

export default function BudgetCard({ category, color, maximum, amount, transactions, dropdownOptions }: BudgetCardProps) {
  const remaining = maximum - amount
  const progress = Math.min((amount / maximum) * 100, 100)

  const latestTransactions = useMemo(() => {
    return transactions
      .filter((t) => t.category === category)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
  }, [transactions, category])

  const onButtonClick = (e: string) => {
  }

  return (
    <div className="bg-white rounded-xl p-8 flex flex-col gap-5">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></span>
          <span className="text-preset-2 text-grey-900 bold">{category}</span>
        </div>
        <Dropdown options={dropdownOptions}/>
      </div>

      <div className="flex flex-col gap-4">
          {/* Maximum Info */}
          <div className="text-preset-4" style={{ color: 'var(--grey-500)' }}>
            Maximum of ${maximum}
          </div>
          {/* Progress Bar */}
          <div className="w-full h-[32px] p-1 rounded-sm bg-gray-200 overflow-hidden" style={{ backgroundColor: 'var(--beige-100)' }}>
            <div className=" h-full rounded-sm" style={{ width: `${progress}%`, backgroundColor: color }}></div>
          </div>
          {/* Stats */}
            <div className="flex justify-between gap-4">
            {/* Spent */}
            <div className="flex-1 relative pl-4">
                <div className="absolute top-0 left-0 h-full w-1 rounded-sm" style={{ backgroundColor: color }}></div>
                <div className="text-preset-5 text-grey-500">Spent</div>
                <div className="text-preset-4 text-grey-900 bold">${amount}</div>
            </div>

            {/* Remaining */}
            <div className="flex-1 relative pl-4">
                <div className="absolute top-0 left-0 h-full w-1 rounded-sm" style={{ backgroundColor: 'var(--beige-100)' }}></div>
                <div className="text-preset-5 text-grey-500">Remaining</div>
                <div className="text-preset-4 text-grey-900 bold">${remaining}</div>
            </div>
            </div>
      </div>

      {/* Latest Spending Card */}
      <div className="rounded-xl px-5 py-3 flex flex-col gap-5" style={{backgroundColor: 'var(--beige-100)'}}>
        <div className="flex justify-between items-center">
          <span className="text-preset-3 bold text-grey-900">Latest Spending</span>
          <Button type='tertiary' onButtonClick={() => onButtonClick(category)} label="See all"/>
        </div>

        <ul className="divide-y divide-gray-200">
            {latestTransactions.map((tx, index) => (
            <li key={index} className="flex justify-between items-center p-[12px]">
                <div className="flex items-center gap-4">
                <img src={tx.avatar} alt={tx.name} className="w-[32px] h-[32px] rounded-full" />
                <span className="text-grey-900 bold text-preset-5">{tx.name}</span>
                </div>
                
                <div className="flex flex-col items-end gap-1">
                    <span className="text-preset-5 text-grey-900 bold">
                        {tx.amount >= 0 ? `+$${tx.amount}` : `-$${Math.abs(tx.amount)}`}
                    </span>
                    <span className="text-preset-5 text-grey-500">
                        {new Date(tx.date).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        })}
                    </span>
                </div>
            </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
