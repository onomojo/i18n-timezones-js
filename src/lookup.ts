import type { TimezoneEntry, DisplayOptions } from './types.js';
import { getLocaleData } from './registry.js';
import { resolveToActiveSupportName, getIanaTimezone, getUtcOffset, formatOffset } from './mapping.js';

export function getTimezoneName(timezone: string, locale: string): string | undefined {
  const data = getLocaleData(locale);
  if (!data) return undefined;

  const key = resolveToActiveSupportName(timezone);
  if (!key) return undefined;

  return data[key];
}

export function getTimezoneDisplay(
  timezone: string,
  locale: string,
  options?: DisplayOptions
): string | undefined {
  const key = resolveToActiveSupportName(timezone);
  if (!key) return undefined;

  const name = getTimezoneName(key, locale);
  if (!name) return undefined;

  const offset = getUtcOffset(key);
  if (offset === undefined) return name;

  return `(${formatOffset(offset, options?.offsetFormat ?? 'GMT')}) ${name}`;
}

export function getTimezoneNames(locale: string): Record<string, string> | undefined {
  return getLocaleData(locale);
}

export function getTimezoneList(
  locale: string,
  options?: DisplayOptions
): TimezoneEntry[] | undefined {
  const data = getLocaleData(locale);
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
