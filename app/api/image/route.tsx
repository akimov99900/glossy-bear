import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid') || '888';
    
    // Генерация цвета (HUE) на основе FID
    // Мы берем базу розового (как на фото) и смещаем её
    const seed = Number(fid) * 12345;
    // Базовый цвет (на фото он где-то 350-360 или 0-10 hue)
    const hueShift = (seed % 360); 
    
    const baseColor = `hsl(${hueShift}, 75%, 75%)`;     // Светлый тон (блики)
    const midColor = `hsl(${hueShift}, 60%, 60%)`;      // Основной тон
    const shadowColor = `hsl(${hueShift}, 60%, 40%)`;   // Тень
    const darkShadow = `hsl(${hueShift}, 70%, 25%)`;    // Глубокая тень

    // SVG рисуем вручную по контуру твоего фото (ракурс 3/4)
    const svg = `
      <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 1. Градиент Фарфора (Гладкий переход от света к тени) -->
          <linearGradient id="bodyGrad" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stop-color="${baseColor}"/>
            <stop offset="40%" stop-color="${midColor}"/>
            <stop offset="80%" stop-color="${shadowColor}"/>
            <stop offset="100%" stop-color="${darkShadow}"/>
          </linearGradient>
          
          <!-- 2. Жесткий блик (Студийный свет, как на лбу) -->
          <filter id="glossFilter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur"/>
            <feSpecularLighting in="blur" surfaceScale="10" specularConstant="2.5" specularExponent="40" lighting-color="white" result="specOut">
               <fePointLight x="300" y="-200" z="400"/>
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
          </filter>

          <!-- 3. Тень на полу -->
          <radialGradient id="floorShadow" cx="50%" cy="50%" r="50%">
             <stop offset="0%" stop-color="black" stop-opacity="0.3"/>
             <stop offset="100%" stop-color="black" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- Фон (Мрамор/Студия) -->
        <rect width="800" height="800" fill="#f5f5f7"/>
        
        <!-- Тень под ногами -->
        <ellipse cx="400" cy="720" rx="180" ry="40" fill="url(#floorShadow)" />

        <!-- ГРУППА МЕДВЕДЯ (Сдвинута в центр) -->
        <g transform="translate(150, 50) scale(0.9)">
        
          <!-- Правая нога (Дальняя) -->
          <path d="M330 500 L330 650 Q330 700 360 720 L410 720 Q440 700 440 650 L440 520" fill="url(#bodyGrad)" stroke="${shadowColor}" stroke-width="1"/>
          
          <!-- Левая нога (Ближняя, чуть вперед) -->
          <path d="M170 500 L170 660 Q170 730 220 740 L280 740 Q320 730 320 660 L320 520" fill="url(#bodyGrad)" />
          <!-- Блик на колене -->
          <ellipse cx="220" cy="600" rx="30" ry="60" fill="white" opacity="0.2" transform="rotate(-10 220 600)"/>

          <!-- Тело (Округлое, пузатое) -->
          <path d="M150 350 Q140 550 250 550 L350 550 Q450 550 440 350 Q440 280 295 280 Q150 280 150 350" fill="url(#bodyGrad)" />
          <!-- Блик на животе (как на фото) -->
          <path d="M200 350 Q250 450 350 400" stroke="white" stroke-width="30" stroke-linecap="round" opacity="0.3" filter="blur(5px)"/>

          <!-- Правая рука (Свисает) -->
          <path d="M430 320 Q500 350 500 450 Q500 500 480 520" stroke="url(#bodyGrad)" stroke-width="70" stroke-linecap="round" fill="none"/>
          
          <!-- Левая рука (Ближе к нам) -->
          <path d="M160 320 Q90 350 90 450 Q90 500 110 520" stroke="url(#bodyGrad)" stroke-width="70" stroke-linecap="round" fill="none"/>
          <!-- Блик на плече -->
          <ellipse cx="140" cy="320" rx="20" ry="30" fill="white" opacity="0.5"/>

          <!-- ГОЛОВА (Сложная форма: широкие щеки, уже лоб) -->
          <path d="M120 180 Q120 30 295 30 Q470 30 470 180 Q470 320 295 320 Q120 320 120 180" fill="url(#bodyGrad)" />
          
          <!-- Уши (Крупные, круглые, как локаторы) -->
          <!-- Левое -->
          <circle cx="120" cy="100" r="65" fill="url(#bodyGrad)" />
          <circle cx="120" cy="100" r="45" fill="none" stroke="${shadowColor}" stroke-width="5" opacity="0.3"/> <!-- Внутренность -->
          <!-- Блик на ухе -->
          <circle cx="100" cy="80" r="20" fill="white" opacity="0.4" filter="blur(5px)"/>

          <!-- Правое -->
          <circle cx="470" cy="100" r="65" fill="url(#bodyGrad)" />
          <circle cx="470" cy="100" r="45" fill="none" stroke="${shadowColor}" stroke-width="5" opacity="0.3"/>

          <!-- ЛИЦО (Выпуклое рыльце) -->
          <!-- Носовая часть (светлее) -->
          <ellipse cx="295" cy="220" rx="70" ry="50" fill="white" opacity="0.2" filter="blur(10px)"/>
          
          <!-- Нос -->
          <ellipse cx="295" cy="210" rx="15" ry="10" fill="${darkShadow}" />
          
          <!-- Блик на лбу (Самый яркий, как на фото) -->
          <path d="M200 100 Q295 150 390 100" stroke="white" stroke-width="25" stroke-linecap="round" opacity="0.6" filter="blur(8px)"/>
          <ellipse cx="250" cy="120" rx="30" ry="15" fill="white" opacity="0.8"/>
          
          <!-- Вертикальные линии (Рельеф головы как на фото) -->
          <path d="M295 30 L295 100" stroke="white" stroke-width="2" opacity="0.3"/>

        </g>

        <!-- Текст -->
        <text x="400" y="760" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="20" text-anchor="middle" fill="#aaa" letter-spacing="4">
          PORCELAIN #${fid}
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
