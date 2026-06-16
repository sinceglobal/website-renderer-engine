/**
 * update-local-website.ts
 * ──────────────────────────────────────────────────────────────────────────────
 * Actualiza el website en localhost leyendo directamente los templates del
 * website-builder-base y publicándolos en:
 *   1. MongoDB  → base de datos del renderer-engine (lo que ves en el sitio)
 *   2. PostgreSQL → base de datos del microservicio   (lo que ves en el builder)
 *
 * USO:
 *   bun run scripts/update-local-website.ts [template] [--site-id <id>] [--domain <domain>]
 *
 * TEMPLATES disponibles:
 *   elearning  → E-Learning Platform (EduHub)  [por defecto]
 *   ecommerce  → E-Commerce store
 *   landing    → Landing page
 *
 * EJEMPLOS:
 *   bun run scripts/update-local-website.ts
 *   bun run scripts/update-local-website.ts elearning
 *   bun run scripts/update-local-website.ts ecommerce --domain mystore.localhost
 *   bun run scripts/update-local-website.ts elearning --site-id 94461eab-2969-4328-b898-eb79a4d6d7ed
 *
 * FLAGS:
 *   --site-id <id>     Site ID en PostgreSQL (microservicio). Si no existe, crea uno nuevo.
 *   --domain <domain>  Dominio para MongoDB. Default: "localhost"
 *   --only-mongo       Solo actualiza MongoDB (renderer)
 *   --only-pg          Solo actualiza PostgreSQL (microservicio)
 *   --dry-run          Muestra lo que haría sin hacer nada
 * ──────────────────────────────────────────────────────────────────────────────
 */

import mongoose from 'mongoose';
import { PageModel } from '../src/models/Page';
import { connectToDatabase } from '../src/lib/mongoose';

// ── CONFIG ────────────────────────────────────────────────────────────────────

const MICROSERVICE_URL = process.env.NEXT_PUBLIC_MICROSERVICE_URL || 'http://localhost:8000/api/v1';
const DEFAULT_SITE_ID  = process.env.NEXT_PUBLIC_DEV_SITE_ID || '';

// ── CLI ARGS ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

function getFlag(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 ? args[idx + 1] : undefined;
}

function hasFlag(flag: string): boolean {
  return args.includes(flag);
}

const templateArg  = args.find(a => !a.startsWith('--')) ?? 'elearning';
const siteId       = getFlag('--site-id') || DEFAULT_SITE_ID;
const domain       = getFlag('--domain') || 'localhost';
const onlyMongo    = hasFlag('--only-mongo');
const onlyPg       = hasFlag('--only-pg');
const isDryRun     = hasFlag('--dry-run');

// ── COLORES PARA LA CONSOLA ───────────────────────────────────────────────────

const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  blue:   '\x1b[34m',
  cyan:   '\x1b[36m',
  red:    '\x1b[31m',
  gray:   '\x1b[90m',
  dim:    '\x1b[2m',
};

const log = {
  info:    (msg: string) => console.log(`${C.blue}ℹ${C.reset}  ${msg}`),
  success: (msg: string) => console.log(`${C.green}✓${C.reset}  ${msg}`),
  warn:    (msg: string) => console.log(`${C.yellow}⚠${C.reset}  ${msg}`),
  error:   (msg: string) => console.log(`${C.red}✗${C.reset}  ${msg}`),
  step:    (msg: string) => console.log(`\n${C.bold}${C.cyan}▶ ${msg}${C.reset}`),
  dry:     (msg: string) => console.log(`${C.dim}[DRY RUN]${C.reset} ${msg}`),
  section: (msg: string) => console.log(`\n${C.bold}${'─'.repeat(60)}${C.reset}\n${C.bold}  ${msg}${C.reset}\n${'─'.repeat(60)}`),
};

// ── LOAD TEMPLATES ────────────────────────────────────────────────────────────

