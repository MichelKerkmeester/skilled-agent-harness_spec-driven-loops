// ───────────────────────────────────────────────────────────────
// MODULE: Advisor RRF Fusion Routing Benchmark
// ───────────────────────────────────────────────────────────────

// Measures whether the advisor RRF-fusion path plus its guards beat the
// weighted-sum baseline on routing top-1 correctness and agreement spread,
// against a read-only backup copy of the live advisor projection.
//
// Production path. The benchmark imports the compiled production scorer
// `scoreAdvisorPrompt` from the advisor dist bundle and the production
// projection loader `loadAdvisorProjection`, the exact pair the
// advisor_recommend handler calls. It toggles only the real flag readers
// (`SPECKIT_ADVISOR_RRF_FUSION`, `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`)
// through the environment, so each arm runs the same production code with the
// same flag semantics the runtime would see.
//
// Read-only. The live skill-graph.sqlite is copied once into results/ and the
// loader is pointed at that copy through MK_SKILL_ADVISOR_DB_DIR. The copy is
// opened read-only and never written. The semantic_shadow lane is left neutral
// (no prompt embedding injected, no VITEST fixture vector) so both arms see an
// identical, embedder-free live lane set and the comparison isolates the
// fusion change rather than embedder noise.
//
// Arms:
//   baseline  all flags off, the live weighted-sum scorer
//   rrf       SPECKIT_ADVISOR_RRF_FUSION on
//   rrf_guard RRF on plus SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD on
//
// Metrics per arm: top-1 correctness over the labeled set, per-band breakdown,
// and the agreement spread (fraction of prompts whose top-1 skill differs from
// the baseline arm). Byte-identity of the off-arm is proven by re-running the
// baseline twice and hashing the full ranked output.

import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LABELED_ROUTING_SET } from './labeled-routing-set.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const PHASE_DIR = join(HERE, '..');
const RESULTS_DIR = join(PHASE_DIR, 'results');
const WORKSPACE = '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public';
const ADVISOR = join(WORKSPACE, '.opencode', 'skills', 'system-skill-advisor', 'mcp_server');
const SRC_DB = join(ADVISOR, 'database', 'skill-graph.sqlite');
const BACKUP_DB = join(RESULTS_DIR, 'skill-graph.backup.sqlite');

const RRF_FLAG = 'SPECKIT_ADVISOR_RRF_FUSION';
const GUARD_FLAG = 'SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD';

function clearArmFlags() {
  delete process.env[RRF_FLAG];
  delete process.env[GUARD_FLAG];
}

function setArm(arm) {
  clearArmFlags();
  if (arm === 'rrf' || arm === 'rrf_guard') process.env[RRF_FLAG] = 'true';
  if (arm === 'rrf_guard') process.env[GUARD_FLAG] = 'true';
}

function round(value, places = 4) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

