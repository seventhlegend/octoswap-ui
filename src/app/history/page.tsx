"use client";

import { useAccount } from "wagmi";
import { motion } from "framer-motion";

export default function HistoryPage() {
  const { isConnected } = useAccount();

  // Sample transaction history (would come from blockchain/API in production)
  const transactions = [
    {
      id: "0x123...",
      type: "Swap",
      from: "ETH",
      to: "ROAR",
      amount: "0.1",
      timestamp: "2024-02-20T10:30:00Z",
      status: "completed",
    },
    // Add more sample transactions...
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h1 className="text-2xl font-bold text-[#011e50] mb-6">
            Transaction History
          </h1>

          {isConnected ? (
            <div className="space-y-4">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="p-4 rounded-xl bg-gray-50 border border-gray-200"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[#011e50] font-medium">
                        {tx.type}
                      </span>
                      <p className="text-sm text-[#011e50]/70">
                        {tx.from} → {tx.to}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[#011e50]">{tx.amount}</span>
                      <p className="text-xs text-[#011e50]/70">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center bg-white/80 backdrop-blur-md rounded-xl px-8 py-6 text-[#011e50] border border-gray-200"
            >
              <div className="mb-2">
                <svg
                  className="w-12 h-12 mx-auto text-[#011e50]/70"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <p className="font-medium text-lg">
                Connect your wallet to view your history
              </p>
              <p className="text-sm text-[#011e50]/60 mt-1">
                Your transaction history will appear here
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
