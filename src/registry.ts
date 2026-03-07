import type { LocaleData } from './types.js';

const locales = new Map<string, Record<string, string>>();

export function registerLocale(data: LocaleData): void {
  if (!data || typeof data.locale !== 'string' || data.locale.length === 0) {
    throw new Error('registerLocale: data.locale must be a non-empty string');
  }
  if (!data.timezones || typeof data.timezones !== 'object') {
    throw new Error('registerLocale: data.timezones must be a non-null object');
  }
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
