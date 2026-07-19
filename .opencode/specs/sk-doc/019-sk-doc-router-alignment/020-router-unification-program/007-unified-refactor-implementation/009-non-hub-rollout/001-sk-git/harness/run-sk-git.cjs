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
  compile,
  deriveDegeneracy,
  evaluatePolicy,
  generatePolicyCard,
  projectAdvisor,
  projectLegacyObservation,
  projectTypedRouteGold,
  replayPolicyCard,
  validateReferenceClosure,
} = require('../../../001-compiler-n1-shadow/compiler/index.cjs');
const {
  ActivationManifestError,
  fenceStateBytes,
  fencedSwapInMemory,
  manifestBytes,
  pinManifest,
  validateActivationManifest,
} = require('../activation/fenced-manifest.cjs');
const { runShadowParity } = require('../parity/shadow-parity.cjs');
const { assertSchema } = require('../../../001-compiler-n1-shadow/harness/json-schema.cjs');
const {
  BENCHMARK_ROOT,
  CHILD_ROOT,
  REPO_ROOT,
  SKILL_ROOT,
  canonicalJsonBytes,
  hashTree,
  loadAuthoredSources,
  loadSchemas,
  readJson,
  sha256Bytes,
  sha256File,
  walkFiles,
} = require('./support.cjs');

const ACTIVATION_ROOT = path.join(CHILD_ROOT, 'activation');
const PROTECTED_REPLAY_PATH = path.join(__dirname, 'protected-replay.cjs');
const PROTECTED_DIGESTS = Object.freeze({
  'load-playbook-scenarios.cjs': '5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029',
  'router-replay.cjs': 'd5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47',
  'score-skill-benchmark.cjs': 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
});
const FIXTURE_SCENARIOS = Object.freeze([
  {
    expectedIntent: 'WORKSPACE_SETUP',
    expectedIntents: ['WORKSPACE_SETUP'],
    expectedResources: [
      'assets/worktree-checklist.md',
      'references/quick-reference.md',
      'references/worktree-workflows.md',
    ],
    fileName: 'exact-workspace-route.json',
    scenarioId: 'exact-workspace-route',
    taskText: 'create a numbered worktree',
  },
  {
    expectedIntent: 'COMMIT',
    expectedIntents: ['COMMIT'],
    expectedResources: [
      'assets/commit-message-template.md',
      'references/commit-workflows.md',
      'references/quick-reference.md',
    ],
    fileName: 'exact-commit-route.json',
    scenarioId: 'exact-commit-route',
    taskText: 'commit staged changes',
  },
  {
    expectedIntent: 'FINISH',
    expectedIntents: ['FINISH'],
    expectedResources: [
      'assets/pr-template.md',
      'references/finish-workflows.md',
      'references/github-mcp-integration.md',
      'references/quick-reference.md',
    ],
    fileName: 'exact-finish-route.json',
    scenarioId: 'exact-finish-route',
    taskText: 'finish with a pull request',
  },
  {
    expectedIntent: 'GITKRAKEN_MCP',
    expectedIntents: ['GITKRAKEN_MCP'],
    expectedResources: [
      'references/gitkraken-mcp-integration.md',
      'references/quick-reference.md',
    ],
    fileName: 'exact-gitkraken-route.json',
    scenarioId: 'exact-gitkraken-route',
    taskText: 'gitkraken launchpad',
  },
  {
    expectedIntent: 'SHARED_PATTERNS',
    expectedIntents: ['SHARED_PATTERNS'],
    expectedResources: [
      'references/quick-reference.md',
      'references/shared-patterns.md',
    ],
    fileName: 'exact-shared-patterns-route.json',
    scenarioId: 'exact-shared-patterns-route',
    taskText: 'branch naming convention',
  },
  {
    expectedIntent: 'defer',
    expectedIntents: [],
    expectedResources: [],
    fileName: 'zero-signal-defer.json',
    scenarioId: 'zero-signal-defer',
    taskText: 'write a haiku about rain',
  },
  {
    expectedIntent: 'defer',
    expectedIntents: [],
    expectedResources: [],
    fileName: 'one-turn-clarify.json',
    scenarioId: 'one-turn-clarify',
    taskText: 'worktree commit',
  },
  {
    expectedIntent: 'defer',
    expectedIntents: [],
    expectedResources: [],
    fileName: 'forbidden-reject.json',
    scenarioId: 'forbidden-reject',
    taskText: 'force push to main/master',
  },
  {
    expectedIntent: 'WORKSPACE_SETUP',
    expectedIntents: ['WORKSPACE_SETUP'],
    expectedResources: [
      'assets/worktree-checklist.md',
      'references/quick-reference.md',
      'references/worktree-workflows.md',
    ],
    fileName: 'singular-omission-zero-rank.json',
    scenarioId: 'singular-omission-zero-rank',
    taskText: 'numbered worktree',
  },
]);

