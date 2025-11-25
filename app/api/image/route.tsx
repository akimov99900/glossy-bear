import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid') || '1';
    
    // Генерируем оттенок металла на основе FID
    const seed = Number(fid) * 999;
    const tint = seed % 360; 
    
    // Цвета для имитации хрома (свет, середина, тень)
    const metalLight = `hsl(${tint}, 10%, 95%)`;
    const metalMid = `hsl(${tint}, 5%, 70%)`;
    const metalDark = `hsl(${tint}, 20%, 30%)`;
    const metalDeep = `hsl(${tint}, 30%, 15%)`;

    const svg = `
      <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 1. ГРАДИЕНТ "ГОРИЗОНТ" (Эффект хрома) -->
          <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${metalLight}"/>
            <stop offset="45%" stop-color="${metalMid}"/>
            <stop offset="50%" stop-color="${metalDeep}"/>
            <stop offset="55%" stop-color="${metalDark}"/>
            <stop offset="100%" stop-color="${metalLight}"/>
          </linearGradient>
          
          <!-- 2. Глянцевый блик -->
          <filter id="gloss">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1.5" specularExponent="30" lighting-color="white" result="specOut">
                <fePointLight x="-500" y="-1000" z="500"/>
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
          </filter>

          <!-- 3. Тень -->
          <radialGradient id="shadow" cx="50%" cy="50%" r="50%">
             <stop offset="0%" stop-color="black" stop-opacity="0.4"/>
             <stop offset="100%" stop-color="black" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- Фон -->
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f0f0f0"/>
            <stop offset="100%" stop-color="#d0d0d0"/>
        </linearGradient>
        <rect width="800" height="800" fill="url(#bg)"/>
        
        <!-- Тень под ногами -->
        <ellipse cx="400" cy="720" rx="200" ry="40" fill="url(#shadow)" />

        <!-- МЕДВЕДЬ (Форма) -->
        <g transform="translate(150, 50) scale(0.9)" filter="url(#gloss)">
        
            <!-- Ноги -->
            <path d="M180 500 L180 680 Q180 740 230 740 L270 740 Q320 740 320 680 L320 520" fill="url(#chromeGrad)" stroke="${metalDeep}" stroke-width="1"/>
            <path d="M340 500 L340 680 Q340 740 390 740 L430 740 Q480 740 480 680 L480 520" fill="url(#chromeGrad)" stroke="${metalDeep}" stroke-width="1"/>

            <!-- Тело -->
            <path d="M150 350 Q140 550 250 550 L350 550 Q450 550 440 350 Q440 280 295 280 Q150 280 150 350" fill="url(#chromeGrad)" />
            
            <!-- Руки -->
            <path d="M160 320 Q80 350 80 450 Q80 500 110 520" fill="none" stroke="url(#chromeGrad)" stroke-width="60" stroke-linecap="round"/>
            <path d="M430 320 Q510 350 510 450 Q510 500 480 520" fill="none" stroke="url(#chromeGrad)" stroke-width="60" stroke-linecap="round"/>

            <!-- Голова -->
            <path d="M120 180 Q120 30 295 30 Q470 30 470 180 Q470 320 295 320 Q120 320 120 180" fill="url(#chromeGrad)" />
            
            <!-- Уши -->
            <circle cx="120" cy="100" r="65" fill="url(#chromeGrad)" />
            <circle cx="470" cy="100" r="65" fill="url(#chromeGrad)" />

            <!-- Лицо (Рельеф) -->
            <path d="M220 220 Q295 260 370 220" stroke="${metalDeep}" stroke-width="3" fill="none" opacity="0.3"/>
            <ellipse cx="295" cy="210" rx="10" ry="5" fill="${metalDeep}" />

            <!-- Блик -->
            <ellipse cx="200" cy="100" rx="40" ry="20" fill="white" opacity="0.9" transform="rotate(-20 200 100)"/>
        </g>

        <!-- Текст -->
        <text x="400" y="760" font-family="Arial, sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#888" letter-spacing="6">
          CHROME #${fid}
        </text>
      </svg>
    `.trim();

    return new NextResponse(svg, {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return new NextResponse("Error", { status: 500 });
  }
}
