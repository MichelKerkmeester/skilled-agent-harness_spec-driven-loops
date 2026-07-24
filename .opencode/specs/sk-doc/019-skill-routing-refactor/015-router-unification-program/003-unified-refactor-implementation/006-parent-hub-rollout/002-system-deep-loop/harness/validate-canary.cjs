#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ HARNESS: DEEP-LOOP STAGE-GATE VALIDATION                              ║
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
  computeProjectionHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const POLICY_SCHEMA = require('../../../000-contract-schemas/schemas/compiled-policy.v1.schema.json');
const ADVISOR_SCHEMA = require('../../../000-contract-schemas/schemas/advisor-projection.v1.schema.json');
const CARD_SCHEMA = require('../../../000-contract-schemas/schemas/policy-card.v1.schema.json');
const TYPED_GOLD_SCHEMA = require('../../../000-contract-schemas/schemas/typed-route-gold.v1.schema.json');
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
  scoreRouteGoldReadOnly,
} = require('../../../002-decision-evaluator/replay-driver.cjs');
const {
  DestinationExecutionPlane,
  ExecutionProtocolError,
} = require('../../../003-execution-verify-commit/lib/execution-plane.cjs');
const {
  CanaryActivationError,
  HARD_BLOCKS,
  assertActivationEligible,
  assertPinnedTuple,
  assertSingleGeneration,
} = require('../lib/activation-gate.cjs');
const {
  assertSingleRoute,
  evaluateCanary,
} = require('../lib/canary-router.cjs');
const { commitActor } = require('../lib/execution-fence.cjs');
const {
  artifactBytes,
  assertInjective,
  assertNoCollapse,
  compileRegistry,
  sha256,
} = require('../lib/registry-compiler.cjs');
const {
  generatePolicyCard,
  replayPolicyCard,
} = require('../lib/policy-card.cjs');
const {
  compiledLeafPairsForDecision,
  compatibilityProjection,
  loadSnapshot,
  sourceBytes,
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
    if (parent === current) throw new Error('repository root could not be resolved');
    current = parent;
  }
}

