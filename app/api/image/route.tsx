import { NextResponse } from 'next/server';

// Разрешаем функции работать дольше (до 60 сек), так как AI думает
export const maxDuration = 60; 

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid') || '1';

    // 1. Выбираем уникальный стиль для юзера
    const styles = [
      'Pink Rose Quartz', 'Sapphire Blue', 'Gold', 'Emerald Green', 
      'Black Obsidian', 'Holographic Rainbow', 'Silver Chrome', 'Ruby Red'
    ];
    // Математика: FID 123 всегда будет давать один и тот же цвет
    const userStyle = styles[Number(fid) % styles.length];

    // 2. Промпт для нейросети (Swarovski Style)
    const prompt = `A full body shot of a BearBrick toy made of ${userStyle} Swarovski crystals. 
    High fashion luxury product photography, macro lens, sparkling gemstones, diamond texture. 
    Studio lighting, dark grey background, reflection on the floor. 
    The bear is glossy, expensive, photorealistic 8k. 
    Cute rounded ears, distinct limbs.`;

    // Проверка ключа (чтобы ты видел ошибку, если забыл шаг 2)
    if (!process.env.REPLICATE_API_TOKEN) {
      return new NextResponse("Error: REPLICATE_API_TOKEN is missing in Vercel Settings", { status: 500 });
    }

    // 3. Отправляем задачу в Replicate (Flux-Schnell - самая быстрая модель)
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Версия модели Flux-Schnell
        version: "5bf243909ad9473b96bf423b47334863346549241b711e2f3d61a8a29b634812",
        input: {
          prompt: prompt,
          aspect_ratio: "1:1",   // Квадрат
          output_format: "png",
          go_fast: true          // Режим скорости
        },
      }),
    });

    if (response.status !== 201) {
      const error = await response.text();
      return new NextResponse("AI Error: " + error, { status: 500 });
    }

    const prediction = await response.json();
    
    // 4. Ждем результат (Polling)
    let imageUrl = null;
    const checkUrl = prediction.urls.get;
    
    // Проверяем готовность 10 раз (до 10-15 секунд)
    for (let i = 0; i < 15; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Ждем 1 сек
        
        const checkRes = await fetch(checkUrl, {
            headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` }
        });
        const statusData = await checkRes.json();
        
        if (statusData.status === "succeeded") {
            imageUrl = statusData.output[0];
            break; // Готово!
        }
        if (statusData.status === "failed") {
            return new NextResponse("AI Generation Failed", { status: 500 });
        }
    }

    if (!imageUrl) {
        return new NextResponse("Timeout: Image took too long to generate", { status: 504 });
    }

    // 5. Перенаправляем пользователя на готовую картинку
    return NextResponse.redirect(imageUrl);

  } catch (e) {
    console.error(e);
    return new NextResponse("Server Error", { status: 500 });
  }
}
