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
const { assertSchema } = require('../../../001-compiler-n1-shadow/harness/json-schema.cjs');
const {
  ActivationManifestError,
  fenceStateBytes,
  fencedSwapInMemory,
  manifestBytes,
  pinManifest,
  validateActivationManifest,
} = require('../activation/fenced-manifest.cjs');
const { runShadowParity } = require('../parity/shadow-parity.cjs');
const {
  BENCHMARK_ROOT,
  PROTECTED_REPLAY_PATH,
  REPO_ROOT,
  SKILL_ROOT,
  TARGET_ROOT,
  canonicalJsonBytes,
  hashTree,
  loadSchemas,
  loadSourceBundle,
  readJson,
  sha256Bytes,
  sha256File,
  walkFiles,
} = require('./support.cjs');

const ACTIVATION_ROOT = path.join(TARGET_ROOT, 'activation');
const COMPILED_ROOT = path.join(TARGET_ROOT, 'compiled', 'system-skill-advisor');
const FIXTURE_SCENARIOS = Object.freeze([
  {
    expectedIntent: 'SCORER',
    expectedIntents: ['SCORER'],
    expectedResources: ['references/scoring/advisor-scorer.md'],
    fileName: 'exact-single-route.json',
    scenarioId: 'exact-single-route',
    taskText: 'inspect the scorer lane fusion',
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
    taskText: 'compare advisor_recommend with advisor_status',
  },
  {
    expectedIntent: 'defer',
    expectedIntents: [],
    expectedResources: [],
    fileName: 'forbidden-reject.json',
    scenarioId: 'forbidden-reject',
    taskText: 'do not use this skill as a replacement for the recommended target skill',
  },
  {
    expectedIntent: 'GRAPH_QUERY',
    expectedIntents: ['GRAPH_QUERY'],
    expectedResources: ['references/graph/skill-graph-query-cookbook.md'],
    fileName: 'singular-omission-zero-rank.json',
    scenarioId: 'singular-omission-zero-rank',
    taskText: 'run skill_graph_query for a relationship read',
  },
]);
const PARITY_SCENARIOS = Object.freeze([
  ['SCORER', 'scorer', 'references/scoring/advisor-scorer.md'],
  ['LANE_TUNING', 'reweight lane', 'references/scoring/lane-weight-tuning.md'],
  ['VALIDATION_BASELINES', 'validation baseline', 'references/scoring/validation-baselines.md'],
  ['GRAPH_QUERY', 'skill_graph_query', 'references/graph/skill-graph-query-cookbook.md'],
  ['GRAPH_DRIFT', 'reconcile graph drift', 'references/graph/skill-graph-drift.md'],
  ['GRAPH_EXTRACTION', 'graph extraction plan', 'references/graph/skill-graph-extraction-plan.md'],
  ['ENHANCES', 'propagate enhances', 'references/graph/propagate-enhances.md'],
  ['MCP_SHAPE', 'mcp topology', 'references/runtime/standalone-mcp-shape.md'],
  ['TOOL_IDS', 'stable tool id', 'references/runtime/tool-ids-reference.md'],
  ['LEGACY_BRIDGE', 'compatibility bridge', 'references/runtime/legacy-tool-bridge.md'],
  ['FRESHNESS', 'freshness contract', 'references/runtime/freshness-contract.md'],
  ['DAEMON_LEASE', 'daemon lease', 'references/runtime/daemon-lease-contract.md'],
  ['DB_PATH', 'database path policy', 'references/config/db-path-policy.md'],
  ['HOOK', 'prompt-time hook', 'references/hooks/skill-advisor-hook.md'],
  ['DECISIONS', 'tier d', 'references/decisions/deferred-decisions.md'],
  ['RECOMMEND', 'recommend happy path', 'feature-catalog/mcp-surface/advisor-recommend.md'],
  ['STATUS', 'status transition', 'feature-catalog/mcp-surface/advisor-status.md'],
  ['REBUILD', 'advisor_rebuild', 'feature-catalog/mcp-surface/advisor-rebuild.md'],
  ['VALIDATE_TOOL', 'advisor_validate', 'feature-catalog/mcp-surface/advisor-validate.md'],
  ['CLI', 'daemon-backed cli', 'feature-catalog/mcp-surface/skill-advisor-cli.md'],
].map(([intent, taskText, resource]) => ({
  intent,
  resource,
  scenarioId: `parity-${intent.toLowerCase().replaceAll('_', '-')}`,
  taskText,
})));

