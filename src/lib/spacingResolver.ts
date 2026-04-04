/**
 * Converts Material Design 3 spacing values (like "4", "8", "16") to Tailwind classes
 * Maps design system spacing scale to Tailwind's spacing scale
 */

interface SpacingMap {
  [key: string]: string;
}

// Material Design 3 spacing scale to Tailwind equivalents
const SPACING_MAP: SpacingMap = {
  '0': 'p-0',
  '1': 'p-1',
  '2': 'p-2',
  '3': 'p-3',
  '4': 'p-4',
  '6': 'p-6',
  '8': 'p-8',
  '10': 'p-10',
  '12': 'p-12',
  '16': 'p-16',
  '20': 'p-20',
  '24': 'p-24',
  '32': 'p-32',
};

const GAP_MAP: SpacingMap = {
  '0': 'gap-0',
  '1': 'gap-1',
  '2': 'gap-2',
  '3': 'gap-3',
  '4': 'gap-4',
  '6': 'gap-6',
  '8': 'gap-8',
  '10': 'gap-10',
  '12': 'gap-12',
  '16': 'gap-16',
  '20': 'gap-20',
  '24': 'gap-24',
  '32': 'gap-32',
};

const PADDING_MAP: SpacingMap = {
  '0': 'p-0',
  '1': 'p-1',
  '2': 'p-2',
  '3': 'p-3',
  '4': 'p-4',
  '6': 'p-6',
  '8': 'p-8',
  '10': 'p-10',
  '12': 'p-12',
  '16': 'p-16',
  '20': 'p-20',
  '24': 'p-24',
  '32': 'p-32',
};

const MARGIN_MAP: SpacingMap = {
  '0': 'm-0',
  '1': 'm-1',
  '2': 'm-2',
  '3': 'm-3',
  '4': 'm-4',
  '6': 'm-6',
  '8': 'm-8',
  '10': 'm-10',
  '12': 'm-12',
  '16': 'm-16',
  '20': 'm-20',
  '24': 'm-24',
  '32': 'm-32',
};

/**
 * Convert a spacing value to a Tailwind class
 * e.g., "24" -> "p-24"
 */
export function spacingToClass(value: string | number, type: 'padding' | 'margin' | 'gap' = 'padding'): string {
  if (!value) return '';

  const stringValue = String(value);
  const map = type === 'gap' ? GAP_MAP : type === 'margin' ? MARGIN_MAP : PADDING_MAP;

  return map[stringValue] || '';
}

/**
 * Convert layout gap to Tailwind class
 */
export function gapToClass(value: string | number): string {
  return spacingToClass(value, 'gap');
}

/**
 * Infer spacing classes from props
 * Looks for padding, margin, gap values and converts them to classes
 */
export function inferSpacingClasses(props: Record<string, any> = {}): string {
  const classes: string[] = [];

  // Handle padding
  if (props.padding) {
    const paddingClass = spacingToClass(props.padding, 'padding');
    if (paddingClass) classes.push(paddingClass);
  }

  // Handle margin
  if (props.margin) {
    const marginClass = spacingToClass(props.margin, 'margin');
    if (marginClass) classes.push(marginClass);
  }

  // Handle gap (usually in layout, but can be in props)
  if (props.gap) {
    const gapClass = gapToClass(props.gap);
    if (gapClass) classes.push(gapClass);
  }

  return classes.join(' ');
}

/**
 * Extract spacing classes from a component's data
 * Handles both direct props and nested layout props
 */
export function extractSpacingClasses(data: any = {}): string {
  const classes: string[] = [];

  // From direct props
  if (data.props) {
    classes.push(inferSpacingClasses(data.props));
  }

  // From layout (gap is in layout.gap)
  if (data.layout?.gap) {
    const gapClass = gapToClass(data.layout.gap);
    if (gapClass) classes.push(gapClass);
  }

  return classes.filter(Boolean).join(' ');
}
