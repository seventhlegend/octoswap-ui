// import { ArrowUpDown, Info, Settings } from "lucide-react";
import SwapCard from "@/components/swap/SwapCard";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 md:px-12 py-10">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Welcome Section */}
        <div className="flex flex-col justify-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#001E50]">
            Welcome to RoarySwap
          </h1>
          <p className="text-gray-600 text-lg">
            Swap tokens seamlessly across chains with our cross-chain DEX
            powered by RoarySwap.
          </p>
        </div>

        {/* Right: Swap Card */}
        <SwapCard />
      </div>
    </div>
  );
}
