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
} = require('../../../003-contract-schemas/lib/canonical.cjs');
const POLICY_SCHEMA = require('../../../003-contract-schemas/schemas/compiled-policy.v1.schema.json');
const ADVISOR_SCHEMA = require('../../../003-contract-schemas/schemas/advisor-projection.v1.schema.json');
const CARD_SCHEMA = require('../../../003-contract-schemas/schemas/policy-card.v1.schema.json');
const TYPED_GOLD_SCHEMA = require('../../../003-contract-schemas/schemas/typed-route-gold.v1.schema.json');
const {
  atomicFencedSwap,
  fenceStateBytes,
  manifestBytes,
  pinRequest,
} = require('../../../004-compiler-n1-shadow/activation/fenced-manifest.cjs');
const { validateNode } = require('../../../004-compiler-n1-shadow/harness/json-schema.cjs');
const { parseRouteDecision } = require('../../../005-decision-evaluator/lib/decision-contract.cjs');
const { scoreRouteGoldReadOnly } = require('../../../005-decision-evaluator/replay-driver.cjs');
const {
  DestinationExecutionPlane,
  ExecutionProtocolError,
} = require('../../../006-execution-verify-commit/lib/execution-plane.cjs');
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
  // Re-pinned when the index-table cell pattern was widened to accept the markdown-link
  // file cell the playbook-authoring template now emits.
  'load-playbook-scenarios.cjs': 'c79aa057a68dba4577519e7fb207f359a15fd76154f3be1ee337f7104fa98f0f',
  'router-replay.cjs': '14f169a466d970648f46f0f312904cc682221d1adfdedef97264398ffc9124d9',
  'score-skill-benchmark.cjs': '05bf38b8e186fd760a5a9b3940fc646821bd9caa843ad7a9c67d9d4df22a5886',
});
// These attest the authored hub sources the compiler reads: the hub SKILL.md, both
// routing-stage files, and one SKILL.md per registered packet. They are a drift
// tripwire, not a freeze: a deliberate hub change refreshes them in the same commit.
// Left stale, the canary reports the hub's own edits as corruption. The key set
// mirrors what the loader collects, so adding a packet to the registry adds a row here.
const AUTHORED_DIGESTS = Object.freeze({
  'SKILL.md': '045187d22f9ed32fb257b03bc6961976592ffb4b1089db54ba2fe65c615775ab',
  'hub-router.json': '28dc39a72e1246b419a42dc2f2d5573773abd791a7f067981fe0856a803b07f7',
  'mode-registry.json': 'abeffa2eae6b929ca1c7725f9a319d9d70212103f07aead5935c5db0e7ff96f1',
  'packets/sk-create-agent/SKILL.md': '4608c64691588311b935b62aaa138b1abc9b1b0499db4b107e730c8202d77c77',
  'packets/sk-create-benchmark/SKILL.md': 'b686252ec99a6491f3f3f7d097b5af16ce03d859ece51bab63be4ae06f26ec05',
  'packets/sk-create-changelog/SKILL.md': 'b335ad104e7ea5ab58665481bc271bae68321f879229f6225ab2eedb99a89d48',
  'packets/sk-create-command/SKILL.md': '176c3c62910ef1ef7b19bb260e4b0176c2ea82d975c34da72520ade9f2f57466',
  'packets/sk-create-diagram/SKILL.md': '0799f4eef8d405be3c1831dee2f14453aa3886d171b4e21c5eeb9fad8defbc40',
  'packets/sk-create-diff/SKILL.md': '4be80d8914ef927cdc27555c17292cef8de77d155f234fc989459016d05ac396',
  'packets/sk-create-feature-catalog/SKILL.md': '5d8af117b211c7f17fbce3a4054418de459467963c387f56e8613c6fd99022b3',
  'packets/sk-create-frontmatter/SKILL.md': '5af95ced2b474ea6ab6bfdcf4858fdff1cb9c7064697cde6bacfa4fe6d902844',
  'packets/sk-create-manual-testing-playbook/SKILL.md': '4d94b23239b59fdbe4844518336dc8f08bbaacf1db97cb6e229ed0de7adbbfa7',
  'packets/sk-create-quality-control/SKILL.md': '8e7cce8a51b7aa7e4f631766f98051dc80a811be53716a093cf2bf1d9697c741',
  'packets/sk-create-readme/SKILL.md': 'fa3c29373cd479e4845c4fc1ae9bfe02164ac2dd186cfd3590960b50e6679fc1',
  'packets/sk-create-repo-rule/SKILL.md': '91b4f703076a71236a81576d2d04ef5ebeeef0af092ab5ea46cc1913a3a552f0',
  'packets/sk-create-skill/SKILL.md': '844e2748234466aec72c5a9dfaacbb6b074cee158de13173b7d3813008355e35',
  'packets/sk-create-with-human-voice/SKILL.md': '35dd7cd811aacc6dcbf4aa1b2c48a6ee62704fde680e0424c6389b166aa21dcf',
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
  // These track the hub's live topology, so registering or withdrawing a mode
  // refreshes them in the same change. The invariant they encode is the gap between
  // the two counts: every mode gets its own identity tuple, and modes outnumber
  // packets because one packet backs more than one mode.
  assert.strictEqual(snapshot.policy.destinations.length, 15);
  assert.strictEqual(snapshot.projectionGraph.rows.length, 15);
  assert.strictEqual(new Set(snapshot.projectionGraph.rows.map((row) => canonicalize(row.identityTuple))).size, 15);
  assert.strictEqual(new Set(snapshot.projectionGraph.rows.map((row) => row.packetRef)).size, 14);
  assert.strictEqual(snapshot.policy.compositionRules.length, 5);
  assert.deepStrictEqual(snapshot.routingModel.bundleRules[0].targetWorkflowModes, [
    'sk-create-skill',
    'sk-create-quality-control',
  ]);
  assert.strictEqual(snapshot.routingModel.defaultMode, null);
  assert.strictEqual(snapshot.routingModel.ambiguityDelta, 1);
  assert.ok(snapshot.policy.destinations.every((destination) => (
    destination.role === 'actor' && destination.mutatesWorkspace === true
  )));
  return {
    byteIdenticalRecompile: true,
    destinationCount: 15,
    distinctPacketCount: 14,
    orderedBundleRules: 5,
    schemaValidation: 'pass',
  };
}

// A registered mode with no fixture case of its own is unreachable evidence: the
// suite still passes while nothing ever proves that mode routes. Deriving the
// expected set from the live registry rather than a written list is what makes
// registering a mode without covering it fail here instead of going unnoticed.
// Coverage counts only a case that actually resolved to a lone target, so a
// fixture cannot claim a mode it does not really reach.
function assertSingleRouteCoverage(rows) {
  const registry = readJson(path.join(SKILL_ROOT, 'mode-registry.json'));
  const covered = new Set(rows
    .filter((row) => row.action === 'route' && row.selectionKind === 'single' && row.targets.length === 1)
    .map((row) => row.targets[0]));
  const uncovered = registry.modes
    .map((mode) => mode.workflowMode)
    .filter((workflowMode) => !covered.has(workflowMode));
  assert.deepStrictEqual(
    uncovered,
    [],
    `every registered mode needs a single-route case; uncovered: ${uncovered.join(', ')}`,
  );
  return registry.modes.length;
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
    modesWithSingleRouteCase: assertSingleRouteCoverage(rows),
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
    { id: 'qualified-explicit', prompt: 'unrelated', explicitMode: 'sk-doc/sk-create-readme' },
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
    router.routerPolicy.defaultMode = 'sk-create-readme';
  });
  assert.deepStrictEqual(targetModes(evaluateCanary(defaulted, { prompt: 'unrelated orchard inventory' }).decision), [
    'sk-create-readme',
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
    router.routerSignals['sk-create-readme'].resources = ['invented/SKILL.md'];
  }), (error) => assertCode(error, 'ROUTER_RESOURCE_MISMATCH'));
  const live = sourceBytes();
  const parsedRouter = JSON.parse(live['hub-router.json'].toString('utf8'));
  parsedRouter.routerPolicy.defaultMode = 'sk-create-readme';
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
