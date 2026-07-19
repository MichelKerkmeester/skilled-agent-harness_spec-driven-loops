'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const {
  canonicalBytes,
  canonicalize,
  computeBasePolicyHash,
  computeEffectivePolicyHash,
  computeProjectionHash,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  compareUtf16,
  compile,
  deriveDegeneracy,
  projectAdvisor,
  validateReferenceClosure,
} = require('../../../001-compiler-n1-shadow/compiler/index.cjs');
const {
  fencedSwapInMemory,
  fenceStateBytes,
  manifestBytes,
  pinManifest,
  validateActivationManifest,
} = require('../activation/fenced-manifest.cjs');
const { runShadowParity } = require('../parity/shadow-parity.cjs');
const { assertSchema } = require('../../../001-compiler-n1-shadow/harness/json-schema.cjs');
const {
  BASE_ROOT,
  BENCHMARK_ROOT,
  CONTRACT_ROOT,
  PHASE_ROOT,
  REPO_ROOT,
  SKILL_ROOT,
  canonicalJsonBytes,
  evaluateTargetPolicy,
  generateTargetPolicyCard,
  hashTree,
  loadAuthoredSources,
  projectLegacyObservation,
  projectTargetTypedGold,
  readJson,
  replayTargetPolicyCard,
  sha256Bytes,
  sha256File,
  walkFiles,
} = require('./support.cjs');

const ACTIVATION_ROOT = path.join(PHASE_ROOT, 'activation');
const PROTECTED_REPLAY_PATH = path.join(PHASE_ROOT, 'harness', 'protected-replay.cjs');
const PROTECTED_DIGESTS = Object.freeze({
  'load-playbook-scenarios.cjs': '5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029',
  'router-replay.cjs': 'd5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47',
  'score-skill-benchmark.cjs': 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
});
const DEFAULT_RESOURCE = 'references/workflows/quick-reference.md';
const FIXTURE_SCENARIOS = Object.freeze([
  {
    expectedIntent: 'PLAN',
    expectedIntents: ['PLAN'],
    expectedResources: [
      'assets/complexity-decision-matrix.md',
      'assets/level-decision-matrix.md',
      'references/templates/template-guide.md',
      'references/validation/template-compliance-contract.md',
      'references/workflows/intake-contract.md',
      DEFAULT_RESOURCE,
    ],
    fileName: 'exact-single-route.json',
    scenarioId: 'exact-single-route',
    taskText: 'plan a new spec',
  },
  {
    expectedIntent: 'defer',
    expectedIntents: [],
    expectedResources: [DEFAULT_RESOURCE],
    fileName: 'authored-default-route.json',
    scenarioId: 'authored-default-route',
    taskText: 'write a haiku about rain',
  },
  {
    expectedIntent: 'defer',
    expectedIntents: [],
    expectedResources: [],
    fileName: 'one-turn-clarify.json',
    scenarioId: 'one-turn-clarify',
    taskText: 'done memory',
  },
  {
    expectedIntent: 'defer',
    expectedIntents: [],
    expectedResources: [],
    fileName: 'forbidden-reject.json',
    scenarioId: 'forbidden-reject',
    taskText: 'claim done without checklist verification',
  },
  {
    expectedIntent: 'HOOKS',
    expectedIntents: ['HOOKS'],
    expectedResources: [
      'references/config/hook-system.md',
      'references/hooks/goal-plugin.md',
      'references/hooks/skill-advisor-hook-validation.md',
      'references/hooks/skill-advisor-hook.md',
      DEFAULT_RESOURCE,
    ],
    fileName: 'singular-omission-zero-rank.json',
    scenarioId: 'singular-omission-zero-rank',
    taskText: 'skill advisor hook',
  },
]);

function evaluateFixtures(policy, authoredSources) {
  return FIXTURE_SCENARIOS.map((scenario) => {
    const evaluation = evaluateTargetPolicy(policy, authoredSources, {
      taskText: scenario.taskText,
    });
    return {
      ...scenario,
      evaluation,
      typedGold: projectTargetTypedGold(policy, scenario.scenarioId, evaluation),
    };
  });
}

