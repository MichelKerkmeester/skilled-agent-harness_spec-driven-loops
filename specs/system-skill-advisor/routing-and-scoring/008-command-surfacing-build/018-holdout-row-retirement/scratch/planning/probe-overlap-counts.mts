// Run from the repository root:
//   node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs <this file> [row-id]
// Counts, per holdout source type and scored corpus, how many sealed rows share a
// prompt family with that corpus, with every row and without the named row. The
// independence gate fails on a declared overlap whose count falls to 0, so a
// "0 without" next to a declared pair would block the retirement. Prints counts
// and ids only, never a prompt.
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const rowId = process.argv[2] ?? 'suppressed-codex-abstain';
const RT = resolve('.skilled/skills/system-skill-advisor/runtime');
const RA = join(RT, 'scripts/routing-accuracy');
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
const jsonl = (p: string) => readFileSync(p, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
const prompts = (p: string) => jsonl(p).map((r: { prompt?: unknown }) => r.prompt).filter((x: unknown): x is string => typeof x === 'string');

const { HARDER_INTENT_PROMPT_CORPUS } = await import(join(RT, 'tests/scorer/fixtures/harder-intent-prompt-corpus.ts'));
const { INTENT_PROMPT_CORPUS } = await import(join(RT, 'tests/scorer/fixtures/intent-prompt-corpus.ts'));
const delegation = JSON.parse(readFileSync(join(RT, 'tests/parity/fixtures/executor-delegation-cases.json'), 'utf8')).cases as { prompt: string }[];

const corpora: Record<string, Set<string>> = {
  labeled: new Set(prompts(join(RA, 'labeled-prompts.jsonl')).map(norm)),
  ambiguity: new Set(prompts(join(RA, 'ambiguity-prompts.jsonl')).map(norm)),
  intent: new Set(INTENT_PROMPT_CORPUS.map((i: { prompt: string }) => norm(i.prompt))),
  harder: new Set(HARDER_INTENT_PROMPT_CORPUS.map((i: { prompt: string }) => norm(i.prompt))),
  golden: new Set(prompts(join(RT, 'scripts/fixtures/gate2-golden-prompts.jsonl')).map(norm)),
  regression: new Set(prompts(join(RT, 'scripts/fixtures/skill-advisor-regression-cases.jsonl')).map(norm)),
  delegation: new Set(delegation.map((c) => norm(c.prompt))),
};

const holdout = jsonl(join(RA, 'holdout-prompts.jsonl')) as { id: string; prompt: string; source_type: string }[];
const counts = new Map<string, { all: number; without: number }>();
const targetIn: string[] = [];
for (const row of holdout) {
  const family = norm(row.prompt);
  for (const [corpus, set] of Object.entries(corpora)) {
    if (!set.has(family)) continue;
    const key = `${row.source_type}|${corpus}`;
    const entry = counts.get(key) ?? { all: 0, without: 0 };
    entry.all += 1;
    if (row.id !== rowId) entry.without += 1;
    counts.set(key, entry);
    if (row.id === rowId) targetIn.push(corpus);
  }
}
console.log(`${rowId} shares its prompt with: ${JSON.stringify(targetIn)}`);
for (const [key, { all, without }] of [...counts.entries()].sort()) console.log(`${key}: all ${all}, without ${without}`);
