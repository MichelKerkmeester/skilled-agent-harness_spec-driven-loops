// ───────────────────────────────────────────────────────────────────
// MODULE: SCORER EVAL BASELINE CAPTURE
// ───────────────────────────────────────────────────────────────────
//
// Captures the current scorer accuracy across the full corpus, the independent
// holdout, the frozen ambiguity slice, and the named intent buckets, under the
// reproducible filesystem projection (empty SYSTEM_SKILL_ADVISOR_DB_DIR → SQLite
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
//   SPECKIT_EVAL_BASELINE_SCORING_DATE=YYYY-MM-DD node capture-scorer-eval-baseline.mjs --write
//                                                     # move the pinned scoring date

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { rejectUnknownOptions } from './reject-unknown-options.mjs';

rejectUnknownOptions(import.meta.url, ['--write']);

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const HERE = dirname(fileURLToPath(import.meta.url));
const CORPUS_JSONL = resolve(HERE, 'labeled-prompts.jsonl');
const HOLDOUT_JSONL = resolve(HERE, 'holdout-prompts.jsonl');
const AMBIGUITY_JSONL = resolve(HERE, 'ambiguity-prompts.jsonl');
const DELEGATION_JSON = resolve(HERE, '../../tests/parity/fixtures/executor-delegation-cases.json');
const OUTPUT_JSON = resolve(HERE, 'scorer-eval-baseline.json');
const DIST = resolve(HERE, '../../dist/runtime');

// ───────────────────────────────────────────────────────────────────
// 3. RUNTIME SETUP
// ───────────────────────────────────────────────────────────────────

process.env.SYSTEM_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-eval-baseline-'));
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
// Private `local-*` skills linked in through this variable live outside the
// checkout, so a baseline measured on a clean checkout must not see them.
delete process.env.SPECKIT_PRIVATE_SKILL_ROOTS;

// The derived lane halves each skill's score every 90 days of age, measured from
// its derived.generated_at to the scoring clock (floored at 0.1), so scores move
// with the calendar. The scoring date is therefore pinned and recorded, never
// read from the wall clock: a recapture on any day replays the recorded date and
// reproduces the same numbers. Moving the pin is a deliberate act, made by
// exporting SPECKIT_EVAL_BASELINE_SCORING_DATE=YYYY-MM-DD for the capture run.
// The baseline's `capturedAt` field holds this pinned scoring date, which the
// ratchet and the other baseline readers replay at midnight UTC.
const SCORING_DATE_ENV = 'SPECKIT_EVAL_BASELINE_SCORING_DATE';

function isCalendarDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function resolveScoringDate() {
  const fromEnv = process.env[SCORING_DATE_ENV];
  if (fromEnv !== undefined && fromEnv !== '') {
    if (!isCalendarDate(fromEnv)) {
      process.stderr.write(`capture-scorer-eval-baseline.mjs: ${SCORING_DATE_ENV} must be a calendar date (YYYY-MM-DD), got: ${fromEnv}\n`);
      process.exit(2);
    }
    return fromEnv;
  }
  let recorded;
  try {
    recorded = JSON.parse(readFileSync(OUTPUT_JSON, 'utf8')).capturedAt;
  } catch {
    recorded = undefined;
  }
  if (typeof recorded === 'string' && isCalendarDate(recorded)) return recorded;
  process.stderr.write(`capture-scorer-eval-baseline.mjs: no recorded scoring date in ${OUTPUT_JSON}; set ${SCORING_DATE_ENV}=YYYY-MM-DD\n`);
  process.exit(2);
}

const CAPTURED_AT = resolveScoringDate();
const SCORING_INSTANT = Date.parse(`${CAPTURED_AT}T00:00:00Z`);
const RealDate = Date;
globalThis.Date = class extends RealDate {
  constructor(...args) {
    if (args.length === 0) super(SCORING_INSTANT);
    else super(...args);
  }

  static now() {
    return SCORING_INSTANT;
  }
};

const { scoreAdvisorPrompt } = await import(join(DIST, 'lib/scorer/fusion.js'));
const { mergedSkillForAlias, skillMatchesAlias } = await import(join(DIST, 'lib/scorer/aliases.js'));
const { findAdvisorWorkspaceRoot } = await import(join(DIST, 'lib/utils/workspace-root.js'));

const SENTINEL = '.skilled/skills/system-spec-kit/SKILL.md';
const WORKSPACE_ROOT = findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: SENTINEL });

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

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

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

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
  capturedAt: CAPTURED_AT,
  capturedAtSha: headSha,
  corpusSha256: sha256File(CORPUS_JSONL),
  holdoutSha256: sha256File(HOLDOUT_JSONL),
  ambiguitySha256: sha256File(AMBIGUITY_JSONL),
  env: {
    SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC: '1',
    SYSTEM_SKILL_ADVISOR_DB_DIR: '<empty-dir>',
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

// ───────────────────────────────────────────────────────────────────
// 6. CLI ENTRY
// ───────────────────────────────────────────────────────────────────

const serialized = JSON.stringify(baseline, null, 2) + '\n';
if (process.argv.includes('--write')) {
  writeFileSync(OUTPUT_JSON, serialized, 'utf8');
  console.log(`wrote baseline -> ${OUTPUT_JSON}`);
}
console.log(serialized);