async function loadPages(template: string): Promise<any[]> {
  log.step(`Cargando template: ${C.bold}${template}${C.reset}`);

  // Importación dinámica para soportar todos los templates
  const base = await import('@sinceglobal/website-builder-base');

  let pages: any[] = [];

  switch (template.toLowerCase()) {
    case 'elearning': {
      const {
        homePageElearning,
        coursesCatalogPage,
        courseDetailPage,
        loginPageElearning,
        signupPageElearning,
        checkoutPageElearning,
        orderConfirmationPageElearning,
        subscriptionPlansPage,
        studentDashboardPage,
        myCoursesPage,
        coursePlayerPage,
        studentProfilePage,
        certificatesPage,
        purchaseHistoryPage,
        subscriptionManagementPage,
      } = base;

      pages = [
        homePageElearning,
        coursesCatalogPage,
        courseDetailPage,
        loginPageElearning,
        signupPageElearning,
        checkoutPageElearning,
        orderConfirmationPageElearning,
        subscriptionPlansPage,
        studentDashboardPage,
        myCoursesPage,
        coursePlayerPage,
        studentProfilePage,
        certificatesPage,
        purchaseHistoryPage,
        subscriptionManagementPage,
      ].filter(Boolean);
      break;
    }

    case 'ecommerce': {
      const {
        homePage,
        catalogPage,
        productDetailPage,
        checkoutPage,
        orderConfirmationPage,
        accountDashboardPage,
        orderHistoryPage,
        loginPage,
        searchResultsPage,
        notFoundPage,
      } = base;

      pages = [
        homePage,
        catalogPage,
        productDetailPage,
        checkoutPage,
        orderConfirmationPage,
        accountDashboardPage,
        orderHistoryPage,
        loginPage,
        searchResultsPage,
        notFoundPage,
      ].filter(Boolean);
      break;
    }

    case 'landing': {
      const { landingPageTemplate } = base;
      pages = [landingPageTemplate].filter(Boolean);
      break;
    }

    default:
      log.error(`Template desconocido: "${template}". Usa: elearning | ecommerce | landing`);
      process.exit(1);
  }

  log.success(`${pages.length} páginas cargadas desde el template "${template}"`);
  pages.forEach(p => log.info(`  ${C.gray}slug: ${p?.slug ?? '?'} — ${p?.label ?? 'sin label'}${C.reset}`));
  return pages;
}

// ── NORMALIZAR SLUG ───────────────────────────────────────────────────────────

