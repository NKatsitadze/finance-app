type BalanceCardProps = {
    label: string;
    amount: string | number;
    active?: boolean;
};

import styles from './BalanceCard.module.css'

export default function BalanceCard({ label, amount, active }: BalanceCardProps) {
  return (
    <div className={`${active ? styles['bg-dark'] : 'bg-white'} balance-card shadow max-w-sm rounded-xl flex-1 p-6 spacing-6 flex flex-col whitespace-nowrap`}>
      <span className={`${active ? styles.white : styles.label} block text-preset-4"`}>{label}</span>
      <span className={`${active ? styles.white : styles.amount} block bold text-preset-1`}>${amount}</span>
    </div>
  )
}
