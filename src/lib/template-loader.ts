/**
 * Template loader - convierte páginas con metadata.useTemplate
 * en objetos Page completos con toda la estructura
 */

// Import templates directly from local copy
import {
  homePage,
  catalogPage,
  productDetailPage,
  checkoutPage,
  loginPage,
  orderConfirmationPage,
  accountDashboardPage
} from '../templates/ecommerce.template';

console.log('📚 Template imports verification:');
console.log('  homePage:', !!homePage, '- has template:', !!homePage?.template);
console.log('  catalogPage:', !!catalogPage, '- has template:', !!catalogPage?.template);
console.log('  productDetailPage:', !!productDetailPage, '- has template:', !!productDetailPage?.template);
console.log('  checkoutPage:', !!checkoutPage, '- has template:', !!checkoutPage?.template);
console.log('  loginPage:', !!loginPage, '- has template:', !!loginPage?.template);

// Debug: log the actual objects
if (homePage) {
  console.log('📦 homePage object keys:', Object.keys(homePage));
  console.log('📦 homePage.template keys:', homePage.template ? Object.keys(homePage.template) : 'undefined');
}

const TEMPLATES: Record<string, any> = {
  'ecommerce-home': homePage,
  'ecommerce-catalog': catalogPage,
  'ecommerce-product': productDetailPage,
  'ecommerce-checkout': checkoutPage,
  'ecommerce-login': loginPage,
  'ecommerce-confirmation': orderConfirmationPage,
  'ecommerce-dashboard': accountDashboardPage,
};

console.log('📦 TEMPLATES object:', Object.keys(TEMPLATES));
console.log('📦 ecommerce-home has template:', !!TEMPLATES['ecommerce-home']?.template);

export function loadTemplate(pageData: any) {
  console.log('🔍 loadTemplate called with:', {
    hasTemplate: !!pageData.template,
    hasSections: !!pageData.template?.sections,
    metadata: pageData.metadata,
    id: pageData.id
  });

  // Si la página ya tiene template completo, devolverla tal cual
  if (pageData.template?.sections?.length > 0) {
    console.log('✅ Page already has template.sections, returning as-is');
    return pageData;
  }

  // Si tiene metadata.useTemplate, cargar el template correspondiente
  const templateName = pageData.metadata?.useTemplate;
  console.log('🎨 Looking for template:', templateName);

  if (templateName && TEMPLATES[templateName]) {
    const template = TEMPLATES[templateName];
    console.log('✅ Found template, merging...');
    console.log('📦 Template structure:', {
      hasTemplate: !!template.template,
      hasSections: !!template.template?.sections,
      templateKeys: Object.keys(template),
      sectionsLength: template.template?.sections?.length
    });

    // Merge del template con los datos de la página
    const merged = {
      ...template,
      id: pageData.id,
      label: pageData.name || template.label,
      slug: pageData.slug || template.slug,
      seo: pageData.metadata?.seo || template.seo,
    };

    console.log('✅ Merged page has template:', !!merged.template);
    console.log('📦 Merged keys:', Object.keys(merged));
    return merged;
  }

  // Fallback: devolver la página original
  console.warn('⚠️ No template found, returning original page data');
  return pageData;
}
