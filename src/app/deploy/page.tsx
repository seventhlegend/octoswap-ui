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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 py-12 px-4">
      <div className="max-w-xl w-full bg-black/30 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Deploy Your Token/Collection
        </h2>

        <div className="space-y-4">
          <select
            className="w-full p-3 rounded-xl bg-white/10 text-white"
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
            className="w-full p-3 rounded-xl bg-white/10 text-white"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="text"
            placeholder="Symbol"
            className="w-full p-3 rounded-xl bg-white/10 text-white"
            value={form.symbol}
            onChange={(e) => setForm({ ...form, symbol: e.target.value })}
            disabled={form.type === "erc1155"}
          />

          {form.type !== "erc20" && (
            <input
              type="text"
              placeholder="Base URI (e.g., ipfs://...)"
              className="w-full p-3 rounded-xl bg-white/10 text-white"
              value={form.baseURI}
              onChange={(e) => setForm({ ...form, baseURI: e.target.value })}
            />
          )}

          {form.type === "erc20" && (
            <input
              type="number"
              placeholder="Initial Supply"
              className="w-full p-3 rounded-xl bg-white/10 text-white"
              value={form.supply}
              onChange={(e) => setForm({ ...form, supply: e.target.value })}
            />
          )}

          <button
            onClick={handleDeploy}
            disabled={!isConnected || isLoading}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
          >
            {isLoading ? "Confirming..." : "Deploy Now (0.01 ETH)"}
          </button>

          {status && (
            <div className="text-white text-center mt-2 text-sm">
              {status}
              {txHash && (
                <div>
                  <a
                    href={`https://shannon-explorer.somnia.network/tx/${txHash}`}
                    className="text-purple-300 underline"
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
            className="mt-6 text-center bg-white/10 backdrop-blur-md rounded-xl px-6 py-4 text-white border border-white/10"
          >
            Connect your wallet to deploy contracts
          </motion.div>
        )}
      </div>
    </div>
  );
}
