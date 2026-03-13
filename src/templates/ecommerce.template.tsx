import type { Page } from '@sinceglobal/website-builder-base';

/**
 * TEMPLATE: Digital Products E-commerce
 * Modelo: cursos, ebooks, templates — sin envío físico
 * Páginas: 10 completas en schema atómico
 *
 * Tokens compartidos — todas las páginas heredan esto.
 * En producción: extraer a una constante y referenciar por ID.
 */

const sharedTokens: Page['tokens'] = {
    name: 'Digital Store',
    mode: 'light',
    colors: {
        background: 'oklch(0.99 0 0)',
        foreground: 'oklch(0.09 0 0)',
        primary: 'oklch(0.55 0.20 264)',
        'primary-foreground': 'oklch(0.99 0 0)',
        secondary: 'oklch(0.94 0 0)',
        'secondary-foreground': 'oklch(0.09 0 0)',
        accent: 'oklch(0.60 0.18 25)',
        'accent-foreground': 'oklch(0.99 0 0)',
        muted: 'oklch(0.95 0 0)',
        'muted-foreground': 'oklch(0.48 0 0)',
        destructive: 'oklch(0.52 0.20 25)',
        'destructive-foreground': 'oklch(0.99 0 0)',
        border: 'oklch(0.88 0 0)',
        input: 'oklch(0.94 0 0)',
        ring: 'oklch(0.55 0.20 264)',
        card: 'oklch(0.99 0 0)',
        'card-foreground': 'oklch(0.09 0 0)',
        popover: 'oklch(0.99 0 0)',
        'popover-foreground': 'oklch(0.09 0 0)',
    },
    font: { display: 'Cal Sans', body: 'Geist', mono: 'Geist Mono' },
    radius: 'lg',
    spacing: '4',
    shadow: 'sm',
};

const sharedNavbar = {
    logo: { text: 'CreatorStore', href: '/' },
    items: [
        { label: 'Shop', href: '/shop' },
        { label: 'About', href: '/about' },
    ],
    cta: { label: 'Get started', href: '/shop', variant: 'default' as const },
    style: 'sticky' as const,
};

