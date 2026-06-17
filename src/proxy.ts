import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Domain-based routing + auth gate (Next.js 16 "proxy" convention).
 *
 * 1. Maps the incoming Host (demo.interactify.work) to the internal route
 *    /[domain]/[[...slug]], where the page resolves the site from Postgres.
 * 2. Gates protected pages: each page in the site config carries a `protected`
 *    flag (site_pages.is_protected). If the requested page is protected and the
 *    visitor has no session cookie, they're redirected to /login.
 *
 * Auth itself lives in the auth-microservice. Here we only check the PRESENCE
 * of the session cookie — the token is issued/validated elsewhere (later).
 */

const AUTH_COOKIE = 'auth_token';

interface PageInfo {
    slug: string; // renderer slug: 'home', 'mis-cursos', 'curso/:id'
    protected: boolean;
}

// Per-domain protection map, cached in-memory so we don't hit the backend on
// every request. Module state persists per server instance (standalone/Node).
const CONFIG_TTL_MS = 30_000;
const configCache = new Map<string, { expiry: number; pages: PageInfo[] }>();

function backendApiRoot(): string {
    const backend = process.env.BACKEND_URL?.replace(/\/$/, '');
    if (backend) return `${backend}/api`;
    const micro = process.env.NEXT_PUBLIC_MICROSERVICE_URL || 'http://localhost:8000/api/v1';
    const base = micro.replace(/\/api\/v1\/?$/, '/api');
    return base.endsWith('/api') ? base : `${base}/api`;
}

async function getSitePages(domain: string): Promise<PageInfo[]> {
    const cached = configCache.get(domain);
    if (cached && cached.expiry > Date.now()) return cached.pages;
    try {
        const res = await fetch(`${backendApiRoot()}/websites/${domain}/config`);
        if (!res.ok) return cached?.pages ?? [];
        const data = await res.json();
        const pages: PageInfo[] = (data.pages || []).map((p: { slug: string; protected?: boolean }) => ({
            slug: p.slug,
            protected: !!p.protected,
        }));
        configCache.set(domain, { expiry: Date.now() + CONFIG_TTL_MS, pages });
        return pages;
    } catch {
        // Fail-open: don't lock the whole site out if the backend hiccups.
        return cached?.pages ?? [];
    }
}

/** True if `pathname` matches a page marked protected (supports :param slugs). */
function isPathProtected(pathname: string, pages: PageInfo[]): boolean {
    const reqParts = pathname.replace(/^\//, '').split('/').filter(Boolean);
    for (const page of pages) {
        if (!page.protected) continue;
        const patSlug = page.slug === 'home' ? '' : page.slug;
        const patParts = patSlug.split('/').filter(Boolean);
        if (patParts.length !== reqParts.length) continue;
        const matched = patParts.every(
            (seg, i) => seg.startsWith(':') || seg === reqParts[i],
        );
        if (matched) return true;
    }
    return false;
}

export async function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const host = request.headers.get('host') || '';
    const domain = host.split(':')[0].replace(/^www\./, '');

    // ── Auth gate ──
    const pages = await getSitePages(domain);
    if (isPathProtected(pathname, pages) && !request.cookies.get(AUTH_COOKIE)?.value) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
    }

    // ── Domain rewrite ──
    const url = request.nextUrl.clone();
    url.pathname = `/${domain}${pathname === '/' ? '' : pathname}`;
    if (search) url.search = search;
    return NextResponse.rewrite(url);
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|\\.well-known|favicon.ico|api).*)'],
};
