import { createRequire } from 'module';
import { join, basename } from 'path';
import { readdirSync, readFileSync } from 'fs';
import type { LocaleData } from './types.js';

const locales = new Map<string, Record<string, string>>();
let defaultLocale: string | undefined;

function resolveDataDir(): string {
  const require_ = createRequire(import.meta.url);
  return join(require_.resolve('i18n-timezones-data/package.json'), '..', 'data');
}

/** Load a single locale from the i18n-timezones-data package and register it. */
export function loadLocale(locale: string): void {
  const dataDir = resolveDataDir();
  const filePath = join(dataDir, `${locale}.json`);
  const raw = readFileSync(filePath, 'utf8');
  const timezones = JSON.parse(raw);
  locales.set(locale, timezones);
}

/** Load all available locales from the i18n-timezones-data package. */
export function loadAllLocales(): void {
  const dataDir = resolveDataDir();
  const files = readdirSync(dataDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const locale = basename(file, '.json');
    const raw = readFileSync(join(dataDir, file), 'utf8');
    const timezones = JSON.parse(raw);
    locales.set(locale, timezones);
  }
}

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
