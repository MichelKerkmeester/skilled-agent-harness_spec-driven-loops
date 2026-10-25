// Compares one captured run with the frozen patterns for its label. Every
// non-empty pattern must match, so a partial pass is never reported as a pass.
// The sidecar check file carries the full diagnosis, and a second file,
// <run>.stderr.txt, carries the failing line the fix brief quotes.
const fs = require('fs');

const [mapPath, label, runPath] = process.argv.slice(2);
if (!mapPath || !label || !runPath) {
  console.error('usage: check-run.cjs <scenarios.tsv> <label> <run-file>');
  process.exit(2);
}
const diagPath = runPath + '.check.txt';
const errPath = runPath + '.stderr.txt';
const row = fs.readFileSync(mapPath, 'utf8').split('\n').find((line) => line.startsWith(label + '\t'));
if (!row) {
  fs.writeFileSync(diagPath, 'result:FAIL\nmissing:row\nlast:\n');
  fs.writeFileSync(errPath, 'missing:row\n');
  console.log(`${label}\tFAIL\tmissing-row\t${runPath}`);
  process.exit(0);
}
const [, id, , passA, passB, passC] = row.split('\t');
const patterns = [passA, passB, passC].filter(Boolean);
const text = fs.readFileSync(runPath, 'utf8');
const exitLine = (text.match(/^exit=(\d+)$/m) || [, 'none'])[1];
const missing = exitLine === '142' ? 'exit=142' : patterns.find((pattern) => !new RegExp(pattern, 'm').test(text));
const truncated = /^truncated=yes$/m.test(text) ? 'yes' : 'no';
const lines = text.split('\n').filter((line) => line.trim() !== '' && !/^(exit|truncated)=/.test(line));
const last = lines.length > 0 ? lines[lines.length - 1] : '';
const diag = `result:${missing ? 'FAIL' : 'PASS'}\nmissing:${missing || 'none'}\nexit:${exitLine}\ntruncated:${truncated}\nlast:${last}\n`;
fs.writeFileSync(diagPath, diag);
fs.writeFileSync(errPath, missing ? `missing:${missing}\n` : '');
if (!missing) {
  console.log(`${label}\tPASS\t${id}\t${runPath}`);
} else {
  console.log(`${label}\tFAIL\t${id}\t${runPath}`);
  console.error(`missing:${missing}`);
}
