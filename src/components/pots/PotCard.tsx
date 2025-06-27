"use client";
import Button from "../DesignSystem/Button";
import { Dropdown } from "../DesignSystem/Dropdown";

type PotCardProps = {
  name: string;
  total: number;
  target: number;
  theme: string;
  dropdownOptions: {
    key: string;
    label: string;
    onClick: () => void;
    color?: string;
  }[];
  addMoney: (potName:string) => void;
  withdrawMoney: (potName:string) => void;
};

export default function PotCard({ name, total, target, theme, dropdownOptions, addMoney, withdrawMoney }: PotCardProps) {
  const percentage = Math.min((total / target) * 100, 100);

  return (
    <div className="bg-white rounded-xl p-6 flex flex-col gap-8 shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: theme }}
          ></span>
          <span className="text-preset-2 bold text-grey-900">
            {name}
          </span>
        </div>
        {/* <Button label="..." type="tertiary" onButtonClick={seeAllHandler}/> */}
        <Dropdown options={dropdownOptions}/>
      </div>

      <div className="flex flex-col gap-4 py-1">
          {/* Total Saved */}
          <div className="flex justify-between items-center">
            <span className="text-grey-500 text-preset-4">Total Saved</span>
            <span className="text-grey-900 bold text-preset-1">${total.toFixed(2)}</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${percentage}%`,
                backgroundColor: theme,
              }}
            ></div>
          </div>
          {/* Percentage & Max */}
          <div className="flex justify-between text-preset-5 text-grey-500">
            <span className="bold">{percentage.toFixed(0)}%</span>
            <span>Maximum of ${target.toFixed(2)}</span>
          </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4">
        <Button label="+ Add Money" type="secondary" onButtonClick={() => addMoney(name)}/>
        <Button label="Withdraw" type="secondary" onButtonClick={() => withdrawMoney(name)}/>
      </div>
    </div>
  );
}
