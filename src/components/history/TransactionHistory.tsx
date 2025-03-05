"use client";

import { useState, useMemo } from "react";
import { useAccount } from "wagmi";
import { formatDateTime, shortenAddress } from "@/utils";
import { useGlobalState } from "@/context/GlobalContext";

// Define types for transactions and sorting/filtering
type TransactionType = "swap" | "addLiquidity" | "removeLiquidity" | "all";
type SortField = "date" | "type" | "amount";
type SortDirection = "asc" | "desc";

interface Transaction {
  id: string;
  type: Exclude<TransactionType, "all">;
  timestamp: number;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  account: string;
  txHash: string;
  status: "completed" | "pending" | "failed";
}

interface TransactionHistoryState {
  filter: TransactionType;
  sortBy: SortField;
  sortDirection: SortDirection;
  page: number;
  itemsPerPage: number;
}

export default function TransactionHistory() {
  const { address } = useAccount();
  const { state } = useGlobalState();

  // Local state management
  const [historyState, setHistoryState] = useState<TransactionHistoryState>({
    filter: "all",
    sortBy: "date",
    sortDirection: "desc",
    page: 1,
    itemsPerPage: 10,
  });

  // Mock data - replace with actual transaction fetching
  const transactions: Transaction[] = useMemo(() => [], []);

  // Filter transactions based on type and account
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (historyState.filter === "all") return true;
      return tx.type === historyState.filter;
    });
  }, [transactions, historyState.filter]);

  // Sort filtered transactions
  const sortedTransactions = useMemo(() => {
    return [...filteredTransactions].sort((a, b) => {
      const modifier = historyState.sortDirection === "asc" ? 1 : -1;

      switch (historyState.sortBy) {
        case "date":
          return (a.timestamp - b.timestamp) * modifier;
        case "type":
          return a.type.localeCompare(b.type) * modifier;
        case "amount":
          return (Number(a.fromAmount) - Number(b.fromAmount)) * modifier;
        default:
          return 0;
      }
    });
  }, [filteredTransactions, historyState.sortBy, historyState.sortDirection]);

  // Paginate transactions
  const paginatedTransactions = useMemo(() => {
    const startIndex = (historyState.page - 1) * historyState.itemsPerPage;
    return sortedTransactions.slice(
      startIndex,
      startIndex + historyState.itemsPerPage
    );
  }, [sortedTransactions, historyState.page, historyState.itemsPerPage]);

  // Handle sort change
  const handleSort = (field: SortField) => {
    setHistoryState((prev) => ({
      ...prev,
      sortBy: field,
      sortDirection:
        prev.sortBy === field && prev.sortDirection === "asc" ? "desc" : "asc",
    }));
  };

  return (
    <div className="space-y-4">
      {/* Filters and Controls */}
      <div className="flex flex-wrap gap-4 items-center p-4 bg-white dark:bg-gray-800 rounded-lg">
        <select
          value={historyState.filter}
          onChange={(e) =>
            setHistoryState((prev) => ({
              ...prev,
              filter: e.target.value as TransactionType,
              page: 1,
            }))
          }
          className="rounded-lg border px-3 py-2"
        >
          <option value="all">All Transactions</option>
          <option value="swap">Swaps</option>
          <option value="addLiquidity">Add Liquidity</option>
          <option value="removeLiquidity">Remove Liquidity</option>
        </select>

        <select
          value={`${historyState.sortBy}-${historyState.sortDirection}`}
          onChange={(e) => {
            const [field, direction] = e.target.value.split("-");
            setHistoryState((prev) => ({
              ...prev,
              sortBy: field as SortField,
              sortDirection: direction as SortDirection,
            }));
          }}
          className="rounded-lg border px-3 py-2"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="type-asc">Type (A-Z)</option>
          <option value="type-desc">Type (Z-A)</option>
          <option value="amount-desc">Amount (High-Low)</option>
          <option value="amount-asc">Amount (Low-High)</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  Date
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("type")}
                >
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {formatDateTime(new Date(tx.timestamp))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                      {tx.type.replace(/([A-Z])/g, " $1").trim()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {tx.type === "swap" ? (
                        <span>
                          {tx.fromAmount} {tx.fromToken} → {tx.toAmount}{" "}
                          {tx.toToken}
                        </span>
                      ) : (
                        <span>
                          {tx.fromAmount} {tx.fromToken} / {tx.toAmount}{" "}
                          {tx.toToken}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${
                            tx.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : tx.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {sortedTransactions.length > historyState.itemsPerPage && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() =>
              setHistoryState((prev) => ({
                ...prev,
                page: Math.max(1, prev.page - 1),
              }))
            }
            disabled={historyState.page === 1}
            className="px-4 py-2 rounded-lg border disabled:opacity-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {historyState.page} of{" "}
            {Math.ceil(sortedTransactions.length / historyState.itemsPerPage)}
          </span>
          <button
            onClick={() =>
              setHistoryState((prev) => ({
                ...prev,
                page: Math.min(
                  Math.ceil(
                    sortedTransactions.length / historyState.itemsPerPage
                  ),
                  prev.page + 1
                ),
              }))
            }
            disabled={
              historyState.page ===
              Math.ceil(sortedTransactions.length / historyState.itemsPerPage)
            }
            className="px-4 py-2 rounded-lg border disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
