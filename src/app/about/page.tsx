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
    <div className="min-h-screen flex flex-col items-center justify-center py-16 px-4">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg p-10 border border-gray-200">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[#011e50] mb-8">
            Empowering DeFi Trading
          </h1>
          <p className="text-xl text-[#011e50]/70 max-w-2xl mx-auto leading-relaxed">
            RoarySwap is a next-generation decentralized exchange built on the
            Somnia network, providing secure and efficient trading with complete
            asset control.
          </p>
        </section>

        {/* Features Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="p-8 rounded-xl bg-gray-50 border border-gray-200 hover:border-[#011e50]/20 transition-colors"
            >
              <div className="text-4xl mb-6">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-4 text-[#011e50]">
                {feature.title}
              </h3>
              <p className="text-[#011e50]/70 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </section>

        {/* Vision Section */}
        <section className="mb-16 px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-[#011e50]">
            Our Vision
          </h2>
          <div className="prose max-w-none">
            <p className="text-lg text-center text-[#011e50]/70 max-w-3xl mx-auto leading-relaxed">
              We envision a future where financial freedom is accessible to
              everyone. Through innovative blockchain technology and
              user-centric design, RoarySwap is building the foundation for
              truly decentralized finance.
            </p>
          </div>
        </section>

        {/* Team & Future Section */}
        <section className="text-center px-4">
          <h2 className="text-3xl font-bold mb-8 text-[#011e50]">
            Built for the Future
          </h2>
          <p className="text-lg text-[#011e50]/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Backed by experienced blockchain developers and financial experts,
            RoarySwap is continuously evolving to meet the needs of modern DeFi
            users.
          </p>
          <a
            href="https://docs.RoarySwap.com"
            className="inline-block bg-[#011e50] text-white px-10 py-4 rounded-xl hover:bg-blue-700 
                     transition-colors text-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5"
          >
            Explore Documentation
          </a>
        </section>
      </div>
    </div>
  );
}
