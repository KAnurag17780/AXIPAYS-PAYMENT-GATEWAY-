"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Inbox,
} from "lucide-react";
import { GlassCard, GlassCardHeader } from "@/components/ui/GlassCard";
import { Input } from "@/components/ui/Input";
import { AnimatedBadge } from "@/components/ui/AnimatedBadge";
import { Button } from "@/components/ui/Button";
import { TableRowSkeleton } from "@/components/ui/Skeleton";
import { maskCardNumber } from "@/lib/luhn";
import type { Transaction } from "@/types/transaction";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

type SortField = "createdAt" | "amount";
type SortDirection = "asc" | "desc";

const ITEMS_PER_PAGE = 10;

function formatExpiry(month: string, year: string): string {
  return `${month.padStart(2, "0")} / ${year}`;
}

export function TransactionTable({
  transactions,
  isLoading,
}: TransactionTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const filteredTransactions = useMemo(() => {
    if (!searchQuery.trim()) return transactions;
    const query = searchQuery.toLowerCase();
    return transactions.filter(
      (tx) =>
        tx.orderId?.toLowerCase().includes(query) ||
        tx.email?.toLowerCase().includes(query)
    );
  }, [transactions, searchQuery]);

  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      let comparison = 0;
      if (sortField === "createdAt") {
        comparison =
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortField === "amount") {
        comparison = a.amount - b.amount;
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [filteredTransactions, sortField, sortDirection]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE)
  );
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <GlassCard hover={false}>
      <GlassCardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h3 className="text-base font-semibold text-white">Transactions</h3>
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by email or order ID..."
            leftIcon={<Search className="h-4 w-4" />}
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            id="transaction-search"
          />
        </div>
      </GlassCardHeader>

      <div className="overflow-x-auto">
        <table className="w-full text-sm" id="transactions-table">
          <thead>
            <tr className="border-b border-white/5 bg-white/[0.02]">
              <th className="px-4 py-3 text-left font-medium text-[#6b6b80]">
                Order ID
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#6b6b80]">
                Card Number
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#6b6b80]">
                Email
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#6b6b80]">
                Expiry
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#6b6b80]">
                CVC
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#6b6b80]">
                <button
                  onClick={() => handleSort("amount")}
                  className="inline-flex items-center gap-1 hover:text-[#a0a0b8] transition-colors cursor-pointer"
                >
                  Amount
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#6b6b80]">
                Currency
              </th>
              <th className="px-4 py-3 text-left font-medium text-[#6b6b80]">
                <button
                  onClick={() => handleSort("createdAt")}
                  className="inline-flex items-center gap-1 hover:text-[#a0a0b8] transition-colors cursor-pointer"
                >
                  Status
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              [...Array(5)].map((_, i) => <TableRowSkeleton key={i} />)
            ) : paginatedTransactions.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-[#6b6b80]">
                    <Inbox className="h-12 w-12 text-[#2a2a3e]" />
                    <div>
                      <p className="font-medium text-[#a0a0b8]">
                        No transactions found
                      </p>
                      <p className="text-sm">
                        {searchQuery
                          ? "Try adjusting your search terms"
                          : "Transactions will appear here once processed"}
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedTransactions.map((tx, index) => (
                <motion.tr
                  key={tx._id || index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className={`border-b border-white/5 hover:bg-[#1a1a2e] transition-colors ${
                    index % 2 === 1 ? "bg-white/[0.01]" : ""
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-xs text-[#a0a0b8]">
                    {tx.orderId ? tx.orderId.slice(0, 12) + "..." : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-[#a0a0b8]">
                    {tx.cardNumber ? maskCardNumber(tx.cardNumber) : "—"}
                  </td>
                  <td className="px-4 py-3 text-[#a0a0b8] max-w-[180px] truncate">
                    {tx.email || "—"}
                  </td>
                  <td className="px-4 py-3 text-[#a0a0b8]">
                    {tx.expiryMonth && tx.expiryYear
                      ? formatExpiry(tx.expiryMonth, tx.expiryYear)
                      : "—"}
                  </td>
                  <td className="px-4 py-3 font-mono text-[#6b6b80]">•••</td>
                  <td className="px-4 py-3 font-semibold text-white tabular-nums text-right">
                    {typeof tx.amount === "number"
                      ? tx.amount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-[#a0a0b8] font-medium uppercase">
                    {tx.currency || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <AnimatedBadge
                      status={tx.status || "pending"}
                      delay={index * 0.05}
                    />
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {!isLoading && sortedTransactions.length > 0 && (
        <div className="px-6 py-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6b6b80]">
            Showing{" "}
            <span className="font-medium text-[#a0a0b8]">
              {(currentPage - 1) * ITEMS_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-[#a0a0b8]">
              {Math.min(
                currentPage * ITEMS_PER_PAGE,
                sortedTransactions.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-medium text-[#a0a0b8]">
              {sortedTransactions.length}
            </span>{" "}
            transactions
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              id="prev-page-btn"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                      currentPage === pageNum
                        ? "bg-[#6c63ff] text-white"
                        : "text-[#a0a0b8] hover:bg-white/5"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              id="next-page-btn"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </GlassCard>
  );
}
