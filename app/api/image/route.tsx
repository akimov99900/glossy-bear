import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid') || '888';
    
    // Генерируем уникальный цвет кристаллов на основе FID
    const seed = Number(fid) * 9999;
    const hue = (seed % 360); 
    
    // Цвета кристаллов (Swarovski Style)
    // Base - основной цвет страз
    // Light - цвет перелива (радужный)
    const colorBase = `hsl(${hue}, 80%, 60%)`; 
    const colorDark = `hsl(${hue}, 90%, 35%)`; 

    const svg = `
      <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 1. Текстура Кристаллов (NOISE) -->
          <!-- Это создает эффект тысяч мелких граней -->
          <filter id="crystalTexture" x="0%" y="0%" width="100%" height="100%">
            <!-- Создаем шум (зерно) -->
            <feTurbulence type="fractalNoise" baseFrequency="1.5" numOctaves="3" result="noise"/>
            <!-- Добавляем контраст, чтобы зерна были четкими как камни -->
            <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" in="noise" result="contrastNoise"/>
            <!-- Смешиваем шум с цветом медведя -->
            <feComposite operator="in" in="contrastNoise" in2="SourceGraphic" result="texturedBear"/>
            <!-- Добавляем свет (Specularity) на грани камней -->
            <feSpecularLighting in="contrastNoise" surfaceScale="15" specularConstant="1.2" specularExponent="25" lighting-color="#ffffff" result="sparkles">
                <fePointLight x="-500" y="-500" z="1000"/>
            </feSpecularLighting>
            <!-- Накладываем блеск на текстуру -->
            <feComposite operator="in" in="sparkles" in2="SourceAlpha" result="sparklesClipped"/>
            <feComposite operator="arithmetic" k1="0" k2="1" k3="1" k4="0" in="texturedBear" in2="sparklesClipped"/>
          </filter>

          <!-- 2. Градиент перелива (Iridescence) - как бензин/радуга -->
          <linearGradient id="rainbowSheen" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" stop-color="${colorBase}" stop-opacity="1"/>
             <stop offset="50%" stop-color="${colorDark}" stop-opacity="1"/>
             <stop offset="100%" stop-color="${colorBase}" stop-opacity="1"/>
          </linearGradient>
          
          <!-- 3. Тень на фоне -->
           <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="8"/>
            <feOffset dx="5" dy="10"/>
            <feComponentTransfer><feFuncA type="linear" slope="0.4"/></feComponentTransfer>
            <feMerge>
                <feMergeNode/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <!-- Фон: Студийный мрамор -->
        <radialGradient id="bg" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stop-color="#f8f9fa"/>
            <stop offset="100%" stop-color="#dde1e7"/>
        </radialGradient>
        <rect width="800" height="800" fill="url(#bg)"/>
        
        <!-- Пальмовая тень (для стиля как на фото) -->
        <path d="M0 600 L800 400 L800 800 L0 800 Z" fill="black" opacity="0.05" filter="blur(20px)"/>

        <!-- МЕДВЕДЬ (Сгруппированный, цельный силуэт) -->
        <g transform="translate(180, 100) scale(0.85)" filter="url(#dropShadow)">
            
            <!-- Группа с текстурой кристаллов -->
            <g fill="url(#rainbowSheen)" filter="url(#crystalTexture)">
                
                <!-- 1. Уши (Присоединены к голове) -->
                <circle cx="100" cy="80" r="70" />
                <circle cx="440" cy="80" r="70" />

                <!-- 2. Руки (Свисают вдоль тела, единое целое) -->
                <!-- Левая -->
                <path d="M80 280 Q 40 320 40 400 Q 40 480 70 500 Q 100 480 110 400" />
                <!-- Правая -->
                <path d="M460 280 Q 500 320 500 400 Q 500 480 470 500 Q 440 480 430 400" />

                <!-- 3. Ноги (Столбики, без разрывов) -->
                <path d="M160 500 L 160 650 Q 160 700 200 700 L 230 700 Q 270 700 270 650 L 270 500" />
                <path d="M290 500 L 290 650 Q 290 700 330 700 L 360 700 Q 400 700 400 650 L 400 500" />

                <!-- 4. Тело и Голова (Слиты воедино) -->
                <!-- Рисуем как одну большую форму матрешки -->
                <path d="M120 200 
                         C 120 50 420 50 420 200 
                         C 420 300 380 300 380 350
                         C 420 380 420 550 270 550
                         C 120 550 120 380 160 350
                         C 160 300 120 300 120 200 Z" />
            </g>
        </g>
        
        <!-- Текст FID (Брендинг) -->
        <text x="400" y="750" font-family="Arial, sans-serif" font-weight="bold" font-size="18" text-anchor="middle" fill="#aaa" letter-spacing="3">
            CRYSTAL #${fid}
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
