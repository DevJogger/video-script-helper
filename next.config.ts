import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Mark nodejieba and opencc as external server packages to avoid bundling issues
  serverExternalPackages: ['nodejieba', 'opencc'],
}

export default nextConfig
