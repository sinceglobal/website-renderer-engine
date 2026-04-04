import { notFound } from 'next/navigation';
import { PageRenderer } from '@sinceglobal/website-builder-base';
import { connectToDatabase } from '@/lib/mongoose';
import { PageModel } from '@/models/Page';
import { loadTemplate } from '@/lib/template-loader';
import { DesignSystemInjector } from '@/components/DesignSystemInjector';

const isDevelopment = process.env.NODE_ENV === 'development';
const MICROSERVICE_URL = process.env.NEXT_PUBLIC_MICROSERVICE_URL || 'http://localhost:8000/api/v1';
const DEV_SITE_ID = process.env.NEXT_PUBLIC_DEV_SITE_ID;

interface PageProps {
  params: Promise<{
    domain: string;
    slug?: string[];
  }>;
}

let lastFoundSiteId: string | null = DEV_SITE_ID || null;

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
 * Obtiene la configuración del website (lista de páginas permitidas, tema, etc)
 */
async function getWebsiteConfig(domain: string) {
  try {
    if (isDevelopment) {
      // En desarrollo: Usar el ID forzado o el más reciente
      const siteIdToFetch = DEV_SITE_ID || (await (async () => {
        const list = await fetch(`${MICROSERVICE_URL}/sites?limit=1`, { cache: 'no-store' }).then(r => r.json());
        return list?.[0]?.site_id;
      })());

      if (!siteIdToFetch) {
        console.warn('No DEV_SITE_ID provided and no sites found in local microservice');
        return null;
      }
      
      lastFoundSiteId = siteIdToFetch;
      
      // Obtenemos el bundle completo del microservicio (POSTGRES)
      const fullResponse = await fetch(`${MICROSERVICE_URL}/sites/${siteIdToFetch}`, { cache: 'no-store' });
      if (!fullResponse.ok) return null;
      
      const fullSite = await fullResponse.json();
      
      // Normalización agresiva para el PageRenderer de la librería base
      const normalizedPages = (fullSite.pages || []).map((p: any) => {
        const sections = (p.sections || p.template?.sections || []).map(normalizeNodeTypes);
        const template = p.template || {};
        
        return {
          ...p,
          tokens: p.tokens || fullSite.brand_tokens,
          template: {
            ...template,
            sections: sections,
            navbar: template.navbar || p.navbar,
            footer: template.footer || p.footer
          }
        };
      });

      return {
        ...fullSite,
        pages: normalizedPages,
        tokens: fullSite.brand_tokens,
      };
    } else {
      // En producción: obtener de la API backend
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/websites/${domain}/config`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
          },
          next: { revalidate: 3600 }, // ISR: revalidar cada hora
        }
      );

      if (!response.ok) {
        console.error(`Error fetching website config: ${response.status}`);
        return null;
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching website config:', error);
    return null;
  }
}

/**
 * Obtiene los datos de una página específica
 */
async function getPageData(
  domain: string,
  pageSlug: string
) {
  try {
    if (isDevelopment) {
      // Usamos el site_id cacheado o listamos de nuevo
      const siteId = lastFoundSiteId || (await (async () => {
        const list = await fetch(`${MICROSERVICE_URL}/sites?limit=1`, { cache: 'no-store' }).then(r => r.json());
        return list?.[0]?.site_id;
      })());

      if (!siteId) return null;

      const response = await fetch(`${MICROSERVICE_URL}/sites/${siteId}`, { cache: 'no-store' });
      if (!response.ok) return null;
      
      const siteData = await response.json();
      const pages = siteData.pages || [];

      // Buscamos la página por slug (normalizando el slug del microservicio)
      const page = pages.find((p: any) => {
        const normalizedPageSlug = p.slug?.startsWith('/') ? p.slug.slice(1) : (p.slug || '');
        const normalizedSearchSlug = pageSlug === 'home' ? '' : pageSlug;
        return normalizedPageSlug === normalizedSearchSlug || p.slug === pageSlug;
      });

      if (!page) return null;

      const sections = (page.sections || page.template?.sections || []).map(normalizeNodeTypes);
      const template = page.template || {};

      // NORMALIZACIÓN CRÍTICA: Re-construir el objeto template para el PageRenderer
      return {
        ...page,
        tokens: page.tokens || siteData.brand_tokens,
        template: {
          ...template,
          sections: sections,
          navbar: template.navbar || page.navbar,
          footer: template.footer || page.footer
        }
      };
    } else {
      // En producción: obtener de la API backend
      const response = await fetch(
        `${process.env.BACKEND_URL}/api/websites/${domain}/pages/${pageSlug}`,
        {
          headers: {
            'Authorization': `Bearer ${process.env.BACKEND_API_KEY}`,
          },
          next: { revalidate: 3600 },
        }
      );

      if (!response.ok) {
        console.error(`Error fetching page: ${response.status}`);
        return null;
      }

      return await response.json();
    }
  } catch (error) {
    console.error('Error fetching page data:', error);
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

  // 1. Obtener configuración del website
  const websiteConfig = await getWebsiteConfig(domain);

  if (!websiteConfig) {
    return notFound();
  }

  // 2. Construir slug de página
  // slug puede ser: undefined (raíz), ['about'], ['products', 'laptop'], etc
  const pageSlug = !slug || slug.length === 0 ? 'home' : slug.join('/');

  // 3. Obtener datos de la página SIN chequear exists en websiteConfig as eso puede fallar si builder es desync
  const pageData = await getPageData(domain, pageSlug);

  if (!pageData) {
    return notFound();
  }

  // 4. Build Google Fonts URL from website config
  const fonts = websiteConfig.config?.fonts || { heading: 'Inter', body: 'Inter' };
  const uniqueFamilies = Array.from(new Set([fonts.heading, fonts.body].filter(Boolean)));
  const familyParams = uniqueFamilies
    .map((f: string) => `family=${f.replace(/\s+/g, '+')}:wght@400;500;600;700`)
    .join('&');
  const googleFontsUrl = `https://fonts.googleapis.com/css2?${familyParams}&display=swap`;
  const fontFamily = `'${fonts.body || 'Inter'}', sans-serif`;

  // 5. Cargar template si es necesario
  const fullPageData = loadTemplate(pageData);

  // 6. Extract design system data for Material Design 3
  const designTokens = websiteConfig.design_tokens;
  const cssVariables = websiteConfig.css_variables;
  const tailwindConfig = websiteConfig.tailwind_config;

  // 7. Renderizar página
  return (
    <>
      <link href={googleFontsUrl} rel="stylesheet" />
      <DesignSystemInjector
        cssVariables={cssVariables}
        designTokens={designTokens}
        tailwindConfig={tailwindConfig}
      />
      <div className="bg-[var(--background)] min-h-screen antialiased" style={{ fontFamily }}>
        <PageRenderer page={fullPageData} />
      </div>
    </>
  );
}

/**
 * Generar parámetros estáticos para ISR (Incremental Static Regeneration)
 * Esto pre-renderiza páginas conocidas
 */
export async function generateStaticParams() {
  try {
    if (isDevelopment) {
      // En desarrollo: obtener de mongodb
      await connectToDatabase();
      // Generamos params para cualquier website almacenado en dev mode
      const data: any = await PageModel.findOne({ "websites.domain": "localhost" }).lean();
      if (!data) return [];

      const params = [];

      for (const website of data.websites || []) {
        const domain = website.domain;

        for (const page of website.pages || []) {
          params.push({
            domain,
            slug: page.slug === 'home' || page.slug === '' ? [] : page.slug.split('/'),
          });
        }
      }

      return params;
    } else {
      // En producción: obtener del backend
      // Aquí podrías obtener una lista de todos los websites/páginas
      // Por ahora retornamos un array vacío y Next generará on-demand
      return [];
    }
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}
