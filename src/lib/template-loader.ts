import {
  homePage,
  catalogPage,
  productDetailPage,
  checkoutPage,
  loginPage,
  orderConfirmationPage,
  accountDashboardPage,
  // E-Learning Templates
  homePageElearning,
  coursesCatalogPage,
  courseDetailPage,
  checkoutPageElearning,
  orderConfirmationPageElearning,
  subscriptionPlansPage,
  loginPageElearning,
  signupPageElearning,
  studentDashboardPage,
  myCoursesPage,
  coursePlayerPage,
  studentProfilePage,
  purchaseHistoryPage,
  certificatesPage,
  subscriptionManagementPage,
} from '@sinceglobal/website-builder-base';

const TEMPLATES: Record<string, any> = {
  // E-Commerce
  'ecommerce-home': homePage,
  'ecommerce-catalog': catalogPage,
  'ecommerce-product': productDetailPage,
  'ecommerce-checkout': checkoutPage,
  'ecommerce-login': loginPage,
  'ecommerce-confirmation': orderConfirmationPage,
  'ecommerce-dashboard': accountDashboardPage,

  // E-Learning
  'elearning-home': homePageElearning,
  'elearning-courses-catalog': coursesCatalogPage,
  'elearning-course-detail': courseDetailPage,
  'elearning-checkout': checkoutPageElearning,
  'elearning-order-confirmation': orderConfirmationPageElearning,
  'elearning-confirmation': orderConfirmationPageElearning,
  'elearning-login': loginPageElearning,
  'elearning-signup': signupPageElearning,
  'elearning-subscription-plans': subscriptionPlansPage,
  'elearning-student-dashboard': studentDashboardPage,
  'elearning-my-courses': myCoursesPage,
  'elearning-course-player': coursePlayerPage,
  'elearning-student-profile': studentProfilePage,
  'elearning-purchase-history': purchaseHistoryPage,
  'elearning-certificates': certificatesPage,
  'elearning-subscription-management': subscriptionManagementPage,
};

export function loadTemplate(pageData: any) {
  // 1. Move root navbar/footer to template if they exist at root but not in template
  // This ensures compatibility with templates that define them at the root
  if (pageData.navbar && !pageData.template?.navbar) {
    pageData.template = { ...pageData.template, navbar: pageData.navbar };
  }
  if (pageData.footer && !pageData.template?.footer) {
    pageData.template = { ...pageData.template, footer: pageData.footer };
  }

  // 2. If the page already has content in template.sections, return as-is
  if (pageData.template?.sections?.length > 0) {
    return pageData;
  }

  // 3. If has metadata.useTemplate, load the corresponding template
  const templateName = pageData.metadata?.useTemplate;

  if (templateName && TEMPLATES[templateName]) {
    const template = TEMPLATES[templateName];

    // Merge template with page data
    const materialized = {
      ...template,
      id: pageData.id,
      label: pageData.name || template.label,
      slug: pageData.slug || template.slug,
      seo: pageData.metadata?.seo || template.seo,
    };

    // Ensure navbar/footer from root level of template are moved into template object if necessary
    if (materialized.navbar && !materialized.template?.navbar) {
        materialized.template = { ...materialized.template, navbar: materialized.navbar };
    }
    if (materialized.footer && !materialized.template?.footer) {
        materialized.template = { ...materialized.template, footer: materialized.footer };
    }

    return materialized;
  }

  // Fallback: return the page as-is
  return pageData;
}
