export default function Footer() {
  return (
    <footer className="relative z-10 border-t mt-auto bg-white/50 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-blue-950">
          <div>
            <h3 className="font-bold text-lg mb-4">RoarySwap</h3>
            <p className="text-blue-950 dark:text-blue-900"></p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 ">Quick Links</h3>
            <ul className="space-y-2 ">
              <li>
                <a href="/about" className="hover:underline">
                  About
                </a>
              </li>
              <li>
                <a
                  href="https://docs.RoarySwap.com"
                  className="hover:underline"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/RoarySwap"
                  className="hover:underline"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://twitter.com/RoarySwap"
                  className="hover:underline"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg/RoarySwap"
                  className="hover:underline"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@RoarySwap.com"
                  className="hover:underline"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
