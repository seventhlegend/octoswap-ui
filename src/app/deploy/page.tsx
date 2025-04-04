"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { motion } from "framer-motion";
// import {
//   CheckCircleIcon,
//   ExclamationCircleIcon,
// } from "@heroicons/react/24/solid";

// Define more specific types for our factory ABIs
// interface Erc20DeployParams {
//   name: string;
//   symbol: string;
//   initialSupply: bigint;
// }

// interface Erc721DeployParams {
//   name: string;
//   symbol: string;
//   baseURI: string;
// }

// interface Erc1155DeployParams {
//   baseURI: string;
// }

// // Type mapping for contract function arguments
// type DeployArgsMap = {
//   erc20: [string, string, bigint]; // [name, symbol, initialSupply]
//   erc721: [string, string, string]; // [name, symbol, baseURI]
//   erc1155: [string]; // [baseURI]
// };

const FACTORIES = {
  erc20: {
    address: "0xb3d56fEbb483991985D912D6138c1311d5793C37" as `0x${string}`,
    abi: [
      {
        name: "deployToken",
        type: "function",
        stateMutability: "payable",
        inputs: [
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "initialSupply", type: "uint256" },
        ],
        outputs: [{ name: "", type: "address" }],
      },
    ] as const,
  },
  erc721: {
    address: "0x835c39F6284Ad6dC83b01b1711a0bBbdb94156f6" as `0x${string}`,
    abi: [
      {
        name: "deployCollection",
        type: "function",
        stateMutability: "payable",
        inputs: [
          { name: "name", type: "string" },
          { name: "symbol", type: "string" },
          { name: "baseTokenURI", type: "string" },
        ],
        outputs: [{ name: "", type: "address" }],
      },
    ] as const,
  },
  erc1155: {
    address: "0xc6036c2e7c0CA37100BFECA46A962686D2C4308B" as `0x${string}`,
    abi: [
      {
        name: "deployCollection",
        type: "function",
        stateMutability: "payable",
        inputs: [{ name: "baseURI", type: "string" }],
        outputs: [{ name: "", type: "address" }],
      },
    ] as const,
  },
};

export default function DeployPage() {
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const [txHash, setTxHash] = useState<`0x${string}`>();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });
  const [status, setStatus] = useState<string>("");
  const [form, setForm] = useState({
    type: "erc20",
    name: "",
    symbol: "",
    supply: "1000",
    baseURI: "ipfs://Qm.../",
  });

  const handleDeploy = async () => {
    const contractType = form.type as keyof typeof FACTORIES;

    try {
      setStatus("⏳ Sending transaction...");
      let hash: `0x${string}`;

      if (contractType === "erc20") {
        hash = await writeContractAsync({
          address: FACTORIES.erc20.address,
          abi: FACTORIES.erc20.abi,
          functionName: "deployToken",
          args: [form.name, form.symbol, BigInt(form.supply)],
          value: parseEther("0.01"),
        });
      } else if (contractType === "erc721") {
        hash = await writeContractAsync({
          address: FACTORIES.erc721.address,
          abi: FACTORIES.erc721.abi,
          functionName: "deployCollection",
          args: [form.name, form.symbol, form.baseURI],
          value: parseEther("0.01"),
        });
      } else {
        // erc1155
        hash = await writeContractAsync({
          address: FACTORIES.erc1155.address,
          abi: FACTORIES.erc1155.abi,
          functionName: "deployCollection",
          args: [form.baseURI],
          value: parseEther("0.01"),
        });
      }

      setTxHash(hash);
      setStatus("🚀 Transaction sent. Waiting for confirmation...");
    } catch (err) {
      console.error(err);
      setStatus("❌ Transaction failed or rejected");
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setStatus("✅ Deployment successful!");
    }
  }, [isSuccess]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-[#011e50] text-2xl font-bold text-center mb-6">
          Deploy Your Token/Collection
        </h2>

        <div className="space-y-4">
          <select
            className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-[#011e50]"
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="erc20">ERC20 Token</option>
            <option value="erc721">ERC721 NFT</option>
            <option value="erc1155">ERC1155 Collection</option>
          </select>

          <input
            type="text"
            placeholder="Name"
            className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-[#011e50]"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="text"
            placeholder="Symbol"
            className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-[#011e50]"
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
            disabled={form.type === "erc1155"}
          />

          {form.type !== "erc20" && (
            <input
              type="text"
              placeholder="Base URI (e.g., ipfs://...)"
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-[#011e50]"
              value={form.baseURI}
              onChange={(e) => setForm({ ...form, baseURI: e.target.value })}
            />
          )}

          {form.type === "erc20" && (
            <input
              type="number"
              placeholder="Initial Supply"
              className="w-full p-3 rounded-xl bg-gray-50 border border-gray-200 text-[#011e50]"
              value={form.supply}
              onChange={(e) => setForm({ ...form, supply: e.target.value })}
            />
          )}

          <button
            onClick={handleDeploy}
            disabled={!isConnected || isLoading}
            className="w-full py-3 bg-[#011e50] hover:bg-blue-700 text-white rounded-xl disabled:bg-gray-200 disabled:text-gray-400"
          >
            {isLoading ? "Confirming..." : "Deploy Now (0.01 ETH)"}
          </button>

          {status && (
            <div className="text-[#011e50] text-center mt-2 text-sm">
              {status}
              {txHash && (
                <div>
                  <a
                    href={`https://shannon-explorer.somnia.network/tx/${txHash}`}
                    className="text-[#011e50] hover:text-blue-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Transaction ↗
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center bg-white/80 backdrop-blur-md rounded-xl px-8 py-6 text-[#011e50] border border-gray-200 shadow-lg"
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
              Connect your wallet to deploy contracts
            </p>
            <p className="text-sm text-[#011e50]/60 mt-1">
              Use the connect button in the navigation bar
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
