/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }, // allow ALL https domains
    ],
  },
};

export default nextConfig;
