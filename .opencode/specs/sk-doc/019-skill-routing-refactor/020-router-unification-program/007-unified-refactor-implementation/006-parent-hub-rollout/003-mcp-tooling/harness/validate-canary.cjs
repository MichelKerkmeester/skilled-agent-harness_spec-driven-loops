#!/usr/bin/env node
'use strict';

const assert = require('node:assert');
const crypto = require('node:crypto');
const fs = require('node:fs');
const Module = require('node:module');
const path = require('node:path');

const {
  canonicalize,
  computeBasePolicyHash,
  computeEffectivePolicyHash,
  computeProofHash,
  computeProjectionHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  atomicFencedSwap,
  fenceStateBytes,
  manifestBytes,
  pinRequest,
} = require('../../../001-compiler-n1-shadow/activation/fenced-manifest.cjs');
const {
  validateNode,
} = require('../../../001-compiler-n1-shadow/harness/json-schema.cjs');
const POLICY_SCHEMA = require('../../../000-contract-schemas/schemas/compiled-policy.v1.schema.json');
const ADVISOR_SCHEMA = require('../../../000-contract-schemas/schemas/advisor-projection.v1.schema.json');
const PROOF_SCHEMA = require('../../../000-contract-schemas/schemas/route-proof.v1.schema.json');
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
  prepareRoute: prepareExecutionRoute,
} = require('../../../003-execution-verify-commit/lib/execution-plane.cjs');
const {
  ActivationGateError,
  HARD_BLOCKS,
  assertActivationEligible,
  assertPinnedTuple,
  assertSingleGeneration,
} = require('../lib/activation-gate.cjs');
const {
  CompositionExecutionError,
  CompositionExecutor,
  DestinationRolloutGate,
} = require('../lib/composition-executor.cjs');
const {
  artifactBytes,
  assertNoTransportApprover,
  destinationKey,
  sha256,
} = require('../lib/registry-compiler.cjs');
const { advisorContribution, evaluateRoute } = require('../lib/router.cjs');
const {
  generatePolicyCard,
  parsePolicyCard,
  replayPolicyCard,
} = require('../lib/policy-card.cjs');
const {
  loadSnapshot,
  scorerScenario,
  sourceInputs,
} = require('./build-artifacts.cjs');

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
  'load-playbook-scenarios.cjs': '5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029',
  'router-replay.cjs': 'd5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47',
  'score-skill-benchmark.cjs': 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
});

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
  return Object.fromEntries(Object.entries(sourceInputs()).map(([id, bytes]) => [id, sha256(bytes)]));
}

function expectedAuthoredHashes() {
  const acceptance = readJson(path.join(PHASE_ROOT, 'activation', 'acceptance.json'));
  return Object.fromEntries(acceptance.sourceHashes.map((entry) => [entry.sourceId, entry.hash]));
}

function assertCode(error, code) {
  return Boolean(error && error.code === code);
}

function assertThrowsCode(operation, errorType, code) {
  assert.throws(operation, (error) => error instanceof errorType && assertCode(error, code), code);
}

function targetModes(decision) {
  return decision.action === 'route'
    ? decision.route.targets.map((target) => target.destinationId.workflowMode)
    : [];
}

function singleDecision(snapshot, destination) {
  return parseRouteDecision({
    action: 'route',
    route: {
      authority: 'WithheldUntilVerify',
      basis: { kind: 'signal' },
      evidence: [],
      selectionKind: 'single',
      targets: [{
        authorityRef: destination.authorityRef,
        destinationId: destination.id,
        mutatesWorkspace: destination.mutatesWorkspace,
        role: destination.role,
      }],
    },
    schemaVersion: 'V1',
  }, snapshot.policy);
}

