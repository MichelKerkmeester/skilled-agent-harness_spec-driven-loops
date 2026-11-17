// Build the iteration delta from the saved record, so the delta's first line is the
// exact record the gateway accepts rather than a second hand-copied rendering.
const fs = require('node:fs');

const [recordPath, deltaPath] = process.argv.slice(2);
const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
const rows = [JSON.stringify(record)];
for (const finding of record.findingDetails) {
  rows.push(JSON.stringify({
    type: 'finding',
    id: finding.id,
    severity: finding.severity,
    title: finding.title,
    file: finding.file,
    iteration: record.iteration,
  }));
}
rows.push(JSON.stringify({
  type: 'ruled_out',
  direction: 'A re: selector that includes main is falsely reported',
  reason: 'Plan D9 freezes it and the case at hook-wiring-check.test.cjs:273-280 pins it.',
  iteration: record.iteration,
}));
rows.push(JSON.stringify({
  type: 'ruled_out',
  direction: 'A trailing-comment type or command line is now accepted',
  reason: 'The entry regex anchors on the closing quote; only match gained comment tolerance.',
  iteration: record.iteration,
}));
fs.writeFileSync(deltaPath, rows.join('\n') + '\n');
process.stdout.write(`delta rows: ${rows.length}\n`);
