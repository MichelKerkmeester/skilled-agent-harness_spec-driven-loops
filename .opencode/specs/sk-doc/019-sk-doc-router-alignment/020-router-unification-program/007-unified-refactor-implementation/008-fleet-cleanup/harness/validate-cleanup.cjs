#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ SCRIPT: FLEET CLEANUP CONTRACT VALIDATOR                                ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const Module = require('node:module');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const cleanup = require('../lib/fleet-cleanup.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND BASELINES
// ─────────────────────────────────────────────────────────────────────────────

const PHASE_ROOT = path.resolve(__dirname, '..');
const IMPLEMENTATION_ROOT = path.resolve(PHASE_ROOT, '..');
const REPO_ROOT = path.resolve(PHASE_ROOT, '../../../../../../..');
const N1_ROOT = path.join(IMPLEMENTATION_ROOT, '001-compiler-n1-shadow');
const EVALUATOR_ROOT = path.join(IMPLEMENTATION_ROOT, '002-decision-evaluator');
const EXECUTION_ROOT = path.join(IMPLEMENTATION_ROOT, '003-execution-verify-commit');
const HUB_ROOT = path.join(IMPLEMENTATION_ROOT, '006-parent-hub-rollout');
const FIXTURE = readJson(path.join(PHASE_ROOT, 'fixtures', 'deletion-cases.v1.json'));
const EXPECTED_SCORER_DIGESTS = Object.freeze({
  'load-playbook-scenarios.cjs': '249be7c1cae9dcfe1faec8dcfc2965a0a0fc89e0af8e30bdd271625f300a6fde',
  'router-replay.cjs': 'b039b8dd22dbfaaa91042f613998d54610080feadef6179362e0d01b83e8bedf',
  'score-skill-benchmark.cjs': 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
});
const SCORER_ROOT = path.join(
  REPO_ROOT,
  '.opencode',
  'skills',
  'system-deep-loop',
  'deep-improvement',
  'scripts',
  'skill-benchmark',
);
const PARENT_HUBS = Object.freeze([
  { directory: '001-sk-code', skillId: 'sk-code' },
  { directory: '002-system-deep-loop', skillId: 'system-deep-loop' },
  { directory: '003-mcp-tooling', skillId: 'mcp-tooling' },
]);
let workspaceRoot = os.tmpdir();

const {
  compile,
  evaluatePolicy,
} = require(path.join(N1_ROOT, 'compiler', 'index.cjs'));
const {
  loadAuthoredSources,
} = require(path.join(N1_ROOT, 'harness', 'support.cjs'));
const {
  projectToRouteGold,
} = require(path.join(EVALUATOR_ROOT, 'lib', 'projector.cjs'));
const {
  scorerScenario,
} = require(path.join(EVALUATOR_ROOT, 'replay-driver.cjs'));

// ─────────────────────────────────────────────────────────────────────────────
// 3. GENERIC HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeBytes(filePath, bytes) {
  fs.writeFileSync(filePath, bytes, { mode: 0o600 });
  const descriptor = fs.openSync(filePath, 'r');
  try {
    fs.fsyncSync(descriptor);
  } finally {
    fs.closeSync(descriptor);
  }
}

function runCommand(commandPath) {
  const result = spawnSync(process.execPath, [commandPath], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0, result.stderr || `${commandPath} failed`);
  return result.stdout.trim();
}

function hashFile(filePath) {
  return cleanup.sha256(fs.readFileSync(filePath));
}

function scorerDigests() {
  return Object.fromEntries(Object.keys(EXPECTED_SCORER_DIGESTS).map((name) => [
    name,
    hashFile(path.join(SCORER_ROOT, name)),
  ]));
}

function assertCode(action, expectedCode) {
  let captured;
  assert.throws(action, (error) => {
    assert.equal(error.code, expectedCode);
    captured = error;
    return true;
  });
  return captured;
}

function makeWorkspace(prefix, manifestBytes, fencingEpoch = 0) {
  const directory = fs.mkdtempSync(path.join(workspaceRoot, prefix));
  const manifestPath = path.join(directory, 'manifest.json');
  const fencePath = path.join(directory, 'fence-state.json');
  writeBytes(manifestPath, manifestBytes);
  writeBytes(
    fencePath,
    Buffer.from(`${JSON.stringify({ fencingEpoch, schemaVersion: 'V1' })}\n`, 'utf8'),
  );
  return {
    directory,
    fencePath,
    manifestPath,
    retainedDirectory: path.join(directory, 'retained'),
  };
}

function loadMutant(filePath, replacements) {
  let source = fs.readFileSync(filePath, 'utf8');
  for (const [pattern, replacement] of replacements) {
    const next = source.replace(pattern, replacement);
    assert.notEqual(next, source, `mutation pattern not found: ${pattern}`);
    source = next;
  }
  const mutant = new Module(filePath, module);
  mutant.filename = filePath;
  mutant.paths = Module._nodeModulePaths(path.dirname(filePath));
  mutant._compile(source, filePath);
  return mutant.exports;
}

