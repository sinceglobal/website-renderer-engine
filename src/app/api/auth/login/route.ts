import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Session cookie writer.
 *
 * This ONLY stores a token in an httpOnly cookie so the proxy can detect a
 * logged-in visitor. It does NOT authenticate anyone — credential checking is
 * the auth-microservice's job. Later, the login form (or the auth callback)
 * will obtain a real JWT and call this to persist it.
 *
 *   GET  /api/auth/login?token=...&redirect=/mis-cursos   (browser/callback)
 *   POST /api/auth/login   { token, redirect? }            (form / fetch)
 */

const AUTH_COOKIE = 'auth_token';
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function safePath(p: string | null | undefined): string {
    if (!p || !p.startsWith('/') || p.startsWith('//')) return '/';
    return p;
}

function setSession(res: NextResponse, token: string) {
    res.cookies.set(AUTH_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: MAX_AGE,
    });
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token') || 'session';
    const redirect = safePath(searchParams.get('redirect'));
    const res = NextResponse.redirect(new URL(redirect, request.url));
    setSession(res, token);
    return res;
}

export async function POST(request: NextRequest) {
    let token = 'session';
    let redirect = '/';
    try {
        const body = await request.json();
        if (body?.token) token = String(body.token);
        if (body?.redirect) redirect = safePath(String(body.redirect));
    } catch {
        // empty/invalid body is fine
    }
    const res = NextResponse.json({ ok: true, redirect });
    setSession(res, token);
    return res;
}
