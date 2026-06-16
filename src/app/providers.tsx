"use client";

/**
 * Providers de la app. El theming por sitio se aplica por página en
 * [domain]/[[...slug]]/page.tsx con <ThemeProvider scope="root"> y el
 * theme_preset real. Aquí no envolvemos en un tema por defecto: los defaults
 * vienen del :root de theme.css (librería compartida).
 */
export function Providers({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
