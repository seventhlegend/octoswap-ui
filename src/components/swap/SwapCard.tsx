"use client";

import { useState } from "react";
import { ArrowUpDown, Info, Settings } from "lucide-react";
import { useAccount, useBalance, useWriteContract } from "wagmi";
import { parseUnits, formatUnits } from "viem";

// Token selection interface
interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  logoURI: string;
  chainId: number;
}

// Sample tokens (would come from an API in production)
const sampleTokens: Token[] = [
  {
    symbol: "STT",
    name: "Somnia",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE", // Native token
    decimals: 18,
    logoURI: "/stt-icon.svg",
    chainId: 50312, // Somnia testnet
  },
  {
    symbol: "ROAR",
    name: "RoaryToken",
    address: "0xD09cc9CB421b63F336247Bf507796489E04f1026",
    decimals: 18,
    logoURI: "/roary-logo.png",
    chainId: 50312,
  },
];

// Simplified router contract ABI for swap functionality
const routerABI = [
  {
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    name: "swapExactTokensForTokens",
    outputs: [{ name: "amounts", type: "uint256[]" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    name: "swapExactETHForTokens",
    outputs: [{ name: "amounts", type: "uint256[]" }],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "amountIn", type: "uint256" },
      { name: "amountOutMin", type: "uint256" },
      { name: "path", type: "address[]" },
      { name: "to", type: "address" },
      { name: "deadline", type: "uint256" },
    ],
    name: "swapExactTokensForETH",
    outputs: [{ name: "amounts", type: "uint256[]" }],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// Sample router address (would be environment specific in production)
const ROUTER_ADDRESS =
  "0x000000000000000000000000000000000000dEaD" as `0x${string}`;

export default function SwapCard() {
  const { address, isConnected } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  // Token selection state
  const [fromToken, setFromToken] = useState<Token>(sampleTokens[0]);
  const [toToken, setToToken] = useState<Token | null>(null);

  // Input amounts
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  // UI state
  const [slippage, setSlippage] = useState(1.0); // 1% default
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [selectorType, setSelectorType] = useState<"from" | "to">("from");

  // Get user's ETH balance
  const { data: ethBalance } = useBalance({
    address,
  });

  // Handle token amount input changes
  const handleFromAmountChange = (value: string) => {
    setFromAmount(value);
    // In a real app, you would fetch a quote here and update toAmount
    // For demo, just mirror the value with a 0.3% fee
    if (value && !isNaN(parseFloat(value))) {
      setToAmount((parseFloat(value) * 0.997).toString());
    } else {
      setToAmount("");
    }
  };

  // Swap tokens positions
  const handleSwapTokens = () => {
    if (!toToken) return;
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  // Open token selector
  const openTokenSelector = (type: "from" | "to") => {
    setSelectorType(type);
    setShowTokenSelector(true);
  };

  // Select token from selector
  const selectToken = (token: Token) => {
    if (selectorType === "from") {
      setFromToken(token);
    } else {
      setToToken(token);
    }
    setShowTokenSelector(false);
  };

  // Execute swap
  const executeSwap = async () => {
    if (!isConnected || !toToken || !fromAmount) return;

    try {
      const parsedAmount = parseUnits(fromAmount, fromToken.decimals);
      const minOutAmount = parseUnits(
        (parseFloat(toAmount) * (1 - slippage / 100)).toFixed(toToken.decimals),
        toToken.decimals
      );

      // Current time + 20 minutes
      const deadline = Math.floor(Date.now() / 1000) + 20 * 60;

      if (fromToken.symbol === "ETH") {
        // ETH to Token swap
        await writeContractAsync({
          address: ROUTER_ADDRESS,
          abi: routerABI,
          functionName: "swapExactETHForTokens",
          args: [
            minOutAmount,
            [
              fromToken.address as `0x${string}`,
              toToken.address as `0x${string}`,
            ],
            address as `0x${string}`,
            BigInt(deadline),
          ],
          value: parsedAmount,
        });
      } else if (toToken.symbol === "ETH") {
        // Token to ETH swap
        await writeContractAsync({
          address: ROUTER_ADDRESS,
          abi: routerABI,
          functionName: "swapExactTokensForETH",
          args: [
            parsedAmount,
            minOutAmount,
            [
              fromToken.address as `0x${string}`,
              toToken.address as `0x${string}`,
            ],
            address as `0x${string}`,
            BigInt(deadline),
          ],
        });
      } else {
        // Token to Token swap
        await writeContractAsync({
          address: ROUTER_ADDRESS,
          abi: routerABI,
          functionName: "swapExactTokensForTokens",
          args: [
            parsedAmount,
            minOutAmount,
            [
              fromToken.address as `0x${string}`,
              toToken.address as `0x${string}`,
            ],
            address as `0x${string}`,
            BigInt(deadline),
          ],
        });
      }
    } catch (error) {
      console.error("Swap failed:", error);
    }
  };

  // Determine if swap can be executed
  const canSwap =
    isConnected &&
    fromToken &&
    toToken &&
    fromAmount &&
    parseFloat(fromAmount) > 0 &&
    !isPending;

  // Format balance display
  const getBalanceDisplay = (token: Token) => {
    if (token.symbol === "ETH" && ethBalance) {
      return `${parseFloat(formatUnits(ethBalance.value, 18)).toFixed(4)} ETH`;
    }
    return "--"; // In a real app, you would fetch token balances
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-[#001E50]">
          Swap – Cross Chain
        </h2>
        <Settings className="w-5 h-5 text-gray-500 cursor-pointer" />
      </div>

      {/* FROM Token */}
      <div className="border rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-500">
            From{" "}
            <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded">
              Somnia
            </span>
          </div>
          <div className="text-xs text-gray-400">
            Available:{" "}
            <span className="text-black">{getBalanceDisplay(fromToken)}</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => openTokenSelector("from")}
          >
            <img
              src={fromToken.logoURI}
              alt={fromToken.symbol}
              className="w-6 h-6"
              onError={(e) => {
                e.currentTarget.src =
                  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3C/svg%3E";
              }}
            />
            <span className="font-medium">{fromToken.symbol}</span>
          </div>
          <input
            type="number"
            value={fromAmount}
            onChange={(e) => handleFromAmountChange(e.target.value)}
            placeholder="0.00"
            className="text-right w-1/2 bg-transparent outline-none text-2xl font-semibold"
          />
        </div>
        <p className="text-right text-xs text-gray-400">
          ≈ ${fromAmount ? (parseFloat(fromAmount) * 2000).toFixed(2) : "0.00"}
        </p>
      </div>

      {/* Switch Icon */}
      <div className="flex justify-center my-2">
        <div
          className="bg-gray-100 rounded-full p-2 cursor-pointer hover:bg-gray-200"
          onClick={handleSwapTokens}
        >
          <ArrowUpDown className="w-4 h-4 text-blue-600" />
        </div>
      </div>

      {/* TO Token */}
      <div className="border rounded-xl p-4 mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-gray-500">To</div>
          <div className="text-xs text-gray-400">
            Available:{" "}
            <span className="text-black">
              {toToken ? getBalanceDisplay(toToken) : "--"}
            </span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => openTokenSelector("to")}
          >
            {toToken ? (
              <>
                <img
                  src={toToken.logoURI}
                  alt={toToken.symbol}
                  className="w-6 h-6"
                  onError={(e) => {
                    e.currentTarget.src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3C/svg%3E";
                  }}
                />
                <span className="font-medium">{toToken.symbol}</span>
              </>
            ) : (
              <span className="font-medium text-gray-400">Select Token</span>
            )}
          </div>
          <input
            type="number"
            value={toAmount}
            readOnly
            placeholder="0.00"
            className="text-right w-1/2 bg-transparent outline-none text-2xl font-semibold text-black"
          />
        </div>
        <p className="text-right text-xs text-gray-400">
          ≈ $
          {toToken && toAmount
            ? (parseFloat(toAmount) * 2000).toFixed(2)
            : "0.00"}
        </p>
      </div>

      {/* Slippage */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <div className="flex items-center space-x-1">
          <span>Set slippage tolerance</span>
          <Info className="w-4 h-4" />
        </div>
        <div className="flex space-x-2">
          <button
            className={`px-3 py-1 rounded-full text-xs ${
              slippage === 1.0
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-500"
            }`}
            onClick={() => setSlippage(1.0)}
          >
            Auto: 1%
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs ${
              slippage !== 1.0
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-500"
            }`}
            onClick={() => setSlippage(0.5)}
          >
            Custom: 0.5%
          </button>
        </div>
      </div>

      {/* CTA Button */}
      <button
        disabled={!canSwap}
        onClick={executeSwap}
        className={`w-full font-semibold py-3 rounded-xl ${
          canSwap
            ? "bg-blue-600 hover:bg-blue-700 text-white"
            : "bg-gray-200 text-gray-500 cursor-not-allowed"
        }`}
      >
        {!isConnected
          ? "Connect Wallet"
          : !toToken
          ? "Select Token"
          : isPending
          ? "Swapping..."
          : "Swap"}
      </button>

      {/* Token Selector Modal */}
      {showTokenSelector && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-white rounded-xl p-4 w-full max-w-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Select Token</h3>
              <button
                onClick={() => setShowTokenSelector(false)}
                className="text-gray-500"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {sampleTokens.map((token) => (
                <div
                  key={token.address}
                  onClick={() => selectToken(token)}
                  className="flex items-center p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <img
                    src={token.logoURI}
                    alt={token.symbol}
                    className="w-8 h-8 mr-3"
                    onError={(e) => {
                      e.currentTarget.src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23000000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='12' r='10'%3E%3C/circle%3E%3C/svg%3E";
                    }}
                  />
                  <div>
                    <div className="font-medium">{token.symbol}</div>
                    <div className="text-xs text-gray-500">{token.name}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
