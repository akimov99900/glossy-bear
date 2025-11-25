import { NextResponse } from 'next/server';

export async function GET(request0%, 30%)`;
    const metalDeep = `hsl(${tint}, 30%, 15%)`;

    const svg = `
      <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <!-- 1. ХРОМИРОВАННЫЙ ГРАДИЕНТ (Horizon Line) -->
          <!-- Имитирует отражение горизонта на металле -->
          <linearGradient id="chromeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${metalLight}"/>
            <stop offset="4: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid') || '1';
    
    // Генерируем металл на основе FID
    const seed = Number(fid) * 999;
    const type = seed % 5; // 5 видов металлов
    
    let baseColor, lightColor, metalName;
5%" stop-color="${metalMid}"/>
            <stop offset="50%" stop-color="${metalDeep}"/> <!-- Резкий переход -->
            <stop offset="55%" stop-color="${metalDark}"/>
            <stop offset="100%" stop-color="${metalLight}"/>
          </linearGradient>
          
          <!-- 2. Г    
    // Палитры металлов
    if (type === 0) { // Серебро (Chrome)
        baseColor = "#888888"; lightColor = "#ffffff"; metalName = "CHROME";
    } else if (type === 1) { // Золото (Gold)
        baseColor = "#d4af37"; lightColor = "#ffeb3b"; metalName = "GOLD";
    } else if (type === 2) { // Розовое золото (Rose)
        baseColor = "#b76e79"; lightColor = "#ffc0cb"; metalName = "лянцевый блик (Свет студии) -->
          <filter id="gloss">
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
            <feSpecularLighting in="blur" surfaceScale="5" specularConstant="1.5" specularExponent="30" lighting-color="white" result="specOut">
                <fePointLight x="-500" y="-1000" z="500"/>
            </feSpecularLighting>
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3="1" k4="0"/>
          </filter>

          <!-- 3. Тень на полу -->
          <radialGradient id="shadow" cx="50%" cy="50%" r="50%">ROSE";
    } else if (type === 3) { // Черный металл (Black)
        baseColor = "#1a1a1a"; lightColor = "#555555"; metalName = "OBSIDIAN";
    } else { // Титан (Синий отлив)
        baseColor = "#4a5a6a"; lightColor = "#a0b0c0"; metalName = "TITANIUM";
    }

    const svg = `
      <svg width="800" height="800" viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
        <defs>

             <stop offset="0%" stop-color="black" stop-opacity="0.4"/>
             <stop offset="100%" stop-color="black" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- Фон: Чистая студия (Серый градиент) -->
        <linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#f0f0f0"/>
            <stop offset="100%" stop-color="#d0d0d0"/>
        </linearGradient>
        <rect width="800" height="800" fill="url(#bg)"/>
        
        <!-- Тень -->
        <ellipse cx="40          <!-- Эффект Жидкого Металла (Chrome Shine) -->
          <filter id="liquidMetal">0" cy="720" rx="200" ry="40" fill="url(#shadow)" />

        <!-- МЕДВЕДЬ (Liquid Metal) -->
        <g transform="translate(150,
            <!-- Размываем, чтобы сгладить формы -->
            <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur"/>
            
            <!-- Создаем объемный свет (Specular) -->
            <feSpecularLighting in="blur" surfaceScale="8" specularConstant="1.8" specularExponent="30" lighting-color="${lightColor}" result="specOut">
                <fePointLight x="-500" y="-100 50) scale(0.9)" filter="url(#gloss)">
        
            <!-- Ноги -->
            <path d="M180 500 L180 680 Q180 740 230 740 L270 740 Q320 740 320 680 L320 520" fill="url(#chromeGrad)" stroke="${metalDeep}" stroke-width="1"/>
            <path d="M340 500 L340 680 Q340 740 390 740 L40" z="800"/>
            </feSpecularLighting>
            
            <!-- Смешиваем свет с цветом металла -->
            <feComposite in="specOut" in2="SourceAlpha" operator="in" result="specOut"/>
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k30 740 Q480 740 480 680 L480 520" fill="url(#chromeGrad)" stroke="${metalDeep}" stroke-width="1"/>

            <!-- Тело (Пузатое) -->
            <path d="M150 350 Q140 550 250 550 L350 550 Q450 550 440 350 Q440 21="0" k2="1" k3="1" k4="0"/>
            
            <!-- Добавляем отражение окружения (Horizon line) -->
            <feDropShadow dx="0" dy="10" stdDeviation="10" flood-color="black" flood-opacity="0.4"/>
          </filter>

          <!-- Градиент для тела (Блик горизонта) -->
          <linearGradient id="metalGrad" x1="0%" y80 295 280 Q150 280 150 350" fill="url(#chromeGrad)" />
            <!-- Отражение на животе -->
            <path d="M200 380 Q300 450 400 380" stroke="white" stroke-width="10" fill="none" opacity="0.4" filter="blur(5px)"/>

            <!-- Руки -->
            <path d="M160 320 Q80 350 81="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${lightColor}"/>
            <stop offset="50%" stop-color="${baseColor}"/>
            <stop offset="100%" stop-color="#000000"/>
          </linearGradient>
        </defs>

        <!-- Фон: Студия -->
        <radialGradient id="bg" cx="50%" cy="50%" r="80%">
            <stop offset="0%" stop-color="#f0f0f0"/>
            <0 450 Q80 500 110 520" fill="none" stroke="url(#chromeGrad)" stroke-width="60" stroke-linecap="round"/>
            <path d="M430 320 Q510 350 510 450 Q510 500 480 520" fill="none" stroke="url(#chromeGrad)" stroke-width="60" stroke-linecap="round"/>

            <!-- Голова -->
            <path d="M120 180 Q120 stop offset="100%" stop-color="#d0d0d0"/>
        </radialGradient>
        <rect width="800" height="800" fill="url(#bg)"/>

        <!-- МЕДВ30 295 30 Q470 30 470 180 Q470 320 295 320 Q120 320 120 1ЕДЬ (Цельный, гладкий, хромированный) -->
        <g transform="translate(180, 100) scale(0.85)" filter="url(#liquidMetal)">
            
            <!-- Уши -->
            <circle cx="100" cy="90" r="70" fill="url(#metalGrad)"/>
            <circle cx="440" cy="90" r="70" fill="url(#metalGrad)"/>

            <!-- Руки (Капли) -->
            <path d="M780" fill="url(#chromeGrad)" />
            
            <!-- Уши -->
            <circle cx="120" cy="100" r="65" fill="url(#chromeGrad)" />
            <circle cx="470" cy="100" r="65" fill="url(#chromeGrad)" />

            <!-- Лицо (Рельеф металлом) -->
            <path d="M220 220 Q295 260 370 220" stroke="${metalDeep}" stroke-width="30 280 Q 30 320 30 400 Q 30 480 60 500 Q 90 480 100 400" fill="url(#metalGrad)"/>
            <path d="M470 280 Q 510 320 510 400 Q 510 480 480 500 Q 450 480 440 400" fill="url(#metalGrad)"/>

            <!-- Ноги (Столбики) -->
            <path d="M160 500 L 160 650 Q 160 700 200 700 L 230 700 Q 270 700 270 650 L 270 500" fill="url(#metalGrad)"/>
            <path d="M290 500 L 290 650 Q 290 700 330 700 L 360" fill="none" opacity="0.3"/> <!-- Улыбка/Нос -->
            <ellipse cx="295" cy="210" rx="10" ry="5" fill="${metalDeep}" /> <!-- Нос -->

            <!-- СУПЕР БЛИК (Делает эффект хрома) -->
            <ellipse cx="200" cy="100" rx="40" ry="20" fill="white" opacity=" 700 Q 400 700 400 650 L 400 500" fill="url(#metalGrad)"/>

            <!-- Тело и Голова (Слитые, как ртуть) -->
            <path d="M120 200 
                     C 10.9" transform="rotate(-20 200 100)"/>
            <ellipse cx="390" cy="100" rx="20" ry="10" fill="white" opacity="0.9"/>
        </g>

        <!-- Текст (Tech Style) -->
        <text x="400" y="760" font-family="Arial, sans-serif" font-weight="bold" font-size="16" text-anchor="middle" fill="#888" letter-spacing="6">
          CHROME #${fid}
        </text>
      </svg>
    `.trim();

    return new NextResponse(svg, {20 40 420 40 420 200 
                     C 420 300 380 300 380 360
                     C 420 380 420 550 270 550
                     C 120 550 120 380 160 360
                     C 160 300 120 300 120
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return new NextResponse("Error", { status: 500 });
  }
}