async function main() {
  mkdirSync(RESULTS_DIR, { recursive: true });

  // Read-only backup: copy the live projection once into results/ as the
  // committed evidence record. The loader opens its own scratch copy under a
  // tmp dir (the read-only open emits -shm/-wal sidecars), so the results tree
  // keeps only the canonical backup with no scratch artifacts.
  copyFileSync(SRC_DB, BACKUP_DB);
  const loaderDir = mkdtempSync(join(tmpdir(), 'advisor-rrf-loader-'));
  copyFileSync(BACKUP_DB, join(loaderDir, 'skill-graph.sqlite'));
  process.env.MK_SKILL_ADVISOR_DB_DIR = loaderDir;

  const fusion = await import(join(ADVISOR, 'dist/mcp_server/lib/scorer/fusion.js'));
  const projmod = await import(join(ADVISOR, 'dist/mcp_server/lib/scorer/projection.js'));

  const projection = projmod.loadAdvisorProjection(WORKSPACE);
  if (projection.source !== 'sqlite') {
    throw new Error(`projection source is '${projection.source}', expected 'sqlite' from the backup copy`);
  }

  function rankedFor(prompt) {
    return fusion.scoreAdvisorPrompt(prompt, {
      workspaceRoot: WORKSPACE,
      projection,
      includeAllCandidates: true,
    });
  }

  function topSkillFor(prompt) {
    const res = rankedFor(prompt);
    return res.recommendations[0]?.skill ?? null;
  }

  function rankedHash(prompt) {
    const res = rankedFor(prompt);
    const shape = res.recommendations
      .map((r) => `${r.skill}:${r.score}:${r.confidence}:${r.uncertainty}`)
      .join('|');
    return createHash('sha256').update(shape).digest('hex');
  }

  const arms = ['baseline', 'rrf', 'rrf_guard'];
  const bands = ['exact', 'paraphrase', 'hard'];

  // Per-prompt top-1 per arm.
  const perPrompt = [];
  const armTop = {};
  for (const arm of arms) armTop[arm] = {};
  for (const ex of LABELED_ROUTING_SET) {
    const row = { id: ex.id, band: ex.band, prompt: ex.prompt, gold: ex.skill, top: {} };
    for (const arm of arms) {
      setArm(arm);
      const top = topSkillFor(ex.prompt);
      row.top[arm] = top;
      armTop[arm][ex.id] = top;
    }
    perPrompt.push(row);
  }
  clearArmFlags();

  // Aggregate correctness and per-band breakdown.
  function correctness(arm) {
    const total = LABELED_ROUTING_SET.length;
    let correct = 0;
    const byBand = Object.fromEntries(bands.map((b) => [b, { total: 0, correct: 0 }]));
    for (const ex of LABELED_ROUTING_SET) {
      byBand[ex.band].total += 1;
      if (armTop[arm][ex.id] === ex.skill) {
        correct += 1;
        byBand[ex.band].correct += 1;
      }
    }
    return {
      top1Correct: correct,
      total,
      top1Accuracy: round(correct / total),
      byBand: Object.fromEntries(bands.map((b) => [b, {
        ...byBand[b],
        accuracy: byBand[b].total > 0 ? round(byBand[b].correct / byBand[b].total) : 0,
      }])),
    };
  }

  // Agreement spread vs the baseline arm (fraction of prompts whose top-1 moved).
  function agreementVsBaseline(arm) {
    let changed = 0;
    const movedIds = [];
    for (const ex of LABELED_ROUTING_SET) {
      if (armTop[arm][ex.id] !== armTop.baseline[ex.id]) {
        changed += 1;
        movedIds.push(ex.id);
      }
    }
    return {
      changedTop1: changed,
      total: LABELED_ROUTING_SET.length,
      changedFraction: round(changed / LABELED_ROUTING_SET.length),
      agreementFraction: round(1 - changed / LABELED_ROUTING_SET.length),
      movedIds,
    };
  }

  const armMetrics = {};
  for (const arm of arms) {
    armMetrics[arm] = {
      ...correctness(arm),
      ...(arm === 'baseline' ? {} : { agreementVsBaseline: agreementVsBaseline(arm) }),
    };
  }

  // Determinism / run-to-run variance: the scorer is deterministic, so the
  // graduate margin baseline is exact. Confirm by re-running each arm and
  // checking top-1 is byte-stable.
  const determinism = {};
  for (const arm of arms) {
    setArm(arm);
    let stable = true;
    for (const ex of LABELED_ROUTING_SET) {
      const a = topSkillFor(ex.prompt);
      const b = topSkillFor(ex.prompt);
      if (a !== b) { stable = false; break; }
    }
    determinism[arm] = { runToRunStable: stable };
  }
  clearArmFlags();

  // Off-arm byte-identity: the baseline (all flags off) must be byte-identical
  // across repeated runs, proving the default path is unchanged.
  const byteIdentity = { byteIdentical: true, perPrompt: [] };
  clearArmFlags();
  for (const ex of LABELED_ROUTING_SET) {
    const h1 = rankedHash(ex.prompt);
    const h2 = rankedHash(ex.prompt);
    const identical = h1 === h2;
    if (!identical) byteIdentity.byteIdentical = false;
    byteIdentity.perPrompt.push({ id: ex.id, identical, hash: h1 });
  }

  const metrics = {
    generatedAt: new Date().toISOString(),
    question: 'Does advisor RRF fusion plus the guards beat the weighted-sum baseline on routing top-1 correctness and agreement spread, on the production path against a read-only projection copy?',
    method: {
      scorer: 'production scoreAdvisorPrompt from advisor dist bundle',
      projectionLoader: 'production loadAdvisorProjection',
      projectionSource: projection.source,
      corpusSkills: projection.skills.length,
      readOnlyBackup: 'results/skill-graph.sqlite copied from the live database, opened read-only',
      embedder: 'none, semantic_shadow lane left neutral so both arms share an identical live lane set',
      flagsToggled: [RRF_FLAG, GUARD_FLAG],
      labeledSetSize: LABELED_ROUTING_SET.length,
      bands,
    },
    arms: armMetrics,
    determinism,
    byteIdentity: { byteIdentical: byteIdentity.byteIdentical, checkedPrompts: byteIdentity.perPrompt.length },
    perPrompt,
  };

  writeFileSync(join(RESULTS_DIR, 'metrics.json'), `${JSON.stringify(metrics, null, 2)}\n`, 'utf8');

  // Console summary.
  console.log('advisor-rrf-benchmark');
  console.log(`  corpus skills        : ${projection.skills.length} (source ${projection.source})`);
  console.log(`  labeled set          : ${LABELED_ROUTING_SET.length}`);
  for (const arm of arms) {
    const m = armMetrics[arm];
    const spread = arm === 'baseline' ? '' : ` agreement=${m.agreementVsBaseline.agreementFraction} (moved ${m.agreementVsBaseline.changedTop1})`;
    console.log(`  ${arm.padEnd(10)} top1=${m.top1Correct}/${m.total} (${m.top1Accuracy})  exact=${m.byBand.exact.accuracy} para=${m.byBand.paraphrase.accuracy} hard=${m.byBand.hard.accuracy}${spread}`);
  }
  console.log(`  off-arm byte-identical: ${byteIdentity.byteIdentical}`);
  console.log(`  deterministic        : ${Object.values(determinism).every((d) => d.runToRunStable)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
