/** @type {import('next').NextConfig} */
const { join } = require('path');

const nextConfig = {
  // Look for .env files in the root directory
  env: {
    APP_ROOT_PATH: join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'randomuser.me',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
