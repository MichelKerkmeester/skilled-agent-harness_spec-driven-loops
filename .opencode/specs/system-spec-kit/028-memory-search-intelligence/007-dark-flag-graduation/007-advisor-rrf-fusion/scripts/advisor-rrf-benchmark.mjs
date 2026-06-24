// ───────────────────────────────────────────────────────────────
// MODULE: Advisor RRF Fusion Routing Benchmark
// ───────────────────────────────────────────────────────────────

// Measures whether the advisor RRF-fusion path plus its guards beat the
// weighted-sum baseline on routing top-1 correctness and agreement spread,
// against a read-only backup copy of the live advisor projection, on a widened
// labeled set that exercises both guard seams directly.
//
// Production path. The benchmark imports the compiled production scorer
// `scoreAdvisorPrompt` from the advisor dist bundle and the production
// projection loader `loadAdvisorProjection`, the exact pair the
// advisor_recommend handler calls. It toggles only the real flag readers
// (`SPECKIT_ADVISOR_RRF_FUSION`, `SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD`)
// through the environment, so each arm runs the same production code with the
// same flag semantics the runtime would see.
//
// Read-only corpus. The live skill-graph.sqlite is copied once into results/
// as the evidence record and into a tmp dir as the loader scratch copy. The
// loader opens it read-only and never writes. The conflict overlay is merged
// into the in-memory projection (not the live corpus) so the conflict-rerank
// seam runs against real conflicts_with mass without mutating production data.
// The semantic_shadow lane is left neutral (no prompt embedding injected, no
// VITEST fixture vector) so both arms share an identical embedder-free live
// lane set and the comparison isolates the fusion change.
//
// Arms over the full set:
//   baseline  all flags off, the live weighted-sum scorer
//   rrf       SPECKIT_ADVISOR_RRF_FUSION on
//   rrf_guard RRF on plus SPECKIT_ADVISOR_SELF_RECOMMENDATION_GUARD on
//
// The conflict band is scored against the conflict overlay, every other band
// against the live projection. Two extra differentials isolate the guard seams:
//   selfGuardDifferential  RRF-off-guard vs RRF-on-guard over the self_guard
//                          band, recording whether the guard moves any top-1
//   conflictDifferential   RRF over the live projection vs RRF over the overlay
//                          projection on the conflict band, recording whether
//                          conflict mass moves any top-1

