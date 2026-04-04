# Material Design 3 Integration - Website Renderer Engine

**Status:** ✅ Integrated and Ready to Test

## What Was Implemented

### 1. DesignSystemInjector Component

**File:** `src/components/DesignSystemInjector.tsx`

A client-side React component that:
- Receives `designTokens` from the backend's Material Design 3 generation
- Extracts Material Design 3 colors, typography, spacing, and border radius
- Maps Material Design 3 semantic colors to shadcn/ui color names
- Injects CSS variables into the document root
- Makes design tokens available globally on `window.__designTokens`

**How it works:**
```typescript
<DesignSystemInjector
  cssVariables={cssVariables}      // Raw CSS string from backend
  designTokens={designTokens}      // Material Design 3 tokens JSON
  tailwindConfig={tailwindConfig}  // Tailwind config (for reference)
/>
```

### 2. Dynamic Domain Layout

**File:** `src/app/[domain]/layout.tsx`

A wrapper layout for all domain-based routes that ensures design system is available across all pages.

### 3. Updated Dynamic Page Renderer

**File:** `src/app/[domain]/[[...slug]]/page.tsx`

Modified to:
- Extract `design_tokens`, `css_variables`, and `tailwind_config` from the backend response
- Pass these to the `DesignSystemInjector` component
- Render pages with Material Design 3 styling applied

## Color Mapping

Material Design 3 semantic colors are automatically mapped to shadcn/ui color scheme:

| Material Design 3 | shadcn/ui | Purpose |
|------------------|-----------|---------|
| primary | primary | Brand color |
| on_primary | primary-foreground | Text on primary |
| secondary | secondary | Secondary brand color |
| on_secondary | secondary-foreground | Text on secondary |
| tertiary | accent | Accent color |
| on_tertiary | accent-foreground | Text on accent |
| error | destructive | Error/danger state |
| on_error | destructive-foreground | Text on error |
| background | background | Page background |
| on_background | foreground | Primary text |
| surface | card | Card surfaces |
| on_surface | card-foreground | Card text |
| surface_dim | muted | Muted backgrounds |
| on_surface_variant | muted-foreground | Muted text |
| outline | border | Borders |

## How It Works

### Flow:

1. **Backend** generates Material Design 3 system
   - Produces `design_tokens` (JSON)
   - Produces `css_variables` (CSS string)
   - Stored in database

2. **API** exposes design data
   - `GET /sites/{site_id}` returns design outputs
   - Frontend fetches complete site bundle

3. **Page Renderer** receives design data
   - `page.tsx` fetches from microservice
   - Passes `design_tokens` to `DesignSystemInjector`

4. **DesignSystemInjector** applies styling
   - Runs on client side (useEffect)
   - Sets CSS variables on document root
   - Makes tokens globally available

5. **Tailwind CSS** uses the variables
   - `bg-primary` → `background-color: var(--primary)`
   - `text-foreground` → `color: var(--foreground)`
   - Dark mode automatic via CSS variables

## Environment Setup

The renderer is already configured to:
- Fetch from `NEXT_PUBLIC_MICROSERVICE_URL` (default: `http://localhost:8000/api/v1`)
- Use `NEXT_PUBLIC_DEV_SITE_ID` to force a specific site in development
- Auto-detect latest site if no DEV_SITE_ID provided

Example `.env` file:
```
NEXT_PUBLIC_MICROSERVICE_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_DEV_SITE_ID=194e7afb-5ac2-4de4-9588-9ada6c87e9ea
```

## Testing

### 1. Start the Renderer

```bash
cd /Users/jesusrodriguez/Documents/GitHub/website-renderer-engine
npm run dev
```

Server starts on `http://localhost:3005`

### 2. Access a Generated Site

Visit: `http://localhost:3005/localhost/` (or `/localhost/about`, etc.)

The renderer will:
1. Fetch site config from microservice
2. Fetch page data from microservice
3. Extract design tokens
4. Inject Material Design 3 styling
5. Render the page with applied themes

### 3. Verify Styling

Check browser dev tools:
- **Elements** tab: Look for CSS variables on `:root`
- **Computed styles**: Verify `--primary`, `--background`, etc. are set
- **Network**: Should see fetch to `/sites/{site_id}` with design data

## What Styling Gets Applied

### Colors
- Primary, secondary, accent, error colors from Material Design 3
- Light/dark mode variants
- Semantic colors (info, success, warning, muted)

### Typography
- Font families from `typography.display`, `typography.body`, `typography.mono`
- Applied via CSS variables
- Used by shadcn/ui components automatically

### Spacing
- Scales from design system spacing
- Border radius values
- Shadows and elevation

### Components
- All shadcn/ui components automatically inherit colors
- Button, Card, Input, Badge, etc. all use Material Design 3 palette
- No manual color overrides needed

## Troubleshooting

### "Design tokens not applying"
1. Check that backend generated the site with design data
2. Verify API response includes `design_tokens` field
3. Check browser console for errors in DesignSystemInjector
4. Inspect `:root` styles in dev tools

### "Colors are wrong"
1. Verify OKLch color values are correct in design_tokens
2. Check color mapping in DesignSystemInjector
3. Ensure CSS variables are being set on document root

### "Fonts not loading"
1. Typography values should be in `design_tokens.typography`
2. Font families must be available (system fonts or imported)
3. Check `--font-display`, `--font-body`, `--font-mono` variables

## Next Steps

1. **Start the renderer** with `npm run dev`
2. **Visit** `http://localhost:3005/localhost/`
3. **Verify** Material Design 3 styling appears
4. **Test dark mode** by adding `.dark` class to `<html>`
5. **Check components** - buttons, cards, inputs should all be themed

## Files Modified

- `src/app/[domain]/[[...slug]]/page.tsx` - Added DesignSystemInjector integration
- `src/components/DesignSystemInjector.tsx` - NEW: Design system injection component
- `src/app/[domain]/layout.tsx` - NEW: Domain-specific layout wrapper

## Summary

The renderer now:
✅ Fetches Material Design 3 data from backend
✅ Injects CSS variables into the DOM
✅ Applies Material Design 3 colors to all components
✅ Supports dark mode via CSS variables
✅ Automatically themes shadcn/ui components
✅ Makes design tokens available for custom components

Material Design 3 styling is now fully integrated from backend to frontend!
