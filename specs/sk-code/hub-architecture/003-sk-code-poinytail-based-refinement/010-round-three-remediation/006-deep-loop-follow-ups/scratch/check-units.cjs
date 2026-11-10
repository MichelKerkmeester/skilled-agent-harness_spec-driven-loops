'use strict';
// Applies dispatch-units.json in order to in-memory copies of the target files and
// proves each OLD text occurs exactly once at the moment its unit runs. With
// --apply-root <dir>, it also writes the results under that directory.
const fs = require('node:fs');
const path = require('node:path');

const repoRoot = process.cwd();
const units = JSON.parse(fs.readFileSync(path.join(__dirname, 'dispatch-units.json'), 'utf8'));
const applyIndex = process.argv.indexOf('--apply-root');
const applyRoot = applyIndex > 0 ? path.resolve(process.argv[applyIndex + 1]) : null;
const mapPath = (file) => {
  if (!applyRoot) return path.join(repoRoot, file);
  const marker = '.skilled/skills/system-deep-loop/';
  return file.startsWith(marker) ? path.join(applyRoot, file.slice(marker.length)) : null;
};

const contents = new Map();
let failures = 0;
for (const unit of units) {
  const file = unit.files[0];
  if (unit.kind === 'edit') {
    const match = unit.instruction.match(/<<<OLD\n([\s\S]*?)OLD>>> with <<<NEW\n([\s\S]*?)NEW>>>$/);
    if (!match) { console.log(`${unit.task} FAIL cannot parse instruction`); failures += 1; continue; }
    const [, oldText, newText] = match;
    if (!contents.has(file)) contents.set(file, fs.readFileSync(path.join(repoRoot, file), 'utf8'));
    const current = contents.get(file);
    const count = current.split(oldText).length - 1;
    if (count !== 1) { console.log(`${unit.task} FAIL old text occurs ${count} times in ${file}`); failures += 1; continue; }
    contents.set(file, current.replace(oldText, () => newText));
    console.log(`${unit.task} OK old text occurs once in ${file}`);
  } else if (unit.kind === 'create') {
    const exists = fs.existsSync(path.join(repoRoot, file));
    if (exists) { console.log(`${unit.task} FAIL ${file} already exists`); failures += 1; continue; }
    const source = unit.instruction.replace(/^Create \S+ with exactly the content of /, '');
    contents.set(file, fs.readFileSync(path.join(repoRoot, source), 'utf8'));
    console.log(`${unit.task} OK ${file} is new`);
  }
}
if (applyRoot) {
  for (const [file, text] of contents) {
    const target = mapPath(file);
    if (!target) continue;
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, text);
    console.log(`applied ${file} -> ${path.relative(repoRoot, target)}`);
  }
}
console.log(failures === 0 ? `RESULT: ${units.length} units, all OLD texts unique` : `RESULT: ${failures} failure(s)`);
process.exit(failures === 0 ? 0 : 1);
