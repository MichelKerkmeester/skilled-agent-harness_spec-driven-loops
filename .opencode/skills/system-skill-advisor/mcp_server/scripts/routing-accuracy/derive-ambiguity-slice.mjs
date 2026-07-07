// ───────────────────────────────────────────────────────────────
// MODULE: Empirical Ambiguity Slice Deriver
// ───────────────────────────────────────────────────────────────
//
// The labeled corpus carries no expected-ambiguous labels, so an ambiguity
// false-positive/negative rate cannot be computed. What CAN be measured
// honestly is top-1 accuracy on the hardest (lowest top-2 margin) prompts: a
// regression that only hurts contested prompts is invisible in the aggregate
// but fails this slice.
//
// The slice is derived once and frozen: the top-2 fused-score margin is
// computed for every corpus row under the reproducible filesystem projection,
// and rows with `margin <= tau` are kept with their existing gold label. tau is
// chosen as the tightest genuinely-contested band (a meaningful minority, well
// inside the near-tie window), and both tau and the resulting row-id set are
// frozen so the slice never silently re-derives on a corpus edit.
//
// The frozen `margin_at_capture` is advisory (it documents why a row is in the
// slice); the gate recomputes margin live and does not trust it.
//
// Determinism: an empty MK_SKILL_ADVISOR_DB_DIR forces the SQLite loader to
// return null, yielding the clean filesystem projection built purely from
// committed graph metadata — reproducible from the repo alone.
//
// Usage:
//   node derive-ambiguity-slice.mjs            # print summary only
//   node derive-ambiguity-slice.mjs --write    # (re)write ambiguity-prompts.jsonl

import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// The tightest contested margin band: a meaningful minority of the corpus.
const TAU = 0.03;
const CAPTURED_AT = '2026-07-07';

const HERE = dirname(fileURLToPath(import.meta.url));
const CORPUS_JSONL = resolve(HERE, 'labeled-prompts.jsonl');
const OUTPUT_JSONL = resolve(HERE, 'ambiguity-prompts.jsonl');
const DIST = resolve(HERE, '../../dist/mcp_server');

process.env.MK_SKILL_ADVISOR_DB_DIR = mkdtempSync(join(tmpdir(), 'advisor-ambiguity-'));
process.env.SKILL_ADVISOR_DISABLE_BUILTIN_SEMANTIC = '1';
process.env.SPECKIT_SKILL_ADVISOR_FORCE_LOCAL = '1';
process.env.PYTHONDONTWRITEBYTECODE = '1';
// Match the test-harness regime: the semantic-shadow lane substitutes
// deterministic fixture vectors under the harness flag (real embeddings are not
// reproducible in CI), so every scorer gate runs this way. The slice and gate
// must be derived under the same regime that measures them.
process.env.VITEST = 'true';
delete process.env.SPECKIT_ADVISOR_LANE_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_LANE_SHADOW_WEIGHTS_JSON;
delete process.env.SPECKIT_ADVISOR_BM25_LEXICAL_SHADOW;

const { scoreAdvisorPrompt } = await import(join(DIST, 'lib/scorer/fusion.js'));
const { findAdvisorWorkspaceRoot } = await import(join(DIST, 'lib/utils/workspace-root.js'));

const SENTINEL = '.opencode/skills/system-spec-kit/SKILL.md';
const WORKSPACE_ROOT = findAdvisorWorkspaceRoot(HERE, { maxDepth: 14, sentinel: SENTINEL });

function topTwoMargin(prompt) {
  const recs = scoreAdvisorPrompt(prompt, { workspaceRoot: WORKSPACE_ROOT, includeAllCandidates: true }).recommendations;
  // A single or zero candidate is effectively non-ambiguous.
  return recs.length >= 2 ? recs[0].score - recs[1].score : (recs[0]?.score ?? Number.POSITIVE_INFINITY);
}

function readJsonl(path) {
  return readFileSync(path, 'utf8').trim().split('\n').filter(Boolean).map((line) => JSON.parse(line));
}

const corpus = readJsonl(CORPUS_JSONL);
const rows = [];
for (const row of corpus) {
  const margin = topTwoMargin(row.prompt);
  if (margin <= TAU) {
    rows.push({
      id: row.id,
      prompt: row.prompt,
      skill_top_1: row.skill_top_1,
      bucket: row.bucket,
      source_type: row.source_type,
      margin_at_capture: Number(margin.toFixed(4)),
      tau: TAU,
      captured_at: CAPTURED_AT,
    });
  }
}
rows.sort((left, right) => left.margin_at_capture - right.margin_at_capture);

const summary = { tau: TAU, sliceSize: rows.length, corpusSize: corpus.length };
if (process.argv.includes('--write')) {
  writeFileSync(OUTPUT_JSONL, rows.map((row) => JSON.stringify(row)).join('\n') + '\n', 'utf8');
  console.log(`wrote ${rows.length} rows -> ${OUTPUT_JSONL}`);
}
console.log(JSON.stringify(summary, null, 2));