function buildArtifacts() {
  const authoredSources = loadAuthoredSources();
  const policy = compile(authoredSources);
  const advisor = projectAdvisor(policy, authoredSources);
  const card = generatePolicyCard(policy, authoredSources);
  const fixtures = FIXTURE_SCENARIOS.map((scenario) => {
    const evaluation = evaluatePolicy(policy, { taskText: scenario.taskText });
    return {
      ...scenario,
      evaluation,
      typedGold: projectTypedRouteGold(policy, scenario.scenarioId, evaluation),
    };
  });
  const artifacts = new Map([
    ['compiled/sk-git/policy.json', canonicalJsonBytes(policy)],
    ['compiled/sk-git/advisor-projection.json', canonicalJsonBytes(advisor)],
    ['compiled/sk-git/route-gold.typed.json', canonicalJsonBytes(fixtures[0].typedGold)],
    ['compiled/sk-git/policy-card.md', Buffer.from(card.markdown, 'utf8')],
  ]);
  for (const fixture of fixtures) {
    artifacts.set(
      `compiled/sk-git/fixtures/${fixture.fileName}`,
      canonicalJsonBytes(fixture.typedGold),
    );
  }
  return { advisor, artifacts, authoredSources, card, fixtures, policy };
}

function writeArtifacts(generated) {
  for (const [relativePath, bytes] of generated.artifacts) {
    const filePath = path.join(CHILD_ROOT, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, bytes, { mode: 0o600 });
  }
  fs.mkdirSync(ACTIVATION_ROOT, { recursive: true });
  const prior = {
    schemaVersion: 'V1',
    selectedPolicy: { effectivePolicyHash: null, generation: 0 },
    servingAuthority: 'legacy',
    shadowOnly: true,
  };
  const candidate = {
    schemaVersion: 'V1',
    selectedPolicy: {
      effectivePolicyHash: generated.policy.effectivePolicyHash,
      generation: generated.policy.activationGeneration,
    },
    servingAuthority: 'legacy',
    shadowOnly: true,
  };
  fs.writeFileSync(path.join(ACTIVATION_ROOT, 'manifest.prior.json'), manifestBytes(prior));
  fs.writeFileSync(path.join(ACTIVATION_ROOT, 'manifest.candidate.json'), manifestBytes(candidate));
  fs.writeFileSync(path.join(ACTIVATION_ROOT, 'manifest.json'), manifestBytes(prior));
  fs.writeFileSync(path.join(ACTIVATION_ROOT, 'fence-state.json'), fenceStateBytes(0));
}

