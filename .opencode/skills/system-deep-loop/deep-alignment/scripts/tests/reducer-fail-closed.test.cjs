#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Alignment Reducer — fail-closed regression                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Proves the reducer does NOT emit a clean PASS when a discovered corpus was
// never audited (an errored or empty first pass), and that it fails closed on a
// corrupted state log or an unrecognized finding severity. Complements
// state-machine-wiring.test.cjs, which covers the happy path. Before this
// guard, an all-NOT_APPLICABLE run over a non-empty corpus reduced to PASS
// (nothingToConverge), and unrecognized severities were silently dropped.

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { resolveLanesFromConfig } = require('../scoping.cjs');
const { checkConvergence, DECISIONS } = require('../check-convergence.cjs');
const { reduceAlignmentState, laneKey } = require('../../../runtime/scripts/reduce-alignment-state.cjs');

function makeSpecFolder(slug) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `align-failclosed-${slug}-`)));
  const specFolder = path.join(root, 'specs', 'fixture');
  const alignmentDir = path.join(specFolder, 'alignment');
  fs.mkdirSync(path.join(alignmentDir, 'deltas'), { recursive: true });
  return { root, specFolder, alignmentDir };
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function seedLane(alignmentDir, artifacts) {
  const lanes = resolveLanesFromConfig([
    { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/'] } },
  ]);
  const lane = lanes[0];
  const id = laneKey(lane);
  writeJson(path.join(alignmentDir, 'deep-alignment-config.json'), { alignmentTarget: 'fail-closed fixture', lanes });
  writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
    lanes: [{ laneId: id, authority: lane.authority, artifactClass: lane.artifactClass, scope: lane.scope, artifacts }],
  });
  return id;
}

function appendState(alignmentDir, line) {
  fs.appendFileSync(path.join(alignmentDir, 'deep-alignment-state.jsonl'), `${line}\n`, 'utf8');
}

// 1. Non-empty corpus + a first pass that checked nothing MUST NOT be PASS.
function testUncheckedCorpusIsNotPass() {
  const { specFolder, alignmentDir } = makeSpecFolder('unchecked');
  const laneId = seedLane(alignmentDir, [{ path: 'docs/a.md' }, { path: 'docs/b.md' }]);
  appendState(alignmentDir, JSON.stringify({ type: 'iteration', laneId, artifactsChecked: 0, newFindingsRatio: 0 }));

  const { registry } = reduceAlignmentState(specFolder, { write: false });
  assert.equal(registry.overall.verdict, 'FAIL', 'unchecked non-empty corpus must fail closed, not PASS');
  assert.equal(registry.overall.incompleteCoverage, true);
  assert.equal(registry.overall.nothingToConverge, false, 'a non-empty corpus is not "nothing to converge"');

  const decision = checkConvergence(specFolder, { maxIterations: 5, stabilityWindow: 2 });
  assert.notEqual(decision.decision, DECISIONS.NOTHING_TO_CONVERGE, 'convergence must not exit clean on an unaudited corpus');
}

// 2. Genuinely empty corpus (discover found nothing) is still a trivial PASS.
function testEmptyCorpusIsTrivialPass() {
  const { specFolder, alignmentDir } = makeSpecFolder('empty');
  const laneId = seedLane(alignmentDir, []);
  appendState(alignmentDir, JSON.stringify({ type: 'iteration', laneId, artifactsChecked: 0, newFindingsRatio: 0 }));

  const { registry } = reduceAlignmentState(specFolder, { write: false });
  assert.equal(registry.overall.nothingToConverge, true);
  assert.equal(registry.overall.verdict, 'PASS');
}

// 3a. A corrupted state-log line fails closed.
function testCorruptStateFailsClosed() {
  const { specFolder, alignmentDir } = makeSpecFolder('corrupt');
  const laneId = seedLane(alignmentDir, [{ path: 'docs/a.md' }]);
  appendState(alignmentDir, JSON.stringify({ type: 'iteration', laneId, artifactsChecked: 1, newFindingsRatio: 0 }));
  appendState(alignmentDir, `{"type":"iteration","laneId":"${laneId}`); // truncated -> unparseable

  const { registry } = reduceAlignmentState(specFolder, { write: false });
  assert.equal(registry.hasCorruption, true);
  assert.equal(registry.overall.integrityFault, true);
  assert.equal(registry.overall.verdict, 'FAIL', 'corrupted state must fail closed');
}

// 3b. An unrecognized finding severity is counted, not silently dropped, and fails closed.
function testUnknownSeverityFailsClosed() {
  const { specFolder, alignmentDir } = makeSpecFolder('badsev');
  const laneId = seedLane(alignmentDir, [{ path: 'docs/a.md' }]);
  appendState(alignmentDir, JSON.stringify({ type: 'iteration', laneId, artifactsChecked: 1, newFindingsRatio: 0 }));
  fs.appendFileSync(
    path.join(alignmentDir, 'deltas', 'iter-001.jsonl'),
    `${JSON.stringify({ type: 'finding', laneId, finding: { severity: 'P9', type: 'x', message: 'bad', artifactPath: 'docs/a.md' } })}\n`,
    'utf8',
  );

  const { registry } = reduceAlignmentState(specFolder, { write: false });
  assert.equal(registry.overall.invalidSeverityCount, 1, 'unrecognized severity must be counted, not dropped');
  assert.equal(registry.overall.integrityFault, true);
  assert.equal(registry.overall.verdict, 'FAIL', 'unrecognized severity must fail closed');
}

testUncheckedCorpusIsNotPass();
testEmptyCorpusIsTrivialPass();
testCorruptStateFailsClosed();
testUnknownSeverityFailsClosed();
console.log('[deep-alignment] reducer fail-closed regression passed');
