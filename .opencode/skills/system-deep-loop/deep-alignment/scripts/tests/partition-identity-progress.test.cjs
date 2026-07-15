#!/usr/bin/env node

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Deep-Alignment Partitioner — identity-based progress regression          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// Proves the corpus partitioner advances by artifact identity, not by a numeric
// prefix cursor. Before this guard, a lane whose iteration reported a non-prefix
// or duplicated set of checked artifacts advanced artifactsChecked as a bare
// count, so slice(count, count+batch) could re-offer an already-checked artifact
// and skip a never-checked one. A bare-count emitter still falls back to the
// prefix cursor (back-compat with simple emitters and fixtures).

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const { resolveLanesFromConfig } = require('../scoping.cjs');
const { partitionCorpus, resolveNextSlice } = require('../partition-corpus.cjs');
const { laneKey } = require('../../../runtime/scripts/reduce-alignment-state.cjs');

function makeSpecFolder(slug) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `align-partition-${slug}-`)));
  const specFolder = path.join(root, 'specs', 'fixture');
  const alignmentDir = path.join(specFolder, 'alignment');
  fs.mkdirSync(path.join(alignmentDir, 'deltas'), { recursive: true });
  return { specFolder, alignmentDir };
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function seedLane(alignmentDir, artifacts, adapter) {
  const rawLane = { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/'] } };
  if (adapter) rawLane.adapter = adapter;
  const lanes = resolveLanesFromConfig([rawLane]);
  const lane = lanes[0];
  const id = laneKey(lane);
  writeJson(path.join(alignmentDir, 'deep-alignment-config.json'), { alignmentTarget: 'partition fixture', lanes });
  writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
    lanes: [{ laneId: id, authority: lane.authority, artifactClass: lane.artifactClass, adapter: lane.adapter, scope: lane.scope, artifacts }],
  });
  return id;
}

function appendState(alignmentDir, obj) {
  fs.appendFileSync(path.join(alignmentDir, 'deep-alignment-state.jsonl'), `${JSON.stringify(obj)}\n`, 'utf8');
}

const CORPUS = ['docs/a.md', 'docs/b.md', 'docs/c.md', 'docs/d.md', 'docs/e.md'].map((p) => ({ path: p }));

// 1. Non-prefix checked set: the partitioner must re-offer the skipped artifact
//    and never re-offer an already-checked one. The old prefix cursor
//    (artifactsChecked=2 -> slice(2,...)) would have skipped b and re-handed c.
function testIdentityProgressReoffersSkipped() {
  const { specFolder, alignmentDir } = makeSpecFolder('identity');
  const laneId = seedLane(alignmentDir, CORPUS);
  appendState(alignmentDir, { type: 'iteration', laneId, artifactsChecked: ['docs/a.md', 'docs/c.md'], newFindingsRatio: 0 });

  const slice = partitionCorpus(specFolder, { batchSize: 5 });
  assert.equal(slice.done, false);
  const paths = slice.artifactsSlice.map((a) => a.path);
  assert.deepEqual(paths, ['docs/b.md', 'docs/d.md', 'docs/e.md'], 'next slice must be the unchecked set by identity (b re-offered, a/c excluded)');
}

// 2. Bare-count emitter: the prefix cursor is preserved (back-compat).
function testCountOnlyFallbackKeepsPrefixCursor() {
  const { specFolder, alignmentDir } = makeSpecFolder('countfallback');
  const laneId = seedLane(alignmentDir, CORPUS);
  appendState(alignmentDir, { type: 'iteration', laneId, artifactsChecked: 2, newFindingsRatio: 0 });

  const slice = partitionCorpus(specFolder, { batchSize: 5 });
  assert.equal(slice.done, false);
  const paths = slice.artifactsSlice.map((a) => a.path);
  assert.deepEqual(paths, ['docs/c.md', 'docs/d.md', 'docs/e.md'], 'bare-count emitter falls back to the prefix cursor');
}

// 3. Pure-function guard on resolveNextSlice: duplicate/out-of-order checked ids
//    do not inflate past the corpus, and a fully-checked lane reports done.
function testResolveNextSliceUnit() {
  const corpusLanes = [{ laneId: 'L', authority: 'sk-doc', artifactClass: 'docs', scope: {}, artifacts: CORPUS }];
  const laneEntries = [{ laneId: 'L', artifactsChecked: 3, checkedArtifactIds: ['docs/c.md', 'docs/a.md', 'docs/b.md', 'docs/a.md'] }];
  const slice = resolveNextSlice(corpusLanes, laneEntries, 5);
  assert.deepEqual(slice.artifactsSlice.map((a) => a.path), ['docs/d.md', 'docs/e.md']);

  const allChecked = [{ laneId: 'L', artifactsChecked: 5, checkedArtifactIds: CORPUS.map((a) => a.path) }];
  assert.deepEqual(resolveNextSlice(corpusLanes, allChecked, 5), { done: true });
}

// 4. A peer-adapter lane retains its adapter discriminator through partitioning.
function testPeerAdapterLaneWalksPartition() {
  const { specFolder, alignmentDir } = makeSpecFolder('peer-adapter');
  const artifacts = [{ path: '.opencode/commands/deep/alignment.md' }];
  seedLane(alignmentDir, artifacts, 'sk-doc-command');

  const slice = partitionCorpus(specFolder, { batchSize: 5 });
  assert.equal(slice.done, false);
  assert.equal(slice.authority, 'sk-doc');
  assert.equal(slice.adapter, 'sk-doc-command');
  assert.deepEqual(slice.artifactsSlice, artifacts);
}

testIdentityProgressReoffersSkipped();
testCountOnlyFallbackKeepsPrefixCursor();
testResolveNextSliceUnit();
testPeerAdapterLaneWalksPartition();
console.log('[deep-alignment] partition identity-progress regression passed');
