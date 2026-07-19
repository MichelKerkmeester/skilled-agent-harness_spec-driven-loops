#!/usr/bin/env node
'use strict';

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
const { commitActor } = require('../lib/execution-fence.cjs');
const {
  artifactBytes,
  compileRegistry,
  sha256,
} = require('../lib/registry-compiler.cjs');
const {
  advisorDisposition,
  evaluateCanary,
} = require('../lib/router.cjs');
const {
  generatePolicyCard,
  replayPolicyCard,
} = require('../lib/policy-card.cjs');
const {
  compatibilityProjection,
  compiledLeafPairsForDecision,
  loadSnapshot,
  sourceBytes,
} = require('./build-artifacts.cjs');

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
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-prompt');
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
const AUTHORED_SOURCE_DIGESTS = Object.freeze({
  'SKILL.md': '06544150e096a6b7b43b73bae52ce77bd24f3e1fb742e0f5ba9530146616066c',
  'hub-router.json': 'a32791dc8c4a4fb24ff8f94303621e3cfaf3254746af49745c10a61f98a1dd97',
  'mode-registry.json': '36deecb3840ae8a5067187e6c5ae8fd40a76cd56034d41a8a3b632f3d6e2fcbe',
  'prompt-improve/SKILL.md': '129c17f585e229022721158e64554e3c1e00f2e943071828fbb70e46275cae24',
  'prompt-models/SKILL.md': '93883122e6220646b46252ce5567c5cae220d462aeee5c88cfda95d9c3339cb9',
});

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
    source: { featureFile: 'sk-prompt-canary', shape: 'sk-doc' },
  };
}

function compileFromBytes(bytes, overrides = {}) {
  const registry = overrides.registry
    || JSON.parse(bytes['mode-registry.json'].toString('utf8'));
  return compileRegistry({
    activationGeneration: overrides.activationGeneration || 5,
    hubRouter: overrides.hubRouter
      || JSON.parse(bytes['hub-router.json'].toString('utf8')),
    hubSkillMarkdown: bytes['SKILL.md'].toString('utf8'),
    packetSkillMarkdown: Object.fromEntries(registry.modes.map((mode) => (
      [mode.workflowMode, bytes[`${mode.packet}/SKILL.md`].toString('utf8')]
    ))),
    registry,
    sourceBytes: bytes,
  });
}

function assertCompiledArtifacts(snapshot) {
  const second = loadSnapshot().snapshot;
  assert.ok(artifactBytes(snapshot.policy).equals(artifactBytes(second.policy)));
  assert.ok(
    artifactBytes(snapshot.policy).equals(
      fs.readFileSync(path.join(PHASE_ROOT, 'compiled', 'policy.json')),
    ),
  );
  assert.strictEqual(computeBasePolicyHash(snapshot.policy), snapshot.policy.basePolicyHash);
  assert.deepStrictEqual(schemaErrors(POLICY_SCHEMA, snapshot.policy), []);
  assert.deepStrictEqual(schemaErrors(ADVISOR_SCHEMA, snapshot.advisorProjection), []);
  assert.strictEqual(snapshot.policy.destinations.length, 2);
  assert.strictEqual(snapshot.policy.compositionRules.length, 1);
  assert.strictEqual(snapshot.policy.compositionRules[0].kind, 'orderedBundle');
  assert.deepStrictEqual(snapshot.routingModel.tieBreak, ['prompt-improve', 'prompt-models']);
  assert.strictEqual(snapshot.routingModel.defaultMode, 'prompt-improve');
  assert.deepStrictEqual(
    Object.fromEntries(snapshot.routingModel.modes.map((mode) => [mode.workflowMode, mode.weight])),
    { 'prompt-improve': 4, 'prompt-models': 6 },
  );
  assert.deepStrictEqual(
    snapshot.projectionGraph.rows.map((row) => row.resource),
    ['prompt-improve/SKILL.md', 'prompt-models/SKILL.md'],
  );
  assert.strictEqual(snapshot.manifestResources.length, 2);
  assert.strictEqual(snapshot.resourceSelections.length, 2);

  const graph = readJson(path.join(PHASE_ROOT, 'compiled', 'projection-graph.json'));
  assert.deepStrictEqual(graph, snapshot.projectionGraph);
  const card = generatePolicyCard(snapshot);
  assert.deepStrictEqual(schemaErrors(CARD_SCHEMA, card.frontmatter), []);
  assert.strictEqual(
    fs.readFileSync(path.join(PHASE_ROOT, 'compiled', 'PolicyCardV1.md'), 'utf8'),
    card.markdown,
  );
  const typed = readJson(path.join(PHASE_ROOT, 'compiled', 'route-gold.typed.json'));
  typed.cases.forEach((row) => assert.deepStrictEqual(schemaErrors(TYPED_GOLD_SCHEMA, row), []));

  const bytes = sourceBytes();
  const drifted = JSON.parse(bytes['hub-router.json'].toString('utf8'));
  drifted.routerPolicy.defaultMode = null;
  assertThrowsCode(
    () => compileFromBytes(bytes, { hubRouter: drifted }),
    TypeError,
    'SOURCE_IDENTITY_MISMATCH',
  );
  const coherentBytes = { ...bytes, 'hub-router.json': Buffer.from(`${JSON.stringify(drifted)}\n`) };
  assertThrowsCode(
    () => compileFromBytes(coherentBytes, { hubRouter: drifted }),
    TypeError,
    'DEFAULT_MODE_INVALID',
  );
  return {
    byteIdenticalRecompile: true,
    defaultMode: snapshot.routingModel.defaultMode,
    destinationCount: snapshot.policy.destinations.length,
    orderedBundleTargets: [...snapshot.routingModel.tieBreak],
    sharedCompilerPath: '001-compiler-n1-shadow/compiler/compiler.cjs',
    sourceIdentityGuard: true,
    weights: { 'prompt-improve': 4, 'prompt-models': 6 },
  };
}