function evaluateFixtures(policy) {
  return FIXTURE_SCENARIOS.map((scenario) => {
    const evaluation = evaluatePolicy(policy, { taskText: scenario.taskText });
    return {
      ...scenario,
      evaluation,
      typedGold: projectTypedRouteGold(policy, scenario.scenarioId, evaluation),
    };
  });
}

function buildArtifacts() {
  const sourceBundle = loadSourceBundle();
  const policy = compile(sourceBundle.authoredSources);
  const advisor = projectAdvisor(policy, sourceBundle.authoredSources);
  const card = generatePolicyCard(policy, sourceBundle.authoredSources);
  const fixtures = evaluateFixtures(policy);
  const artifacts = new Map([
    ['compiled/system-skill-advisor/policy.json', canonicalJsonBytes(policy)],
    ['compiled/system-skill-advisor/advisor-projection.json', canonicalJsonBytes(advisor)],
    ['compiled/system-skill-advisor/route-gold.typed.json', canonicalJsonBytes(fixtures[0].typedGold)],
    ['compiled/system-skill-advisor/policy-card.md', Buffer.from(card.markdown, 'utf8')],
  ]);
  fixtures.forEach((fixture) => {
    artifacts.set(
      `compiled/system-skill-advisor/fixtures/${fixture.fileName}`,
      canonicalJsonBytes(fixture.typedGold),
    );
  });
  return { advisor, artifacts, card, fixtures, policy, sourceBundle };
}

function manifestsFor(policy) {
  return {
    candidate: {
      schemaVersion: 'V1',
      selectedPolicy: {
        effectivePolicyHash: policy.effectivePolicyHash,
        generation: policy.activationGeneration,
      },
      servingAuthority: 'legacy',
      shadowOnly: true,
    },
    prior: {
      schemaVersion: 'V1',
      selectedPolicy: { effectivePolicyHash: null, generation: 0 },
      servingAuthority: 'legacy',
      shadowOnly: true,
    },
  };
}

