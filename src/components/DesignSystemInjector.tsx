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

    // Extract colors - handle both formats
    const colors = designTokens.colors || {};
    const palette = colors.palette || colors;  // Fallback to colors if no palette
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
      // Skip non-color entries like 'mode'
      if (typeof oklchValue !== 'string' || !oklchValue.includes('oklch')) {
        continue;
      }

      const shadcnName = colorMapping[mdName];
      if (shadcnName) {
        root.style.setProperty(`--${shadcnName}`, oklchValue);
      }
      // Also set the MD3 name directly for reference
      root.style.setProperty(`--md3-${mdName}`, oklchValue);
    }

    // Set semantic colors
    for (const [name, value] of Object.entries(semanticColors)) {
      root.style.setProperty(`--${name}`, value as string);
    }

    // Apply typography from design tokens - handle both formats
    const typography = designTokens.typography || {};

    // Extract font families (handle nested objects)
    const displayFont = typography.display?.font_family || typography.display || 'system-ui';
    const bodyFont = typography.body?.font_family || typography.body || 'system-ui';
    const monoFont = typography.mono?.font_family || typography.mono || 'monospace';

    if (displayFont && typeof displayFont === 'string') {
      root.style.setProperty('--font-display', displayFont);
    }
    if (bodyFont && typeof bodyFont === 'string') {
      root.style.setProperty('--font-body', bodyFont);
    }
    if (monoFont && typeof monoFont === 'string') {
      root.style.setProperty('--font-mono', monoFont);
    }

    // Apply spacing scales if provided
    const spacing = designTokens.spacing || {};
    const spacingScale = spacing.scale || spacing;

    if (spacingScale && typeof spacingScale === 'object') {
      for (const [name, value] of Object.entries(spacingScale)) {
        if (typeof value === 'string' && name !== 'base') {
          root.style.setProperty(`--spacing-${name}`, value);
        }
      }
    }

    // Apply border radius
    const borderRadius = designTokens.border_radius || {};
    for (const [name, value] of Object.entries(borderRadius)) {
      if (typeof value === 'string') {
        root.style.setProperty(`--radius-${name}`, value);
      }
    }

    // Also apply standard Tailwind spacing aliases for compatibility
    // Map design system spacing to Tailwind spacing units
    if (spacing.scale) {
      const spacingMap: Record<string, string> = {
        '0': '0',
        '1': 'spacing-1',
        '2': 'spacing-2',
        '3': 'spacing-3',
        '4': 'spacing-4',
        '6': 'spacing-6',
        '8': 'spacing-8',
        '10': 'spacing-10',
        '12': 'spacing-12',
        '16': 'spacing-16',
        '20': 'spacing-20',
        '24': 'spacing-24',
        '32': 'spacing-32',
      };

      for (const [twUnit, designVar] of Object.entries(spacingMap)) {
        const value = spacing.scale[twUnit] as string | undefined;
        if (value) {
          // Set both the custom variable and standard CSS for Tailwind
          root.style.setProperty(`--${designVar}`, value);
        }
      }
    }

    // Also apply Tailwind spacing classes directly to :root as CSS variables
    // This allows Tailwind to use them like p-[var(--spacing-value)]
    if (spacing.scale) {
      for (const [key, value] of Object.entries(spacing.scale)) {
        root.style.setProperty(`--spacing-${key}`, value as string);
      }
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