const sharedFooter = {
    logo: { text: 'CreatorStore' },
    columns: [
        {
            heading: 'Products',
            items: [
                { label: 'All products', href: '/shop' },
                { label: 'Courses', href: '/shop?type=course' },
                { label: 'Ebooks', href: '/shop?type=ebook' },
                { label: 'Templates', href: '/shop?type=template' },
            ],
        },
        {
            heading: 'Account',
            items: [
                { label: 'Dashboard', href: '/account/dashboard' },
                { label: 'My orders', href: '/account/orders' },
                { label: 'Login', href: '/login' },
            ],
        },
        {
            heading: 'Legal',
            items: [
                { label: 'Privacy', href: '/privacy' },
                { label: 'Terms', href: '/terms' },
                { label: 'Refund policy', href: '/refunds' },
            ],
        },
    ],
    social: [
        { platform: 'twitter' as const, href: 'https://twitter.com/creatorstore' },
        { platform: 'instagram' as const, href: 'https://instagram.com/creatorstore' },
    ],
    legalText: '© 2026 CreatorStore. All rights reserved.',
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 1: HOME  /
// ─────────────────────────────────────────────────────────────────────────────

export const homePage: Page = {
    id: 'page_home',
    label: 'Home',
    slug: '/',
    status: 'published',
    tokens: sharedTokens,
    seo: {
        title: 'CreatorStore — Digital products that level you up',
        description: 'Courses, ebooks and templates crafted by experts. Download instantly.',
        robots: 'index,follow',
    },
    template: {
        id: 'tmpl_home',
        label: 'Home',
        layout: 'landing',
        navbar: sharedNavbar,
        footer: sharedFooter,
        sections: [

            // HERO
            {
                id: 'org_home_hero',
                nodeType: 'organism',
                variant: 'hero',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '24' } },
                layout: { type: 'flex', direction: 'col', align: 'center', gap: '8' },
                background: { type: 'gradient', from: 'oklch(0.96 0.03 264)', to: 'oklch(0.99 0 0)', direction: '180deg' },
                motion: { preset: 'stagger-children' },
                children: [
                    {
                        id: 'mol_home_hero_badge',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'row', align: 'center', gap: '2' },
                        children: [
                            { id: 'atom_home_badge', nodeType: 'atom', component: 'Badge', props: { variant: 'secondary', children: '✦ 4,200+ students already inside' }, motion: { preset: 'fade-in', delay: 0 } },
                        ],
                    },
                    {
                        id: 'mol_home_hero_text',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'col', align: 'center', gap: '4' },
                        children: [
                            { id: 'atom_home_h1', nodeType: 'atom', component: 'h1', props: { children: 'Learn. Build.\nGrow faster.' }, style: { fontSize: '7xl', fontWeight: 'bold', className: 'text-center whitespace-pre-line leading-none' }, motion: { preset: 'fade-up', delay: 100 } },
                            { id: 'atom_home_p', nodeType: 'atom', component: 'p', props: { children: 'Premium courses, ebooks and templates built by practitioners. Instant download. Lifetime access.' }, style: { fontSize: 'xl', className: 'text-center max-w-2xl', color: 'oklch(0.48 0 0)' }, motion: { preset: 'fade-up', delay: 180 } },
                        ],
                    },
                    {
                        id: 'mol_home_cta',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'row', gap: '4', align: 'center' },
                        motion: { preset: 'fade-up', delay: 260 },
                        children: [
                            { id: 'atom_home_cta_primary', nodeType: 'atom', component: 'Button', props: { variant: 'default', size: 'lg', children: 'Browse products' } },
                            { id: 'atom_home_cta_ghost', nodeType: 'atom', component: 'Button', props: { variant: 'ghost', size: 'lg', children: 'See bestsellers →' } },
                        ],
                    },
                ],
            },

            // CATEGORIES
            {
                id: 'org_home_categories',
                nodeType: 'organism',
                variant: 'features',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '16' } },
                layout: { type: 'flex', direction: 'col', gap: '10' },
                children: [
                    {
                        id: 'mol_cat_header',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'row', justify: 'between', align: 'end' },
                        children: [
                            { id: 'atom_cat_h2', nodeType: 'atom', component: 'h2', props: { children: 'Shop by type' }, style: { fontSize: '3xl', fontWeight: 'bold' } },
                            { id: 'atom_cat_link', nodeType: 'atom', component: 'a', props: { href: '/shop', children: 'See all →' }, style: { fontSize: 'sm' } },
                        ],
                    },
                    {
                        id: 'mol_cat_grid',
                        nodeType: 'molecule',
                        layout: { type: 'grid', cols: { default: 1, md: 3 }, gap: '6' },
                        children: [
                            { id: 'atom_cat_courses', nodeType: 'atom', component: 'Card', props: { title: '🎓 Courses', description: 'In-depth video courses. Learn at your own pace with lifetime access.' }, motion: { preset: 'fade-up', delay: 0, trigger: 'viewport' } },
                            { id: 'atom_cat_ebooks', nodeType: 'atom', component: 'Card', props: { title: '📖 Ebooks', description: 'Actionable guides you can read anywhere. PDF + EPUB included.' }, motion: { preset: 'fade-up', delay: 80, trigger: 'viewport' } },
                            { id: 'atom_cat_templates', nodeType: 'atom', component: 'Card', props: { title: '⚡ Templates', description: 'Ready-to-use Figma, Notion and code templates. Ship faster.' }, motion: { preset: 'fade-up', delay: 160, trigger: 'viewport' } },
                        ],
                    },
                ],
            },

            // BESTSELLERS
            {
                id: 'org_home_bestsellers',
                nodeType: 'organism',
                variant: 'features',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '16' } },
                layout: { type: 'flex', direction: 'col', gap: '10' },
                background: { type: 'color', value: 'oklch(0.97 0 0)' },
                children: [
                    {
                        id: 'mol_best_header',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'row', justify: 'between', align: 'end' },
                        motion: { preset: 'fade-up', trigger: 'viewport' },
                        children: [
                            { id: 'atom_best_h2', nodeType: 'atom', component: 'h2', props: { children: 'Bestsellers' }, style: { fontSize: '3xl', fontWeight: 'bold' } },
                            { id: 'atom_best_link', nodeType: 'atom', component: 'a', props: { href: '/shop?sort=popular', children: 'View all →' }, style: { fontSize: 'sm' } },
                        ],
                    },
                    {
                        id: 'mol_best_grid',
                        nodeType: 'molecule',
                        layout: { type: 'grid', cols: { default: 1, sm: 2, lg: 4 }, gap: '6' },
                        children: [
                            { id: 'atom_prod_1', nodeType: 'atom', component: 'Card', props: { title: 'UI Design System Course', description: '$79 · 6h video · 1,200 students' }, motion: { preset: 'fade-up', delay: 0, trigger: 'viewport' } },
                            { id: 'atom_prod_2', nodeType: 'atom', component: 'Card', props: { title: 'The Freelancer Playbook', description: '$29 · Ebook · 230 pages' }, motion: { preset: 'fade-up', delay: 60, trigger: 'viewport' } },
                            { id: 'atom_prod_3', nodeType: 'atom', component: 'Card', props: { title: 'Next.js Starter Kit', description: '$49 · Template · 340 buyers' }, motion: { preset: 'fade-up', delay: 120, trigger: 'viewport' } },
                            { id: 'atom_prod_4', nodeType: 'atom', component: 'Card', props: { title: 'SEO Mastery 2026', description: '$59 · Course · Updated monthly' }, motion: { preset: 'fade-up', delay: 180, trigger: 'viewport' } },
                        ],
                    },
                ],
            },

            // SOCIAL PROOF
            {
                id: 'org_home_proof',
                nodeType: 'organism',
                variant: 'stats',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '16' } },
                layout: { type: 'grid', cols: { default: 2, md: 4 }, gap: '8' },
                children: [
                    { id: 'atom_stat_1', nodeType: 'atom', component: 'Card', props: { title: '4,200+', description: 'Happy customers' }, motion: { preset: 'fade-up', delay: 0, trigger: 'viewport' } },
                    { id: 'atom_stat_2', nodeType: 'atom', component: 'Card', props: { title: '98%', description: 'Satisfaction rate' }, motion: { preset: 'fade-up', delay: 60, trigger: 'viewport' } },
                    { id: 'atom_stat_3', nodeType: 'atom', component: 'Card', props: { title: '80+', description: 'Products available' }, motion: { preset: 'fade-up', delay: 120, trigger: 'viewport' } },
                    { id: 'atom_stat_4', nodeType: 'atom', component: 'Card', props: { title: 'Instant', description: 'Download delivery' }, motion: { preset: 'fade-up', delay: 180, trigger: 'viewport' } },
                ],
            },

            // CTA
            {
                id: 'org_home_cta',
                nodeType: 'organism',
                variant: 'cta',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '20' } },
                layout: { type: 'flex', direction: 'col', align: 'center', gap: '6' },
                background: { type: 'gradient', from: 'oklch(0.50 0.22 264)', to: 'oklch(0.38 0.18 280)', direction: '135deg' },
                motion: { preset: 'fade-up', trigger: 'viewport' },
                children: [
                    { id: 'atom_home_cta_h2', nodeType: 'atom', component: 'h2', props: { children: 'Start learning today' }, style: { fontSize: '4xl', fontWeight: 'bold', className: 'text-center text-white' } },
                    { id: 'atom_home_cta_p', nodeType: 'atom', component: 'p', props: { children: 'One-time payment. Instant access. No subscription.' }, style: { fontSize: 'lg', className: 'text-center text-white/80' } },
                    { id: 'atom_home_cta_btn', nodeType: 'atom', component: 'Button', props: { variant: 'secondary', size: 'lg', children: 'Browse all products →' } },
                ],
            },
        ],
    },
    variants: [
        {
            id: 'variant_home_returning',
            label: 'Returning customer',
            priority: 10,
            condition: { type: 'simple', field: 'segments', operator: 'contains', value: 'customer' },
            patches: [
                { nodeId: 'atom_home_h1', action: 'update-props', props: { children: 'Welcome back.\nKeep growing.' } },
                { nodeId: 'atom_home_cta_primary', action: 'update-props', props: { children: 'Go to my dashboard' } },
                { nodeId: 'atom_home_cta_primary', action: 'update-props', props: { href: '/account/dashboard' } },
            ],
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 2: CATALOG  /shop
// ─────────────────────────────────────────────────────────────────────────────

export const catalogPage: Page = {
    id: 'page_catalog',
    label: 'Shop — Catalog',
    slug: '/shop',
    status: 'published',
    tokens: sharedTokens,
    seo: { title: 'Shop — All Digital Products', description: 'Browse courses, ebooks and templates.', robots: 'index,follow' },
    template: {
        id: 'tmpl_catalog',
        label: 'Catalog',
        layout: 'landing',
        navbar: sharedNavbar,
        footer: sharedFooter,
        sections: [

            // HEADER
            {
                id: 'org_catalog_header',
                nodeType: 'organism',
                variant: 'hero',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '12' } },
                layout: { type: 'flex', direction: 'col', gap: '4' },
                children: [
                    { id: 'atom_catalog_h1', nodeType: 'atom', component: 'h1', props: { children: 'All products' }, style: { fontSize: '5xl', fontWeight: 'bold' }, motion: { preset: 'fade-up', trigger: 'mount' } },
                    { id: 'atom_catalog_p', nodeType: 'atom', component: 'p', props: { children: '80+ courses, ebooks and templates. Instant download, lifetime access.' }, style: { fontSize: 'lg', color: 'oklch(0.48 0 0)' }, motion: { preset: 'fade-up', delay: 80, trigger: 'mount' } },
                ],
            },

            // FILTERS + GRID
            {
                id: 'org_catalog_main',
                nodeType: 'organism',
                variant: 'features',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '8' } },
                layout: { type: 'flex', direction: 'col', gap: '8' },
                children: [
                    // Filter bar
                    {
                        id: 'mol_filters',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'row', gap: '3', wrap: true },
                        children: [
                            { id: 'atom_filter_all', nodeType: 'atom', component: 'Button', props: { variant: 'default', size: 'sm', children: 'All' } },
                            { id: 'atom_filter_course', nodeType: 'atom', component: 'Button', props: { variant: 'outline', size: 'sm', children: 'Courses' } },
                            { id: 'atom_filter_ebook', nodeType: 'atom', component: 'Button', props: { variant: 'outline', size: 'sm', children: 'Ebooks' } },
                            { id: 'atom_filter_template', nodeType: 'atom', component: 'Button', props: { variant: 'outline', size: 'sm', children: 'Templates' } },
                            { id: 'atom_filter_free', nodeType: 'atom', component: 'Button', props: { variant: 'outline', size: 'sm', children: '🎁 Free' } },
                        ],
                    },
                    // Products grid
                    {
                        id: 'mol_catalog_grid',
                        nodeType: 'molecule',
                        layout: { type: 'grid', cols: { default: 1, sm: 2, lg: 3 }, gap: '6' },
                        children: [
                            { id: 'atom_p1', nodeType: 'atom', component: 'Card', props: { title: 'UI Design System Course', description: '🎓 Course · $79 · 6h · 1,200 students' }, motion: { preset: 'fade-up', delay: 0, trigger: 'viewport' } },
                            { id: 'atom_p2', nodeType: 'atom', component: 'Card', props: { title: 'The Freelancer Playbook', description: '📖 Ebook · $29 · 230 pages' }, motion: { preset: 'fade-up', delay: 40, trigger: 'viewport' } },
                            { id: 'atom_p3', nodeType: 'atom', component: 'Card', props: { title: 'Next.js Starter Kit', description: '⚡ Template · $49 · 340 buyers' }, motion: { preset: 'fade-up', delay: 80, trigger: 'viewport' } },
                            { id: 'atom_p4', nodeType: 'atom', component: 'Card', props: { title: 'SEO Mastery 2026', description: '🎓 Course · $59 · Updated monthly' }, motion: { preset: 'fade-up', delay: 120, trigger: 'viewport' } },
                            { id: 'atom_p5', nodeType: 'atom', component: 'Card', props: { title: 'Notion Life OS', description: '⚡ Template · $19 · 2,100 buyers' }, motion: { preset: 'fade-up', delay: 160, trigger: 'viewport' } },
                            { id: 'atom_p6', nodeType: 'atom', component: 'Card', props: { title: 'The Cold Email Bible', description: '📖 Ebook · $24 · 180 pages' }, motion: { preset: 'fade-up', delay: 200, trigger: 'viewport' } },
                            { id: 'atom_p7', nodeType: 'atom', component: 'Card', props: { title: 'TypeScript Deep Dive', description: '🎓 Course · $69 · 8h · 800 students' }, motion: { preset: 'fade-up', delay: 240, trigger: 'viewport' } },
                            { id: 'atom_p8', nodeType: 'atom', component: 'Card', props: { title: 'Figma Component Library', description: '⚡ Template · $39 · 560 buyers' }, motion: { preset: 'fade-up', delay: 280, trigger: 'viewport' } },
                            { id: 'atom_p9', nodeType: 'atom', component: 'Card', props: { title: 'Build in Public Handbook', description: '📖 Ebook · Free · 90 pages' }, motion: { preset: 'fade-up', delay: 320, trigger: 'viewport' } },
                        ],
                    },
                ],
            },
        ],
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 3: PRODUCT DETAIL  /shop/[slug]
// ─────────────────────────────────────────────────────────────────────────────

