import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid') || '1';
    
    // Генерируем цвет на основе FID
    const seed = Number(fid) * 999;
    const hue = seed % 360; 
    
    const light = `hsl(${hue}, 10%, 95%)`;
    const mid = `hsl(${hue}, 5%, 70%)`;
    const dark = `hsl(${hue}, 20%, 30%)`;

    const svg = `
      <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${light}"/>
            <stop offset="50%" stop-color="${mid}"/>
            <stop offset="100%" stop-color="${dark}"/>
          </linearGradient>
        </defs>
        <rect width="800" height="800" fill="#f0f0f0"/>
        <circle cx="400" cy="400" r="300" fill="url(#grad)" />
        <text x="400" y="750" font-family="Arial" font-weight="bold" font-size="40" text-anchor="middle" fill="#333">
          BEAR #${fid}
        </text>
      </svg>
    `.trim();

    return new NextResponse(svg, {
      status: 200,
      headers: { 
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-store, max-age=0'
      },
    });
  } catch (e) {
    return new NextResponse("Error", { status: 500 });
  }
}
