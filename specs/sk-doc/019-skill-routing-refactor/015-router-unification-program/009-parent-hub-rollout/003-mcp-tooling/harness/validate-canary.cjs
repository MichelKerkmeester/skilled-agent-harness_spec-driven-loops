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
} = require('../../../003-contract-schemas/lib/canonical.cjs');
const {
  atomicFencedSwap,
  fenceStateBytes,
  manifestBytes,
  pinRequest,
} = require('../../../004-compiler-n1-shadow/activation/fenced-manifest.cjs');
const {
  validateNode,
} = require('../../../004-compiler-n1-shadow/harness/json-schema.cjs');
const POLICY_SCHEMA = require('../../../003-contract-schemas/schemas/compiled-policy.v1.schema.json');
const ADVISOR_SCHEMA = require('../../../003-contract-schemas/schemas/advisor-projection.v1.schema.json');
const PROOF_SCHEMA = require('../../../003-contract-schemas/schemas/route-proof.v1.schema.json');
const {
  DecisionValidationError,
  parseRouteDecision,
} = require('../../../005-decision-evaluator/lib/decision-contract.cjs');
const {
  projectToRouteGold,
} = require('../../../005-decision-evaluator/lib/projector.cjs');
const {
  scoreRouteGoldReadOnly,
} = require('../../harness/load-replay-driver.cjs').loadReplayDriver();
const {
  DestinationExecutionPlane,
  ExecutionProtocolError,
} = require('../../../006-execution-verify-commit/lib/execution-plane.cjs');
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
  'load-playbook-scenarios.cjs': 'f5b4415034d3ea1132a862c2ae19f9015e9bff07cb54235cb42058fe4dfdcd24',
  'router-replay.cjs': '14f169a466d970648f46f0f312904cc682221d1adfdedef97264398ffc9124d9',
  'score-skill-benchmark.cjs': '05bf38b8e186fd760a5a9b3940fc646821bd9caa843ad7a9c67d9d4df22a5886',
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
    assert.strictEqual(rule.kind, 'orderedBundle');
    assert.ok(Array.isArray(rule.targetIds) && rule.targetIds.length > 1);
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
  tamperedPayload.routingModel.modes = [];
  const tampered = markdown.replace(canonicalize(parsed), canonicalize(tamperedPayload));
  assert.notStrictEqual(
    canonicalize(replayPolicyCard(tampered, fixture.cases[0]).decision),
    canonicalize(evaluateRoute(snapshot, fixture.cases[0]).decision),
  );
  return { machineFallback: false, plantedDivergenceDetected: true, rows };
}

function runExecution(snapshot) {
  const intent = 'chrome devtools figma';
  const worked = evaluateRoute(snapshot, { prompt: intent });
  assert.deepStrictEqual(targetModes(worked.decision), ['mcp-chrome-devtools', 'mcp-figma']);
  const context = {
    authorityClass: 'compiled-composition',
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    epoch: snapshot.policy.activationGeneration,
    expiresAtEpoch: snapshot.policy.activationGeneration + 2,
    preconditions: ['actor-only-commit'],
    readSet: [{ digest: snapshot.destinationGraph.graphHash, resourceId: 'destination-graph.v1' }],
    registryAuthorityHash: snapshot.destinationGraph.graphHash,
    requestFactsHash: worked.request.requestFactsHash,
  };
  const plane = new DestinationExecutionPlane({ planningEpoch: context.epoch });
  const legs = plane.prepare(worked.decision, context).preparedLegs;
  assert.strictEqual(legs.length, 2);
  const effects = { count: 0 };
  const adapter = {
    atomicity: 'atomic',
    acquireLocalAuthority: () => ({ handle: 'simulated-mcp', state: 'ACQUIRED' }),
    performEffect: () => {
      effects.count += 1;
      return { effectId: `simulated-mcp-${effects.count}` };
    },
    verifyCurrentAuthority: () => ({ state: 'READY' }),
  };
  const current = {
    ...context,
    currentEpoch: context.epoch,
    orderedTargets: legs[0].orderedTargets,
  };
  const options = {
    retentionUntilEpoch: context.expiresAtEpoch,
    timestamp: '2026-07-19T00:00:00.000Z',
  };
  assertThrowsCode(
    () => plane.commit(legs[0], {}, adapter, options),
    ExecutionProtocolError,
    'COMMIT_WITHOUT_READY',
  );
  const ready = plane.verify(legs[0], current, adapter);
  const commit = plane.commit(legs[0], ready, adapter, options);
  const duplicate = plane.commit(legs[0], ready, adapter, options);
  assert.deepStrictEqual(commit.protocolPath, ['PREPARE', 'VERIFY', 'COMMIT']);
  assert.strictEqual(commit.duplicate, false);
  assert.strictEqual(duplicate.duplicate, true);
  assert.deepStrictEqual(duplicate.receipt, commit.receipt);
  const compositionKey = legs[0].proof.idempotencyKey;
  const changedPolicyKey = new DestinationExecutionPlane({ planningEpoch: context.epoch })
    .prepare(worked.decision, { ...context, effectivePolicyHash: '0'.repeat(64) })
    .preparedLegs[0].proof.idempotencyKey;
  assert.notStrictEqual(changedPolicyKey, compositionKey);
  return {
    commitPath: commit.protocolPath,
    duplicateEffects: 0,
    externalEffectsSimulated: effects.count,
    idempotencyTeeth: {
      changedPolicyKey,
      compositionKey,
      effectivePolicyHashChangesKey: true,
    },
    negativeWithheldAuthority: true,
    proofChecks: ['hash', 'epoch', 'expiry', 'read-set', 'idempotency', 'receipt'],
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

function runGuardRemovalFalsifiers(snapshot) {
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

  const worked = evaluateRoute(snapshot, { prompt: 'chrome devtools figma' });
  const missingRuleSnapshot = clone(snapshot);
  missingRuleSnapshot.destinationGraph.compositionRules = [];
  assertThrowsCode(
    () => new CompositionExecutor(
      missingRuleSnapshot,
      worked.request,
      'chrome devtools figma',
    ).prepare(worked.decision),
    CompositionExecutionError,
    'COMPOSITION_RULE_MISSING',
  );

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
    compositionRuleGuard: 'COMPOSITION_RULE_MISSING',
    readOnlyGateRemovalAllowsViolation: true,
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
  assert.ok(graphSource.includes('"kind":"orderedBundle"'));
  assert.ok(graphSource.includes('"targetIds"'));
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
  const execution = runExecution(snapshot);
  const destinationRollout = runDestinationRollout(snapshot);
  const rollback = runRollback(snapshot);
  const guardRemovalFalsifiers = runGuardRemovalFalsifiers(snapshot);
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
      compositionRule: 'pass',
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
