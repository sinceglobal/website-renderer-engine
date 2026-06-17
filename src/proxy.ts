import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Domain-based routing (Next.js 16 "proxy" convention, formerly "middleware").
 *
 * The renderer serves many sites from a single deployment. Each incoming Host
 * (e.g. `demo.interactify.work`) is rewritten to the internal route
 * `/[domain]/[[...slug]]`, where the page resolves the site from Postgres via
 * the microservice (`GET /api/websites/{domain}/...`). The site is matched by
 * its registered `domain` column — see website-builder-microservice
 * api/v1/renderer._find_site_by_domain.
 *
 * No DB lookup happens here: the page itself returns notFound() when the domain
 * or slug doesn't resolve, so this stays a pure URL rewrite.
 */
export function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;
    const host = request.headers.get('host') || '';

    // Domain without port or leading www.
    const domain = host.split(':')[0].replace(/^www\./, '');

    // Rewrite "/" → "/{domain}" and "/about" → "/{domain}/about".
    const url = request.nextUrl.clone();
    url.pathname = `/${domain}${pathname === '/' ? '' : pathname}`;
    if (search) url.search = search;

    return NextResponse.rewrite(url);
}

export const config = {
    // Run on everything except Next internals, API routes, well-known and the favicon.
    matcher: ['/((?!_next/static|_next/image|\\.well-known|favicon.ico|api).*)'],
};
