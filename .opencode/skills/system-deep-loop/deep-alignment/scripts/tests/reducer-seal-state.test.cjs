#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Alignment Reducer — registry seal-state regression                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// The registry is seeded FAIL-closed before the first dispatch and, prior to
// this guard, was only rewritten at terminal synthesis. A run that died mid-loop
// (a leaf dispatch failure, timeout, crash or kill) stranded that seed — a
// fail-closed FAIL byte-identical to a completed audit that genuinely failed, so
// a consumer read the placeholder as an authoritative verdict.
//
// `overall.sealed` fixes that: the seed and every per-iteration refresh leave it
// false; only the terminal synthesis reduce (--seal / { seal: true }) sets it
// true. These tests pin: the seed is preliminary, a completed iteration reduces
// to its real verdict while staying preliminary until sealed, sealing never
// launders a fail-closed FAIL, and the CLI --seal flag flows through to disk.

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const { resolveLanesFromConfig } = require('../scoping.cjs');
const {
  reduceAlignmentState,
  buildOverallRollup,
  buildLaneEntry,
  laneKey,
} = require('../../../runtime/scripts/reduce-alignment-state.cjs');

const REDUCER = path.resolve(__dirname, '../../../runtime/scripts/reduce-alignment-state.cjs');

function makeSpecFolder(slug) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `align-seal-${slug}-`)));
  const specFolder = path.join(root, 'specs', 'fixture');
  const alignmentDir = path.join(specFolder, 'alignment');
  fs.mkdirSync(path.join(alignmentDir, 'deltas'), { recursive: true });
  return { specFolder, alignmentDir };
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function seedLane(alignmentDir, artifacts) {
  const lanes = resolveLanesFromConfig([
    { authority: 'sk-code', artifactClass: 'code', scope: { type: 'paths', values: ['src/'] } },
  ]);
  const lane = lanes[0];
  const id = laneKey(lane);
  writeJson(path.join(alignmentDir, 'deep-alignment-config.json'), { alignmentTarget: 'seal fixture', lanes });
  writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
    lanes: [{ laneId: id, authority: lane.authority, artifactClass: lane.artifactClass, scope: lane.scope, artifacts }],
  });
  return id;
}

function appendState(alignmentDir, obj) {
  fs.appendFileSync(path.join(alignmentDir, 'deep-alignment-state.jsonl'), `${JSON.stringify(obj)}\n`, 'utf8');
}

// 1. The pre-dispatch seed (non-empty corpus, zero iteration records) is a
//    FAIL-closed placeholder that is explicitly PRELIMINARY (sealed=false).
function testSeedIsPreliminaryFailClosed() {
  const { specFolder, alignmentDir } = makeSpecFolder('seed');
  seedLane(alignmentDir, [{ path: 'src/a.mjs' }, { path: 'src/b.mjs' }]);
  // No iteration records at all — exactly what the seed reduce sees.

  const { registry } = reduceAlignmentState(specFolder, { write: false });
  assert.equal(registry.overall.verdict, 'FAIL', 'seed over a non-empty corpus stays fail-closed');
  assert.equal(registry.overall.incompleteCoverage, true);
  assert.equal(registry.overall.sealed, false, 'the seed is preliminary, never authoritative');
}

// 2. The stranded-run fix: a completed iteration reduces to its REAL verdict
//    (not the seed FAIL), yet stays preliminary until a sealing reduce runs.
//    This is the exact packet-012 shape: 1 iteration checked artifacts, 0
//    findings -> PASS, but the loop died before synthesis so it is unsealed.
function testCompletedIterationUnsealedThenSealed() {
  const { specFolder, alignmentDir } = makeSpecFolder('stranded');
  const laneId = seedLane(alignmentDir, [{ path: 'src/a.mjs' }, { path: 'src/b.mjs' }]);
  appendState(alignmentDir, {
    type: 'iteration',
    laneId,
    artifactsChecked: ['src/a.mjs', 'src/b.mjs'],
    newFindingsRatio: 0,
  });

  const preliminary = reduceAlignmentState(specFolder, { write: false }).registry.overall;
  assert.equal(preliminary.verdict, 'PASS', 'a completed clean iteration reduces to PASS, not the seed FAIL');
  assert.equal(preliminary.sealed, false, 'a non-synthesis refresh is preliminary even when it reflects real work');

  const sealed = reduceAlignmentState(specFolder, { write: false, seal: true }).registry.overall;
  assert.equal(sealed.verdict, 'PASS');
  assert.equal(sealed.sealed, true, 'the terminal synthesis reduce seals the verdict authoritative');
}

// 3. Sealing is orthogonal to the verdict: sealing a genuinely fail-closed
//    reduce must NOT launder it into a pass.
function testSealDoesNotLaunderFailClosed() {
  const { specFolder, alignmentDir } = makeSpecFolder('nolaunder');
  seedLane(alignmentDir, [{ path: 'src/a.mjs' }]); // discovered but never audited

  const sealed = reduceAlignmentState(specFolder, { write: false, seal: true }).registry.overall;
  assert.equal(sealed.verdict, 'FAIL', 'sealing an unaudited corpus is still FAIL');
  assert.equal(sealed.incompleteCoverage, true);
  assert.equal(sealed.sealed, true);
}

// 4. Unit: buildOverallRollup defaults sealed=false and honors seal:true.
function testBuildOverallRollupSealFlag() {
  const lane = buildLaneEntry(
    { laneId: 'a::b::c', authority: 'a', artifactClass: 'b', scope: {} },
    [],
    [],
  );
  const preliminary = buildOverallRollup([lane], { totalDiscovered: 3, hasCorruption: false });
  assert.equal(preliminary.sealed, false, 'sealed defaults to false');
  const sealed = buildOverallRollup([lane], { totalDiscovered: 3, hasCorruption: false, sealed: true });
  assert.equal(sealed.sealed, true, 'seal:true propagates to overall.sealed');
}

// 5. The CLI --seal flag flows through to the written registry and stdout JSON;
//    its absence writes a preliminary registry. The YAML seed/refresh omit it
//    and only the synthesis step passes it.
function testCliSealFlag() {
  const { specFolder, alignmentDir } = makeSpecFolder('cli');
  const laneId = seedLane(alignmentDir, [{ path: 'src/a.mjs' }]);
  appendState(alignmentDir, { type: 'iteration', laneId, artifactsChecked: ['src/a.mjs'], newFindingsRatio: 0 });
  const registryPath = path.join(alignmentDir, 'deep-alignment-findings-registry.json');

  const plainOut = JSON.parse(execFileSync('node', [REDUCER, specFolder], { encoding: 'utf8' }));
  assert.equal(plainOut.sealed, false, 'stdout reports sealed=false without --seal');
  assert.equal(JSON.parse(fs.readFileSync(registryPath, 'utf8')).overall.sealed, false, 'written registry is preliminary without --seal');

  const sealOut = JSON.parse(execFileSync('node', [REDUCER, specFolder, '--seal'], { encoding: 'utf8' }));
  assert.equal(sealOut.sealed, true, 'stdout reports sealed=true with --seal');
  assert.equal(JSON.parse(fs.readFileSync(registryPath, 'utf8')).overall.sealed, true, '--seal writes a sealed registry');
}

testSeedIsPreliminaryFailClosed();
testCompletedIterationUnsealedThenSealed();
testSealDoesNotLaunderFailClosed();
testBuildOverallRollupSealFlag();
testCliSealFlag();
console.log('[deep-alignment] reducer seal-state regression passed');
