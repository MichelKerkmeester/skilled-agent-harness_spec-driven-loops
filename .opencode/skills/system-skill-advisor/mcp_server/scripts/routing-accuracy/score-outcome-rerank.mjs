#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// COMPONENT: OUTCOME-WEIGHTED RERANK ROUTING-ACCURACY EVAL DRIVER
// ───────────────────────────────────────────────────────────────
//
// Measures whether the outcome-weighted shadow re-rank improves
// right-skill@1 routing accuracy over the similarity-only baseline.
//
// The flag governs `outcomeWeightedRerank` (lib/scorer/outcome-weighted-rerank),
// a SHADOW channel that blends live fused similarity with an observed-outcome
// reliability term. The live fused sort is deliberately untouched by the flag,
// so this eval scores the shadow re-rank's right-skill@1 directly against the
// similarity-only ordering it would replace.
//
// Honest signal, not leakage: the reliability fold is built from a TRAIN split
// of the labeled corpus (skill marked correct => success, wrong => failure),
// then right-skill@1 is measured ONLY on a disjoint HELD-OUT split. A flag that
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

const DIST_SCORER = join(MCP_SERVER, 'dist', 'mcp_server', 'lib', 'scorer');
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

function rightAt1Baseline(rows, projection) {
  let correct = 0;
  for (const row of rows) {
    const cands = candidatesFor(row.prompt, projection);
    if ((cands[0]?.skillId ?? 'none') === row.gold) correct += 1;
  }
  return correct;
}

function rightAt1Reranked(rows, projection, fold) {
  let correct = 0;
  for (const row of rows) {
    const cands = candidatesFor(row.prompt, projection);
    if (cands.length === 0) continue;
    const ranked = outcomeWeightedRerank(cands, { fold, reliabilityResolver: betaMean });
    if ((ranked[0]?.skillId ?? 'none') === row.gold) correct += 1;
  }
  return correct;
}

function main() {
  const projection = loadAdvisorProjection(REPO_ROOT);
  const all = loadCorpus(CORPUS);

  // Deterministic 50/50 split by stable id hash so the eval is reproducible.
  const sorted = [...all].sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const train = sorted.filter((_, i) => i % 2 === 0);
  const test = sorted.filter((_, i) => i % 2 === 1);

  const fold = buildFold(train, projection);

  const baselineCorrect = rightAt1Baseline(test, projection);
  const rerankCorrect = rightAt1Reranked(test, projection, fold);

  const report = {
    corpus: CORPUS,
    skill_firing_prompts: all.length,
    train_size: train.length,
    test_size: test.length,
    projection_source: projection.source ?? 'unknown',
    skills_in_projection: projection.skills.length,
    baseline_right_skill_at_1: {
      correct: baselineCorrect,
      accuracy: Number((baselineCorrect / test.length).toFixed(4)),
    },
    rerank_flag_on_right_skill_at_1: {
      correct: rerankCorrect,
      accuracy: Number((rerankCorrect / test.length).toFixed(4)),
    },
    delta_accuracy: Number(((rerankCorrect - baselineCorrect) / test.length).toFixed(4)),
    fold_skills_with_outcomes: Object.keys(fold.bySkill).length,
    note: 'PRELIMINARY — single run, held-out split. Re-run officially before promotion.',
  };
  process.stdout.write(JSON.stringify(report, null, 2) + '\n');
  return 0;
}

process.exit(main());
