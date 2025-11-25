import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || "1";

  return NextResponse.json({
    name: `Chrome Bear #${id}`,
    description: "Exclusive Liquid Metal Collection on Base. Minted via Farcaster.",
    // ВАЖНО: Мы ставим прямую ссылку на фото. Это работает 100% безотказно.
    image: "https://i.postimg.cc/MptNPZCX/ref.jpg", 
    attributes: [
      { trait_type: "Material", value: "Liquid Chrome" },
      { trait_type: "FID", value: id },
      { trait_type: "Drop", value: "Gen 1" }
    ]
  });
}
