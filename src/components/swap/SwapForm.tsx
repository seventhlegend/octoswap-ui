"use client";

import { useState, useEffect, useMemo } from "react";
import { useAccount, useBalance } from "wagmi";
import { useGlobalState } from "@/context/GlobalContext";
import { isValidAddress } from "@/utils";
import { motion } from "framer-motion";
import { slideIn, fadeIn, buttonHover } from "@/utils/animations";
import { ArrowDownIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

interface SwapState {
  fromToken: string;
  toToken: string;
  amount: string;
  slippage: string;
  loading: boolean;
  error: string | null;
}

export default function SwapForm() {
  // Global state for notifications
  const { dispatch } = useGlobalState();
  const { isConnected, address } = useAccount();

  // Local state management
  const [state, setState] = useState<SwapState>({
    fromToken: "",
    toToken: "",
    amount: "",
    slippage: "0.5",
    loading: false,
    error: null,
  });

  // Memoized validation check
  const isValidForm = useMemo(() => {
    return (
      state.fromToken &&
      state.toToken &&
      Number(state.amount) > 0 &&
      Number(state.slippage) > 0 &&
      Number(state.slippage) <= 5
    );
  }, [state.fromToken, state.toToken, state.amount, state.slippage]);

  // Effect for balance checking
  useEffect(() => {
    if (state.fromToken && address && Number(state.amount) > 0) {
      validateBalance();
    }
  }, [state.fromToken, state.amount, address]);

  // Balance validation
  const validateBalance = async () => {
    try {
      // Implement balance check logic here
      // For now, just a placeholder
      setState((prev) => ({ ...prev, error: null }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "Insufficient balance for swap",
      }));
    }
  };

  // Handle swap execution
  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidForm) return;

    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      // Implement swap logic here
      // For now, just a simulated delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          message: "Swap executed successfully!",
          type: "success",
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Swap failed";
      setState((prev) => ({ ...prev, error: errorMessage }));

      dispatch({
        type: "ADD_NOTIFICATION",
        payload: {
          message: errorMessage,
          type: "error",
        },
      });
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  };

  return (
    <motion.form
      initial="initial"
      animate="animate"
      exit="exit"
      variants={slideIn}
      onSubmit={handleSwap}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="space-y-4">
        {/* From Token Section */}
        <motion.div variants={fadeIn} className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">From</label>
            {state.fromToken && (
              <span className="text-sm text-gray-500">
                Balance: {/* Add balance display */}
              </span>
            )}
          </div>
          <div className="flex gap-2 relative">
            <select
              value={state.fromToken}
              onChange={(e) =>
                setState((prev) => ({ ...prev, fromToken: e.target.value }))
              }
              className="flex-1 rounded-lg border p-2 bg-gray-50 dark:bg-gray-700 transition-colors focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select token</option>
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
            </select>
            <input
              type="number"
              value={state.amount}
              onChange={(e) =>
                setState((prev) => ({ ...prev, amount: e.target.value }))
              }
              placeholder="0.0"
              className="flex-1 rounded-lg border p-2 bg-gray-50 dark:bg-gray-700 transition-colors focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </motion.div>

        {/* Swap Direction Button */}
        <div className="relative flex justify-center -my-3">
          <motion.button
            type="button"
            whileHover={buttonHover}
            className="bg-gray-100 dark:bg-gray-700 rounded-full p-2 z-10"
            onClick={() => {
              setState((prev) => ({
                ...prev,
                fromToken: prev.toToken,
                toToken: prev.fromToken,
              }));
            }}
          >
            <ArrowDownIcon className="w-5 h-5" />
          </motion.button>
          <div className="absolute top-1/2 w-full border-t border-gray-200 dark:border-gray-600" />
        </div>

        {/* To Token Section */}
        <motion.div variants={fadeIn} className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium">To</label>
            {state.toToken && (
              <span className="text-sm text-gray-500">
                Balance: {/* Add balance display */}
              </span>
            )}
          </div>
          <div className="flex gap-2 relative">
            <select
              value={state.toToken}
              onChange={(e) =>
                setState((prev) => ({ ...prev, toToken: e.target.value }))
              }
              className="flex-1 rounded-lg border p-2 bg-gray-50 dark:bg-gray-700 transition-colors focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select token</option>
              <option value="ETH">ETH</option>
              <option value="USDC">USDC</option>
            </select>
          </div>
        </motion.div>

        {/* Settings Section */}
        <motion.div variants={fadeIn} className="space-y-2">
          <label className="block text-sm font-medium">
            Slippage Tolerance (%)
          </label>
          <div className="flex gap-2">
            {["0.5", "1.0", "2.0"].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setState((prev) => ({ ...prev, slippage: value }))
                }
                className={`px-3 py-1 rounded-lg ${
                  state.slippage === value
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300"
                    : "bg-gray-100 dark:bg-gray-700"
                }`}
              >
                {value}%
              </button>
            ))}
            <input
              type="number"
              value={state.slippage}
              onChange={(e) =>
                setState((prev) => ({ ...prev, slippage: e.target.value }))
              }
              className="w-20 rounded-lg border p-1 text-center"
              step="0.1"
              min="0.1"
              max="5"
            />
          </div>
        </motion.div>

        {/* Error Message */}
        {state.error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 p-3 rounded-lg"
          >
            {state.error}
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={isConnected && !state.loading ? buttonHover : undefined}
          type="submit"
          disabled={!isConnected || !isValidForm || state.loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {state.loading && <ArrowPathIcon className="w-5 h-5 animate-spin" />}
          <span>
            {state.loading
              ? "Swapping..."
              : !isConnected
              ? "Connect Wallet"
              : "Swap Tokens"}
          </span>
        </motion.button>
      </div>
    </motion.form>
  );
}
