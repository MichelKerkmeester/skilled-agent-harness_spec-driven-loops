// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep Alignment State-Machine Wiring Regression Test                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Drives the state-machine wiring end to end against a synthetic multi-lane
// fixture: SCOPE (scoping.cjs) -> DISCOVER (a hand-seeded corpus, standing in
// for real adapter.discover() output) -> ITERATE (partition-corpus.cjs slices
// + hand-written findings) -> CONVERGE (check-convergence.cjs) -> REPORT
// (reduce-alignment-state.cjs) -> REMEDIATE (remediate-hook.cjs). Proves the
// wiring is correct plumbing, not adapter correctness (the adapters have
// their own contract docs; this test's job is the seams between them).

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { resolveLanesFromConfig } = require('../scoping.cjs');
const { partitionCorpus } = require('../partition-corpus.cjs');
const { checkConvergence, DECISIONS } = require('../check-convergence.cjs');
const { enterRemediateHook } = require('../remediate-hook.cjs');
const { reduceAlignmentState, laneKey } = require('../../../runtime/scripts/reduce-alignment-state.cjs');

function makeSpecFolder(slug) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `align-wiring-${slug}-`)));
  const specFolder = path.join(root, 'specs', 'wiring-fixture');
  const alignmentDir = path.join(specFolder, 'alignment');
  fs.mkdirSync(path.join(alignmentDir, 'deltas'), { recursive: true });
  fs.mkdirSync(path.join(alignmentDir, 'iterations'), { recursive: true });
  return { root, specFolder, alignmentDir };
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function appendJsonl(filePath, records) {
  const line = `${records.map((r) => JSON.stringify(r)).join('\n')}\n`;
  fs.appendFileSync(filePath, line, 'utf8');
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 1: full happy-path wiring, two lanes, converges cleanly
// ─────────────────────────────────────────────────────────────────────────────

function testFullWiringConverges() {
  const { root, specFolder, alignmentDir } = makeSpecFolder('happy-path');
  try {
    // SCOPE: resolve lanes via the real scoping.cjs (--lane-config path).
    const laneConfig = [
      { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/'] } },
      { authority: 'sk-git', artifactClass: 'git-history', scope: { type: 'branchRange', from: 'main', to: 'HEAD' } },
    ];
    const lanes = resolveLanesFromConfig(laneConfig);
    assert.equal(lanes.length, 2);

    writeJson(path.join(alignmentDir, 'deep-alignment-config.json'), { alignmentTarget: 'wiring fixture', lanes });

    // DISCOVER: stand-in corpus (real adapters have their own discover() tests).
    const laneIds = lanes.map(laneKey);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: lanes.map((lane, i) => ({
        laneId: laneIds[i],
        authority: lane.authority,
        artifactClass: lane.artifactClass,
        scope: lane.scope,
        artifacts: i === 0
          ? [{ path: 'docs/a.md' }, { path: 'docs/b.md' }]
          : [{ path: 'CHANGELOG.md', ref: 'HEAD' }],
      })),
    });

    const stateLogPath = path.join(alignmentDir, 'deep-alignment-state.jsonl');
    const deltaDir = path.join(alignmentDir, 'deltas');

    // ITERATE round 1: partition-corpus resolves lane 0's first (only, batch-size 5) slice.
    const slice1 = partitionCorpus(specFolder, { batchSize: 5 });
    assert.equal(slice1.done, false);
    assert.equal(slice1.laneId, laneIds[0]);
    assert.equal(slice1.artifactsSlice.length, 2);

    appendJsonl(stateLogPath, [
      { type: 'iteration', laneId: laneIds[0], artifactsChecked: 2, newFindingsRatio: 1 },
    ]);
    appendJsonl(path.join(deltaDir, 'iter-001.jsonl'), [
      { type: 'finding', laneId: laneIds[0], finding: { severity: 'P2', type: 'style', message: 'minor', artifactPath: 'docs/a.md' } },
    ]);

    // CONVERGE after round 1: lane 1 undiscovered-corpus-checked, not stable yet, not converged.
    const decision1 = checkConvergence(specFolder, { maxIterations: 5, stabilityWindow: 2 });
    assert.equal(decision1.decision, DECISIONS.CONTINUE);
    assert.equal(decision1.coverage.checked, 2);
    assert.equal(decision1.coverage.discovered, 3); // 2 (lane0) + 1 (lane1), lane1 not yet checked

    // ITERATE round 2: partition-corpus now resolves lane 1's slice (lane 0 exhausted).
    const slice2 = partitionCorpus(specFolder, { batchSize: 5 });
    assert.equal(slice2.done, false);
    assert.equal(slice2.laneId, laneIds[1]);
    assert.equal(slice2.artifactsSlice.length, 1);

    appendJsonl(stateLogPath, [
      { type: 'iteration', laneId: laneIds[1], artifactsChecked: 1, newFindingsRatio: 0 },
    ]);
    // No findings this round for lane 1 -- deltas file may legitimately be absent/empty.
    fs.writeFileSync(path.join(deltaDir, 'iter-002.jsonl'), '', 'utf8');

    // partition-corpus now reports done: both lanes' corpora are fully checked.
    const slice3 = partitionCorpus(specFolder, { batchSize: 5 });
    assert.equal(slice3.done, true);

    // CONVERGE after round 2: coverage 100%, but stability window (2) needs 2
    // consecutive zero-new-findings iterations and iteration 1 had new findings.
    const decision2 = checkConvergence(specFolder, { maxIterations: 5, stabilityWindow: 2 });
    assert.equal(decision2.coverage.ratio, 1);
    assert.equal(decision2.decision, DECISIONS.CONTINUE);
    assert.equal(decision2.stability.stable, false);

    // ITERATE round 3: a dry-run re-check of both lanes, zero new findings.
    appendJsonl(stateLogPath, [
      { type: 'iteration', laneId: laneIds[0], artifactsChecked: 2, newFindingsRatio: 0 },
    ]);
    fs.writeFileSync(path.join(deltaDir, 'iter-003.jsonl'), '', 'utf8');

    // CONVERGE after round 3: last 2 iterations (round 2 lane1, round 3 lane0)
    // both report zero new findings AND coverage is 100% -> CONVERGED.
    const decision3 = checkConvergence(specFolder, { maxIterations: 5, stabilityWindow: 2 });
    assert.equal(decision3.decision, DECISIONS.CONVERGED);
    assert.equal(decision3.coverage.met, true);
    assert.equal(decision3.stability.stable, true);

    // REPORT: reducer writes the final registry + alignment-report.md.
    const reportResult = reduceAlignmentState(specFolder, { write: true });
    assert.ok(fs.existsSync(reportResult.reportPath));
    assert.ok(fs.existsSync(reportResult.registryPath));
    assert.equal(reportResult.registry.overall.verdict, 'PASS'); // only a P2 finding, no P0/P1

    // REMEDIATE hook: enterable, safe, performs no action, mutates nothing.
    const beforeFiles = fs.readdirSync(alignmentDir).sort();
    const hookResult = enterRemediateHook(specFolder);
    const afterFiles = fs.readdirSync(alignmentDir).sort();
    assert.equal(hookResult.status, 'not_implemented');
    assert.deepEqual(beforeFiles, afterFiles);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 2: max-iterations acts as an independent hard stop even if not converged
// ─────────────────────────────────────────────────────────────────────────────

function testMaxIterationsIndependentHardStop() {
  const { root, specFolder, alignmentDir } = makeSpecFolder('max-iter');
  try {
    const lanes = resolveLanesFromConfig([
      { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/'] } },
    ]);
    const laneIds = lanes.map(laneKey);
    writeJson(path.join(alignmentDir, 'deep-alignment-config.json'), { alignmentTarget: 'max-iter fixture', lanes });
    // 3 discovered artifacts; the fixture below only ever checks 1-per-iteration
    // (cumulative 2 of 3), so coverage never reaches 100% before max-iterations.
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{
        laneId: laneIds[0],
        authority: 'sk-doc',
        artifactClass: 'docs',
        scope: lanes[0].scope,
        artifacts: [{ path: 'docs/a.md' }, { path: 'docs/b.md' }, { path: 'docs/c.md' }],
      }],
    });

    const stateLogPath = path.join(alignmentDir, 'deep-alignment-state.jsonl');
    const deltaDir = path.join(alignmentDir, 'deltas');
    // Two iterations, each checking one (different) artifact and each finding
    // something new -- never converges (coverage 2/3, not stable), and
    // max-iterations (2) forces a stop regardless.
    appendJsonl(stateLogPath, [
      { type: 'iteration', laneId: laneIds[0], artifactsChecked: 1, newFindingsRatio: 1 },
      { type: 'iteration', laneId: laneIds[0], artifactsChecked: 1, newFindingsRatio: 1 },
    ]);
    appendJsonl(path.join(deltaDir, 'iter-001.jsonl'), [
      { type: 'finding', laneId: laneIds[0], finding: { severity: 'P1', type: 'drift', message: 'iteration 1 finding', artifactPath: 'docs/a.md' } },
    ]);
    appendJsonl(path.join(deltaDir, 'iter-002.jsonl'), [
      { type: 'finding', laneId: laneIds[0], finding: { severity: 'P1', type: 'drift', message: 'iteration 2 finding', artifactPath: 'docs/b.md' } },
    ]);

    const decision = checkConvergence(specFolder, { maxIterations: 2, stabilityWindow: 2 });
    assert.equal(decision.decision, DECISIONS.STOP_MAX_ITERATIONS);
    assert.equal(decision.coverage.met, false);
    assert.equal(decision.coverage.checked, 2);
    assert.equal(decision.coverage.discovered, 3);
    assert.equal(decision.stability.stable, false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 3: zero lanes resolves cleanly, no infinite loop, no error
// ─────────────────────────────────────────────────────────────────────────────

function testZeroLanesCleanExit() {
  const { root, specFolder, alignmentDir } = makeSpecFolder('zero-lanes');
  try {
    writeJson(path.join(alignmentDir, 'deep-alignment-config.json'), { alignmentTarget: 'empty fixture', lanes: [] });
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), { lanes: [] });

    const decision = checkConvergence(specFolder, { maxIterations: 5 });
    assert.equal(decision.decision, DECISIONS.NOTHING_TO_CONVERGE);

    const slice = partitionCorpus(specFolder);
    assert.equal(slice.done, true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Test 4: a zero-artifact lane is NOT_APPLICABLE and does not block convergence
// or get silently folded into a false PASS-by-vacuous-coverage on its own.
// ─────────────────────────────────────────────────────────────────────────────

function testZeroArtifactLaneIsNotApplicable() {
  const { root, specFolder, alignmentDir } = makeSpecFolder('zero-artifact-lane');
  try {
    const lanes = resolveLanesFromConfig([
      { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/nonexistent-subdir/'] } },
      { authority: 'sk-git', artifactClass: 'git-history', scope: { type: 'branchRange', from: 'main', to: 'HEAD' } },
    ]);
    const laneIds = lanes.map(laneKey);
    writeJson(path.join(alignmentDir, 'deep-alignment-config.json'), { alignmentTarget: 'mixed fixture', lanes });
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [
        { laneId: laneIds[0], authority: 'sk-doc', artifactClass: 'docs', scope: lanes[0].scope, artifacts: [] },
        { laneId: laneIds[1], authority: 'sk-git', artifactClass: 'git-history', scope: lanes[1].scope, artifacts: [{ path: 'CHANGELOG.md', ref: 'HEAD' }] },
      ],
    });

    const stateLogPath = path.join(alignmentDir, 'deep-alignment-state.jsonl');
    appendJsonl(stateLogPath, [
      { type: 'iteration', laneId: laneIds[1], artifactsChecked: 1, newFindingsRatio: 0 },
      { type: 'iteration', laneId: laneIds[1], artifactsChecked: 1, newFindingsRatio: 0 },
    ]);

    // Lane 0 (zero artifacts) is excluded from the coverage ratio entirely;
    // lane 1 alone is 1/1 checked and stable across the last 2 iterations.
    const decision = checkConvergence(specFolder, { maxIterations: 5, stabilityWindow: 2 });
    assert.equal(decision.coverage.discovered, 1);
    assert.equal(decision.decision, DECISIONS.CONVERGED);

    const { registry } = reduceAlignmentState(specFolder, { write: false });
    const laneZero = registry.lanes.find((entry) => entry.laneId === laneIds[0]);
    assert.equal(laneZero.verdict, 'NOT_APPLICABLE');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
}

testFullWiringConverges();
testMaxIterationsIndependentHardStop();
testZeroLanesCleanExit();
testZeroArtifactLaneIsNotApplicable();
console.log('[deep-alignment] state-machine wiring regression passed');
