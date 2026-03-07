import type { TimezoneEntry, DisplayOptions } from './types.js';
import { getLocaleData, getDefaultLocale } from './registry.js';
import { resolveToFriendlyName, getIanaTimezone, getUtcOffset, formatOffset } from './mapping.js';

function resolveLocale(locale?: string): string | undefined {
  return locale ?? getDefaultLocale();
}

export function getTimezoneName(timezone: string, locale?: string): string | undefined {
  const loc = resolveLocale(locale);
  if (!loc) return undefined;

  const data = getLocaleData(loc);
  if (!data) return undefined;

  const key = resolveToFriendlyName(timezone);
  if (!key) return undefined;

  return data[key];
}

export function getTimezoneDisplay(
  timezone: string,
  locale?: string,
  options?: DisplayOptions
): string | undefined {
  const loc = resolveLocale(locale);
  if (!loc) return undefined;

  const key = resolveToFriendlyName(timezone);
  if (!key) return undefined;

  const name = getTimezoneName(key, loc);
  if (!name) return undefined;

  const offset = getUtcOffset(key);
  if (offset === undefined) return name;

  return `(${formatOffset(offset, options?.offsetFormat ?? 'GMT')}) ${name}`;
}

export function getTimezoneNames(locale?: string): Record<string, string> | undefined {
  const loc = resolveLocale(locale);
  if (!loc) return undefined;

  const data = getLocaleData(loc);
  if (!data) return undefined;
  return { ...data };
}

export function getTimezoneList(
  locale?: string,
  options?: DisplayOptions
): TimezoneEntry[] | undefined {
  const loc = resolveLocale(locale);
  if (!loc) return undefined;

  const data = getLocaleData(loc);
  if (!data) return undefined;

  const entries: TimezoneEntry[] = Object.entries(data).map(([key, name]) => {
    const offset = getUtcOffset(key) ?? 0;
    return {
      key,
      iana: getIanaTimezone(key),
      name,
      display: `(${formatOffset(offset, options?.offsetFormat ?? 'GMT')}) ${name}`,
      utcOffset: offset,
    };
  });

  return entries.sort((a, b) => a.utcOffset - b.utcOffset);
}
