# i18n-timezones

> Localized timezone names for JavaScript and TypeScript -- 36 locales, 152 timezones, zero dependencies.

Building a timezone picker for an international audience? Displaying meeting times across regions? The `Intl` API gives you raw IANA identifiers like `America/New_York`, but your users expect to see **"Eastern Time (US & Canada)"** -- in their own language.

**i18n-timezones** provides human-friendly, localized timezone display names sourced from [CLDR](https://cldr.unicode.org/), the same data that powers ICU, Chrome, and Android. It accepts both friendly timezone names and IANA timezone identifiers, giving you everything you need to build polished, multilingual timezone UIs.

## Why i18n-timezones?

- **36 locales** covering 4+ billion speakers -- from Arabic to Vietnamese
- **Zero dependencies** -- just translation data and lookup functions
- **Tree-shakeable** -- bundle only the locales you need (~3-5 KB each, gzipped)
- **Dual ESM + CJS** -- works everywhere: Vite, Webpack, Next.js, Node.js
- **Full TypeScript** -- native type declarations, not bolted on
- **Friendly names + IANA** -- accepts both `"Tokyo"` and `"Asia/Tokyo"`, converts between them
- **Dropdown-ready** -- `getTimezoneList()` returns entries sorted by UTC offset, perfect for `<select>` menus

## Install

```bash
npm install i18n-timezones
```

## Quick Start

The fastest way to get going -- register all locales at once and set a default:

```typescript
import { registerAllLocales, setDefaultLocale, getTimezoneName } from 'i18n-timezones';
import allLocales from 'i18n-timezones/langs/all.json';

registerAllLocales(allLocales);
setDefaultLocale('de');

getTimezoneName('Tokyo');  // => "Tokio"
```

## Usage

### Bundle-conscious apps -- register only what you need

Each locale is a separate JSON file. Import only the ones your app requires -- bundlers will tree-shake the rest.

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

### Using a default locale

Set a default locale so you don't have to pass it every time:

```typescript
import { registerLocale, setDefaultLocale, getDefaultLocale, getTimezoneName } from 'i18n-timezones';
import de from 'i18n-timezones/langs/de.json';

registerLocale(de);
setDefaultLocale('de');

getTimezoneName('Tokyo');           // => "Tokio" (uses default locale)
getTimezoneName('Tokyo', 'de');     // => "Tokio" (explicit locale still works)
getDefaultLocale();                 // => "de"
```

### Building a timezone dropdown

```typescript
import { registerLocale, getTimezoneList } from 'i18n-timezones';
import en from 'i18n-timezones/langs/en.json';

registerLocale(en);

const timezones = getTimezoneList('en');
// Returns an array sorted by UTC offset:
// [
//   { key: "International Date Line West", iana: "Etc/GMT+12", name: "International Date Line West",
//     display: "(GMT-12:00) International Date Line West", utcOffset: -720 },
//   ...
//   { key: "Tokyo", iana: "Asia/Tokyo", name: "Tokyo",
//     display: "(GMT+09:00) Tokyo", utcOffset: 540 },
//   ...
// ]

// Use it in a React component:
function TimezonePicker({ value, onChange }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}>
      {timezones.map(tz => (
        <option key={tz.key} value={tz.iana ?? tz.key}>
          {tz.display}
        </option>
      ))}
    </select>
  );
}
```

### Converting between friendly names and IANA IDs

```typescript
import { getIanaTimezone, getTimezoneFriendlyName } from 'i18n-timezones';

getIanaTimezone('Eastern Time (US & Canada)');  // => "America/New_York"
getTimezoneFriendlyName('Asia/Tokyo');          // => "Osaka"
```

## API Reference

| Function | Description |
|----------|-------------|
| `registerLocale(data)` | Register a locale's timezone translations. Required before lookups. |
| `registerAllLocales(allData)` | Register an array of locale data objects at once. |
| `setDefaultLocale(locale)` | Set the default locale for lookup functions. Throws if locale is not registered. |
| `getDefaultLocale()` | Get the current default locale, or `undefined` if none is set. |
| `getTimezoneName(timezone, locale?)` | Get the localized name. Accepts friendly names or IANA IDs. Uses default locale if omitted. |
| `getTimezoneDisplay(timezone, locale?, options?)` | Formatted string like `"(GMT+09:00) Tokio"`. Options: `{ offsetFormat: 'GMT' \| 'UTC' }` |
| `getTimezoneList(locale?, options?)` | Sorted array of all timezones -- ready for dropdowns. |
| `getTimezoneNames(locale?)` | All translations as a `{ name: localizedName }` object. |
| `getIanaTimezone(friendlyName)` | Convert friendly name to IANA ID. |
| `getTimezoneFriendlyName(ianaId)` | Convert IANA ID to friendly name. |
| `getSupportedLocales()` | List all registered locale codes. |
| `isLocaleRegistered(locale)` | Check if a locale has been registered. |

All lookup functions return `undefined` when a timezone or locale is not found -- no exceptions thrown.

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

All translations come from the [Unicode CLDR](https://cldr.unicode.org/) (Common Locale Data Repository) -- the industry-standard source used by every major platform including iOS, Android, Chrome, and Java. This ensures translations are accurate, consistent, and maintained by native speakers through Unicode's established review process.

## Related

- **[i18n-country-translations](https://github.com/onomojo/i18n-country-translations-js)** -- Localized country names for 168 locales
- **[i18n-timezones-data](https://github.com/onomojo/i18n-timezones-data)** -- Raw YAML translation data (for non-JS consumers)

## License

MIT
