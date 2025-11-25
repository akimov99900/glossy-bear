import { NextResponse } from 'next/server';

// Разрешаем функции работать до 60 секунд (AI думает пару секунд, но запас нужен)
export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid') || '1';

    // 1. Определяем стиль на основе FID
    // (Чтобы у одного и того же человека всегда был один цвет)
    const styles = [
      'Pink Rose Quartz', 
      'Deep Blue Sapphire', 
      'Gold', 
      'Emerald Green', 
      'Black Onyx', 
      'Holographic Rainbow', 
      'Silver Diamond', 
      'Ruby Red'
    ];
    const userStyle = styles[Number(fid) % styles.length];

    // 2. Описание для нейросети
    const prompt = `A 3D render of a BearBrick toy covered in ${userStyle} Swarovski crystals. 
    Exact shape and pose as the reference image. 
    High fashion luxury product photography, sparkling gemstones, diamond texture. 
    Studio lighting, neutral background. Glossy, expensive, photorealistic 8k.`;

    // Проверяем, есть ли ключ Replicate
    if (!process.env.REPLICATE_API_TOKEN) {
      return new NextResponse("Error: Token missing in Vercel", { status: 500 });
    }

    // 3. Отправляем задачу в Replicate
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Модель FLUX.1-schnell (Быстрая и качественная)
        version: "5bf243909ad9473b96bf423b47334863346549241b711e2f3d61a8a29b634812",
        input: {
          prompt: prompt,
          // ТВОЯ КАРТИНКА ВСТАВЛЕНА СЮДА:
          image: "https://i.postimg.cc/MptNPZCX/ref.jpg", 
          // Сила влияния фото (0.6 = сохраняем форму, меняем материал)
          prompt_strength: 0.6,
          output_format: "png",
          go_fast: true
        },
      }),
    });

    if (response.status !== 201) {
      const error = await response.text();
      console.error("Replicate Error:", error);
      return new NextResponse("AI Error: " + error, { status: 500 });
    }

    const prediction = await response.json();
    
    // 4. Ждем результат (проверяем готовность)
    let imageUrl = null;
    const checkUrl = prediction.urls.get;
    
    // Пробуем 20 раз по 1 секунде
    for (let i = 0; i < 20; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const checkRes = await fetch(checkUrl, {
            headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` }
        });
        const statusData = await checkRes.json();
        
        if (statusData.status === "succeeded") {
            imageUrl = statusData.output[0];
            break;
        }
        if (statusData.status === "failed") {
            return new NextResponse("AI Generation Failed", { status: 500 });
        }
    }

    if (!imageUrl) {
        return new NextResponse("Timeout: Generation took too long", { status: 504 });
    }

    // 5. Перенаправляем на готовую картинку
    return NextResponse.redirect(imageUrl);

  } catch (e) {
    console.error(e);
    return new NextResponse("Server Error", { status: 500 });
  }
}
