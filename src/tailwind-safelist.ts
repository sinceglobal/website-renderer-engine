/**
 * Tailwind safelist (renderer-side).
 *
 * Las clases usadas dentro de los componentes shadcn de la librería y en los
 * `style.className` de los page_json viven en datos en runtime, no en archivos
 * que Tailwind escanee. Este string fuerza su generación: el renderer escanea
 * su propio src (@source "../**/*.{ts,tsx}"), así que Tailwind ve estos tokens.
 *
 * No se importa en ningún lado a propósito — solo existe para el escaneo.
 */
export const TAILWIND_SAFELIST = `
flex inline-flex flex-row flex-col flex-wrap flex-1 shrink-0 grow
items-start items-center items-end items-baseline
justify-start justify-center justify-end justify-between justify-around
gap-0 gap-0.5 gap-1 gap-1.5 gap-2 gap-2.5 gap-3 gap-4 gap-5 gap-6 gap-8 gap-10 gap-12
self-center self-start self-end mx-auto ml-auto mr-auto
w-full w-auto max-w-xs max-w-sm max-w-md max-w-lg max-w-xl max-w-2xl
min-h-svh min-h-screen h-px h-4 h-5 h-6 h-8 h-9 h-10 h-11 h-12 size-4 size-5 size-6 size-8
p-0 p-1 p-2 p-3 p-4 p-6 p-8 p-10
px-2 px-3 px-4 px-6 py-1 py-1.5 py-2 py-2.5 py-3 py-4 py-6 pt-0 pb-0
mt-1 mt-2 mt-4 mb-1 mb-2 mb-4
rounded-none rounded-sm rounded-md rounded-lg rounded-xl rounded-2xl rounded-full
border border-0 border-t border-b border-l border-r border-input border-border
bg-background bg-foreground bg-card bg-popover bg-primary bg-secondary bg-muted bg-accent bg-input bg-border bg-transparent
bg-primary/90 bg-accent/50 bg-destructive
text-foreground text-card-foreground text-popover-foreground text-primary text-primary-foreground
text-secondary-foreground text-muted-foreground text-accent-foreground text-destructive
text-xs text-sm text-base text-lg text-xl text-2xl text-3xl
font-normal font-medium font-semibold font-bold
text-left text-center text-right whitespace-nowrap leading-none leading-tight tracking-tight
underline underline-offset-4 hover:underline
shadow-xs shadow-sm shadow shadow-md
hover:bg-accent hover:text-accent-foreground hover:bg-primary/90 hover:bg-muted
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
ring-offset-background placeholder:text-muted-foreground
disabled:opacity-50 disabled:pointer-events-none
relative absolute inset-0 z-10
md:p-10 md:text-sm
bg-chart-1 bg-chart-2 bg-chart-3 bg-chart-4 bg-chart-5
bg-sidebar text-sidebar-foreground bg-sidebar-primary text-sidebar-primary-foreground
bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border
`;