function scoreDeliveredRouteGold(fixture) {
  const typedPath = path.join(PHASE_ROOT, 'compiled', 'route-gold.typed.json');
  const acceptancePath = path.join(PHASE_ROOT, 'activation', 'acceptance.json');
  const typedBytes = fs.readFileSync(typedPath);
  const acceptance = readJson(acceptancePath);
  assert.strictEqual(sha256(typedBytes), acceptance.candidateArtifacts['route-gold.typed.json']);
  const typed = JSON.parse(typedBytes.toString('utf8'));
  assert.strictEqual(typed.cases.length, fixture.cases.length);
  const fixtureById = new Map(fixture.cases.map((entry) => [entry.id, entry]));
  const inputs = typed.cases.map((row) => {
    assert.deepStrictEqual(schemaErrors(TYPED_GOLD_SCHEMA, row), []);
    assert.strictEqual(
      computeProjectionHash('TypedRouteGoldV1', row),
      row.projectionHash,
    );
    const entry = fixtureById.get(row.scenarioId);
    assert.ok(entry, row.scenarioId);
    return {
      observed: {
        observedIntents: row.observedIntents,
        observedResources: row.observedResources.map((resource) => resource.resource),
      },
      scenario: scorerScenario(entry),
    };
  });
  const scored = scoreRouteGoldReadOnly(inputs);
  assert.strictEqual(scored.writeBackAttempted, false);
  scored.verdicts.forEach((verdict, index) => {
    assert.strictEqual(verdict.pass, true, typed.cases[index].scenarioId);
  });

  const tampered = clone(typed);
  const index = tampered.cases.findIndex((row) => row.scenarioId === 'single-prompt-improve');
  tampered.cases[index].observedResources[0].resource = 'corrupted-resource';
  tampered.cases[index].projectionHash = computeProjectionHash(
    'TypedRouteGoldV1',
    tampered.cases[index],
  );
  const tamperedInput = {
    observed: {
      observedIntents: tampered.cases[index].observedIntents,
      observedResources: tampered.cases[index].observedResources.map((entry) => entry.resource),
    },
    scenario: scorerScenario(fixtureById.get('single-prompt-improve')),
  };
  const falsifier = scoreRouteGoldReadOnly([tamperedInput]);
  assert.strictEqual(falsifier.verdicts[0].pass, false);
  assert.strictEqual(falsifier.verdicts[0].resourceOk, false);
  return {
    acceptanceDigestBound: true,
    coherentTamperPass: falsifier.verdicts[0].pass,
    realGreenRows: scored.verdicts.length,
    scorerSource: 'real-read-only-evaluateRouteGold',
    shadowPartialRows: 0,
    writeBackAttempted: scored.writeBackAttempted,
  };
}

