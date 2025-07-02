type recurringBillsType = {
    paidBillsCount: number;
    paidBillsSum: number;
    upcomingBillsCount: number;
    upcomingBillsSum: number;
    dueSoonBillsCount: number;
    dueSoonBillsSum: number;
}

export function getRecurringBillsOverview (recurringBills:recurringBillsType) {

    return [
        {
            label: 'Paid Bills',
            amount: `$${recurringBills.paidBillsSum}`,
            color: 'var(--secondary-green)',
            key: 'paid-bills'
        },
        {
            label: 'Total Upcoming',
            amount: `$${recurringBills.upcomingBillsSum}`,
            color: 'var(--secondary-yellow)',
            key: 'upcoming'
        },
        {
            label: 'Due Soon',
            amount: `$${recurringBills.dueSoonBillsSum}`,
            color: 'var(--secondary-cyan)',
            key: 'due'
        },
    ]
}