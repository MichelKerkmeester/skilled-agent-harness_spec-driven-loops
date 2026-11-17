// Run from the repository root: node <this file>
// Compares today's no-edit pattern with the widened one over every routing corpus,
// skipping each holdout row before its prompt is read, and prints only row ids.
// holdout-prompts.jsonl is never opened.
import { readFileSync } from 'node:fs';
const RAD = '.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy';
const TODAY = /\b(no edits?|without making changes|do not (change|edit|modify|touch)|read-only only|no edits yet|only; do not|just show|just list)\b/;
const PROPOSED = /\b(no edits?|no changes|without making changes|(?:do not|don't) (change|edit|modify|touch)|read-only only|no edits yet|only; do not|just show|just list)\b/;
const normalised = (text) => text.toLowerCase().replace(/[‘’]/g, "'");
for (const file of ['command-prompts.jsonl', 'labeled-prompts.jsonl', 'ambiguity-prompts.jsonl', 'doctor-prompts.jsonl']) {
  let scanned = 0; let skippedHoldout = 0; const changed = []; let matchedToday = 0;
  for (const line of readFileSync(`${RAD}/${file}`, 'utf8').split('\n')) {
    if (line.trim() === '') continue;
    // The split is read from the raw line, so a holdout row is never parsed.
    if (/"split"\s*:\s*"holdout"/.test(line)) { skippedHoldout += 1; continue; }
    const row = JSON.parse(line);
    if (row.split === 'holdout') throw new Error(`unparsed holdout split shape in ${file}`);
    scanned += 1;
    const before = TODAY.test(row.prompt.toLowerCase());
    const after = PROPOSED.test(normalised(row.prompt));
    if (before) matchedToday += 1;
    if (before !== after) changed.push(row.id);
  }
  console.log(`${file}: scanned ${scanned}, holdout skipped ${skippedHoldout}, matched today ${matchedToday}, newly matched ${changed.length}${changed.length ? ` ${JSON.stringify(changed)}` : ''}`);
}