function normalizeSlug(slug: string): string {
  return slug === '/' ? 'home' : slug.replace(/^\//, '');
}

// ── MONGODB (RENDERER) ────────────────────────────────────────────────────────

async function updateMongoDB(pages: any[], domainName: string) {
  log.section('🍃 MongoDB → Renderer Engine');

  if (isDryRun) {
    log.dry(`Conectaría a MongoDB`);
    log.dry(`Borraría documentos con domain="${domainName}" y reinsertaría ${pages.length} páginas`);
    return;
  }

  log.info('Conectando a MongoDB...');
  await connectToDatabase();
  log.success('Conectado a MongoDB');

  const normalizedPages = pages.map(p => ({
    ...p,
    slug: normalizeSlug(p.slug ?? '/'),
  }));

  const websiteData = {
    websites: [
      {
        domain: domainName,
        pages: normalizedPages,
        config: {
          template,
          fonts: {
            heading: pages[0]?.tokens?.font?.display ?? 'Inter',
            body: pages[0]?.tokens?.font?.body ?? 'Inter',
          },
          updatedAt: new Date().toISOString(),
        },
      },
    ],
    raw_state: {
      pages: normalizedPages,
      template,
      updatedAt: new Date().toISOString(),
    },
  };

  // Eliminar datos del dominio anterior y reemplazar
  const deleted = await PageModel.deleteMany({ 'websites.domain': domainName });
  log.info(`Eliminados ${deleted.deletedCount} documento(s) existentes para domain="${domainName}"`);

  await PageModel.create(websiteData);
  log.success(`✅ MongoDB actualizado: ${pages.length} páginas para domain="${domainName}"`);

  await mongoose.disconnect();
  log.info('Desconectado de MongoDB');
}

// ── POSTGRESQL (MICROSERVICIO) ────────────────────────────────────────────────

async function updatePostgres(pages: any[], targetSiteId: string) {
  log.section('🐘 PostgreSQL → Website Builder Microservice');

  if (!targetSiteId) {
    log.warn('No se proporcionó --site-id. Se creará un nuevo site en el microservicio.');
  }

  // 1. Intentar obtener el site existente o crear uno nuevo
  let resolvedSiteId = targetSiteId;

  if (isDryRun) {
    log.dry(`PATCH ${MICROSERVICE_URL}/sites/${targetSiteId || '<nuevo>'}/pages/<page_id>`);
    log.dry(`Se actualizarían ${pages.length} páginas`);
    return;
  }

  if (!resolvedSiteId) {
    // Crear un site nuevo
    log.info('Creando nuevo site en el microservicio...');
    const createRes = await fetch(`${MICROSERVICE_URL}/sites/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        company_name: `Local Dev - ${templateArg}`,
        business_type: templateArg,
        description: `Sitio de desarrollo local. Template: ${templateArg}`,
        pages: pages.map(p => ({
          slug: p.slug,
          label: p.label,
          template_hint: p.template?.layout ?? 'landing',
        })),
      }),
    });

    if (!createRes.ok) {
      const txt = await createRes.text();
      log.warn(`No se pudo crear el site automáticamente (${createRes.status}): ${txt}`);
      log.warn('Intenta crear el site manualmente en el builder y pasa --site-id <id>');
      return;
    }

    const created = await createRes.json() as any;
    resolvedSiteId = created.site_id;
    log.success(`Site creado con ID: ${C.bold}${resolvedSiteId}${C.reset}`);
  } else {
    // Verificar que existe
    log.info(`Verificando site ${resolvedSiteId}...`);
    const checkRes = await fetch(`${MICROSERVICE_URL}/sites/${resolvedSiteId}/status`);
    if (!checkRes.ok) {
      log.error(`Site "${resolvedSiteId}" no encontrado (${checkRes.status}).`);
      log.error('Verifica el ID o crea el site desde el builder primero.');
      return;
    }
    const status = await checkRes.json() as any;
    log.success(`Site encontrado: status="${status.status}"`);
  }

  // 2. Obtener las páginas existentes del site
  log.info(`Obteniendo páginas del site ${resolvedSiteId}...`);
  const pagesRes = await fetch(`${MICROSERVICE_URL}/sites/${resolvedSiteId}/pages`);

  if (!pagesRes.ok) {
    log.warn(`No se pudieron obtener las páginas existentes (${pagesRes.status})`);
    log.warn('Intentando con el bundle completo del site...');
    await updateSiteBundle(resolvedSiteId, pages);
    return;
  }

  const existingPages = await pagesRes.json() as any[];
  log.info(`Páginas existentes en PG: ${existingPages.length}`);

  // 3. Mapear cada page del template con la page existente por slug
  let updated = 0;
  let skipped = 0;

  for (const templatePage of pages) {
    const slug = templatePage.slug ?? '/';
    const existing = existingPages.find(ep => ep.slug === slug || ep.slug === normalizeSlug(slug));

    if (!existing) {
      log.info(`  + Creando página inexistente "${slug}"...`);
      const createRes = await fetch(`${MICROSERVICE_URL}/sites/${resolvedSiteId}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...templatePage,
          site_id: resolvedSiteId,
          status: 'draft'
        }),
      });

      if (createRes.ok) {
        log.success(`  ✓ "${slug}" creada exitosamente`);
        updated++;
      } else {
        const errTxt = await createRes.text();
        log.error(`  ✗ Error creando "${slug}": ${createRes.status} - ${errTxt}`);
      }
      continue;
    }

    log.info(`  ↑ Actualizando "${slug}" (id: ${existing.id})...`);

    const patchRes = await fetch(`${MICROSERVICE_URL}/sites/${resolvedSiteId}/pages/${existing.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(templatePage),
    });

    if (patchRes.ok) {
      log.success(`  ✓ "${slug}" actualizada`);
      updated++;
    } else {
      const errTxt = await patchRes.text();
      log.error(`  ✗ Error actualizando "${slug}": ${patchRes.status} - ${errTxt}`);
    }
  }

  log.success(`\nPostgreSQL: ${updated} actualizada(s), ${skipped} saltada(s)`);

  if (skipped > 0) {
    log.warn(`Tip: Las páginas saltadas necesitan existir en el microservicio.`);
    log.warn(`     Ve al builder UI, genera el site y vuelve a ejecutar el script con --site-id ${resolvedSiteId}`);
  }
}

/** Fallback: si el site no tiene páginas individuales, actualiza el bundle completo */
async function updateSiteBundle(resolvedSiteId: string, pages: any[]) {
  log.info('Intentando actualizar mediante el bundle del site...');
  const res = await fetch(`${MICROSERVICE_URL}/sites/${resolvedSiteId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pages }),
  });

  if (res.ok) {
    log.success('Site bundle actualizado en PostgreSQL');
  } else {
    log.error(`No se pudo actualizar el bundle: ${res.status}`);
    log.error('El microservicio puede no tener un endpoint PATCH /sites/:id — revisa la API.');
  }
}

