import type { NextConfig } from 'next'

module.exports = {
  turbopack: {
    // Example: adding an alias and custom file extension
    resolveAlias: {
      underscore: 'lodash',
    },
    resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.json'],
  },
}

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com'], // Add your image hosts here
    remotePatterns: [ // Recommended alternative to domains in newer Next.js versions
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  experimental: {
    scrollRestoration: true, // Improved scroll behavior
    typedRoutes: true, // Enable if using TypeScript for better route typing
  },
  // Additional recommended TypeScript-friendly configuration
  typescript: {
    ignoreBuildErrors: false, // Set to true only during development if needed
  },
  eslint: {
    ignoreDuringBuilds: true, // Recommended if you're using separate linting
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glb|gltf)$/,
      use: {
        loader: 'file-loader',
        options: {
          publicPath: '/_next/static/models/',
          outputPath: 'static/models/',
          name: '[name].[hash].[ext]',
        },
      },
    })
    return config
  },
}

export default nextConfig