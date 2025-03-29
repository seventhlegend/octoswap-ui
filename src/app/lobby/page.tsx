"use client";

import { useState, useEffect } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { parseEther } from "viem";
import Image from "next/image";
import { ArrowRightIcon } from "@heroicons/react/24/solid";

// Contract ABI (partial for required functions)
const contractABI = [
  {
    inputs: [
      {
        internalType: "string",
        name: "y",
        type: "string",
      },
    ],
    name: "x",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "z",
    outputs: [
      {
        components: [
          {
            internalType: "uint256",
            name: "a1",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "b1",
            type: "uint256",
          },
          {
            internalType: "address",
            name: "c1",
            type: "address",
          },
          {
            internalType: "string",
            name: "d1",
            type: "string",
          },
        ],
        internalType: "struct LC.X1[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "a",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const contractAddress = "0xd8b6aEED62F79e39f1F776c09783543FD6DcA1AD";

interface Message {
  id: string;
  timestamp: bigint;
  sender: string;
  content: string;
}

export default function LobbyPage() {
  const [messageInput, setMessageInput] = useState("");
  const { isConnected, address } = useAccount();

  // Read current fee
  const { data: fee } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "a",
  });

  // Read recent messages
  const { data: recentMessages, refetch: refetchMessages } = useReadContract({
    address: contractAddress,
    abi: contractABI,
    functionName: "z",
  });

  // Write message to contract
  const { data: hash, writeContractAsync, isPending } = useWriteContract();

  // Wait for transaction
  const { isLoading: isConfirming, data: receipt } =
    useWaitForTransactionReceipt({
      hash,
    });

  // Handle transaction completion
  useEffect(() => {
    if (receipt) {
      refetchMessages();
    }
  }, [receipt, refetchMessages]);
  // Format messages for display
  const formattedMessages: Message[] = ((recentMessages as any[]) || []).map(
    (msg) => ({
      id: String(msg.a1),
      timestamp: BigInt(msg.b1),
      sender: msg.c1,
      content: msg.d1,
    })
  );

  // Send message function
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !isConnected || !fee) return;

    try {
      await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "x",
        args: [messageInput],
        value: fee as any,
      });
      setMessageInput("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  // Format address for display
  const shortenAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 py-12 px-4">
      <div className="max-w-md w-full bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
        {/* Logo section */}
        <div className="flex justify-center p-6">
          <div className="relative w-24 h-24">
            <Image
              src="/roary-logo.png"
              alt="Roary Logo"
              width={96}
              height={96}
              className="object-contain"
              // Fallback if image doesn't exist
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M8 14s1.5 2 4 2 4-2 4-2'%3E%3C/path%3E%3Cline x1='9' y1='9' x2='9.01' y2='9'%3E%3C/line%3E%3Cline x1='15' y1='9' x2='15.01' y2='9'%3E%3C/line%3E%3C/svg%3E";
              }}
            />
          </div>
        </div>

        {/* Message input form */}
        <form onSubmit={sendMessage} className="px-6 py-4">
          <div className="space-y-4">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Enter your message (max 128 chars)"
              maxLength={128}
              disabled={!isConnected || isPending || isConfirming}
              className="w-full p-4 rounded-xl bg-white/30 backdrop-blur-md border border-white/40 
                       placeholder:text-gray-600 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={
                  !isConnected ||
                  !messageInput.trim() ||
                  isPending ||
                  isConfirming
                }
                className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 
                         text-white font-medium rounded-xl flex items-center justify-center gap-2 
                         transition-colors duration-200"
              >
                {isPending || isConfirming ? (
                  <>
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
                    {isPending ? "Confirming..." : "Processing..."}
                  </>
                ) : (
                  <>
                    Send Message <ArrowRightIcon className="h-5 w-5" />
                  </>
                )}
              </button>

              <p className="text-sm text-center text-white/80">
                Fee: {fee ? parseFloat(fee.toString()) / 10 ** 18 : "..."} STT
              </p>
            </div>
          </div>
        </form>

        {/* Recent messages */}
        <div className="px-6 pb-6">
          <h3 className="font-medium text-white mb-3">Recent Messages</h3>
          <div className="space-y-2">
            {formattedMessages.length > 0 ? (
              formattedMessages.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`p-3 rounded-lg bg-white/20 backdrop-blur-md border border-white/30
                            ${
                              index > 5
                                ? `opacity-${Math.max(10, 90 - index * 10)}`
                                : ""
                            }`}
                >
                  <p className="text-xs text-white/70">
                    [{msg.id}] {shortenAddress(msg.sender)}:
                  </p>
                  <p className="text-white text-sm mt-1">{msg.content}</p>
                </div>
              ))
            ) : (
              <div className="text-center text-white/60 py-4">
                No messages yet. Be the first to write!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Not connected message */}
      {!isConnected && (
        <div className="mt-6 text-center bg-white/30 backdrop-blur-md rounded-xl px-6 py-4 text-white">
          Connect your wallet to send messages
        </div>
      )}
    </div>
  );
}