export const productDetailPage: Page = {
    id: 'page_pdp',
    label: 'Product Detail',
    slug: '/shop/[slug]',
    status: 'published',
    tokens: sharedTokens,
    seo: { title: '{{product.name}} — CreatorStore', description: '{{product.description}}', robots: 'index,follow' },
    template: {
        id: 'tmpl_pdp',
        label: 'Product Detail',
        layout: 'landing',
        navbar: sharedNavbar,
        footer: sharedFooter,
        sections: [

            // PRODUCT HERO — 2 cols: imagen | info
            {
                id: 'org_pdp_hero',
                nodeType: 'organism',
                variant: 'hero',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '16' } },
                layout: { type: 'grid', cols: { default: 1, lg: 2 }, gap: '12' },
                children: [
                    // Imagen / preview
                    {
                        id: 'mol_pdp_media',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'col', gap: '4' },
                        children: [
                            { id: 'atom_pdp_cover', nodeType: 'atom', component: 'img', props: { src: 'https://placehold.co/600x400/e8e4ff/5b21b6?text=Product+Cover', alt: 'Product cover' }, style: { className: 'w-full rounded-xl', radius: 'xl' } },
                            {
                                id: 'mol_pdp_badges',
                                nodeType: 'molecule',
                                layout: { type: 'flex', direction: 'row', gap: '2', wrap: true },
                                children: [
                                    { id: 'atom_badge_type', nodeType: 'atom', component: 'Badge', props: { variant: 'secondary', children: '🎓 Course' } },
                                    { id: 'atom_badge_level', nodeType: 'atom', component: 'Badge', props: { variant: 'outline', children: 'Intermediate' } },
                                    { id: 'atom_badge_updated', nodeType: 'atom', component: 'Badge', props: { variant: 'outline', children: 'Updated Mar 2026' } },
                                ],
                            },
                        ],
                    },
                    // Info + CTA
                    {
                        id: 'mol_pdp_info',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'col', gap: '6' },
                        motion: { preset: 'fade-up', trigger: 'mount' },
                        children: [
                            { id: 'atom_pdp_h1', nodeType: 'atom', component: 'h1', props: { children: 'UI Design System Course' }, style: { fontSize: '4xl', fontWeight: 'bold' } },
                            { id: 'atom_pdp_rating', nodeType: 'atom', component: 'p', props: { children: '⭐ 4.9 · 1,200 students · 6h of content' }, style: { color: 'oklch(0.48 0 0)' } },
                            { id: 'atom_pdp_desc', nodeType: 'atom', component: 'p', props: { children: 'Learn to build scalable, consistent design systems from scratch using Figma. Real-world projects, component libraries, tokens and documentation strategies.' }, style: { fontSize: 'lg', color: 'oklch(0.35 0 0)' } },
                            // Price box
                            {
                                id: 'mol_pdp_price',
                                nodeType: 'molecule',
                                layout: { type: 'flex', direction: 'col', gap: '4' },
                                style: { className: 'border border-border rounded-xl p-6 bg-muted/30' },
                                children: [
                                    { id: 'atom_pdp_price', nodeType: 'atom', component: 'h2', props: { children: '$79' }, style: { fontSize: '5xl', fontWeight: 'bold' } },
                                    { id: 'atom_pdp_price_note', nodeType: 'atom', component: 'p', props: { children: 'One-time payment · Lifetime access · Instant download' }, style: { fontSize: 'sm', color: 'oklch(0.48 0 0)' } },
                                    { id: 'atom_pdp_buy', nodeType: 'atom', component: 'Button', props: { variant: 'default', size: 'lg', children: 'Buy now — $79' }, style: { className: 'w-full' } },
                                    { id: 'atom_pdp_guarantee', nodeType: 'atom', component: 'p', props: { children: '🔒 30-day money-back guarantee. No questions asked.' }, style: { fontSize: 'xs', className: 'text-center', color: 'oklch(0.48 0 0)' } },
                                ],
                            },
                        ],
                    },
                ],
            },

            // WHAT'S INCLUDED
            {
                id: 'org_pdp_includes',
                nodeType: 'organism',
                variant: 'features',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '12' } },
                layout: { type: 'flex', direction: 'col', gap: '8' },
                children: [
                    { id: 'atom_inc_h2', nodeType: 'atom', component: 'h2', props: { children: "What's included" }, style: { fontSize: '3xl', fontWeight: 'bold' } },
                    {
                        id: 'mol_includes_grid',
                        nodeType: 'molecule',
                        layout: { type: 'grid', cols: { default: 1, md: 2 }, gap: '4' },
                        children: [
                            { id: 'atom_inc_1', nodeType: 'atom', component: 'Card', props: { title: '✅ 6 hours of video', description: 'HD recordings, downloadable for offline viewing.' } },
                            { id: 'atom_inc_2', nodeType: 'atom', component: 'Card', props: { title: '✅ Figma source files', description: 'Full component library ready to use in your projects.' } },
                            { id: 'atom_inc_3', nodeType: 'atom', component: 'Card', props: { title: '✅ PDF workbook', description: '80-page companion guide with exercises and notes.' } },
                            { id: 'atom_inc_4', nodeType: 'atom', component: 'Card', props: { title: '✅ Private community', description: 'Access to a Discord community with the instructor.' } },
                            { id: 'atom_inc_5', nodeType: 'atom', component: 'Card', props: { title: '✅ Certificate', description: 'Verifiable certificate of completion to share on LinkedIn.' } },
                            { id: 'atom_inc_6', nodeType: 'atom', component: 'Card', props: { title: '✅ Lifetime updates', description: 'New lessons added as the industry evolves. Free forever.' } },
                        ],
                    },
                ],
            },

            // CURRICULUM
            {
                id: 'org_pdp_curriculum',
                nodeType: 'organism',
                variant: 'features',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '12' } },
                layout: { type: 'flex', direction: 'col', gap: '8' },
                background: { type: 'color', value: 'oklch(0.97 0 0)' },
                children: [
                    { id: 'atom_curr_h2', nodeType: 'atom', component: 'h2', props: { children: 'Curriculum' }, style: { fontSize: '3xl', fontWeight: 'bold' } },
                    {
                        id: 'mol_curriculum_list',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'col', gap: '3' },
                        children: [
                            { id: 'atom_mod_1', nodeType: 'atom', component: 'Card', props: { title: 'Module 1 — Foundations of Design Systems', description: '5 lessons · 45 min · What is a design system, tokens, naming conventions.' } },
                            { id: 'atom_mod_2', nodeType: 'atom', component: 'Card', props: { title: 'Module 2 — Color & Typography', description: '6 lessons · 55 min · Color palettes, type scales, dark mode tokens.' } },
                            { id: 'atom_mod_3', nodeType: 'atom', component: 'Card', props: { title: 'Module 3 — Component Architecture', description: '8 lessons · 80 min · Atomic design, variants, auto-layout patterns.' } },
                            { id: 'atom_mod_4', nodeType: 'atom', component: 'Card', props: { title: 'Module 4 — Documentation & Handoff', description: '5 lessons · 50 min · Storybook, README templates, dev handoff.' } },
                            { id: 'atom_mod_5', nodeType: 'atom', component: 'Card', props: { title: 'Module 5 — Real-world Project', description: '7 lessons · 90 min · Build a full system from scratch end to end.' } },
                        ],
                    },
                ],
            },

            // TESTIMONIALS
            {
                id: 'org_pdp_reviews',
                nodeType: 'organism',
                variant: 'testimonials',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '12' } },
                layout: { type: 'flex', direction: 'col', gap: '8' },
                children: [
                    { id: 'atom_rev_h2', nodeType: 'atom', component: 'h2', props: { children: 'What students say' }, style: { fontSize: '3xl', fontWeight: 'bold' } },
                    {
                        id: 'mol_reviews_grid',
                        nodeType: 'molecule',
                        layout: { type: 'grid', cols: { default: 1, md: 3 }, gap: '6' },
                        children: [
                            { id: 'atom_rev_1', nodeType: 'atom', component: 'Card', props: { title: 'Ana T. — UX Designer', description: '"I built our company\'s entire design system using what I learned here. Worth every cent."' }, motion: { preset: 'fade-up', delay: 0, trigger: 'viewport' } },
                            { id: 'atom_rev_2', nodeType: 'atom', component: 'Card', props: { title: 'Marco R. — Frontend Dev', description: '"Finally understood how tokens work in practice. The Figma files alone are worth the price."' }, motion: { preset: 'fade-up', delay: 80, trigger: 'viewport' } },
                            { id: 'atom_rev_3', nodeType: 'atom', component: 'Card', props: { title: 'Lena K. — Product Lead', description: '"Reduced our design-to-dev handoff time by 60%. This course changed how my team works."' }, motion: { preset: 'fade-up', delay: 160, trigger: 'viewport' } },
                        ],
                    },
                ],
            },

            // BOTTOM CTA
            {
                id: 'org_pdp_bottom_cta',
                nodeType: 'organism',
                variant: 'cta',
                container: { maxWidth: 'lg', centered: true, padding: { x: '6', y: '16' } },
                layout: { type: 'flex', direction: 'col', align: 'center', gap: '6' },
                background: { type: 'gradient', from: 'oklch(0.50 0.22 264)', to: 'oklch(0.38 0.18 280)', direction: '135deg' },
                motion: { preset: 'fade-up', trigger: 'viewport' },
                children: [
                    { id: 'atom_pdp_cta_h2', nodeType: 'atom', component: 'h2', props: { children: 'Ready to build your first design system?' }, style: { fontSize: '3xl', fontWeight: 'bold', className: 'text-center text-white' } },
                    { id: 'atom_pdp_cta_p', nodeType: 'atom', component: 'p', props: { children: 'Join 1,200 students. One-time payment. Instant access.' }, style: { className: 'text-white/80' } },
                    { id: 'atom_pdp_cta_btn', nodeType: 'atom', component: 'Button', props: { variant: 'secondary', size: 'lg', children: 'Get instant access — $79' } },
                ],
            },
        ],
    },
    variants: [
        {
            id: 'variant_pdp_returning',
            label: 'Already visited this page',
            priority: 10,
            condition: { type: 'simple', field: 'visitCount', operator: 'gt', value: 1 },
            patches: [
                { nodeId: 'atom_pdp_buy', action: 'update-props', props: { children: '🔥 Get it now before price goes up' } },
                { nodeId: 'atom_pdp_price_note', action: 'update-props', props: { children: '⚠️ Price increasing soon · Lifetime access · Instant download' } },
            ],
        },
    ],
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 4: CHECKOUT  /checkout
// ─────────────────────────────────────────────────────────────────────────────

