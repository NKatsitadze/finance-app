"use client";

import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Pagination from "@/components/DesignSystem/Pagination";
import Input from "@/components/DesignSystem/Input";
import Select from "@/components/DesignSystem/Select";
import dataJson from "@/data.json";

type Transaction = {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
};

export default function TransactionsPage() {
  const transactionsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("");

  const pageChangeHandler = (page: number) => {
    setCurrentPage(page);
  };

  const categories = useMemo(() => {
    return Array.from(new Set(dataJson.transactions.map((t) => t.category)));
  }, []);

  const sortedAndFiltered = useMemo(() => {
    let filtered: Transaction[] = [...dataJson.transactions];

    if (categoryFilter) {
      filtered = filtered.filter(
        (t) => t.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    switch (sortBy) {
      case "oldest":
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "az":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "za":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "high":
        filtered.sort((a, b) => b.amount - a.amount);
        break;
      case "low":
        filtered.sort((a, b) => a.amount - b.amount);
        break;
      case "latest":
      default:
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }

    return filtered;
  }, [sortBy, categoryFilter]);


  const totalTransactions = sortedAndFiltered.length;
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * transactionsPerPage;
    return sortedAndFiltered.slice(start, start + transactionsPerPage);
  }, [currentPage, sortedAndFiltered]);

  return (
    <>
      <Header title="Transactions" />

      <article className="bg-white w-full flex-1 flex flex-col rounded-xl p-8">
        {/* Filter/Search/Sort Header */}
        <div className="flex items-center justify-between">

        <div className="flex-1">
          <Input placeholder="Search transaction" />
        </div>

          <div className="flex items-center justify-end gap-6 flex-1">

            <div className="flex-shrink-0">
              <Select
                label="Sort by"
                labelAside
                options={[
                  { label: "Latest", value: "latest" },
                  { label: "Oldest", value: "oldest" },
                  { label: "A to Z", value: "az" },
                  { label: "Z to A", value: "za" },
                  { label: "Highest", value: "high" },
                  { label: "Lowest", value: "low" },
                ]}
                onChange={(value) => {
                  setSortBy(value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <div className="flex-shrink-0">
              <Select
                label="Category"
                labelAside
                options={[
                  { label: "All", value: "" },
                  ...categories.map((cat) => ({
                    label: cat,
                    value: cat.toLowerCase(),
                  })),
                ]}
                onChange={(value) => {
                  setCategoryFilter(value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
        </div>

        {/* Table Headings */}
        <div
          className="grid border-b py-6 px-4 text-preset-5"
          style={{
            gridTemplateColumns: "2fr 0.8fr 0.8fr 1.2fr",
            borderColor: "var(--grey-100)",
            color: "var(--grey-500)",
          }}
        >
          <span>Recipient / Sender</span>
          <span>Category</span>
          <span>Date</span>
          <span className="text-right">Amount</span>
        </div>

        {/* Table Rows */}
        <ul className="divide-y divide-gray-100">
          {paginatedTransactions.map(({ avatar, name, category, date, amount }, index) => (
            <li
              key={index}
              className="grid items-center py-4 px-4 text-sm"
              style={{ gridTemplateColumns: "2fr 0.8fr 0.8fr 1.2fr" }}
            >
              <div className="flex items-center gap-3">
                <img className="w-[40px] h-[40px] rounded-full" src={avatar} alt="avatar" />
                <span className="text-gray-900">{name}</span>
              </div>
              <span className="text-gray-700 truncate">{category}</span>
              <span className="text-gray-500">
                {new Date(date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              <span
                className={`text-right font-semibold ${
                  amount > 0 ? "text-green-600" : "text-gray-800"
                }`}
              >
                {amount >= 0 ? `+$${amount}` : `-$${Math.abs(amount)}`}
              </span>
            </li>
          ))}
        </ul>

        {/* Pagination */}
        <div className="mt-6 mt-auto">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={pageChangeHandler}
          />
        </div>
      </article>
    </>
  );
}
