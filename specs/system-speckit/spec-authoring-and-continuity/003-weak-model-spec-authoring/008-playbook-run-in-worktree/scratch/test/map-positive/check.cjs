// Compares one captured run with the two frozen patterns for its label. Both
// patterns must match, so a partial pass is never reported as a pass.
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
const [, id, , passA, passB] = row.split('\t');
const text = fs.readFileSync(runPath, 'utf8');
const okA = new RegExp(passA, 'm').test(text);
const okB = passB ? new RegExp(passB, 'm').test(text) : true;
if (okA && okB) {
  console.log(`${label}\tPASS\t${id}\t${runPath}`);
} else {
  const missing = okA ? passB : passA;
  console.log(`${label}\tFAIL\t${id}\t${runPath}`);
  console.error(`missing:${missing}`);
}
