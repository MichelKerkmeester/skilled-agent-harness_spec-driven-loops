// Compares one captured run with the frozen patterns for its label. Every
// non-empty pattern must match, so a partial pass is never reported as a pass.
const fs = require('fs');

const [mapPath, label, runPath] = process.argv.slice(2);
if (!mapPath || !label || !runPath) {
  console.error('usage: check-run.cjs <scenarios.tsv> <label> <run-file>');
  process.exit(2);
}
const row = fs.readFileSync(mapPath, 'utf8').split('\n').find((line) => line.startsWith(label + '\t'));
if (!row) {
  console.log(`${label}\tFAIL\tmissing-row\t${runPath}`);
  process.exit(0);
}
const [, id, , passA, passB, passC] = row.split('\t');
const patterns = [passA, passB, passC].filter(Boolean);
const text = fs.readFileSync(runPath, 'utf8');
const missing = patterns.find((pattern) => !new RegExp(pattern, 'm').test(text));
if (!missing) {
  console.log(`${label}\tPASS\t${id}\t${runPath}`);
} else {
  console.log(`${label}\tFAIL\t${id}\t${runPath}`);
  console.error(`missing:${missing}`);
}
