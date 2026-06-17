import { notFound } from 'next/navigation';
import { PageRenderer, ThemeProvider } from '@sinceglobal/website-builder-base';
import { loadTemplate } from '@/lib/template-loader';

const isDevelopment = process.env.NODE_ENV === 'development';
const MICROSERVICE_URL = process.env.NEXT_PUBLIC_MICROSERVICE_URL || 'http://localhost:8000/api/v1';

// In development we render drafts (preview); in production only published.
const PREVIEW = isDevelopment;

/**
 * Base URL of the microservice renderer router (mounted at /api).
 * BACKEND_URL wins whenever it is set, so resolution never silently falls back
 * to localhost just because NODE_ENV isn't exactly "development".
 */
function rendererApiRoot(): string {
  const backend = process.env.BACKEND_URL?.replace(/\/$/, '');
  if (backend) return `${backend}/api`;
  // Dev fallback derived from the public microservice URL.
  const base = MICROSERVICE_URL.replace(/\/api\/v1\/?$/, '/api');
  return base.endsWith('/api') ? base : `${base}/api`;
}

function rendererFetchInit(): RequestInit {
  if (isDevelopment) return { cache: 'no-store' };
  return {
    headers: { Authorization: `Bearer ${process.env.BACKEND_API_KEY}` },
    next: { revalidate: 3600 },
  } as RequestInit;
}

interface PageProps {
  params: Promise<{
    domain: string;
    slug?: string[];
  }>;
}

/**
 * Mapea recursivamente "type" a "nodeType" para compatibilidad con la librería base
 */
function normalizeNodeTypes(node: any): any {
  if (!node || typeof node !== 'object') return node;

  const nodeTypes = ['organism', 'molecule', 'atom'];
  
  // Lista de componentes Shadcn (para capitalización automática)
  const shadcnComponents = [
    'Button', 'Badge', 'Avatar', 'Input', 'Textarea', 'Label',
    'Checkbox', 'Switch', 'Select', 'Slider', 'Progress', 'Separator',
    'Skeleton', 'Tooltip', 'Card', 'CardHeader', 'CardContent',
    'CardFooter', 'CardTitle', 'CardDescription',
  ];

  // Si el objeto tiene un type de componente, inyectar nodeType
  if (node.type && nodeTypes.includes(node.type)) {
    node.nodeType = node.type;
  }

  // Si es un átomo, normalizar el nombre del componente (ej: button -> Button)
  if (node.nodeType === 'atom' && node.component) {
    const compLower = node.component.toLowerCase();
    const match = shadcnComponents.find(c => c.toLowerCase() === compLower);
    if (match) {
      node.component = match;
    }
  }

  // Recorrer hijos recursivamente
  if (Array.isArray(node.children)) {
    node.children = node.children.map(normalizeNodeTypes);
  }

  // Recorrer secciones si es un template
  if (Array.isArray(node.sections)) {
    node.sections = node.sections.map(normalizeNodeTypes);
  }

  return node;
}

/**
 * Obtiene la configuración del website (lista de páginas + tokens + fuentes).
 * Mismo endpoint en dev y prod; sólo cambia el host y el flag preview.
 */
