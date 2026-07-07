// ───────────────────────────────────────────────────────────────
// MODULE: Scorer Eval Baseline Capture
// ───────────────────────────────────────────────────────────────
//
// Captures the current scorer accuracy across the full corpus, the independent
// holdout, the frozen ambiguity slice, and the named intent buckets, under the
// reproducible filesystem projection (empty MK_SKILL_ADVISOR_DB_DIR → SQLite
// loader returns null → projection built purely from committed graph metadata).
// The result is the ratchet baseline: the ratchet gate re-scores live under the
// same env and holds every metric to it, so any scoring or metadata change that
// moves a number forces a conscious re-capture rather than drifting silently.
//
// The *Sha256 fields pin the baseline to the exact fixtures it was captured
// against; a fixture edit changes a hash and forces re-baselining.
//
// Usage:
//   node capture-scorer-eval-baseline.mjs            # print JSON to stdout
//   node capture-scorer-eval-baseline.mjs --write     # also write the baseline

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const CORPUS_JSONL = resolve(HERE, 'labeled-prompts.jsonl');
const HOLDOUT_JSONL = resolve(HERE, 'holdout-prompts.jsonl');
const AMBIGUITY_JSONL = resolve(HERE, 'ambiguity-prompts.jsonl');
const DELEGATION_JSON = resolve(HERE, '../../tests/parity/fixtures/executor-delegation-cases.json');
const OUTPUT_JSON = resolve(HERE, 'scorer-eval-baseline.json');
const DIST = resolve(HERE, '../../dist/mcp_server');

process.env.MK_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-eval-baseline-'));
process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
process.env.PYTHONDONTWRITEBYTECODE = '1';
// Match the test-harness regime: the semantic-shadow lane substitutes
// deterministic fixture vectors under the harness flag (real embeddings are not
// reproducible in CI), so every scorer gate runs this way. The baseline must be
// captured under the same regime the ratchet re-scores it in.
process.env.VITEST = 'true';
delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;

const { scoreAdvisorPrompt } = await import(join(DIST, 'lib/scorer/fusion.js'));
const { mergedSkillForAlias, skillMatchesAlias } = await import(join(DIST, 'lib/scorer/aliases.js'));
const { findAdvisorWorkspaceRoot } = await import(join(DIST, 'lib/utils/workspace-root.js'));

const SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';
const WORKSPACE_ROOT = findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: SENTINEL });

function sha256File(path) {
  return `sha256:${createHash('sha256').update(readFileSync(path)).digest('hex')}`;
}

function readJsonl(path) {
  return readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
}

function topSkill(prompt) {
  return scoreAdvisorPrompt(prompt, { workspaceRoot: WORKSPACE_ROOT }).topSkill;
}

// Alias-aware top-1 match: corpus/holdout labels may use superseded skill ids or
// folded deep-loop mode ids, canonicalized on both sides before comparing. A
// both-null result is a correct abstain.
function isTop1Correct(top, goldRaw) {
  const gold = goldRaw === 'none' ? null : goldRaw;
  const expected = gold === null ? null : mergedSkillForAlias(gold);
  const actual = top === null ? null : mergedSkillForAlias(top);
  return actual === expected
    || (actual !== null && expected !== null && skillMatchesAlias(actual, expected));
}

function accuracy(correct, total) {
  return total > 0 ? Number((correct / total).toFixed(4)) : 0;
}

function scoreSet(rows) {
  let correct = 0;
  for (const row of rows) {
    if (isTop1Correct(topSkill(row.prompt), row.skill_top_1)) correct += 1;
  }
  return { correct, total: rows.length, accuracy: accuracy(correct, rows.length) };
}

const corpus = readJsonl(CORPUS_JSONL);
let unknown = 0;
let goldNoneFalseFire = 0;
let fullCorrect = 0;
for (const row of corpus) {
  const top = topSkill(row.prompt);
  if (top === null) unknown += 1;
  if (row.skill_top_1 === 'none' && top !== null) goldNoneFalseFire += 1;
  if (isTop1Correct(top, row.skill_top_1)) fullCorrect += 1;
}

const holdout = scoreSet(readJsonl(HOLDOUT_JSONL));

const ambiguityRows = readJsonl(AMBIGUITY_JSONL);
const ambiguity = scoreSet(ambiguityRows);
const tau = ambiguityRows.length > 0 ? ambiguityRows[0].tau : null;

const reviewRows = corpus.filter((row) => row.bucket === 'true_read_only');
const memorySaveRows = corpus.filter((row) => row.bucket === 'memory_save_resume');
const review = scoreSet(reviewRows);
const memorySave = scoreSet(memorySaveRows);

// Delegation uses strict equality: the targets are top-level skill ids with no
// alias folding, and 'none' is a correct abstain.
const delegationCases = JSON.parse(readFileSync(DELEGATION_JSON, 'utf8')).cases;
let delegationCorrect = 0;
for (const testCase of delegationCases) {
  const expected = testCase.expectedTop === 'none' ? null : testCase.expectedTop;
  if (topSkill(testCase.prompt) === expected) delegationCorrect += 1;
}

const headSha = (() => {
  const result = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: WORKSPACE_ROOT, encoding: 'utf8' });
  return result.status === 0 ? result.stdout.trim() : 'unknown';
})();

const baseline = {
  schemaVersion: 1,
  capturedAt: '2026-07-07',
  capturedAtSha: headSha,
  corpusSha256: sha256File(CORPUS_JSONL),
  holdoutSha256: sha256File(HOLDOUT_JSONL),
  ambiguitySha256: sha256File(AMBIGUITY_JSONL),
  env: {
    SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
    MK_SKILL_ADVISOR_DB_DIR: '<empty-dir>',
    projectionSource: 'filesystem',
  },
  metrics: {
    full_corpus_top1: { correct: fullCorrect, total: corpus.length, accuracy: accuracy(fullCorrect, corpus.length) },
    unknown_count: { value: unknown },
    gold_none_false_fire: { value: goldNoneFalseFire },
    holdout_top1: holdout,
    ambiguity_top1: { correct: ambiguity.correct, total: ambiguity.total, accuracy: ambiguity.accuracy, tau },
    buckets: {
      review: review,
      memory_save: memorySave,
      delegation: { correct: delegationCorrect, total: delegationCases.length, accuracy: accuracy(delegationCorrect, delegationCases.length) },
    },
  },
};

const serialized = JSON.stringify(baseline, null, 2) + '\n';
if (process.argv.includes('--write')) {
  writeFileSync(OUTPUT_JSON, serialized, 'utf8');
  console.log(`wrote baseline -> ${OUTPUT_JSON}`);
}
console.log(serialized);
