// Validates every folder in a list file with the orchestrator built in this checkout
// and prints one tab-separated row per folder: path, verdict, errors, warnings, and the
// status of the placeholder rule. Reads folder paths, one per line, from argv[3].
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const orchestratorPath = path.resolve(process.argv[2]);
const listPath = process.argv[3];
const { validateFolder } = await import(pathToFileURL(orchestratorPath).href);
const folders = fs.readFileSync(listPath, 'utf8').split('\n').filter(Boolean);
for (const folder of folders) {
  let row;
  try {
    const report = validateFolder(folder, { strict: true });
    const placeholder = report.entries.find((item) => item.rule === 'PLACEHOLDER_FILLED');
    row = [folder, report.passed ? 'PASS' : 'FAIL', report.summary.errors, report.summary.warnings, placeholder ? placeholder.status : 'none'];
  } catch (error) {
    row = [folder, 'CRASH', 0, 0, String(error.message).split('\n')[0]];
  }
  process.stdout.write(`${row.join('\t')}\n`);
}
