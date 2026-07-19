#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// COMPONENT: OUTCOME-WEIGHTED RERANK ROUTING-ACCURACY EVAL DRIVER
// ───────────────────────────────────────────────────────────────
//
// Measures whether the outcome-weighted re-rank improves routing accuracy over
// the similarity-only baseline, reported as MRR (mean reciprocal rank of the
// gold skill) AND right-skill@3 — not @1 alone. A near-tie reorder mainly moves
// a skill between adjacent ranks, so @1 is a coarse, noisy lens; MRR and @3 see
// the fuller ranking shift and are the gate this packet reads.
//
// The flag governs `outcomeWeightedRerank` (lib/scorer/outcome-weighted-rerank),
// which blends live fused similarity with an observed-outcome reliability term
// through the shared Beta posterior. This eval scores the rerank's full ordering
// against the similarity-only ordering it reorders.
//
// Honest signal, not leakage: the reliability fold is built from a TRAIN split
// of the labeled corpus (skill marked correct => success, wrong => failure),
// then accuracy is measured ONLY on a disjoint HELD-OUT split. A flag that
// merely memorised the labels would not transfer across the split.
//
// READ-ONLY: scores against the live skill-graph.sqlite via a read path; never
// mutates any database.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
// routing-accuracy -> scripts -> mcp_server
const MCP_SERVER = join(SCRIPT_DIR, '..', '..');
const REPO_ROOT = join(MCP_SERVER, '..', '..', '..', '..');
const CORPUS = join(SCRIPT_DIR, 'labeled-prompts.jsonl');

const DIST_SCORER = join(MCP_SERVER, 'dist', 'mcp-server', 'lib', 'scorer');
const { scoreAdvisorPrompt } = await import(join(DIST_SCORER, 'fusion.js'));
const { loadAdvisorProjection } = await import(join(DIST_SCORER, 'projection.js'));
const { outcomeWeightedRerank } = await import(join(DIST_SCORER, 'outcome-weighted-rerank.js'));

function loadCorpus(path) {
  const rows = [];
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t) continue;
    const row = JSON.parse(t);
    const gold = String(row.skill_top_1 ?? 'none');
    if (!row.prompt || gold === 'none') continue; // skill-firing prompts only
    rows.push({ id: row.id, prompt: row.prompt, gold });
  }
  return rows;
}

// Beta-posterior mean reliability resolver (test-side reference for the seam).
const A0 = 1;
const B0 = 1;
const betaMean = ({ success, failure }) => (A0 + success) / (A0 + B0 + success + failure);

// Build an outcome fold from a TRAIN split: a prompt whose gold skill the
// baseline already ranks #1 => success for that skill; otherwise => failure.
function buildFold(trainRows, projection) {
  const bySkill = {};
  let recordCount = 0;
  for (const row of trainRows) {
    const result = scoreAdvisorPrompt(row.prompt, { workspaceRoot: REPO_ROOT, projection });
    const top = result.recommendations[0]?.skill ?? 'none';
    const success = top === row.gold;
    const skill = row.gold;
    bySkill[skill] ??= { success: 0, failure: 0, total: 0 };
    if (success) bySkill[skill].success += 1;
    else bySkill[skill].failure += 1;
    bySkill[skill].total += 1;
    recordCount += 1;
  }
  return { generatedAt: 'eval', recordCount, bySkill };
}

function candidatesFor(prompt, projection) {
  const result = scoreAdvisorPrompt(prompt, { workspaceRoot: REPO_ROOT, projection });
  // recommendations are already in live fused-sort order; score == fused similarity.
  return result.recommendations.map((r) => ({ skillId: r.skill, similarity: r.score }));
}

// Reciprocal rank of the gold skill in an ordered skill-id list (1-based);
// 0 when gold is absent. MRR is the mean of these over the test split.
function reciprocalRank(orderedSkillIds, gold) {
  const index = orderedSkillIds.indexOf(gold);
  return index < 0 ? 0 : 1 / (index + 1);
}

// Right-skill@k: gold appears within the top-k of the ordering.
function inTopK(orderedSkillIds, gold, k) {
  return orderedSkillIds.slice(0, k).includes(gold);
}

// Score one ordering producer over the test split: returns MRR, right@1, right@3.
function scoreOrdering(rows, orderFor) {
  let rrSum = 0;
  let at1 = 0;
  let at3 = 0;
  for (const row of rows) {
    const order = orderFor(row);
    rrSum += reciprocalRank(order, row.gold);
    if (inTopK(order, row.gold, 1)) at1 += 1;
    if (inTopK(order, row.gold, 3)) at3 += 1;
  }
  const n = rows.length || 1;
  return {
    mrr: Number((rrSum / n).toFixed(4)),
    right_skill_at_1: { correct: at1, accuracy: Number((at1 / n).toFixed(4)) },
    right_skill_at_3: { correct: at3, accuracy: Number((at3 / n).toFixed(4)) },
  };
}

function main() {
  const projection = loadAdvisorProjection(REPO_ROOT);
  const all = loadCorpus(CORPUS);

  // Deterministic 50/50 split by stable id hash so the eval is reproducible.
  const sorted = [...all].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const train = sorted.filter((_, i) => i % 2 === 0);
  const test = sorted.filter((_, i) => i % 2 === 1);

  const fold = buildFold(train, projection);

  // Baseline: the live similarity order. Rerank: the outcome-weighted order over
  // the same candidates and the train-derived fold (Beta-posterior reliability).
  const baseline = scoreOrdering(test, (row) =>
    candidatesFor(row.prompt, projection).map((c) => c.skillId));
  const rerank = scoreOrdering(test, (row) => {
    const cands = candidatesFor(row.prompt, projection);
    if (cands.length === 0) return [];
    return outcomeWeightedRerank(cands, { fold, reliabilityResolver: betaMean }).map((r) => r.skillId);
  });

  const report = {
    corpus: CORPUS,
    skill_firing_prompts: all.length,
    train_size: train.length,
    test_size: test.length,
    projection_source: projection.source ?? 'unknown',
    skills_in_projection: projection.skills.length,
    baseline,
    rerank_flag_on: rerank,
    delta: {
      mrr: Number((rerank.mrr - baseline.mrr).toFixed(4)),
      right_skill_at_1: Number((rerank.right_skill_at_1.accuracy - baseline.right_skill_at_1.accuracy).toFixed(4)),
      right_skill_at_3: Number((rerank.right_skill_at_3.accuracy - baseline.right_skill_at_3.accuracy).toFixed(4)),
    },
    // earnsFlip := MRR improves AND right-skill@3 does not regress.
    earns_flip: rerank.mrr > baseline.mrr && rerank.right_skill_at_3.accuracy >= baseline.right_skill_at_3.accuracy,
    fold_skills_with_outcomes: Object.keys(fold.bySkill).length,
    fold_corpus_size: fold.recordCount,
    note: 'PRELIMINARY — single run, held-out split, fold is corpus-derived (no production ledger). Re-run officially before promotion.',
  };
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  return 0;
}

process.exit(main());