function assertCompiled(snapshot) {
  const second = loadSnapshot().snapshot;
  const deliveredPolicy = fs.readFileSync(path.join(PHASE_ROOT, 'compiled', 'policy.json'));
  const deliveredGraph = fs.readFileSync(path.join(PHASE_ROOT, 'compiled', 'destination-graph.json'));
  assert.ok(artifactBytes(snapshot.policy).equals(deliveredPolicy));
  assert.ok(artifactBytes(snapshot.policy).equals(artifactBytes(second.policy)));
  assert.ok(artifactBytes(snapshot.destinationGraph).equals(deliveredGraph));
  assert.ok(artifactBytes(snapshot.destinationGraph).equals(artifactBytes(second.destinationGraph)));
  assert.strictEqual(computeBasePolicyHash(snapshot.policy), snapshot.policy.basePolicyHash);
  assert.strictEqual(computeEffectivePolicyHash(snapshot.policy), snapshot.policy.effectivePolicyHash);
  assert.deepStrictEqual(validateNode(POLICY_SCHEMA, snapshot.policy, POLICY_SCHEMA, '$'), []);
  assert.deepStrictEqual(
    validateNode(ADVISOR_SCHEMA, snapshot.advisorProjection, ADVISOR_SCHEMA, '$'),
    [],
  );
  const graphBody = clone(snapshot.destinationGraph);
  delete graphBody.graphHash;
  assert.strictEqual(sha256(artifactBytes(graphBody)), snapshot.destinationGraph.graphHash);
  assert.ok(snapshot.policy.provenancePolicy.sourceHashes.includes(snapshot.destinationGraph.graphHash));
  assertNoTransportApprover(snapshot.destinationGraph);
  const transportIds = new Set(snapshot.destinationGraph.destinations
    .filter((entry) => entry.role === 'transport')
    .map((entry) => destinationKey(entry.id)));
  for (const edge of snapshot.destinationGraph.authorityGraph) {
    assert.strictEqual(transportIds.has(destinationKey(edge.approverDestinationId)), false);
  }
  for (const rule of snapshot.destinationGraph.compositionRules) {
    assert.ok(Array.isArray(rule.composeAfter) && rule.composeAfter.length > 0);
    assert.ok(rule.requiresAuthorityFrom);
    assert.deepStrictEqual(rule.targetIds, [rule.requiresAuthorityFrom, rule.composeAfter[0].dependentId]);
  }
  assert.strictEqual(snapshot.destinationGraph.destinations.some((entry) => (
    entry.id.skillId === 'mcp-code-mode'
  )), false);
  return {
    authorityEdges: snapshot.destinationGraph.authorityGraph.length,
    byteIdenticalRecompile: true,
    compositionRules: snapshot.destinationGraph.compositionRules.length,
    destinationCount: snapshot.destinationGraph.destinations.length,
    graphBoundToPolicy: true,
    graphHash: snapshot.destinationGraph.graphHash,
    mcpCodeModeRole: 'external-infrastructure-only',
    transportApprovers: 0,
  };
}