function runRouteCases(snapshot, fixture) {
  const rows = [];
  const inputs = [];
  for (const entry of fixture.cases) {
    const result = evaluateCanary(snapshot, entry);
    assert.strictEqual(result.decision.action, entry.expectedAction, `${entry.id} action`);
    if (entry.expectedSelectionKind) {
      assert.strictEqual(result.decision.route.selectionKind, entry.expectedSelectionKind);
      assert.deepStrictEqual(targetModes(result.decision), entry.expectedModes);
      assert.strictEqual(result.decision.route.basis.kind, entry.expectedBasis);
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
      assert.strictEqual(result.decision.clarify.question.length > 0, true);
      assert.deepStrictEqual(
        result.decision.clarify.alternatives,
        ['prompt-improve', 'prompt-models', 'none_of_these'],
      );
    }
    const leafPairs = compiledLeafPairsForDecision(snapshot, result.decision);
    const projection = compatibilityProjection(snapshot, result.decision, leafPairs);
    assert.deepStrictEqual(projection.observedIntents, entry.expectedAction === 'route'
      ? entry.gold.expectedIntents
      : []);
    assert.deepStrictEqual(projection.observedResources, entry.gold.expectedResources);
    inputs.push({ observed: projection, scenario: scorerScenario(entry) });
    rows.push({
      action: result.decision.action,
      basis: result.decision.route?.basis.kind || null,
      id: entry.id,
      selectionKind: result.decision.route?.selectionKind || null,
      targetModes: targetModes(result.decision),
    });
  }
  const scorer = scoreRouteGoldReadOnly(inputs);
  assert.strictEqual(scorer.writeBackAttempted, false);
  scorer.verdicts.forEach((verdict, index) => {
    assert.strictEqual(verdict.pass, true, fixture.cases[index].id);
  });
  const defaultRow = rows.find((row) => row.id === 'zero-signal-default');
  assert.deepStrictEqual(defaultRow, {
    action: 'route',
    basis: 'bounded-default',
    id: 'zero-signal-default',
    selectionKind: 'single',
    targetModes: ['prompt-improve'],
  });
  const bundleRow = rows.find((row) => row.id === 'ordered-bundle-explicit-both');
  assert.deepStrictEqual(bundleRow.targetModes, ['prompt-improve', 'prompt-models']);
  const clarifyRows = rows.filter((row) => row.action === 'clarify');
  assert.deepStrictEqual(clarifyRows.map((row) => row.id), ['ambiguous-one-clarify']);
  return {
    deliveredArtifact: scoreDeliveredRouteGold(fixture),
    realGreenRows: scorer.verdicts.length,
    rows,
    scorerSource: 'real-read-only-evaluateRouteGold',
    shadowPartialRows: 0,
    writeBackAttempted: scorer.writeBackAttempted,
  };
}

function assertDocumentParity(machine, document) {
  if (canonicalize(machine) !== canonicalize(document)) {
    const error = new Error('document replay diverged from machine policy');
    error.code = 'DOCUMENT_PARITY_MISMATCH';
    throw error;
  }
}

