"use client";

import { ThemeProvider } from "@sinceglobal/website-builder-base";

export function Providers({ children }: { children: React.ReactNode }) {
    return <ThemeProvider>{children}</ThemeProvider>;
}
