#!/usr/bin/env node
/**
 * Copies JSON data files from the i18n-timezones-data package to langs/.
 * Reads from i18n-timezones-data/data/*.json, writes to langs/*.json
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, basename } from 'path';
import { createRequire } from 'module';

const require_ = createRequire(import.meta.url);
const dataDir = join(require_.resolve('i18n-timezones-data/package.json'), '..', 'data');
const outDir = new URL('../langs/', import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });

const files = readdirSync(dataDir).filter(f => f.endsWith('.json'));

for (const file of files) {
  const raw = readFileSync(join(dataDir, file), 'utf8');
  const parsed = JSON.parse(raw);
  const locale = basename(file, '.json');

  const jsonData = { locale, timezones: parsed };
  writeFileSync(
    join(outDir, `${locale}.json`),
    JSON.stringify(jsonData, null, 2) + '\n',
    'utf8'
  );
  console.log(`✓ ${locale}.json (${Object.keys(parsed).length} entries)`);
}

console.log(`\nDone: ${files.length} JSON files written to ${outDir}`);