function buildArtifacts() {
  const authoredSources = loadAuthoredSources();
  const policy = compile(authoredSources);
  const advisor = projectAdvisor(policy, authoredSources);
  const card = generateTargetPolicyCard(policy, authoredSources);
  const fixtures = evaluateFixtures(policy, authoredSources);
  const priorManifest = {
    schemaVersion: 'V1',
    selectedPolicy: { effectivePolicyHash: null, generation: 0 },
    servingAuthority: 'legacy',
    shadowOnly: true,
  };
  const candidateManifest = {
    schemaVersion: 'V1',
    selectedPolicy: {
      effectivePolicyHash: policy.effectivePolicyHash,
      generation: policy.activationGeneration,
    },
    servingAuthority: 'legacy',
    shadowOnly: true,
  };
  const artifacts = new Map([
    ['compiled/system-spec-kit/policy.json', canonicalJsonBytes(policy)],
    ['compiled/system-spec-kit/advisor-projection.json', canonicalJsonBytes(advisor)],
    ['compiled/system-spec-kit/route-gold.typed.json', canonicalJsonBytes(fixtures[0].typedGold)],
    ['compiled/system-spec-kit/policy-card.md', Buffer.from(card.markdown, 'utf8')],
    ['activation/manifest.prior.json', manifestBytes(priorManifest)],
    ['activation/manifest.json', manifestBytes(priorManifest)],
    ['activation/manifest.candidate.json', manifestBytes(candidateManifest)],
    ['activation/fence-state.json', fenceStateBytes(0)],
  ]);
  fixtures.forEach((fixture) => {
    artifacts.set(
      `compiled/system-spec-kit/fixtures/${fixture.fileName}`,
      canonicalJsonBytes(fixture.typedGold),
    );
  });
  return {
    advisor,
    artifacts,
    authoredSources,
    candidateManifest,
    card,
    fixtures,
    policy,
    priorManifest,
  };
}

function writeArtifacts() {
  const generated = buildArtifacts();
  generated.artifacts.forEach((bytes, relativePath) => {
    const filePath = path.join(PHASE_ROOT, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, bytes, { mode: 0o600 });
  });
}

function assertArtifactSet(expectedArtifacts) {
  expectedArtifacts.forEach((expectedBytes, relativePath) => {
    const filePath = path.join(PHASE_ROOT, relativePath);
    assert.ok(fs.existsSync(filePath), `missing generated artifact: ${relativePath}`);
    assert.ok(
      fs.readFileSync(filePath).equals(expectedBytes),
      `generated artifact differs from checked bytes: ${relativePath}`,
    );
  });
  return expectedArtifacts.size;
}

function assertArtifactMapsEqual(left, right) {
  assert.equal(left.size, right.size);
  left.forEach((bytes, relativePath) => {
    assert.ok(right.has(relativePath), `second build omitted ${relativePath}`);
    assert.ok(bytes.equals(right.get(relativePath)), `second build changed ${relativePath}`);
  });
}

