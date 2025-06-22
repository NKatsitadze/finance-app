type balanceType = {
    current: number;
    income: number;
    expenses: number;
}

export function getBalanceCardDetails (balance:balanceType)  {

    return [
        {
        key: 'current',
        label: 'Current Balance',
        amount: balance.current,
        active: true
        },
            {
        key: 'income',
        label: 'Income',
        amount: balance.income,
        },
        {
        key: 'expenses',
        label: 'Expenses',
        amount: balance.expenses,
        }
    ]
}
