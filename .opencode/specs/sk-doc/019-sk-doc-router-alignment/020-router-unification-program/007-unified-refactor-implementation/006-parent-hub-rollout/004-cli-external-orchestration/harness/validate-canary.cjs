#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ HARNESS: CLI EXTERNAL ORCHESTRATION REAL-GREEN CANARY                  ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const {
  canonicalize,
  computeBasePolicyHash,
  computeEffectivePolicyHash,
  computeProjectionHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const POLICY_SCHEMA = require(
  '../../../000-contract-schemas/schemas/compiled-policy.v1.schema.json'
);
const ADVISOR_SCHEMA = require(
  '../../../000-contract-schemas/schemas/advisor-projection.v1.schema.json'
);
const {
  atomicFencedSwap,
  fenceStateBytes,
  manifestBytes,
  pinRequest,
} = require('../../../001-compiler-n1-shadow/activation/fenced-manifest.cjs');
const {
  validateNode,
} = require('../../../001-compiler-n1-shadow/harness/json-schema.cjs');
const {
  DecisionValidationError,
  parseRouteDecision,
} = require('../../../002-decision-evaluator/lib/decision-contract.cjs');
const {
  projectToRouteGold,
} = require('../../../002-decision-evaluator/lib/projector.cjs');
const {
  scoreRouteGoldReadOnly,
} = require('../../../002-decision-evaluator/replay-driver.cjs');
const {
  DestinationExecutionPlane,
  ExecutionProtocolError,
} = require('../../../003-execution-verify-commit/lib/execution-plane.cjs');
const {
  ActivationGateError,
  HARD_BLOCKS,
  assertActivationEligible,
  assertPinnedTuple,
  assertSingleGeneration,
} = require('../lib/activation-gate.cjs');
const { commitActor } = require('../lib/execution-fence.cjs');
const {
  artifactBytes,
  sha256,
} = require('../lib/registry-compiler.cjs');
const { advisorContribution, evaluateRoute } = require('../lib/router.cjs');
const {
  generatePolicyCard,
  parsePolicyCard,
  replayPolicyCard,
} = require('../lib/policy-card.cjs');
const {
  activationArtifacts,
  compiledArtifacts,
  loadSnapshot,
  scorerScenario,
  sourceInputs,
} = require('./build-artifacts.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND TRUSTED DIGESTS
// ─────────────────────────────────────────────────────────────────────────────

const PHASE_ROOT = path.resolve(__dirname, '..');

function findRepoRoot(start) {
  let current = path.resolve(start);
  for (;;) {
    if (fs.existsSync(path.join(current, '.opencode', 'skills'))) return current;
    const parent = path.dirname(current);
    if (parent === current) throw new Error('repository root was not found');
    current = parent;
  }
}

const REPO_ROOT = findRepoRoot(PHASE_ROOT);
const SCORER_ROOT = path.join(
  REPO_ROOT,
  '.opencode',
  'skills',
  'system-deep-loop',
  'deep-improvement',
  'scripts',
  'skill-benchmark',
);
const PROTECTED_DIGESTS = Object.freeze({
  'load-playbook-scenarios.cjs':
    '5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029',
  'router-replay.cjs':
    'd5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47',
  'score-skill-benchmark.cjs':
    'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function fileHash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function protectedHashes() {
  return Object.fromEntries(Object.keys(PROTECTED_DIGESTS).map((name) => (
    [name, fileHash(path.join(SCORER_ROOT, name))]
  )));
}

function authoredHashes() {
  return Object.fromEntries(Object.entries(sourceInputs()).map(([sourceId, bytes]) => (
    [sourceId, sha256(bytes)]
  )));
}

function expectedAuthoredHashes() {
  const acceptance = readJson(path.join(PHASE_ROOT, 'activation', 'acceptance.json'));
  return Object.fromEntries(acceptance.sourceHashes.map((row) => [row.sourceId, row.hash]));
}

function assertCode(error, expectedCode) {
  return Boolean(error && error.code === expectedCode);
}

function assertThrowsCode(operation, errorType, expectedCode) {
  assert.throws(
    operation,
    (error) => error instanceof errorType && assertCode(error, expectedCode),
    expectedCode,
  );
}

function targetModes(decision) {
  return decision.action === 'route'
    ? decision.route.targets.map((item) => item.destinationId.workflowMode)
    : [];
}

function hashMap(artifacts) {
  return Object.fromEntries(Object.entries(artifacts).map(([name, bytes]) => (
    [name, sha256(bytes)]
  )));
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CANARY SUBGATES
// ─────────────────────────────────────────────────────────────────────────────

function runCompiledGate(snapshot, fixture) {
  const second = loadSnapshot();
  assert.ok(artifactBytes(snapshot.policy).equals(artifactBytes(second.snapshot.policy)));
  assert.ok(
    artifactBytes(snapshot.destinationGraph)
      .equals(artifactBytes(second.snapshot.destinationGraph)),
  );
  assert.strictEqual(computeBasePolicyHash(snapshot.policy), snapshot.policy.basePolicyHash);
  assert.strictEqual(
    computeEffectivePolicyHash(snapshot.policy),
    snapshot.policy.effectivePolicyHash,
  );
  assert.deepStrictEqual(validateNode(POLICY_SCHEMA, snapshot.policy, POLICY_SCHEMA, '$'), []);
  assert.deepStrictEqual(
    validateNode(ADVISOR_SCHEMA, snapshot.advisorProjection, ADVISOR_SCHEMA, '$'),
    [],
  );
  assert.strictEqual(snapshot.policy.destinations.length, 3);
  assert.ok(snapshot.policy.destinations.every((item) => (
    item.role === 'actor' && item.mutatesWorkspace === true
  )));
  assert.strictEqual(snapshot.policy.compositionRules.length, 4);
  const ordered = snapshot.destinationGraph.tieBreak;
  for (const rule of snapshot.policy.compositionRules) {
    const indices = rule.targetIds.map((id) => ordered.indexOf(id.workflowMode));
    assert.deepStrictEqual(indices, [...indices].sort((left, right) => left - right));
  }
  const deliveredCompiled = Object.fromEntries(Object.keys(
    compiledArtifacts(snapshot, fixture),
  ).map((name) => [name, fs.readFileSync(path.join(PHASE_ROOT, 'compiled', name))]));
  const expectedCompiled = compiledArtifacts(snapshot, fixture);
  assert.deepStrictEqual(hashMap(deliveredCompiled), hashMap(expectedCompiled));
  const expectedActivation = activationArtifacts(snapshot, expectedCompiled);
  const deliveredActivation = Object.fromEntries(Object.keys(expectedActivation).map((name) => (
    [name, fs.readFileSync(path.join(PHASE_ROOT, 'activation', name))]
  )));
  assert.deepStrictEqual(hashMap(deliveredActivation), hashMap(expectedActivation));
  return {
    actorCount: 3,
    byteIdenticalRecompile: true,
    compositionRules: 4,
    destinationCount: 3,
    generatedArtifactsDeterministic: true,
  };
}

function runRouteGold(snapshot, fixture) {
  const typed = readJson(path.join(PHASE_ROOT, 'compiled', 'route-gold.typed.json'));
  assert.deepStrictEqual(
    typed.cases.map((row) => row.scenarioId),
    fixture.cases.map((row) => row.id),
  );
  const scorerInputs = [];
  const actionCounts = { clarify: 0, defer: 0, reject: 0, route: 0 };
  let actorFirst = true;
  for (const [index, entry] of fixture.cases.entries()) {
    const result = evaluateRoute(snapshot, entry);
    assert.strictEqual(result.decision.action, entry.expectedAction, entry.id);
    actionCounts[result.decision.action] += 1;
    if (entry.expectedSelectionKind) {
      assert.strictEqual(
        result.decision.route.selectionKind,
        entry.expectedSelectionKind,
        entry.id,
      );
      assert.deepStrictEqual(targetModes(result.decision), entry.expectedModes, entry.id);
    }
    if (entry.expectedReason) {
      assert.strictEqual(
        result.decision[result.decision.action].reason,
        entry.expectedReason,
        entry.id,
      );
    }
    if (result.decision.action === 'route') {
      actorFirst = actorFirst && result.decision.route.targets.every((item) => (
        item.role === 'actor'
      ));
    } else {
      const branch = result.decision[result.decision.action];
      assert.strictEqual(branch.authority, 'Withheld');
      assert.strictEqual(Object.hasOwn(branch, 'targets'), false);
    }
    const observed = projectToRouteGold(result.decision, { policy: snapshot.policy });
    assert.deepStrictEqual(observed.observedIntents, typed.cases[index].observedIntents);
    assert.deepStrictEqual(observed.observedResources, typed.cases[index].observedResources);
    const rowForHash = clone(typed.cases[index]);
    const projectionHash = rowForHash.projectionHash;
    delete rowForHash.projectionHash;
    assert.strictEqual(
      computeProjectionHash('TypedRouteGoldV1', rowForHash),
      projectionHash,
    );
    scorerInputs.push({ observed, scenario: scorerScenario(entry) });
  }
  assert.strictEqual(actorFirst, true);
  const scorer = scoreRouteGoldReadOnly(scorerInputs);
  assert.strictEqual(scorer.writeBackAttempted, false);
  scorer.verdicts.forEach((verdict, index) => {
    assert.strictEqual(verdict.pass, true, `${fixture.cases[index].id} real scorer mismatch`);
  });
  const corrupted = clone(scorerInputs[0]);
  corrupted.observed.observedIntents = ['corrupted-observation'];
  const corruptedVerdict = scoreRouteGoldReadOnly([corrupted]).verdicts[0];
  assert.strictEqual(corruptedVerdict.pass, false);
  return {
    actionCounts,
    actorFirst,
    corruptedObservationPass: corruptedVerdict.pass,
    realScorerRows: scorer.verdicts.length,
    scorer: 'real-read-only-evaluateRouteGold',
    writeBackAttempted: scorer.writeBackAttempted,
  };
}

function runClosedAlgebra(snapshot, fixture) {
  const routeDecision = evaluateRoute(snapshot, fixture.cases[0]).decision;
  const negativeEntries = fixture.cases.filter((entry) => (
    entry.expectedAction !== 'route'
  ));
  for (const entry of negativeEntries) {
    const decision = evaluateRoute(snapshot, entry).decision;
    const targetSmuggle = clone(decision);
    targetSmuggle[decision.action].targets = routeDecision.route.targets;
    assertThrowsCode(
      () => parseRouteDecision(targetSmuggle),
      DecisionValidationError,
      'NEGATIVE_TARGET_FORBIDDEN',
    );
    const authoritySmuggle = clone(decision);
    authoritySmuggle[decision.action].authority = 'WithheldUntilVerify';
    assertThrowsCode(
      () => parseRouteDecision(authoritySmuggle),
      DecisionValidationError,
      'NEGATIVE_AUTHORITY_INVALID',
    );
  }
  const ambiguous = evaluateRoute(
    snapshot,
    fixture.cases.find((entry) => entry.id === 'semantic-tie-clarify'),
  ).decision;
  const zero = evaluateRoute(
    snapshot,
    fixture.cases.find((entry) => entry.id === 'zero-signal-defer'),
  ).decision;
  const forbidden = evaluateRoute(
    snapshot,
    fixture.cases.find((entry) => entry.id === 'forbidden-reject'),
  ).decision;
  assert.strictEqual(ambiguous.action, 'clarify');
  assert.ok(ambiguous.clarify.alternatives.includes('none_of_these'));
  assert.strictEqual(zero.action, 'defer');
  assert.strictEqual(forbidden.action, 'reject');
  return {
    ambiguousClarifyCount: 1,
    forbiddenAction: forbidden.action,
    negativeBranchesChecked: negativeEntries.length,
    negativeAuthorityFree: true,
    negativeTargetFree: true,
    zeroSignalAction: zero.action,
  };
}

function runAdvisor(snapshot, fixture) {
  const baseline = evaluateRoute(snapshot, fixture.cases[0]).decision;
  let contributions = 0;
  for (const entry of fixture.advisorCases) {
    const contribution = advisorContribution(snapshot, {
      effectivePolicyHash: snapshot.policy.effectivePolicyHash,
      projectionHash: entry.drift
        ? '0'.repeat(64)
        : snapshot.advisorProjection.projectionHash,
      state: entry.state,
    });
    assert.strictEqual(contribution.contributes, entry.contributes, entry.id);
    if (contribution.contributes) contributions += 1;
    assert.deepStrictEqual(evaluateRoute(snapshot, fixture.cases[0]).decision, baseline);
  }
  return { cases: fixture.advisorCases.length, contributions, decisionOverrides: 0 };
}

function runDocumentParity(snapshot, fixture) {
  const cardPath = path.join(PHASE_ROOT, 'compiled', 'PolicyCardV1.md');
  const markdown = fs.readFileSync(cardPath, 'utf8');
  assert.strictEqual(markdown, generatePolicyCard(snapshot));
  const parsed = parsePolicyCard(markdown);
  assert.strictEqual(parsed.policy.effectivePolicyHash, snapshot.policy.effectivePolicyHash);
  for (const entry of fixture.cases) {
    const machine = evaluateRoute(snapshot, entry).decision;
    const document = replayPolicyCard(markdown, entry);
    assert.strictEqual(document.terminal, 'DOCUMENT_ONLY_UNATTESTED');
    assert.strictEqual(
      document.draftStatus,
      machine.action === 'route' ? 'PREPARED_DRAFT' : null,
    );
    assert.strictEqual(canonicalize(document.decision), canonicalize(machine));
  }
  const tamperedPayload = clone(parsed);
  tamperedPayload.destinationGraph.tieBreak = [...parsed.destinationGraph.tieBreak].reverse();
  const tampered = markdown.replace(
    canonicalize(parsed),
    canonicalize(tamperedPayload),
  );
  const pair = fixture.cases.find((entry) => entry.id === 'explicit-pair-ordered');
  assertThrowsCode(
    () => replayPolicyCard(tampered, pair),
    DecisionValidationError,
    'BUNDLE_NOT_IN_POLICY',
  );
  return { cases: fixture.cases.length, machineFallback: false, tamperDetected: true };
}

function runExecutionFence(snapshot, fixture) {
  const result = evaluateRoute(snapshot, fixture.cases[0]);
  const registryHash = snapshot.sourceHashes.find((row) => (
    row.sourceId === 'cli-external-orchestration/mode-registry.json'
  )).hash;
  const context = {
    authorityClass: 'external-executor',
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    epoch: snapshot.policy.activationGeneration,
    expiresAtEpoch: snapshot.policy.activationGeneration + 2,
    preconditions: ['actor-only-commit'],
    readSet: [{ digest: registryHash, resourceId: 'registry-source.v1' }],
    registryAuthorityHash: registryHash,
    requestFactsHash: result.request.requestFactsHash,
  };
  const plane = new DestinationExecutionPlane({ planningEpoch: context.epoch });
  const prepared = plane.prepare(result.decision, context);
  const leg = prepared.preparedLegs[0];
  const effects = { count: 0 };
  const adapter = {
    atomicity: 'atomic',
    acquireLocalAuthority: () => ({ handle: 'simulated-cli', state: 'ACQUIRED' }),
    performEffect: () => {
      effects.count += 1;
      return { effectId: `simulated-cli-${effects.count}` };
    },
    verifyCurrentAuthority: () => ({ state: 'READY' }),
  };
  const current = {
    ...context,
    currentEpoch: context.epoch,
    orderedTargets: leg.orderedTargets,
  };
  assertThrowsCode(
    () => commitActor(plane, leg, {}, adapter, {
      retentionUntilEpoch: context.expiresAtEpoch,
      timestamp: '2026-07-19T00:00:00.000Z',
    }),
    ExecutionProtocolError,
    'COMMIT_WITHOUT_READY',
  );
  const ready = plane.verify(leg, current, adapter);
  const committed = commitActor(plane, leg, ready, adapter, {
    retentionUntilEpoch: context.expiresAtEpoch,
    timestamp: '2026-07-19T00:00:00.000Z',
  });
  assert.deepStrictEqual(committed.protocolPath, ['PREPARE', 'VERIFY', 'COMMIT']);
  assert.strictEqual(effects.count, 1);
  return {
    commitPath: committed.protocolPath,
    commitWithoutVerifyError: 'COMMIT_WITHOUT_READY',
    realCliEffects: 0,
    simulatedEffects: effects.count,
  };
}

function runRollback(snapshot) {
  const activationRoot = path.join(PHASE_ROOT, 'activation');
  const temporaryRoot = fs.mkdtempSync(path.join(PHASE_ROOT, '.tmp-activation-'));
  const manifestPath = path.join(temporaryRoot, 'manifest.json');
  const fencePath = path.join(temporaryRoot, 'fence-state.json');
  const priorBytes = fs.readFileSync(path.join(activationRoot, 'manifest.prior.json'));
  const candidateBytes = fs.readFileSync(path.join(activationRoot, 'manifest.candidate.json'));
  const prior = JSON.parse(priorBytes);
  const candidate = JSON.parse(candidateBytes);
  try {
    fs.writeFileSync(manifestPath, priorBytes);
    fs.writeFileSync(fencePath, fenceStateBytes(0));
    assert.throws(() => atomicFencedSwap({
      expectedCurrent: { effectivePolicyHash: '0'.repeat(64), generation: 1 },
      expectedFencingEpoch: 0,
      fencePath,
      manifestPath,
      nextBytes: candidateBytes,
      token: 'wrong-preimage',
    }), (error) => assertCode(error, 'MANIFEST_CAS_MISMATCH'));
    atomicFencedSwap({
      expectedCurrent: prior.selectedPolicy,
      expectedFencingEpoch: 0,
      fencePath,
      manifestPath,
      nextBytes: candidateBytes,
      token: 'candidate-swap',
    });
    const candidatePin = pinRequest(manifestPath);
    assertPinnedTuple(candidatePin, snapshot.policy);
    assertThrowsCode(
      () => assertSingleGeneration([
        candidatePin,
        { effectivePolicyHash: null, generation: 0 },
      ]),
      ActivationGateError,
      'MIXED_GENERATION_OBSERVED',
    );
    atomicFencedSwap({
      expectedCurrent: candidate.selectedPolicy,
      expectedFencingEpoch: 1,
      fencePath,
      manifestPath,
      nextBytes: manifestBytes(prior),
      token: 'rollback-swap',
    });
    const restored = fs.readFileSync(manifestPath);
    assert.ok(restored.equals(priorBytes));
    return {
      byteExact: true,
      finalFencingEpoch: readJson(fencePath).fencingEpoch,
      preimageMismatchBlocked: true,
      priorHash: sha256(priorBytes),
      restoredHash: sha256(restored),
    };
  } finally {
    const relative = path.relative(PHASE_ROOT, temporaryRoot);
    if (!relative.startsWith('.tmp-activation-') || relative.includes(path.sep)) {
      throw new Error('temporary activation directory failed scope validation');
    }
    fs.rmSync(temporaryRoot, { force: true, recursive: true });
  }
}

function runHardBlocks(snapshot) {
  const green = {
    advisorGuardGreen: true,
    closedAlgebraGreen: true,
    documentParityGreen: true,
    executionFenceGreen: true,
    rollbackGreen: true,
    routeGoldGreen: true,
    sourceProtectionGreen: true,
  };
  const codes = {};
  for (const [field, code] of HARD_BLOCKS) {
    assertThrowsCode(
      () => assertActivationEligible({ ...green, [field]: true }),
      ActivationGateError,
      code,
    );
    codes[field] = code;
  }
  assertThrowsCode(
    () => assertPinnedTuple({
      effectivePolicyHash: '0'.repeat(64),
      generation: snapshot.policy.activationGeneration,
    }, snapshot.policy),
    ActivationGateError,
    'PINNED_TUPLE_MISMATCH',
  );
  return { codes, eligible: assertActivationEligible(green) };
}

function runStaticGates() {
  const codeFiles = ['lib', 'harness'].flatMap((directory) => (
    fs.readdirSync(path.join(PHASE_ROOT, directory))
      .filter((name) => name.endsWith('.cjs'))
      .map((name) => path.join(PHASE_ROOT, directory, name))
  ));
  assert.strictEqual(codeFiles.length, 7);
  const source = codeFiles.map((filePath) => fs.readFileSync(filePath, 'utf8')).join('\n');
  const comments = source.split('\n')
    .filter((line) => /^\s*(?:\/\/|\/\*|\*)/.test(line))
    .join('\n');
  assert.strictEqual(/\b(?:ADR|REQ|CHK|T)-?\d+\b|\.opencode\/specs\//i.test(comments), false);
  assert.strictEqual(/\b(?:Date\.now|Math\.random|new Date)\s*\(/.test(source), false);
  const external = [...source.matchAll(/require\(['"]([^'"]+)['"]\)/g)]
    .map((match) => match[1])
    .filter((value) => !value.startsWith('.') && !value.startsWith('node:'));
  assert.deepStrictEqual(external, []);
  assert.ok(source.includes("001-compiler-n1-shadow/compiler/compiler.cjs"));
  assert.ok(source.includes("002-decision-evaluator/lib/projector.cjs"));
  return {
    codeFiles: codeFiles.length,
    commentViolations: 0,
    externalDependencies: 0,
    nondeterministicCalls: 0,
    sharedCompilerReused: true,
    sharedProjectorReused: true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ORCHESTRATION AND ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function runCanary() {
  const protectedBefore = protectedHashes();
  const authoredBefore = authoredHashes();
  assert.deepStrictEqual(protectedBefore, PROTECTED_DIGESTS);
  assert.deepStrictEqual(authoredBefore, expectedAuthoredHashes());
  const { fixture, snapshot } = loadSnapshot();
  const compiled = runCompiledGate(snapshot, fixture);
  const routes = runRouteGold(snapshot, fixture);
  const closedAlgebra = runClosedAlgebra(snapshot, fixture);
  const advisor = runAdvisor(snapshot, fixture);
  const documentParity = runDocumentParity(snapshot, fixture);
  const executionFence = runExecutionFence(snapshot, fixture);
  const rollback = runRollback(snapshot);
  const hardBlocks = runHardBlocks(snapshot);
  const staticGates = runStaticGates();
  const protectedAfter = protectedHashes();
  const authoredAfter = authoredHashes();
  assert.deepStrictEqual(protectedAfter, protectedBefore);
  assert.deepStrictEqual(authoredAfter, authoredBefore);
  return {
    advisor,
    authoredSourceDigests: authoredAfter,
    closedAlgebra,
    compiled,
    documentParity,
    executionFence,
    hardBlockCount: Object.keys(hardBlocks.codes).length,
    protectedDigests: protectedAfter,
    rollback,
    routes,
    servingAuthority: hardBlocks.eligible.servingAuthority,
    shadowOnly: hardBlocks.eligible.shadowOnly,
    staticGates,
    status: 'GREEN',
  };
}

module.exports = {
  PROTECTED_DIGESTS,
  runCanary,
};

if (require.main === module) {
  try {
    process.stdout.write(`${canonicalize(runCanary())}\n`);
  } catch (error) {
    process.stderr.write(`[cli-external-orchestration-canary] ${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}
