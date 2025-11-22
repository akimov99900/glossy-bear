import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Glossy Bear 3D',
  description: 'High-end crypto art',
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': 'https://glossy-bear.vercel.app/api/image?fid=1',
    'fc:frame:button:1': 'Get Glossy',
    'fc:frame:button:1:action': 'link',
    'fc:frame:button:1:target': 'https://glossy-bear.vercel.app',
  },
}
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-black text-white">{children}</body>
    </html>
  )
}
