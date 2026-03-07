#!/usr/bin/env node
/**
 * Reads the Ruby gem's YAML locale files and produces flattened YAML in data/
 * Usage: node scripts/flatten-yaml.js <path-to-ruby-gem-locales>
 */
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';

const sourceDir = process.argv[2];
if (!sourceDir) {
  console.error('Usage: node scripts/flatten-yaml.js <path-to-ruby-gem-locales>');
  process.exit(1);
}
const outDir = new URL('../data/', import.meta.url).pathname;
mkdirSync(outDir, { recursive: true });

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