function runProtectedReplay(action, items) {
  const result = spawnSync(process.execPath, [PROTECTED_REPLAY_PATH], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    input: JSON.stringify({ action, items }),
    maxBuffer: 4 * 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

function loadSchemas() {
  const root = path.join(CONTRACT_ROOT, 'schemas');
  return {
    advisor: readJson(path.join(root, 'advisor-projection.v1.schema.json')),
    card: readJson(path.join(root, 'policy-card.v1.schema.json')),
    decision: readJson(path.join(root, 'route-decision.v1.schema.json')),
    policy: readJson(path.join(root, 'compiled-policy.v1.schema.json')),
    typedGold: readJson(path.join(root, 'typed-route-gold.v1.schema.json')),
  };
}

function verifyDeterminism(generated) {
  const builds = [buildArtifacts(), buildArtifacts()];
  builds.forEach((candidate) => assertArtifactMapsEqual(generated.artifacts, candidate.artifacts));
  const policies = [
    generated.policy,
    compile(generated.authoredSources),
    compile(generated.authoredSources),
  ];
  const bodyHashes = policies.map((policy) => sha256Bytes(canonicalBytes(policy)));
  const effectiveHashes = policies.map((policy) => policy.effectivePolicyHash);
  assert.equal(new Set(bodyHashes).size, 1);
  assert.equal(new Set(effectiveHashes).size, 1);
  const processes = [0, 1].map(() => spawnSync(
    process.execPath,
    [path.join(PHASE_ROOT, 'harness', 'fingerprint.cjs')],
    { cwd: REPO_ROOT, encoding: 'utf8' },
  ));
  processes.forEach((result) => assert.equal(result.status, 0, result.stderr));
  const fingerprints = processes.map((result) => JSON.parse(result.stdout));
  fingerprints.forEach((fingerprint) => {
    assert.equal(fingerprint.bodySha256, bodyHashes[0]);
    assert.equal(fingerprint.effectivePolicyHash, effectiveHashes[0]);
  });
  return { bodyHash: bodyHashes[0], effectiveHash: effectiveHashes[0] };
}

function verifySchemas(generated) {
  const schemas = loadSchemas();
  assertSchema(schemas.policy, generated.policy, 'policy');
  validateReferenceClosure(generated.policy);
  assert.equal(computeBasePolicyHash(generated.policy), generated.policy.basePolicyHash);
  assert.equal(
    computeEffectivePolicyHash(generated.policy),
    generated.policy.effectivePolicyHash,
  );
  assertSchema(schemas.advisor, generated.advisor, 'advisor projection');
  assert.equal(
    computeProjectionHash('AdvisorProjectionV1', generated.advisor),
    generated.advisor.projectionHash,
  );
  assertSchema(schemas.card, generated.card.frontmatter, 'policy card front matter');
  assert.equal(
    computeProjectionHash('PolicyCardV1', generated.card.frontmatter, 'humanViewHash'),
    generated.card.frontmatter.humanViewHash,
  );
  generated.fixtures.forEach((fixture) => {
    assertSchema(schemas.decision, fixture.evaluation.decision, `${fixture.scenarioId} decision`);
    assertSchema(schemas.typedGold, fixture.typedGold, `${fixture.scenarioId} typed gold`);
    assert.equal(
      computeProjectionHash('TypedRouteGoldV1', fixture.typedGold),
      fixture.typedGold.projectionHash,
    );
  });
}

function verifyClosedAlgebra(generated) {
  const { authoredSources, fixtures, policy } = generated;
  const view = deriveDegeneracy(policy, authoredSources);
  assert.equal(view.candidateCount, 1);
  assert.deepEqual(view.selectionKinds, ['single']);
  assert.deepEqual(view.crossTargetEdges, []);
  assert.deepEqual(view.bundleRules, []);
  assert.deepEqual(view.handoffEdges, []);
  assert.equal(view.overlay, null);
  assert.equal(view.P, 'static');
  assert.equal(policy.destinations[0].id.skillId, 'system-spec-kit');
  assert.equal(policy.destinations[0].id.workflowMode, 'system-spec-kit');
  assert.equal(policy.detectors.filter((detector) => detector.kind === 'resource').length, 48);
  assert.equal(policy.selectors.length, 17);
  assert.equal(authoredSources.defaultResource, DEFAULT_RESOURCE);
  assert.ok(authoredSources.negativeAdmissions.includes('claim done without checklist verification'));

  const leafSet = new Set(authoredSources.leaves.map((leaf) => leaf.resource));
  authoredSources.intentSignals.forEach((signal) => {
    signal.resources.forEach((resource) => assert.ok(leafSet.has(resource), resource));
  });
  assert.ok(leafSet.has(authoredSources.defaultResource));

  const fixtureMap = new Map(fixtures.map((fixture) => [fixture.scenarioId, fixture]));
  const boundedDefault = fixtureMap.get('authored-default-route').evaluation;
  assert.equal(boundedDefault.decision.action, 'route');
  assert.equal(boundedDefault.decision.route.basis.kind, 'bounded-default');
  assert.deepEqual(boundedDefault.diagnostics.selectedResources, [DEFAULT_RESOURCE]);
  const clarify = fixtureMap.get('one-turn-clarify').evaluation;
  assert.equal(clarify.decision.action, 'clarify');
  assert.equal(clarify.diagnostics.clarifyCount, 1);
  assert.ok(clarify.decision.clarify.alternatives.includes('none_of_these'));
  const reject = fixtureMap.get('forbidden-reject').evaluation;
  assert.equal(reject.decision.action, 'reject');
  assert.equal(reject.decision.reject.authority, 'Withheld');
  [clarify, reject].forEach((evaluation) => {
    assert.deepEqual(evaluation.diagnostics.effects, []);
    assert.equal(Object.prototype.hasOwnProperty.call(evaluation.decision, 'route'), false);
    assert.equal(JSON.stringify(evaluation.decision).includes('destinationId'), false);
    assert.equal(JSON.stringify(evaluation.decision).includes('authorityRef'), false);
  });
  assert.equal(
    fixtureMap.get('singular-omission-zero-rank').typedGold.assertions.rankCalls,
    0,
  );

  const compilerSource = walkFiles(path.join(BASE_ROOT, 'compiler'))
    .filter((filePath) => filePath.endsWith('.cjs'))
    .map((filePath) => fs.readFileSync(filePath, 'utf8'))
    .join('\n');
  assert.equal(compilerSource.includes("'system-spec-kit'"), false);
  assert.equal(compilerSource.includes('"system-spec-kit"'), false);
  assert.equal(/\bskillId\s*(?:===|==|!==|!=)/.test(compilerSource), false);
  return view;
}

function verifyScorer(fixtures) {
  const rows = fixtures.map((fixture) => ({
    observed: projectLegacyObservation(fixture.typedGold),
    scenario: {
      classKind: 'routing',
      expectedIntent: fixture.expectedIntent,
      expectedIntents: fixture.expectedIntents,
      expectedResources: fixture.expectedResources,
      goldParseError: null,
      hasIntentGold: true,
      hasResourceGold: true,
      scenarioId: fixture.scenarioId,
      source: { shape: 'sk-doc' },
    },
  }));
  const results = runProtectedReplay('score-batch', rows);
  results.forEach((result, index) => {
    assert.equal(result.pass, true, `${fixtures[index].scenarioId}: ${canonicalize(result)}`);
  });
  const routeRow = rows[0];
  const [extraResource, fabricated] = runProtectedReplay('score-batch', [
    {
      observed: {
        observedIntents: routeRow.observed.observedIntents,
        observedResources: [...routeRow.observed.observedResources, 'references/not-authored.md'],
      },
      scenario: routeRow.scenario,
    },
    {
      observed: { observedIntents: ['WRONG'], observedResources: ['WRONG'] },
      scenario: routeRow.scenario,
    },
  ]);
  assert.equal(extraResource.pass, false);
  assert.equal(fabricated.pass, false);
  return results;
}

function verifyParity(generated) {
  const scenarios = generated.fixtures
    .filter((fixture) => [
      'exact-single-route',
      'authored-default-route',
      'singular-omission-zero-rank',
    ].includes(fixture.scenarioId));
  const legacy = runProtectedReplay(
    'route-batch',
    scenarios.map((scenario) => ({ skillRoot: SKILL_ROOT, taskText: scenario.taskText })),
  );
  let index = 0;
  const parity = runShadowParity({
    activationManifest: generated.priorManifest,
    evaluateCompiled: (policy, request) => (
      evaluateTargetPolicy(policy, generated.authoredSources, request)
    ),
    evaluateLegacy: () => legacy[index++],
    policy: generated.policy,
    scenarios,
  });
  assert.equal(parity.legacyServingAuthority, true);
  assert.equal(parity.effectCount, 0);
  assert.equal(parity.goldMutation, 'observed-none');
  assert.equal(parity.matches, scenarios.length);
  assert.equal(parity.mismatches, 0);
  return parity;
}

function verifyRollback(generated) {
  const prior = validateActivationManifest(generated.priorManifest);
  const candidate = validateActivationManifest(generated.candidateManifest);
  const priorBytes = manifestBytes(prior);
  const priorHash = sha256Bytes(priorBytes);
  const priorPin = pinManifest(prior);
  const active = fencedSwapInMemory({
    expectedCurrent: prior.selectedPolicy,
    expectedFencingEpoch: 0,
    nextManifest: candidate,
    state: { fencingEpoch: 0, manifest: prior },
    token: 'activate-system-spec-kit',
  });
  const activePin = pinManifest(active.manifest);
  assert.equal(activePin.generation, 1);
  assert.equal(activePin.effectivePolicyHash, generated.policy.effectivePolicyHash);
  assert.equal(priorPin.generation, 0);
  const restored = fencedSwapInMemory({
    expectedCurrent: candidate.selectedPolicy,
    expectedFencingEpoch: 1,
    nextManifest: prior,
    state: active,
    token: 'rollback-system-spec-kit',
  });
  const restoredBytes = manifestBytes(restored.manifest);
  const restoredHash = sha256Bytes(restoredBytes);
  assert.ok(restoredBytes.equals(priorBytes));
  assert.equal(restoredHash, priorHash);
  assert.equal(restored.fencingEpoch, 2);
  assert.throws(() => fencedSwapInMemory({
    expectedCurrent: prior.selectedPolicy,
    expectedFencingEpoch: 0,
    nextManifest: candidate,
    state: restored,
    token: 'stale-system-spec-kit',
  }), /stale fencing epoch/);
  return { activeGeneration: activePin.generation, fence: restored.fencingEpoch, priorHash, restoredHash };
}

function verifyPolicyCard(generated) {
  const results = {
    boundedDefault: replayTargetPolicyCard(generated.card.markdown, 'write a haiku about rain'),
    clarify: replayTargetPolicyCard(generated.card.markdown, 'done memory'),
    reject: replayTargetPolicyCard(
      generated.card.markdown,
      'claim done without checklist verification',
    ),
    route: replayTargetPolicyCard(generated.card.markdown, 'plan a new spec'),
  };
  assert.equal(results.route.action, 'route');
  assert.ok(results.route.resources.includes(DEFAULT_RESOURCE));
  assert.equal(results.boundedDefault.action, 'route');
  assert.equal(results.boundedDefault.basis, 'bounded-default');
  assert.equal(results.clarify.action, 'clarify');
  assert.equal(results.reject.action, 'reject');
  Object.values(results).forEach((result) => {
    assert.equal(result.terminal, 'DOCUMENT_ONLY_UNATTESTED');
  });
}

function verifyProtectedFiles() {
  const results = Object.entries(PROTECTED_DIGESTS).map(([fileName, expected]) => {
    const actual = sha256File(path.join(BENCHMARK_ROOT, fileName));
    assert.equal(actual, expected, `protected scorer changed: ${fileName}`);
    return { fileName, sha256: actual };
  });
  return results.sort((left, right) => compareUtf16(left.fileName, right.fileName));
}

function verifySyntax() {
  const files = walkFiles(PHASE_ROOT).filter((filePath) => filePath.endsWith('.cjs'));
  files.forEach((filePath) => {
    const result = spawnSync(process.execPath, ['--check', filePath], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  });
  return files.length;
}

function verify() {
  const before = hashTree(PHASE_ROOT);
  const generated = buildArtifacts();
  const artifactCount = assertArtifactSet(generated.artifacts);
  const determinism = verifyDeterminism(generated);
  verifySchemas(generated);
  const degeneracy = verifyClosedAlgebra(generated);
  const scorer = verifyScorer(generated.fixtures);
  const parity = verifyParity(generated);
  const rollback = verifyRollback(generated);
  verifyPolicyCard(generated);
  const protectedFiles = verifyProtectedFiles();
  const syntaxFiles = verifySyntax();
  const after = hashTree(PHASE_ROOT);
  assert.deepEqual(after, before, 'default validation changed rollout bytes');
  return {
    artifactCount,
    degeneracy,
    determinism,
    parity,
    protectedFiles,
    rollback,
    scorerRows: scorer.length,
    syntaxFiles,
  };
}

function printReport(report) {
  process.stdout.write(
    `[system-spec-kit-rollout] GREEN build artifacts=${report.artifactCount} `
      + `body_sha256=${report.determinism.bodyHash} `
      + `effective_policy=${report.determinism.effectiveHash} byte_identical=true\n`,
  );
  process.stdout.write(
    `[system-spec-kit-rollout] GREEN algebra candidates=${report.degeneracy.candidateCount} `
      + `selection=single leaves=48 intents=17 default=bounded-default `
      + `forbidden=reject ambiguous=clarify-once rank_calls=0 authority=withheld\n`,
  );
  process.stdout.write(
    `[system-spec-kit-rollout] GREEN scorer rows=${report.scorerRows} `
      + `real_read_only_path=true falsifiers=2 scorer_unchanged=true\n`,
  );
  process.stdout.write(
    `[system-spec-kit-rollout] GREEN parity matches=${report.parity.matches} `
      + `mismatches=${report.parity.mismatches} effects=${report.parity.effectCount} `
      + `legacy_authoritative=${report.parity.legacyServingAuthority}\n`,
  );
  process.stdout.write(
    `[system-spec-kit-rollout] GREEN rollback pre=${report.rollback.priorHash} `
      + `restored=${report.rollback.restoredHash} fence=${report.rollback.fence} `
      + `active_generation=${report.rollback.activeGeneration} byte_exact=true\n`,
  );
  report.protectedFiles.forEach((entry) => {
    process.stdout.write(
      `[system-spec-kit-rollout] SHA256 ${entry.sha256} ${entry.fileName}\n`,
    );
  });
  process.stdout.write(
    `[system-spec-kit-rollout] GREEN syntax node_check_files=${report.syntaxFiles} `
      + `read_only_validate=true result=GREEN\n`,
  );
}

if (process.argv.includes('--write')) writeArtifacts();
printReport(verify());
