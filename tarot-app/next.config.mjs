import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Zego SDK aur uske dependencies ko transpile karne ke liye force karo
  transpilePackages: ["zego-express-engine-webrtc"],

  reactCompiler: true,

  allowedDevOrigins: [
    "*.trycloudflare.com",
     "https://pavilion-gis-assumption-gratis.trycloudflare.com",
    "127.0.0.1:3000",
    process.env.NEXT_PUBLIC_API_BACKEND_URL || "",
  ].filter(Boolean),

  webpack: (config, { dev, isServer }) => {
    // Webpack rule taaki node_modules ke modern files par 2021/syntax error na aaye
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default withPWA(nextConfig);