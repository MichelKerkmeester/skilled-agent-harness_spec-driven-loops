// Scores the alignment run's routing probes with the skill scorer of two checkouts,
// each against its own tree, and prints the top skill of each. A probe whose top
// skill is the same on both trees did not move with the branch. The scorer is used
// rather than the recommend handler because a checkout made with `git archive` has
// no generated skill graph state, which the handler needs and the scorer does not.
// The probe prompts were written by the alignment run, not taken from any corpus.
// Usage: node compare-probes.mjs <probes.json> <head checkout> <base checkout>
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const [probesPath, headRoot, baseRoot] = process.argv.slice(2);
const rows = JSON.parse(readFileSync(probesPath, 'utf8')).rows;
const FUSION = '.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/fusion.js';

async function topOf(root, prompt) {
  const { scoreAdvisorPrompt } = await import(join(root, FUSION));
  const top = scoreAdvisorPrompt(prompt, { workspaceRoot: root }).topSkill;
  return typeof top === 'string' ? top : top?.skill ?? 'none';
}

for (const row of rows) {
  const want = `${row.expect}${row.expectMode ? `/${row.expectMode}` : ''}`;
  const head = await topOf(headRoot, row.prompt);
  const base = await topOf(baseRoot, row.prompt);
  console.log(`${row.id} ${row.status} want ${want} head ${head} base ${base} ${head === base ? 'same' : 'moved'}`);
}