// ── MAIN ──────────────────────────────────────────────────────────────────────

const template = templateArg;

async function main() {
  console.log(`
${C.bold}${C.cyan}╔══════════════════════════════════════════════════════════╗
║       🚀  Website Local Updater                          ║
║          website-builder-base → DB                       ║
╚══════════════════════════════════════════════════════════╝${C.reset}

  Template : ${C.bold}${template}${C.reset}
  Domain   : ${C.bold}${domain}${C.reset}
  Site ID  : ${C.bold}${siteId || '(auto)'}${C.reset}
  Targets  : ${!onlyPg ? `${C.green}MongoDB${C.reset}` : `${C.gray}MongoDB${C.reset}`} + ${!onlyMongo ? `${C.green}PostgreSQL${C.reset}` : `${C.gray}PostgreSQL${C.reset}`}
  Dry run  : ${isDryRun ? `${C.yellow}SÍ${C.reset}` : `${C.gray}no${C.reset}`}
`);

  try {
    // 1. Cargar pages del template
    const pages = await loadPages(template);

    if (pages.length === 0) {
      log.error('No se encontraron páginas en el template. Verifica los exports.');
      process.exit(1);
    }

    // 2. Actualizar MongoDB (renderer)
    if (!onlyPg) {
      await updateMongoDB(pages, domain);
    }

    // 3. Actualizar PostgreSQL (microservicio)
    if (!onlyMongo) {
      await updatePostgres(pages, siteId);
    }

    // 4. Resumen final
    console.log(`\n${C.bold}${C.green}${'═'.repeat(60)}${C.reset}`);
    log.success(`${C.bold}¡Listo! El website ha sido actualizado.${C.reset}`);
    console.log(`${C.bold}${C.green}${'═'.repeat(60)}${C.reset}`);

    if (!onlyPg) {
      console.log(`\n  ${C.cyan}Renderer:${C.reset}    http://localhost:${process.env.PORT ?? 3000}`);
      console.log(`  ${C.gray}(asegúrate de que website-renderer-engine está corriendo)${C.reset}`);
    }
    if (!onlyMongo) {
      console.log(`  ${C.cyan}Microservicio:${C.reset} ${MICROSERVICE_URL.replace('/api/v1','')}/docs`);
      console.log(`  ${C.gray}(asegúrate de que website-builder-microservice está corriendo)${C.reset}`);
    }
    console.log();

  } catch (err: any) {
    log.error(`Error inesperado: ${err.message}`);
    console.error(err);
    process.exit(1);
  }
}

main();
