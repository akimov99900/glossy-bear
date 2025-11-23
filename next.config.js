/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/.well-known/farcaster.json',
        // Твоя ссылка из зеленого поля:
        destination: 'https://api.farcaster.xyz/miniapps/hosted-manifest/019aafbd-bf04-60a9-694d-c9b3d4772c86', 
        permanent: false,
      },
    ]
  },
}

module.exports = nextConfig
