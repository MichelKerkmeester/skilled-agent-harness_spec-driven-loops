#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ HARNESS: PARENT-HUB CANARY VALIDATION                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert');
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const {
  canonicalize,
  computeBasePolicyHash,
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
  evaluateWithTrace,
} = require('../../../002-decision-evaluator/lib/evaluator.cjs');
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
  sealCertificate,
} = require('../../../005-calibration/002-rank-vs-calibrated-contract/lib/calibration-contract.cjs');
const {
  CanaryActivationError,
  HARD_BLOCKS,
  assertActivationEligible,
  assertPinnedTuple,
  assertSingleGeneration,
} = require('../lib/activation-gate.cjs');
const { buildRequest, evaluateCanary } = require('../lib/canary-router.cjs');
const { commitActor, verifyForOperation } = require('../lib/execution-fence.cjs');
const {
  PACKET_AUTHORITY,
  artifactBytes,
  compileRegistry,
  sha256,
} = require('../lib/registry-compiler.cjs');
const {
  generatePolicyCard,
  replayPolicyCard,
} = require('../lib/policy-card.cjs');
const {
  loadSnapshot,
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
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-code');
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
  'load-playbook-scenarios.cjs': '249be7c1cae9dcfe1faec8dcfc2965a0a0fc89e0af8e30bdd271625f300a6fde',
  'router-replay.cjs': 'b039b8dd22dbfaaa91042f613998d54610080feadef6179362e0d01b83e8bedf',
  'score-skill-benchmark.cjs': 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
});

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function canaryInput(fixture, entry) {
  const input = clone(entry);
  const fixtureId = input.certificateFixture;
  const certificateState = input.certificateState || 'live';
  delete input.certificateFixture;
  delete input.certificateState;
  if (!fixtureId) return input;
  const certificate = sealCertificate(fixture.certificates[fixtureId]);
  input.certificateHandle = {
    state: certificateState,
    activeCertificateId: certificate.certificateId,
    certificate,
  };
  return input;
}

