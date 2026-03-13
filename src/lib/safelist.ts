/**
 * This file exists solely to ensure Tailwind CSS generates the utility classes
 * used by @sinceglobal/website-builder-base components.
 * 
 * The library's compiled bundle contains these class strings but Tailwind's
 * scanner may not detect them when running with Webpack bundler.
 * 
 * DO NOT DELETE - these class references are required for proper rendering.
 */

// Shadcn Button classes
const _button = `
  inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md
  text-sm font-medium ring-offset-background transition-colors
  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
  disabled:pointer-events-none disabled:opacity-50
  bg-primary text-primary-foreground hover:bg-primary/90
  bg-destructive text-destructive-foreground hover:bg-destructive/90
  border border-input bg-background hover:bg-accent hover:text-accent-foreground
  bg-secondary text-secondary-foreground hover:bg-secondary/80
  hover:bg-accent hover:text-accent-foreground
  text-primary underline-offset-4 hover:underline
  h-10 px-4 py-2
  h-9 rounded-md px-3
  h-11 rounded-md px-8
  h-10 w-10
`;

// DynamicPageRenderer classes
const _page = `
  w-full h-full flex flex-col
  p-10 text-center text-gray-400
  relative py-12
  max-w-[1200px] mx-auto flex-col gap-6 px-4 md:px-8
  items-start
`;

// DynamicComponentRenderer classes
const _component = `
  overflow-hidden
`;

// Common utility classes from the library
const _utils = `
  bg-background text-foreground
  bg-card text-card-foreground
  bg-popover text-popover-foreground
  bg-muted text-muted-foreground
  bg-accent text-accent-foreground
  bg-destructive text-destructive-foreground
  border-border border-input
  ring-ring
  rounded-lg rounded-sm
`;

export { };
