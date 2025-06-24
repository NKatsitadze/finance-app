"use client";

import Header from "@/components/Header";
import dataJson from "@/data.json";
import IconBills from "@/components/IconComponents/IconBills";
import RecurringBillsTable from "@/components/recurring-bills/billsTable";

export default function RecurringBills() {
  const transactions = dataJson.transactions.filter((tx) => tx.recurring);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fiveDaysLater = new Date(now);
  fiveDaysLater.setDate(now.getDate() + 5);

  const paidBills = transactions.filter((tx) => {
    const date = new Date(tx.date);
    return date >= startOfMonth && date <= now;
  });
  const paidCount = paidBills.length;
  const paidSum = Math.abs(paidBills.reduce((acc, curr) => acc + curr.amount, 0));

  const upcomingBills = transactions.filter((tx) => {
    const date = new Date(tx.date);
    return date > now && date <= endOfMonth;
  });
  const upcomingCount = upcomingBills.length;
  const upcomingSum = upcomingBills.reduce((acc, curr) => acc + curr.amount, 0);

  const dueSoonBills = upcomingBills.filter((tx) => {
    const date = new Date(tx.date);
    return date <= fiveDaysLater;
  });
  const dueSoonCount = dueSoonBills.length;
  const dueSoonSum = dueSoonBills.reduce((acc, curr) => acc + curr.amount, 0);

  const summaryCardDetails = [
    {
      label: "Paid Bills",
      count: paidCount,
      sum: paidSum,
      color: "text-grey-900",
    },
    {
      label: "Total Upcoming",
      count: upcomingCount,
      sum: upcomingSum,
      color: "text-grey-900",
    },
    {
      label: "Due Soon",
      count: dueSoonCount,
      sum: dueSoonSum,
      color: "text-red",
    },
  ];

  return (
    <>
      <Header title="Recurring Bills"/>

      <section className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-6">
          {/* Total Bills Card */}
          <div
            className="bg-white rounded-xl p-6 shadow-sm flex flex-col gap-8"
            style={{ backgroundColor: "var(--grey-900)" }}
          >
            <IconBills color="var(--white)" />
            <div className="flex flex-col gap-3">
              <h2 className="text-preset-4 text-white">Total Bills</h2>
              <div className="text-preset-1 bold text-white">${paidSum}</div>
            </div>
          </div>

          {/* Summary Card */}
          <div className="text-preset-5 bg-white rounded-xl p-6 shadow-sm flex flex-col">
            <h3 className="text-preset-3 bold text-grey-900 pb-5">Summary</h3>

            {summaryCardDetails.map((item, idx, arr) => (
              <div key={item.label}>
                <div className="flex justify-between">
                  <span className="text-grey-500">{item.label}</span>
                  <span className={`${item.color} bold text-preset-5`}>
                    {item.count} (${Math.abs(item.sum)})
                  </span>
                </div>
                {idx < arr.length - 1 && (
                  <div
                    className="h-px my-4"
                    style={{ backgroundColor: "var(--grey-100)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col gap-4">
          <RecurringBillsTable />
        </div>
      </section>
    </>
  );
}