const REPO_ROOT = findRepoRoot(PHASE_ROOT);
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'system-deep-loop');
const SCORER_ROOT = path.join(
  SKILL_ROOT,
  'deep-improvement',
  'scripts',
  'skill-benchmark',
);
const PROTECTED_DIGESTS = Object.freeze({
  'load-playbook-scenarios.cjs': '5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029',
  'router-replay.cjs': 'd5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47',
  'score-skill-benchmark.cjs': 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
});
const AUTHORED_SOURCE_DIGESTS = Object.freeze({
  'SKILL.md': '7aff776f7789320667101bff71ce6b214f3bc57c47e85294a73463e96deca485',
  'mode-registry.json': 'a26e9ebd5a3a10f29ff56833420cc484de53fdc074b35d943214788f627d3b8e',
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function fileHash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function protectedHashes() {
  return Object.fromEntries(Object.keys(PROTECTED_DIGESTS).map((name) => (
    [name, fileHash(path.join(SCORER_ROOT, name))]
  )));
}

function authoredSourceHashes() {
  return Object.fromEntries(Object.keys(AUTHORED_SOURCE_DIGESTS).map((name) => (
    [name, fileHash(path.join(SKILL_ROOT, name))]
  )));
}

function schemaErrors(schema, value) {
  return validateNode(schema, value, schema, '$');
}

function assertCode(error, expectedCode) {
  return Boolean(error && error.code === expectedCode);
}

function assertThrowsCode(operation, errorType, code) {
  assert.throws(operation, (error) => error instanceof errorType && assertCode(error, code), code);
}

function targetModes(decision) {
  return decision.action === 'route'
    ? decision.route.targets.map((entry) => entry.destinationId.workflowMode)
    : [];
}

function scorerScenario(entry) {
  return {
    classKind: 'routing',
    expectedIntent: entry.gold.expectedIntents[0],
    expectedIntents: entry.gold.expectedIntents,
    expectedResources: entry.gold.expectedResources,
    goldParseError: null,
    hasIntentGold: true,
    hasResourceGold: true,
    scenarioId: entry.id,
    source: { featureFile: 'real-system-deep-loop-canary', shape: 'sk-doc' },
  };
}

function compileWithRegistry(registry, generation) {
  const bytes = sourceBytes();
  bytes['mode-registry.json'] = Buffer.from(`${JSON.stringify(registry, null, 2)}\n`, 'utf8');
  return compileRegistry({
    activationGeneration: generation,
    leafManifest: JSON.parse(bytes['leaf-manifest.json'].toString('utf8')),
    registry,
    skillMarkdown: bytes['SKILL.md'].toString('utf8'),
    smartRoutingMarkdown: bytes['smart-routing.md'].toString('utf8'),
    sourceBytes: bytes,
  });
}

function routeGoldMismatchReason(verdict) {
  if (verdict.intentOk === false && verdict.resourceOk === false) {
    return 'intent-and-resource-mismatch';
  }
  if (verdict.intentOk === false) return 'intent-mismatch';
  if (verdict.resourceOk === false) return 'resource-mismatch';
  return verdict.reason || 'route-gold-mismatch';
}

function classifyRouteGoldRow(entry, observed, verdict) {
  if (verdict.pass === true) return 'real-green';
  const expectedResources = new Set(entry.gold.expectedResources);
  const observedResources = new Set(observed.observedResources);
  const hasUnexpectedResource = [...observedResources].some((resource) => (
    !expectedResources.has(resource)
  ));
  const hasMissingResource = [...expectedResources].some((resource) => (
    !observedResources.has(resource)
  ));
  if (entry.expectedAction === 'route'
    && verdict.intentOk === true
    && verdict.resourceOk === false
    && hasMissingResource
    && !hasUnexpectedResource) {
    return 'shadow-partial';
  }
  return 'invalid';
}

function failDeliveredRouteGold(code, message, routeGoldReason = null) {
  const error = new TypeError(message);
  error.code = code;
  error.routeGoldReason = routeGoldReason;
  throw error;
}

function scoreDeliveredRouteGold(typedPath, acceptancePath, fixture) {
  const typedBytes = fs.readFileSync(typedPath);
  const acceptance = readJson(acceptancePath);
  if (sha256(typedBytes) !== acceptance.candidateArtifacts['route-gold.typed.json']) {
    failDeliveredRouteGold(
      'DELIVERED_ROUTE_GOLD_DIGEST_MISMATCH',
      'delivered typed route gold differs from its acceptance digest',
    );
  }
  const typed = JSON.parse(typedBytes.toString('utf8'));
  const fixtureById = new Map(fixture.cases.map((entry) => [entry.id, entry]));
  if (typed.cases.length !== fixture.cases.length) {
    failDeliveredRouteGold(
      'DELIVERED_ROUTE_GOLD_CASE_SET_MISMATCH',
      'delivered typed route gold does not cover the authored case set',
    );
  }
  const deliveredRows = typed.cases.map((row) => {
    assert.deepStrictEqual(schemaErrors(TYPED_GOLD_SCHEMA, row), []);
    if (computeProjectionHash('TypedRouteGoldV1', row) !== row.projectionHash) {
      failDeliveredRouteGold(
        'DELIVERED_ROUTE_GOLD_ROW_HASH_MISMATCH',
        `typed route-gold row hash mismatch: ${row.scenarioId}`,
      );
    }
    const entry = fixtureById.get(row.scenarioId);
    if (!entry) {
      failDeliveredRouteGold(
        'DELIVERED_ROUTE_GOLD_CASE_SET_MISMATCH',
        `unknown delivered route-gold scenario: ${row.scenarioId}`,
      );
    }
    return {
      entry,
      observed: {
        observedIntents: row.observedIntents,
        observedResources: row.observedResources.map((resource) => resource.resource),
      },
      row,
    };
  });
  const scorerInputs = deliveredRows.map(({ entry, observed }) => ({
    observed,
    scenario: scorerScenario(entry),
  }));
  const scorer = scoreRouteGoldReadOnly(scorerInputs);
  assert.strictEqual(scorer.writeBackAttempted, false);
  const rows = scorer.verdicts.map((verdict, index) => {
    const delivered = deliveredRows[index];
    const status = classifyRouteGoldRow(delivered.entry, delivered.observed, verdict);
    if (status === 'invalid') {
      const reason = routeGoldMismatchReason(verdict);
      failDeliveredRouteGold(
        'DELIVERED_ROUTE_GOLD_MISMATCH',
        `delivered route-gold scenario failed: ${delivered.row.scenarioId} (${reason})`,
        reason,
      );
    }
    return {
      observed: delivered.observed,
      scenarioId: delivered.row.scenarioId,
      status,
    };
  });
  const shadowPartialScenarioIds = rows
    .filter((row) => row.status === 'shadow-partial')
    .map((row) => row.scenarioId);
  const realGreenScenarioIds = rows
    .filter((row) => row.status === 'real-green')
    .map((row) => row.scenarioId);
  return {
    acceptanceDigestBound: true,
    projectionHashesBound: true,
    realEvaluateRouteGoldRows: scorer.verdicts.length,
    realGreenRows: realGreenScenarioIds.length,
    realGreenScenarioIds,
    rows,
    scorerSource: 'real-read-only-evaluateRouteGold',
    shadowPartialRows: shadowPartialScenarioIds.length,
    shadowPartialScenarioIds,
    status: shadowPartialScenarioIds.length > 0 ? 'shadow-partial' : 'real-green',
    writeBackAttempted: scorer.writeBackAttempted,
  };
}

function runDeliveredRouteGoldFalsifier(fixture) {
  const compiledPath = path.join(PHASE_ROOT, 'compiled', 'route-gold.typed.json');
  const acceptancePath = path.join(PHASE_ROOT, 'activation', 'acceptance.json');
  const delivered = scoreDeliveredRouteGold(compiledPath, acceptancePath, fixture);
  const temporaryRoot = fs.mkdtempSync(path.join(__dirname, '.tmp-route-gold-'));
  try {
    const typed = readJson(compiledPath);
    const realGreenScenarioId = delivered.realGreenScenarioIds.find((scenarioId) => (
      fixture.cases.find((entry) => entry.id === scenarioId)?.expectedAction === 'route'
    ));
    const realGreenIndex = typed.cases.findIndex((row) => (
      row.scenarioId === realGreenScenarioId
    ));
    assert.notStrictEqual(realGreenIndex, -1, 'a real-green row is required for the falsifier');
    typed.cases[realGreenIndex].observedResources = [{
      intent: typed.cases[realGreenIndex].observedIntents[0],
      resource: 'corrupted-compiled-observation',
    }];
    typed.cases[realGreenIndex].projectionHash = computeProjectionHash(
      'TypedRouteGoldV1',
      typed.cases[realGreenIndex],
    );
    const typedBytes = artifactBytes(typed);
    const acceptance = readJson(acceptancePath);
    acceptance.candidateArtifacts['route-gold.typed.json'] = sha256(typedBytes);
    const tamperedTypedPath = path.join(temporaryRoot, 'route-gold.typed.json');
    const tamperedAcceptancePath = path.join(temporaryRoot, 'acceptance.json');
    fs.writeFileSync(tamperedTypedPath, typedBytes);
    fs.writeFileSync(tamperedAcceptancePath, artifactBytes(acceptance));
    let failure;
    try {
      scoreDeliveredRouteGold(tamperedTypedPath, tamperedAcceptancePath, fixture);
    } catch (error) {
      failure = error;
    }
    assert.ok(failure, 'coherently tampered delivered route gold must fail');
    assert.strictEqual(failure.code, 'DELIVERED_ROUTE_GOLD_MISMATCH');
    assert.strictEqual(failure.routeGoldReason, 'resource-mismatch');
    return {
      ...delivered,
      coherentTamperGuard: failure.code,
      coherentTamperReason: failure.routeGoldReason,
      corruptedScenarioId: realGreenScenarioId,
      persistedTamperScored: true,
    };
  } finally {
    const relative = path.relative(__dirname, temporaryRoot);
    if (!relative.startsWith('.tmp-route-gold-') || relative.includes(path.sep)) {
      throw new Error('temporary route-gold directory failed scope validation');
    }
    fs.rmSync(temporaryRoot, { force: true, recursive: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMPILE AND PROJECTION GATES
// ─────────────────────────────────────────────────────────────────────────────

function assertCompiledArtifacts(snapshot) {
  const second = loadSnapshot().snapshot;
  const policyBytes = artifactBytes(snapshot.policy);
  assert.ok(policyBytes.equals(artifactBytes(second.policy)), 'identical authored input drifted');
  assert.ok(policyBytes.equals(fs.readFileSync(path.join(PHASE_ROOT, 'compiled', 'policy.json'))));
  assert.strictEqual(computeBasePolicyHash(snapshot.policy), snapshot.policy.basePolicyHash);
  assert.deepStrictEqual(schemaErrors(POLICY_SCHEMA, snapshot.policy), []);
  assert.deepStrictEqual(schemaErrors(ADVISOR_SCHEMA, snapshot.advisorProjection), []);
  assert.deepStrictEqual(
    readJson(path.join(PHASE_ROOT, 'compiled', 'projection-graph.json')),
    snapshot.projectionGraph,
  );

  const card = generatePolicyCard(snapshot);
  assert.deepStrictEqual(schemaErrors(CARD_SCHEMA, card.frontmatter), []);
  assert.strictEqual(
    fs.readFileSync(path.join(PHASE_ROOT, 'compiled', 'PolicyCardV1.md'), 'utf8'),
    card.markdown,
  );
  const typed = readJson(path.join(PHASE_ROOT, 'compiled', 'route-gold.typed.json'));
  typed.cases.forEach((row) => assert.deepStrictEqual(schemaErrors(TYPED_GOLD_SCHEMA, row), []));

  const registry = readJson(path.join(SKILL_ROOT, 'mode-registry.json'));
  const rows = snapshot.projectionGraph.rows;
  assert.strictEqual(snapshot.policy.destinations.length, registry.modes.length);
  const distinctPublicModes = new Set(snapshot.policy.destinations.map((destination) => (
    destination.id.workflowMode
  ))).size;
  assert.strictEqual(distinctPublicModes, registry.modes.length);
  assert.strictEqual(rows.length, registry.modes.length);
  const packetCount = new Set(registry.modes.map((mode) => mode.packet)).size;
  assert.strictEqual(packetCount, 5);
  assert.notStrictEqual(snapshot.policy.destinations.length, packetCount);
  assert.strictEqual(snapshot.policy.compositionRules.length, 0);
  assert.ok(snapshot.manifestResources.length > 0, 'compiled manifest identities are required');
  assert.strictEqual(
    new Set(snapshot.manifestResources.map((entry) => (
      `${entry.workflowMode}\u0000${entry.leafResourceId}`
    ))).size,
    snapshot.manifestResources.length,
  );
  assert.strictEqual(snapshot.routeLeafSelections.length, registry.modes.length);
  const manifestPairKeys = new Set(snapshot.manifestResources.map((entry) => (
    `${entry.workflowMode}\u0000${entry.leafResourceId}`
  )));
  const selectedLeafPairs = snapshot.routeLeafSelections.flatMap((selection) => (
    selection.leafPairs
  ));
  assert.ok(selectedLeafPairs.length > 0, 'compiled route leaf selections are required');
  selectedLeafPairs.forEach((pair) => {
    assert.ok(manifestPairKeys.has(`${pair.workflowMode}\u0000${pair.leafResourceId}`));
  });
  assertNoCollapse(rows, registry);
  assertInjective(rows);
  assert.strictEqual(typed.identityFixture.injective, true);
  assert.deepStrictEqual(typed.identityFixture.tuples, rows.map((row) => row.identityTuple));

  for (const mode of registry.modes) {
    const row = rows.find((entry) => entry.workflowMode === mode.workflowMode);
    const destination = snapshot.policy.destinations.find((entry) => (
      entry.id.workflowMode === mode.workflowMode
    ));
    assert.ok(row && destination, `missing compiled mode ${mode.workflowMode}`);
    assert.strictEqual(row.packetRef, mode.packet);
    assert.strictEqual(row.backendKind, mode.backendKind);
    assert.strictEqual(row.runtimeLoopType, mode.runtimeLoopType);
    assert.strictEqual(row.routingClass, mode.advisorRouting.routingClass);
    if (mode.runtimeLoopType === null) {
      assert.strictEqual(
        Object.prototype.hasOwnProperty.call(destination.id, 'runtimeDiscriminator'),
        false,
      );
    } else {
      assert.strictEqual(destination.id.runtimeDiscriminator, mode.runtimeLoopType);
    }
  }

  const mismatchedRegistry = clone(registry);
  mismatchedRegistry.modes[0].workflowMode = 'caller-supplied-drift';
  const liveBytes = sourceBytes();
  assert.throws(
    () => compileRegistry({
      activationGeneration: snapshot.policy.activationGeneration,
      leafManifest: JSON.parse(liveBytes['leaf-manifest.json'].toString('utf8')),
      registry: mismatchedRegistry,
      skillMarkdown: liveBytes['SKILL.md'].toString('utf8'),
      smartRoutingMarkdown: liveBytes['smart-routing.md'].toString('utf8'),
      sourceBytes: liveBytes,
    }),
    (error) => assertCode(error, 'AUTHORED_SOURCE_IDENTITY_MISMATCH'),
  );

  const authoredRuntime = clone(registry);
  authoredRuntime.modes.find((mode) => mode.workflowMode === 'agent-improvement')
    .runtimeLoopType = 'review';
  const runtimeSnapshot = compileWithRegistry(authoredRuntime, snapshot.policy.activationGeneration);
  const improvementDestination = runtimeSnapshot.policy.destinations.find((entry) => (
    entry.id.workflowMode === 'agent-improvement'
  ));
  assert.strictEqual(improvementDestination.id.runtimeDiscriminator, 'review');

  const authoredNull = clone(registry);
  authoredNull.modes.find((mode) => mode.workflowMode === 'research').runtimeLoopType = null;
  const nullSnapshot = compileWithRegistry(authoredNull, snapshot.policy.activationGeneration);
  const researchDestination = nullSnapshot.policy.destinations.find((entry) => (
    entry.id.workflowMode === 'research'
  ));
  assert.strictEqual(
    Object.prototype.hasOwnProperty.call(researchDestination.id, 'runtimeDiscriminator'),
    false,
  );

  return {
    byteIdenticalRecompile: true,
    destinationCount: snapshot.policy.destinations.length,
    distinctPublicModeCount: distinctPublicModes,
    identityInjective: true,
    manifestIdentityCount: snapshot.manifestResources.length,
    packetCount,
    registryModeCount: registry.modes.length,
    routeLeafPairCount: selectedLeafPairs.length,
    routeLeafSelectionCount: snapshot.routeLeafSelections.length,
    runtimeDiscriminatorSource: 'authored-registry-verbatim',
    selfDeclaredInputRejected: true,
  };
}

function runCollapseFalsifiers(snapshot) {
  const registry = readJson(path.join(SKILL_ROOT, 'mode-registry.json'));
  const duplicatePublicMode = clone(registry);
  duplicatePublicMode.modes.find((mode) => mode.workflowMode === 'ai-council')
    .workflowMode = 'research';
  assertThrowsCode(
    () => compileWithRegistry(duplicatePublicMode, snapshot.policy.activationGeneration),
    TypeError,
    'PUBLIC_MODE_DUPLICATE',
  );
  const missingPublicMode = clone(registry);
  delete missingPublicMode.modes[0].workflowMode;
  assertThrowsCode(
    () => compileWithRegistry(missingPublicMode, snapshot.policy.activationGeneration),
    TypeError,
    'PUBLIC_MODE_MISSING',
  );

  const sharedPacket = clone(registry);
  for (const mode of sharedPacket.modes.filter((entry) => (
    ['model-benchmark', 'skill-benchmark'].includes(entry.workflowMode)
  ))) {
    mode.advisorRouting.routingClass = 'alias-fold';
  }
  assertThrowsCode(
    () => compileWithRegistry(sharedPacket, snapshot.policy.activationGeneration),
    TypeError,
    'SHARED_PACKET_COLLAPSE',
  );

  const runtimeKey = clone(registry);
  const review = runtimeKey.modes.find((mode) => mode.workflowMode === 'review');
  runtimeKey.modes.find((mode) => mode.workflowMode === 'alignment').packet = review.packet;
  assertThrowsCode(
    () => compileWithRegistry(runtimeKey, snapshot.policy.activationGeneration),
    TypeError,
    'RUNTIME_KEY_COLLAPSE',
  );

  const identityRows = clone(snapshot.projectionGraph.rows);
  identityRows[1].identityTuple = clone(identityRows[0].identityTuple);
  assertThrowsCode(
    () => assertInjective(identityRows),
    TypeError,
    'DESTINATION_IDENTITY_COLLAPSE',
  );
  return {
    authoredRegistryFalsifiers: true,
    injectiveGuard: 'DESTINATION_IDENTITY_COLLAPSE',
    missingPublicModeGuard: 'PUBLIC_MODE_MISSING',
    publicModeGuard: 'PUBLIC_MODE_DUPLICATE',
    runtimeKeyGuard: 'RUNTIME_KEY_COLLAPSE',
    sharedPacketGuard: 'SHARED_PACKET_COLLAPSE',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. REAL-HUB ROUTE GOLD
// ─────────────────────────────────────────────────────────────────────────────

function runRouteCases(snapshot, fixture) {
  const rows = [];
  const scorerInputs = [];
  for (const entry of fixture.cases) {
    const result = evaluateCanary(snapshot, entry);
    assert.strictEqual(result.decision.action, entry.expectedAction, `${entry.id} action`);
    if (entry.expectedSelectionKind) {
      assert.strictEqual(result.decision.route.selectionKind, 'single');
      assert.strictEqual(result.decision.route.targets.length, 1);
      assert.deepStrictEqual(targetModes(result.decision), entry.expectedModes);
    }
    if (entry.expectedReason) {
      assert.strictEqual(result.decision[result.decision.action].reason, entry.expectedReason);
    }
    if (result.decision.action !== 'route') {
      const branch = result.decision[result.decision.action];
      assert.strictEqual(Object.prototype.hasOwnProperty.call(branch, 'targets'), false);
      assert.strictEqual(branch.authority, 'Withheld');
    }
    if (result.decision.action === 'clarify') {
      assert.strictEqual(result.decision.clarify.alternatives.at(-1), 'none_of_these');
      assert.strictEqual(result.decision.clarify.question, snapshot.fallbackChecklist[0]);
    }

    const leafPairs = compiledLeafPairsForDecision(snapshot, result.decision);
    const projection = compatibilityProjection(snapshot, result.decision, leafPairs);
    scorerInputs.push({ observed: projection, scenario: scorerScenario(entry) });
    rows.push({
      action: result.decision.action,
      id: entry.id,
      leafPairs,
      projection,
      selectionKind: result.decision.route?.selectionKind || null,
      targetModes: targetModes(result.decision),
    });
  }
  const scorer = scoreRouteGoldReadOnly(scorerInputs);
  assert.strictEqual(scorer.writeBackAttempted, false);
  scorer.verdicts.forEach((verdict, index) => {
    const status = classifyRouteGoldRow(
      fixture.cases[index],
      scorerInputs[index].observed,
      verdict,
    );
    assert.notStrictEqual(status, 'invalid', `${fixture.cases[index].id} invalid mismatch`);
    rows[index].realEvaluateRouteGoldPass = verdict.pass;
    rows[index].routeGoldStatus = status;
  });

  const realGreenIndex = rows.findIndex((row) => (
    row.action === 'route' && row.routeGoldStatus === 'real-green'
  ));
  assert.notStrictEqual(realGreenIndex, -1, 'a real-green row is required for the falsifier');
  const corrupted = clone(scorerInputs[realGreenIndex]);
  corrupted.observed.observedResources = ['corrupted-compiled-observation'];
  const falsifier = scoreRouteGoldReadOnly([corrupted]).verdicts[0];
  assert.strictEqual(falsifier.pass, false, 'corrupted observation must fail real scorer');

  const researchIndex = fixture.cases.findIndex((entry) => entry.id === 'single-research');
  const researchResult = evaluateCanary(snapshot, fixture.cases[researchIndex]);
  const researchLeafPairs = compiledLeafPairsForDecision(snapshot, researchResult.decision);
  const researchProjectorOutput = compatibilityProjection(
    snapshot,
    researchResult.decision,
    researchLeafPairs,
  );
  assert.deepStrictEqual(researchProjectorOutput, scorerInputs[researchIndex].observed);
  assert.strictEqual(rows[researchIndex].routeGoldStatus, 'real-green');
  const manifestByPair = new Map(snapshot.manifestResources.map((entry) => (
    [`${entry.workflowMode}\u0000${entry.leafResourceId}`, entry.resource]
  )));
  const researchCompiledResources = researchLeafPairs.map((pair) => (
    manifestByPair.get(`${pair.workflowMode}\u0000${pair.leafResourceId}`)
  ));
  const compiledResourceBytes = canonicalize(researchCompiledResources);
  const projectorResourceBytes = canonicalize(researchProjectorOutput.observedResources);
  const scoredResourceBytes = canonicalize(
    scorerInputs[researchIndex].observed.observedResources,
  );
  assert.strictEqual(projectorResourceBytes, compiledResourceBytes);
  assert.strictEqual(scoredResourceBytes, compiledResourceBytes);

  const realGreenScenarioIds = rows
    .filter((row) => row.routeGoldStatus === 'real-green')
    .map((row) => row.id);
  const shadowPartialScenarioIds = rows
    .filter((row) => row.routeGoldStatus === 'shadow-partial')
    .map((row) => row.id);
  const deliveredArtifact = runDeliveredRouteGoldFalsifier(fixture);
  assert.strictEqual(shadowPartialScenarioIds.length, 0);
  assert.strictEqual(realGreenScenarioIds.length, rows.length);
  assert.strictEqual(deliveredArtifact.shadowPartialRows, 0);
  return {
    corruptedObservationPass: falsifier.pass,
    corruptedScenarioId: rows[realGreenIndex].id,
    deliveredArtifact,
    legacyBackfillUsed: false,
    projectorProof: {
      compiledLeafPairs: researchLeafPairs,
      compiledLeafPairBytes: canonicalize(researchLeafPairs),
      compiledResourceBytes,
      manifestIdentityCount: snapshot.manifestResources.length,
      projectorOutput: researchProjectorOutput,
      projectorResourceBytes,
      projectorOutputEqualsScoredObservation: true,
      resourceBytesEqualThroughScoring: true,
      scenarioId: 'single-research',
      scoredObservation: scorerInputs[researchIndex].observed,
      scoredResourceBytes,
    },
    realEvaluateRouteGoldRows: rows.length,
    realGreenRows: realGreenScenarioIds.length,
    realGreenScenarioIds,
    rows,
    scorerSource: 'real-read-only-evaluateRouteGold',
    shadowPartialRows: shadowPartialScenarioIds.length,
    shadowPartialScenarioIds,
    writeBackAttempted: scorer.writeBackAttempted,
  };
}

function routeIdentity(decision) {
  return {
    action: decision.action,
    selectionKind: decision.route?.selectionKind || null,
    targets: targetModes(decision),
  };
}

function runAdvisorCases(snapshot, fixture) {
  const baseline = evaluateCanary(snapshot, { prompt: fixture.cases[0].prompt });
  const rows = fixture.advisorCases.map((entry) => {
    const advisor = {
      effectivePolicyHash: snapshot.policy.effectivePolicyHash,
      hubId: snapshot.advisorProjection.hubId,
      projectionHash: entry.projectionDrift
        ? '0'.repeat(64)
        : snapshot.advisorProjection.projectionHash,
      rankScore: '99',
      scoreMargin: '98',
      trust: entry.trust,
    };
    const result = evaluateCanary(snapshot, { advisor, prompt: fixture.cases[0].prompt });
    assert.strictEqual(result.advisorDisposition.contributes, entry.expectedContribution);
    assert.deepStrictEqual(routeIdentity(result.decision), routeIdentity(baseline.decision));
    return {
      contributes: result.advisorDisposition.contributes,
      id: entry.id,
      reason: result.advisorDisposition.reason,
    };
  });
  const ambiguous = evaluateCanary(snapshot, {
    advisor: {
      effectivePolicyHash: snapshot.policy.effectivePolicyHash,
      hubId: snapshot.advisorProjection.hubId,
      projectionHash: snapshot.advisorProjection.projectionHash,
      rankScore: '100',
      scoreMargin: '100',
      trust: 'live',
    },
    prompt: fixture.cases.find((entry) => entry.id === 'one-turn-clarify').prompt,
  });
  assert.strictEqual(ambiguous.decision.action, 'clarify');
  return { ambiguousWithAdvisor: ambiguous.decision.action, rows };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DOCUMENT, EXECUTION, AND ACTIVATION
// ─────────────────────────────────────────────────────────────────────────────

function assertDocumentParity(machine, document) {
  if (canonicalize(machine) !== canonicalize(document)) {
    const error = new Error('document replay diverged from machine policy');
    error.code = 'DOCUMENT_PARITY_MISMATCH';
    throw error;
  }
}

function runDocumentParity(snapshot, fixture) {
  const card = fs.readFileSync(path.join(PHASE_ROOT, 'compiled', 'PolicyCardV1.md'), 'utf8');
  const requestCases = [
    ...fixture.cases,
    {
      explicitMode: 'review',
      id: 'document-explicit-mode',
      prompt: 'unrelated orchard inventory',
    },
    {
      constraints: ['clarify'],
      id: 'document-clarify-constraint',
      prompt: 'deep research',
    },
    {
      constraints: ['dependency-failure'],
      id: 'document-dependency-constraint',
      prompt: 'deep research',
    },
    {
      advisor: {
        effectivePolicyHash: snapshot.policy.effectivePolicyHash,
        hubId: snapshot.advisorProjection.hubId,
        projectionHash: snapshot.advisorProjection.projectionHash,
        rankScore: '99',
        scoreMargin: '98',
        trust: 'live',
      },
      id: 'document-advisor-evidence',
      prompt: 'deep research',
    },
  ];
  const rows = requestCases.map((entry) => {
    const machine = evaluateCanary(snapshot, entry).decision;
    const document = replayPolicyCard(card, entry);
    assert.strictEqual(document.terminal, 'DOCUMENT_ONLY_UNATTESTED');
    assertDocumentParity(machine, document.decision);
    if (machine.action === 'route') assert.strictEqual(document.draftStatus, 'PREPARED_DRAFT');
    return { action: machine.action, id: entry.id, terminal: document.terminal };
  });

  const marker = /## Document-only routing snapshot\n\n```json\n([^\n]+)\n```/m;
  const serialized = marker.exec(card)[1];
  const parsed = JSON.parse(serialized);
  parsed.selectors = parsed.selectors.filter((selector) => (
    selector.destinationId.workflowMode !== 'research'
  ));
  const divergentCard = card.replace(serialized, canonicalize(parsed));
  const machine = evaluateCanary(snapshot, fixture.cases[0]).decision;
  const divergent = replayPolicyCard(divergentCard, fixture.cases[0]).decision;
  assertThrowsCode(
    () => assertDocumentParity(machine, divergent),
    Error,
    'DOCUMENT_PARITY_MISMATCH',
  );
  const constraintNegative = rows.find((row) => (
    row.id === 'constraint-forbidden-reject'
  ));
  assert.strictEqual(constraintNegative.action, 'reject');
  assert.strictEqual(
    fixture.cases.find((entry) => entry.id === constraintNegative.id)
      .prompt.includes('forbidden'),
    false,
  );
  return {
    constraintDrivenNegative: 'reject(forbidden)',
    fullRequestFields: ['prompt', 'constraints', 'explicitMode', 'advisor'],
    plantedDivergenceRejected: true,
    rows,
  };
}

function bindingContext(snapshot, result) {
  const registryHash = snapshot.sourceHashes.find((entry) => (
    entry.sourceId === 'mode-registry.json'
  )).hash;
  return {
    authorityClass: 'workspace-mutation',
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    epoch: snapshot.policy.activationGeneration,
    expiresAtEpoch: snapshot.policy.activationGeneration + 5,
    preconditions: ['actor-only-commit'],
    readSet: [{ digest: registryHash, resourceId: 'registry-source.v1' }],
    registryAuthorityHash: registryHash,
    requestFactsHash: result.request.requestFactsHash,
  };
}

function runExecutionFence(snapshot, fixture) {
  const result = evaluateCanary(snapshot, fixture.cases[0]);
  const context = bindingContext(snapshot, result);
  const plane = new DestinationExecutionPlane({ planningEpoch: context.epoch });
  const prepared = plane.prepare(result.decision, context);
  assert.strictEqual(prepared.preparedLegs.length, 1);
  const leg = prepared.preparedLegs[0];
  assert.strictEqual(leg.target.role, 'actor');
  const effects = { count: 0 };
  const adapter = {
    atomicity: 'atomic',
    acquireLocalAuthority: () => ({ handle: 'local-handle', state: 'ACQUIRED' }),
    performEffect: () => {
      effects.count += 1;
      return { effectId: `effect-${effects.count}` };
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
    effects: effects.count,
  };
}

function verifyAcceptance(acceptance) {
  for (const [name, expected] of Object.entries(acceptance.candidateArtifacts)) {
    const actual = fileHash(path.join(PHASE_ROOT, 'compiled', name));
    if (actual !== expected) {
      throw new CanaryActivationError(
        'ACCEPTANCE_ARTIFACT_HASH_MISMATCH',
        `${name} differs from the accepted artifact hash`,
      );
    }
  }
  const priorHash = fileHash(path.join(PHASE_ROOT, 'activation', 'manifest.prior.json'));
  if (priorHash !== acceptance.priorManifestHash) {
    throw new CanaryActivationError(
      'ACCEPTANCE_PRIOR_HASH_MISMATCH',
      'retained prior manifest differs from acceptance',
    );
  }
}

function runRollbackDrill(snapshot) {
  const activationRoot = path.join(PHASE_ROOT, 'activation');
  const acceptance = readJson(path.join(activationRoot, 'acceptance.json'));
  verifyAcceptance(acceptance);
  const tampered = clone(acceptance);
  tampered.candidateArtifacts['policy.json'] = '0'.repeat(64);
  assertThrowsCode(
    () => verifyAcceptance(tampered),
    CanaryActivationError,
    'ACCEPTANCE_ARTIFACT_HASH_MISMATCH',
  );
  const candidate = readJson(path.join(activationRoot, 'manifest.candidate.json'));
  const priorBytes = fs.readFileSync(path.join(activationRoot, 'manifest.prior.json'));
  const candidateBytes = manifestBytes(candidate);
  assert.strictEqual(candidate.servingAuthority, 'legacy');
  assert.strictEqual(candidate.shadowOnly, true);

  const temporaryRoot = fs.mkdtempSync(path.join(__dirname, '.tmp-canary-'));
  const manifestPath = path.join(temporaryRoot, 'manifest.json');
  const fencePath = path.join(temporaryRoot, 'fence-state.json');
  try {
    fs.writeFileSync(manifestPath, priorBytes);
    fs.writeFileSync(fencePath, fenceStateBytes(0));
    assert.throws(
      () => atomicFencedSwap({
        expectedCurrent: { effectivePolicyHash: '0'.repeat(64), generation: 1 },
        expectedFencingEpoch: 0,
        fencePath,
        manifestPath,
        nextBytes: candidateBytes,
        token: 'drift-check',
      }),
      (error) => assertCode(error, 'MANIFEST_CAS_MISMATCH'),
    );
    const priorPin = pinRequest(manifestPath);
    atomicFencedSwap({
      expectedCurrent: acceptance.expectedCurrent,
      expectedFencingEpoch: 0,
      fencePath,
      manifestPath,
      nextBytes: candidateBytes,
      token: 'ship-canary',
    });
    const candidatePin = pinRequest(manifestPath);
    assertPinnedTuple(candidatePin, snapshot.policy);
    assertSingleGeneration([candidatePin]);
    assertThrowsCode(
      () => assertSingleGeneration([priorPin, candidatePin]),
      CanaryActivationError,
      'MIXED_GENERATION_OBSERVED',
    );
    atomicFencedSwap({
      expectedCurrent: acceptance.candidatePolicy,
      expectedFencingEpoch: 1,
      fencePath,
      manifestPath,
      nextBytes: priorBytes,
      token: 'rollback-canary',
    });
    const restoredBytes = fs.readFileSync(manifestPath);
    assert.ok(restoredBytes.equals(priorBytes), 'rollback did not restore byte-exact prior');
    assert.strictEqual(readJson(fencePath).fencingEpoch, 2);
    return {
      byteExact: true,
      candidateGeneration: candidatePin.generation,
      finalFenceEpoch: 2,
      priorHash: sha256(priorBytes),
      restoredHash: sha256(restoredBytes),
      servingAuthority: candidate.servingAuthority,
    };
  } finally {
    const relative = path.relative(__dirname, temporaryRoot);
    if (!relative.startsWith('.tmp-canary-') || relative.includes(path.sep)) {
      throw new Error('temporary rollback directory failed scope validation');
    }
    fs.rmSync(temporaryRoot, { force: true, recursive: true });
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. HARD BLOCKS, DUAL READ, AND STATIC GATES
// ─────────────────────────────────────────────────────────────────────────────

function runHardBlocks(snapshot, fixture) {
  const route = evaluateCanary(snapshot, fixture.cases[0]).decision;
  const negative = evaluateCanary(
    snapshot,
    fixture.cases.find((entry) => entry.id === 'zero-signal-defer'),
  ).decision;
  const smuggled = clone(negative);
  smuggled.defer.targets = [route.route.targets[0]];
  assertThrowsCode(
    () => parseRouteDecision(smuggled),
    DecisionValidationError,
    'NEGATIVE_TARGET_FORBIDDEN',
  );
  const claimedAuthority = clone(negative);
  claimedAuthority.defer.authority = 'WithheldUntilVerify';
  assertThrowsCode(
    () => parseRouteDecision(claimedAuthority),
    DecisionValidationError,
    'NEGATIVE_AUTHORITY_INVALID',
  );
  const recoveryArtifact = clone(route);
  recoveryArtifact.route.clarify = { question: 'forbidden' };
  assertThrowsCode(
    () => parseRouteDecision(recoveryArtifact, snapshot.policy),
    DecisionValidationError,
    'ROUTE_RECOVERY_ARTIFACT_FORBIDDEN',
  );
  const bundle = clone(route);
  bundle.route.selectionKind = 'orderedBundle';
  bundle.route.targets.push(clone(bundle.route.targets[0]));
  assertThrowsCode(
    () => assertSingleRoute(bundle),
    TypeError,
    'BUNDLE_EMISSION_FORBIDDEN',
  );
  assertThrowsCode(
    () => assertPinnedTuple({
      effectivePolicyHash: '0'.repeat(64),
      generation: snapshot.policy.activationGeneration,
    }, snapshot.policy),
    CanaryActivationError,
    'PINNED_TUPLE_MISMATCH',
  );

  const green = {
    advisorGuardGreen: true,
    documentParityGreen: true,
    noCollapseGreen: true,
    rollbackGreen: true,
    routeGoldGreen: true,
    singleOnlyGreen: true,
  };
  const codes = {};
  for (const [field, code] of HARD_BLOCKS) {
    assertThrowsCode(
      () => assertActivationEligible({ ...green, [field]: true }),
      CanaryActivationError,
      code,
    );
    codes[field] = code;
  }
  const eligible = assertActivationEligible(green);
  assert.deepStrictEqual(eligible, { eligible: true, servingAuthority: 'legacy', shadowOnly: true });
  assertThrowsCode(
    () => assertActivationEligible({ ...green, routeGoldGreen: false }),
    CanaryActivationError,
    'CANARY_SUBGATE_INCOMPLETE',
  );
  return {
    allGreenEligible: eligible,
    codes,
    directGuardCodes: {
      bundleEmission: 'BUNDLE_EMISSION_FORBIDDEN',
      exactRouteRecoveryArtifact: 'ROUTE_RECOVERY_ARTIFACT_FORBIDDEN',
      negativeAuthority: 'NEGATIVE_AUTHORITY_INVALID',
      negativeTarget: 'NEGATIVE_TARGET_FORBIDDEN',
      pinnedTupleMismatch: 'PINNED_TUPLE_MISMATCH',
    },
    shadowPartialEligible: false,
  };
}

function resolveAlias(aliases, value) {
  return aliases.find((entry) => entry.value === value)?.workflowMode || null;
}

function runDualRead(snapshot) {
  const registry = readJson(path.join(SKILL_ROOT, 'mode-registry.json'));
  for (const mode of registry.modes) {
    assert.strictEqual(resolveAlias(snapshot.aliasProjections, mode.workflowMode), mode.workflowMode);
    assert.strictEqual(resolveAlias(snapshot.aliasProjections, mode.command), mode.workflowMode);
    for (const alias of mode.advisorRouting.legacyAliases || []) {
      assert.strictEqual(resolveAlias(snapshot.aliasProjections, alias), mode.workflowMode);
    }
    const projection = snapshot.advisorProjection.eligibleModes.find((entry) => (
      entry.publicMode === mode.workflowMode
    ));
    assert.strictEqual(projection.routingClass, mode.advisorRouting.routingClass);
  }
  assert.strictEqual(resolveAlias(snapshot.aliasProjections, 'deep-improvement'), 'agent-improvement');
  assert.strictEqual(resolveAlias(snapshot.aliasProjections, 'unmapped-legacy-alias'), null);

  const mutated = clone(registry);
  mutated.modes[0].aliases.push('alias-drift-fixture');
  const drifted = compileWithRegistry(mutated, snapshot.policy.activationGeneration);
  assert.notStrictEqual(
    drifted.advisorProjection.projectionHash,
    snapshot.advisorProjection.projectionHash,
  );
  return {
    aliasProjectionCount: snapshot.aliasProjections.length,
    commandCount: registry.modes.length,
    projectionDriftDetected: true,
    routingClasses: Object.fromEntries(snapshot.advisorProjection.eligibleModes.map((entry) => (
      [entry.publicMode, entry.routingClass]
    ))),
    unmappedResult: null,
  };
}

function listFiles(directory, extension) {
  const files = [];
  const pending = [directory];
  while (pending.length > 0) {
    const current = pending.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const target = path.join(current, entry.name);
      if (entry.isDirectory()) pending.push(target);
      else if (entry.name.endsWith(extension)) files.push(target);
    }
  }
  return files.sort();
}

function runStaticGates() {
  const files = listFiles(PHASE_ROOT, '.cjs');
  const source = files.map((filePath) => fs.readFileSync(filePath, 'utf8')).join('\n');
  const branchPatterns = [
    /if\s*\([^)]*skillId\s*(?:===|!==)/,
    /switch\s*\([^)]*skillId/,
    /if\s*\([^)]*['"]system-deep-loop['"]\s*(?:===|!==)/,
  ];
  branchPatterns.forEach((pattern) => assert.strictEqual(pattern.test(source), false));
  const forbiddenComment = /\b(?:ADR|REQ|CHK|T)-?\d+\b|\.opencode\/specs\//i;
  files.forEach((filePath) => {
    const comments = fs.readFileSync(filePath, 'utf8')
      .split('\n')
      .filter((line) => /^\s*(?:\/\/|\/\*|\*)/.test(line))
      .join('\n');
    assert.strictEqual(forbiddenComment.test(comments), false, filePath);
  });
  const externalRequires = [...source.matchAll(/require\(['"]([^'"]+)['"]\)/g)]
    .map((match) => match[1])
    .filter((specifier) => !specifier.startsWith('.') && !specifier.startsWith('node:'));
  const allowedBuiltins = new Set(['assert', 'crypto', 'fs', 'path']);
  externalRequires.forEach((specifier) => assert.ok(allowedBuiltins.has(specifier), specifier));
  return {
    codeFiles: files.length,
    commentViolations: 0,
    externalDependencies: 0,
    skillNameBranches: 0,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. STAGE GATE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run the full canary, falsifiers, real scorer, fenced swap, and rollback drill.
 *
 * @returns {Object} Structured stage-gate evidence.
 */
function runCanary() {
  const protectedBefore = protectedHashes();
  const sourcesBefore = authoredSourceHashes();
  assert.deepStrictEqual(protectedBefore, PROTECTED_DIGESTS);
  assert.deepStrictEqual(sourcesBefore, AUTHORED_SOURCE_DIGESTS);
  const { fixture, snapshot } = loadSnapshot();
  const compiled = assertCompiledArtifacts(snapshot);
  const noCollapse = runCollapseFalsifiers(snapshot);
  const routes = runRouteCases(snapshot, fixture);
  const advisor = runAdvisorCases(snapshot, fixture);
  const documentParity = runDocumentParity(snapshot, fixture);
  const execution = runExecutionFence(snapshot, fixture);
  const rollback = runRollbackDrill(snapshot);
  const hardBlocks = runHardBlocks(snapshot, fixture);
  const dualRead = runDualRead(snapshot);
  const staticGates = runStaticGates();
  const protectedAfter = protectedHashes();
  const sourcesAfter = authoredSourceHashes();
  assert.deepStrictEqual(protectedAfter, protectedBefore);
  assert.deepStrictEqual(sourcesAfter, sourcesBefore);
  return {
    advisor,
    authoredSourceDigests: sourcesAfter,
    compiled,
    documentParity,
    dualRead,
    execution,
    hardBlocks,
    noCollapse,
    protectedDigests: protectedAfter,
    rollback,
    routes,
    stageGate: {
      activationEligibility: 'eligible-shadow-only',
      advisorIdentity: 'pass-or-annotation-only',
      documentParity: 'pass',
      documentRequest: 'full-machine-request',
      distinctPublicModes: compiled.distinctPublicModeCount,
      deliveredArtifactRouteGold: routes.deliveredArtifact.status,
      noCollapse: 'pass',
      rollbackDrill: 'pass',
      routeGold: 'real-green',
      routeGoldRealGreenRows: routes.realGreenRows,
      routeGoldShadowPartialRows: routes.shadowPartialRows,
      scorer: 'real-read-only-evaluateRouteGold',
      selectionKinds: ['single'],
      servingAuthority: 'legacy',
    },
    staticGates,
    status: 'real-green',
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  AUTHORED_SOURCE_DIGESTS,
  PROTECTED_DIGESTS,
  runCanary,
};

if (require.main === module) {
  try {
    process.stdout.write(`${canonicalize(runCanary())}\n`);
  } catch (error) {
    process.stderr.write(`[deep-loop-canary] ${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}
