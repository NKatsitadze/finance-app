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
  const [searchTerm, setSearchTerm] = useState("");

  const pageChangeHandler = (page: number) => setCurrentPage(page);

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

    if (searchTerm) {
      filtered = filtered.filter((t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [sortBy, categoryFilter, searchTerm]);

  const totalTransactions = sortedAndFiltered.length;
  const totalPages = Math.ceil(totalTransactions / transactionsPerPage);
  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * transactionsPerPage;
    return sortedAndFiltered.slice(start, start + transactionsPerPage);
  }, [currentPage, sortedAndFiltered]);

  const inputHandler = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const getSortingSelectOptions = () => [
    { label: "Latest", value: "latest", key: "latest" },
    { label: "Oldest", value: "oldest", key: "oldest" },
    { label: "A to Z", value: "az", key: "az" },
    { label: "Z to A", value: "za", key: "za" },
    { label: "Highest", value: "high", key: "high" },
    { label: "Lowest", value: "low", key: "low" },
  ];

  return (
    <>
      <Header title="Transactions" />

      <main className="bg-white w-full flex-1 flex flex-col rounded-xl p-8">
        {/* Filter/Search/Sort Header */}
        <section aria-labelledby="filter-section" className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search transaction"
              onChange={inputHandler}
              aria-label="Search transactions"
            />
          </div>

          <div className="flex items-center justify-end gap-6 flex-1">
            <Select
              label="Sort by"
              labelAside
              options={getSortingSelectOptions()}
              onChange={(value) => {
                setSortBy(value);
                setCurrentPage(1);
              }}
            />
            <Select
              label="Category"
              labelAside
              options={[
                { label: "All", value: "", key: "all" },
                ...categories.map((cat) => ({
                  label: cat,
                  value: cat.toLowerCase(),
                  key: cat.toLowerCase(),
                })),
              ]}
              onChange={(value) => {
                setCategoryFilter(value);
                setCurrentPage(1);
              }}
            />
          </div>
        </section>

        {/* Transaction Table */}
        <section aria-labelledby="transactions-section">
          <table className="w-full text-sm">
            <thead className="text-preset-5 border-b py-6 px-4" style={{ color: "var(--grey-500)", borderColor: "var(--grey-100)" }}>
              <tr style={{ gridTemplateColumns: "2fr 0.8fr 0.8fr 1.2fr" }} className="grid px-4 py-2">
                <th className="text-left">Recipient / Sender</th>
                <th className="text-left">Category</th>
                <th className="text-left">Date</th>
                <th className="text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {paginatedTransactions.map(({ avatar, name, category, date, amount }, index) => (
                <tr
                  key={index}
                  className="grid items-center py-4 px-4 border-b border-gray-100"
                  style={{ gridTemplateColumns: "2fr 0.8fr 0.8fr 1.2fr" }}
                >
                  <td className="flex items-center gap-3">
                    <img
                      className="w-[40px] h-[40px] rounded-full"
                      src={avatar}
                      alt={`${name}'s avatar`}
                    />
                    <span className="text-gray-900">{name}</span>
                  </td>
                  <td className="text-gray-700 truncate">{category}</td>
                  <td className="text-gray-500">
                    {new Date(date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td
                    className={`text-right font-semibold ${
                      amount > 0 ? "text-green-600" : "text-gray-800"
                    }`}
                  >
                    {amount >= 0 ? `+$${amount}` : `-$${Math.abs(amount)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Pagination */}
        <div className="mt-6 mt-auto">
          <Pagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={pageChangeHandler}
          />
        </div>
      </main>
    </>
  );
}
