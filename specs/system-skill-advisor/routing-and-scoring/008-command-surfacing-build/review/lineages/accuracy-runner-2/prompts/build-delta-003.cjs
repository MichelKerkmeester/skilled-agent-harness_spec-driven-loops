const fs = require('node:fs');
const path = require('node:path');
const dir = path.resolve(__dirname, '..');
const record = JSON.parse(fs.readFileSync(path.join(dir, 'prompts', 'iter-003.record.json'), 'utf8'));
const out = [JSON.stringify(record)];
out.push(JSON.stringify({ type: 'finding', id: 'iter3-P2-backfill-log-code-execution', severity: 'P2', cluster: 'security', file: '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:333', title: '--backfill executes the hook and the advisor CLI from the directory a run-log line names', iteration: 3 }));
out.push(JSON.stringify({ type: 'classification', detail: 'One new P2 trust-boundary finding; credential, arena and holdout invariants hold.', iteration: 3 }));
const checks = [
  ['spec_code', 'partial', 'Security rows checked; per-runtime proof open with phase 007.'],
  ['checklist_evidence', 'partial', 'No parent checklist; phase 007 open.'],
  ['skill_agent', 'notApplicable', 'No owner agent.'],
  ['agent_cross_runtime', 'pass', 'Credential boundary precedes argv; proof still phase 007.'],
  ['feature_catalog_code', 'pending', 'Iteration 4.'],
  ['playbook_capability', 'pending', 'Iteration 4.'],
];
for (const [protocol, status, detail] of checks) out.push(JSON.stringify({ type: 'traceability_check', protocol, status, iteration: 3, detail }));
const ruled = [
  ['Measured turn inheriting SSH, cloud or npm credentials', 'Allowlist verified by the guard test.'],
  ['Arena carrying a dotenv file', 'holdsDotenv plus the name filter at every depth; symlinks copy as links.'],
  ['Holdout row reaching a score or a published map', 'Sentinel before loadSession; publishRow gates every map; 0 of 44 ids in the baseline.'],
  ["Restore discarding another worker's edit", 'Inherited paths are skipped; leftovers fail the run.'],
  ['Cost script measuring a named holdout row', 'Refused before any spawn or print.'],
];
for (const [direction, reason] of ruled) out.push(JSON.stringify({ type: 'ruled_out', direction, reason, iteration: 3 }));
fs.writeFileSync(path.join(dir, 'deltas', 'iter-003.jsonl'), out.join('\n') + '\n');
console.log('delta rows', out.length);
