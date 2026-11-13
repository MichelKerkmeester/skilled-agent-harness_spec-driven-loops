// Run from the repository root: node <this file> [row-id] [json-file ...]
// Finds where one sealed holdout row's text sits inside JSON files and prints
// only the JSON path, the match kind and counts. It never prints a string value
// or the row's prompt. Text is normalised the way the holdout builder does it:
// lowercase, every non-alphanumeric character to a space, runs of space collapsed.
// A hit is "full" when the whole normalised prompt is inside the value, or
// "run8" when any run of eight consecutive prompt words is.
import { readFileSync } from 'node:fs';

const HOLDOUT = '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl';
const rowId = process.argv[2] ?? 'suppressed-codex-abstain';
const files = process.argv.length > 3
  ? process.argv.slice(3)
  : ['.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json'];

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();

const row = readFileSync(HOLDOUT, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l)).find((r) => r.id === rowId);
if (!row) {
  console.log(`row ${rowId}: not in the holdout file`);
  process.exit(1);
}
const full = norm(row.prompt);
const words = full.split(' ');
const runs = [];
for (let i = 0; i + 8 <= words.length; i += 1) runs.push(words.slice(i, i + 8).join(' '));
console.log(`row ${rowId}: prompt words ${words.length}, eight-word runs ${runs.length}`);

function walk(value, path, hits) {
  if (typeof value === 'string') {
    const n = norm(value);
    if (n.includes(full)) hits.push({ path, kind: 'full', valueWords: n.split(' ').length });
    else {
      const matched = runs.filter((r) => n.includes(r)).length;
      if (matched > 0) hits.push({ path, kind: 'run8', runsMatched: matched, valueWords: n.split(' ').length });
    }
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`, hits));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walk(v, `${path}[${JSON.stringify(k)}]`, hits);
  }
}

let unparsed = 0;
for (const file of files) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    unparsed += 1;
    continue;
  }
  const hits = [];
  walk(parsed, '', hits);
  console.log(`${file}: hits ${hits.length}`);
  for (const h of hits) console.log(`  ${JSON.stringify(h)}`);
}
console.log(`files not parsed as JSON: ${unparsed}`);
