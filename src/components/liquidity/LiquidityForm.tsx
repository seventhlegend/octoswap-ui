"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";
import { slideIn, fadeIn, buttonHover } from "@/utils/animations";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function LiquidityForm() {
  const { isConnected } = useAccount();
  const [action, setAction] = useState<"add" | "remove">("add");
  const [token0, setToken0] = useState("");
  const [token1, setToken1] = useState("");
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement liquidity action logic here
  };

  return (
    <motion.form
      initial="initial"
      animate="animate"
      exit="exit"
      variants={slideIn}
      onSubmit={handleSubmit}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="space-y-6">
        {/* Action Toggle */}
        <motion.div variants={fadeIn} className="flex gap-2">
          {["add", "remove"].map((actionType) => (
            <button
              key={actionType}
              type="button"
              onClick={() => setAction(actionType as "add" | "remove")}
              className={`flex-1 py-3 rounded-lg transition-all ${
                action === actionType
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
            >
              {actionType === "add" ? "Add Liquidity" : "Remove Liquidity"}
            </button>
          ))}
        </motion.div>

        {/* Token Inputs */}
        <motion.div variants={fadeIn} className="space-y-4">
          {/* First Token */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">First Token</label>
              {token0 && (
                <span className="text-sm text-gray-500">
                  Balance: {/* Add balance display */}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={token0}
                onChange={(e) => setToken0(e.target.value)}
                className="rounded-lg border p-2 bg-gray-50 dark:bg-gray-700 transition-colors focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select token</option>
                <option value="ETH">ETH</option>
                <option value="USDC">USDC</option>
              </select>
              <input
                type="number"
                value={amount0}
                onChange={(e) => setAmount0(e.target.value)}
                className="rounded-lg border p-2 bg-gray-50 dark:bg-gray-700 transition-colors focus:ring-2 focus:ring-blue-500"
                placeholder="0.0"
              />
            </div>
          </div>

          {/* Second Token */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium">Second Token</label>
              {token1 && (
                <span className="text-sm text-gray-500">
                  Balance: {/* Add balance display */}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <select
                value={token1}
                onChange={(e) => setToken1(e.target.value)}
                className="rounded-lg border p-2 bg-gray-50 dark:bg-gray-700 transition-colors focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select token</option>
                <option value="ETH">ETH</option>
                <option value="USDC">USDC</option>
              </select>
              <input
                type="number"
                value={amount1}
                onChange={(e) => setAmount1(e.target.value)}
                className="rounded-lg border p-2 bg-gray-50 dark:bg-gray-700 transition-colors focus:ring-2 focus:ring-blue-500"
                placeholder="0.0"
              />
            </div>
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.button
          whileHover={buttonHover}
          type="submit"
          disabled={!isConnected}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          <span>
            {isConnected
              ? `${action === "add" ? "Add" : "Remove"} Liquidity`
              : "Connect Wallet"}
          </span>
        </motion.button>
      </div>
    </motion.form>
  );
}
