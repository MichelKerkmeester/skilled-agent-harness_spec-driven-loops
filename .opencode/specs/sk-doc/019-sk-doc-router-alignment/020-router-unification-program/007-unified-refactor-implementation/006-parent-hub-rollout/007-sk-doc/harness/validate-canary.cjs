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
const { validateNode } = require('../../../001-compiler-n1-shadow/harness/json-schema.cjs');
const { parseRouteDecision } = require('../../../002-decision-evaluator/lib/decision-contract.cjs');
const { scoreRouteGoldReadOnly } = require('../../../002-decision-evaluator/replay-driver.cjs');
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
const { evaluateCanary } = require('../lib/router.cjs');
const {
  generatePolicyCard,
  replayPolicyCard,
} = require('../lib/policy-card.cjs');
const {
  buildArtifacts,
  compiledLeafPairsForDecision,
  compatibilityProjection,
  loadSnapshot,
  sourceBytes,
} = require('./build-artifacts.cjs');

const CHILD_ROOT = path.resolve(__dirname, '..');

function findRepoRoot(start) {
  let current = path.resolve(start);
  for (;;) {
    if (fs.existsSync(path.join(current, '.opencode', 'skills'))) return current;
    const parent = path.dirname(current);
    if (parent === current) throw new Error('repository root could not be resolved');
    current = parent;
  }
}

