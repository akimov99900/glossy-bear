import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid') || '888';
    
    // Генерация палитры (Розовый/Арт стиль как на фото)
    // Мы используем хеш от FID чтобы генерировать узоры
    const seed = Number(fid) * 12345;
    const hueBase = (seed % 60) + 320; // Диапазон розовых/красных оттенков (320-380)
    const hueAccent = (seed % 100) + 180; // Голубые/Зеленые акценты

    const colorBase = \`hsl(\${hueBase}, 90%, 65%)\`; 
    const colorDark = \`hsl(\${hueBase}, 90%, 45%)\`;
    const colorAccent = \`hsl(\${hueAccent}, 80%, 60%)\`;

    // Функция для генерации случайных "граффити" пятен
    const generatePattern = (count: number) => {
       let patterns = '';
       for(let i=0; i<count; i++) {
          const x = (seed * (i+1) * 17) % 100;
          const y = (seed * (i+1) * 31) % 100;
          const r = (seed * (i+1) * 5) % 20 + 5;
          const fill = i % 2 === 0 ? colorAccent : '#ffffff';
          const opacity = 0.6;
          patterns += \`<circle cx="\${x}%" cy="\${y}%" r="\${r}" fill="\${fill}" opacity="\${opacity}" />\`;
          // Добавляем "каракули"
          patterns += \`<path d="M \${x} \${y} Q \${x+10} \${y-10} \${x+20} \${y}" stroke="\${colorDark}" stroke-width="2" fill="none" opacity="0.5"/>\`;
       }
       return patterns;
    };

    const patternOverlay = generatePattern(15);

    const svg = \`
      <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <!-- 1. Градиент для "глянца" (High Gloss) -->
            <linearGradient id="gloss" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="white" stop-opacity="0.7"/>
                <stop offset="20%" stop-color="white" stop-opacity="0.2"/>
                <stop offset="50%" stop-color="white" stop-opacity="0"/>
                <stop offset="100%" stop-color="black" stop-opacity="0.3"/>
            </linearGradient>

            <!-- 2. Паттерн с "татуировками" -->
            <pattern id="artPattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <rect width="100" height="100" fill="\${colorBase}"/>
                \${patternOverlay}
            </pattern>

            <!-- 3. Тени (Ambient Occlusion) -->
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#000" flood-opacity="0.4"/>
            </filter>
            
            <!-- 4. 3D Lighting (Спекулярный свет) -->
            <filter id="plastic3D">
                <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
                <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1" specularExponent="20" lighting-color="#white" result="specOut">
                    <fePointLight x="-5000" y="-10000" z="20000"/>
                </feSpecularLighting>
                <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
                <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
            </filter>
        </defs>

        <!-- Фон (Студийный) -->
        <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#f3f3f3"/>
            <stop offset="100%" stop-color="#e0e0e0"/>
        </radialGradient>
        <rect width="800" height="800" fill="url(#bgGrad)"/>

        <!-- ГРУППА МЕДВЕДЯ -->
        <g transform="translate(100, 50) scale(0.75)" filter="url(#shadow)">
            
            <!-- СИЛУЭТ (Каждая часть тела отдельно для 3D эффекта) -->
            
            <!-- Уши (Задний план) -->
            <g>
                <circle cx="200" cy="150" r="80" fill="url(#artPattern)" />
                <circle cx="200" cy="150" r="80" fill="url(#gloss)" />
                
                <circle cx="600" cy="150" r="80" fill="url(#artPattern)" />
                <circle cx="600" cy="150" r="80" fill="url(#gloss)" />
            </g>

            <!-- Руки (Задний план) -->
            <path d="M120 350 L80 500 A 40 40 0 0 0 120 540 L160 540" stroke="url(#artPattern)" stroke-width="60" stroke-linecap="round" fill="none" />
            <path d="M120 350 L80 500 A 40 40 0 0 0 120 540 L160 540" stroke="url(#gloss)" stroke-width="60" stroke-linecap="round" fill="none" opacity="0.5"/>

            <path d="M680 350 L720 500 A 40 40 0 0 1 680 540 L640 540" stroke="url(#artPattern)" stroke-width="60" stroke-linecap="round" fill="none" />
            <path d="M680 350 L720 500 A 40 40 0 0 1 680 540 L640 540" stroke="url(#gloss)" stroke-width="60" stroke-linecap="round" fill="none" opacity="0.5"/>

            <!-- Ноги -->
            <g>
                <!-- Левая -->
                <path d="M250 550 L250 750 A 40 40 0 0 0 290 790 L350 790 A 40 40 0 0 0 390 750 L390 550 Z" fill="url(#artPattern)" />
                <path d="M250 550 L250 750 A 40 40 0 0 0 290 790 L350 790 A 40 40 0 0 0 390 750 L390 550 Z" fill="url(#gloss)" />
                
                <!-- Правая -->
                <path d="M410 550 L410 750 A 40 40 0 0 0 450 790 L510 790 A 40 40 0 0 0 550 750 L550 550 Z" fill="url(#artPattern)" />
                <path d="M410 550 L410 750 A 40 40 0 0 0 450 790 L510 790 A 40 40 0 0 0 550 750 L550 550 Z" fill="url(#gloss)" />
            </g>

            <!-- Тело -->
            <rect x="220" y="300" width="360" height="300" rx="60" fill="url(#artPattern)" />
            <rect x="220" y="300" width="360" height="300" rx="60" fill="url(#gloss)" />

            <!-- Голова -->
            <rect x="150" y="100" width="500" height="380" rx="140" ry="120" fill="url(#artPattern)" />
            <!-- Блики на голове -->
            <rect x="150" y="100" width="500" height="380" rx="140" ry="120" fill="url(#gloss)" />
            
            <!-- Лицо (Минимализм, как на фото) -->
             <!-- Глаза -->
            <ellipse cx="300" cy="250" rx="25" ry="35" fill="#222" />
            <ellipse cx="500" cy="250" rx="25" ry="35" fill="#222" />
            <!-- Блики в глазах -->
            <circle cx="310" cy="240" r="8" fill="white" opacity="0.8"/>
            <circle cx="510" cy="240" r="8" fill="white" opacity="0.8"/>

        </g>

        <text x="400" y="750" font-family="Arial, sans-serif" font-weight="bold" font-size="24" text-anchor="middle" fill="#999" letter-spacing="5">
            GLOSSY #\${fid}
        </text>
      </svg>
    \`.trim();

    return new NextResponse(svg, {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return new NextResponse("Error", { status: 500 });
  }
}