function fileHash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function protectedHashes() {
  return Object.fromEntries(Object.keys(PROTECTED_DIGESTS).map((name) => (
    [name, fileHash(path.join(SCORER_ROOT, name))]
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
    source: { featureFile: 'approved-canary-fixture', shape: 'sk-doc' },
  };
}

function assertCompiledArtifacts(snapshot) {
  const second = loadSnapshot().snapshot;
  const policyBytes = artifactBytes(snapshot.policy);
  assert.ok(policyBytes.equals(artifactBytes(second.policy)), 'identical authored input recompile drifted');
  assert.ok(policyBytes.equals(fs.readFileSync(path.join(PHASE_ROOT, 'compiled', 'policy.json'))));
  assert.strictEqual(computeBasePolicyHash(snapshot.policy), snapshot.policy.basePolicyHash);
  assert.deepStrictEqual(schemaErrors(POLICY_SCHEMA, snapshot.policy), []);
  assert.deepStrictEqual(schemaErrors(ADVISOR_SCHEMA, snapshot.advisorProjection), []);

  const card = generatePolicyCard(snapshot);
  assert.deepStrictEqual(schemaErrors(CARD_SCHEMA, card.frontmatter), []);
  assert.strictEqual(
    fs.readFileSync(path.join(PHASE_ROOT, 'compiled', 'PolicyCardV1.md'), 'utf8'),
    card.markdown,
  );
  const typed = readJson(path.join(PHASE_ROOT, 'compiled', 'route-gold.typed.json'));
  typed.cases.forEach((row) => assert.deepStrictEqual(schemaErrors(TYPED_GOLD_SCHEMA, row), []));

  const registry = readJson(path.join(SKILL_ROOT, 'mode-registry.json'));
  registry.modes.forEach((mode) => {
    const destination = snapshot.policy.destinations.find((entry) => (
      entry.id.workflowMode === mode.workflowMode
    ));
    assert.ok(destination, `missing compiled mode ${mode.workflowMode}`);
    assert.strictEqual(destination.role, PACKET_AUTHORITY[mode.packetKind].role);
    assert.strictEqual(
      destination.mutatesWorkspace,
      PACKET_AUTHORITY[mode.packetKind].mutatesWorkspace,
    );
  });

  const mismatchedRegistry = clone(registry);
  mismatchedRegistry.modes[0].workflowMode = 'caller-supplied-drift';
  const liveBytes = {
    'SKILL.md': fs.readFileSync(path.join(SKILL_ROOT, 'SKILL.md')),
    'hub-router.json': fs.readFileSync(path.join(SKILL_ROOT, 'hub-router.json')),
    'mode-registry.json': fs.readFileSync(path.join(SKILL_ROOT, 'mode-registry.json')),
  };
  assert.throws(
    () => compileRegistry({
      activationGeneration: snapshot.policy.activationGeneration,
      hubRouter: readJson(path.join(SKILL_ROOT, 'hub-router.json')),
      registry: mismatchedRegistry,
      skillMarkdown: liveBytes['SKILL.md'].toString('utf8'),
      sourceBytes: liveBytes,
    }),
    (error) => assertCode(error, 'AUTHORED_SOURCE_IDENTITY_MISMATCH'),
  );
  return {
    basePolicyHash: snapshot.policy.basePolicyHash,
    byteIdenticalRecompile: true,
    destinationCount: snapshot.policy.destinations.length,
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    selfDeclaredInputRejected: true,
  };
}

function runRouteCases(snapshot, fixture) {
  const rows = [];
  const scorerInputs = [];
  for (const entry of fixture.cases) {
    const result = evaluateCanary(snapshot, canaryInput(fixture, entry));
    assert.strictEqual(result.decision.action, entry.expectedAction, `${entry.id} action`);
    if (entry.expectedSelectionKind) {
      assert.strictEqual(result.decision.route.selectionKind, entry.expectedSelectionKind);
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
      assert.strictEqual(result.decision.clarify.alternatives.length, 4);
      assert.strictEqual(result.decision.clarify.alternatives.at(-1), 'none_of_these');
      assert.strictEqual(result.decision.clarify.question, snapshot.fallbackChecklist[0]);
    }
    const projection = projectToRouteGold(result.decision, { policy: snapshot.policy });
    scorerInputs.push({ observed: projection, scenario: scorerScenario(entry) });
    rows.push({
      action: result.decision.action,
      id: entry.id,
      projection,
      selectionKind: result.decision.route?.selectionKind || null,
      targetModes: targetModes(result.decision),
    });
  }
  const scorer = scoreRouteGoldReadOnly(scorerInputs);
  scorer.verdicts.forEach((verdict, index) => {
    assert.strictEqual(verdict.pass, true, `${fixture.cases[index].id} real scorer mismatch`);
    rows[index].realScorerPass = true;
  });
  const corrupted = clone(scorerInputs[0]);
  corrupted.observed.observedIntents = ['corrupted-observation'];
  const falsifier = scoreRouteGoldReadOnly([corrupted]).verdicts[0];
  assert.strictEqual(falsifier.pass, false, 'corrupted observation must fail the real scorer');

  const surfaceOnly = evaluateCanary(snapshot, { prompt: 'webflow animation' }).decision;
  assert.strictEqual(surfaceOnly.action, 'defer');
  assert.strictEqual(surfaceOnly.defer.reason, 'no-match');
  return {
    corruptedObservationPass: falsifier.pass,
    realScorerRows: rows.length,
    rows,
    surfaceOnlyAction: surfaceOnly.action,
  };
}

function runCertificateGate(snapshot, fixture) {
  const certifiedInput = canaryInput(fixture, fixture.cases[0]);
  const certified = evaluateCanary(snapshot, certifiedInput);
  assert.strictEqual(certified.decision.action, 'route');
  assert.strictEqual(certified.decision.route.selectionKind, 'surfaceBundle');
  assert.strictEqual(certified.decision.route.basis.kind, 'signal');
  assert.strictEqual(certified.calibration.status, 'validated');
  assert.strictEqual(certified.calibration.policyHash, snapshot.policy.effectivePolicyHash);
  assert.strictEqual(certified.calibration.riskSlice, certifiedInput.riskSlice);
  assert.deepStrictEqual(
    parseRouteDecision(certified.decision, snapshot.policy),
    certified.decision,
  );

  const rows = fixture.certificateCases.map((entry) => {
    const input = canaryInput(fixture, entry);
    const result = evaluateCanary(snapshot, input);
    assert.strictEqual(result.decision.action, entry.expectedAction, `${entry.id} action`);
    assert.ok(['clarify', 'defer'].includes(result.decision.action), `${entry.id} abstention`);
    assert.notStrictEqual(result.decision.route?.basis?.kind, 'signal', `${entry.id} signal route`);
    assert.strictEqual(
      result.trace.controller.certificateReason,
      entry.expectedCertificateReason,
      `${entry.id} certificate reason`,
    );
    assert.deepStrictEqual(
      parseRouteDecision(result.decision, snapshot.policy),
      result.decision,
    );
    return {
      action: result.decision.action,
      certificateReason: result.trace.controller.certificateReason,
      externalOraclePass: true,
      id: entry.id,
    };
  });

  const noCertificate = canaryInput(fixture, fixture.certificateCases[0]);
  const built = buildRequest(snapshot, noCertificate);
  const ungated = evaluateWithTrace(built.request, snapshot.policy).decision;
  assert.strictEqual(ungated.action, 'route');
  assert.strictEqual(ungated.route.selectionKind, 'surfaceBundle');
  assert.strictEqual(ungated.route.basis.kind, 'signal');

  const singular = evaluateCanary(
    snapshot,
    canaryInput(fixture, fixture.cases[1]),
  );
  assert.strictEqual(singular.decision.action, 'route');
  assert.strictEqual(singular.decision.route.selectionKind, 'single');
  assert.strictEqual(singular.calibration.status, 'unvalidated');
  assert.strictEqual(singular.trace.controller.branch, 'singular-exact-signal');
  assert.strictEqual(singular.trace.controller.rankCalls, 0);
  assert.strictEqual(singular.trace.controller.thresholdCalls, 0);
  assert.deepStrictEqual(
    parseRouteDecision(singular.decision, snapshot.policy),
    singular.decision,
  );

  return {
    certified: {
      action: certified.decision.action,
      basis: certified.decision.route.basis.kind,
      certificateId: certified.calibration.certificateId,
      externalOraclePass: true,
      selectionKind: certified.decision.route.selectionKind,
    },
    controllerBypassFalsifier: {
      action: ungated.action,
      basis: ungated.route.basis.kind,
      selectionKind: ungated.route.selectionKind,
    },
    rows,
    singular: {
      action: singular.decision.action,
      calibrationStatus: singular.calibration.status,
      externalOraclePass: true,
      rankCalls: singular.trace.controller.rankCalls,
      selectionKind: singular.decision.route.selectionKind,
      thresholdCalls: singular.trace.controller.thresholdCalls,
    },
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
  const reference = canaryInput(fixture, fixture.cases[0]);
  const baseline = evaluateCanary(snapshot, reference);
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
    const result = evaluateCanary(snapshot, { ...reference, advisor });
    assert.strictEqual(result.advisorDisposition.contributes, entry.expectedContribution);
    assert.deepStrictEqual(routeIdentity(result.decision), routeIdentity(baseline.decision));
    return {
      contributes: result.advisorDisposition.contributes,
      id: entry.id,
      reason: result.advisorDisposition.reason,
      routeIdentity: routeIdentity(result.decision),
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
    prompt: 'quality review',
  });
  assert.strictEqual(ambiguous.decision.action, 'clarify');
  return { missingCertificateAction: ambiguous.decision.action, rows };
}

function assertDocumentParity(machine, document) {
  const machineComparable = clone(machine);
  const documentComparable = clone(document);
  if (machineComparable.action === 'route') machineComparable.route.evidence = [];
  if (documentComparable.action === 'route') documentComparable.route.evidence = [];
  if (canonicalize(machineComparable) !== canonicalize(documentComparable)) {
    const error = new Error('document replay diverged from machine policy');
    error.code = 'DOCUMENT_PARITY_MISMATCH';
    throw error;
  }
}

function runDocumentParity(snapshot, fixture) {
  const card = fs.readFileSync(path.join(PHASE_ROOT, 'compiled', 'PolicyCardV1.md'), 'utf8');
  const rows = fixture.cases.map((entry) => {
    const machine = evaluateCanary(snapshot, canaryInput(fixture, entry)).decision;
    const document = replayPolicyCard(card, entry.prompt);
    assert.strictEqual(document.terminal, 'DOCUMENT_ONLY_UNATTESTED');
    assertDocumentParity(machine, document.decision);
    if (machine.action === 'route') assert.strictEqual(document.draftStatus, 'PREPARED_DRAFT');
    return { action: machine.action, id: entry.id, terminal: document.terminal };
  });

  const marker = /## Document-only routing snapshot\n\n```json\n([^\n]+)\n```/m;
  const parsed = JSON.parse(marker.exec(card)[1]);
  parsed.selectors = parsed.selectors.filter((selector) => (
    selector.destinationId.workflowMode !== 'code-review'
  ));
  const divergentCard = card.replace(marker, (block) => (
    block.replace(marker.exec(block)[1], canonicalize(parsed))
  ));
  const machine = evaluateCanary(snapshot, fixture.cases[0]).decision;
  const divergent = replayPolicyCard(divergentCard, fixture.cases[0].prompt).decision;
  assertThrowsCode(
    () => assertDocumentParity(machine, divergent),
    Error,
    'DOCUMENT_PARITY_MISMATCH',
  );
  return { plantedDivergenceRejected: true, rows };
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

function currentBindings(context, orderedTargets) {
  return {
    ...context,
    currentEpoch: context.epoch,
    orderedTargets,
  };
}

function destinationAdapter(effectState) {
  return {
    atomicity: 'atomic',
    acquireLocalAuthority: () => ({ handle: 'local-handle', state: 'ACQUIRED' }),
    performEffect: () => {
      effectState.count += 1;
      return { effectId: `effect-${effectState.count}` };
    },
    verifyCurrentAuthority: () => ({ state: 'READY' }),
  };
}

function runExecutionFence(snapshot, fixture) {
  const result = evaluateCanary(snapshot, canaryInput(fixture, fixture.cases[0]));
  const context = bindingContext(snapshot, result);
  const plane = new DestinationExecutionPlane({ planningEpoch: context.epoch });
  const prepared = plane.prepare(result.decision, context);
  const evidenceLeg = prepared.preparedLegs.find((leg) => leg.target.role === 'evidence');
  const actorLeg = prepared.preparedLegs.find((leg) => leg.target.role === 'actor');
  assert.ok(evidenceLeg && actorLeg);
  assert.strictEqual(result.decision.route.targets[0].role, 'actor');
  assert.strictEqual(result.decision.route.targets[1].role, 'evidence');
  const effects = { count: 0 };
  const adapter = destinationAdapter(effects);
  const current = currentBindings(context, evidenceLeg.orderedTargets);

  const refused = verifyForOperation(plane, evidenceLeg, current, adapter, 'commit');
  assert.strictEqual(refused.state, 'REJECT');
  assert.strictEqual(refused.reason, 'evidence-target-cannot-commit');
  const evidenceReady = verifyForOperation(plane, evidenceLeg, current, adapter, 'read');
  assert.strictEqual(evidenceReady.state, 'READY');
  assertThrowsCode(
    () => plane.commit(evidenceLeg, evidenceReady, adapter, {
      retentionUntilEpoch: context.expiresAtEpoch,
      timestamp: '2026-07-19T00:00:00.000Z',
    }),
    ExecutionProtocolError,
    'ROLE_CANNOT_COMMIT',
  );
  plane.resolveEvidence(evidenceLeg, evidenceReady);

  assertThrowsCode(
    () => commitActor(plane, actorLeg, {}, adapter, {
      retentionUntilEpoch: context.expiresAtEpoch,
      timestamp: '2026-07-19T00:00:00.000Z',
    }),
    ExecutionProtocolError,
    'COMMIT_WITHOUT_READY',
  );
  const actorReady = verifyForOperation(plane, actorLeg, current, adapter, 'commit');
  const committed = commitActor(plane, actorLeg, actorReady, adapter, {
    retentionUntilEpoch: context.expiresAtEpoch,
    timestamp: '2026-07-19T00:00:00.000Z',
  });
  assert.deepStrictEqual(committed.protocolPath, ['PREPARE', 'VERIFY', 'COMMIT']);
  assert.strictEqual(effects.count, 1);
  return {
    actorCommitPath: committed.protocolPath,
    actorEffects: effects.count,
    actorWithoutVerifyError: 'COMMIT_WITHOUT_READY',
    evidenceCommitError: 'ROLE_CANNOT_COMMIT',
    evidenceVerifyState: refused.state,
    routeLoadingOrder: result.decision.route.targets.map((entry) => entry.role),
  };
}

function verifyAcceptance(acceptance) {
  const artifactDirectory = path.join(PHASE_ROOT, 'compiled');
  for (const [name, expected] of Object.entries(acceptance.candidateArtifacts)) {
    const actual = fileHash(path.join(artifactDirectory, name));
    if (actual !== expected) {
      const error = new CanaryActivationError(
        'ACCEPTANCE_ARTIFACT_HASH_MISMATCH',
        `${name} differs from the accepted artifact hash`,
      );
      throw error;
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
  const tamperedAcceptance = clone(acceptance);
  tamperedAcceptance.candidateArtifacts['policy.json'] = '0'.repeat(64);
  assertThrowsCode(
    () => verifyAcceptance(tamperedAcceptance),
    CanaryActivationError,
    'ACCEPTANCE_ARTIFACT_HASH_MISMATCH',
  );
  const prior = readJson(path.join(activationRoot, 'manifest.prior.json'));
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
    assert.strictEqual(priorPin.generation, 0);
    assert.strictEqual(candidatePin.generation, snapshot.policy.activationGeneration);

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
    const finalFence = readJson(fencePath);
    assert.strictEqual(finalFence.fencingEpoch, 2);
    return {
      byteExact: true,
      candidateGeneration: candidatePin.generation,
      finalFenceEpoch: finalFence.fencingEpoch,
      priorHash: sha256(priorBytes),
      restoredHash: sha256(restoredBytes),
      servingAuthority: candidate.servingAuthority,
    };
  } finally {
    const relative = path.relative(__dirname, temporaryRoot);
    if (!relative.startsWith('.tmp-canary-') || relative.includes(path.sep)) {
      throw new Error('temporary rollback directory failed scope validation');
    }
    fs.rmSync(temporaryRoot, { recursive: true, force: true });
  }
}

function runHardBlocks(snapshot, fixture) {
  const reference = evaluateCanary(
    snapshot,
    canaryInput(fixture, fixture.cases[0]),
  ).decision;
  const negative = evaluateCanary(
    snapshot,
    canaryInput(fixture, fixture.cases[3]),
  ).decision;
  const smuggled = clone(negative);
  smuggled.defer.tool = 'mutating-tool';
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
  const recoveryArtifact = clone(reference);
  recoveryArtifact.route.clarify = { question: 'forbidden' };
  assertThrowsCode(
    () => parseRouteDecision(recoveryArtifact, snapshot.policy),
    DecisionValidationError,
    'ROUTE_RECOVERY_ARTIFACT_FORBIDDEN',
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
    rollbackGreen: true,
    routeGoldGreen: true,
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
  return {
    codes,
    directGuardCodes: {
      exactRouteRecoveryArtifact: 'ROUTE_RECOVERY_ARTIFACT_FORBIDDEN',
      negativeAuthority: 'NEGATIVE_AUTHORITY_INVALID',
      negativeTargetOrTool: 'NEGATIVE_TARGET_FORBIDDEN',
      pinnedTupleMismatch: 'PINNED_TUPLE_MISMATCH',
    },
    eligible,
  };
}

function resolveAlias(aliases, value) {
  return aliases.find((entry) => entry.alias === value)?.workflowMode || null;
}

function runDualRead(snapshot) {
  const registry = readJson(path.join(SKILL_ROOT, 'mode-registry.json'));
  const expectedCount = registry.modes.reduce((total, mode) => total + mode.aliases.length, 0);
  assert.strictEqual(snapshot.aliases.length, expectedCount);
  snapshot.aliases.forEach((entry) => {
    assert.strictEqual(resolveAlias(snapshot.aliases, entry.alias), entry.workflowMode);
  });
  assert.strictEqual(resolveAlias(snapshot.aliases, 'unmapped-legacy-alias'), null);

  const mutated = clone(registry);
  mutated.modes[0].aliases.push('alias-drift-fixture');
  const routerBytes = fs.readFileSync(path.join(SKILL_ROOT, 'hub-router.json'));
  const skillBytes = fs.readFileSync(path.join(SKILL_ROOT, 'SKILL.md'));
  const registryBytes = Buffer.from(`${JSON.stringify(mutated)}\n`, 'utf8');
  const drifted = compileRegistry({
    activationGeneration: snapshot.policy.activationGeneration,
    hubRouter: JSON.parse(routerBytes.toString('utf8')),
    registry: mutated,
    skillMarkdown: skillBytes.toString('utf8'),
    sourceBytes: {
      'SKILL.md': skillBytes,
      'hub-router.json': routerBytes,
      'mode-registry.json': registryBytes,
    },
  });
  assert.notStrictEqual(
    drifted.advisorProjection.projectionHash,
    snapshot.advisorProjection.projectionHash,
  );
  return {
    aliasCount: snapshot.aliases.length,
    projectionDriftDetected: true,
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
    /if\s*\([^)]*['"]sk-code['"]\s*(?:===|!==)/,
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

function runCanary() {
  const before = protectedHashes();
  assert.deepStrictEqual(before, PROTECTED_DIGESTS);
  const { fixture, snapshot } = loadSnapshot();
  const compiled = assertCompiledArtifacts(snapshot);
  const routes = runRouteCases(snapshot, fixture);
  const certificateGate = runCertificateGate(snapshot, fixture);
  const advisor = runAdvisorCases(snapshot, fixture);
  const documentParity = runDocumentParity(snapshot, fixture);
  const execution = runExecutionFence(snapshot, fixture);
  const rollback = runRollbackDrill(snapshot);
  const hardBlocks = runHardBlocks(snapshot, fixture);
  const dualRead = runDualRead(snapshot);
  const staticGates = runStaticGates();
  const after = protectedHashes();
  assert.deepStrictEqual(after, before);
  return {
    advisor,
    certificateGate,
    compiled,
    documentParity,
    dualRead,
    execution,
    hardBlocks,
    protectedDigests: after,
    rollback,
    routes,
    stageGate: {
      advisorIdentity: 'pass',
      certificateGate: 'pass',
      documentParity: 'pass',
      rollbackDrill: 'pass',
      routeGold: 'GREEN',
      servingAuthority: 'legacy',
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
    process.stderr.write(`[canary-validator] ${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}
