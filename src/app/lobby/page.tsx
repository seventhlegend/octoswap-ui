"use client";

import { useState, useEffect, useRef } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
// Kullanılmayan import kaldırıldı
// import { parseEther } from "viem";
import Image from "next/image";
import { PaperAirplaneIcon, FaceSmileIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

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

// Define proper types for contract responses
interface MessageResult {
  a1: bigint;
  b1: bigint;
  c1: string;
  d1: string;
}

interface Message {
  id: string;
  timestamp: bigint;
  sender: string;
  content: string;
}

// Common emojis to display in the quick picker
const quickEmojis = [
  "😀",
  "😂",
  "❤️",
  "👍",
  "🎉",
  "🚀",
  "💰",
  "✨",
  "🔥",
  "🤔",
  "👀",
  "🙏",
  "💎",
  "🌙",
];

export default function LobbyPage() {
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const { isConnected } = useAccount(); // address kullanılmıyor ama ileride kullanılabilir

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

  // Format messages for display with proper typing
  const formattedMessages: Message[] = (
    (recentMessages as MessageResult[] | undefined) || []
  ).map((msg) => ({
    id: String(msg.a1),
    timestamp: msg.b1,
    sender: msg.c1,
    content: msg.d1,
  }));

  // Auto-refresh messages every 15 seconds
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetchMessages();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [refetchMessages]); // dependency olarak refetchMessages eklendi

  // Check for new messages
  useEffect(() => {
    if (
      formattedMessages?.length &&
      formattedMessages.length > lastMessageCount
    ) {
      setHasNewMessages(true);
      setLastMessageCount(formattedMessages.length);

      // Flash animation will disappear after 3 seconds
      const timeout = setTimeout(() => {
        setHasNewMessages(false);
      }, 3000);

      return () => clearTimeout(timeout); // cleanup function eklendi
    }
  }, [formattedMessages, lastMessageCount]);

  // Close emoji picker when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Add emoji to message input
  const addEmoji = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
  };

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
        value: typeof fee === "bigint" ? fee : BigInt(0), // Ensure fee is treated as bigint
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

  // Add a function to scroll to bottom when user clicks a button
  const scrollToBottom = () => {
    if (!messageContainerRef.current) return;

    messageContainerRef.current.scrollTop =
      messageContainerRef.current.scrollHeight;
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full">
        {/* Logo section with white background */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 mb-6">
          <div className="flex justify-center">
            <div className="relative w-36 h-36">
              <Image
                src="/roary-logo.png"
                alt="Roary Logo"
                width={144}
                height={144}
                className="object-contain relative z-10"
                onError={(e) => {
                  e.currentTarget.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='144' height='144' viewBox='0 0 24 24' fill='none' stroke='%23ffffff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3Cpath d='M8 14s1.5 2 4 2 4-2 4-2'%3E%3C/path%3E%3Cline x1='9' y1='9' x2='9.01' y2='9'%3E%3C/line%3E%3Cline x1='15' y1='9' x2='15.01' y2='9'%3E%3C/line%3E%3C/svg%3E";
                }}
              />
            </div>
          </div>

          {/* Message input form */}
          <form onSubmit={sendMessage} className="relative">
            <h2 className="text-[#011e50] text-xl font-bold mb-4 text-center">
              Global Message Board
            </h2>
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Enter your message (max 128 chars)"
                  maxLength={128}
                  disabled={!isConnected || isPending || isConfirming}
                  className="w-full p-4 pl-12 pr-12 rounded-xl bg-gray-50 border border-gray-200 
                       placeholder:text-gray-400 text-[#011e50] focus:outline-none focus:ring-2 focus:ring-[#011e50] focus:border-transparent"
                />

                {/* Emoji picker button */}
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-lg hover:bg-gray-100
                       text-gray-500 hover:text-[#011e50] transition-colors duration-200"
                  disabled={!isConnected}
                >
                  <FaceSmileIcon className="h-5 w-5" />
                </button>

                {/* Send button */}
                <button
                  type="submit"
                  disabled={
                    !isConnected ||
                    !messageInput.trim() ||
                    isPending ||
                    isConfirming
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-[#011e50] hover:bg-blue-700 disabled:bg-gray-200 
                       text-white disabled:text-gray-400 transition-colors duration-200"
                >
                  {isPending || isConfirming ? (
                    <svg
                      className="animate-spin h-5 w-5"
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
                  ) : (
                    <PaperAirplaneIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Emoji picker panel */}
              {showEmojiPicker && (
                <motion.div
                  ref={emojiPickerRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute z-10 bg-black/70 backdrop-blur-xl p-3 rounded-xl border border-white/20 shadow-lg"
                  style={{ width: "calc(100% - 4rem)" }}
                >
                  <div className="grid grid-cols-7 gap-2">
                    {quickEmojis.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => addEmoji(emoji)}
                        className="text-xl hover:bg-white/10 p-2 rounded-lg transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {isPending || isConfirming ? (
                    <span className="inline-flex items-center">
                      <span className="animate-pulse mr-1">●</span>
                      {isPending
                        ? "Confirming transaction..."
                        : "Processing..."}
                    </span>
                  ) : (
                    <span>{messageInput.length}/128 characters</span>
                  )}
                </div>
                <div className="text-sm text-[#011e50]">
                  Fee: {fee ? parseFloat(fee.toString()) / 10 ** 18 : "..."} STT
                </div>
              </div>
            </div>
          </form>

          {/* Messages section */}
          <div className="mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-[#011e50]">
                <span className="inline-flex items-center">
                  <span
                    className={`w-2 h-2 ${
                      hasNewMessages
                        ? "bg-[#011e50] animate-ping"
                        : "bg-[#011e50]"
                    } rounded-full mr-2`}
                  ></span>
                  Live Messages
                </span>
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => refetchMessages()}
                  className="text-xs text-gray-500 hover:text-[#011e50] transition-colors flex items-center space-x-1"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span>Refresh</span>
                </button>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {formattedMessages?.length || 0} Messages
                </span>
              </div>
            </div>

            <div
              ref={messageContainerRef}
              className="space-y-3 max-h-80 overflow-y-auto pr-1 custom-scrollbar"
            >
              {formattedMessages && formattedMessages.length > 0 ? (
                formattedMessages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(index * 0.05, 0.5) }}
                    className={`p-4 rounded-lg border-l-4 ${
                      index === 0
                        ? "border-[#011e50] bg-[#011e50]/5"
                        : index === 1
                        ? "border-gray-400 bg-gray-100"
                        : index === 2
                        ? "border-[#011e50] bg-[#011e50]/10"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#011e50]/10 text-[#011e50]">
                        #{msg.id}
                      </span>
                      <span className="text-xs text-gray-600">
                        {shortenAddress(msg.sender)}
                      </span>
                    </div>
                    <p className="text-gray-800 text-sm mt-1 break-words">
                      {msg.content}
                    </p>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="inline-block p-4 rounded-full bg-gray-100 mb-3">
                    <PaperAirplaneIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600">
                    No messages yet. Be the first to write!
                  </p>
                </div>
              )}
            </div>

            {formattedMessages.length > 4 && (
              <div className="text-center mt-3">
                <button
                  onClick={scrollToBottom}
                  className="text-xs bg-[#011e50] hover:bg-blue-700 text-white py-1 px-3 rounded-full transition-colors"
                >
                  Oldest Messages ↓
                </button>
              </div>
            )}

            {/* Auto-refresh indicator */}
            <div className="mt-4 text-center text-xs text-gray-500">
              Messages auto-refresh every 15 seconds
            </div>
          </div>
        </div>

        {/* Not connected message */}
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
              Connect your wallet to join the conversation
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
