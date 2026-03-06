import { describe, it, expect, beforeAll } from 'vitest';
import {
  registerLocale,
  getSupportedLocales,
  isLocaleRegistered,
  getTimezoneName,
  getTimezoneDisplay,
  getTimezoneNames,
  getTimezoneList,
  getIanaTimezone,
  getActiveSupportName,
} from '../src/index.js';
import en from '../langs/en.json';
import de from '../langs/de.json';

beforeAll(() => {
  registerLocale(en);
  registerLocale(de);
});

describe('registry', () => {
  it('registers locales', () => {
    expect(isLocaleRegistered('en')).toBe(true);
    expect(isLocaleRegistered('de')).toBe(true);
    expect(isLocaleRegistered('xx')).toBe(false);
  });

  it('lists supported locales', () => {
    const locales = getSupportedLocales();
    expect(locales).toContain('en');
    expect(locales).toContain('de');
  });
});

describe('getTimezoneName', () => {
  it('returns English timezone name', () => {
    expect(getTimezoneName('Tokyo', 'en')).toBe('Tokyo');
  });

  it('returns German timezone name', () => {
    expect(getTimezoneName('Tokyo', 'de')).toBe('Tokio');
  });

  it('accepts IANA timezone ID', () => {
    // America/New_York uniquely maps to "Eastern Time (US & Canada)"
    expect(getTimezoneName('America/New_York', 'de')).toBe('Eastern Time (USA u. Kanada)');
  });

  it('returns undefined for unknown timezone', () => {
    expect(getTimezoneName('Fake/Zone', 'en')).toBeUndefined();
  });

  it('returns undefined for unregistered locale', () => {
    expect(getTimezoneName('Tokyo', 'xx')).toBeUndefined();
  });
});

describe('getTimezoneDisplay', () => {
  it('formats with GMT offset', () => {
    expect(getTimezoneDisplay('Tokyo', 'en')).toBe('(GMT+09:00) Tokyo');
  });

  it('formats German with GMT offset', () => {
    expect(getTimezoneDisplay('Tokyo', 'de')).toBe('(GMT+09:00) Tokio');
  });

  it('formats with UTC prefix option', () => {
    expect(getTimezoneDisplay('Tokyo', 'en', { offsetFormat: 'UTC' })).toBe('(UTC+09:00) Tokyo');
  });

  it('formats negative offsets', () => {
    expect(getTimezoneDisplay('Eastern Time (US & Canada)', 'en')).toBe('(GMT-05:00) Eastern Time (US & Canada)');
  });

  it('formats zero offset', () => {
    expect(getTimezoneDisplay('UTC', 'en')).toBe('(GMT+00:00) UTC');
  });
});

describe('getTimezoneList', () => {
  it('returns sorted list by UTC offset', () => {
    const list = getTimezoneList('en')!;
    expect(list.length).toBe(152);
    expect(list[0].utcOffset).toBeLessThanOrEqual(list[1].utcOffset);
    expect(list[list.length - 2].utcOffset).toBeLessThanOrEqual(list[list.length - 1].utcOffset);
  });

  it('entries have all required fields', () => {
    const list = getTimezoneList('en')!;
    const tokyo = list.find(e => e.key === 'Tokyo')!;
    expect(tokyo.iana).toBe('Asia/Tokyo');
    expect(tokyo.name).toBe('Tokyo');
    expect(tokyo.display).toBe('(GMT+09:00) Tokyo');
    expect(tokyo.utcOffset).toBe(540);
  });
});

describe('mapping', () => {
  it('maps ActiveSupport name to IANA', () => {
    expect(getIanaTimezone('Tokyo')).toBe('Asia/Tokyo');
    expect(getIanaTimezone('Eastern Time (US & Canada)')).toBe('America/New_York');
  });

  it('maps IANA to ActiveSupport name', () => {
    expect(getActiveSupportName('Asia/Tokyo')).toBe('Osaka');
    expect(getActiveSupportName('America/New_York')).toBe('Eastern Time (US & Canada)');
  });

  it('returns undefined for unknown mappings', () => {
    expect(getIanaTimezone('Fake Zone')).toBeUndefined();
    expect(getActiveSupportName('Fake/Zone')).toBeUndefined();
  });
});
