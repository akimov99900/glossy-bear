import { NextResponse } from 'next/server';

export const maxDuration = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const fid = searchParams.get('fid') || '1';

    // 1. Генерируем разные металлы для разных юзеров
    const materials = [
      'Polished Silver Chrome', // Как на фото
      'Liquid Gold',            // Золотой
      'Rose Gold Metal',        // Розовое золото
      'Matte Black Metal',      // Черный матовый
      'Iridescent Titanium',    // Бензиновый перелив
      'Brushed Steel',          // Сталь
      'Polished Bronze',        // Бронза
      'White Ceramic'           // Белая керамика
    ];
    // Выбираем материал по FID
    const userMaterial = materials[Number(fid) % materials.length];

    // 2. Промпт (Описание для AI)
    const prompt = `A 3D render of a BearBrick toy made of ${userMaterial}. 
    Exact shape and pose as the reference image. 
    High end product photography, studio lighting, soft shadows, clean background. 
    Highly reflective surface, glossy, minimalist, expensive art toy. 8k resolution.`;

    if (!process.env.REPLICATE_API_TOKEN) {
      return new NextResponse("Error: Token missing", { status: 500 });
    }

    // 3. Отправляем в Replicate
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        version: "5bf243909ad9473b96bf423b47334863346549241b711e2f3d61a8a29b634812",
        input: {
          prompt: prompt,
          // 👇👇👇 ВСТАВЬ СЮДА ССЫЛКУ НА НОВОГО СЕРЕБРЯНОГО МЕДВЕДЯ 👇👇👇
          image: "https://i.postimg.cc/MptNPZCX/ref.jpg", 
          // 👆👆👆 --------------------------------------------------- 👆👆👆
          prompt_strength: 0.65, // Чуть повысим, чтобы он сильнее держался за форму оригинала
          output_format: "png",
          go_fast: true
        },
      }),
    });

    if (response.status !== 201) {
      const error = await response.text();
      return new NextResponse("AI Error: " + error, { status: 500 });
    }

    const prediction = await response.json();
    const checkUrl = prediction.urls.get;
    
    let imageUrl = null;
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
        if (statusData.status === "failed") break;
    }

    if (!imageUrl) return new NextResponse("Timeout", { status: 504 });

    return NextResponse.redirect(imageUrl);

  } catch (e) {
    console.error(e);
    return new NextResponse("Server Error", { status: 500 });
  }
}
