// Run from the repository root with AI_SESSION_CHILD unset: node <this file>
// Scores the command corpus in-process the way a harness would and prints every
// environment variable the call left different, then the four floor lines.
// Writes no baseline.
import { resolve } from 'node:path';
const { scoreCommandCorpus } = await import(resolve('.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs'));
const before = { ...process.env };
const baseline = await scoreCommandCorpus();
const after = { ...process.env };
const names = [...new Set([...Object.keys(before), ...Object.keys(after)])].filter((name) => before[name] !== after[name]).sort();
console.log(`variables left changed: ${JSON.stringify(names)}`);
console.log(JSON.stringify(baseline.metrics.typed_recall_at_1));
console.log(JSON.stringify(baseline.metrics.false_offer));
console.log(JSON.stringify(baseline.attachedMetrics.typed));
console.log(JSON.stringify(baseline.attachedMetrics.plain.tune));