async function getWebsiteConfig(domain: string) {
  const url = `${rendererApiRoot()}/websites/${domain}/config${PREVIEW ? '?preview=true' : ''}`;
  try {
    const response = await fetch(url, rendererFetchInit());
    if (!response.ok) {
      console.error(`Error fetching website config (${response.status}): ${url}`);
      return null;
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching website config from ${url}:`, error);
    return null;
  }
}

/**
 * Obtiene el Page JSON de una página específica por slug.
 * Mismo endpoint en dev y prod; sólo cambia el host y el flag preview.
 */
async function getPageData(domain: string, pageSlug: string) {
  const url = `${rendererApiRoot()}/websites/${domain}/pages/${pageSlug}${PREVIEW ? '?preview=true' : ''}`;
  try {
    const response = await fetch(url, rendererFetchInit());
    if (!response.ok) {
      console.error(`Error fetching page (${response.status}): ${url}`);
      return null;
    }
    const pageJson = await response.json();
    // El page_json puede venir con `type` en vez de `nodeType` y componentes en
    // minúscula; normalizamos antes de pasarlo al PageRenderer de la librería.
    return normalizeNodeTypes(pageJson);
  } catch (error) {
    console.error(`Error fetching page data from ${url}:`, error);
    return null;
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { domain, slug } = await params;
  const pageSlug = !slug || slug.length === 0 ? 'home' : slug.join('/');
  const pageData = await getPageData(domain, pageSlug);

  if (!pageData) return {};
  return {
    title: pageData.title || pageData.name || 'Untitled Page',
  };
}


/**
 * Página principal que renderiza cualquier ruta
 */
export default async function Page({ params }: PageProps) {
  const { domain, slug } = await params;
  console.log(`[render] domain="${domain}" slug=${JSON.stringify(slug ?? null)}`);

  // 1. Obtener configuración del website
  const websiteConfig = await getWebsiteConfig(domain);

  if (!websiteConfig) {
    console.error(`[render] notFound: sin config para domain="${domain}"`);
    return notFound();
  }

  // 2. Construir slug de página
  // slug puede ser: undefined (raíz), ['about'], ['products', 'laptop'], etc
  const pageSlug = !slug || slug.length === 0 ? 'home' : slug.join('/');

  // 3. Obtener datos de la página SIN chequear exists en websiteConfig as eso puede fallar si builder es desync
  const pageData = await getPageData(domain, pageSlug);

  if (!pageData) {
    console.error(`[render] notFound: sin página domain="${domain}" slug="${pageSlug}"`);
    return notFound();
  }

  // 4. Build Google Fonts URL from website config
  const fonts = websiteConfig.config?.fonts || { heading: 'Inter', body: 'Inter' };
  const uniqueFamilies = Array.from(new Set([fonts.heading, fonts.body].filter(Boolean)));
  const familyParams = uniqueFamilies
    .map((f: string) => `family=${f.replace(/\s+/g, '+')}:wght@400;500;600;700`)
    .join('&');
  const googleFontsUrl = `https://fonts.googleapis.com/css2?${familyParams}&display=swap`;

  // 5. Cargar template si es necesario
  const fullPageData = loadTemplate(pageData);

  // 5b. Preset HSL canónico del sitio (ThemePreset). Si la página no trae tokens
  // propios, cae al preset del sitio (o a brand_tokens legacy).
  const themePreset = websiteConfig.theme_preset;
  if (fullPageData && !fullPageData.tokens) {
    fullPageData.tokens = themePreset || websiteConfig.brand_tokens;
  }

  // 6. Renderizar la página con el preset aplicado en el root (SSR-safe, sin FOUC):
  //    <ThemeProvider scope="root"> emite las CSS vars en un <style>:root</style>
  //    server-rendered, de modo que <body> y los portales de Radix heredan el
  //    tema. PageRenderer además reaplica page.tokens en su subárbol.
  return (
    <>
      <link href={googleFontsUrl} rel="stylesheet" />
      <ThemeProvider tokens={themePreset ?? fullPageData?.tokens} scope="root">
        <div className="bg-background text-foreground min-h-screen antialiased">
          <PageRenderer page={fullPageData} />
        </div>
      </ThemeProvider>
    </>
  );
}

/**
 * Generar parámetros estáticos para ISR (Incremental Static Regeneration)
 * Esto pre-renderiza páginas conocidas
 */
export async function generateStaticParams() {
  // Páginas generadas on-demand: ya no dependemos de Mongo aquí. El microservicio
  // (Postgres) es la única fuente de verdad y se resuelve por dominio en runtime.
  return [];
}
