# i18n-timezones

> Localized timezone names for JavaScript and TypeScript — 36 locales, 152 timezones, zero dependencies.

Building a timezone picker for an international audience? Displaying meeting times across regions? The `Intl` API gives you raw IANA identifiers like `America/New_York`, but your users expect to see **"Eastern Time (US & Canada)"** — in their own language.

**i18n-timezones** provides human-friendly, localized timezone display names sourced from [CLDR](https://cldr.unicode.org/), the same data that powers ICU, Chrome, and Android. It works with both ActiveSupport timezone names (used by Rails) and IANA timezone identifiers, making it the bridge between your backend and your UI.

## Why i18n-timezones?

- **36 locales** covering 4+ billion speakers — from Arabic to Vietnamese
- **Zero dependencies** — just translation data and lookup functions
- **Tree-shakeable** — bundle only the locales you need (~3-5 KB each, gzipped)
- **Dual ESM + CJS** — works everywhere: Vite, Webpack, Next.js, Node.js
- **Full TypeScript** — native type declarations, not bolted on
- **ActiveSupport + IANA** — accepts both `"Tokyo"` and `"Asia/Tokyo"`, converts between them
- **Dropdown-ready** — `getTimezoneList()` returns entries sorted by UTC offset, perfect for `<select>` menus

## Install

```bash
npm install i18n-timezones
```

## Quick Start

```typescript
import { registerLocale, getTimezoneDisplay, getTimezoneList } from 'i18n-timezones';
import de from 'i18n-timezones/langs/de.json';

registerLocale(de);

getTimezoneDisplay('Tokyo', 'de');
// => "(GMT+09:00) Tokio"

getTimezoneList('de');
// => [{ name: "Tokyo", display: "(GMT+09:00) Tokio", offset: 540 }, ...]
```

## Usage

### Browser — register only what you need

Each locale is a separate JSON file. Import only the ones your app requires — bundlers will tree-shake the rest.

```typescript
import { registerLocale, getTimezoneName, getTimezoneDisplay } from 'i18n-timezones';
import de from 'i18n-timezones/langs/de.json';
import fr from 'i18n-timezones/langs/fr.json';

registerLocale(de);
registerLocale(fr);

getTimezoneName('Tokyo', 'de');        // => "Tokio"
getTimezoneName('Asia/Tokyo', 'fr');   // => "Tokyo" (accepts IANA IDs too)
getTimezoneDisplay('Tokyo', 'de');     // => "(GMT+09:00) Tokio"
```

### Node.js — register all locales at once

```typescript
import { registerLocale } from 'i18n-timezones';
import { readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require_ = createRequire(import.meta.url);
const langsDir = join(dirname(require_.resolve('i18n-timezones')), '..', 'langs');

for (const file of readdirSync(langsDir).filter(f => f.endsWith('.json'))) {
  registerLocale(JSON.parse(readFileSync(join(langsDir, file), 'utf8')));
}
```

### Building a timezone dropdown

```typescript
import { registerLocale, getTimezoneList } from 'i18n-timezones';
import en from 'i18n-timezones/langs/en.json';

registerLocale(en);

const timezones = getTimezoneList('en');
// Returns an array sorted by UTC offset:
// [
//   { name: "American Samoa",          display: "(GMT-11:00) American Samoa",          offset: -660 },
//   { name: "International Date Line West", display: "(GMT-12:00) International Date Line West", offset: -720 },
//   ...
//   { name: "Auckland",                display: "(GMT+12:00) Auckland",                offset: 720 },
// ]
```

### Converting between ActiveSupport and IANA identifiers

```typescript
import { getIanaTimezone, getActiveSupportName } from 'i18n-timezones';

getIanaTimezone('Eastern Time (US & Canada)');  // => "America/New_York"
getActiveSupportName('Asia/Tokyo');             // => "Osaka"
```

## API Reference

| Function | Description |
|----------|-------------|
| `registerLocale(data)` | Register a locale's timezone translations. Required before lookups. |
| `getTimezoneName(timezone, locale)` | Get the localized name. Accepts ActiveSupport or IANA identifiers. |
| `getTimezoneDisplay(timezone, locale, options?)` | Formatted string like `"(GMT+09:00) Tokio"`. Options: `{ offsetFormat: 'GMT' \| 'UTC' }` |
| `getTimezoneList(locale, options?)` | Sorted array of all timezones — ready for dropdowns. |
| `getTimezoneNames(locale)` | All translations as a `{ name: localizedName }` object. |
| `getIanaTimezone(name)` | Convert ActiveSupport name → IANA ID. |
| `getActiveSupportName(ianaId)` | Convert IANA ID → ActiveSupport name. |
| `getSupportedLocales()` | List all registered locale codes. |
| `isLocaleRegistered(locale)` | Check if a locale has been registered. |

All lookup functions return `undefined` when a timezone or locale is not found — no exceptions thrown.

## Supported Locales

36 locales covering major world languages:

| | | | | | | |
|---|---|---|---|---|---|---|
| ar | bn | ca | cs | da | de | el |
| en | es | eu | fi | fr | he | hi |
| hr | hu | id | it | ja | ko | ms |
| nl | no | pl | pt | pt-BR | ro | ru |
| sq | sv | th | tr | uk | vi | zh-CN |
| zh-TW | | | | | | |

## Data Source

All translations come from the [Unicode CLDR](https://cldr.unicode.org/) (Common Locale Data Repository) — the industry-standard source used by every major platform including iOS, Android, Chrome, and Java. This ensures translations are accurate, consistent, and maintained by native speakers through Unicode's established review process.

## Related

- **[i18n-country-translations](https://github.com/onomojo/i18n-country-translations-js)** — Localized country names for 168 locales
- **[i18n-timezones-data](https://github.com/onomojo/i18n-timezones-data)** — Raw YAML translation data (for non-JS consumers)

## License

MIT
