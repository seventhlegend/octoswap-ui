"use client";

import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/solid";

// Contract addresses
const ROARY_ERC20 = "0xD09cc9CB421b63F336247Bf507796489E04f1026";
const ROARY_NFT = "0x424ff3138490c4cEf110E5Ac32f9D111465b6C9b";
const ROARY_ERC1155 = "0x2Bf5fE4a2D83c7bCECB1fd021A468665c5edDAC1";

// Define proper types for contract ABIs
interface MintFunction {
  name: "mint";
  type: "function";
  stateMutability: "payable";
  inputs: never[];
  outputs?: never[];
}

type ContractABI = readonly [MintFunction];

const erc20Abi = [
  { name: "mint", type: "function", stateMutability: "payable", inputs: [] },
] as const satisfies ContractABI;

const nftAbi = [
  { name: "mint", type: "function", stateMutability: "payable", inputs: [] },
] as const satisfies ContractABI;

const erc1155Abi = [
  { name: "mint", type: "function", stateMutability: "payable", inputs: [] },
] as const satisfies ContractABI;

// Define contract configuration type
type TokenType = "erc20" | "nft" | "erc1155";

interface ContractConfig {
  address: `0x${string}`;
  abi: ContractABI;
  name: string;
  buttonClass: string;
}

// Create a mapping of token types to their configurations
const CONTRACT_CONFIGS: Record<TokenType, ContractConfig> = {
  erc20: {
    address: ROARY_ERC20 as `0x${string}`,
    abi: erc20Abi,
    name: "RoaryToken (ERC20)",
    buttonClass: "bg-purple-600 hover:bg-purple-700 text-white",
  },
  nft: {
    address: ROARY_NFT as `0x${string}`,
    abi: nftAbi,
    name: "RoaryNFT (ERC721)",
    buttonClass: "bg-indigo-600 hover:bg-indigo-700 text-white",
  },
  erc1155: {
    address: ROARY_ERC1155 as `0x${string}`,
    abi: erc1155Abi,
    name: "RoaryERC1155",
    buttonClass: "bg-fuchsia-600 hover:bg-fuchsia-700 text-white",
  },
};

interface MintStatus {
  type: "error" | "success" | "loading" | "idle";
  message: string;
  txHash?: `0x${string}`;
}

export default function MintPage() {
  const { isConnected } = useAccount();
  const [mintStatus, setMintStatus] = useState<MintStatus>({
    type: "idle",
    message: "",
  });

  const { writeContractAsync, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: mintStatus.txHash,
  });

  // Clear status after success
  useEffect(() => {
    if (isSuccess) {
      setMintStatus((prev) => ({
        ...prev,
        type: "success",
        message:
          "✨ Mint successful! Your tokens will appear in your wallet shortly.",
      }));

      const timer = setTimeout(() => {
        setMintStatus({ type: "idle", message: "" });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isSuccess]);

  const handleMint = async (tokenType: TokenType) => {
    try {
      setMintStatus({
        type: "loading",
        message: "Waiting for confirmation...",
      });

      const config = CONTRACT_CONFIGS[tokenType];
      const hash = await writeContractAsync({
        address: config.address,
        abi: config.abi,
        functionName: "mint",
        value: parseEther("0.01"),
      });

      setMintStatus({
        type: "loading",
        message: "Transaction submitted, waiting for confirmation...",
        txHash: hash,
      });
    } catch (error) {
      console.error("Minting error:", error);
      let errorMessage = "Transaction failed";

      if (error instanceof Error) {
        if (error.message.includes("user rejected")) {
          errorMessage = "Transaction was rejected";
        } else if (error.message.includes("insufficient funds")) {
          errorMessage = "Insufficient funds - 0.01 ETH required";
        }
      }

      setMintStatus({
        type: "error",
        message: errorMessage,
      });

      // Clear error after 5 seconds
      setTimeout(() => {
        setMintStatus({ type: "idle", message: "" });
      }, 5000);
    }
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-800 to-fuchsia-700 py-12 px-4">
      <div className="max-w-md w-full">
        {/* Status Messages */}
        {mintStatus.message && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center ${
              mintStatus.type === "error"
                ? "bg-red-900/30 border-red-500/50"
                : mintStatus.type === "success"
                ? "bg-green-900/30 border-green-500/50"
                : "bg-blue-900/30 border-blue-500/50"
            } border backdrop-blur-sm`}
          >
            {mintStatus.type === "error" ? (
              <ExclamationCircleIcon className="h-5 w-5 text-red-400 mr-3" />
            ) : mintStatus.type === "success" ? (
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-3" />
            ) : (
              <LoadingSpinner />
            )}
            <p className="text-white flex-1">{mintStatus.message}</p>
          </motion.div>
        )}

        <div className="bg-black/30 backdrop-blur-xl p-8 rounded-2xl border border-white/10 shadow-2xl">
          <h1 className="text-white text-2xl font-bold text-center mb-6">
            Roary Minting Hub
          </h1>
          <div className="space-y-4">
            {/* Mint buttons - now using TokenType */}
            {(
              Object.entries(CONTRACT_CONFIGS) as [TokenType, ContractConfig][]
            ).map(([tokenType, config]) => (
              <button
                key={tokenType}
                onClick={() => handleMint(tokenType)}
                disabled={!isConnected || isPending || isConfirming}
                className={`w-full py-3 rounded-xl flex items-center justify-center space-x-2 
                    ${
                      !isConnected
                        ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                        : config.buttonClass
                    } transition-colors`}
              >
                {isPending || isConfirming ? (
                  <>
                    <LoadingSpinner />
                    <span>{isPending ? "Confirming..." : "Processing..."}</span>
                  </>
                ) : (
                  `Mint ${config.name}`
                )}
              </button>
            ))}
          </div>

          {mintStatus.txHash && (
            <div className="mt-4 text-center">
              <a
                href={`https://shannon-explorer.somnia.network/tx/${mintStatus.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-300 hover:text-purple-200"
              >
                View transaction ↗
              </a>
            </div>
          )}
        </div>

        {!isConnected && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 text-center bg-white/10 backdrop-blur-md rounded-xl px-8 py-6 text-white border border-white/10"
          >
            <div className="mb-2">
              <svg
                className="w-12 h-12 mx-auto text-purple-400/70"
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
              Connect your wallet to start minting
            </p>
            <p className="text-sm text-white/60 mt-1">
              Use the connect button in the navigation bar
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
