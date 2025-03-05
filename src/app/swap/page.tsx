"use client";

import SwapForm from "@/components/swap/SwapForm";

export default function SwapPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Swap Tokens</h1>
      <SwapForm />
    </div>
  );
}
