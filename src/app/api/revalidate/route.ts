import { revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret');
  const tag = request.nextUrl.searchParams.get('tag');

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  if (!tag) {
    return NextResponse.json({ message: 'Missing tag param' }, { status: 400 });
  }

  // @ts-expect-error Next.js 16.1+ expects a second argument 'profile' but standard Next.js 14/15 uses 1.
  revalidateTag(tag);

  return NextResponse.json({ revalidated: true, now: Date.now(), tag });
}
