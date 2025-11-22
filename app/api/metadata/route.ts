import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || "1";
  
  // Автоматически определяем домен сайта
  const host = request.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  return NextResponse.json({
    name: `Crystal Bear #${id}`,
    description: "Unique Swarovski-style generated BearBrick based on your Farcaster Identity (FID).",
    image: `${baseUrl}/api/image?fid=${id}`, // Ссылка на твой генератор
    external_url: baseUrl,
    attributes: [
      { trait_type: "Style", value: "Swarovski Crystal" },
      { trait_type: "FID", value: id },
      { trait_type: "Collection", value: "Glossy Gen 2" }
    ]
  });
}
