// Reads dispatch-units.json and confirms that every edit unit's OLD text, taken
// from its instruction, occurs exactly once in its file, applying the earlier
// units of the same file first. Run from the repository root.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const units = JSON.parse(fs.readFileSync(path.join(HERE, 'dispatch-units.json'), 'utf8'));
const state = new Map();
let bad = 0;
let edits = 0;
for (const unit of units) {
  if (unit.kind !== 'edit') continue;
  edits += 1;
  const match = /<<<OLD\n([\s\S]*?)OLD>>> with <<<NEW\n([\s\S]*?)NEW>>>$/.exec(unit.instruction);
  const file = unit.files[0];
  const text = state.get(file) ?? fs.readFileSync(file, 'utf8');
  const count = match ? text.split(match[1]).length - 1 : -1;
  if (count !== 1) {
    bad += 1;
    console.log(`BAD ${unit.task} ${file} occurrences=${count}`);
  }
  state.set(file, match ? text.replace(match[1], () => match[2]) : text);
}
console.log(`units=${units.length} edits=${edits} bad=${bad}`);
process.exitCode = bad === 0 ? 0 : 1;
