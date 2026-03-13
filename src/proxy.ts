import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const isDevelopment = process.env.NODE_ENV === 'development';
const BUILDER_DUMP_URL = process.env.NEXT_PUBLIC_BUILDER_DUMP_URL || 'http://localhost:3000/api/builder/dump';

interface WebsiteConfig {
    id: string;
    domain: string;
    pages: Array<{
        slug: string;
        title: string;
    }>;
    config: Record<string, any>;
}

// Helper to convert Next.js dynamic routes (e.g., /course/[slug]) to regex patterns
function getRoutePattern(slug: string) {
    if (slug === '/' || slug === 'home' || slug === '') return '^/$';

    // Replace [param] with regex matching anything except a slash
    const pattern = slug.replace(/\[([^\]]+)\]/g, '([^/]+)');
    return `^/${pattern}$`;
}

function isPathAllowed(pathname: string, pages: any[]) {
    if (!Array.isArray(pages)) return false;

    return pages.some((page) => {
        if (page.slug === undefined) return false;

        let pSlug = page.slug === 'home' ? '' : page.slug;
        let formattedPathname = pathname;

        if (pathname === '/') {
            return pSlug === '';
        }

        try {
            const regex = new RegExp(getRoutePattern(pSlug));
            return regex.test(formattedPathname);
        } catch (err) {
            return false;
        }
    });
}

async function fetchWebsiteConfig(domain: string): Promise<WebsiteConfig | null> {
    try {
        if (isDevelopment) {
            // En desarrollo: obtener de website builder dump
            const response = await fetch(BUILDER_DUMP_URL, {
                cache: 'no-store' // Always fresh in development
            });
            if (!response.ok) {
                console.error(`Error fetching builder dump: ${response.status}`);
                return null;
            }

            const data = await response.json();

            // El dump contiene todos los websites, buscar por dominio
            // If it's localhost, we can just return the first one for testing if domain isn't perfectly mapped
            const website = data.websites?.find((w: WebsiteConfig) => w.domain === domain) || data.websites?.[0];

            if (!website) {
                console.warn(`Website not found for domain: ${domain}`);
                return null;
            }

            return website;
        } else {
            // En producción: obtener de API backend
            const url = `${process.env.BACKEND_URL}/api/websites/config`;

            const response = await fetch(url, {
                headers: {
                    'X-Domain': domain,
                    'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
                },
                next: { revalidate: 3600 }
            });

            if (!response.ok) {
                console.error(`Error fetching config: ${response.status}`);
                return null;
            }

            const config = await response.json();
            return config;
        }
    } catch (error) {
        console.error('Error fetching website config:', error);
        return null;
    }
}

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const host = request.headers.get('host') || '';

    // Extraer dominio (sin puerto)
    const domain = host.split(':')[0].replace('www.', '');

    // NO interceptar:
    // - Assets estáticos
    // - API routes
    // - Rutas del sistema (well-known)
    // - Favicon
    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/.well-known') ||
        pathname === '/favicon.ico'
    ) {
        return NextResponse.next();
    }

    // Skip explicit config fetching in development to avoid circular loops
    // page.tsx will naturally handle the 404 if the site/page doesn't exist in MongoDB
    if (isDevelopment) {
        const url = request.nextUrl.clone();
        url.pathname = `/${domain}${pathname === '/' ? '' : pathname}`;
        return NextResponse.rewrite(url);
    }

    // Obtener configuración del website
    const config = await fetchWebsiteConfig(domain);

    if (!config) {
        // Website no encontrado
        return NextResponse.rewrite(new URL('/404', request.url));
    }

    // Verificar si la página existe en la configuración permitida
    const allowed = isPathAllowed(pathname, config.pages);

    if (!allowed) {
        console.log(`[Middleware] Acceso denegado a ruta: ${pathname} para el dominio: ${domain}`);
        // Página no permitida o no existe
        return NextResponse.rewrite(new URL('/404', request.url));
    }

    // Reescribir URL para incluir dominio en params
    // De: /home
    // A: /[domain]/[slug]
    const url = request.nextUrl.clone();
    url.pathname = `/${domain}${pathname === '/' ? '' : pathname}`;

    return NextResponse.rewrite(url);
}

export const config = {
    matcher: [
        // Interceptar todas las rutas excepto las excluidas arriba
        '/((?!_next/static|_next/image|\\.well-known|favicon.ico|api).*)',
    ],
};