function runRoutes(snapshot, fixture) {
  const typed = readJson(path.join(PHASE_ROOT, 'compiled', 'route-gold.typed.json'));
  assert.deepStrictEqual(typed.cases.map((row) => row.scenarioId), fixture.cases.map((row) => row.id));
  const inputs = [];
  const rows = [];
  for (const [index, entry] of fixture.cases.entries()) {
    const result = evaluateRoute(snapshot, entry);
    assert.strictEqual(result.decision.action, entry.expectedAction, entry.id);
    if (entry.expectedSelectionKind) {
      assert.strictEqual(result.decision.route.selectionKind, entry.expectedSelectionKind, entry.id);
      assert.deepStrictEqual(targetModes(result.decision), entry.expectedModes, entry.id);
    }
    if (entry.expectedReason) {
      assert.strictEqual(result.decision[result.decision.action].reason, entry.expectedReason, entry.id);
    }
    if (result.decision.action !== 'route') {
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
    assert.strictEqual(computeProjectionHash('TypedRouteGoldV1', rowForHash), projectionHash);
    inputs.push({ observed, scenario: scorerScenario(entry) });
    rows.push({ action: result.decision.action, id: entry.id, observed, targets: targetModes(result.decision) });
  }
  const scorer = scoreRouteGoldReadOnly(inputs);
  assert.strictEqual(scorer.writeBackAttempted, false);
  scorer.verdicts.forEach((verdict, index) => {
    assert.strictEqual(verdict.pass, true, `${fixture.cases[index].id} real scorer mismatch`);
    rows[index].realEvaluateRouteGoldPass = true;
  });
  const corrupted = clone(inputs[0]);
  corrupted.observed.observedIntents = ['corrupted-observation'];
  const corruptedVerdict = scoreRouteGoldReadOnly([corrupted]).verdicts[0];
  assert.strictEqual(corruptedVerdict.pass, false);

  const { routeSkillResources } = require(path.join(SCORER_ROOT, 'router-replay.cjs'));
  const realHubRows = fixture.cases.filter((entry) => entry.expectedAction === 'route').map((entry) => {
    const observed = routeSkillResources({
      skillRoot: path.join(REPO_ROOT, '.opencode', 'skills', 'mcp-tooling'),
      taskText: entry.prompt,
    });
    const expectedHubModes = entry.expectedModes.filter((mode) => mode.startsWith('mcp-'));
    expectedHubModes.forEach((mode) => assert.ok(observed.intents.includes(mode), `${entry.id} live hub`));
    return { id: entry.id, intents: observed.intents, parseable: observed.parseable };
  });
  return {
    corruptedObservationPass: corruptedVerdict.pass,
    realEvaluateRouteGoldRows: scorer.verdicts.length,
    realHubRows,
    rows,
    scorer: 'real-read-only-evaluateRouteGold',
    writeBackAttempted: scorer.writeBackAttempted,
  };
}

function runAdvisor(snapshot, fixture) {
  const baseline = evaluateRoute(snapshot, fixture.cases[0]).decision;
  const rows = fixture.advisorCases.map((entry) => {
    const advisor = {
      effectivePolicyHash: snapshot.policy.effectivePolicyHash,
      projectionHash: entry.drift ? '0'.repeat(64) : snapshot.advisorProjection.projectionHash,
      state: entry.state,
    };
    const contribution = advisorContribution(snapshot, advisor);
    assert.strictEqual(contribution.contributes, entry.contributes, entry.id);
    assert.deepStrictEqual(evaluateRoute(snapshot, fixture.cases[0]).decision, baseline);
    return { id: entry.id, ...contribution };
  });
  return { decisionOverrideCount: 0, rows };
}

function runDocumentParity(snapshot, fixture) {
  const markdown = fs.readFileSync(path.join(PHASE_ROOT, 'compiled', 'PolicyCardV1.md'), 'utf8');
  assert.strictEqual(markdown, generatePolicyCard(snapshot));
  const parsed = parsePolicyCard(markdown);
  assert.strictEqual(parsed.policy.effectivePolicyHash, snapshot.policy.effectivePolicyHash);
  const rows = fixture.cases.map((entry) => {
    const machine = evaluateRoute(snapshot, entry).decision;
    const document = replayPolicyCard(markdown, entry);
    assert.strictEqual(document.terminal, 'DOCUMENT_ONLY_UNATTESTED');
    assert.strictEqual(document.draftStatus, machine.action === 'route' ? 'PREPARED_DRAFT' : null);
    assert.strictEqual(canonicalize(document.decision), canonicalize(machine));
    return { action: machine.action, id: entry.id, terminal: document.terminal };
  });
  const tamperedPayload = clone(parsed);
  tamperedPayload.destinationGraph.compositionRules = [];
  const tampered = markdown.replace(canonicalize(parsed), canonicalize(tamperedPayload));
  assert.notStrictEqual(
    canonicalize(replayPolicyCard(tampered, fixture.cases[0]).decision),
    canonicalize(evaluateRoute(snapshot, fixture.cases[0]).decision),
  );
  return { machineFallback: false, plantedDivergenceDetected: true, rows };
}

function legWithProof(leg, changes) {
  const copy = clone(leg);
  Object.assign(copy.proof, changes);
  copy.proof.proofHash = computeProofHash(copy.proof);
  return copy;
}

function runExecution(snapshot, fixture) {
  const worked = evaluateRoute(snapshot, fixture.cases[0]);
  const intent = fixture.cases[0].prompt;

  const withoutVerify = new CompositionExecutor(snapshot, worked.request, intent);
  const withoutVerifyLegs = withoutVerify.prepare(worked.decision).legs;
  assertThrowsCode(
    () => withoutVerify.commit(withoutVerifyLegs[1], undefined),
    CompositionExecutionError,
    'COMMIT_WITHOUT_VERIFY',
  );

  const outOfOrder = new CompositionExecutor(snapshot, worked.request, intent);
  const outOfOrderLegs = outOfOrder.prepare(worked.decision).legs;
  const fabricatedReady = {
    authorityConsumedFor: destinationKey(outOfOrderLegs[1].target.destinationId),
    legKey: destinationKey(outOfOrderLegs[1].target.destinationId),
    requestFactsHash: worked.request.requestFactsHash,
    state: 'READY',
  };
  assertThrowsCode(
    () => outOfOrder.commit(outOfOrderLegs[1], fabricatedReady),
    CompositionExecutionError,
    'COMPOSE_AFTER_PREDECESSOR_UNRESOLVED',
  );

  const denied = new CompositionExecutor(snapshot, worked.request, intent);
  const deniedLegs = denied.prepare(worked.decision).legs;
  assert.strictEqual(denied.verifyJudgment(deniedLegs[0], 'deny').state, 'REJECT');
  assertThrowsCode(
    () => denied.verifyDestination(deniedLegs[1]),
    CompositionExecutionError,
    'REQUIRES_AUTHORITY_UNSATISFIED',
  );
  const deniedReady = {
    authorityConsumedFor: destinationKey(deniedLegs[1].target.destinationId),
    legKey: destinationKey(deniedLegs[1].target.destinationId),
    requestFactsHash: worked.request.requestFactsHash,
    state: 'READY',
  };
  assertThrowsCode(
    () => denied.commit(deniedLegs[1], deniedReady),
    CompositionExecutionError,
    'REQUIRES_AUTHORITY_UNSATISFIED',
  );

  const successful = new CompositionExecutor(snapshot, worked.request, intent);
  const legs = successful.prepare(worked.decision).legs;
  const judgment = successful.verifyJudgment(legs[0], 'approve');
  assert.strictEqual(judgment.approvalProof.attestation.issuer, 'destination-judgment-verify');
  assert.strictEqual(computeProofHash(judgment.approvalProof), judgment.approvalProof.proofHash);
  assert.deepStrictEqual(validateNode(PROOF_SCHEMA, judgment.approvalProof, PROOF_SCHEMA, '$'), []);
  const transportReady = successful.verifyDestination(legs[1]);
  const commit = successful.commit(legs[1], transportReady);
  const duplicate = successful.commit(legs[1], transportReady);
  assert.deepStrictEqual(commit.protocolPath, ['PREPARE', 'VERIFY', 'COMMIT']);
  assert.strictEqual(commit.duplicate, false);
  assert.strictEqual(duplicate.duplicate, true);
  assert.deepStrictEqual(duplicate.receipt, commit.receipt);

  const idempotencyDecision = {
    action: 'route',
    route: {
      authority: 'WithheldUntilVerify',
      targets: [clone(legs[0].target)],
    },
    schemaVersion: 'V1',
  };
  const compositionKey = new CompositionExecutor(snapshot, worked.request, intent)
    .prepare(idempotencyDecision).legs[0].proof.idempotencyKey;
  const changedPolicySnapshot = clone(snapshot);
  changedPolicySnapshot.policy.effectivePolicyHash = '0'.repeat(64);
  const changedPolicyKey = new CompositionExecutor(changedPolicySnapshot, worked.request, intent)
    .prepare(idempotencyDecision).legs[0].proof.idempotencyKey;
  assert.notStrictEqual(changedPolicyKey, compositionKey);

  const executionPlaneKey = prepareExecutionRoute(idempotencyDecision, {
    authorityClass: 'composition-executor',
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    epoch: snapshot.policy.activationGeneration,
    expiresAtEpoch: snapshot.policy.activationGeneration + 2,
    preconditions: [],
    readSet: [{ digest: successful.bindings.intentHash, resourceId: 'pinned-intent.v1' }],
    registryAuthorityHash: snapshot.destinationGraph.graphHash,
    requestFactsHash: worked.request.requestFactsHash,
  }).preparedLegs[0].proof.idempotencyKey;
  assert.strictEqual(compositionKey, executionPlaneKey);

  const directTransport = snapshot.destinationGraph.destinations.find((entry) => (
    entry.effectClass === 'external-mutation-capable'
  ));
  const directExecutor = new CompositionExecutor(snapshot, worked.request, intent);
  const directLeg = directExecutor.prepare(singleDecision(snapshot, directTransport)).legs[0];
  const directReady = {
    authorityConsumedFor: destinationKey(directLeg.target.destinationId),
    legKey: destinationKey(directLeg.target.destinationId),
    requestFactsHash: worked.request.requestFactsHash,
    state: 'READY',
  };
  assertThrowsCode(
    () => directExecutor.commit(directLeg, directReady),
    CompositionExecutionError,
    'REQUIRES_AUTHORITY_UNSATISFIED',
  );

  const proofChecks = new CompositionExecutor(snapshot, worked.request, intent);
  const proofLeg = proofChecks.prepare(worked.decision).legs[0];
  const badHash = clone(proofLeg);
  badHash.proof.readSet[0].digest = '0'.repeat(64);
  assertThrowsCode(
    () => proofChecks.verifyJudgment(badHash, 'approve'),
    CompositionExecutionError,
    'PROOF_HASH_MISMATCH',
  );
  assertThrowsCode(
    () => proofChecks.verifyJudgment(legWithProof(proofLeg, { epoch: snapshot.policy.activationGeneration + 1 }), 'approve'),
    CompositionExecutionError,
    'PROOF_EPOCH_MISMATCH',
  );
  assertThrowsCode(
    () => proofChecks.verifyJudgment(legWithProof(proofLeg, { expiresAtEpoch: snapshot.policy.activationGeneration - 1 }), 'approve'),
    CompositionExecutionError,
    'PROOF_EXPIRED',
  );
  const badRead = clone(proofLeg);
  badRead.proof.readSet[0].digest = '1'.repeat(64);
  badRead.proof.proofHash = computeProofHash(badRead.proof);
  assertThrowsCode(
    () => proofChecks.verifyJudgment(badRead, 'approve'),
    CompositionExecutionError,
    'PROOF_READ_SET_MISMATCH',
  );
  return {
    approvalProofHash: judgment.approvalProof.proofHash,
    commitPath: commit.protocolPath,
    duplicateEffects: 0,
    externalEffectsSimulated: 1,
    idempotencyTeeth: {
      changedPolicyKey,
      compositionKey,
      effectivePolicyHashChangesKey: true,
      executionPlaneKey,
      matchesExecutionPlane: true,
    },
    negativeWithheldAuthority: true,
    proofChecks: ['hash', 'epoch', 'expiry', 'read-set', 'authority', 'idempotency', 'receipt'],
    workedCase: targetModes(worked.decision),
  };
}

function runDestinationRollout(snapshot) {
  const graph = snapshot.destinationGraph;
  const mutating = graph.destinations.find((entry) => entry.effectClass === 'external-mutation-capable');
  const transports = graph.destinations.filter((entry) => entry.role === 'transport');
  const gate = new DestinationRolloutGate(graph);
  assertThrowsCode(
    () => gate.enableMutating(mutating.id),
    CompositionExecutionError,
    'READ_ONLY_LEGS_INCOMPLETE',
  );
  for (const entry of transports) {
    const request = evaluateRoute(snapshot, { prompt: 'read-only transport proof' }).request;
    const executor = new CompositionExecutor(snapshot, request, `read-only:${destinationKey(entry.id)}`);
    const leg = executor.prepare(singleDecision(snapshot, entry)).legs[0];
    const ready = executor.verifyReadOnly(leg);
    assert.strictEqual(executor.resolveReadOnly(leg, ready).state, 'RESOLVED_READ_ONLY');
    if (entry.effectClass === 'read-only') {
      assertThrowsCode(
        () => executor.commit(leg, { ...ready, authorityConsumedFor: destinationKey(entry.id) }),
        CompositionExecutionError,
        'READ_ONLY_DESTINATION_CANNOT_COMMIT',
      );
    }
    gate.recordReadOnly(entry.id, true);
  }
  assert.strictEqual(gate.enableMutating(mutating.id).enabled, true);
  return {
    mutatingEnabledAfterReadOnly: true,
    mutatingMode: mutating.id.workflowMode,
    readOnlyLegsProven: transports.map((entry) => entry.id.workflowMode),
  };
}

function runRollback(snapshot) {
  const activationDir = path.join(PHASE_ROOT, 'activation');
  const temporaryRoot = fs.mkdtempSync(path.join(PHASE_ROOT, '.tmp-activation-'));
  const manifestPath = path.join(temporaryRoot, 'manifest.json');
  const fencePath = path.join(temporaryRoot, 'fence-state.json');
  const priorBytes = fs.readFileSync(path.join(activationDir, 'manifest.prior.json'));
  const candidateBytes = fs.readFileSync(path.join(activationDir, 'manifest.candidate.json'));
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
    assertPinnedTuple(candidatePin, snapshot);
    assertThrowsCode(
      () => assertSingleGeneration([candidatePin, {
        effectivePolicyHash: null,
        generation: 0,
      }]),
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
      caveat: 'rollback cannot undo a committed external effect; post-COMMIT recovery is destination-owned',
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

function loadMutant(filePath, replacements) {
  let source = fs.readFileSync(filePath, 'utf8');
  for (const [pattern, replacement] of replacements) {
    const next = source.replace(pattern, replacement);
    assert.notStrictEqual(next, source, `mutation pattern was not found: ${pattern}`);
    source = next;
  }
  const mutant = new Module(filePath, module);
  mutant.filename = filePath;
  mutant.paths = Module._nodeModulePaths(path.dirname(filePath));
  mutant._compile(source, filePath);
  return mutant.exports;
}

function runGuardRemovalFalsifiers(snapshot, fixture) {
  const compilerPath = path.join(PHASE_ROOT, 'lib', 'registry-compiler.cjs');
  const executorPath = path.join(PHASE_ROOT, 'lib', 'composition-executor.cjs');
  const malformed = clone(snapshot.destinationGraph);
  const transport = malformed.destinations.find((entry) => entry.role === 'transport');
  malformed.authorityGraph[0].approverDestinationId = transport.id;
  assertThrowsCode(() => assertNoTransportApprover(malformed), TypeError, 'TRANSPORT_SUPPLIES_JUDGMENT');
  const compilerMutant = loadMutant(compilerPath, [[
    /function assertNoTransportApprover\(destinationGraph\) \{[\s\S]*?\n\}\n\nfunction compileRegistry/,
    'function assertNoTransportApprover() {}\n\nfunction compileRegistry',
  ]]);
  assert.doesNotThrow(() => compilerMutant.assertNoTransportApprover(malformed));

  const worked = evaluateRoute(snapshot, fixture.cases[0]);
  const orderMutant = loadMutant(executorPath, [[/    assertComposeOrder\(this, leg\);\n/g, '']]);
  const orderExecutor = new orderMutant.CompositionExecutor(snapshot, worked.request, fixture.cases[0].prompt);
  const orderLegs = orderExecutor.prepare(worked.decision).legs;
  orderExecutor.verifyJudgment(orderLegs[0], 'approve');
  orderExecutor.resolved.delete(destinationKey(orderLegs[0].target.destinationId));
  assert.doesNotThrow(() => orderExecutor.verifyDestination(orderLegs[1]));

  const authorityMutant = loadMutant(executorPath, [[/    assertAuthoritySatisfied\(this, leg\);\n/g, '']]);
  const authorityExecutor = new authorityMutant.CompositionExecutor(snapshot, worked.request, fixture.cases[0].prompt);
  const authorityLegs = authorityExecutor.prepare(worked.decision).legs;
  authorityExecutor.verifyJudgment(authorityLegs[0], 'deny');
  assert.doesNotThrow(() => authorityExecutor.verifyDestination(authorityLegs[1]));

  const stageMutant = loadMutant(executorPath, [[
    '    assertReadOnlyStageEligible(this, rule);\n',
    '',
  ]]);
  const mutating = snapshot.destinationGraph.destinations.find((entry) => (
    entry.effectClass === 'external-mutation-capable'
  ));
  const stageGate = new stageMutant.DestinationRolloutGate(snapshot.destinationGraph);
  assert.doesNotThrow(() => stageGate.enableMutating(mutating.id));
  return {
    composeAfterGuardRemovalAllowsViolation: true,
    readOnlyGateRemovalAllowsViolation: true,
    requiresAuthorityGuardRemovalAllowsViolation: true,
    transportRoleGuardRemovalAllowsViolation: true,
  };
}

function runHardBlocks(snapshot) {
  const route = evaluateRoute(snapshot, { prompt: 'clickup task management' }).decision;
  const negative = evaluateRoute(snapshot, { prompt: 'orchard inventory' }).decision;
  const targetSmuggle = clone(negative);
  targetSmuggle.defer.targets = route.route.targets;
  assertThrowsCode(
    () => parseRouteDecision(targetSmuggle),
    DecisionValidationError,
    'NEGATIVE_TARGET_FORBIDDEN',
  );
  const authoritySmuggle = clone(negative);
  authoritySmuggle.defer.authority = 'WithheldUntilVerify';
  assertThrowsCode(
    () => parseRouteDecision(authoritySmuggle),
    DecisionValidationError,
    'NEGATIVE_AUTHORITY_INVALID',
  );
  assertThrowsCode(
    () => assertPinnedTuple({
      effectivePolicyHash: '0'.repeat(64),
      generation: snapshot.policy.activationGeneration,
    }, snapshot),
    ActivationGateError,
    'PINNED_TUPLE_MISMATCH',
  );
  const green = {
    advisorGuardGreen: true,
    destinationRolloutGreen: true,
    documentParityGreen: true,
    rollbackGreen: true,
    routeGoldGreen: true,
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
  return {
    codes,
    eligible: assertActivationEligible(green),
    negativeAuthorityCode: 'NEGATIVE_AUTHORITY_INVALID',
    negativeTargetCode: 'NEGATIVE_TARGET_FORBIDDEN',
  };
}

function listCodeFiles() {
  return ['lib', 'harness'].flatMap((directory) => fs.readdirSync(path.join(PHASE_ROOT, directory))
    .filter((name) => name.endsWith('.cjs'))
    .map((name) => path.join(PHASE_ROOT, directory, name)));
}

function runStaticGates(snapshot) {
  const files = listCodeFiles();
  const source = files.map((filePath) => fs.readFileSync(filePath, 'utf8')).join('\n');
  const branchPatterns = [
    /if\s*\([^)]*skillId\s*(?:===|!==)\s*['"]/,
    /switch\s*\([^)]*skillId/,
    /if\s*\([^)]*(?:mcp-figma|mcp-refero|mcp-mobbin)\s*(?:===|!==)/,
  ];
  branchPatterns.forEach((pattern) => assert.strictEqual(pattern.test(source), false, pattern));
  const comments = source.split('\n').filter((line) => /^\s*(?:\/\/|\/\*|\*)/.test(line)).join('\n');
  assert.strictEqual(/\b(?:ADR|REQ|CHK|T)-?\d+\b|\.opencode\/specs\//i.test(comments), false);
  const external = [...source.matchAll(/require\(['"]([^'"]+)['"]\)/g)]
    .map((match) => match[1])
    .filter((value) => !value.startsWith('.') && !value.startsWith('node:'));
  assert.deepStrictEqual(external, []);
  const graphSource = fs.readFileSync(path.join(PHASE_ROOT, 'compiled', 'destination-graph.json'), 'utf8');
  assert.ok(graphSource.includes('composeAfter'));
  assert.ok(graphSource.includes('requiresAuthorityFrom'));
  return {
    codeFiles: files.length,
    commentViolations: 0,
    compositionDataBound: true,
    externalDependencies: 0,
    nameConditionalBranches: 0,
    roleCount: new Set(snapshot.destinationGraph.destinations.map((entry) => entry.role)).size,
  };
}

function runCanary() {
  const protectedBefore = protectedHashes();
  const authoredBefore = authoredHashes();
  assert.deepStrictEqual(protectedBefore, PROTECTED_DIGESTS);
  assert.deepStrictEqual(authoredBefore, expectedAuthoredHashes());
  const { fixture, snapshot } = loadSnapshot();
  const compiled = assertCompiled(snapshot);
  const routes = runRoutes(snapshot, fixture);
  const advisor = runAdvisor(snapshot, fixture);
  const documentParity = runDocumentParity(snapshot, fixture);
  const execution = runExecution(snapshot, fixture);
  const destinationRollout = runDestinationRollout(snapshot);
  const rollback = runRollback(snapshot);
  const guardRemovalFalsifiers = runGuardRemovalFalsifiers(snapshot, fixture);
  const hardBlocks = runHardBlocks(snapshot);
  const staticGates = runStaticGates(snapshot);
  const protectedAfter = protectedHashes();
  const authoredAfter = authoredHashes();
  assert.deepStrictEqual(protectedAfter, protectedBefore);
  assert.deepStrictEqual(authoredAfter, authoredBefore);
  return {
    advisor,
    authoredSourceDigests: authoredAfter,
    blastRadius: readJson(path.join(PHASE_ROOT, 'compiled', 'blast-radius.json')),
    compiled,
    destinationRollout,
    documentParity,
    execution,
    guardRemovalFalsifiers,
    hardBlocks,
    protectedDigests: protectedAfter,
    rollback,
    routes,
    stage4: {
      advisorIdentity: 'match-or-annotation-only',
      documentParity: 'pass',
      rollbackDrill: 'pass',
      routeGold: 'GREEN',
      scorer: 'real-read-only-evaluateRouteGold',
      servingAuthority: 'legacy',
    },
    stage6: {
      authority: 'pass',
      composeAfter: 'pass',
      epoch: 'pass',
      expiry: 'pass',
      idempotency: 'pass',
      readOnlyBeforeMutating: 'pass',
      readSet: 'pass',
      receipt: 'pass',
      routeProof: 'pass',
    },
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
    process.stderr.write(`[mcp-tooling-canary] ${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}
