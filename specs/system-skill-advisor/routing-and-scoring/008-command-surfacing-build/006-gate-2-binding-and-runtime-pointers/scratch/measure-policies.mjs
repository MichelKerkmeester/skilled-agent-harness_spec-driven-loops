// Prints the policy rollup per command, the run records that are not read-only and the /doctor:git records.
import { readFileSync } from 'node:fs';
const g = JSON.parse(readFileSync('.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json', 'utf8'));
const rank = { run: 0, start: 1, ask: 2 };
const strictest = {};
for (const r of g.commandPolicies) if (!(r.command in strictest) || rank[r.policy] > rank[strictest[r.command]]) strictest[r.command] = r.policy;
const counts = {};
for (const p of Object.values(strictest)) counts[p] = (counts[p] || 0) + 1;
console.log('commands', Object.keys(strictest).length, JSON.stringify(counts));
const run = g.commandPolicies.filter((r) => r.policy === 'run');
console.log('run records', run.length, 'non-read-only run:', JSON.stringify(run.filter((r) => r.mutating !== 'read-only').map((r) => `${r.command} ${r.route || ''} ${r.mutating}`)));
for (const r of g.commandPolicies) if (r.command === '/doctor:git') console.log(JSON.stringify(r));
console.log('entries with mutating', g.entries.filter((e) => typeof e.mutating === 'string').length, 'of', g.entries.length);
console.log('policy records with mutating', g.commandPolicies.filter((r) => typeof r.mutating === 'string').length, 'of', g.commandPolicies.length);
