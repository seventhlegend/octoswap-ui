import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-6">Welcome to SomniSwap</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          The next generation decentralized exchange platform
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            title: "Swap Tokens",
            description: "Trade tokens instantly with low fees",
            link: "/swap",
          },
          {
            title: "Provide Liquidity",
            description: "Earn fees by providing liquidity",
            link: "/liquidity",
          },
          {
            title: "Track History",
            description: "View your trading history",
            link: "/history",
          },
        ].map((item) => (
          <Link
            key={item.title}
            href={item.link}
            className="p-6 border rounded-xl hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-3">{item.title}</h2>
            <p className="text-gray-600 dark:text-gray-300">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
