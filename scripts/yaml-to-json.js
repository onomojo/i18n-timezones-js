#!/usr/bin/env node
/**
 * Converts flattened YAML data files to JSON for the NPM package.
 * Reads from data/*.yml, writes to langs/*.json
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { parse } from 'yaml';

const dataDir = new URL('../data/', import.meta.url).pathname;
const outDir = new URL('../langs/', import.meta.url).pathname;

const files = readdirSync(dataDir).filter(f => f.endsWith('.yml'));

for (const file of files) {
  const raw = readFileSync(join(dataDir, file), 'utf8');
  const parsed = parse(raw);
  const locale = basename(file, '.yml');

  const jsonData = { locale, timezones: parsed };
  writeFileSync(
    join(outDir, `${locale}.json`),
    JSON.stringify(jsonData, null, 2) + '\n',
    'utf8'
  );
  console.log(`✓ ${locale}.json (${Object.keys(parsed).length} entries)`);
}

console.log(`\nDone: ${files.length} JSON files written to ${outDir}`);
