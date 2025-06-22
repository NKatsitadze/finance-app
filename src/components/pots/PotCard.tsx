"use client";

// import { MoreHorizontal } from "lucide-react";

type PotCardProps = {
  name: string;
  total: number;
  target: number;
  theme: string;
};

export default function PotCard({ name, total, target, theme }: PotCardProps) {
  const percentage = Math.min((total / target) * 100, 100);
  const remaining = Math.max(target - total, 0).toFixed(2);

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
        <button className="p-1 text-grey-500 hover:text-grey-900">
            Test button
          {/* <MoreHorizontal size={20} /> */}
        </button>
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
      <div className="flex gap-4">
        <button  className="h-[53px] flex-1 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: theme }}>
          Add Money
        </button>
        <button  className="h-[53px] flex-1 py-2 rounded-lg text-grey-900 font-semibold border" style={{ borderColor: theme }}>
          Withdraw
        </button>
      </div>
    </div>
  );
}
