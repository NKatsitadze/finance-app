"use client";

import { useState, useEffect, useMemo } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { fetchUserSubcollection } from "@/lib/firestore";
import Header from "@/components/Header";
import Pagination from "@/components/DesignSystem/Pagination";
import Input from "@/components/DesignSystem/Input";
import Select from "@/components/DesignSystem/Select";

type Transaction = {
  avatar: string;
  name: string;
  category: string;
  date: string;
  amount: number;
};

export default function TransactionsPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("latest");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const transactionsPerPage = 10;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const data = await fetchUserSubcollection(user.uid, "transactions");
        setTransactions(data as Transaction[]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(transactions.map((t) => t.category)));
  }, [transactions]);

  const sortedAndFiltered = useMemo(() => {
    let filtered = [...transactions];

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
      default:
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
    }

    return filtered;
  }, [sortBy, categoryFilter, searchTerm, transactions]);

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * transactionsPerPage;
    return sortedAndFiltered.slice(start, start + transactionsPerPage);
  }, [currentPage, sortedAndFiltered]);

  if (loading) {
    return <div className="p-4">Loading transactions...</div>;
  }

  return (
    <>
      <Header title="Transactions" />

      <main className="bg-white w-full flex-1 flex flex-col rounded-xl p-8">
        {/* Filter/Search/Sort Header */}
        <section className="flex items-center justify-between mb-6">
          <Input
            placeholder="Search transaction"
            onChange={(v) => {
              setSearchTerm(v);
              setCurrentPage(1);
            }}
            aria-label="Search transactions"
          />

          <div className="flex items-center justify-end gap-6">
            <Select
              label="Sort by"
              labelAside
              options={[
                { label: "Latest", value: "latest", key: "latest" },
                { label: "Oldest", value: "oldest", key: "oldest" },
                { label: "A to Z", value: "az", key: "az" },
                { label: "Z to A", value: "za", key: "za" },
                { label: "Highest", value: "high", key: "high" },
                { label: "Lowest", value: "low", key: "low" },
              ]}
              onChange={(v) => {
                setSortBy(v);
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
                  value: cat,
                  key: cat,
                })),
              ]}
              onChange={(v) => {
                setCategoryFilter(v);
                setCurrentPage(1);
              }}
            />
          </div>
        </section>

        {/* Transactions Table */}
        <section>
          <table className="w-full text-sm">
            <thead className="text-preset-5 border-b py-6 px-4" style={{ color: "var(--grey-500)", borderColor: "var(--grey-100)" }}>
              <tr className="grid px-4 py-2" style={{ gridTemplateColumns: "2fr 0.8fr 0.8fr 1.2fr" }}>
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
                    <img src={avatar} alt={name} className="w-[40px] h-[40px] rounded-full" />
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
                  <td className={`text-right font-semibold ${amount > 0 ? "text-green-600" : "text-gray-800"}`}>
                    {amount >= 0 ? `+$${amount}` : `-$${Math.abs(amount)}`}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Pagination */}
        <div className="mt-6">
          <Pagination
            totalPages={Math.ceil(sortedAndFiltered.length / transactionsPerPage)}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </main>
    </>
  );
}
