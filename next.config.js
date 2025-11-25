/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups', // <-- ВОТ ЭТА МАГИЧЕСКАЯ СТРОЧКА
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