export const checkoutPage: Page = {
    id: 'page_checkout',
    label: 'Checkout',
    slug: '/checkout',
    status: 'published',
    tokens: sharedTokens,
    seo: { title: 'Checkout — CreatorStore', robots: 'noindex,nofollow' },
    template: {
        id: 'tmpl_checkout',
        label: 'Checkout',
        layout: 'app',
        navbar: { ...sharedNavbar, items: [], cta: undefined },
        sections: [
            {
                id: 'org_checkout',
                nodeType: 'organism',
                variant: 'form',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '12' } },
                layout: { type: 'grid', cols: { default: 1, lg: 2 }, gap: '12' },
                children: [
                    // Left: form
                    {
                        id: 'mol_checkout_form',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'col', gap: '6' },
                        children: [
                            { id: 'atom_checkout_h1', nodeType: 'atom', component: 'h1', props: { children: 'Complete your order' }, style: { fontSize: '3xl', fontWeight: 'bold' } },
                            { id: 'atom_checkout_email_label', nodeType: 'atom', component: 'h3', props: { children: 'Email address' }, style: { fontSize: 'sm', fontWeight: 'medium' } },
                            { id: 'atom_checkout_email', nodeType: 'atom', component: 'Input', props: { placeholder: 'you@example.com' } },
                            { id: 'atom_checkout_payment_title', nodeType: 'atom', component: 'h3', props: { children: 'Payment details' }, style: { fontSize: 'lg', fontWeight: 'semibold' } },
                            { id: 'atom_checkout_card_name', nodeType: 'atom', component: 'Input', props: { placeholder: 'Name on card' } },
                            { id: 'atom_checkout_card_number', nodeType: 'atom', component: 'Input', props: { placeholder: 'Card number' } },
                            {
                                id: 'mol_checkout_card_row',
                                nodeType: 'molecule',
                                layout: { type: 'grid', cols: 2, gap: '4' },
                                children: [
                                    { id: 'atom_checkout_expiry', nodeType: 'atom', component: 'Input', props: { placeholder: 'MM / YY' } },
                                    { id: 'atom_checkout_cvv', nodeType: 'atom', component: 'Input', props: { placeholder: 'CVV' } },
                                ],
                            },
                            { id: 'atom_checkout_submit', nodeType: 'atom', component: 'Button', props: { variant: 'default', size: 'lg', children: 'Pay now' }, style: { className: 'w-full' } },
                            { id: 'atom_checkout_secure', nodeType: 'atom', component: 'p', props: { children: '🔒 256-bit SSL encryption · 30-day money-back guarantee' }, style: { fontSize: 'xs', className: 'text-center', color: 'oklch(0.48 0 0)' } },
                        ],
                    },
                    // Right: order summary
                    {
                        id: 'mol_checkout_summary',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'col', gap: '4' },
                        style: { className: 'border border-border rounded-xl p-6 h-fit' },
                        children: [
                            { id: 'atom_summary_title', nodeType: 'atom', component: 'h2', props: { children: 'Order summary' }, style: { fontSize: 'xl', fontWeight: 'semibold' } },
                            { id: 'atom_summary_sep', nodeType: 'atom', component: 'Separator', props: {} },
                            { id: 'atom_summary_product', nodeType: 'atom', component: 'Card', props: { title: 'UI Design System Course', description: '$79 · Instant download · Lifetime access' } },
                            { id: 'atom_summary_sep2', nodeType: 'atom', component: 'Separator', props: {} },
                            { id: 'atom_summary_total', nodeType: 'atom', component: 'h2', props: { children: 'Total: $79' }, style: { fontSize: '2xl', fontWeight: 'bold' } },
                            { id: 'atom_summary_note', nodeType: 'atom', component: 'p', props: { children: 'You\'ll receive a download link via email immediately after payment.' }, style: { fontSize: 'sm', color: 'oklch(0.48 0 0)' } },
                        ],
                    },
                ],
            },
        ],
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 5: ORDER CONFIRMATION  /order/confirmation
// ─────────────────────────────────────────────────────────────────────────────

