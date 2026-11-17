// Run from the repository root:
//   node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs <this file>
// Calls the holdout builder in memory, never with --write, and compares the rows
// it would produce today with the committed sealed file. Prints ids, counts and
// gold labels only, never a prompt.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const RA = resolve('.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy');
const { buildHoldout } = await import(resolve(RA, 'build-holdout.mjs'));
const { rows, stats } = await buildHoldout();
const committed = readFileSync(resolve(RA, 'holdout-prompts.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));

const built = new Map(rows.map((r) => [r.id, r.skill_top_1]));
const sealed = new Map(committed.map((r) => [r.id, r.skill_top_1]));
const onlyBuilt = [...built.keys()].filter((id) => !sealed.has(id));
const onlySealed = [...sealed.keys()].filter((id) => !built.has(id));
const goldDiffers = [...sealed.keys()].filter((id) => built.has(id) && built.get(id) !== sealed.get(id));

console.log(`builder rows today: ${rows.length}, committed rows: ${committed.length}`);
console.log(`builder stats: ${JSON.stringify({ rawPool: stats.rawPool, intraPoolDupes: stats.intraPoolDupes, trainingCollisions: stats.trainingCollisions })}`);
console.log(`only in the builder output: ${onlyBuilt.length} ${JSON.stringify(onlyBuilt)}`);
console.log(`only in the committed file: ${onlySealed.length} ${JSON.stringify(onlySealed)}`);
console.log(`same id, different gold: ${goldDiffers.length} ${JSON.stringify(goldDiffers.map((id) => `${id}: committed ${sealed.get(id)}, builder ${built.get(id)}`))}`);
console.log(`suppressed-codex-abstain in the builder output: ${built.has('suppressed-codex-abstain')}`);
