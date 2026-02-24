import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Mark nodejieba as external server package to avoid bundling issues
  serverExternalPackages: ['nodejieba'],
}

export default nextConfig
