// Run from the repository root after the advisor build: node <this file> [row-id]
// Scores every sealed holdout row the way capture-scorer-eval-baseline.mjs does
// (empty database folder, semantic lane off, forced local, VITEST set, the
// recorded scoring date) and prints the holdout total, the correct count and
// one row's id, gold, top skill and verdict. It never prints a prompt.
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const rowId = process.argv[2] ?? 'suppressed-codex-abstain';
const RA = resolve('.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy');
const DIST = resolve('.skilled/skills/system-skill-advisor/runtime/dist/runtime');

const dbDir = mkdtempSync(join(tmpdir(), 'holdout-row-verdict-'));
process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = dbDir;
process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
process.env.PYTHONDONTWRITEBYTECODE = '1';
process.env.VITEST = 'true';
delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;
delete process.env.SPECKIT_PRIVATE_SKILL_ROOTS;

const capturedAt = JSON.parse(readFileSync(join(RA, 'scorer-eval-baseline.json'), 'utf8')).capturedAt;
const instant = Date.parse(`${capturedAt}T00:00:00Z`);
const RealDate = Date;
globalThis.Date = class extends RealDate {
  constructor(...args) {
    if (args.length === 0) super(instant);
    else super(...args);
  }

  static now() {
    return instant;
  }
};

try {
  const { scoreAdvisorPrompt } = await import(join(DIST, 'lib/scorer/fusion.js'));
  const { mergedSkillForAlias, skillMatchesAlias } = await import(join(DIST, 'lib/scorer/aliases.js'));
  const { findAdvisorWorkspaceRoot } = await import(join(DIST, 'lib/utils/workspace-root.js'));
  const root = findAdvisorWorkspaceRoot(RA, { maxDepth: 14, sentinel: '.skilled/skills/system-spec-kit/SKILL.md' });
  const correctFor = (top, goldRaw) => {
    const gold = goldRaw === 'none' ? null : goldRaw;
    const expected = gold === null ? null : mergedSkillForAlias(gold);
    const actual = top === null ? null : mergedSkillForAlias(top);
    return actual === expected || (actual !== null && expected !== null && skillMatchesAlias(actual, expected));
  };
  const rows = readFileSync(join(RA, 'holdout-prompts.jsonl'), 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  let correct = 0;
  let target = null;
  for (const row of rows) {
    const top = scoreAdvisorPrompt(row.prompt, { workspaceRoot: root }).topSkill;
    const ok = correctFor(top, row.skill_top_1);
    if (ok) correct += 1;
    if (row.id === rowId) target = { id: row.id, gold: row.skill_top_1, got: top ?? 'none', correct: ok };
  }
  console.log(`scoring date ${capturedAt}`);
  console.log(`holdout total ${rows.length}, correct ${correct}`);
  console.log(`row ${JSON.stringify(target ?? { id: rowId, present: false })}`);
} finally {
  globalThis.Date = RealDate;
  rmSync(dbDir, { recursive: true, force: true });
}