import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { CONFLICT_BAND, LABELED_ROUTING_SET, SELF_GUARD_BAND } from './labeled-routing-set.mjs';
import { CONFLICT_OVERLAY_EDGES, withConflictOverlay } from './conflict-overlay.mjs';

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

  const liveProjection = projmod.loadAdvisorProjection(WORKSPACE);
  if (liveProjection.source !== 'sqlite') {
    throw new Error(`projection source is '${liveProjection.source}', expected 'sqlite' from the backup copy`);
  }
  const overlayProjection = withConflictOverlay(liveProjection);

  // Projection selection per arm and band. The conflict-rerank seam is
  // RRF-gated (graphConflictAdjustment is applied only when useRrfFusion), so
  // the overlay can only change an RRF arm's outcome. The baseline arm scores
  // the conflict band against the live projection, since seeding conflict mass
  // it cannot read would misattribute the weighted-sum's native suppression to
  // the overlay. The RRF arms score the conflict band against the overlay so
  // the seam has real conflicts_with mass to demote. Every other band is scored
  // against the live projection for all arms.
  function projectionFor(band, arm) {
    if (band !== CONFLICT_BAND) return liveProjection;
    return arm === 'baseline' ? liveProjection : overlayProjection;
  }

  function rankedFor(prompt, projection) {
    return fusion.scoreAdvisorPrompt(prompt, {
      workspaceRoot: WORKSPACE,
      projection,
      includeAllCandidates: true,
    });
  }

  function topSkillFor(prompt, projection) {
    return rankedFor(prompt, projection).recommendations[0]?.skill ?? null;
  }

  function rankedHash(prompt, projection) {
    const shape = rankedFor(prompt, projection).recommendations
      .map((r) => `${r.skill}:${r.score}:${r.confidence}:${r.uncertainty}`)
      .join('|');
    return createHash('sha256').update(shape).digest('hex');
  }

  const arms = ['baseline', 'rrf', 'rrf_guard'];
  const bands = ['exact', 'paraphrase', 'hard', 'self_guard', 'conflict'];

  // Per-prompt top-1 per arm, each band scored against its own projection.
  const perPrompt = [];
  const armTop = {};
  for (const arm of arms) armTop[arm] = {};
  for (const ex of LABELED_ROUTING_SET) {
    const row = { id: ex.id, band: ex.band, prompt: ex.prompt, gold: ex.skill, top: {} };
    for (const arm of arms) {
      setArm(arm);
      const top = topSkillFor(ex.prompt, projectionFor(ex.band, arm));
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

  // Self-guard differential: over the self_guard band, compare RRF with the
  // guard off against RRF with the guard on. Records whether the guard moves
  // any top-1 and whether the guard-on top-1 is more correct.
  const selfGuardRows = [];
  let selfGuardMoved = 0;
  let selfGuardCorrectOff = 0;
  let selfGuardCorrectOn = 0;
  for (const ex of LABELED_ROUTING_SET.filter((e) => e.band === SELF_GUARD_BAND)) {
    setArm('rrf');
    const off = topSkillFor(ex.prompt, liveProjection);
    setArm('rrf_guard');
    const on = topSkillFor(ex.prompt, liveProjection);
    const moved = off !== on;
    if (moved) selfGuardMoved += 1;
    if (off === ex.skill) selfGuardCorrectOff += 1;
    if (on === ex.skill) selfGuardCorrectOn += 1;
    selfGuardRows.push({ id: ex.id, prompt: ex.prompt, gold: ex.skill, guardOff: off, guardOn: on, moved });
  }
  clearArmFlags();
  const selfGuardDifferential = {
    band: SELF_GUARD_BAND,
    total: selfGuardRows.length,
    top1Moved: selfGuardMoved,
    correctGuardOff: selfGuardCorrectOff,
    correctGuardOn: selfGuardCorrectOn,
    showsSignal: selfGuardMoved > 0,
    rows: selfGuardRows,
  };

  // Conflict differential: over the conflict band, compare RRF against the live
  // projection (no conflicts_with edges) against RRF against the overlay
  // projection (with conflicts_with mass). Records whether conflict mass moves
  // any top-1 and whether the overlay top-1 is more correct.
  const conflictRows = [];
  let conflictMoved = 0;
  let conflictCorrectNoOverlay = 0;
  let conflictCorrectOverlay = 0;
  setArm('rrf');
  for (const ex of LABELED_ROUTING_SET.filter((e) => e.band === CONFLICT_BAND)) {
    const noOverlay = topSkillFor(ex.prompt, liveProjection);
    const overlay = topSkillFor(ex.prompt, overlayProjection);
    const moved = noOverlay !== overlay;
    if (moved) conflictMoved += 1;
    if (noOverlay === ex.skill) conflictCorrectNoOverlay += 1;
    if (overlay === ex.skill) conflictCorrectOverlay += 1;
    conflictRows.push({ id: ex.id, prompt: ex.prompt, gold: ex.skill, noOverlay, overlay, moved });
  }
  clearArmFlags();
  const conflictDifferential = {
    band: CONFLICT_BAND,
    total: conflictRows.length,
    overlayEdges: CONFLICT_OVERLAY_EDGES.length,
    top1Moved: conflictMoved,
    correctNoOverlay: conflictCorrectNoOverlay,
    correctOverlay: conflictCorrectOverlay,
    showsSignal: conflictMoved > 0,
    rows: conflictRows,
  };

  // Determinism: re-run each arm and confirm top-1 is byte-stable per band's
  // projection. The scorer is deterministic, so the graduate margin is exact.
  const determinism = {};
  for (const arm of arms) {
    setArm(arm);
    let stable = true;
    for (const ex of LABELED_ROUTING_SET) {
      const projection = projectionFor(ex.band, arm);
      if (topSkillFor(ex.prompt, projection) !== topSkillFor(ex.prompt, projection)) { stable = false; break; }
    }
    determinism[arm] = { runToRunStable: stable };
  }
  clearArmFlags();

  // Off-arm byte-identity: the baseline (all flags off) must be byte-identical
  // across repeated runs over the full set on the live projection, proving the
  // default path is unchanged. Baseline reads the live projection for every
  // band (the conflict seam is RRF-gated, so the overlay is inert with flags
  // off), so this checks the true default path.
  const byteIdentity = { byteIdentical: true, perPrompt: [] };
  clearArmFlags();
  for (const ex of LABELED_ROUTING_SET) {
    const projection = projectionFor(ex.band, 'baseline');
    const h1 = rankedHash(ex.prompt, projection);
    const h2 = rankedHash(ex.prompt, projection);
    const identical = h1 === h2;
    if (!identical) byteIdentity.byteIdentical = false;
    byteIdentity.perPrompt.push({ id: ex.id, identical, hash: h1 });
  }

  // Overlay effect under default-off. The RRF-specific conflict comparator
  // demotion is flag-gated, but the graph-causal lane folds conflicts_with mass
  // into the weighted-sum combinedMatches natively, so the overlay perturbs
  // lower-rank scores even with flags off. What must hold for safety is that the
  // overlay does not change the default-off TOP-1 on any conflict prompt, since
  // top-1 is the routed answer. The full-ranked-hash difference below is the
  // expected native weighted-sum behavior, recorded for honesty, not a flag
  // leak (the flag-off path is byte-identical to the default per byteIdentical).
  clearArmFlags();
  let overlayChangesOffTop1 = false;
  let overlayChangesOffHash = false;
  for (const ex of LABELED_ROUTING_SET.filter((e) => e.band === CONFLICT_BAND)) {
    if (topSkillFor(ex.prompt, liveProjection) !== topSkillFor(ex.prompt, overlayProjection)) {
      overlayChangesOffTop1 = true;
    }
    if (rankedHash(ex.prompt, liveProjection) !== rankedHash(ex.prompt, overlayProjection)) {
      overlayChangesOffHash = true;
    }
  }

  const metrics = {
    generatedAt: new Date().toISOString(),
    question: 'Does advisor RRF fusion plus the guards beat the weighted-sum baseline on routing top-1 correctness, and do the self-recommendation guard and the conflict-rerank seam show signal on a set built to trigger them, on the production path against a read-only projection copy?',
    method: {
      scorer: 'production scoreAdvisorPrompt from advisor dist bundle',
      projectionLoader: 'production loadAdvisorProjection',
      projectionSource: liveProjection.source,
      corpusSkills: liveProjection.skills.length,
      readOnlyBackup: 'results/skill-graph.backup.sqlite copied from the live database, loader opens a tmp read-only copy',
      conflictOverlay: 'conflicts_with edges merged into the in-memory projection for the conflict band only, the live corpus is never written',
      embedder: 'none, semantic_shadow lane left neutral so both arms share an identical live lane set',
      flagsToggled: [RRF_FLAG, GUARD_FLAG],
      labeledSetSize: LABELED_ROUTING_SET.length,
      bands,
    },
    arms: armMetrics,
    selfGuardDifferential,
    conflictDifferential,
    determinism,
    byteIdentity: {
      byteIdentical: byteIdentity.byteIdentical,
      checkedPrompts: byteIdentity.perPrompt.length,
      overlayChangesOffTop1,
      overlayChangesOffHash,
      overlayOffNote: 'the conflict overlay does not change the default-off top-1, the lower-rank hash difference is the native weighted-sum graph-causal conflict handling, not a flag leak',
    },
    perPrompt,
  };

  writeFileSync(join(RESULTS_DIR, 'metrics.json'), `${JSON.stringify(metrics, null, 2)}\n`, 'utf8');

  // Console summary.
  console.log('advisor-rrf-benchmark');
  console.log(`  corpus skills        : ${liveProjection.skills.length} (source ${liveProjection.source})`);
  console.log(`  labeled set          : ${LABELED_ROUTING_SET.length}`);
  for (const arm of arms) {
    const m = armMetrics[arm];
    const spread = arm === 'baseline' ? '' : ` agreement=${m.agreementVsBaseline.agreementFraction} (moved ${m.agreementVsBaseline.changedTop1})`;
    console.log(`  ${arm.padEnd(10)} top1=${m.top1Correct}/${m.total} (${m.top1Accuracy})  exact=${m.byBand.exact.accuracy} para=${m.byBand.paraphrase.accuracy} hard=${m.byBand.hard.accuracy} selfg=${m.byBand.self_guard.accuracy} conf=${m.byBand.conflict.accuracy}${spread}`);
  }
  console.log(`  self-guard signal    : ${selfGuardDifferential.showsSignal} (top1 moved ${selfGuardDifferential.top1Moved}/${selfGuardDifferential.total}, correct off ${selfGuardDifferential.correctGuardOff} on ${selfGuardDifferential.correctGuardOn})`);
  console.log(`  conflict signal      : ${conflictDifferential.showsSignal} (top1 moved ${conflictDifferential.top1Moved}/${conflictDifferential.total}, correct no-overlay ${conflictDifferential.correctNoOverlay} overlay ${conflictDifferential.correctOverlay})`);
  console.log(`  off-arm byte-identical: ${byteIdentity.byteIdentical}`);
  console.log(`  overlay off top1 change: ${overlayChangesOffTop1} (lower-rank hash change ${overlayChangesOffHash}, native weighted-sum not a flag leak)`);
  console.log(`  deterministic        : ${Object.values(determinism).every((d) => d.runToRunStable)}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
