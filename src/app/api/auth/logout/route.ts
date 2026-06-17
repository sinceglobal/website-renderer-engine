import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** Clears the session cookie. GET (browser link) or POST (fetch). */

const AUTH_COOKIE = 'auth_token';

function safePath(p: string | null | undefined): string {
    if (!p || !p.startsWith('/') || p.startsWith('//')) return '/';
    return p;
}

function clearSession(res: NextResponse) {
    res.cookies.set(AUTH_COOKIE, '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
    });
}

export async function GET(request: NextRequest) {
    const redirect = safePath(new URL(request.url).searchParams.get('redirect'));
    const res = NextResponse.redirect(new URL(redirect, request.url));
    clearSession(res);
    return res;
}

export async function POST() {
    const res = NextResponse.json({ ok: true });
    clearSession(res);
    return res;
}
