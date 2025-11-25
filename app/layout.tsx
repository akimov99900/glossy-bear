import type { Metadata } from 'next'

// ТВОЙ ДОМЕН (Проверь, чтобы был точный!)
const BASE_URL = 'https://glossy-bear-8fjt.vercel.app';
const IMAGE_URL = 'https://i.postimg.cc/MptNPZCX/ref.jpg'; // Твоя картинка

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Chrome Bear Gen',
  description: 'Exclusive Liquid Metal Collection on Base',
  openGraph: {
    title: 'Chrome Bear Gen',
    description: 'Exclusive Liquid Metal Collection on Base. Mint yours now.',
    images: [IMAGE_URL], // Картинка для Твиттера/Телеграма
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': IMAGE_URL, // Картинка для Фаркастера (Главная!)
    'fc:frame:image:aspect_ratio': '1:1',
    'fc:frame:button:1': 'Mint Now',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': BASE_URL,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-black text-white min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  )
}
