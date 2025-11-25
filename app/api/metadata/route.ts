import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idString = searchParams.get('id') || "1";
  const id = Number(idString);

  // 👇👇👇 ВСТАВЬ СЮДА ССЫЛКИ НА ТВОИ 3 КАРТИНКИ 👇👇👇
  const bears = [
    "https://i.postimg.cc/hjVWRzvb/004.jpg", // Картинка для 1, 4, 7... (Твой серебряный)
    "https://i.postimg.cc/rFf6TLVn/003.jpg", // Картинка для 2, 5, 8... (Например, Золотой)
    "https://i.postimg.cc/RF5ydSd4/005.jpg"  // Картинка для 3, 6, 9... (Например, Розовый)
  ];

  // Выбираем картинку по очереди: (ID - 1) делим на 3 и берем остаток
  const imageIndex = (id - 1) % bears.length;
  const selectedImage = bears[imageIndex];

  // Названия тоже можно менять
  const bearNames = ["Silver Chrome", "Liquid Gold", "Rose Quartz"];
  const selectedName = bearNames[imageIndex];

  return NextResponse.json({
    name: `${selectedName} #${id}`,
    description: "Exclusive BearBrick Collection on Base.",
    image: selectedImage,
    attributes: [
      { trait_type: "Type", value: selectedName },
      { trait_type: "Drop", value: "Gen 1" }
    ]
  });
}