function runProtectedReplay(action, items) {
  const result = spawnSync(process.execPath, [PROTECTED_REPLAY_PATH], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    input: JSON.stringify({ action, items }),
    maxBuffer: 8 * 1024 * 1024,
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

function verifyArtifacts(expectedArtifacts) {
  for (const [relativePath, expectedBytes] of expectedArtifacts) {
    const filePath = path.join(CHILD_ROOT, relativePath);
    assert.ok(fs.existsSync(filePath), `missing generated artifact: ${relativePath}`);
    assert.ok(fs.readFileSync(filePath).equals(expectedBytes), `artifact drift: ${relativePath}`);
  }
  return expectedArtifacts.size;
}

function verifyDeterminism(generated) {
  const repeats = [buildArtifacts(), buildArtifacts()];
  for (const repeat of repeats) {
    assert.equal(repeat.policy.effectivePolicyHash, generated.policy.effectivePolicyHash);
    assert.equal(
      sha256Bytes(canonicalBytes(repeat.policy)),
      sha256Bytes(canonicalBytes(generated.policy)),
    );
    assert.equal(repeat.artifacts.size, generated.artifacts.size);
    for (const [relativePath, bytes] of generated.artifacts) {
      assert.ok(repeat.artifacts.get(relativePath).equals(bytes), `nondeterministic ${relativePath}`);
    }
  }
  const processRuns = [0, 1].map(() => spawnSync(
    process.execPath,
    [path.join(__dirname, 'fingerprint.cjs')],
    { cwd: REPO_ROOT, encoding: 'utf8' },
  ));
  processRuns.forEach((result) => assert.equal(result.status, 0, result.stderr));
  const fingerprints = processRuns.map((result) => JSON.parse(result.stdout));
  assert.equal(new Set(fingerprints.map((value) => value.bodySha256)).size, 1);
  assert.equal(new Set(fingerprints.map((value) => value.effectivePolicyHash)).size, 1);
  return {
    artifactCount: generated.artifacts.size,
    bodySha256: fingerprints[0].bodySha256,
    effectivePolicyHash: fingerprints[0].effectivePolicyHash,
    processRuns: fingerprints.length,
    totalCompiles: 5,
  };
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
  generated.fixtures.forEach((fixture) => {
    assertSchema(schemas.decision, fixture.evaluation.decision, `${fixture.scenarioId} decision`);
    assertSchema(schemas.typedGold, fixture.typedGold, `${fixture.scenarioId} typed gold`);
    assert.equal(
      computeProjectionHash('TypedRouteGoldV1', fixture.typedGold),
      fixture.typedGold.projectionHash,
    );
  });
  const match = /^---\n([^\n]+)\n---/m.exec(generated.card.markdown);
  assert.ok(match, 'policy card front matter is missing');
  const frontmatter = JSON.parse(match[1]);
  assertSchema(schemas.card, frontmatter, 'policy card front matter');
  assert.equal(
    computeProjectionHash('PolicyCardV1', frontmatter, 'humanViewHash'),
    frontmatter.humanViewHash,
  );
  assert.deepEqual(
    [generated.advisor.effectivePolicyHash, frontmatter.effectivePolicyHash],
    [generated.policy.effectivePolicyHash, generated.policy.effectivePolicyHash],
  );
  return {
    advisor: generated.advisor.projectionHash,
    card: frontmatter.humanViewHash,
    typed: generated.fixtures[0].typedGold.projectionHash,
  };
}

function verifyDegeneracy(generated) {
  const view = deriveDegeneracy(generated.policy, generated.authoredSources);
  assert.equal(view.candidateCount, 1);
  assert.deepEqual(view.selectionKinds, ['single']);
  assert.deepEqual(view.crossTargetEdges, []);
  assert.deepEqual(view.bundleRules, []);
  assert.deepEqual(view.handoffEdges, []);
  assert.equal(view.overlay, null);
  assert.equal(view.P, 'static');
  assert.equal(generated.policy.selectors.length, 5);
  assert.equal(
    generated.policy.detectors.filter((detector) => detector.kind === 'resource').length,
    10,
  );
  for (const signal of generated.authoredSources.intentSignals) {
    assert.ok(signal.resources.includes(generated.authoredSources.defaultResource));
  }
  return { defaultResource: generated.authoredSources.defaultResource, leafCount: 10, view };
}

function verifyClosedAlgebra(generated) {
  const fixtureMap = new Map(
    generated.fixtures.map((fixture) => [fixture.scenarioId, fixture.evaluation]),
  );
  const zero = fixtureMap.get('zero-signal-defer');
  assert.equal(zero.decision.action, 'defer');
  assert.equal(zero.decision.defer.reason, 'no-match');
  const clarify = fixtureMap.get('one-turn-clarify');
  assert.equal(clarify.decision.action, 'clarify');
  assert.equal(clarify.diagnostics.clarifyCount, 1);
  assert.equal(clarify.decision.clarify.authority, 'Withheld');
  const reject = fixtureMap.get('forbidden-reject');
  assert.equal(reject.decision.action, 'reject');
  assert.equal(reject.decision.reject.reason, 'forbidden');
  assert.equal(reject.decision.reject.authority, 'Withheld');
  for (const fixture of generated.fixtures) {
    const { decision } = fixture.evaluation;
    if (decision.action === 'route') continue;
    assert.equal(canonicalize(decision).includes('targets'), false);
    assert.equal(canonicalize(decision).includes('WithheldUntilVerify'), false);
  }
  const singular = generated.fixtures.find(
    (fixture) => fixture.scenarioId === 'singular-omission-zero-rank',
  );
  assert.equal(singular.typedGold.assertions.rankCalls, 0);
  assert.deepEqual(singular.typedGold.assertions.handoffEdges, []);
  return { clarifyCount: 1, nonRouteAuthority: 'Withheld', rankCalls: 0 };
}

function verifyScorer(generated) {
  const rows = generated.fixtures.map((fixture) => ({
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
  const scored = runProtectedReplay('score-batch', rows);
  scored.forEach((row, index) => {
    assert.equal(row.pass, true, `${generated.fixtures[index].scenarioId} failed real scorer`);
  });
  const routeRow = rows[0];
  const [falsifier] = runProtectedReplay('score-batch', [{
    observed: {
      observedIntents: [...routeRow.observed.observedIntents],
      observedResources: [...routeRow.observed.observedResources, 'references/not-authored.md'],
    },
    scenario: routeRow.scenario,
  }]);
  assert.equal(falsifier.pass, false, 'real scorer accepted an extra resource');
  return { falsifierRejected: true, rows: rows.length };
}

function verifyParity(generated) {
  const manifest = validateActivationManifest(
    readJson(path.join(ACTIVATION_ROOT, 'manifest.json')),
    'checked activation manifest',
  );
  const legacy = runProtectedReplay(
    'route-batch',
    generated.fixtures.map((fixture) => ({
      skillRoot: SKILL_ROOT,
      taskText: fixture.taskText,
    })),
  );
  let index = 0;
  const parity = runShadowParity({
    activationManifest: manifest,
    evaluateCompiled: evaluatePolicy,
    evaluateLegacy: () => legacy[index++],
    policy: generated.policy,
    scenarios: generated.fixtures,
  });
  assert.equal(parity.legacyServingAuthority, true);
  assert.equal(parity.effectCount, 0);
  assert.equal(parity.goldMutation, 'observed-none');
  assert.equal(parity.matches, 6);
  assert.equal(parity.mismatches, 3);
  assert.deepEqual(
    parity.rows.filter((row) => row.mismatchClass).map((row) => row.mismatchClass).sort(),
    [
      'legacy-default-union',
      'typed-clarify-vs-legacy-multi-route',
      'typed-reject-vs-legacy-fallback',
    ].sort(),
  );
  return parity;
}

function verifyRollback(generated) {
  const prior = validateActivationManifest(
    readJson(path.join(ACTIVATION_ROOT, 'manifest.prior.json')),
    'prior activation manifest',
  );
  const candidate = validateActivationManifest(
    readJson(path.join(ACTIVATION_ROOT, 'manifest.candidate.json')),
    'candidate activation manifest',
  );
  const priorBytes = manifestBytes(prior);
  const priorHash = sha256Bytes(priorBytes);
  const initial = { fencingEpoch: 0, manifest: JSON.parse(JSON.stringify(prior)) };
  const active = fencedSwapInMemory({
    expectedCurrent: prior.selectedPolicy,
    expectedFencingEpoch: 0,
    nextManifest: candidate,
    state: initial,
    token: 'activate-sk-git',
  });
  const priorPin = pinManifest(prior);
  const activePin = pinManifest(active.manifest);
  assert.equal(priorPin.generation, 0);
  assert.equal(activePin.generation, 1);
  assert.equal(activePin.effectivePolicyHash, generated.policy.effectivePolicyHash);
  const restored = fencedSwapInMemory({
    expectedCurrent: candidate.selectedPolicy,
    expectedFencingEpoch: 1,
    nextManifest: prior,
    state: active,
    token: 'rollback-sk-git',
  });
  const restoredBytes = manifestBytes(restored.manifest);
  assert.ok(restoredBytes.equals(priorBytes));
  assert.equal(sha256Bytes(restoredBytes), priorHash);
  assert.equal(restored.fencingEpoch, 2);
  let staleError;
  try {
    fencedSwapInMemory({
      expectedCurrent: prior.selectedPolicy,
      expectedFencingEpoch: 0,
      nextManifest: candidate,
      state: restored,
      token: 'stale-sk-git',
    });
  } catch (error) {
    staleError = error;
  }
  assert.ok(staleError instanceof ActivationManifestError);
  assert.equal(staleError.code, 'STALE_FENCING_EPOCH');
  return { fence: restored.fencingEpoch, priorHash, restoredHash: priorHash, staleRejected: true };
}

function verifyProtectedFiles() {
  return Object.entries(PROTECTED_DIGESTS).map(([fileName, expected]) => {
    const actual = sha256File(path.join(BENCHMARK_ROOT, fileName));
    assert.equal(actual, expected, `protected scorer changed: ${fileName}`);
    return { fileName, sha256: actual };
  });
}

function verifyPolicyCard(generated) {
  const decisions = {
    clarify: replayPolicyCard(generated.card.markdown, 'worktree commit'),
    defer: replayPolicyCard(generated.card.markdown, 'write a haiku about rain'),
    reject: replayPolicyCard(generated.card.markdown, 'force push to main/master'),
    route: replayPolicyCard(generated.card.markdown, 'commit staged changes'),
  };
  assert.equal(decisions.route.action, 'route');
  assert.equal(decisions.clarify.action, 'clarify');
  assert.equal(decisions.defer.action, 'defer');
  assert.equal(decisions.reject.action, 'reject');
  Object.values(decisions).forEach((decision) => {
    assert.equal(decision.terminal, 'DOCUMENT_ONLY_UNATTESTED');
  });
  return decisions;
}

function verifySyntax() {
  const files = walkFiles(CHILD_ROOT).filter((filePath) => filePath.endsWith('.cjs'));
  files.forEach((filePath) => {
    const result = spawnSync(process.execPath, ['--check', filePath], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  });
  return files.length;
}

function verify() {
  const before = hashTree(CHILD_ROOT);
  const generated = buildArtifacts();
  const report = {
    algebra: verifyClosedAlgebra(generated),
    artifactCount: verifyArtifacts(generated.artifacts),
    card: verifyPolicyCard(generated),
    degeneracy: verifyDegeneracy(generated),
    determinism: verifyDeterminism(generated),
    parity: verifyParity(generated),
    projections: verifySchemas(generated),
    protectedFiles: verifyProtectedFiles(),
    rollback: verifyRollback(generated),
    scorer: verifyScorer(generated),
    syntaxFiles: verifySyntax(),
  };
  const after = hashTree(CHILD_ROOT);
  assert.deepEqual(after, before, 'read-only validation changed rollout bytes');
  return report;
}

function printReport(report) {
  process.stdout.write(
    `[sk-git-rollout] PASS build deterministic compiles=${report.determinism.totalCompiles} `
      + `processes=${report.determinism.processRuns} body=${report.determinism.bodySha256} `
      + `effective=${report.determinism.effectivePolicyHash} artifacts=${report.artifactCount}\n`,
  );
  process.stdout.write(
    `[sk-git-rollout] PASS source candidateCount=${report.degeneracy.view.candidateCount} `
      + `selectors=5 leaves=${report.degeneracy.leafCount} default=`
      + `${report.degeneracy.defaultResource} bundles=0 handoffs=0 overlay=null P=static\n`,
  );
  process.stdout.write(
    `[sk-git-rollout] PASS real-scorer rows=${report.scorer.rows} `
      + `falsifier_rejected=${report.scorer.falsifierRejected} subprocess=true\n`,
  );
  process.stdout.write(
    `[sk-git-rollout] PASS shadow-parity legacy_authoritative=`
      + `${report.parity.legacyServingAuthority} matches=${report.parity.matches} `
      + `classified_mismatches=${report.parity.mismatches} effects=${report.parity.effectCount} `
      + `gold_mutation=${report.parity.goldMutation} authority=zero\n`,
  );
  process.stdout.write(
    `[sk-git-rollout] PASS algebra zero_signal=defer(no-match) ambiguous=clarify(1) `
      + `forbidden=reject non_route_authority=${report.algebra.nonRouteAuthority} `
      + `rank_calls=${report.algebra.rankCalls}\n`,
  );
  process.stdout.write(
    `[sk-git-rollout] PASS rollback pre=${report.rollback.priorHash} `
      + `restored=${report.rollback.restoredHash} fence=${report.rollback.fence} `
      + `stale_rejected=${report.rollback.staleRejected}\n`,
  );
  report.protectedFiles.forEach((file) => {
    process.stdout.write(`[sk-git-rollout] PASS protected ${file.fileName} sha256=${file.sha256}\n`);
  });
  process.stdout.write(
    `[sk-git-rollout] PASS projections ${canonicalize(report.projections)} `
      + `document_only=${report.card.route.terminal}\n`,
  );
  process.stdout.write(`[sk-git-rollout] PASS node-check files=${report.syntaxFiles}\n`);
  process.stdout.write('[sk-git-rollout] GREEN result=PASS live_authority=legacy scorer_unchanged=true\n');
}

const generated = buildArtifacts();
if (process.argv.includes('--write')) writeArtifacts(generated);
printReport(verify());
