"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LogoWithText from "./LogoWithText";

export default function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Swap", href: "" },
    { name: "Lobby", href: "/lobby" },
    { name: "Mint", href: "/mint" },
    { name: "Deploy", href: "/deploy" },
    { name: "About", href: "/about" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Close mobile menu when navigating
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-transparent backdrop-blur-md border-b border-white/10"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="relative z-10">
              <LogoWithText />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-4 py-2 mx-1 rounded-md font-medium transition-all duration-200"
                  >
                    <span
                      className={`${
                        isActive
                          ? "text-[#011e50]"
                          : "text-white hover:text-[#011e50]"
                      }`}
                    >
                      {item.name}
                    </span>
                    {isActive && (
                      <span className="absolute left-2 right-2 bottom-1 h-0.5 bg-[#011e50]" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Connect Button and Mobile Menu Toggle */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <ConnectButton />
              </div>

              {/* Hamburger Menu Button */}
              <button
                type="button"
                className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 focus:outline-none"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                <div className="relative w-6 h-6">
                  <span
                    className={`absolute left-0 w-full h-0.5 bg-white rounded transform transition-all duration-300 ${
                      isMobileMenuOpen ? "rotate-45 top-3" : "top-1"
                    }`}
                  />
                  <span
                    className={`absolute left-0 w-full h-0.5 bg-white rounded top-3 transition-opacity duration-300 ${
                      isMobileMenuOpen ? "opacity-0" : "opacity-100"
                    }`}
                  />
                  <span
                    className={`absolute left-0 w-full h-0.5 bg-white rounded transform transition-all duration-300 ${
                      isMobileMenuOpen ? "-rotate-45 top-3" : "top-5"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
              isMobileMenuOpen
                ? "max-h-[400px] opacity-100 pt-4"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col space-y-2 pb-4">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="relative px-4 py-3 rounded-md font-medium transition-all"
                  >
                    <span
                      className={`${
                        isActive
                          ? "text-[#011e50]"
                          : "text-white hover:text-[#011e50]"
                      }`}
                    >
                      {item.name}
                    </span>
                    {isActive && (
                      <span className="absolute left-2 right-2 bottom-1 h-0.5 bg-[#011e50]" />
                    )}
                  </Link>
                );
              })}
              <div className="pt-2">
                <ConnectButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to push content below navbar */}
      <div className="h-[72px]"></div>
    </>
  );
}
