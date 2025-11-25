// ... (остальной код тот же)
  return NextResponse.json({
    name: `Chrome Bear #${id}`,
    description: "Liquid Metal series. High-gloss reflective art toy generated on Base.",
    image: `${baseUrl}/api/image?fid=${id}`,
    external_url: baseUrl,
    attributes: [
      { trait_type: "Material", value: "Liquid Metal" },
      { trait_type: "FID", value: id }
    ]
  });
