import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || "1";
  
  // Определяем адрес сайта
  const host = request.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  return NextResponse.json({
    name: `Chrome Bear #${id}`,
    description: "Unique Liquid Metal generated on Base.",
    // ВОТ ЗДЕСЬ МЫ ВОЗВРАЩАЕМ ГЕНЕРАТОР
    image: `${baseUrl}/api/image?fid=${id}`, 
    external_url: baseUrl,
    attributes: [
      { trait_type: "Material", value: "Liquid Chrome" },
      { trait_type: "FID", value: id }
    ]
  });
}
