import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || "1";
  
  // Автоматически определяем домен сайта
  const host = request.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  return NextResponse.json({
    name: `Chrome Bear #${id}`,
    description: "Liquid Metal series. High-gloss reflective art toy generated on Base.",
    image: `${baseUrl}/api/image?fid=${id}`,
    external_url: baseUrl,
    attributes: [
      { trait_type: "Material", value: "Liquid Metal" },
      { trait_type: "FID", value: id },
      { trait_type: "Collection", value: "Chrome Gen" }
    ]
  });
}
