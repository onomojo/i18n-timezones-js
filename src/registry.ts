import type { LocaleData } from './types.js';

const locales = new Map<string, Record<string, string>>();

export function registerLocale(data: LocaleData): void {
  locales.set(data.locale, data.timezones);
}

export function getSupportedLocales(): string[] {
  return Array.from(locales.keys());
}

export function isLocaleRegistered(locale: string): boolean {
  return locales.has(locale);
}

export function getLocaleData(locale: string): Record<string, string> | undefined {
  return locales.get(locale);
}
