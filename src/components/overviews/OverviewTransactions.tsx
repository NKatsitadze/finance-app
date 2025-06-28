import { Fragment } from "react"
import { formatDate } from "@/utils/formatDate"

type transactionType = {
    amount?: number;
    avatar?: string;
    date?: string;
    name?: string;
    recurring?: boolean;
}

type slicedSortedTransactionsType = {
    slicedSortedTransactions: transactionType[]
}

export function OverviewTransactions ({slicedSortedTransactions}: slicedSortedTransactionsType) {
    return (
        <>
            {slicedSortedTransactions &&
                slicedSortedTransactions.map(({ avatar, name, date, amount }, index) => (
                <Fragment key={index}>
                    <div className="grid grid-cols-2 justify-between">
                    <div className="flex items-center gap-4">
                        <img src={avatar} alt="avatar" className="w-[40px] rounded-[50%]" />
                        <span className="bold text-preset-4" style={{ color: 'var(--grey-900)' }}>{name}</span>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <span className="bold" style={{ color: amount > 0 ? 'var(--secondary-green)' : 'var(--grey-900)' }}>
                        {amount >= 0 ? `+$${amount}` : `${String(amount).slice(0, 1)}$${String(amount).slice(1)}`}
                        </span>
                        <span style={{ color: 'var(--grey-500)' }}>{formatDate(date)}</span>
                    </div>
                    </div>

                    {index !== slicedSortedTransactions.length - 1 && (
                    <div className="mt-4 mb-4" style={{ backgroundColor: 'var(--grey-100)', width: '100%', height: '1px' }}></div>
                    )}
                </Fragment>
            ))}
        </>
    )
}
