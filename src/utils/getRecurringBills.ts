type Transaction = {
  title: string;
  amount: number;
  date: string;
  recurring: boolean;
};

type RecurringBillSummary = {
  paidBillsCount: number;
  paidBillsSum: number;
  upcomingBillsCount: number;
  upcomingBillsSum: number;
  dueSoonBillsCount: number;
  dueSoonBillsSum: number;
};

export function getRecurringBills(allTransactions: Transaction[]): RecurringBillSummary {
  const transactions = allTransactions.filter((tx) => tx.recurring)

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  const fiveDaysLater = new Date(now)
  fiveDaysLater.setDate(now.getDate() + 5)

  const paidBills = transactions.filter((tx) => {
    const date = new Date(tx.date)
    return date >= startOfMonth && date <= now
  })
  const paidBillsCount = paidBills.length
  const paidBillsSum = Math.abs(
    paidBills.reduce((acc, curr) => acc + Number(curr.amount), 0)
  )

  const upcomingBills = transactions.filter((tx) => {
    const date = new Date(tx.date)
    return date > now && date <= endOfMonth
  })
  const upcomingBillsCount = upcomingBills.length
  const upcomingBillsSum = upcomingBills.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  )

  const dueSoonBills = upcomingBills.filter((tx) => {
    const date = new Date(tx.date)
    return date <= fiveDaysLater
  })
  const dueSoonBillsCount = dueSoonBills.length
  const dueSoonBillsSum = dueSoonBills.reduce(
    (acc, curr) => acc + Number(curr.amount),
    0
  )

  return {
    paidBillsCount,
    paidBillsSum,
    upcomingBillsCount,
    upcomingBillsSum,
    dueSoonBillsCount,
    dueSoonBillsSum
  }
}
