import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Crystal Bear Gen',
  description: 'Mint your unique Swarovski-style NFT based on your FID',
  openGraph: {
    title: 'Crystal Bear Gen',
    description: 'Mint your unique Swarovski-style NFT based on your FID',
    images: ['https://glossy-bear-8fjt.vercel.app/api/image?fid=888'], // Покажем красивого 888 как превью
  },
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'glossy-bear-8fjt.vercel.app/api/image?fid=888', // Картинка для фрейма
    'fc:frame:image:aspect_ratio': '1:1',
    'fc:frame:button:1': 'Mint Crystal Bear',
    'fc:frame:button:1:action': 'link',
    // ВАЖНО: Здесь Vercel сам подставит твой домен, либо пропиши его вручную если хочешь жестко
    'fc:frame:button:1:target': 'glossy-bear-8fjt.vercel.app', 
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
