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
  let output = line;
  try {
    const record = JSON.parse(line);
    if (Array.isArray(record.artifactsChecked) && !Object.prototype.hasOwnProperty.call(record, 'artifactEvidence')) {
      output = JSON.stringify({
        ...record,
        dispatchedSlice: record.artifactsChecked,
        artifactEvidence: record.artifactsChecked.map((artifact) => ({
          artifact,
          kind: 'content-digest',
          contentDigest: `sha256:${'a'.repeat(64)}`,
        })),
      });
    }
  } catch {}
  fs.appendFileSync(path.join(alignmentDir, 'deep-alignment-state.jsonl'), `${output}\n`, 'utf8');
}

// 1. Non-empty corpus + a first pass that checked nothing MUST NOT be PASS.
function testUncheckedCorpusIsNotPass() {
  const { specFolder, alignmentDir } = makeSpecFolder('unchecked');
  const laneId = seedLane(alignmentDir, [{ path: 'docs/a.md' }, { path: 'docs/b.md' }]);
  appendState(alignmentDir, JSON.stringify({ type: 'iteration', laneId, artifactsChecked: 0, newFindingsRatio: 0, status: 'complete' }));

  const { registry } = reduceAlignmentState(specFolder, { write: false });
  assert.equal(registry.overall.verdict, 'FAIL', 'unchecked non-empty corpus must fail closed, not PASS');
  assert.equal(registry.overall.incompleteCoverage, true);
  assert.equal(registry.overall.nothingToConverge, false, 'a non-empty corpus is not "nothing to converge"');

  const decision = checkConvergence(specFolder, { maxIterations: 5, stabilityWindow: 2 });
  assert.notEqual(decision.decision, DECISIONS.NOTHING_TO_CONVERGE, 'convergence must not exit clean on an unaudited corpus');
}

// 1b. Activity in one lane must not hide an untouched non-empty lane.
function testPartialLaneCoverageIsNotPass() {
  const { specFolder, alignmentDir } = makeSpecFolder('partial-lanes');
  const lanes = resolveLanesFromConfig([
    { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/'] } },
    { authority: 'sk-code', artifactClass: 'code', scope: { type: 'paths', values: ['src/'] } },
  ]);
  const laneIds = lanes.map(laneKey);
  writeJson(path.join(alignmentDir, 'deep-alignment-config.json'), { alignmentTarget: 'partial fixture', lanes });
  writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
    lanes: lanes.map((lane, index) => ({
      laneId: laneIds[index],
      authority: lane.authority,
      artifactClass: lane.artifactClass,
      scope: lane.scope,
      artifacts: [{ path: index === 0 ? 'docs/a.md' : 'src/a.cjs' }],
    })),
  });
  appendState(alignmentDir, JSON.stringify({
    type: 'iteration',
    laneId: laneIds[0],
    artifactsChecked: ['docs/a.md'],
    newFindingsRatio: 0,
    status: 'complete',
  }));

  const { registry } = reduceAlignmentState(specFolder, { write: false });
  assert.equal(registry.overall.verdict, 'FAIL');
  assert.equal(registry.overall.incompleteCoverage, true);
  assert.equal(registry.overall.artifactsChecked, 1);
  assert.equal(registry.overall.artifactsDiscovered, 2);
  assert.equal(registry.lanes[1].verdict, 'FAIL', 'an untouched non-empty lane is not NOT_APPLICABLE');
}

// 2. Genuinely empty corpus (discover found nothing) is still a trivial PASS.
function testEmptyCorpusIsTrivialPass() {
  const { specFolder, alignmentDir } = makeSpecFolder('empty');
  const laneId = seedLane(alignmentDir, []);
  appendState(alignmentDir, JSON.stringify({ type: 'iteration', laneId, artifactsChecked: 0, newFindingsRatio: 0, status: 'complete' }));

  const { registry } = reduceAlignmentState(specFolder, { write: false });
  assert.equal(registry.overall.nothingToConverge, true);
  assert.equal(registry.overall.verdict, 'PASS');
}

// 3a. A corrupted state-log line fails closed.
function testCorruptStateFailsClosed() {
  const { specFolder, alignmentDir } = makeSpecFolder('corrupt');
  const laneId = seedLane(alignmentDir, [{ path: 'docs/a.md' }]);
  appendState(alignmentDir, JSON.stringify({ type: 'iteration', laneId, artifactsChecked: 1, newFindingsRatio: 0, status: 'complete' }));
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
  appendState(alignmentDir, JSON.stringify({ type: 'iteration', laneId, artifactsChecked: 1, newFindingsRatio: 0, status: 'complete' }));
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

// 4. Canonical iteration findingDetails remain authoritative when a delta row
// is absent, and summary-only findings render useful report text.
function testEmbeddedFindingDetailsAreReduced() {
  const { specFolder, alignmentDir } = makeSpecFolder('embedded-findings');
  const laneId = seedLane(alignmentDir, [{ path: 'docs/a.md' }]);
  appendState(alignmentDir, JSON.stringify({
    type: 'iteration',
    laneId,
    artifactsChecked: ['docs/a.md'],
    newFindingsRatio: 1,
    status: 'complete',
    findingDetails: [{
      severity: 'P1',
      type: 'reality-drift',
      summary: 'The documented behavior does not match the live surface.',
      artifactPath: 'docs/a.md',
    }],
  }));

  const { registry, report } = reduceAlignmentState(specFolder, { write: false });
  assert.equal(registry.overall.verdict, 'CONDITIONAL');
  assert.equal(registry.overall.findingsBySeverity.P1, 1);
  assert.match(report, /The documented behavior does not match the live surface\./);
}

testUncheckedCorpusIsNotPass();
testPartialLaneCoverageIsNotPass();
testEmptyCorpusIsTrivialPass();
testCorruptStateFailsClosed();
testUnknownSeverityFailsClosed();
testEmbeddedFindingDetailsAreReduced();
console.log('[deep-alignment] reducer fail-closed regression passed');
