import { homePage, catalogPage, productDetailPage, checkoutPage } from '@sinceglobal/website-builder-base';

console.log('=== IMPORT TEST ===');
console.log('homePage:', homePage);
console.log('homePage keys:', Object.keys(homePage || {}));
console.log('homePage.template:', homePage?.template);
console.log('homePage.template?.sections:', homePage?.template?.sections);
console.log('\ncatalogPage:', catalogPage);
console.log('catalogPage keys:', Object.keys(catalogPage || {}));
