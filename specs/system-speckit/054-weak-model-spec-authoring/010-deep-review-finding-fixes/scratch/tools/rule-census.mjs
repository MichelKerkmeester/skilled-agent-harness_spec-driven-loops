// Validates every folder in a list file with the orchestrator built in this checkout and
// prints one tab-separated row per folder: path, then one rule=status cell per rule named in
// SPECKIT_RULES, in that order. Reads folder paths, one per line, from argv[3]. A rule the
// run did not report prints as rule=none, and a folder that throws prints CRASH.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const orchestratorPath = path.resolve(process.argv[2]);
const listPath = process.argv[3];
const rules = String(process.env.SPECKIT_RULES || '').split(',').map((rule) => rule.trim()).filter(Boolean);
if (rules.length === 0) {
  process.stderr.write('SPECKIT_RULES must name at least one rule\n');
  process.exit(2);
}
const { validateFolder } = await import(pathToFileURL(orchestratorPath).href);
const folders = fs.readFileSync(listPath, 'utf8').split('\n').filter(Boolean);
for (const folder of folders) {
  let cells;
  try {
    const report = validateFolder(folder, { strict: true });
    cells = rules.map((rule) => {
      const found = report.entries.filter((item) => item.rule === rule);
      return `${rule}=${found.length ? found.map((item) => item.status).join('+') : 'none'}`;
    });
  } catch (error) {
    cells = [`CRASH=${String(error.message).split('\n')[0]}`];
  }
  process.stdout.write(`${[folder, ...cells].join('\t')}\n`);
}
