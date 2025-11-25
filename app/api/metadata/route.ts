import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id') || "1";
  const host = request.headers.get('host');
  const protocol = host?.includes('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  return NextResponse.json({
    name: `Base Droid #${id}`,
    description: "Battle-scarred industrial droid generated on Base network. Each unit features unique weathering and identification markings.",
    image: `${baseUrl}/api/image?fid=${id}`,
    external_url: baseUrl,
    attributes: [
      { trait_type: "Type", value: "Industrial" },
      { trait_type: "Condition", value: "Battle-Scarred" },
      { trait_type: "FID", value: id }
    ]
  });
}
