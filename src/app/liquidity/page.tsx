"use client";

import LiquidityForm from "@/components/liquidity/LiquidityForm";

export default function LiquidityPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Liquidity Pool</h1>
      <LiquidityForm />
    </div>
  );
}
