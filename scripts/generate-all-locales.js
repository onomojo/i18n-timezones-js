import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const langsDir = join(__dirname, '..', 'langs');

const allLocales = [];

for (const file of readdirSync(langsDir).sort()) {
  if (file.endsWith('.json') && file !== 'all.json') {
    const data = JSON.parse(readFileSync(join(langsDir, file), 'utf8'));
    allLocales.push(data);
  }
}

writeFileSync(join(langsDir, 'all.json'), JSON.stringify(allLocales, null, 2) + '\n');
console.log(`Generated langs/all.json with ${allLocales.length} locales`);
