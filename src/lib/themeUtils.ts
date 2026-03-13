import { Theme } from '../themes/defaultTheme';

export function getThemeValue<T extends keyof Theme>(
    theme: Theme,
    path: string,
    fallback?: any
): any {
    const keys = path.split('.');
    let value: any = theme;

    for (const key of keys) {
        value = value?.[key];
        if (value === undefined) return fallback;
    }

    return value;
}
