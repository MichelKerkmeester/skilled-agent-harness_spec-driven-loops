import { readFileSync, writeFileSync } from 'fs';

const raw = readFileSync('./config/settings.json', 'utf8');
const settings = JSON.parse(raw);

const result = {
  ...settings,
  transformed: true,
  source: 'fixture-fix-002',
};

writeFileSync('./output/result.json', JSON.stringify(result, null, 2) + '\n');
console.log('OK');
