"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { motion } from "framer-motion";

export default function LiquidityPage() {
  const { isConnected } = useAccount();
  const [activeTab, setActiveTab] = useState<"add" | "remove">("add");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full">
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <h1 className="text-2xl font-bold text-[#011e50] mb-6">
            Liquidity Pools
          </h1>

          {isConnected ? (
            <>
              {/* Tab Navigation */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setActiveTab("add")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === "add"
                      ? "bg-[#011e50] text-white"
                      : "text-[#011e50] bg-gray-100"
                  }`}
                >
                  Add Liquidity
                </button>
                <button
                  onClick={() => setActiveTab("remove")}
                  className={`px-4 py-2 rounded-lg font-medium ${
                    activeTab === "remove"
                      ? "bg-[#011e50] text-white"
                      : "text-[#011e50] bg-gray-100"
                  }`}
                >
                  Remove Liquidity
                </button>
              </div>

              {/* Form Container */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#011e50]/70 mb-1">
                        Token 1
                      </label>
                      <select className="w-full p-2 rounded-lg border border-gray-200 text-[#011e50]">
                        <option>Select token</option>
                        <option>ETH</option>
                        <option>ROAR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-[#011e50]/70 mb-1">
                        Amount
                      </label>
                      <input
                        type="number"
                        placeholder="0.0"
                        className="w-full p-2 rounded-lg border border-gray-200 text-[#011e50]"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-[#011e50]/70 mb-1">
                        Token 2
                      </label>
                      <select className="w-full p-2 rounded-lg border border-gray-200 text-[#011e50]">
                        <option>Select token</option>
                        <option>ETH</option>
                        <option>ROAR</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-[#011e50]/70 mb-1">
                        Amount
                      </label>
                      <input
                        type="number"
                        placeholder="0.0"
                        className="w-full p-2 rounded-lg border border-gray-200 text-[#011e50]"
                      />
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-[#011e50] hover:bg-blue-700 text-white rounded-xl transition-colors">
                  {activeTab === "add" ? "Add Liquidity" : "Remove Liquidity"}
                </button>
              </div>
            </>
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
                Connect your wallet to manage liquidity
              </p>
              <p className="text-sm text-[#011e50]/60 mt-1">
                Add or remove liquidity from pools
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
