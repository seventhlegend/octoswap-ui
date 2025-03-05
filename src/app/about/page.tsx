export default function AboutPage() {
  const features = [
    {
      title: "Secure Trading",
      description: "Trade directly from your wallet with full asset control",
      icon: "🛡️",
    },
    {
      title: "Low Fees",
      description: "Minimal transaction fees through efficient AMM model",
      icon: "💎",
    },
    {
      title: "High Liquidity",
      description: "Deep liquidity pools for smooth trading experience",
      icon: "🌊",
    },
    {
      title: "User-Friendly",
      description: "Modern interface designed for seamless trading",
      icon: "✨",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Empowering DeFi Trading
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          SomniSwap is a next-generation decentralized exchange built on the
          Somnia network, providing secure and efficient trading with complete
          asset control.
        </p>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="p-6 rounded-xl border bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm"
          >
            <div className="text-3xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              {feature.description}
            </p>
          </div>
        ))}
      </section>

      {/* Vision Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-6 text-center">Our Vision</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p className="text-lg text-center max-w-3xl mx-auto">
            We envision a future where financial freedom is accessible to
            everyone. Through innovative blockchain technology and user-centric
            design, SomniSwap is building the foundation for truly decentralized
            finance.
          </p>
        </div>
      </section>

      {/* Team & Future Section */}
      <section className="text-center mb-16">
        <h2 className="text-3xl font-bold mb-6">Built for the Future</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
          Backed by experienced blockchain developers and financial experts,
          SomniSwap is continuously evolving to meet the needs of modern DeFi
          users.
        </p>
        <a
          href="https://docs.somniswap.com"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Explore Documentation
        </a>
      </section>
    </div>
  );
}