export const orderConfirmationPage: Page = {
    id: 'page_order_confirmation',
    label: 'Order Confirmation',
    slug: '/order/confirmation',
    status: 'published',
    tokens: sharedTokens,
    seo: { title: 'Order confirmed — CreatorStore', robots: 'noindex,nofollow' },
    template: {
        id: 'tmpl_order_confirmation',
        label: 'Order Confirmation',
        layout: 'app',
        navbar: { ...sharedNavbar, items: [] },
        sections: [
            {
                id: 'org_confirmation',
                nodeType: 'organism',
                variant: 'cta',
                container: { maxWidth: 'lg', centered: true, padding: { x: '6', y: '20' } },
                layout: { type: 'flex', direction: 'col', align: 'center', gap: '8' },
                motion: { preset: 'scale-in', trigger: 'mount' },
                children: [
                    // Success icon
                    { id: 'atom_conf_icon', nodeType: 'atom', component: 'p', props: { children: '✅' }, style: { fontSize: '7xl', className: 'text-center' } },
                    // Heading
                    { id: 'atom_conf_h1', nodeType: 'atom', component: 'h1', props: { children: 'Order confirmed!' }, style: { fontSize: '5xl', fontWeight: 'bold', className: 'text-center' } },
                    { id: 'atom_conf_p', nodeType: 'atom', component: 'p', props: { children: 'Thank you for your purchase. We\'ve sent a confirmation and your download link to your email.' }, style: { fontSize: 'xl', className: 'text-center max-w-md', color: 'oklch(0.48 0 0)' } },
                    // Email notice box
                    {
                        id: 'mol_conf_email_box',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'col', align: 'center', gap: '3' },
                        style: { className: 'border border-border rounded-xl p-6 w-full bg-muted/30' },
                        children: [
                            { id: 'atom_conf_email_icon', nodeType: 'atom', component: 'p', props: { children: '📧' }, style: { fontSize: '3xl', className: 'text-center' } },
                            { id: 'atom_conf_email_title', nodeType: 'atom', component: 'h3', props: { children: 'Check your inbox' }, style: { fontSize: 'xl', fontWeight: 'semibold', className: 'text-center' } },
                            { id: 'atom_conf_email_body', nodeType: 'atom', component: 'p', props: { children: 'An email with your download link and receipt has been sent to you@example.com. The link is valid for 7 days and allows 3 downloads.' }, style: { fontSize: 'sm', className: 'text-center', color: 'oklch(0.48 0 0)' } },
                            { id: 'atom_conf_download_btn', nodeType: 'atom', component: 'Button', props: { variant: 'default', size: 'lg', children: '⬇ Download now' }, style: { className: 'w-full' } },
                            { id: 'atom_conf_spam_note', nodeType: 'atom', component: 'p', props: { children: "Can't find it? Check your spam folder or contact support." }, style: { fontSize: 'xs', color: 'oklch(0.55 0 0)', className: 'text-center' } },
                        ],
                    },
                    // Next steps
                    {
                        id: 'mol_conf_next',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'row', gap: '4', wrap: true, justify: 'center' },
                        children: [
                            { id: 'atom_conf_dashboard', nodeType: 'atom', component: 'Button', props: { variant: 'outline', children: 'Go to dashboard' } },
                            { id: 'atom_conf_shop_more', nodeType: 'atom', component: 'Button', props: { variant: 'ghost', children: 'Browse more products' } },
                        ],
                    },
                ],
            },
        ],
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 6: ACCOUNT DASHBOARD  /account/dashboard
// ─────────────────────────────────────────────────────────────────────────────

