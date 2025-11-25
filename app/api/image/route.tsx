import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fid = searchParams.get('fid') || '1'; // Тут используем FID или ID токена, логика та же
  const id = Number(fid);

  // ТЕ ЖЕ САМЫЕ ССЫЛКИ, ЧТО В ШАГЕ 1
  const bears = [
    "https://i.postimg.cc/MptNPZCX/ref.jpg", 
    "https://i.postimg.cc/ВТОРАЯ_ССЫЛКА.jpg", 
    "https://i.postimg.cc/ТРЕТЬЯ_ССЫЛКА.jpg"  
  ];

  const imageIndex = (id - 1) % bears.length;
  
  // Просто перенаправляем браузер на картинку
  return NextResponse.redirect(bears[imageIndex]);
}
