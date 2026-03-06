# i18n-timezones

Timezone name translations for 36 locales. Maps ActiveSupport and IANA timezone identifiers to localized display names.

## Install

```bash
npm install i18n-timezones
```

## Usage

### Browser (register only the locales you need)

```typescript
import { registerLocale, getTimezoneName, getTimezoneDisplay, getTimezoneList } from 'i18n-timezones';
import de from 'i18n-timezones/langs/de.json';

registerLocale(de);

getTimezoneName('Tokyo', 'de');           // "Tokio"
getTimezoneName('Asia/Tokyo', 'de');      // "Tokio" (accepts IANA IDs)
getTimezoneDisplay('Tokyo', 'de');        // "(GMT+09:00) Tokio"
getTimezoneList('de');                    // sorted array for dropdowns
```

### Node.js (register all locales)

```typescript
import { registerLocale, getTimezoneName } from 'i18n-timezones';
import fs from 'fs';
import path from 'path';

// Register all locales from the langs directory
const langsDir = path.join(require.resolve('i18n-timezones'), '..', '..', 'langs');
for (const file of fs.readdirSync(langsDir).filter(f => f.endsWith('.json'))) {
  registerLocale(JSON.parse(fs.readFileSync(path.join(langsDir, file), 'utf8')));
}
```

## API

### `registerLocale(data: LocaleData): void`
Register a locale's timezone translations. Required before using lookup functions.

### `getTimezoneName(timezone: string, locale: string): string | undefined`
Get the localized name of a timezone. Accepts both ActiveSupport names ("Tokyo") and IANA IDs ("Asia/Tokyo").

### `getTimezoneDisplay(timezone: string, locale: string, options?): string | undefined`
Get a formatted display string like "(GMT+09:00) Tokio". Options: `{ offsetFormat: 'GMT' | 'UTC' }`.

### `getTimezoneList(locale: string, options?): TimezoneEntry[]`
Get all timezones as a sorted array (by UTC offset), useful for building dropdowns.

### `getTimezoneNames(locale: string): Record<string, string> | undefined`
Get all timezone name translations for a locale as a key-value object.

### `getIanaTimezone(activeSupportName: string): string | undefined`
Convert an ActiveSupport timezone name to an IANA timezone ID.

### `getActiveSupportName(ianaId: string): string | undefined`
Convert an IANA timezone ID to an ActiveSupport timezone name.

### `getSupportedLocales(): string[]`
List all registered locale codes.

### `isLocaleRegistered(locale: string): boolean`
Check if a locale has been registered.

## Supported Locales (36)

ar, bn, ca, cs, da, de, el, en, es, eu, fi, fr, he, hi, hr, hu, id, it, ja, ko, ms, nl, no, pl, pt, pt-BR, ro, ru, sq, sv, th, tr, uk, vi, zh-CN, zh-TW

## License

MIT
