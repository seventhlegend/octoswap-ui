"use client";

import TransactionHistory from "@/components/history/TransactionHistory";

export default function HistoryPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Transaction History
      </h1>
      <TransactionHistory />
    </div>
  );
}
