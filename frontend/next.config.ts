import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // @ts-ignore - Next.js 16 specific config for turbopack root
  turbopack: {
    root: path.resolve(__dirname, '..'),
  },
};

export default nextConfig;
