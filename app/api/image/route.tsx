import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid') || '888';
    
    // Генерируем параметры дроида
    const seed = Number(fid) * 5678;
    
    // Палитры "Индустриальные"
    const hues = [45, 200, 25, 0]; // Желтый (как на фото), Стальной, Военный, Красный
    const selectedHue = hues[seed % hues.length];
    
    // Основной цвет краски (потертый)
    const colorPaint = `hsl(${selectedHue}, 70%, 55%)`; 
    // Цвет глаз (Голубой или Красный)
    const eyeHue = (seed % 2 === 0) ? 190 : 0;
    const colorEye = `hsl(${eyeHue}, 100%, 70%)`;

    const svg = `
      <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 1. Текстура РЖАВЧИНЫ и ГРЯЗИ (Самое важное) -->
          <filter id="rustFilter">
            <!-- Генерируем крупный шум (вмятины) -->
            <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise"/>
            
            <!-- Освещение рельефа (чтобы выглядело как металл) -->
            <feDiffuseLighting in="noise" lighting-color="#d9a873" surfaceScale="2" result="lightNoise">
                <feDistantLight azimuth="45" elevation="60"/>
            </feDiffuseLighting>
            
            <!-- Смешиваем шум с исходным объектом -->
            <feComposite operator="in" in="lightNoise" in2="SourceGraphic" result="textured"/>
            <feBlend mode="multiply" in="textured" in2="SourceGraphic"/>
          </filter>

          <!-- 2. Эффект свечения глаз -->
          <filter id="glow">
             <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
             <feMerge>
                 <feMergeNode in="coloredBlur"/>
                 <feMergeNode in="SourceGraphic"/>
             </feMerge>
          </filter>

          <!-- 3. Граффити-маркер (небрежный) -->
          <filter id="marker">
             <feTurbulence type="fractalNoise" baseFrequency="0.1" numOctaves="1" result="noise"/>
             <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
          </filter>
        </defs>

        <!-- Фон: Темный ангар -->
        <rect width="800" height="800" fill="#111"/>
        <radialGradient id="spotlight" cx="50%" cy="0%" r="80%">
            <stop offset="0%" stop-color="#333" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="#000" stop-opacity="0"/>
        </radialGradient>
        <rect width="800" height="800" fill="url(#spotlight)"/>

        <!-- РОБОТ (Группа с фильтром ржавчины) -->
        <g transform="translate(150, 50) scale(0.9)" filter="url(#rustFilter)">
            
            <!-- ШЕЯ (Поршни) -->
            <rect x="230" y="320" width="40" height="60" fill="#333" stroke="#111" stroke-width="2"/>
            <rect x="240" y="320" width="10" height="60" fill="#555"/> <!-- Кабель -->

            <!-- ТЕЛО (Бронепластина) -->
            <!-- Основная форма -->
            <path d="M120 360 L380 360 L420 420 L420 650 L380 700 L120 700 L80 650 L80 420 Z" fill="${colorPaint}" stroke="#222" stroke-width="4"/>
            
            <!-- Детали на груди (Люк) -->
            <circle cx="330" cy="500" r="50" fill="#333" stroke="#222" stroke-width="3"/>
            <text x="330" y="520" font-family="Arial Black" font-size="40" fill="${colorEye}" text-anchor="middle" opacity="0.5">|||</text>
            
            <!-- Царапины/Повреждения (Граффити стиль) -->
            <path d="M100 450 L150 480 M110 490 L130 460" stroke="#222" stroke-width="3" opacity="0.6"/>

            <!-- ПЛЕЧИ (Шарниры) -->
            <circle cx="80" cy="420" r="40" fill="#444" stroke="#111" stroke-width="5"/>
            <circle cx="420" cy="420" r="40" fill="#444" stroke="#111" stroke-width="5"/>

            <!-- РУКИ (Механизмы) -->
            <rect x="30" y="450" width="50" height="200" fill="#555" stroke="#111" stroke-width="3"/>
            <rect x="420" y="450" width="50" height="200" fill="#555" stroke="#111" stroke-width="3"/>
            
            <!-- Надпись BASE на руке -->
            <text x="445" y="600" font-family="Courier New" font-weight="bold" font-size="30" fill="#222" transform="rotate(90, 445, 600)" opacity="0.7">BASE</text>

            <!-- ГОЛОВА (Потертая каска) -->
            <g transform="rotate(-5 250 200)">
                <!-- Шлем -->
                <path d="M120 320 L380 320 L380 150 Q380 50 250 50 Q120 50 120 150 Z" fill="${colorPaint}" stroke="#111" stroke-width="5"/>
                
                <!-- Линия стыка пластин -->
                <line x1="250" y1="50" x2="250" y2="320" stroke="#111" stroke-width="3" opacity="0.5"/>
                
                <!-- ГЛАЗА (Светящиеся) -->
                <g filter="url(#glow)">
                    <circle cx="190" cy="200" r="45" fill="#111" stroke="#333" stroke-width="5"/>
                    <circle cx="190" cy="200" r="25" fill="${colorEye}"/>
                    
                    <circle cx="310" cy="200" r="45" fill="#111" stroke="#333" stroke-width="5"/>
                    <circle cx="310" cy="200" r="25" fill="${colorEye}"/>
                </g>

                <!-- ГРАФФИТИ НА ЛБУ -->
                <text x="250" y="120" font-family="Verdana, sans-serif" font-weight="bold" font-size="35" text-anchor="middle" fill="#222" filter="url(#marker)" transform="rotate(2)">
                   BASE
                </text>
                 <text x="320" y="280" font-family="Arial" font-size="20" fill="#222" opacity="0.6" transform="rotate(-10)">#${fid}</text>
            </g>
        </g>

        <!-- Атмосферная пыль -->
        <rect width="800" height="800" fill="url(#rustFilter)" opacity="0.1" pointer-events="none"/>
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
