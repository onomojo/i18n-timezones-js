#!/usr/bin/env node
/**
 * Reads the Ruby gem's YAML locale files and produces flattened YAML in data/
 * Usage: node scripts/flatten-yaml.js <path-to-ruby-gem-locales>
 */
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, basename } from 'path';
import { parse, stringify } from 'yaml';

const sourceDir = process.argv[2] || '../i18n-timezones/rails/locale';
const outDir = new URL('../data/', import.meta.url).pathname;

const files = readdirSync(sourceDir).filter(f => f.endsWith('.yml'));

for (const file of files) {
  const raw = readFileSync(join(sourceDir, file), 'utf8');
  const parsed = parse(raw);
  const locale = Object.keys(parsed)[0];
  const timezones = parsed[locale]?.timezones;

  if (!timezones) {
    console.warn(`Skipping ${file}: no timezones key found`);
    continue;
  }

  // Write flat YAML (just key: value pairs, all keys quoted)
  const lines = Object.entries(timezones).map(
    ([key, val]) => `"${key}": "${String(val).replace(/"/g, '\\"')}"`
  );

  writeFileSync(join(outDir, file), lines.join('\n') + '\n', 'utf8');
  console.log(`✓ ${file} (${Object.keys(timezones).length} timezones)`);
}

console.log(`\nDone: ${files.length} locale files flattened to ${outDir}`);
