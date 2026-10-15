// Per-prompt routing snapshot under the pinned force-local regime.
// Mirrors capture-scorer-eval-baseline.mjs (same env, same fixed scoring instant,
// same alias-aware top-1 check) but records every row, so a later run can name
// exactly which rows moved from pass to fail.
//
// Usage: node per-prompt-snapshot.mjs <out.json> [--labeled PATH] [--holdout PATH] [--ambiguity PATH]

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const REPO = resolve(new URL('.', import.meta.url).pathname, '../../../..');
const RUNTIME = join(REPO, '.skilled/skills/system-skill-advisor/runtime');
const CORPORA = join(RUNTIME, 'scripts/routing-accuracy');
const DIST = join(RUNTIME, 'dist/runtime');

const args = process.argv.slice(2);
const out = args[0];
if (!out) {
  console.error('usage: node per-prompt-snapshot.mjs <out.json> [--labeled P] [--holdout P] [--ambiguity P]');
  process.exit(2);
}
function flag(name, fallback) {
  const i = args.indexOf(name);
  return i >= 0 ? resolve(args[i + 1]) : fallback;
}
const SOURCES = {
  labeled: flag('--labeled', join(CORPORA, 'labeled-prompts.jsonl')),
  holdout: flag('--holdout', join(CORPORA, 'holdout-prompts.jsonl')),
  ambiguity: flag('--ambiguity', join(CORPORA, 'ambiguity-prompts.jsonl')),
};

process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-per-prompt-'));
process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
process.env.PYTHONDONTWRITEBYTECODE = '1';
process.env.VITEST = 'true';
delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;

const CAPTURED_AT = new Date().toISOString().slice(0, 10);
const SCORING_INSTANT = Date.parse(`${CAPTURED_AT}T00:00:00Z`);
const RealDate = Date;
globalThis.Date = class extends RealDate {
  constructor(...a) {
    if (a.length === 0) super(SCORING_INSTANT);
    else super(...a);
  }
  static now() {
    return SCORING_INSTANT;
  }
};

const { scoreAdvisorPrompt } = await import(join(DIST, 'lib/scorer/fusion.js'));
const { mergedSkillForAlias, skillMatchesAlias } = await import(join(DIST, 'lib/scorer/aliases.js'));
const { findAdvisorWorkspaceRoot } = await import(join(DIST, 'lib/utils/workspace-root.js'));
const WORKSPACE_ROOT = findAdvisorWorkspaceRoot(CORPORA, { maxDepth: 14, sentinel: '.skilled/skills/system-spec-kit/SKILL.md' });

function readJsonl(path) {
  return readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map((l) => JSON.parse(l));
}
function isTop1Correct(top, goldRaw) {
  const gold = goldRaw === 'none' ? null : goldRaw;
  const expected = gold === null ? null : mergedSkillForAlias(gold);
  const actual = top === null ? null : mergedSkillForAlias(top);
  return actual === expected || (actual !== null && expected !== null && skillMatchesAlias(actual, expected));
}

const head = spawnSync('git', ['rev-parse', '--short', 'HEAD'], {
  cwd: REPO,
  encoding: 'utf8',
  env: { ...process.env, GIT_CONFIG_COUNT: '1', GIT_CONFIG_KEY_0: 'core.fsmonitor', GIT_CONFIG_VALUE_0: 'false' },
}).stdout.trim();

const snapshot = { head, capturedAt: CAPTURED_AT, sources: {}, totals: {}, rows: {} };
for (const [name, path] of Object.entries(SOURCES)) {
  snapshot.sources[name] = path.startsWith(REPO) ? path.slice(REPO.length + 1) : path;
  const rows = readJsonl(path);
  let pass = 0;
  snapshot.rows[name] = rows.map((row, index) => {
    const result = scoreAdvisorPrompt(row.prompt, { workspaceRoot: WORKSPACE_ROOT });
    const top = result.topSkill;
    const ok = isTop1Correct(top, row.skill_top_1);
    if (ok) pass += 1;
    return { index, id: row.id ?? null, prompt: row.prompt, gold: row.skill_top_1, top, pass: ok };
  });
  snapshot.totals[name] = { pass, total: rows.length };
}

writeFileSync(out, JSON.stringify(snapshot, null, 1) + '\n', 'utf8');
console.log(JSON.stringify({ head: snapshot.head, totals: snapshot.totals }));
