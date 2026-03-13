import mongoose from 'mongoose';
import { PageModel } from '../src/models/Page';
import { connectToDatabase } from '../src/lib/mongoose';
import * as templates from '@sinceglobal/website-builder-base';

async function seed() {
    console.log('Connecting to DB...');
    await connectToDatabase();
    console.log('DB Connected.');

    console.log('Loading pages from templates...');
    // We access templates directly from the exported objects
    const pages = [
        templates.homePage,
        templates.catalogPage,
        templates.productDetailPage,
        templates.checkoutPage,
        templates.orderConfirmationPage,
        templates.accountDashboardPage,
        templates.orderHistoryPage,
        templates.loginPage,
        templates.searchResultsPage,
        templates.notFoundPage,
    ].filter(Boolean);

    console.log(`Loaded ${pages.length} pages.`);

    const websiteData = {
        websites: [
            {
                domain: 'localhost',
                pages: pages.map(p => ({ ...p, slug: p.slug === '/' ? 'home' : p.slug.replace(/^\//, '') })),
                config: {
                    fonts: { heading: 'Inter', body: 'Inter' }
                }
            }
        ],
        raw_state: {
            pages: pages.map(p => ({ ...p, slug: p.slug === '/' ? 'home' : p.slug.replace(/^\//, '') }))
        }
    };

    console.log('Seeding data to MongoDB...');
    // Clear existing
    await PageModel.deleteMany({});
    // Insert new
    await PageModel.create(websiteData);

    console.log('Seeding complete!');
    process.exit(0);
}

seed().catch(err => {
    console.error('Seed failed:', err);
    process.exit(1);
});