function runDocumentParity(snapshot, fixture) {
  const card = fs.readFileSync(path.join(PHASE_ROOT, 'compiled', 'PolicyCardV1.md'), 'utf8');
  const rows = fixture.cases.map((entry) => {
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
  parsed.routingModel.defaultMode = 'prompt-models';
  const divergentCard = card.replace(serialized, canonicalize(parsed));
  const entry = fixture.cases.find((candidate) => candidate.id === 'zero-signal-default');
  const machine = evaluateCanary(snapshot, entry).decision;
  const divergent = replayPolicyCard(divergentCard, entry).decision;
  assertThrowsCode(
    () => assertDocumentParity(machine, divergent),
    Error,
    'DOCUMENT_PARITY_MISMATCH',
  );
  return { plantedDivergenceRejected: true, rows };
}

function runAdvisorCases(snapshot, fixture) {
  return fixture.advisorCases.map((entry) => {
    const advisor = {
      effectivePolicyHash: snapshot.policy.effectivePolicyHash,
      hubId: snapshot.advisorProjection.hubId,
      projectionHash: entry.projectionDrift
        ? '0'.repeat(64)
        : snapshot.advisorProjection.projectionHash,
      trust: entry.trust,
    };
    const disposition = advisorDisposition(snapshot, advisor);
    assert.strictEqual(disposition.contributes, entry.expectedContribution);
    return { id: entry.id, ...disposition };
  });
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
  const entry = fixture.cases.find((candidate) => candidate.id === 'single-prompt-improve');
  const result = evaluateCanary(snapshot, entry);
  const context = bindingContext(snapshot, result);
  const plane = new DestinationExecutionPlane({ planningEpoch: context.epoch });
  const prepared = plane.prepare(result.decision, context);
  assert.strictEqual(prepared.preparedLegs.length, 1);
  const leg = prepared.preparedLegs[0];
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
  const current = { ...context, currentEpoch: context.epoch, orderedTargets: leg.orderedTargets };
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
    if (fileHash(path.join(PHASE_ROOT, 'compiled', name)) !== expected) {
      throw new CanaryActivationError(
        'ACCEPTANCE_ARTIFACT_HASH_MISMATCH',
        `${name} differs from its accepted digest`,
      );
    }
  }
  if (fileHash(path.join(PHASE_ROOT, 'activation', 'manifest.prior.json'))
    !== acceptance.priorManifestHash) {
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
  const candidate = readJson(path.join(activationRoot, 'manifest.candidate.json'));
  const priorBytes = fs.readFileSync(path.join(activationRoot, 'manifest.prior.json'));
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
        nextBytes: manifestBytes(candidate),
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
      nextBytes: manifestBytes(candidate),
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
    assert.ok(restoredBytes.equals(priorBytes));
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

function runClosedAlgebra(snapshot, fixture) {
  const route = evaluateCanary(
    snapshot,
    fixture.cases.find((entry) => entry.id === 'single-prompt-improve'),
  ).decision;
  const negative = evaluateCanary(
    snapshot,
    fixture.cases.find((entry) => entry.id === 'dependency-defer'),
  ).decision;
  const smuggled = clone(negative);
  smuggled.defer.targets = [route.route.targets[0]];
  assertThrowsCode(
    () => parseRouteDecision(smuggled),
    DecisionValidationError,
    'NEGATIVE_TARGET_FORBIDDEN',
  );
  const claimed = clone(negative);
  claimed.defer.authority = 'WithheldUntilVerify';
  assertThrowsCode(
    () => parseRouteDecision(claimed),
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
  const bundle = evaluateCanary(
    snapshot,
    fixture.cases.find((entry) => entry.id === 'ordered-bundle-explicit-both'),
  ).decision;
  const reversed = clone(bundle);
  reversed.route.targets.reverse();
  assertThrowsCode(
    () => parseRouteDecision(reversed, snapshot.policy),
    DecisionValidationError,
    'BUNDLE_NOT_IN_POLICY',
  );
  return {
    bundleOrderGuard: 'BUNDLE_NOT_IN_POLICY',
    negativeAuthorityGuard: 'NEGATIVE_AUTHORITY_INVALID',
    negativeTargetGuard: 'NEGATIVE_TARGET_FORBIDDEN',
    routeRecoveryGuard: 'ROUTE_RECOVERY_ARTIFACT_FORBIDDEN',
  };
}

function runActivationGate() {
  const green = {
    bundleGreen: true,
    closedAlgebraGreen: true,
    defaultModeGreen: true,
    documentParityGreen: true,
    rollbackGreen: true,
    routeGoldGreen: true,
    sourceIntegrityGreen: true,
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
  assertThrowsCode(
    () => assertActivationEligible({ ...green, defaultModeGreen: false }),
    CanaryActivationError,
    'CANARY_SUBGATE_INCOMPLETE',
  );
  return { codes, eligible };
}

function listFiles(directory, extension) {
  const files = [];
  const pending = [directory];
  while (pending.length > 0) {
    const current = pending.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const targetPath = path.join(current, entry.name);
      if (entry.isDirectory()) pending.push(targetPath);
      else if (entry.name.endsWith(extension)) files.push(targetPath);
    }
  }
  return files.sort();
}

function runStaticGates() {
  const files = listFiles(PHASE_ROOT, '.cjs');
  const source = files.map((filePath) => fs.readFileSync(filePath, 'utf8')).join('\n');
  const forbiddenComment = /\b(?:ADR|REQ|CHK|T)-?\d+\b|\.opencode\/specs\//i;
  for (const filePath of files) {
    const comments = fs.readFileSync(filePath, 'utf8')
      .split('\n')
      .filter((line) => /^\s*(?:\/\/|\/\*|\*)/.test(line))
      .join('\n');
    assert.strictEqual(forbiddenComment.test(comments), false, filePath);
  }
  for (const pattern of [/Date\.now\s*\(/, /Math\.random\s*\(/, /new Date\s*\(/]) {
    assert.strictEqual(pattern.test(source), false, String(pattern));
  }
  const externalRequires = [...source.matchAll(/require\(['"]([^'"]+)['"]\)/g)]
    .map((match) => match[1])
    .filter((specifier) => !specifier.startsWith('.') && !specifier.startsWith('node:'));
  const allowedBuiltins = new Set(['assert', 'crypto', 'fs', 'path']);
  externalRequires.forEach((specifier) => assert.ok(allowedBuiltins.has(specifier), specifier));
  return {
    codeFiles: files.length,
    commentViolations: 0,
    deterministicArtifactViolations: 0,
    externalDependencies: 0,
  };
}

function runCanary() {
  const protectedBefore = protectedHashes();
  const sourcesBefore = authoredSourceHashes();
  assert.deepStrictEqual(protectedBefore, PROTECTED_DIGESTS);
  assert.deepStrictEqual(sourcesBefore, AUTHORED_SOURCE_DIGESTS);
  const { fixture, snapshot } = loadSnapshot();
  const compiled = assertCompiledArtifacts(snapshot);
  const routes = runRouteCases(snapshot, fixture);
  const documentParity = runDocumentParity(snapshot, fixture);
  const advisor = runAdvisorCases(snapshot, fixture);
  const execution = runExecutionFence(snapshot, fixture);
  const rollback = runRollbackDrill(snapshot);
  const closedAlgebra = runClosedAlgebra(snapshot, fixture);
  const activation = runActivationGate();
  const staticGates = runStaticGates();
  const protectedAfter = protectedHashes();
  const sourcesAfter = authoredSourceHashes();
  assert.deepStrictEqual(protectedAfter, protectedBefore);
  assert.deepStrictEqual(sourcesAfter, sourcesBefore);
  return {
    activation,
    advisor,
    authoredSourceDigests: sourcesAfter,
    closedAlgebra,
    compiled,
    documentParity,
    execution,
    protectedDigests: protectedAfter,
    rollback,
    routes,
    stageGate: {
      activationEligibility: 'eligible-shadow-only',
      defaultModeFallback: 'route(single,[prompt-improve])',
      deliveredArtifactRouteGold: 'real-green',
      documentParity: 'pass',
      orderedBundle: ['prompt-improve', 'prompt-models'],
      rollbackDrill: 'pass',
      routeGold: 'real-green',
      routeGoldRealGreenRows: routes.realGreenRows,
      routeGoldShadowPartialRows: routes.shadowPartialRows,
      scorer: 'real-read-only-evaluateRouteGold',
      selectionKinds: ['single', 'orderedBundle'],
      servingAuthority: 'legacy',
    },
    staticGates,
    status: 'real-green',
  };
}

module.exports = {
  AUTHORED_SOURCE_DIGESTS,
  PROTECTED_DIGESTS,
  runCanary,
};

if (require.main === module) {
  try {
    process.stdout.write(`${canonicalize(runCanary())}\n`);
  } catch (error) {
    process.stderr.write(`[sk-prompt-canary] ${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}
