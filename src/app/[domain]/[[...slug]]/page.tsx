import { notFound } from 'next/navigation';
import { PageRenderer } from '@sinceglobal/website-builder-base';
import { connectToDatabase } from '@/lib/mongoose';
import { PageModel } from '@/models/Page';
import { loadTemplate } from '@/lib/template-loader';

const isDevelopment = process.env.NODE_ENV === 'development';
const BUILDER_DUMP_URL = process.env.NEXT_PUBLIC_BUILDER_DUMP_URL || 'http://localhost:3000/api/builder/dump';

interface PageProps {
  params: Promise<{
    domain: string;
    slug?: string[];
  }>;
}

/**
 * Obtiene la configuración del website (lista de páginas permitidas, tema, etc)
 */
async function getWebsiteConfig(domain: string) {
  try {
    if (isDevelopment) {
      // En desarrollo: obtener de la bd
      // Always fetch the first available config in DB to force rendering
      const document = await PageModel.findOne({}).lean();

      if (!document) {
        console.warn(`No DB document found for rendering`);
        return null;
      }

      const data: any = document;

      // Forzamos que sea el primer website encontrado sin importar el dominio
      const website = data.websites?.[0];

      if (!website) {
        console.warn(`Website not found for domain: ${domain}`);
        return null;
      }

      return website;
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
      // En desarrollo: obtener de la db
      await connectToDatabase();
      // Force fetching whatever document is in DB
      const data: any = await PageModel.findOne({}).lean();

      if (!data) return null;

      // Forzamos el primer website de la lista
      const website = data.websites?.[0];

      if (!website) return null;

      // Usar raw_state directament para evitar errores si la data no esta mapeada correctamente
      const rawWebsites = data.raw_state;
      if (rawWebsites && Array.isArray(rawWebsites.pages)) {
        return rawWebsites.pages.find((p: any) => {
          // Normalizar slugs para comparación
          const normalizedPageSlug = p.slug?.startsWith('/') ? p.slug.slice(1) : p.slug;
          const normalizedSearchSlug = pageSlug === 'home' ? '' : pageSlug;

          return normalizedPageSlug === normalizedSearchSlug ||
                 p.slug === `/${pageSlug}` ||
                 (p.slug === '/' && pageSlug === 'home') ||
                 p.id === `page_${pageSlug}`;
        });
      }

      // Fallback a mapped pages si por algun motivo raw no esta
      const page = website.pages?.find((p: any) => p.slug === pageSlug);

      if (!page) return null;

      return page;
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

  // 6. Renderizar página
  return (
    <>
      <link href={googleFontsUrl} rel="stylesheet" />
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
