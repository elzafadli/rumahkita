import type { NextConfig } from "next";

const laravelApiUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost/hrd/public/api";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/backend-api/:path*",
        destination: `${laravelApiUrl}/:path*`,
      },
    ];
  },
};

export default nextConfig;