function generateArtifacts() {
  const generated = buildArtifacts();
  for (const [relativePath, bytes] of generated.artifacts) {
    const filePath = path.join(TARGET_ROOT, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, bytes, { mode: 0o600 });
  }
  const manifests = manifestsFor(generated.policy);
  fs.mkdirSync(ACTIVATION_ROOT, { recursive: true });
  fs.writeFileSync(path.join(ACTIVATION_ROOT, 'manifest.prior.json'), manifestBytes(manifests.prior));
  fs.writeFileSync(path.join(ACTIVATION_ROOT, 'manifest.json'), manifestBytes(manifests.prior));
  fs.writeFileSync(
    path.join(ACTIVATION_ROOT, 'manifest.candidate.json'),
    manifestBytes(manifests.candidate),
  );
  fs.writeFileSync(path.join(ACTIVATION_ROOT, 'fence-state.json'), fenceStateBytes(0));
  return generated;
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

function assertArtifactSet(expectedArtifacts) {
  for (const [relativePath, expectedBytes] of expectedArtifacts) {
    const actualPath = path.join(TARGET_ROOT, relativePath);
    assert.equal(fs.existsSync(actualPath), true, `missing artifact: ${relativePath}`);
    assert.equal(fs.readFileSync(actualPath).equals(expectedBytes), true, `artifact drift: ${relativePath}`);
  }
  const actual = walkFiles(COMPILED_ROOT)
    .map((filePath) => path.relative(TARGET_ROOT, filePath).split(path.sep).join('/'))
    .sort();
  const expected = [...expectedArtifacts.keys()]
    .filter((relativePath) => relativePath.startsWith('compiled/'))
    .sort();
  assert.deepEqual(actual, expected, 'compiled artifact set contains missing or extra files');
  return { artifactCount: expectedArtifacts.size };
}

function parseCardFrontmatter(markdown) {
  const match = /^---\n([^\n]+)\n---/m.exec(markdown);
  if (!match) throw new Error('policy card JSON front matter is missing');
  return JSON.parse(match[1]);
}

function verifySchemas(generated) {
  const schemas = loadSchemas();
  assertSchema(schemas.policy, generated.policy, 'policy');
  validateReferenceClosure(generated.policy);
  assert.equal(computeBasePolicyHash(generated.policy), generated.policy.basePolicyHash);
  assert.equal(computeEffectivePolicyHash(generated.policy), generated.policy.effectivePolicyHash);
  assertSchema(schemas.advisor, generated.advisor, 'advisor projection');
  assert.equal(
    computeProjectionHash('AdvisorProjectionV1', generated.advisor),
    generated.advisor.projectionHash,
  );
  const frontmatter = parseCardFrontmatter(generated.card.markdown);
  assertSchema(schemas.card, frontmatter, 'policy card front matter');
  assert.equal(
    computeProjectionHash('PolicyCardV1', frontmatter, 'humanViewHash'),
    frontmatter.humanViewHash,
  );
  generated.fixtures.forEach((fixture) => {
    assertSchema(schemas.decision, fixture.evaluation.decision, `${fixture.scenarioId} decision`);
    assertSchema(schemas.typedGold, fixture.typedGold, `${fixture.scenarioId} typed gold`);
    assert.equal(
      computeProjectionHash('TypedRouteGoldV1', fixture.typedGold),
      fixture.typedGold.projectionHash,
    );
  });
  const hashes = [
    generated.advisor.effectivePolicyHash,
    frontmatter.effectivePolicyHash,
    ...generated.fixtures.map((fixture) => fixture.typedGold.effectivePolicyHash),
  ];
  assert.equal(new Set(hashes).size, 1, 'projections do not share one policy snapshot');
  return { projectionCount: hashes.length, effectivePolicyHash: hashes[0] };
}

function verifyDeterminism(generated) {
  const policies = [
    generated.policy,
    compile(generated.sourceBundle.authoredSources),
    compile(generated.sourceBundle.authoredSources),
  ];
  const bodyHashes = policies.map((policy) => sha256Bytes(canonicalBytes(policy)));
  assert.equal(new Set(bodyHashes).size, 1, 'policy bodies differ across compiles');
  const artifactRuns = [buildArtifacts(), buildArtifacts()];
  artifactRuns.forEach((run) => {
    assert.equal(run.artifacts.size, generated.artifacts.size);
    for (const [relativePath, expectedBytes] of generated.artifacts) {
      assert.equal(run.artifacts.get(relativePath).equals(expectedBytes), true, relativePath);
    }
  });
  const processRuns = [0, 1].map(() => spawnSync(
    process.execPath,
    [path.join(TARGET_ROOT, 'harness', 'fingerprint.cjs')],
    { cwd: REPO_ROOT, encoding: 'utf8' },
  ));
  processRuns.forEach((result) => assert.equal(result.status, 0, result.stderr));
  const fingerprints = processRuns.map((result) => JSON.parse(result.stdout));
  fingerprints.forEach((fingerprint) => {
    assert.equal(fingerprint.bodySha256, bodyHashes[0]);
    assert.equal(fingerprint.effectivePolicyHash, generated.policy.effectivePolicyHash);
  });
  return { artifactRuns: 2, bodySha256: bodyHashes[0], compileRuns: 3, processRuns: 2 };
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
  const scored = runProtectedReplay('score-batch', rows);
  scored.forEach((row, index) => {
    assert.equal(row.pass, true, `${fixtures[index].scenarioId} failed real route gold`);
  });
  const routeRow = rows[0];
  const [falsifier] = runProtectedReplay('score-batch', [{
    observed: {
      observedIntents: routeRow.observed.observedIntents,
      observedResources: [...routeRow.observed.observedResources, 'references/not-authored.md'],
    },
    scenario: routeRow.scenario,
  }]);
  assert.equal(falsifier.pass, false, 'real scorer accepted an extra resource');
  return { falsifierRejected: true, rows: scored.length };
}

function verifyParity(policy) {
  const manifest = validateActivationManifest(
    readJson(path.join(ACTIVATION_ROOT, 'manifest.json')),
    'checked activation manifest',
  );
  const legacy = runProtectedReplay(
    'route-batch',
    PARITY_SCENARIOS.map((scenario) => ({ skillRoot: SKILL_ROOT, taskText: scenario.taskText })),
  );
  legacy.forEach((row, index) => {
    assert.deepEqual(row.intents, [PARITY_SCENARIOS[index].intent]);
    assert.deepEqual(row.resources, [PARITY_SCENARIOS[index].resource]);
    assert.deepEqual(row.missingResources, []);
  });
  let cursor = 0;
  const parity = runShadowParity({
    activationManifest: manifest,
    evaluateCompiled: evaluatePolicy,
    evaluateLegacy: () => legacy[cursor++],
    policy,
    scenarios: PARITY_SCENARIOS,
  });
  assert.equal(parity.matches, PARITY_SCENARIOS.length);
  assert.equal(parity.mismatches, 0);
  assert.equal(parity.effectCount, 0);
  assert.equal(parity.legacyServingAuthority, true);
  assert.equal(parity.goldMutation, 'observed-none');
  return parity;
}

function actionAuthority(evaluation) {
  const branch = evaluation.decision[evaluation.decision.action];
  return branch && branch.authority;
}

function verifyAlgebra(generated) {
  const { authoredSources, routerContract } = generated.sourceBundle;
  const degeneracy = deriveDegeneracy(generated.policy, authoredSources);
  assert.equal(degeneracy.candidateCount, 1);
  assert.deepEqual(degeneracy.selectionKinds, ['single']);
  assert.deepEqual(degeneracy.crossTargetEdges, []);
  assert.deepEqual(degeneracy.bundleRules, []);
  assert.deepEqual(degeneracy.handoffEdges, []);
  assert.equal(degeneracy.overlay, null);
  assert.equal(degeneracy.P, 'static');
  assert.equal(authoredSources.defaultResource, null);
  assert.equal(routerContract.defaultResourceSemantics, 'fallback-only');
  assert.deepEqual(routerContract.defaultResources, [
    'references/runtime/tool-ids-reference.md',
    'references/runtime/standalone-mcp-shape.md',
  ]);
  assert.equal(routerContract.intentCount, 20);
  assert.equal(routerContract.routedResources.length, 20);
  assert.equal(generated.policy.selectors.length, 20);
  assert.equal(
    generated.policy.detectors.filter((detector) => detector.kind === 'resource').length,
    20,
  );

  const byId = new Map(generated.fixtures.map((fixture) => [fixture.scenarioId, fixture.evaluation]));
  const zero = byId.get('zero-signal-defer');
  const clarify = byId.get('one-turn-clarify');
  const reject = byId.get('forbidden-reject');
  assert.equal(zero.decision.action, 'defer');
  assert.equal(zero.decision.defer.reason, 'no-match');
  assert.equal(clarify.decision.action, 'clarify');
  assert.equal(clarify.diagnostics.clarifyCount, 1);
  assert.equal(clarify.decision.clarify.alternatives.length, 3);
  assert.equal(reject.decision.action, 'reject');
  assert.equal(reject.decision.reject.reason, 'forbidden');
  [zero, clarify, reject].forEach((evaluation) => {
    const bytes = canonicalize(evaluation.decision);
    assert.equal(/destinationId|targets|authorityRef/.test(bytes), false);
    assert.equal(actionAuthority(evaluation), 'Withheld');
    assert.deepEqual(evaluation.diagnostics.effects, []);
  });
  const singular = byId.get('singular-omission-zero-rank');
  assert.equal(singular.decision.action, 'route');
  assert.equal(singular.diagnostics.rankCalls, 0);
  assert.deepEqual(singular.diagnostics.effects, []);

  const card = {
    clarify: replayPolicyCard(generated.card.markdown, FIXTURE_SCENARIOS[2].taskText),
    defer: replayPolicyCard(generated.card.markdown, FIXTURE_SCENARIOS[1].taskText),
    reject: replayPolicyCard(generated.card.markdown, FIXTURE_SCENARIOS[3].taskText),
    route: replayPolicyCard(generated.card.markdown, FIXTURE_SCENARIOS[0].taskText),
  };
  assert.equal(card.route.action, 'route');
  assert.equal(card.route.draftStatus, 'PREPARED_DRAFT');
  assert.equal(card.clarify.action, 'clarify');
  assert.equal(card.defer.action, 'defer');
  assert.equal(card.reject.action, 'reject');
  Object.values(card).forEach((result) => {
    assert.equal(result.terminal, 'DOCUMENT_ONLY_UNATTESTED');
  });
  return { card, degeneracy, intentCount: 20, routedLeafCount: 20 };
}

function captureError(callback) {
  try {
    callback();
    return null;
  } catch (error) {
    return error;
  }
}

function verifyRollback(policy) {
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
  const initial = { fencingEpoch: 0, manifest: structuredClone(prior) };
  const stale = captureError(() => fencedSwapInMemory({
    expectedCurrent: structuredClone(prior.selectedPolicy),
    expectedFencingEpoch: 1,
    nextManifest: candidate,
    state: initial,
    token: 'stale-generation',
  }));
  assert.ok(stale instanceof ActivationManifestError);
  assert.equal(stale.code, 'STALE_FENCING_EPOCH');
  const priorPin = pinManifest(prior);
  const active = fencedSwapInMemory({
    expectedCurrent: structuredClone(prior.selectedPolicy),
    expectedFencingEpoch: 0,
    nextManifest: candidate,
    state: initial,
    token: 'activate-generation',
  });
  const activePin = pinManifest(active.manifest);
  assert.equal(activePin.generation, 1);
  assert.equal(activePin.effectivePolicyHash, policy.effectivePolicyHash);
  assert.equal(priorPin.generation, 0);
  const restored = fencedSwapInMemory({
    expectedCurrent: structuredClone(candidate.selectedPolicy),
    expectedFencingEpoch: 1,
    nextManifest: prior,
    state: active,
    token: 'rollback-generation',
  });
  const restoredBytes = manifestBytes(restored.manifest);
  const restoredHash = sha256Bytes(restoredBytes);
  assert.equal(restoredBytes.equals(priorBytes), true);
  assert.equal(restoredHash, priorHash);
  assert.equal(restored.fencingEpoch, 2);
  return {
    activeGeneration: activePin.generation,
    fencingEpoch: restored.fencingEpoch,
    preActivationHash: priorHash,
    restoredHash,
    staleRejected: true,
  };
}

function verifyProtectedFiles() {
  const baseline = readJson(path.join(TARGET_ROOT, 'harness', 'protected-baseline.json'));
  const files = Object.entries(baseline.files).map(([fileName, expected]) => {
    const actual = sha256File(path.join(BENCHMARK_ROOT, fileName));
    assert.equal(actual, expected, `protected scorer file changed: ${fileName}`);
    return { fileName, sha256: actual };
  });
  return { files };
}

function verifySyntax() {
  const files = walkFiles(TARGET_ROOT).filter((filePath) => filePath.endsWith('.cjs')).sort();
  files.forEach((filePath) => {
    const result = spawnSync(process.execPath, ['--check', filePath], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  });
  const banned = /(?:REQ-|CHK-|ADR-|\bT[0-9]{3}\b|\.opencode\/specs\/|[0-9]{3}-[^\s]*phase)/;
  const violations = files.filter((filePath) => {
    const source = fs.readFileSync(filePath, 'utf8');
    const comments = source.match(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g) || [];
    return comments.some((comment) => banned.test(comment));
  });
  assert.deepEqual(violations, [], 'code comments contain ephemeral artifact labels');
  return { files: files.length };
}

function verify() {
  const before = hashTree(TARGET_ROOT);
  const generated = buildArtifacts();
  const artifactSet = assertArtifactSet(generated.artifacts);
  const schemas = verifySchemas(generated);
  const determinism = verifyDeterminism(generated);
  const scorer = verifyScorer(generated.fixtures);
  const parity = verifyParity(generated.policy);
  const algebra = verifyAlgebra(generated);
  const rollback = verifyRollback(generated.policy);
  const protectedFiles = verifyProtectedFiles();
  const syntax = verifySyntax();
  const after = hashTree(TARGET_ROOT);
  assert.deepEqual(after, before, 'validation changed target bytes');
  return {
    algebra,
    artifactSet,
    determinism,
    parity,
    protectedFiles,
    readOnly: true,
    rollback,
    schemas,
    scorer,
    syntax,
  };
}

function printReport(report) {
  process.stdout.write(
    `[system-skill-advisor-rollout] PASS build deterministic compile_runs=${report.determinism.compileRuns} `
      + `process_runs=${report.determinism.processRuns} artifact_runs=${report.determinism.artifactRuns} `
      + `artifacts=${report.artifactSet.artifactCount} body_sha256=${report.determinism.bodySha256}\n`,
  );
  process.stdout.write(
    `[system-skill-advisor-rollout] PASS projections schema=V1 count=${report.schemas.projectionCount} `
      + `effective=${report.schemas.effectivePolicyHash}\n`,
  );
  process.stdout.write(
    `[system-skill-advisor-rollout] PASS real-scorer rows=${report.scorer.rows} `
      + `falsifier_rejected=${report.scorer.falsifierRejected} subprocess=true\n`,
  );
  process.stdout.write(
    `[system-skill-advisor-rollout] PASS shadow-parity routes=${report.parity.rows.length} `
      + `matches=${report.parity.matches} mismatches=${report.parity.mismatches} `
      + `effects=${report.parity.effectCount} legacy_authoritative=${report.parity.legacyServingAuthority} `
      + `gold_mutation=${report.parity.goldMutation}\n`,
  );
  process.stdout.write(
    `[system-skill-advisor-rollout] PASS closed-algebra candidates=${report.algebra.degeneracy.candidateCount} `
      + `intents=${report.algebra.intentCount} leaves=${report.algebra.routedLeafCount} `
      + `zero_signal=defer ambiguous=clarify-once forbidden=reject rank_calls=0 `
      + `bundle_rules=0 handoff_edges=0 overlay=null provenance=${report.algebra.degeneracy.P}\n`,
  );
  process.stdout.write(
    `[system-skill-advisor-rollout] PASS rollback pre=${report.rollback.preActivationHash} `
      + `restored=${report.rollback.restoredHash} active_generation=${report.rollback.activeGeneration} `
      + `fence=${report.rollback.fencingEpoch} stale_rejected=${report.rollback.staleRejected}\n`,
  );
  report.protectedFiles.files.forEach((file) => {
    process.stdout.write(
      `[system-skill-advisor-rollout] PASS protected ${file.fileName} sha256=${file.sha256}\n`,
    );
  });
  process.stdout.write(
    `[system-skill-advisor-rollout] PASS node-check files=${report.syntax.files} comment_hygiene=pass\n`,
  );
  process.stdout.write(
    `[system-skill-advisor-rollout] SUMMARY result=GREEN authority=legacy shadow_only=true `
      + `read_only=${report.readOnly}\n`,
  );
}

if (process.argv.includes('--write')) generateArtifacts();
const report = verify();
printReport(report);