export const accountDashboardPage: Page = {
    id: 'page_account_dashboard',
    label: 'Account Dashboard',
    slug: '/account/dashboard',
    status: 'published',
    tokens: sharedTokens,
    seo: { title: 'Dashboard — CreatorStore', robots: 'noindex,nofollow' },
    template: {
        id: 'tmpl_dashboard',
        label: 'Dashboard',
        layout: 'app',
        navbar: sharedNavbar,
        footer: sharedFooter,
        sections: [
            {
                id: 'org_dashboard',
                nodeType: 'organism',
                variant: 'custom',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '12' } },
                layout: { type: 'flex', direction: 'col', gap: '10' },
                children: [
                    // Welcome
                    {
                        id: 'mol_dash_welcome',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'row', justify: 'between', align: 'center' },
                        children: [
                            {
                                id: 'mol_dash_welcome_text',
                                nodeType: 'molecule',
                                layout: { type: 'flex', direction: 'col', gap: '1' },
                                children: [
                                    { id: 'atom_dash_h1', nodeType: 'atom', component: 'h1', props: { children: 'Welcome back 👋' }, style: { fontSize: '3xl', fontWeight: 'bold' } },
                                    { id: 'atom_dash_sub', nodeType: 'atom', component: 'p', props: { children: 'Here are your purchased products and downloads.' }, style: { color: 'oklch(0.48 0 0)' } },
                                ],
                            },
                            { id: 'atom_dash_shop_btn', nodeType: 'atom', component: 'Button', props: { variant: 'outline', children: 'Browse products' } },
                        ],
                    },
                    // Stats
                    {
                        id: 'mol_dash_stats',
                        nodeType: 'molecule',
                        layout: { type: 'grid', cols: { default: 2, md: 4 }, gap: '4' },
                        children: [
                            { id: 'atom_ds_1', nodeType: 'atom', component: 'Card', props: { title: '3', description: 'Products purchased' } },
                            { id: 'atom_ds_2', nodeType: 'atom', component: 'Card', props: { title: '3', description: 'Available downloads' } },
                            { id: 'atom_ds_3', nodeType: 'atom', component: 'Card', props: { title: '$157', description: 'Total spent' } },
                            { id: 'atom_ds_4', nodeType: 'atom', component: 'Card', props: { title: 'Active', description: 'Account status' } },
                        ],
                    },
                    // Recent purchases
                    { id: 'atom_dash_purchases_h2', nodeType: 'atom', component: 'h2', props: { children: 'Your products' }, style: { fontSize: '2xl', fontWeight: 'semibold' } },
                    {
                        id: 'mol_dash_purchases',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'col', gap: '4' },
                        children: [
                            {
                                id: 'mol_purchase_1',
                                nodeType: 'molecule',
                                layout: { type: 'flex', direction: 'row', justify: 'between', align: 'center' },
                                style: { className: 'border border-border rounded-xl p-4' },
                                children: [
                                    { id: 'atom_pur1_title', nodeType: 'atom', component: 'p', props: { children: '🎓 UI Design System Course · Purchased Mar 10, 2026' }, style: { fontWeight: 'medium' } },
                                    { id: 'atom_pur1_btn', nodeType: 'atom', component: 'Button', props: { variant: 'outline', size: 'sm', children: '⬇ Download' } },
                                ],
                            },
                            {
                                id: 'mol_purchase_2',
                                nodeType: 'molecule',
                                layout: { type: 'flex', direction: 'row', justify: 'between', align: 'center' },
                                style: { className: 'border border-border rounded-xl p-4' },
                                children: [
                                    { id: 'atom_pur2_title', nodeType: 'atom', component: 'p', props: { children: '📖 The Freelancer Playbook · Purchased Feb 22, 2026' }, style: { fontWeight: 'medium' } },
                                    { id: 'atom_pur2_btn', nodeType: 'atom', component: 'Button', props: { variant: 'outline', size: 'sm', children: '⬇ Download' } },
                                ],
                            },
                            {
                                id: 'mol_purchase_3',
                                nodeType: 'molecule',
                                layout: { type: 'flex', direction: 'row', justify: 'between', align: 'center' },
                                style: { className: 'border border-border rounded-xl p-4' },
                                children: [
                                    { id: 'atom_pur3_title', nodeType: 'atom', component: 'p', props: { children: '⚡ Next.js Starter Kit · Purchased Jan 5, 2026' }, style: { fontWeight: 'medium' } },
                                    { id: 'atom_pur3_btn', nodeType: 'atom', component: 'Button', props: { variant: 'outline', size: 'sm', children: '⬇ Download' } },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 7: ORDER HISTORY  /account/orders
// ─────────────────────────────────────────────────────────────────────────────

export const orderHistoryPage: Page = {
    id: 'page_order_history',
    label: 'Order History',
    slug: '/account/orders',
    status: 'published',
    tokens: sharedTokens,
    seo: { title: 'Order History — CreatorStore', robots: 'noindex,nofollow' },
    template: {
        id: 'tmpl_order_history',
        label: 'Order History',
        layout: 'app',
        navbar: sharedNavbar,
        footer: sharedFooter,
        sections: [
            {
                id: 'org_orders',
                nodeType: 'organism',
                variant: 'custom',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '12' } },
                layout: { type: 'flex', direction: 'col', gap: '8' },
                children: [
                    { id: 'atom_orders_h1', nodeType: 'atom', component: 'h1', props: { children: 'Order history' }, style: { fontSize: '3xl', fontWeight: 'bold' } },
                    {
                        id: 'mol_orders_list',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'col', gap: '4' },
                        children: [
                            {
                                id: 'mol_order_1',
                                nodeType: 'molecule',
                                layout: { type: 'flex', direction: 'row', justify: 'between', align: 'center' },
                                style: { className: 'border border-border rounded-xl p-5' },
                                children: [
                                    {
                                        id: 'mol_order_1_info',
                                        nodeType: 'molecule',
                                        layout: { type: 'flex', direction: 'col', gap: '1' },
                                        children: [
                                            { id: 'atom_o1_id', nodeType: 'atom', component: 'p', props: { children: 'Order #1024' }, style: { fontWeight: 'semibold' } },
                                            { id: 'atom_o1_product', nodeType: 'atom', component: 'p', props: { children: 'UI Design System Course' }, style: { color: 'oklch(0.48 0 0)', fontSize: 'sm' } },
                                            { id: 'atom_o1_date', nodeType: 'atom', component: 'p', props: { children: 'Mar 10, 2026 · $79 · ✅ Completed' }, style: { color: 'oklch(0.55 0 0)', fontSize: 'xs' } },
                                        ],
                                    },
                                    { id: 'atom_o1_download', nodeType: 'atom', component: 'Button', props: { variant: 'outline', size: 'sm', children: '⬇ Download' } },
                                ],
                            },
                            {
                                id: 'mol_order_2',
                                nodeType: 'molecule',
                                layout: { type: 'flex', direction: 'row', justify: 'between', align: 'center' },
                                style: { className: 'border border-border rounded-xl p-5' },
                                children: [
                                    {
                                        id: 'mol_order_2_info',
                                        nodeType: 'molecule',
                                        layout: { type: 'flex', direction: 'col', gap: '1' },
                                        children: [
                                            { id: 'atom_o2_id', nodeType: 'atom', component: 'p', props: { children: 'Order #1018' }, style: { fontWeight: 'semibold' } },
                                            { id: 'atom_o2_product', nodeType: 'atom', component: 'p', props: { children: 'The Freelancer Playbook' }, style: { color: 'oklch(0.48 0 0)', fontSize: 'sm' } },
                                            { id: 'atom_o2_date', nodeType: 'atom', component: 'p', props: { children: 'Feb 22, 2026 · $29 · ✅ Completed' }, style: { color: 'oklch(0.55 0 0)', fontSize: 'xs' } },
                                        ],
                                    },
                                    { id: 'atom_o2_download', nodeType: 'atom', component: 'Button', props: { variant: 'outline', size: 'sm', children: '⬇ Download' } },
                                ],
                            },
                            {
                                id: 'mol_order_3',
                                nodeType: 'molecule',
                                layout: { type: 'flex', direction: 'row', justify: 'between', align: 'center' },
                                style: { className: 'border border-border rounded-xl p-5' },
                                children: [
                                    {
                                        id: 'mol_order_3_info',
                                        nodeType: 'molecule',
                                        layout: { type: 'flex', direction: 'col', gap: '1' },
                                        children: [
                                            { id: 'atom_o3_id', nodeType: 'atom', component: 'p', props: { children: 'Order #1005' }, style: { fontWeight: 'semibold' } },
                                            { id: 'atom_o3_product', nodeType: 'atom', component: 'p', props: { children: 'Next.js Starter Kit' }, style: { color: 'oklch(0.48 0 0)', fontSize: 'sm' } },
                                            { id: 'atom_o3_date', nodeType: 'atom', component: 'p', props: { children: 'Jan 5, 2026 · $49 · ✅ Completed' }, style: { color: 'oklch(0.55 0 0)', fontSize: 'xs' } },
                                        ],
                                    },
                                    { id: 'atom_o3_download', nodeType: 'atom', component: 'Button', props: { variant: 'outline', size: 'sm', children: '⬇ Download' } },
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 8: LOGIN / REGISTER  /login
// ─────────────────────────────────────────────────────────────────────────────

export const loginPage: Page = {
    id: 'page_login',
    label: 'Login / Register',
    slug: '/login',
    status: 'published',
    tokens: sharedTokens,
    seo: { title: 'Sign in — CreatorStore', robots: 'noindex,nofollow' },
    template: {
        id: 'tmpl_login',
        label: 'Login',
        layout: 'auth',
        navbar: { ...sharedNavbar, items: [], cta: undefined },
        sections: [
            {
                id: 'org_login',
                nodeType: 'organism',
                variant: 'form',
                container: { maxWidth: 'sm', centered: true, padding: { x: '6', y: '20' } },
                layout: { type: 'flex', direction: 'col', gap: '8' },
                motion: { preset: 'fade-up', trigger: 'mount' },
                children: [
                    // Header
                    {
                        id: 'mol_login_header',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'col', align: 'center', gap: '2' },
                        children: [
                            { id: 'atom_login_logo', nodeType: 'atom', component: 'p', props: { children: 'CreatorStore' }, style: { fontWeight: 'bold', fontSize: 'xl', className: 'text-center' } },
                            { id: 'atom_login_h1', nodeType: 'atom', component: 'h1', props: { children: 'Welcome back' }, style: { fontSize: '3xl', fontWeight: 'bold', className: 'text-center' } },
                            { id: 'atom_login_sub', nodeType: 'atom', component: 'p', props: { children: "Sign in to access your purchases and downloads." }, style: { className: 'text-center', color: 'oklch(0.48 0 0)' } },
                        ],
                    },
                    // Form
                    {
                        id: 'mol_login_form',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'col', gap: '4' },
                        style: { className: 'border border-border rounded-xl p-6' },
                        children: [
                            { id: 'atom_login_email', nodeType: 'atom', component: 'Input', props: { placeholder: 'Email address' } },
                            { id: 'atom_login_password', nodeType: 'atom', component: 'Input', props: { placeholder: 'Password' } },
                            { id: 'atom_login_btn', nodeType: 'atom', component: 'Button', props: { variant: 'default', size: 'lg', children: 'Sign in' }, style: { className: 'w-full' } },
                            { id: 'atom_login_sep', nodeType: 'atom', component: 'p', props: { children: 'or continue with' }, style: { fontSize: 'sm', className: 'text-center', color: 'oklch(0.55 0 0)' } },
                            {
                                id: 'mol_login_social',
                                nodeType: 'molecule',
                                layout: { type: 'grid', cols: 2, gap: '3' },
                                children: [
                                    { id: 'atom_login_google', nodeType: 'atom', component: 'Button', props: { variant: 'outline', children: 'Google' }, style: { className: 'w-full' } },
                                    { id: 'atom_login_github', nodeType: 'atom', component: 'Button', props: { variant: 'outline', children: 'GitHub' }, style: { className: 'w-full' } },
                                ],
                            },
                        ],
                    },
                    // Links
                    {
                        id: 'mol_login_links',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'col', align: 'center', gap: '2' },
                        children: [
                            { id: 'atom_login_signup', nodeType: 'atom', component: 'p', props: { children: "Don't have an account? Create one →" }, style: { fontSize: 'sm' } },
                            { id: 'atom_login_forgot', nodeType: 'atom', component: 'p', props: { children: 'Forgot your password?' }, style: { fontSize: 'sm', color: 'oklch(0.55 0 0)' } },
                        ],
                    },
                ],
            },
        ],
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 9: SEARCH RESULTS  /search
// ─────────────────────────────────────────────────────────────────────────────

export const searchResultsPage: Page = {
    id: 'page_search',
    label: 'Search Results',
    slug: '/search',
    status: 'published',
    tokens: sharedTokens,
    seo: { title: 'Search — CreatorStore', robots: 'noindex,nofollow' },
    template: {
        id: 'tmpl_search',
        label: 'Search Results',
        layout: 'landing',
        navbar: sharedNavbar,
        footer: sharedFooter,
        sections: [
            {
                id: 'org_search',
                nodeType: 'organism',
                variant: 'custom',
                container: { maxWidth: 'xl', centered: true, padding: { x: '6', y: '12' } },
                layout: { type: 'flex', direction: 'col', gap: '8' },
                children: [
                    // Search bar
                    {
                        id: 'mol_search_bar',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'col', gap: '4' },
                        children: [
                            { id: 'atom_search_h1', nodeType: 'atom', component: 'h1', props: { children: 'Search results for "design"' }, style: { fontSize: '3xl', fontWeight: 'bold' } },
                            { id: 'atom_search_count', nodeType: 'atom', component: 'p', props: { children: '4 products found' }, style: { color: 'oklch(0.48 0 0)' } },
                            {
                                id: 'mol_search_input_row',
                                nodeType: 'molecule',
                                layout: { type: 'flex', direction: 'row', gap: '3' },
                                children: [
                                    { id: 'atom_search_input', nodeType: 'atom', component: 'Input', props: { placeholder: 'Search products...', value: 'design' }, style: { className: 'flex-1' } },
                                    { id: 'atom_search_btn', nodeType: 'atom', component: 'Button', props: { variant: 'default', children: 'Search' } },
                                ],
                            },
                        ],
                    },
                    // Results grid
                    {
                        id: 'mol_search_results',
                        nodeType: 'molecule',
                        layout: { type: 'grid', cols: { default: 1, sm: 2, lg: 3 }, gap: '6' },
                        children: [
                            { id: 'atom_sr_1', nodeType: 'atom', component: 'Card', props: { title: 'UI Design System Course', description: '🎓 Course · $79 · 1,200 students' }, motion: { preset: 'fade-up', delay: 0, trigger: 'viewport' } },
                            { id: 'atom_sr_2', nodeType: 'atom', component: 'Card', props: { title: 'Figma Component Library', description: '⚡ Template · $39 · 560 buyers' }, motion: { preset: 'fade-up', delay: 60, trigger: 'viewport' } },
                            { id: 'atom_sr_3', nodeType: 'atom', component: 'Card', props: { title: 'The Design Brief', description: '📖 Ebook · $24 · 120 pages' }, motion: { preset: 'fade-up', delay: 120, trigger: 'viewport' } },
                            { id: 'atom_sr_4', nodeType: 'atom', component: 'Card', props: { title: 'Brand Identity Kit', description: '⚡ Template · $29 · 890 buyers' }, motion: { preset: 'fade-up', delay: 180, trigger: 'viewport' } },
                        ],
                    },
                ],
            },
        ],
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// PAGE 10: 404  /404
// ─────────────────────────────────────────────────────────────────────────────

export const notFoundPage: Page = {
    id: 'page_404',
    label: '404 Not Found',
    slug: '/404',
    status: 'published',
    tokens: sharedTokens,
    seo: { title: 'Page not found — CreatorStore', robots: 'noindex,nofollow' },
    template: {
        id: 'tmpl_404',
        label: '404',
        layout: 'error',
        navbar: sharedNavbar,
        sections: [
            {
                id: 'org_404',
                nodeType: 'organism',
                variant: 'cta',
                container: { maxWidth: 'lg', centered: true, padding: { x: '6', y: '32' }, fullHeight: true },
                layout: { type: 'flex', direction: 'col', align: 'center', gap: '6' },
                motion: { preset: 'fade-up', trigger: 'mount' },
                children: [
                    { id: 'atom_404_code', nodeType: 'atom', component: 'p', props: { children: '404' }, style: { fontSize: '9xl', fontWeight: 'bold', className: 'text-center', color: 'oklch(0.88 0 0)' } },
                    { id: 'atom_404_h1', nodeType: 'atom', component: 'h1', props: { children: 'Page not found' }, style: { fontSize: '4xl', fontWeight: 'bold', className: 'text-center' } },
                    { id: 'atom_404_p', nodeType: 'atom', component: 'p', props: { children: "The page you're looking for doesn't exist or has been moved." }, style: { fontSize: 'lg', className: 'text-center', color: 'oklch(0.48 0 0)' } },
                    {
                        id: 'mol_404_actions',
                        nodeType: 'molecule',
                        layout: { type: 'flex', direction: 'row', gap: '4', justify: 'center' },
                        children: [
                            { id: 'atom_404_home', nodeType: 'atom', component: 'Button', props: { variant: 'default', size: 'lg', children: '← Go home' } },
                            { id: 'atom_404_shop', nodeType: 'atom', component: 'Button', props: { variant: 'outline', size: 'lg', children: 'Browse products' } },
                        ],
                    },
                ],
            },
        ],
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// EXPORT: todas las páginas del e-commerce digital
// ─────────────────────────────────────────────────────────────────────────────

export const digitalEcommerceTemplate = {
    id: 'tpl_digital_ecommerce_v1',
    label: 'Digital Products E-commerce',
    pages: {
        home: homePage,
        catalog: catalogPage,
        productDetail: productDetailPage,
        checkout: checkoutPage,
        orderConfirmation: orderConfirmationPage,
        accountDashboard: accountDashboardPage,
        orderHistory: orderHistoryPage,
        login: loginPage,
        search: searchResultsPage,
        notFound: notFoundPage,
    },
} as const;