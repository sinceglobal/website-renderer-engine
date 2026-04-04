'use client';

import { useEffect } from 'react';

interface DesignSystemInjectorProps {
  cssVariables?: string;
  designTokens?: Record<string, any>;
  tailwindConfig?: string;
}

/**
 * Client component that injects Material Design 3 CSS variables and tokens
 * Converts OKLch colors to CSS custom properties
 */
export function DesignSystemInjector({
  cssVariables,
  designTokens,
  tailwindConfig,
}: DesignSystemInjectorProps) {
  useEffect(() => {
    if (!designTokens) return;

    // Extract colors from Material Design 3 design_tokens
    const colors = designTokens.colors || {};
    const palette = colors.palette || {};
    const semanticColors = colors.semantic || {};

    // Map Material Design 3 semantic colors to shadcn/ui color names
    const colorMapping: Record<string, string> = {
      // MD3 to shadcn/ui mapping
      'primary': 'primary',
      'on_primary': 'primary-foreground',
      'secondary': 'secondary',
      'on_secondary': 'secondary-foreground',
      'tertiary': 'accent',
      'on_tertiary': 'accent-foreground',
      'error': 'destructive',
      'on_error': 'destructive-foreground',
      'background': 'background',
      'on_background': 'foreground',
      'surface': 'card',
      'on_surface': 'card-foreground',
      'surface_dim': 'muted',
      'on_surface_variant': 'muted-foreground',
      'outline': 'border',
      'outline_variant': 'border',
    };

    // Apply color variables to :root
    const root = document.documentElement;

    // Set Material Design 3 colors
    for (const [mdName, oklchValue] of Object.entries(palette)) {
      const shadcnName = colorMapping[mdName];
      if (shadcnName) {
        root.style.setProperty(`--${shadcnName}`, oklchValue as string);
      }
      // Also set the MD3 name directly for reference
      root.style.setProperty(`--md3-${mdName}`, oklchValue as string);
    }

    // Set semantic colors
    for (const [name, value] of Object.entries(semanticColors)) {
      root.style.setProperty(`--${name}`, value as string);
    }

    // Apply typography from design tokens
    const typography = designTokens.typography || {};

    if (typography.display?.font_family) {
      root.style.setProperty('--font-display', typography.display.font_family);
    }
    if (typography.body?.font_family) {
      root.style.setProperty('--font-body', typography.body.font_family);
    }
    if (typography.mono?.font_family) {
      root.style.setProperty('--font-mono', typography.mono.font_family);
    }

    // Apply spacing scales if provided
    const spacing = designTokens.spacing || {};
    if (spacing.scale) {
      for (const [name, value] of Object.entries(spacing.scale)) {
        root.style.setProperty(`--spacing-${name}`, value as string);
      }
    }

    // Apply border radius
    const borderRadius = designTokens.border_radius || {};
    for (const [name, value] of Object.entries(borderRadius)) {
      root.style.setProperty(`--radius-${name}`, value as string);
    }

    // Store design tokens for component access if needed
    (window as any).__designTokens = designTokens;
    (window as any).__designSystem = {
      colors: palette,
      semanticColors,
      typography,
      spacing: spacing.scale,
      borderRadius,
    };
  }, [designTokens]);

  // If css_variables string is provided, inject it directly
  if (cssVariables) {
    return (
      <style
        dangerouslySetInnerHTML={{
          __html: cssVariables,
        }}
        suppressHydrationWarning
      />
    );
  }

  return null;
}
