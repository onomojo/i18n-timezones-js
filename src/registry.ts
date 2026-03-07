import type { LocaleData } from './types.js';

const locales = new Map<string, Record<string, string>>();
let defaultLocale: string | undefined;

export function registerLocale(data: LocaleData): void {
  if (!data || typeof data.locale !== 'string' || data.locale.length === 0) {
    throw new Error('registerLocale: data.locale must be a non-empty string');
  }
  if (!data.timezones || typeof data.timezones !== 'object') {
    throw new Error('registerLocale: data.timezones must be a non-null object');
  }
  locales.set(data.locale, data.timezones);
}

/** Register an array of locale data objects at once. */
export function registerAllLocales(allData: LocaleData[]): void {
  for (const data of allData) {
    registerLocale(data);
  }
}

/** Set the default locale used when no locale is passed to lookup functions. Throws if the locale is not registered. */
export function setDefaultLocale(locale: string): void {
  if (!locales.has(locale)) {
    throw new Error(`setDefaultLocale: locale "${locale}" is not registered`);
  }
  defaultLocale = locale;
}

/** Get the current default locale, or undefined if none is set. */
export function getDefaultLocale(): string | undefined {
  return defaultLocale;
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
