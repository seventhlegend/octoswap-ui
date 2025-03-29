import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false, // Ensures strict mode for React
  webpack: (config) => {
    // Add custom externals
    config.externals = config.externals || [];
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  /* Add any additional config options here if needed */
};

export default nextConfig;