const REPO_ROOT = findRepoRoot(CHILD_ROOT);
const SKILL_ROOT = path.join(REPO_ROOT, '.opencode', 'skills', 'sk-doc');
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
const AUTHORED_DIGESTS = Object.freeze({
  'SKILL.md': 'e55025662c63a03efb1a19e7bb5f65b19989f95c8d00cab372541f77b5008326',
  'hub-router.json': '8b9afa6284f58267ee935d45c60073bc5931dea53bdfacdfc018a450c3e42dd5',
  'mode-registry.json': '73cffcba5f34cd36e0da91441e9ec587cfa8152c54d3a2334f7060c931f9fb83',
  'packets/create-agent/SKILL.md': 'b0f966cc5de86476e52a4811742a379bdacbff302fa5459848946e8cced5dc10',
  'packets/create-benchmark/SKILL.md': '5076dc7e384365af61f73e9362d38d2d68fd1d1adde72eac1c621ce76b284182',
  'packets/create-changelog/SKILL.md': 'e1f5c688f56a1d3b704040d420615ac8fc1c678f3203361849e369ea9b8cdc06',
  'packets/create-command/SKILL.md': 'c19402ac970fbc6c627c0a7231f69c2dee0381d595bebdbe45a2f7eca7076427',
  'packets/create-diff/SKILL.md': '10315765c6654537ad3a4c9b7249356c62f57d78e6bd7d45fe3996bd20782e2e',
  'packets/create-feature-catalog/SKILL.md': '54cf621b8bc9706711ac1bb11b6026e804fd899e566f9f5b8a58a8a236a927cb',
  'packets/create-flowchart/SKILL.md': 'a6d84d58d8c70c82438b5b5b83266fa3c13565f390abdc0b149eadc54d75cfdf',
  'packets/create-manual-testing-playbook/SKILL.md': '1e613e102c291e9f32d1c829be474a5aa45dc06d0e27c942aa03a06091c360c7',
  'packets/create-quality-control/SKILL.md': 'c949849f047f7594e253cfe25ed3faeeb7a0e9944f1fcd3086f51891f799cf50',
  'packets/create-readme/SKILL.md': 'b263d54480d9733b4fa7dd14e940e3b559a0a012fed11a5a7dcb45568fc24d8e',
  'packets/create-skill/SKILL.md': 'ac47ee5b6efea4013cecce4d8e1753942c9b64db6dba181452c9acd9f5d43acc',
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

function authoredHashes() {
  const bytes = sourceBytes();
  return Object.fromEntries(Object.keys(AUTHORED_DIGESTS).map((name) => [name, sha256(bytes[name])]));
}

function schemaErrors(schema, value) {
  return validateNode(schema, value, schema, '$');
}

function assertCode(error, code) {
  return Boolean(error && error.code === code);
}

function assertThrowsCode(operation, ErrorType, code) {
  assert.throws(operation, (error) => error instanceof ErrorType && assertCode(error, code), code);
}

function targetModes(decision) {
  return decision.action === 'route'
    ? decision.route.targets.map((target) => target.destinationId.workflowMode)
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
    source: { featureFile: 'real-sk-doc-canary', shape: 'sk-doc' },
  };
}

function compileWithRouter(snapshot, mutate) {
  const bytes = sourceBytes();
  const router = JSON.parse(bytes['hub-router.json'].toString('utf8'));
  mutate(router);
  bytes['hub-router.json'] = Buffer.from(`${JSON.stringify(router, null, 2)}\n`, 'utf8');
  return compileRegistry({
    activationGeneration: snapshot.policy.activationGeneration,
    hubRouter: router,
    registry: JSON.parse(bytes['mode-registry.json'].toString('utf8')),
    skillMarkdown: bytes['SKILL.md'].toString('utf8'),
    sourceBytes: bytes,
  });
}

function assertCompiled(snapshot) {
  const second = loadSnapshot().snapshot;
  assert.ok(artifactBytes(snapshot.policy).equals(artifactBytes(second.policy)));
  assert.ok(artifactBytes(snapshot.policy).equals(fs.readFileSync(path.join(CHILD_ROOT, 'compiled', 'policy.json'))));
  assert.strictEqual(computeBasePolicyHash(snapshot.policy), snapshot.policy.basePolicyHash);
  assert.deepStrictEqual(schemaErrors(POLICY_SCHEMA, snapshot.policy), []);
  assert.deepStrictEqual(schemaErrors(ADVISOR_SCHEMA, snapshot.advisorProjection), []);
  assert.deepStrictEqual(
    readJson(path.join(CHILD_ROOT, 'compiled', 'projection-graph.json')),
    snapshot.projectionGraph,
  );
  const card = generatePolicyCard(snapshot);
  assert.deepStrictEqual(schemaErrors(CARD_SCHEMA, card.frontmatter), []);
  assert.strictEqual(
    fs.readFileSync(path.join(CHILD_ROOT, 'compiled', 'PolicyCardV1.md'), 'utf8'),
    card.markdown,
  );
  const typed = readJson(path.join(CHILD_ROOT, 'compiled', 'route-gold.typed.json'));
  typed.cases.forEach((row) => {
    assert.deepStrictEqual(schemaErrors(TYPED_GOLD_SCHEMA, row), []);
    assert.strictEqual(computeProjectionHash('TypedRouteGoldV1', row), row.projectionHash);
  });
  assert.strictEqual(snapshot.policy.destinations.length, 12);
  assert.strictEqual(snapshot.projectionGraph.rows.length, 12);
  assert.strictEqual(new Set(snapshot.projectionGraph.rows.map((row) => canonicalize(row.identityTuple))).size, 12);
  assert.strictEqual(new Set(snapshot.projectionGraph.rows.map((row) => row.packetRef)).size, 11);
  assert.strictEqual(snapshot.policy.compositionRules.length, 1);
  assert.deepStrictEqual(snapshot.routingModel.bundleRules[0].targetWorkflowModes, [
    'create-quality-control',
    'create-skill',
  ]);
  assert.strictEqual(snapshot.routingModel.defaultMode, null);
  assert.strictEqual(snapshot.routingModel.ambiguityDelta, 1);
  assert.ok(snapshot.policy.destinations.every((destination) => (
    destination.role === 'actor' && destination.mutatesWorkspace === true
  )));
  return {
    byteIdenticalRecompile: true,
    destinationCount: 12,
    distinctPacketCount: 11,
    orderedBundleRules: 1,
    schemaValidation: 'pass',
  };
}

function runRouteCases(snapshot, fixture) {
  const rows = [];
  const scorerInputs = [];
  for (const entry of fixture.cases) {
    const evaluated = evaluateCanary(snapshot, entry);
    const decision = evaluated.decision;
    assert.strictEqual(decision.action, entry.expectedAction, `${entry.id} action`);
    if (entry.expectedSelectionKind) {
      assert.strictEqual(decision.route.selectionKind, entry.expectedSelectionKind, `${entry.id} selection`);
      assert.deepStrictEqual(targetModes(decision), entry.expectedModes, `${entry.id} modes`);
    }
    if (entry.expectedReason) assert.strictEqual(decision[decision.action].reason, entry.expectedReason);
    if (decision.action !== 'route') {
      assert.strictEqual(Object.prototype.hasOwnProperty.call(decision[decision.action], 'targets'), false);
      assert.strictEqual(decision[decision.action].authority, 'Withheld');
      assert.strictEqual(Object.prototype.hasOwnProperty.call(decision[decision.action], 'authorityRef'), false);
    }
    if (decision.action === 'clarify') {
      assert.ok(decision.clarify.alternatives.length <= 4);
      assert.strictEqual(decision.clarify.alternatives.at(-1), 'none_of_these');
    }
    const pairs = compiledLeafPairsForDecision(snapshot, decision);
    const observed = compatibilityProjection(snapshot, decision, pairs);
    scorerInputs.push({ observed, scenario: scorerScenario(entry) });
    rows.push({
      action: decision.action,
      id: entry.id,
      observed,
      selectionKind: decision.route?.selectionKind || null,
      targets: targetModes(decision),
    });
  }
  const scorer = scoreRouteGoldReadOnly(scorerInputs);
  assert.strictEqual(scorer.writeBackAttempted, false);
  scorer.verdicts.forEach((verdict, index) => {
    assert.strictEqual(verdict.pass, true, `${fixture.cases[index].id} real scorer mismatch`);
    rows[index].realEvaluateRouteGoldPass = verdict.pass;
  });
  const positiveIndex = fixture.cases.findIndex((entry) => entry.expectedAction === 'route');
  const corrupted = clone(scorerInputs[positiveIndex]);
  corrupted.observed.observedResources = ['corrupted-compiled-observation'];
  assert.strictEqual(scoreRouteGoldReadOnly([corrupted]).verdicts[0].pass, false);
  return {
    falsifierRejected: true,
    realEvaluateRouteGoldRows: scorer.verdicts.length,
    realGreenRows: scorer.verdicts.filter((row) => row.pass).length,
    rows,
    scorerSource: 'real-read-only-evaluateRouteGold',
    writeBackAttempted: scorer.writeBackAttempted,
  };
}

function scoreDelivered(snapshot, fixture) {
  const typedPath = path.join(CHILD_ROOT, 'compiled', 'route-gold.typed.json');
  const acceptance = readJson(path.join(CHILD_ROOT, 'activation', 'acceptance.json'));
  const typedBytes = fs.readFileSync(typedPath);
  assert.strictEqual(sha256(typedBytes), acceptance.candidateArtifacts['route-gold.typed.json']);
  const typed = JSON.parse(typedBytes.toString('utf8'));
  assert.strictEqual(typed.cases.length, fixture.cases.length);
  const byId = new Map(fixture.cases.map((entry) => [entry.id, entry]));
  const inputs = typed.cases.map((row) => {
    assert.deepStrictEqual(schemaErrors(TYPED_GOLD_SCHEMA, row), []);
    assert.strictEqual(computeProjectionHash('TypedRouteGoldV1', row), row.projectionHash);
    return {
      observed: {
        observedIntents: row.observedIntents,
        observedResources: row.observedResources.map((resource) => resource.resource),
      },
      scenario: scorerScenario(byId.get(row.scenarioId)),
    };
  });
  const scored = scoreRouteGoldReadOnly(inputs);
  assert.ok(scored.verdicts.every((verdict) => verdict.pass));
  assert.strictEqual(scored.writeBackAttempted, false);
  return {
    acceptanceDigestBound: true,
    projectionHashesBound: true,
    realGreenRows: scored.verdicts.length,
    scorerSource: 'real-read-only-evaluateRouteGold',
    writeBackAttempted: scored.writeBackAttempted,
  };
}

function runDocumentParity(snapshot, fixture) {
  const card = fs.readFileSync(path.join(CHILD_ROOT, 'compiled', 'PolicyCardV1.md'), 'utf8');
  const cases = [
    ...fixture.cases,
    { id: 'qualified-explicit', prompt: 'unrelated', explicitMode: 'sk-doc/create-readme' },
    { id: 'dependency-defer', prompt: '/create:readme', constraints: ['dependency-failure'] },
  ];
  const rows = cases.map((entry) => {
    const machine = evaluateCanary(snapshot, entry).decision;
    const document = replayPolicyCard(card, entry);
    assert.strictEqual(canonicalize(document.decision), canonicalize(machine));
    assert.strictEqual(document.terminal, 'DOCUMENT_ONLY_UNATTESTED');
    if (machine.action === 'route') assert.strictEqual(document.draftStatus, 'PREPARED_DRAFT');
    return { action: machine.action, id: entry.id };
  });
  return { rows, terminal: 'DOCUMENT_ONLY_UNATTESTED' };
}

function runAdvisorCases(snapshot, fixture) {
  const base = fixture.cases[0];
  const baseline = evaluateCanary(snapshot, base).decision;
  const rows = fixture.advisorCases.map((entry) => {
    const result = evaluateCanary(snapshot, {
      advisor: {
        effectivePolicyHash: snapshot.policy.effectivePolicyHash,
        hubId: snapshot.advisorProjection.hubId,
        projectionHash: entry.projectionDrift ? '0'.repeat(64) : snapshot.advisorProjection.projectionHash,
        rankScore: '99',
        scoreMargin: '98',
        trust: entry.trust,
      },
      prompt: base.prompt,
    });
    assert.strictEqual(result.advisorDisposition.contributes, entry.expectedContribution);
    assert.strictEqual(canonicalize(result.decision), canonicalize(baseline));
    return { contributes: result.advisorDisposition.contributes, id: entry.id };
  });
  return { rows };
}

function runAuthoredFalsifiers(snapshot, fixture) {
  const defaulted = compileWithRouter(snapshot, (router) => {
    router.routerPolicy.defaultMode = 'create-readme';
  });
  assert.deepStrictEqual(targetModes(evaluateCanary(defaulted, { prompt: 'unrelated orchard inventory' }).decision), [
    'create-readme',
  ]);
  const strictDelta = compileWithRouter(snapshot, (router) => {
    router.routerPolicy.ambiguityDelta = 0;
  });
  const gapOne = { prompt: 'readme benchmark package' };
  assert.strictEqual(evaluateCanary(snapshot, gapOne).decision.action, 'clarify');
  assert.strictEqual(evaluateCanary(strictDelta, gapOne).decision.action, 'route');
  assert.throws(() => compileWithRouter(snapshot, (router) => {
    router.routerPolicy.tieBreak = router.routerPolicy.tieBreak.slice(1);
  }), (error) => assertCode(error, 'TIE_BREAK_INVALID'));
  assert.throws(() => compileWithRouter(snapshot, (router) => {
    router.routerPolicy.bundleRules[0].outcome = 'single';
  }), (error) => assertCode(error, 'BUNDLE_RULE_INVALID'));
  assert.throws(() => compileWithRouter(snapshot, (router) => {
    router.routerSignals['create-readme'].resources = ['invented/SKILL.md'];
  }), (error) => assertCode(error, 'ROUTER_RESOURCE_MISMATCH'));
  const live = sourceBytes();
  const parsedRouter = JSON.parse(live['hub-router.json'].toString('utf8'));
  parsedRouter.routerPolicy.defaultMode = 'create-readme';
  assert.throws(() => compileRegistry({
    activationGeneration: snapshot.policy.activationGeneration,
    hubRouter: parsedRouter,
    registry: JSON.parse(live['mode-registry.json'].toString('utf8')),
    skillMarkdown: live['SKILL.md'].toString('utf8'),
    sourceBytes: live,
  }), (error) => assertCode(error, 'AUTHORED_SOURCE_IDENTITY_MISMATCH'));
  return {
    ambiguityDeltaAuthored: true,
    bundleRuleGuard: true,
    defaultModeAuthored: true,
    resourceGuard: true,
    sourceIdentityGuard: true,
    tieBreakGuard: true,
  };
}

function verifyAcceptance(acceptance) {
  for (const [name, expected] of Object.entries(acceptance.candidateArtifacts)) {
    if (fileHash(path.join(CHILD_ROOT, 'compiled', name)) !== expected) {
      throw new CanaryActivationError('ACCEPTANCE_ARTIFACT_HASH_MISMATCH', `${name} digest mismatch`);
    }
  }
  if (fileHash(path.join(CHILD_ROOT, 'activation', 'manifest.prior.json')) !== acceptance.priorManifestHash) {
    throw new CanaryActivationError('ACCEPTANCE_PRIOR_HASH_MISMATCH', 'prior digest mismatch');
  }
}

function runRollback(snapshot) {
  const activationRoot = path.join(CHILD_ROOT, 'activation');
  const acceptance = readJson(path.join(activationRoot, 'acceptance.json'));
  verifyAcceptance(acceptance);
  const tampered = clone(acceptance);
  tampered.candidateArtifacts['policy.json'] = '0'.repeat(64);
  assertThrowsCode(
    () => verifyAcceptance(tampered),
    CanaryActivationError,
    'ACCEPTANCE_ARTIFACT_HASH_MISMATCH',
  );
  const priorBytes = fs.readFileSync(path.join(activationRoot, 'manifest.prior.json'));
  const candidate = readJson(path.join(activationRoot, 'manifest.candidate.json'));
  const temporaryRoot = fs.mkdtempSync(path.join(__dirname, '.tmp-canary-'));
  const manifestPath = path.join(temporaryRoot, 'manifest.json');
  const fencePath = path.join(temporaryRoot, 'fence-state.json');
  try {
    fs.writeFileSync(manifestPath, priorBytes);
    fs.writeFileSync(fencePath, fenceStateBytes(0));
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
    const restored = fs.readFileSync(manifestPath);
    assert.ok(restored.equals(priorBytes));
    assert.strictEqual(readJson(fencePath).fencingEpoch, 2);
    return {
      byteExact: true,
      finalFenceEpoch: 2,
      priorHash: sha256(priorBytes),
      restoredHash: sha256(restored),
    };
  } finally {
    const relative = path.relative(__dirname, temporaryRoot);
    if (!relative.startsWith('.tmp-canary-') || relative.includes(path.sep)) {
      throw new Error('temporary rollback directory failed scope validation');
    }
    fs.rmSync(temporaryRoot, { force: true, recursive: true });
  }
}

function runAuthority(snapshot, fixture) {
  const evaluated = evaluateCanary(snapshot, fixture.cases[0]);
  const registryHash = snapshot.sourceHashes.find((entry) => (
    entry.sourceId === 'mode-registry.json'
  )).hash;
  const context = {
    authorityClass: 'workspace-mutation',
    effectivePolicyHash: snapshot.policy.effectivePolicyHash,
    epoch: snapshot.policy.activationGeneration,
    expiresAtEpoch: snapshot.policy.activationGeneration + 5,
    preconditions: ['actor-only-commit'],
    readSet: [{ digest: registryHash, resourceId: 'registry-source.v1' }],
    registryAuthorityHash: registryHash,
    requestFactsHash: evaluated.request.requestFactsHash,
  };
  const plane = new DestinationExecutionPlane({ planningEpoch: context.epoch });
  const prepared = plane.prepare(evaluated.decision, context);
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
  const options = {
    retentionUntilEpoch: context.expiresAtEpoch,
    timestamp: '2026-07-19T00:00:00.000Z',
  };
  assertThrowsCode(
    () => commitActor(plane, leg, {}, adapter, options),
    ExecutionProtocolError,
    'COMMIT_WITHOUT_READY',
  );
  const ready = plane.verify(leg, {
    ...context,
    currentEpoch: context.epoch,
    orderedTargets: leg.orderedTargets,
  }, adapter);
  const committed = commitActor(plane, leg, ready, adapter, options);
  assert.deepStrictEqual(committed.protocolPath, ['PREPARE', 'VERIFY', 'COMMIT']);
  assert.strictEqual(effects.count, 1);
  for (const field of HARD_BLOCKS.map(([name]) => name)) {
    assert.throws(() => assertActivationEligible({
      defaultModeGreen: true,
      documentParityGreen: true,
      orderedBundleGreen: true,
      rollbackGreen: true,
      routeGoldGreen: true,
      routerClosureGreen: true,
      [field]: true,
    }), CanaryActivationError);
  }
  const eligible = assertActivationEligible({
    defaultModeGreen: true,
    documentParityGreen: true,
    orderedBundleGreen: true,
    rollbackGreen: true,
    routeGoldGreen: true,
    routerClosureGreen: true,
  });
  assert.deepStrictEqual(eligible, { eligible: true, servingAuthority: 'legacy', shadowOnly: true });
  return {
    actorCommitAfterVerify: true,
    commitPath: committed.protocolPath,
    hardBlocks: HARD_BLOCKS.length,
    shadowOnly: true,
  };
}

function validateCanary() {
  const protectedBefore = protectedHashes();
  const authoredBefore = authoredHashes();
  assert.deepStrictEqual(protectedBefore, PROTECTED_DIGESTS);
  assert.deepStrictEqual(authoredBefore, AUTHORED_DIGESTS);
  const buildOne = buildArtifacts();
  const firstArtifacts = Object.fromEntries(
    fs.readdirSync(path.join(CHILD_ROOT, 'compiled')).sort().map((name) => (
      [name, fs.readFileSync(path.join(CHILD_ROOT, 'compiled', name))]
    )),
  );
  const buildTwo = buildArtifacts();
  for (const [name, bytes] of Object.entries(firstArtifacts)) {
    assert.ok(bytes.equals(fs.readFileSync(path.join(CHILD_ROOT, 'compiled', name))), `${name} changed`);
  }
  assert.strictEqual(canonicalize(buildOne), canonicalize(buildTwo));
  const { fixture, snapshot } = loadSnapshot();
  const compiled = assertCompiled(snapshot);
  const routeGold = runRouteCases(snapshot, fixture);
  const deliveredRouteGold = scoreDelivered(snapshot, fixture);
  const documentParity = runDocumentParity(snapshot, fixture);
  const advisor = runAdvisorCases(snapshot, fixture);
  const falsifiers = runAuthoredFalsifiers(snapshot, fixture);
  const rollback = runRollback(snapshot);
  const authority = runAuthority(snapshot, fixture);
  const protectedAfter = protectedHashes();
  const authoredAfter = authoredHashes();
  assert.deepStrictEqual(protectedAfter, protectedBefore);
  assert.deepStrictEqual(authoredAfter, authoredBefore);
  return {
    advisor,
    archetype: {
      ambiguityDelta: snapshot.routingModel.ambiguityDelta,
      bundleRules: snapshot.routingModel.bundleRules.map((rule) => rule.targetWorkflowModes),
      defaultMode: snapshot.routingModel.defaultMode,
      modes: snapshot.routingModel.tieBreak.length,
      outcomes: Object.keys(snapshot.routingModel.outcomes),
    },
    authority,
    compiled,
    deliveredRouteGold,
    documentParity,
    falsifiers,
    protectedScorerSha256: protectedAfter,
    rollback,
    routeGold,
    status: 'REAL-GREEN',
  };
}

module.exports = { validateCanary };

if (require.main === module) {
  try {
    process.stdout.write(`${canonicalize(validateCanary())}\n`);
  } catch (error) {
    process.stderr.write(`CANARY_RED ${error.code || error.name}: ${error.message}\n`);
    process.exitCode = 1;
  }
}
