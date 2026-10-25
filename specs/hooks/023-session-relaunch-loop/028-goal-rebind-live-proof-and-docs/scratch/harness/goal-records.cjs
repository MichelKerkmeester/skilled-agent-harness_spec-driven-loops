'use strict';
// Lists the goal records a sandbox holds, one line each and never the goal text, oldest first.
// Usage: goal-records.cjs <goal-state-dir>
const fs = require('node:fs');
const path = require('node:path');

const dir = process.argv[2];
const rows = [];
for (const name of fs.existsSync(dir) ? fs.readdirSync(dir) : []) {
  if (!name.endsWith('.json')) continue;
  const record = JSON.parse(fs.readFileSync(path.join(dir, name), 'utf8'));
  rows.push({
    at: record.createdAtMs ?? 0,
    line: `record=${name.slice(0, 12)} goalId=${record.goalId} runtime=${record.runtime} status=${record.status} packetPath=${record.packetPath || '-'} createdAt=${new Date(record.createdAtMs).toISOString()}`,
  });
}
rows.sort((a, b) => a.at - b.at);
console.log(`goal records: ${rows.length}`);
rows.forEach((row) => console.log(row.line));
