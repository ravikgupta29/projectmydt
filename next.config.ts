import type { NextConfig } from "next";

// const nextConfig: NextConfig = {

// };

// export default nextConfig;

module.exports = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}