function cardWithPayload(payload, template) {
  return template.replace(
    /```fleet-policy-card-v1\n[\s\S]+?\n```/,
    `\`\`\`fleet-policy-card-v1\n${JSON.stringify(payload)}\n\`\`\``,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMMITTED EXTERNAL GATES
// ─────────────────────────────────────────────────────────────────────────────

function loadN1Snapshot() {
  const authoredSources = loadAuthoredSources();
  return {
    aliases: [...authoredSources.aliases],
    policy: compile(authoredSources),
    skillId: 'mcp-code-mode',
  };
}

function loadParentSnapshot(descriptor) {
  const root = path.join(HUB_ROOT, descriptor.directory);
  return {
    aliases: readJson(path.join(root, 'compiled', 'advisor-projection.json')).aliases,
    policy: readJson(path.join(root, 'compiled', 'policy.json')),
    skillId: descriptor.skillId,
  };
}

function exactLifecycle(value) {
  return JSON.stringify(value) === JSON.stringify(['PREPARE', 'VERIFY', 'COMMIT']);
}

function parentGate(descriptor) {
  const root = path.join(HUB_ROOT, descriptor.directory);
  const report = require(path.join(root, 'harness', 'validate-canary.cjs')).runCanary();
  const acceptance = readJson(path.join(root, 'activation', 'acceptance.json'));
  const currentManifest = readJson(path.join(root, 'activation', 'manifest.json'));
  const policy = readJson(path.join(root, 'compiled', 'policy.json'));
  const stage = report.stageGate || report.stage4;
  const lifecycle = report.execution.actorCommitPath || report.execution.commitPath;
  const destinationRolloutGreen = exactLifecycle(lifecycle)
    && (report.destinationRollout === undefined
      || report.destinationRollout.mutatingEnabledAfterReadOnly === true);
  const candidateMatches = acceptance.candidatePolicy.effectivePolicyHash
      === policy.effectivePolicyHash
    && acceptance.candidatePolicy.generation === policy.activationGeneration;
  return {
    normalized: {
      candidateGeneration: policy.activationGeneration,
      candidatePolicyHash: policy.effectivePolicyHash,
      canaryGreen: report.status === 'GREEN'
        && stage.routeGold === 'GREEN'
        && stage.documentParity === 'pass'
        && candidateMatches,
      destinationRolloutGreen,
      externalEvidenceHash: cleanup.sha256(cleanup.canonicalBytes({
        acceptance,
        currentManifest,
        report,
      })),
      legacyServingBeforeCleanup: currentManifest.servingAuthority === 'legacy'
        && currentManifest.shadowOnly === true,
      rollbackGreen: report.rollback.byteExact === true
        && report.rollback.priorHash === report.rollback.restoredHash,
      routeGoldGreen: stage.routeGold === 'GREEN'
        && report.routes.corruptedObservationPass === false,
      skillId: descriptor.skillId,
    },
    report,
  };
}

function n1Gate(snapshot) {
  const compilerOutput = runCommand(path.join(N1_ROOT, 'harness', 'run-phase.cjs'));
  const executionOutput = JSON.parse(runCommand(path.join(EXECUTION_ROOT, 'harness', 'run-phase.cjs')));
  const currentManifest = readJson(path.join(N1_ROOT, 'activation', 'manifest.json'));
  const candidateManifest = readJson(path.join(N1_ROOT, 'activation', 'manifest.candidate.json'));
  const singleLifecycle = executionOutput.successCriteria['SC-004'].singlePath;
  const candidateMatches = candidateManifest.selectedPolicy.effectivePolicyHash
      === snapshot.policy.effectivePolicyHash
    && candidateManifest.selectedPolicy.generation === snapshot.policy.activationGeneration;
  return {
    normalized: {
      candidateGeneration: snapshot.policy.activationGeneration,
      candidatePolicyHash: snapshot.policy.effectivePolicyHash,
      canaryGreen: candidateMatches
        && compilerOutput.includes('PASS SC-001 determinism')
        && compilerOutput.includes('PASS SC-006 rollback')
        && compilerOutput.includes('PASS document-only'),
      destinationRolloutGreen: executionOutput.successCriteria['SC-004'].status === 'pass'
        && exactLifecycle(singleLifecycle),
      externalEvidenceHash: cleanup.sha256(cleanup.canonicalBytes({
        candidateManifest,
        compilerOutput,
        currentManifest,
        executionOutput,
      })),
      legacyServingBeforeCleanup: currentManifest.servingAuthority === 'legacy'
        && currentManifest.shadowOnly === true,
      rollbackGreen: compilerOutput.includes('PASS SC-006 rollback')
        && compilerOutput.includes('restored=5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23'),
      routeGoldGreen: compilerOutput.includes('PASS SC-004 scorer-untouched')
        && executionOutput.successCriteria['SC-005'].scorerPasses === 3,
      skillId: snapshot.skillId,
    },
    report: { compilerOutput, executionOutput },
  };
}

function failedGate(snapshot, error) {
  return {
    normalized: {
      canaryGreen: false,
      candidateGeneration: snapshot.policy.activationGeneration,
      candidatePolicyHash: snapshot.policy.effectivePolicyHash,
      destinationRolloutGreen: false,
      errorCode: error.code || 'CANDIDATE_GATE_ERROR',
      errorMessage: error.message,
      legacyServingBeforeCleanup: true,
      rollbackGreen: false,
      routeGoldGreen: false,
      skillId: snapshot.skillId,
    },
    report: null,
  };
}

function loadCommittedContext() {
  const n1 = loadN1Snapshot();
  const parents = PARENT_HUBS.map(loadParentSnapshot);
  const snapshots = [n1, ...parents];
  const parentGates = PARENT_HUBS.map((descriptor, index) => {
    try {
      return parentGate(descriptor);
    } catch (error) {
      return failedGate(parents[index], error);
    }
  });
  let n1Evidence;
  try {
    n1Evidence = n1Gate(n1);
  } catch (error) {
    n1Evidence = failedGate(n1, error);
  }
  return {
    aliasesBySkill: Object.fromEntries(snapshots.map((snapshot) => [
      snapshot.skillId,
      snapshot.aliases,
    ])),
    gateEvidence: [n1Evidence.normalized, ...parentGates.map((entry) => entry.normalized)],
    parentReports: Object.fromEntries(parentGates.map((entry) => [
      entry.normalized.skillId,
      entry.report,
    ])),
    snapshots,
  };
}

function assertCurrentFleetBlocked(context) {
  const committedEvidence = cleanup.readCommittedActivationEvidence();
  const blocked = assertCode(
    () => cleanup.assertFleetReady(context.snapshots),
    'PREFLIGHT_BLOCKED',
  );
  assert.equal(blocked.details.reason, 'not-rolled-out');
  assert.equal(blocked.details.servingAuthority, 'legacy');
  assert.equal(blocked.details.shadowOnly, true);
  committedEvidence.forEach((entry) => {
    assert.equal(entry.manifest.servingAuthority, 'legacy');
    assert.equal(entry.manifest.shadowOnly, true);
    assert.equal(entry.manifest.selectedPolicy.generation, 0);
    assert.equal(entry.manifest.selectedPolicy.effectivePolicyHash, null);
  });
  return {
    authorized: false,
    blockCode: blocked.code,
    blockReason: blocked.details.reason,
    committedEvidence,
    servingAuthority: 'legacy',
    shadowOnly: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. REAL ROUTE-GOLD REPLAY
// ─────────────────────────────────────────────────────────────────────────────

function routeGoldInput(id, expectedIntents, expectedResources, observed) {
  return {
    observed,
    scenario: scorerScenario({
      id,
      intentGold: { expectedIntents, expectedResources },
    }),
  };
}

function planN1(snapshot) {
  const exact = evaluatePolicy(snapshot.policy, { taskText: FIXTURE.n1.exactPrompt });
  const zero = evaluatePolicy(snapshot.policy, { taskText: FIXTURE.n1.zeroSignalPrompt });
  const workflowMode = snapshot.policy.destinations[0].id.workflowMode;
  const leafPairs = exact.diagnostics.selectedResources.map((resource) => ({
    leafResourceId: resource,
    workflowMode,
  }));
  const manifestResources = leafPairs.map((pair) => ({
    ...pair,
    resource: pair.leafResourceId,
  }));
  const exactProjection = projectToRouteGold(exact.decision, {
    leafPairs,
    manifestResources,
    policy: snapshot.policy,
  });
  const zeroProjection = projectToRouteGold(zero.decision, { policy: snapshot.policy });
  const inputs = [
    routeGoldInput('n1-exact', [workflowMode], exact.diagnostics.selectedResources, exactProjection),
    routeGoldInput('n1-zero-signal', ['defer'], [], zeroProjection),
  ];
  return {
    n1Trace: {
      compositionRules: snapshot.policy.compositionRules.length,
      destinations: snapshot.policy.destinations.length,
      rankCalls: exact.diagnostics.rankCalls,
    },
    plan: {
      corruptionInput: {
        ...inputs[0],
        observed: FIXTURE.corruptedObservation,
      },
      inputs,
    },
  };
}

function planParent(descriptor, report) {
  const fixture = readJson(path.join(
    HUB_ROOT,
    descriptor.directory,
    'fixtures',
    'canary-cases.v1.json',
  ));
  const rowsById = new Map(report.routes.rows.map((row) => [row.id, row]));
  const inputs = fixture.cases.map((testCase) => {
    const row = rowsById.get(testCase.id);
    assert.ok(row, `${descriptor.skillId}/${testCase.id} route row is absent`);
    return routeGoldInput(
      `${descriptor.skillId}/${testCase.id}`,
      testCase.gold.expectedIntents,
      testCase.gold.expectedResources,
      row.projection,
    );
  });
  const positiveIndex = fixture.cases.findIndex((testCase) => (
    !['defer', 'none', 'UNKNOWN'].includes(testCase.gold.expectedIntents[0])
  ));
  return {
    corruptionInput: {
      ...inputs[positiveIndex],
      observed: FIXTURE.corruptedObservation,
    },
    inputs,
  };
}

function routeGoldPlans(context) {
  const map = new Map();
  const n1 = planN1(context.snapshots[0]);
  map.set('mcp-code-mode', n1.plan);
  PARENT_HUBS.forEach((descriptor) => {
    map.set(descriptor.skillId, planParent(
      descriptor,
      context.parentReports[descriptor.skillId],
    ));
  });
  return { map, n1Trace: n1.n1Trace };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. FAILURE-DRIVEN GATES
// ─────────────────────────────────────────────────────────────────────────────

function runPreflightFalsifier(context, preflight, initialBytes) {
  const blockedManifests = JSON.parse(JSON.stringify(FIXTURE.hypotheticalRolledOutManifests));
  blockedManifests[0] = FIXTURE.hypotheticalLegacyManifest;
  assertCode(
    () => cleanup.createHypotheticalPreflight(blockedManifests, context.snapshots),
    'PREFLIGHT_BLOCKED',
  );
  const mismatchedManifests = JSON.parse(
    JSON.stringify(FIXTURE.hypotheticalRolledOutManifests),
  );
  mismatchedManifests[0].generation += 1;
  assertCode(
    () => cleanup.createHypotheticalPreflight(mismatchedManifests, context.snapshots),
    'PREFLIGHT_POLICY_MISMATCH',
  );
  const mismatchedSnapshots = JSON.parse(JSON.stringify(context.snapshots));
  mismatchedSnapshots[0].aliases.push('snapshot-binding-drift');
  assertCode(() => cleanup.createInitialManifest({
    aliasesBySkill: context.aliasesBySkill,
    bakeWindow: FIXTURE.bakeWindow,
    policySnapshots: mismatchedSnapshots,
    preflight,
  }), 'PREFLIGHT_POLICY_MISMATCH');
  const workspace = makeWorkspace('fleet-preflight-', initialBytes);
  try {
    assertCode(() => cleanup.deleteLegacySkill({
      expectedFencingEpoch: 0,
      expectedPriorBytes: initialBytes,
      expectedRouteGoldDigest: '0'.repeat(64),
      fencePath: workspace.fencePath,
      manifestPath: workspace.manifestPath,
      preflight: null,
      retainedDirectory: workspace.retainedDirectory,
      routeGoldGate: () => ({ green: true, realScorer: 'evaluateRouteGold' }),
      skillId: FIXTURE.activationOrder[0],
    }), 'PREFLIGHT_REQUIRED');
    return {
      deletionWithoutTokenBlocked: true,
      hypotheticalLegacyManifestRejected: true,
      mismatchedManifestPinRejected: true,
      snapshotBindingMismatchRejected: true,
    };
  } finally {
    fs.rmSync(workspace.directory, { force: true, recursive: true });
  }
}

function expectRouteGoldRollback({
  expectedDigest,
  initialBytes,
  preflight,
  routeGoldGate,
  workspacePrefix,
}) {
  const workspace = makeWorkspace(workspacePrefix, initialBytes);
  try {
    let caught;
    try {
      cleanup.deleteLegacySkill({
        expectedFencingEpoch: 0,
        expectedPriorBytes: initialBytes,
        expectedRouteGoldDigest: expectedDigest,
        fencePath: workspace.fencePath,
        manifestPath: workspace.manifestPath,
        preflight,
        retainedDirectory: workspace.retainedDirectory,
        routeGoldGate,
        skillId: FIXTURE.activationOrder[0],
      });
    } catch (error) {
      caught = error;
    }
    assert.equal(caught?.code, 'ROUTE_GOLD_RED');
    assert.equal(caught.details.rollback.byteExact, true);
    assert.ok(fs.readFileSync(workspace.manifestPath).equals(initialBytes));
    return caught;
  } finally {
    fs.rmSync(workspace.directory, { force: true, recursive: true });
  }
}

function runRouteGoldRollbackFalsifier(preflight, initialBytes, plan, baseline) {
  const redPlan = JSON.parse(JSON.stringify(plan));
  redPlan.inputs[0].observed = FIXTURE.corruptedObservation;
  const realRed = expectRouteGoldRollback({
    expectedDigest: baseline.digest,
    initialBytes,
    preflight,
    routeGoldGate: () => redPlan,
    workspacePrefix: 'fleet-route-red-',
  });
  assert.equal(realRed.details.causeCode, 'ROUTE_GOLD_VERDICT_RED');

  const selfAttested = expectRouteGoldRollback({
    expectedDigest: baseline.digest,
    initialBytes,
    preflight,
    routeGoldGate: () => ({ green: true, realScorer: 'evaluateRouteGold' }),
    workspacePrefix: 'fleet-route-self-attested-',
  });
  assert.equal(selfAttested.details.causeCode, 'INVALID_SHAPE');

  const thrown = expectRouteGoldRollback({
    expectedDigest: baseline.digest,
    initialBytes,
    preflight,
    routeGoldGate: () => { throw new Error('planted route-gold exception'); },
    workspacePrefix: 'fleet-route-throw-',
  });
  assert.equal(thrown.details.causeCode, 'ROUTE_GOLD_EXCEPTION');

  return {
    realRedRolledBack: true,
    restoredHash: realRed.details.rollback.restoredHash,
    selfAttestedGateRolledBack: true,
    throwingGateRolledBack: true,
  };
}

function runPreimageFalsifier(preflight, initialBytes, plan, baseline) {
  const workspace = makeWorkspace('fleet-drift-', initialBytes);
  try {
    const drifted = JSON.parse(initialBytes.toString('utf8'));
    drifted.legacyInputs[0].aliases.push('planted-drift');
    writeBytes(workspace.manifestPath, cleanup.manifestBytes(drifted));
    assertCode(() => cleanup.deleteLegacySkill({
      expectedFencingEpoch: 0,
      expectedPriorBytes: initialBytes,
      expectedRouteGoldDigest: baseline.digest,
      fencePath: workspace.fencePath,
      manifestPath: workspace.manifestPath,
      preflight,
      retainedDirectory: workspace.retainedDirectory,
      routeGoldGate: () => plan,
      skillId: FIXTURE.activationOrder[0],
    }), 'PREIMAGE_DRIFT');
    return { plantedPreimageDriftBlocked: true };
  } finally {
    fs.rmSync(workspace.directory, { force: true, recursive: true });
  }
}

function runStaleCasFalsifier() {
  const finalPath = path.join(PHASE_ROOT, 'compiled', 'final-manifest.json');
  const finalBytes = fs.readFileSync(finalPath);
  const workspace = makeWorkspace('fleet-stale-cas-', finalBytes, 1);
  try {
    assertCode(() => cleanup.atomicFleetSwap({
      expectedFencingEpoch: 0,
      expectedPriorBytes: finalBytes,
      fencePath: workspace.fencePath,
      manifestPath: workspace.manifestPath,
      nextBytes: finalBytes,
      token: 'stale-cas-control',
    }), 'STALE_FENCE');
    assert.ok(fs.readFileSync(workspace.manifestPath).equals(finalBytes));
    return { staleCasBlocked: true, targetBytesUnchanged: true };
  } finally {
    fs.rmSync(workspace.directory, { force: true, recursive: true });
  }
}

function runHypotheticalPathBoundary(preflight, initialBytes) {
  const priorWorkspaceRoot = workspaceRoot;
  workspaceRoot = os.tmpdir();
  const workspace = makeWorkspace('fleet-hypothetical-boundary-', initialBytes);
  try {
    assertCode(() => cleanup.deleteLegacySkill({
      expectedFencingEpoch: 0,
      expectedPriorBytes: initialBytes,
      expectedRouteGoldDigest: '0'.repeat(64),
      fencePath: workspace.fencePath,
      manifestPath: workspace.manifestPath,
      preflight,
      retainedDirectory: workspace.retainedDirectory,
      routeGoldGate: () => ({ corruptionInput: {}, inputs: [] }),
      skillId: FIXTURE.activationOrder[0],
    }), 'PREFLIGHT_HYPOTHETICAL_ONLY');
    assert.ok(fs.readFileSync(workspace.manifestPath).equals(initialBytes));
    return { outsideSimulationRootBlocked: true, targetBytesUnchanged: true };
  } finally {
    fs.rmSync(workspace.directory, { force: true, recursive: true });
    workspaceRoot = priorWorkspaceRoot;
  }
}

function runPreflightGuardRemovalFalsifier(context) {
  const libraryPath = path.join(PHASE_ROOT, 'lib', 'fleet-cleanup.cjs');
  const mutant = loadMutant(libraryPath, [
    [
      'function assertFleetReady(policySnapshots) {',
      'function assertFleetReady(policySnapshots, activationManifests) {',
    ],
    [
      '  const committedEvidence = readCommittedActivationEvidence();',
      '  const committedEvidence = hypotheticalEvidence(activationManifests);',
    ],
  ]);
  const token = mutant.assertFleetReady(
    context.snapshots,
    FIXTURE.hypotheticalRolledOutManifests,
  );
  assert.equal(token.kind, 'committed');
  return { removedCommittedEvidenceBindingAcceptsSelfAttestation: true };
}

function runRouteGoldScorerGuardRemovalFalsifier(context, initialBytes, baseline) {
  const libraryPath = path.join(PHASE_ROOT, 'lib', 'fleet-cleanup.cjs');
  const mutant = loadMutant(libraryPath, [[
    '    routeGold = scoreRouteGoldPlan(routeGoldGate(skillId, candidate));',
    '    routeGold = routeGoldGate(skillId, candidate);',
  ]]);
  const mutantPreflight = mutant.createHypotheticalPreflight(
    FIXTURE.hypotheticalRolledOutManifests,
    context.snapshots,
  );
  const priorWorkspaceRoot = workspaceRoot;
  workspaceRoot = mutantPreflight.simulationRoot;
  const workspace = makeWorkspace('fleet-scorer-mutant-', initialBytes);
  try {
    assert.doesNotThrow(() => mutant.deleteLegacySkill({
      expectedFencingEpoch: 0,
      expectedPriorBytes: initialBytes,
      expectedRouteGoldDigest: baseline.digest,
      fencePath: workspace.fencePath,
      manifestPath: workspace.manifestPath,
      preflight: mutantPreflight,
      retainedDirectory: workspace.retainedDirectory,
      routeGoldGate: () => ({ digest: baseline.digest, green: true }),
      skillId: FIXTURE.activationOrder[0],
    }));
    assert.equal(fs.readFileSync(workspace.manifestPath).equals(initialBytes), false);
    return { removedRealScorerGuardAcceptsSelfAttestation: true };
  } finally {
    fs.rmSync(workspace.directory, { force: true, recursive: true });
    workspaceRoot = priorWorkspaceRoot;
    fs.rmSync(mutantPreflight.simulationRoot, { force: true, recursive: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. MAIN DELETION SEQUENCE
// ─────────────────────────────────────────────────────────────────────────────

function runDeletionSequence(context, preflight, initialManifest, plans, baselines) {
  const initialBytes = cleanup.manifestBytes(initialManifest);
  const workspace = makeWorkspace('fleet-main-', initialBytes);
  const deletions = [];
  let expectedBytes = initialBytes;
  let fencingEpoch = 0;
  try {
    for (const skillId of FIXTURE.activationOrder) {
      const result = cleanup.deleteLegacySkill({
        expectedFencingEpoch: fencingEpoch,
        expectedPriorBytes: expectedBytes,
        expectedRouteGoldDigest: baselines[skillId].digest,
        fencePath: workspace.fencePath,
        manifestPath: workspace.manifestPath,
        preflight,
        retainedDirectory: workspace.retainedDirectory,
        routeGoldGate: (requestedSkillId) => plans.get(requestedSkillId),
        skillId,
      });
      assert.equal(result.routeGold.digest, baselines[skillId].digest);
      assert.equal(result.routeGold.green, true);
      expectedBytes = result.candidateBytes;
      fencingEpoch += 1;
      deletions.push({
        candidateHash: result.candidateHash,
        driver: 'deleteLegacySkill',
        generation: result.candidate.generation,
        priorHash: result.priorHash,
        retainedPath: result.retainedPath,
        routeGoldDigest: result.routeGold.digest,
        routeGoldRealScorer: result.routeGold.realScorer,
        routeGoldRows: result.routeGold.rows,
        skillId,
      });
    }
    const finalBytes = fs.readFileSync(workspace.manifestPath);
    const finalManifest = cleanup.validateManifest(JSON.parse(finalBytes.toString('utf8')));
    assert.equal(finalManifest.soleResolver, true);
    assert.equal(finalManifest.resolver, 'EffectivePolicy');
    assert.deepEqual(finalManifest.legacyInputs, []);
    assert.deepEqual(finalManifest.dualReadSkillIds, []);
    assert.equal(deletions.length, FIXTURE.bakeWindow.minimumSuccessfulDeletions);
    deletions.forEach((deletion) => {
      assert.equal(fs.existsSync(deletion.retainedPath), true);
      assert.equal(hashFile(deletion.retainedPath), deletion.priorHash);
    });
    return {
      deletions,
      finalBytes,
      finalManifest,
      retainedDirectory: workspace.retainedDirectory,
      retainedPaths: deletions.map((entry) => entry.retainedPath),
      workspace,
    };
  } catch (error) {
    fs.rmSync(workspace.directory, { force: true, recursive: true });
    throw error;
  }
}

function runRollbackDrill(sequence) {
  const workspace = makeWorkspace('fleet-rollback-', sequence.finalBytes, 4);
  try {
    const result = cleanup.rollbackToRetained({
      expectedFencingEpoch: 4,
      expectedPriorBytes: sequence.finalBytes,
      fencePath: workspace.fencePath,
      manifestPath: workspace.manifestPath,
      retainedPath: sequence.retainedPaths.at(-1),
      token: 'bake-window-rollback',
    });
    assert.equal(result.byteExact, true);
    assert.equal(result.retainedHash, result.restoredHash);
    return {
      ...result,
      caveat: 'routing bytes only; committed external effects remain destination-owned',
      retainedGenerations: sequence.retainedPaths.length,
    };
  } finally {
    fs.rmSync(workspace.directory, { force: true, recursive: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CARD, DRIFT, AND STATIC GATES
// ─────────────────────────────────────────────────────────────────────────────

function runCardGates(sequence, context) {
  const card = cleanup.generatePolicyCard(sequence.finalManifest, context.snapshots);
  const valid = cleanup.assertPostCleanupCard(card.markdown, sequence.finalManifest, {
    prompt: FIXTURE.n1.zeroSignalPrompt,
    skillId: 'mcp-code-mode',
  });
  const payload = cleanup.parsePolicyCard(card.markdown);
  const aliasPayload = { ...payload, aliases: ['planted-compatibility-input'] };
  assertCode(
    () => cleanup.assertPostCleanupCard(
      cardWithPayload(aliasPayload, card.markdown),
      sequence.finalManifest,
      { prompt: FIXTURE.n1.zeroSignalPrompt, skillId: 'mcp-code-mode' },
    ),
    'INVALID_SHAPE',
  );
  const unionPayload = { ...payload, zeroSignal: { ...payload.zeroSignal, union: ['all'] } };
  assertCode(
    () => cleanup.assertPostCleanupCard(
      cardWithPayload(unionPayload, card.markdown),
      sequence.finalManifest,
      { prompt: FIXTURE.n1.zeroSignalPrompt, skillId: 'mcp-code-mode' },
    ),
    'DEFAULT_UNION_FORBIDDEN',
  );

  const aliasDecisions = FIXTURE.aliasRetirement.map((testCase) => ({
    decision: cleanup.replayPolicyCard(card.markdown, testCase),
    prompt: testCase.prompt,
    skillId: testCase.skillId,
  }));
  aliasDecisions.forEach((entry) => {
    assert.equal(entry.decision.action, 'defer');
    assert.equal(entry.decision.defer.reason, 'no-match');
  });
  const libraryPath = path.join(PHASE_ROOT, 'lib', 'fleet-cleanup.cjs');
  const aliasMutant = loadMutant(libraryPath, [[
    '  const policy = retireAliasDetectors(snapshot.policy);',
    '  const policy = clone(snapshot.policy);',
  ]]);
  const aliasMutantCard = aliasMutant.generatePolicyCard(sequence.finalManifest, context.snapshots);
  FIXTURE.aliasRetirement.forEach((testCase) => {
    assert.equal(aliasMutant.replayPolicyCard(aliasMutantCard.markdown, testCase).action, 'route');
  });

  const corruptedPayload = {
    ...payload,
    compiledPolicies: [],
    manifestHash: FIXTURE.corruptedManifestHash,
  };
  const corruptedCard = cardWithPayload(corruptedPayload, card.markdown);
  assertCode(
    () => cleanup.assertPostCleanupCard(
      corruptedCard,
      sequence.finalManifest,
      { prompt: FIXTURE.n1.zeroSignalPrompt, skillId: 'mcp-code-mode' },
    ),
    'POLICY_CARD_DOCUMENT_PARITY',
  );
  const documentMutant = loadMutant(libraryPath, [[
    '  const card = assertPolicyCardPayload(parsePolicyCard(markdown));',
    '  const card = input.outOfBandCard;',
  ]]);
  const ignoredCorruption = documentMutant.replayPolicyCard(corruptedCard, {
    outOfBandCard: payload,
    prompt: FIXTURE.n1.zeroSignalPrompt,
    skillId: 'mcp-code-mode',
  });
  assert.equal(ignoredCorruption.action, 'defer');
  return {
    aliasGuardRemovalRoutes: true,
    aliasRetirementDecisions: aliasDecisions,
    aliasMutationRejected: true,
    card,
    corruptedCardRejected: true,
    defaultUnionMutationRejected: true,
    outOfBandReplayIgnoresCorruption: true,
    ...valid,
  };
}

function runFinalDriftGate(finalBytes) {
  const frozenPath = path.join(PHASE_ROOT, 'compiled', 'final-manifest.json');
  const snapshotMode = process.argv.includes('--snapshot');
  const frozenBytes = snapshotMode ? finalBytes : fs.readFileSync(frozenPath);
  const result = cleanup.assertFrozenFinalState(finalBytes, frozenBytes);
  const mutation = JSON.parse(finalBytes.toString('utf8'));
  mutation.generation += 1;
  assertCode(
    () => cleanup.assertFrozenFinalState(cleanup.canonicalBytes(mutation), frozenBytes),
    'FINAL_STATE_DRIFT',
  );
  return { ...result, plantedFinalDriftRejected: true };
}

function runArtifactGate(sequence, card) {
  const cardPath = path.join(PHASE_ROOT, 'compiled', 'PolicyCardV1.md');
  const manifestPath = path.join(PHASE_ROOT, 'compiled', 'final-manifest.json');
  if (process.argv.includes('--snapshot')) {
    writeBytes(cardPath, Buffer.from(card.markdown, 'utf8'));
    writeBytes(manifestPath, sequence.finalBytes);
    return { artifactsWritten: true, snapshotMode: true };
  }
  assert.equal(fs.readFileSync(cardPath, 'utf8'), card.markdown);
  assert.ok(fs.readFileSync(manifestPath).equals(sequence.finalBytes));
  return { cardByteIdentical: true, finalManifestByteIdentical: true };
}

function runStaticGates(context, scorerBefore) {
  const libraryPath = path.join(PHASE_ROOT, 'lib', 'fleet-cleanup.cjs');
  const harnessPath = path.join(PHASE_ROOT, 'harness', 'validate-cleanup.cjs');
  const source = [libraryPath, harnessPath]
    .map((filePath) => fs.readFileSync(filePath, 'utf8'))
    .join('\n');
  const singletonClassPattern = new RegExp(['Singular', 'Router'].join(''));
  const branchPrefix = 'if\\s*\\([^)]*';
  const singletonName = ['mcp', 'code', 'mode'].join('-');
  const namedBranchPattern = new RegExp(`${branchPrefix}${singletonName}`);
  const skillSwitchPattern = new RegExp('switch\\s*\\([^)]*skillId');
  assert.equal(singletonClassPattern.test(source), false);
  assert.equal(namedBranchPattern.test(source), false);
  assert.equal(skillSwitchPattern.test(source), false);
  const comments = source.split('\n')
    .filter((line) => /^\s*(?:\/\/|\/\*|\*)/.test(line))
    .join('\n');
  assert.equal(/\b(?:ADR|REQ|CHK)-?\d+\b|\.opencode\/specs\//i.test(comments), false);
  const externalImports = [...source.matchAll(/require\(['"]([^'"]+)['"]\)/g)]
    .map((match) => match[1])
    .filter((value) => !value.startsWith('.') && !value.startsWith('node:'));
  assert.deepEqual(externalImports, []);
  const scorerAfter = scorerDigests();
  assert.deepEqual(scorerBefore, EXPECTED_SCORER_DIGESTS);
  assert.deepEqual(scorerAfter, scorerBefore);
  const n1 = context.snapshots[0];
  assert.equal(n1.policy.destinations.length, 1);
  assert.equal(n1.policy.compositionRules.length, 0);
  return {
    commentViolations: 0,
    externalDependencies: 0,
    nameConditionalBranches: 0,
    scorerDigests: scorerAfter,
    scorerUnchanged: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function run() {
  const scorerBefore = scorerDigests();
  assert.deepEqual(scorerBefore, EXPECTED_SCORER_DIGESTS);
  assert.deepEqual(FIXTURE.activationOrder, cleanup.ACTIVATION_ORDER);
  const context = loadCommittedContext();
  const currentFleet = assertCurrentFleetBlocked(context);
  const committedBindingFalsifier = runPreflightGuardRemovalFalsifier(context);
  const preflight = cleanup.createHypotheticalPreflight(
    FIXTURE.hypotheticalRolledOutManifests,
    context.snapshots,
  );
  workspaceRoot = preflight.simulationRoot;
  try {
    const initialManifest = cleanup.createInitialManifest({
      aliasesBySkill: context.aliasesBySkill,
      bakeWindow: FIXTURE.bakeWindow,
      policySnapshots: context.snapshots,
      preflight,
    });
    const initialBytes = cleanup.manifestBytes(initialManifest);
    const preflightFalsifier = runPreflightFalsifier(context, preflight, initialBytes);
    const staleCasFalsifier = runStaleCasFalsifier();
    const pathBoundary = runHypotheticalPathBoundary(preflight, initialBytes);
    const staticGates = runStaticGates(context, scorerBefore);
    const hypotheticalPositiveControl = {
      authorization: preflight.authorization,
      evidenceHash: preflight.evidenceHash,
      initialManifestHash: cleanup.sha256(initialBytes),
      label: 'If the fleet were fully rolled out, cleanup would mint only this isolated simulation capability.',
      manifests: FIXTURE.hypotheticalRolledOutManifests,
      pathBoundary,
      preflightFalsifier,
      staleCasFalsifier,
      status: 'HYPOTHETICAL_READY_ONLY',
      wouldMintDigest: preflight.digest,
    };
    const report = {
      antiHollowGreen: committedBindingFalsifier,
      candidateGateEvidence: context.gateEvidence,
      currentFleet,
      hypotheticalPositiveControl,
      staticGates,
      status: 'PREFLIGHT_BLOCKED',
    };
    return report;
  } finally {
    workspaceRoot = os.tmpdir();
    fs.rmSync(preflight.simulationRoot, { force: true, recursive: true });
  }
}

if (require.main === module) {
  try {
    process.stdout.write(`${cleanup.canonicalBytes(run()).toString('utf8')}`);
  } catch (error) {
    process.stderr.write(`[fleet-cleanup] ${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = { run };
