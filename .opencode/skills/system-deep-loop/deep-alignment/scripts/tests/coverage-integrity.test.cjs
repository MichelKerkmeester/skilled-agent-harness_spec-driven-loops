#!/usr/bin/env node

'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { resolveLanesFromConfig } = require('../scoping.cjs');
const {
  checkConvergence,
  DECISIONS,
  readCorpusSizes,
} = require('../check-convergence.cjs');
const {
  laneKey,
  reduceAlignmentState,
} = require('../../../runtime/scripts/reduce-alignment-state.cjs');

function makeSpecFolder(slug) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), `align-coverage-${slug}-`)));
  const specFolder = path.join(root, 'specs', 'fixture');
  const alignmentDir = path.join(specFolder, 'alignment');
  fs.mkdirSync(path.join(alignmentDir, 'deltas'), { recursive: true });
  return { root, specFolder, alignmentDir };
}

function writeJson(filePath, value) {
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function seedConfig(alignmentDir) {
  return seedConfigForDescriptors(alignmentDir, [
    { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/'] } },
  ])[0];
}

function seedConfigForDescriptors(alignmentDir, descriptors) {
  const lanes = resolveLanesFromConfig(descriptors);
  writeJson(path.join(alignmentDir, 'deep-alignment-config.json'), {
    alignmentTarget: 'coverage integrity fixture',
    lanes,
  });
  return lanes;
}

function addArtifactEvidence(record, artifactsChecked, options) {
  if (!Array.isArray(artifactsChecked)) return;
  const hasEvidence = Object.prototype.hasOwnProperty.call(options, 'artifactEvidence');
  record.dispatchedSlice = options.dispatchedSlice ?? artifactsChecked;
  record.artifactEvidence = hasEvidence
    ? options.artifactEvidence
    : artifactsChecked.map((artifact) => ({
      artifact,
      kind: 'content-digest',
      contentDigest: `sha256:${'a'.repeat(64)}`,
    }));
}

function appendIteration(alignmentDir, laneId, artifactsChecked, options = {}) {
  const { status = 'complete', includeStatus = true, newFindingsRatio = 0 } = options;
  const record = { type: 'iteration', laneId, artifactsChecked, newFindingsRatio };
  addArtifactEvidence(record, artifactsChecked, options);
  if (includeStatus) record.status = status;
  fs.writeFileSync(
    path.join(alignmentDir, 'deep-alignment-state.jsonl'),
    `${JSON.stringify(record)}\n`,
    'utf8',
  );
}

function appendIterationRecord(alignmentDir, laneId, artifactsChecked, options = {}) {
  const { status = 'complete', includeStatus = true, newFindingsRatio = 0 } = options;
  const record = { type: 'iteration', laneId, artifactsChecked, newFindingsRatio };
  addArtifactEvidence(record, artifactsChecked, options);
  if (includeStatus) record.status = status;
  fs.appendFileSync(
    path.join(alignmentDir, 'deep-alignment-state.jsonl'),
    `${JSON.stringify(record)}\n`,
    'utf8',
  );
}

function workflowAssetPath(fileName) {
  return path.resolve(
    __dirname,
    '..', '..', '..', '..', '..',
    'commands', 'deep', 'assets', fileName,
  );
}

test('applicable lanes with an absent corpus stay at zero coverage', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('absent');
  try {
    const lane = seedConfig(alignmentDir);
    appendIteration(alignmentDir, laneKey(lane), ['docs/a.md']);

    const corpus = readCorpusSizes(alignmentDir);
    assert.deepEqual(corpus.sizes, {});
    assert.equal(corpus.corpusState, 'absent');
    assert.equal(corpus.integrityFault, null);

    const decision = checkConvergence(specFolder, { stabilityWindow: 1 });
    assert.equal(decision.coverage.ratio, 0);
    assert.equal(decision.coverage.checked, 0);
    assert.equal(decision.coverage.discovered, 0);
    assert.notEqual(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('malformed corpus is reported as an integrity fault and fails closed', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('malformed');
  try {
    const lane = seedConfig(alignmentDir);
    fs.writeFileSync(path.join(alignmentDir, 'deep-alignment-corpus.json'), '{invalid json\n', 'utf8');
    appendIteration(alignmentDir, laneKey(lane), ['docs/a.md']);

    const corpus = readCorpusSizes(alignmentDir);
    assert.equal(corpus.integrityFault.code, 'CORPUS_JSON_PARSE_ERROR');
    assert.equal(corpus.corpusState, 'present-malformed');

    const reduced = reduceAlignmentState(specFolder, { write: false });
    const decision = checkConvergence(specFolder, { stabilityWindow: 1 });
    assert.equal(reduced.registry.integrity.corpusIntegrityFault.code, 'CORPUS_JSON_PARSE_ERROR');
    assert.equal(reduced.registry.overall.integrityFault, true);
    assert.equal(reduced.registry.overall.verdict, 'FAIL');
    assert.equal(reduced.registry.integrity.integrityFault, true);
    assert.equal(decision.integrity.corpusIntegrityFault.code, 'CORPUS_JSON_PARSE_ERROR');
    assert.equal(decision.integrityFault, true);
    assert.equal(decision.overallVerdict, 'FAIL');
    assert.notEqual(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('integrity failure outranks the iteration cap and cannot be sealed', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('integrity-cap');
  try {
    const lane = seedConfig(alignmentDir);
    fs.writeFileSync(path.join(alignmentDir, 'deep-alignment-corpus.json'), '{invalid json\n', 'utf8');
    appendIteration(alignmentDir, laneKey(lane), ['docs/a.md']);

    const decision = checkConvergence(specFolder, { maxIterations: 1, stabilityWindow: 1 });
    assert.equal(decision.decision, DECISIONS.INTEGRITY_FAILURE);
    assert.notEqual(decision.decision, DECISIONS.STOP_MAX_ITERATIONS);
    assert.equal(decision.overallVerdict, 'FAIL');

    const sealed = reduceAlignmentState(specFolder, { write: false, seal: true }).registry.overall;
    assert.equal(sealed.integrityFault, true);
    assert.equal(sealed.verdict, 'FAIL');
    assert.equal(sealed.sealed, false);

    for (const fileName of ['deep-alignment-auto.yaml', 'deep-alignment-confirm.yaml']) {
      const workflow = fs.readFileSync(workflowAssetPath(fileName), 'utf8');
      assert.match(workflow, /INTEGRITY_FAILURE/);
      assert.match(workflow, /if_integrity_failure: \{ halt: true, status: "FAIL"/);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('integrity failure outranks the cap when convergence mode is off', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('integrity-forced-depth');
  try {
    const lane = seedConfig(alignmentDir);
    fs.writeFileSync(path.join(alignmentDir, 'deep-alignment-corpus.json'), '{invalid json\n', 'utf8');
    appendIteration(alignmentDir, laneKey(lane), ['docs/a.md']);

    const decision = checkConvergence(specFolder, {
      maxIterations: 1,
      stabilityWindow: 1,
      convergenceMode: 'off',
    });
    assert.equal(decision.decision, DECISIONS.INTEGRITY_FAILURE);
    assert.notEqual(decision.decision, DECISIONS.STOP_MAX_ITERATIONS);
    assert.equal(decision.integrityFault, true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('clean incomplete coverage at the cap still seals a FAIL result', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('incomplete-cap');
  try {
    const lane = seedConfig(alignmentDir);
    const id = laneKey(lane);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: id, ...lane, artifacts: [{ path: 'docs/a.md' }, { path: 'docs/b.md' }] }],
    });
    appendIteration(alignmentDir, id, 1);

    const decision = checkConvergence(specFolder, { maxIterations: 1, stabilityWindow: 1 });
    assert.equal(decision.decision, DECISIONS.STOP_MAX_ITERATIONS);
    assert.equal(decision.integrityFault, false);
    const sealed = reduceAlignmentState(specFolder, { write: false, seal: true }).registry.overall;
    assert.equal(sealed.verdict, 'FAIL');
    assert.equal(sealed.sealed, true);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('zero applicable lanes retain NOTHING_TO_CONVERGE', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('nothing');
  try {
    const lane = seedConfig(alignmentDir);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: laneKey(lane), ...lane, artifacts: [] }],
    });

    const reduced = reduceAlignmentState(specFolder, { write: false });
    const decision = checkConvergence(specFolder);
    assert.equal(reduced.registry.overall.nothingToConverge, true);
    assert.equal(decision.decision, DECISIONS.NOTHING_TO_CONVERGE);
    assert.equal(decision.coverage, null);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('unknown checked identifiers do not credit coverage and are surfaced', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('unknown');
  try {
    const lane = seedConfig(alignmentDir);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: laneKey(lane), ...lane, artifacts: [
        { path: 'docs/a.md' },
        { path: 'docs/b.md' },
        { target: 'live-docs', targetType: 'surface' },
      ] }],
    });
    appendIteration(alignmentDir, laneKey(lane), ['docs/a.md', 'docs/ghost.md']);

    const reduced = reduceAlignmentState(specFolder, { write: false });
    const entry = reduced.registry.lanes[0];
    const decision = checkConvergence(specFolder, { stabilityWindow: 1 });
    assert.equal(entry.artifactsChecked, 2);
    assert.equal(entry.creditedArtifactsChecked, 1);
    assert.deepEqual(entry.unknownCheckedIds, ['docs/ghost.md']);
    assert.equal(entry.unidentifiableArtifactCount, 0);
    assert.equal(reduced.registry.overall.unknownCheckedIdCount, 1);
    assert.equal(reduced.registry.overall.unidentifiableArtifactCount, 0);
    assert.equal(decision.coverage.checked, 1);
    assert.equal(decision.coverage.discovered, 3);
    assert.equal(decision.coverage.ratio, 0.333);
    assert.notEqual(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('canonical corpus paths receive their existing coverage credit', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('positive');
  try {
    const lane = seedConfig(alignmentDir);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: laneKey(lane), ...lane, artifacts: [{ path: 'docs/a.md' }, { path: 'docs/b.md' }] }],
    });
    appendIteration(alignmentDir, laneKey(lane), ['docs/a.md', 'docs/b.md']);

    const reduced = reduceAlignmentState(specFolder, { write: false });
    const decision = checkConvergence(specFolder, { stabilityWindow: 1 });
    assert.equal(reduced.registry.lanes[0].artifactsChecked, 2);
    assert.deepEqual(reduced.registry.lanes[0].unknownCheckedIds, []);
    assert.equal(decision.coverage.ratio, 1);
    assert.equal(decision.coverage.checked, 2);
    assert.equal(decision.coverage.discovered, 2);
    assert.equal(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('corpus integrity fault cannot converge at a zero coverage threshold', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('threshold-zero');
  try {
    const lane = seedConfig(alignmentDir);
    fs.writeFileSync(path.join(alignmentDir, 'deep-alignment-corpus.json'), '{invalid json\n', 'utf8');
    appendIteration(alignmentDir, laneKey(lane), ['docs/a.md']);

    const decision = checkConvergence(specFolder, { stabilityWindow: 1, coverageThreshold: 0 });
    assert.equal(decision.coverage.met, false);
    assert.equal(decision.coverage.ratio, 0);
    assert.equal(decision.integrityFault, true);
    assert.match(decision.reason, /integrity fault/);
    assert.notEqual(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('a configured lane missing from a non-empty corpus is an integrity fault', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('missing-configured');
  try {
    const lanes = seedConfigForDescriptors(alignmentDir, [
      { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/'] } },
      { authority: 'sk-code', artifactClass: 'code', scope: { type: 'paths', values: ['src/'] } },
    ]);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: laneKey(lanes[0]), ...lanes[0], artifacts: [{ path: 'docs/a.md' }] }],
    });
    appendIteration(alignmentDir, laneKey(lanes[0]), ['docs/a.md']);

    const expectedLaneIds = new Set(lanes.map(laneKey));
    assert.equal(readCorpusSizes(alignmentDir, expectedLaneIds).integrityFault.code, 'CORPUS_CONFIG_LANE_MISSING');
    assert.equal(readCorpusSizes(alignmentDir, expectedLaneIds).corpusState, 'configured-lane-missing');
    const reduced = reduceAlignmentState(specFolder, { write: false });
    const decision = checkConvergence(specFolder, { stabilityWindow: 1 });
    assert.equal(reduced.registry.integrity.corpusIntegrityFault.code, 'CORPUS_CONFIG_LANE_MISSING');
    assert.equal(reduced.registry.lanes[1].verdict, 'FAIL');
    assert.equal(decision.integrity.corpusIntegrityFault.code, 'CORPUS_CONFIG_LANE_MISSING');
    assert.equal(decision.coverage.ratio, 0);
    assert.notEqual(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('duplicate corpus laneIds are typed integrity faults in both readers', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('duplicate-lane');
  try {
    const lane = seedConfig(alignmentDir);
    const entry = { laneId: laneKey(lane), ...lane, artifacts: [{ path: 'docs/a.md' }] };
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), { lanes: [entry, entry] });
    appendIteration(alignmentDir, laneKey(lane), ['docs/a.md']);

    const expectedLaneIds = new Set([laneKey(lane)]);
    assert.equal(readCorpusSizes(alignmentDir, expectedLaneIds).integrityFault.code, 'CORPUS_DUPLICATE_LANE_ID');
    const reduced = reduceAlignmentState(specFolder, { write: false });
    const decision = checkConvergence(specFolder, { stabilityWindow: 1 });
    assert.equal(reduced.registry.integrity.corpusIntegrityFault.code, 'CORPUS_DUPLICATE_LANE_ID');
    assert.equal(decision.integrity.corpusIntegrityFault.code, 'CORPUS_DUPLICATE_LANE_ID');
    assert.equal(decision.integrityFault, true);
    assert.notEqual(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('duplicate lane IDs remain typed faults when the scope contains a comma', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('duplicate-comma-scope');
  try {
    const lane = seedConfigForDescriptors(alignmentDir, [
      { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/a, docs/b'] } },
    ])[0];
    const laneId = laneKey(lane);
    const entry = { laneId, ...lane, artifacts: [{ path: 'docs/a, docs/b/index.md' }] };
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), { lanes: [entry, entry] });
    appendIteration(alignmentDir, laneId, ['docs/a, docs/b/index.md']);

    const expectedLaneIds = new Set([laneId]);
    assert.notEqual(laneId, laneKey({ ...lane, scope: { type: 'paths', values: ['docs/a', 'docs/b'] } }));
    assert.equal(readCorpusSizes(alignmentDir, expectedLaneIds).integrityFault.code, 'CORPUS_DUPLICATE_LANE_ID');
    assert.equal(reduceAlignmentState(specFolder, { write: false }).registry.integrity.corpusIntegrityFault.code, 'CORPUS_DUPLICATE_LANE_ID');
    assert.equal(checkConvergence(specFolder, { stabilityWindow: 1 }).integrity.corpusIntegrityFault.code, 'CORPUS_DUPLICATE_LANE_ID');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('an orphan corpus lane is a typed integrity fault in both readers', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('orphan-lane');
  try {
    const lane = seedConfig(alignmentDir);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{
        laneId: 'orphan-authority::orphan-class::orphan-scope',
        authority: 'orphan-authority',
        artifactClass: 'orphan-class',
        scope: { type: 'paths', values: ['orphan/'] },
        artifacts: [{ path: 'orphan/a.txt' }],
      }],
    });
    appendIteration(alignmentDir, laneKey(lane), ['docs/a.md']);

    const expectedLaneIds = new Set([laneKey(lane)]);
    assert.equal(readCorpusSizes(alignmentDir, expectedLaneIds).integrityFault.code, 'CORPUS_ORPHAN_LANE_ID');
    const reduced = reduceAlignmentState(specFolder, { write: false });
    const decision = checkConvergence(specFolder, { stabilityWindow: 1 });
    assert.equal(reduced.registry.integrity.corpusIntegrityFault.code, 'CORPUS_ORPHAN_LANE_ID');
    assert.equal(decision.integrity.corpusIntegrityFault.code, 'CORPUS_ORPHAN_LANE_ID');
    assert.equal(decision.integrityFault, true);
    assert.notEqual(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('an absent corpus reports distinct pre-discovery state', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('pre-discovery');
  try {
    const lane = seedConfig(alignmentDir);
    appendIteration(alignmentDir, laneKey(lane), ['docs/a.md']);

    const reduced = reduceAlignmentState(specFolder, { write: false });
    const decision = checkConvergence(specFolder, { stabilityWindow: 1 });
    assert.equal(reduced.registry.integrity.corpusPresent, false);
    assert.equal(reduced.registry.overall.discoveryIncomplete, true);
    assert.equal(reduced.registry.overall.nothingToConverge, false);
    assert.equal(decision.decision, DECISIONS.DISCOVERY_INCOMPLETE);
    assert.equal(decision.integrity.discoveryIncomplete, true);
    assert.equal(decision.integrity.corpusPresent, false);
    assert.equal(decision.integrityFault, false);
    assert.notEqual(decision.decision, DECISIONS.NOTHING_TO_CONVERGE);
    assert.notEqual(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('a present valid corpus with zero artifacts remains NOTHING_TO_CONVERGE', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('present-empty-regression');
  try {
    const lane = seedConfig(alignmentDir);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: laneKey(lane), ...lane, artifacts: [] }],
    });

    const reduced = reduceAlignmentState(specFolder, { write: false });
    const decision = checkConvergence(specFolder);
    assert.equal(reduced.registry.integrity.corpusPresent, true);
    assert.equal(reduced.registry.integrity.corpusState, 'present-valid-zero-artifacts');
    assert.equal(reduced.registry.overall.nothingToConverge, true);
    assert.equal(decision.decision, DECISIONS.NOTHING_TO_CONVERGE);
    assert.equal(decision.integrity.discoveryIncomplete, false);
    assert.notEqual(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('valid corpus and checked paths retain full-credit convergence', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('positive-round-two');
  try {
    const lane = seedConfig(alignmentDir);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: laneKey(lane), ...lane, artifacts: [{ path: 'docs/a.md' }, { path: 'docs/b.md' }] }],
    });
    appendIteration(alignmentDir, laneKey(lane), ['docs/a.md', 'docs/b.md']);

    const decision = checkConvergence(specFolder, { stabilityWindow: 1, coverageThreshold: 1 });
    assert.equal(decision.coverage.ratio, 1);
    assert.equal(decision.coverage.checked, 2);
    assert.equal(decision.coverage.discovered, 2);
    assert.equal(decision.integrityFault, false);
    assert.equal(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('repeated internal scope spaces produce one honest lane ID for both readers', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('lane-whitespace');
  try {
    const lane = seedConfigForDescriptors(alignmentDir, [
      { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/with  repeated spaces/'] } },
    ])[0];
    const honestLaneId = laneKey(lane);
    assert.match(honestLaneId, /^alignment-lane-v1:[0-9a-f]{64}$/);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: honestLaneId, ...lane, artifacts: [{ path: 'docs/with  repeated spaces/a.md' }] }],
    });
    appendIteration(alignmentDir, honestLaneId, ['docs/with  repeated spaces/a.md']);

    const direct = readCorpusSizes(alignmentDir, new Set([honestLaneId]));
    const reduced = reduceAlignmentState(specFolder, { write: false });
    const decision = checkConvergence(specFolder, { stabilityWindow: 1 });
    assert.equal(direct.integrityFault, null);
    assert.equal(reduced.registry.integrity.corpusIntegrityFault, null);
    assert.equal(reduced.registry.lanes[0].laneId, honestLaneId);
    assert.equal(decision.integrityFault, false);
    assert.equal(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('lane identity separates adapter, scope type, and comma-containing values', () => {
  const lanes = resolveLanesFromDescriptorsForIdentity();
  const ids = lanes.map(laneKey);
  assert.equal(new Set(ids).size, lanes.length);
});

function resolveLanesFromDescriptorsForIdentity() {
  return resolveLanesFromConfig([
    { authority: 'sk-design', artifactClass: 'designs', scope: { type: 'paths', values: ['docs/'] } },
    { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/a', 'docs/b'] } },
    { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/a, docs/b'] } },
    { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'globs', values: ['docs/'] } },
  ]);
}

test('a full-corpus claim without per-artifact evidence earns zero coverage', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('unearned-evidence');
  try {
    const lane = seedConfig(alignmentDir);
    const id = laneKey(lane);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: id, ...lane, artifacts: [{ path: 'docs/a.md' }, { path: 'docs/b.md' }] }],
    });
    appendIteration(alignmentDir, id, ['docs/a.md', 'docs/b.md'], {
      artifactEvidence: [],
      dispatchedSlice: ['docs/a.md', 'docs/b.md'],
    });

    const reduced = reduceAlignmentState(specFolder, { write: false });
    assert.equal(reduced.registry.lanes[0].creditedArtifactsChecked, 0);
    assert.equal(reduced.registry.overall.identityVerified, false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});





test('alignment registry names its actual convergence backend', () => {
  const registry = JSON.parse(fs.readFileSync(path.resolve(
    __dirname,
    '..', '..', '..', '..', '..', '..', '.opencode', 'skills', 'system-deep-loop', 'mode-registry.json',
  ), 'utf8'));
  const alignment = registry.modes.find((mode) => mode.workflowMode === 'alignment');
  assert.equal(alignment.runtimeLoopType, null);
  assert.equal(alignment.backendKind, 'alignment-convergence');
  assert.equal(alignment.convergenceBackend, 'deep-alignment/scripts/check-convergence.cjs');
  assert.equal(fs.existsSync(path.resolve(
    __dirname,
    '..', '..', '..', '..', '..', '..', '.opencode', 'skills', 'system-deep-loop', alignment.convergenceBackend,
  )), true);
});

test('duplicate and orphan corpus bytes produce identical typed verdicts in both readers', () => {
  const cases = [
    { slug: 'parity-duplicate', expected: 'CORPUS_DUPLICATE_LANE_ID' },
    { slug: 'parity-orphan', expected: 'CORPUS_ORPHAN_LANE_ID' },
  ];
  for (const { slug, expected } of cases) {
    const { root, specFolder, alignmentDir } = makeSpecFolder(slug);
    try {
      const lane = seedConfig(alignmentDir);
      const configuredLaneId = laneKey(lane);
      const entry = { laneId: configuredLaneId, ...lane, artifacts: [{ path: 'docs/a.md' }] };
      const corpusLanes = expected === 'CORPUS_DUPLICATE_LANE_ID'
        ? [entry, entry]
        : [{
          laneId: 'orphan-authority::orphan-class::orphan-scope',
          authority: 'orphan-authority',
          artifactClass: 'orphan-class',
          scope: { type: 'paths', values: ['orphan/'] },
          artifacts: [{ path: 'orphan/a.txt' }],
        }];
      writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), { lanes: corpusLanes });

      const direct = readCorpusSizes(alignmentDir, new Set([configuredLaneId]));
      const reduced = reduceAlignmentState(specFolder, { write: false });
      const decision = checkConvergence(specFolder, { stabilityWindow: 1 });
      assert.equal(direct.integrityFault.code, expected);
      assert.equal(reduced.registry.integrity.corpusIntegrityFault.code, expected);
      assert.equal(decision.integrity.corpusIntegrityFault.code, expected);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
});

test('configured lanes plus an empty corpus is a corpus integrity fault', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('empty-corpus-configured');
  try {
    const lanes = seedConfigForDescriptors(alignmentDir, [
      { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/'] } },
      { authority: 'sk-code', artifactClass: 'code', scope: { type: 'paths', values: ['src/'] } },
    ]);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), { lanes: [] });

    const expected = new Set(lanes.map(laneKey));
    const direct = readCorpusSizes(alignmentDir, expected);
    const reduced = reduceAlignmentState(specFolder, { write: false });
    const decision = checkConvergence(specFolder);
    assert.equal(direct.integrityFault.code, 'CORPUS_CONFIG_LANE_MISSING');
    assert.equal(reduced.registry.overall.integrityFault, true);
    assert.equal(reduced.registry.overall.nothingToConverge, false);
    assert.equal(decision.integrityFault, true);
    assert.notEqual(decision.decision, DECISIONS.NOTHING_TO_CONVERGE);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('missing and non-array config.lanes are typed faults, not clean no-ops', () => {
  for (const [slug, config] of [
    ['config-lanes-missing', { alignmentTarget: 'invalid config' }],
    ['config-lanes-non-array', { alignmentTarget: 'invalid config', lanes: 'not-an-array' }],
    ['config-lane-element-invalid', { alignmentTarget: 'invalid config', lanes: [{}] }],
    ['config-lane-scope-missing', {
      alignmentTarget: 'invalid config',
      lanes: [{ authority: 'sk-doc', artifactClass: 'docs' }],
    }],
  ]) {
    const { root, specFolder, alignmentDir } = makeSpecFolder(slug);
    try {
      writeJson(path.join(alignmentDir, 'deep-alignment-config.json'), config);
      writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), { lanes: [] });

      const reduced = reduceAlignmentState(specFolder, { write: false });
      const decision = checkConvergence(specFolder);
      assert.ok(reduced.registry.integrity.configLanesIntegrityFault);
      assert.match(reduced.registry.integrity.configLanesIntegrityFault.code, /^CONFIG_LANES_INVALID$|^CONFIG_LANE_INVALID$/);
      assert.equal(reduced.registry.overall.integrityFault, true);
      assert.equal(reduced.registry.overall.nothingToConverge, false);
      assert.ok(decision.integrity.configLanesIntegrityFault);
      assert.equal(decision.integrityFault, true);
      assert.equal(decision.decision, DECISIONS.INTEGRITY_FAILURE);
      assert.deepEqual(reduced.registry.lanes, []);
      assert.equal(reduced.registry.lanes.some((lane) => lane.laneId.includes('unknown-')), false);
      assert.notEqual(decision.decision, DECISIONS.NOTHING_TO_CONVERGE);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
});

test('repeated bare counts remain count-based and cannot satisfy complete coverage', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('count-only-repeated');
  try {
    const lane = seedConfig(alignmentDir);
    const id = laneKey(lane);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: id, ...lane, artifacts: [{ path: 'docs/a.md' }, { path: 'docs/b.md' }] }],
    });
    appendIterationRecord(alignmentDir, id, 2);
    appendIterationRecord(alignmentDir, id, 2);
    appendIterationRecord(alignmentDir, id, 2);

    const reduced = reduceAlignmentState(specFolder, { write: false });
    const decision = checkConvergence(specFolder, { stabilityWindow: 1 });
    assert.equal(reduced.registry.lanes[0].coverageBasis, 'count-based');
    assert.equal(reduced.registry.lanes[0].identityVerified, false);
    assert.equal(reduced.registry.lanes[0].artifactsChecked, 2);
    assert.equal(reduced.registry.lanes[0].creditedArtifactsChecked, 0);
    assert.equal(reduced.registry.lanes[0].coverageChecked, 0);
    assert.equal(reduced.registry.overall.incompleteCoverage, true);
    assert.equal(decision.coverage.basis, 'count-based');
    assert.equal(decision.coverage.identityVerified, false);
    assert.equal(decision.coverage.checked, 0);
    assert.equal(decision.coverage.reportedChecked, 2);
    assert.equal(decision.coverage.ratio, 0);
    assert.equal(decision.coverage.met, false);
    assert.notEqual(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('a zero threshold does not report met when no artifacts were audited', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('threshold-zero-unchecked');
  try {
    const lane = seedConfig(alignmentDir);
    const id = laneKey(lane);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: id, ...lane, artifacts: [{ path: 'docs/a.md' }] }],
    });
    appendIteration(alignmentDir, id, []);

    const decision = checkConvergence(specFolder, { stabilityWindow: 1, coverageThreshold: 0 });
    assert.equal(decision.coverage.checked, 0);
    assert.equal(decision.coverage.ratio, 0);
    assert.equal(decision.coverage.met, false);
    assert.equal(decision.integrityFault, false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('a valid configured zero-artifact corpus remains NOTHING_TO_CONVERGE', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('nothing-genuine');
  try {
    const lane = seedConfig(alignmentDir);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: laneKey(lane), ...lane, artifacts: [] }],
    });

    const decision = checkConvergence(specFolder);
    assert.equal(decision.decision, DECISIONS.NOTHING_TO_CONVERGE);
    assert.equal(decision.integrityFault, false);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('identity-reported paths retain full credit and keep CONVERGED reachable', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('identity-positive-control');
  try {
    const lane = seedConfig(alignmentDir);
    const id = laneKey(lane);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: id, ...lane, artifacts: [{ path: 'docs/a.md' }, { path: 'docs/b.md' }] }],
    });
    appendIteration(alignmentDir, id, ['docs/a.md', 'docs/b.md']);

    const reduced = reduceAlignmentState(specFolder, { write: false });
    const decision = checkConvergence(specFolder, { stabilityWindow: 1 });
    assert.equal(reduced.registry.lanes[0].coverageBasis, 'identity-verified');
    assert.equal(decision.coverage.ratio, 1);
    assert.equal(decision.coverage.met, true);
    assert.equal(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('verified paths can restore completeness after an earlier bare-count iteration', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('mixed-recoverable');
  try {
    const lane = seedConfig(alignmentDir);
    const id = laneKey(lane);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: id, ...lane, artifacts: [{ path: 'docs/a.md' }, { path: 'docs/b.md' }] }],
    });
    appendIterationRecord(alignmentDir, id, 1);
    appendIterationRecord(alignmentDir, id, ['docs/a.md', 'docs/b.md']);

    const reduced = reduceAlignmentState(specFolder, { write: false });
    const decision = checkConvergence(specFolder, { stabilityWindow: 2, coverageThreshold: 1 });
    assert.equal(reduced.registry.lanes[0].coverageBasis, 'mixed');
    assert.equal(reduced.registry.lanes[0].artifactsChecked, 2);
    assert.equal(reduced.registry.lanes[0].creditedArtifactsChecked, 2);
    assert.equal(reduced.registry.lanes[0].identityVerified, true);
    assert.equal(reduced.registry.lanes[0].incompleteCoverage, false);
    assert.equal(decision.coverage.identityVerified, true);
    assert.equal(decision.coverage.ratio, 1);
    assert.equal(decision.coverage.met, true);
    assert.equal(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('distinct valid scopes differing only in outer whitespace keep distinct lane IDs', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('outer-scope-whitespace');
  try {
    const lanes = seedConfigForDescriptors(alignmentDir, [
      { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/'] } },
      { authority: 'sk-doc', artifactClass: 'docs', scope: { type: 'paths', values: ['docs/ '] } },
    ]);
    const laneIds = lanes.map(laneKey);
    assert.notEqual(laneIds[0], laneIds[1]);
    assert.equal(new Set(laneIds).size, 2);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: lanes.map((lane, index) => ({
        laneId: laneIds[index],
        ...lane,
        artifacts: [{ path: `docs/${index}.md` }],
      })),
    });
    for (const [index, id] of laneIds.entries()) {
      appendIterationRecord(alignmentDir, id, [`docs/${index}.md`]);
    }

    const reduced = reduceAlignmentState(specFolder, { write: false });
    const decision = checkConvergence(specFolder, { stabilityWindow: 1 });
    assert.equal(reduced.registry.integrity.corpusIntegrityFault, null);
    assert.equal(reduced.registry.lanes.length, 2);
    assert.equal(decision.coverage.ratio, 1);
    assert.equal(decision.decision, DECISIONS.CONVERGED);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('workflow completion is refused when the terminal reducer reports unsealed', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('workflow-unsealed');
  try {
    const lane = seedConfig(alignmentDir);
    fs.writeFileSync(path.join(alignmentDir, 'deep-alignment-corpus.json'), '{invalid json\n', 'utf8');
    appendIteration(alignmentDir, laneKey(lane), ['docs/a.md']);

    const overall = reduceAlignmentState(specFolder, { write: false, seal: true }).registry.overall;
    assert.equal(overall.integrityFault, true);
    assert.equal(overall.sealed, false);

    for (const fileName of ['deep-alignment-auto.yaml', 'deep-alignment-confirm.yaml']) {
      const workflow = fs.readFileSync(workflowAssetPath(fileName), 'utf8');
      assert.match(workflow, /step_assert_synthesis_sealed:/);
      assert.match(workflow, /reducer_sealed: "sealed === true"/);
      assert.match(workflow, /UNSEALED_COMPLETION/);
      assert.match(workflow, /step_mark_config_complete:[\s\S]*requires: "reducer_sealed === true"/);
      assert.match(workflow, /(?:step_present_results|gate_synthesis_review):[\s\S]*requires: "reducer_sealed === true"/);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('completed-session bypass refuses an unsealed existing registry', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('completed-unsealed');
  try {
    const lane = seedConfig(alignmentDir);
    const configPath = path.join(alignmentDir, 'deep-alignment-config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.status = 'complete';
    writeJson(configPath, config);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: laneKey(lane), ...lane, artifacts: [{ path: 'docs/a.md' }] }],
    });
    appendIteration(alignmentDir, laneKey(lane), ['docs/a.md']);

    const existing = reduceAlignmentState(specFolder, { write: false }).registry.overall;
    assert.equal(existing.sealed, false);
    for (const fileName of ['deep-alignment-auto.yaml', 'deep-alignment-confirm.yaml']) {
      const workflow = fs.readFileSync(workflowAssetPath(fileName), 'utf8');
      assert.match(workflow, /on_completed_session:[\s\S]*existing_registry_sealed: "registry\.overall\.sealed === true"/);
      assert.match(workflow, /on_completed_session:[\s\S]*COMPLETED_SESSION_UNSEALED/);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('missing corpus prevents a completed session from sealing', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('completed-missing-corpus');
  try {
    const lane = seedConfig(alignmentDir);
    const configPath = path.join(alignmentDir, 'deep-alignment-config.json');
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.status = 'complete';
    writeJson(configPath, config);
    appendIteration(alignmentDir, laneKey(lane), ['docs/a.md']);

    const overall = reduceAlignmentState(specFolder, { write: false, seal: true }).registry.overall;
    assert.equal(overall.discoveryIncomplete, true);
    assert.equal(overall.sealed, false);
    assert.equal(overall.verdict, 'FAIL');
    for (const fileName of ['deep-alignment-auto.yaml', 'deep-alignment-confirm.yaml']) {
      const workflow = fs.readFileSync(workflowAssetPath(fileName), 'utf8');
      assert.match(workflow, /if_discovery_incomplete: \{ halt: true, status: "FAIL"/);
      assert.match(workflow, /UNSEALED_COMPLETION/);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('failed or unknown iteration statuses provide no coverage or stability evidence', () => {
  for (const [index, statusOptions] of [
    ['error', { status: 'error' }],
    ['stuck', { status: 'stuck' }],
    ['timeout', { status: 'timeout' }],
    ['unknown', { status: 'mystery' }],
    ['missing', { includeStatus: false }],
  ]) {
    const { root, specFolder, alignmentDir } = makeSpecFolder(`failed-status-${index}`);
    try {
      const lane = seedConfig(alignmentDir);
      const id = laneKey(lane);
      writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
        lanes: [{ laneId: id, ...lane, artifacts: [{ path: 'docs/a.md' }] }],
      });
      appendIteration(alignmentDir, id, ['docs/a.md'], statusOptions);

      const reduced = reduceAlignmentState(specFolder, { write: false });
      const decision = checkConvergence(specFolder, { maxIterations: 10, stabilityWindow: 1 });
      assert.equal(reduced.registry.lanes[0].artifactsChecked, 0);
      assert.equal(reduced.registry.lanes[0].creditedArtifactsChecked, 0);
      assert.equal(decision.coverage.checked, 0);
      assert.equal(decision.stability.sampleSize, 0);
      assert.equal(decision.stability.stable, false);
      assert.notEqual(decision.decision, DECISIONS.CONVERGED);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  }
});

test('failed iteration delta findings do not enter the rollup', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('failed-delta-finding');
  try {
    const lane = seedConfig(alignmentDir);
    const id = laneKey(lane);
    const failedIteration = {
      type: 'iteration',
      laneId: id,
      status: 'error',
      artifactsChecked: ['docs/a.md'],
      dispatchedSlice: ['docs/a.md'],
      artifactEvidence: [{
        artifact: 'docs/a.md',
        kind: 'content-digest',
        contentDigest: `sha256:${'a'.repeat(64)}`,
      }],
      findingDetails: [{ severity: 'P1', summary: 'failed iteration finding' }],
    };
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: id, ...lane, artifacts: [{ path: 'docs/a.md' }] }],
    });
    fs.writeFileSync(
      path.join(alignmentDir, 'deep-alignment-state.jsonl'),
      `${JSON.stringify(failedIteration)}\n`,
      'utf8',
    );
    fs.writeFileSync(
      path.join(alignmentDir, 'deltas', 'iter-001.jsonl'),
      `${JSON.stringify(failedIteration)}\n${JSON.stringify({
        type: 'finding',
        laneId: id,
        finding: { severity: 'P1', summary: 'failed delta finding' },
      })}\n`,
      'utf8',
    );

    const reduced = reduceAlignmentState(specFolder, { write: false });
    assert.equal(reduced.registry.overall.findingsBySeverity.P1, 0);
    assert.equal(reduced.registry.overall.verdict, 'FAIL');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('status-less delta findings inherit the failed status of their iteration', () => {
  const { root, specFolder, alignmentDir } = makeSpecFolder('failed-statusless-delta');
  try {
    const lane = seedConfig(alignmentDir);
    const id = laneKey(lane);
    writeJson(path.join(alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: id, ...lane, artifacts: [{ path: 'docs/a.md' }] }],
    });
    appendIteration(alignmentDir, id, ['docs/a.md'], { status: 'error' });
    fs.writeFileSync(
      path.join(alignmentDir, 'deltas', 'iter-001.jsonl'),
      `${JSON.stringify({
        type: 'finding',
        laneId: id,
        finding: { severity: 'P1', summary: 'status-less failed delta finding' },
      })}\n`,
      'utf8',
    );

    const reduced = reduceAlignmentState(specFolder, { write: false });
    assert.equal(reduced.registry.overall.findingsBySeverity.P1, 0);
    assert.equal(reduced.registry.overall.verdict, 'FAIL');
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test('successful runs still seal and incomplete no-fault runs seal FAIL at the cap', () => {
  const honest = makeSpecFolder('honest-success');
  try {
    const lane = seedConfig(honest.alignmentDir);
    const id = laneKey(lane);
    writeJson(path.join(honest.alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: id, ...lane, artifacts: [{ path: 'docs/a.md' }, { path: 'docs/b.md' }] }],
    });
    appendIteration(honest.alignmentDir, id, ['docs/a.md', 'docs/b.md']);
    appendIterationRecord(honest.alignmentDir, id, ['docs/a.md', 'docs/b.md']);

    const decision = checkConvergence(honest.specFolder, { stabilityWindow: 2 });
    const sealed = reduceAlignmentState(honest.specFolder, { write: false, seal: true }).registry.overall;
    assert.equal(decision.decision, DECISIONS.CONVERGED);
    assert.equal(sealed.verdict, 'PASS');
    assert.equal(sealed.sealed, true);
  } finally {
    fs.rmSync(honest.root, { recursive: true, force: true });
  }

  const incomplete = makeSpecFolder('incomplete-success');
  try {
    const lane = seedConfig(incomplete.alignmentDir);
    const id = laneKey(lane);
    writeJson(path.join(incomplete.alignmentDir, 'deep-alignment-corpus.json'), {
      lanes: [{ laneId: id, ...lane, artifacts: [{ path: 'docs/a.md' }, { path: 'docs/b.md' }] }],
    });
    appendIteration(incomplete.alignmentDir, id, ['docs/a.md']);

    const decision = checkConvergence(incomplete.specFolder, { maxIterations: 1, stabilityWindow: 1 });
    const sealed = reduceAlignmentState(incomplete.specFolder, { write: false, seal: true }).registry.overall;
    assert.equal(decision.decision, DECISIONS.STOP_MAX_ITERATIONS);
    assert.equal(decision.integrityFault, false);
    assert.equal(sealed.verdict, 'FAIL');
    assert.equal(sealed.sealed, true);
  } finally {
    fs.rmSync(incomplete.root, { recursive: true, force: true });
  }
});
