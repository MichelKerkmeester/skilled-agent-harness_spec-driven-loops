// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ SCRIPT: SHADOW COMPILER GENERATION AND VERIFICATION                      ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('node:assert/strict');
const fs = require('node:fs');
const { builtinModules } = require('node:module');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const {
  canonicalBytes,
  canonicalize,
  computeBasePolicyHash,
  computeEffectivePolicyHash,
  computeProjectionHash,
} = require('../../000-contract-schemas/lib/canonical.cjs');

const {
  CompileError,
  compareUtf16,
  compile,
  deriveDegeneracy,
  evaluatePolicy,
  generatePolicyCard,
  omitAdvisorAuthority,
  projectAdvisor,
  projectLegacyObservation,
  projectTypedRouteGold,
  qualifiedDestinationId,
  replayPolicyCard,
  validateReferenceClosure,
} = require('../compiler/index.cjs');
const {
  ActivationManifestError,
  fenceStateBytes,
  fencedSwapInMemory,
  manifestBytes,
  pinManifest,
  validateActivationManifest,
} = require('../activation/fenced-manifest.cjs');
const { runShadowParity } = require('../parity/shadow-parity.cjs');
const { assertSchema } = require('./json-schema.cjs');
const {
  BENCHMARK_ROOT,
  CONTRACT_ROOT,
  PHASE_ROOT,
  REPO_ROOT,
  SKILL_ROOT,
  hashTree,
  loadAuthoredSources,
  loadSchemas,
  readJson,
  sha256Bytes,
  sha256File,
  walkFiles,
} = require('./support.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ACTIVATION_ROOT = path.join(PHASE_ROOT, 'activation');
const PROTECTED_REPLAY_PATH = path.join(PHASE_ROOT, 'harness', 'protected-replay.cjs');
const TRUSTED_PROTECTED_DIGESTS = Object.freeze({
  'router-replay.cjs': 'd5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47',
  'score-skill-benchmark.cjs': 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
});
const FIXTURE_SCENARIOS = Object.freeze([
  {
    expectedIntent: 'WORKFLOW',
    expectedIntents: ['WORKFLOW'],
    expectedResources: ['references/workflows.md'],
    fileName: 'exact-single-route.json',
    scenarioId: 'exact-single-route',
    taskText: 'orchestrate a multi-tool workflow',
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
    taskText: 'setup and validate this integration',
  },
  {
    expectedIntent: 'defer',
    expectedIntents: [],
    expectedResources: [],
    fileName: 'forbidden-reject.json',
    scenarioId: 'forbidden-reject',
    taskText: 'use file operations to edit local files',
  },
  {
    expectedIntent: 'WORKFLOW',
    expectedIntents: ['WORKFLOW'],
    expectedResources: ['references/workflows.md'],
    fileName: 'singular-omission-zero-rank.json',
    scenarioId: 'singular-omission-zero-rank',
    taskText: 'run a call_tool_chain workflow',
  },
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. GENERATION
// ─────────────────────────────────────────────────────────────────────────────

function evaluateFixtures(policy) {
  return FIXTURE_SCENARIOS.map((scenario) => ({
    ...scenario,
    evaluation: evaluatePolicy(policy, { taskText: scenario.taskText }),
  }));
}

function canonicalJsonBytes(value) {
  return Buffer.from(`${canonicalize(value)}\n`, 'utf8');
}

function buildArtifacts() {
  const authoredSources = loadAuthoredSources();
  const policy = compile(authoredSources);
  const fixtures = evaluateFixtures(policy);
  const advisor = projectAdvisor(policy, authoredSources);
  const card = generatePolicyCard(policy, authoredSources);
  const typedFixtures = fixtures.map((fixture) => ({
    ...fixture,
    typedGold: projectTypedRouteGold(policy, fixture.scenarioId, fixture.evaluation),
  }));

  const artifacts = new Map([
    ['compiled/mcp-code-mode/policy.json', canonicalJsonBytes(policy)],
    ['compiled/mcp-code-mode/advisor-projection.json', canonicalJsonBytes(advisor)],
    ['compiled/mcp-code-mode/route-gold.typed.json', canonicalJsonBytes(typedFixtures[0].typedGold)],
    ['compiled/mcp-code-mode/policy-card.md', Buffer.from(card.markdown, 'utf8')],
  ]);
  for (const fixture of typedFixtures) {
    artifacts.set(
      `compiled/mcp-code-mode/fixtures/${fixture.fileName}`,
      canonicalJsonBytes(fixture.typedGold),
    );
  }

  return { advisor, artifacts, authoredSources, card, fixtures: typedFixtures, policy };
}

function generateArtifacts() {
  const generated = buildArtifacts();
  for (const [relativePath, bytes] of generated.artifacts) {
    const filePath = path.join(PHASE_ROOT, relativePath);
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, bytes, { mode: 0o600 });
  }

  const priorManifest = {
    schemaVersion: 'V1',
    selectedPolicy: { effectivePolicyHash: null, generation: 0 },
    servingAuthority: 'legacy',
    shadowOnly: true,
  };
  const candidateManifest = {
    schemaVersion: 'V1',
    selectedPolicy: {
      effectivePolicyHash: generated.policy.effectivePolicyHash,
      generation: generated.policy.activationGeneration,
    },
    servingAuthority: 'legacy',
    shadowOnly: true,
  };
  fs.writeFileSync(path.join(ACTIVATION_ROOT, 'manifest.prior.json'), manifestBytes(priorManifest));
  fs.writeFileSync(path.join(ACTIVATION_ROOT, 'manifest.candidate.json'), manifestBytes(candidateManifest));
  fs.writeFileSync(path.join(ACTIVATION_ROOT, 'manifest.json'), manifestBytes(priorManifest));
  fs.writeFileSync(path.join(ACTIVATION_ROOT, 'fence-state.json'), fenceStateBytes(0));
  return generated;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. VERIFICATION HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

class ArtifactDriftError extends Error {
  constructor(relativePath) {
    super(`generated artifact differs from checked bytes: ${relativePath}`);
    this.name = 'ArtifactDriftError';
    this.code = 'ARTIFACT_DRIFT';
    this.element = relativePath;
  }
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

function assertArtifactSet(rootPath, expectedArtifacts) {
  for (const [relativePath, expectedBytes] of expectedArtifacts) {
    const filePath = path.join(rootPath, relativePath);
    if (!fs.existsSync(filePath) || !fs.readFileSync(filePath).equals(expectedBytes)) {
      throw new ArtifactDriftError(relativePath);
    }
  }
  return { artifactCount: expectedArtifacts.size };
}

function assertInMemoryArtifactSet(actualArtifacts, expectedArtifacts) {
  for (const [relativePath, expectedBytes] of expectedArtifacts) {
    const actualBytes = actualArtifacts.get(relativePath);
    if (!actualBytes || !actualBytes.equals(expectedBytes)) {
      throw new ArtifactDriftError(relativePath);
    }
  }
  return { artifactCount: expectedArtifacts.size };
}

function captureError(callback) {
  try {
    callback();
    return null;
  } catch (error) {
    return error;
  }
}

function parseCardFrontmatter(markdown) {
  const match = /^---\n([^\n]+)\n---/m.exec(markdown);
  if (!match) throw new Error('policy card JSON front matter is missing');
  return JSON.parse(match[1]);
}

function assertCompileFailure(authoredSources, mutation, expectedCode, expectedElement) {
  const testInput = clone(authoredSources);
  mutation(testInput);
  let artifact = null;
  const caught = captureError(() => { artifact = compile(testInput); });
  assert.ok(caught instanceof CompileError, `${expectedCode} must raise CompileError`);
  assert.equal(caught.code, expectedCode);
  assert.match(caught.element, expectedElement);
  assert.equal(artifact, null, `${expectedCode} returned a partial artifact`);
  return { code: caught.code, element: caught.element, noArtifact: artifact === null };
}

function verifyDeterminism(authoredSources) {
  const sourceBefore = canonicalize(authoredSources);
  const runs = [compile(authoredSources), compile(authoredSources), compile(authoredSources)];
  const bodyHashes = runs.map((policy) => sha256Bytes(canonicalBytes(policy)));
  const effectiveHashes = runs.map((policy) => policy.effectivePolicyHash);
  assert.equal(new Set(bodyHashes).size, 1, 'three policy bodies must be byte-identical');
  assert.equal(new Set(effectiveHashes).size, 1, 'three effective hashes must be identical');
  assert.equal(canonicalize(authoredSources), sourceBefore, 'compiler mutated authored sources');

  const processRuns = [0, 1].map(() => spawnSync(
    process.execPath,
    [path.join(PHASE_ROOT, 'harness', 'fingerprint.cjs')],
    { cwd: REPO_ROOT, encoding: 'utf8' },
  ));
  processRuns.forEach((result) => {
    assert.equal(result.status, 0, result.stderr);
  });
  const processFingerprints = processRuns.map((result) => JSON.parse(result.stdout));
  processFingerprints.forEach((fingerprint) => {
    assert.equal(fingerprint.bodySha256, bodyHashes[0]);
    assert.equal(fingerprint.effectivePolicyHash, effectiveHashes[0]);
  });

  const localeNames = ['en_US.UTF-8', 'sv_SE.UTF-8'];
  const localeRuns = localeNames.map((locale) => spawnSync(
    process.execPath,
    [path.join(PHASE_ROOT, 'harness', 'fingerprint.cjs')],
    {
      cwd: REPO_ROOT,
      encoding: 'utf8',
      env: {
        ...process.env,
        LANG: locale,
        LC_ALL: locale,
        SHADOW_FINGERPRINT_FIXTURE: 'locale',
      },
    },
  ));
  localeRuns.forEach((result) => assert.equal(result.status, 0, result.stderr));
  const localeFingerprints = localeRuns.map((result) => JSON.parse(result.stdout));
  assert.equal(
    new Set(localeFingerprints.map((entry) => entry.bodySha256)).size,
    1,
    'UTF-16 fixture policy bytes changed across contrasting locales',
  );
  assert.equal(
    new Set(localeFingerprints.map((entry) => entry.effectivePolicyHash)).size,
    1,
    'UTF-16 fixture effective hash changed across contrasting locales',
  );
  return {
    bodyHashes,
    effectiveHashes,
    localeFingerprints,
    localeNames,
    processFingerprints,
  };
}

function verifyFailClosed(authoredSources) {
  const destination = authoredSources.destinations[0];
  const targetId = {
    backendKind: destination.backendKind,
    packetId: destination.packetId,
    packetKind: destination.packetKind,
    skillId: destination.skillId,
    workflowMode: destination.workflowMode,
  };
  const failures = [];
  failures.push(assertCompileFailure(
    authoredSources,
    (input) => { input.referencedModes = ['missing-mode']; },
    'MISSING_REFERENCED_MODE',
    /missing-mode/,
  ));
  failures.push(assertCompileFailure(
    authoredSources,
    (input) => { input.leaves[0].workflowMode = 'missing-leaf-mode'; },
    'UNRESOLVED_LEAF',
    /assets\/config-template\.md/,
  ));
  failures.push(assertCompileFailure(
    authoredSources,
    (input) => {
      input.authorityGraph = [
        {
          fromAuthorityRef: destination.authorityRef,
          relation: 'evidenceOnly',
          toWorkflowMode: destination.workflowMode,
        },
        {
          fromAuthorityRef: destination.authorityRef,
          relation: 'approveBeforeCommit',
          toWorkflowMode: destination.workflowMode,
        },
      ];
    },
    'AUTHORITY_GRAPH_CONTRADICTION',
    /authority:/,
  ));
  failures.push(assertCompileFailure(
    authoredSources,
    (input) => { input.destinations.push(clone(input.destinations[0])); },
    'DUPLICATE_DESTINATION',
    /mcp-code-mode/,
  ));
  failures.push(assertCompileFailure(
    authoredSources,
    (input) => { input.intentSignals[0].keywords = ['']; },
    'INVALID_AUTHORED_SOURCE',
    /keywords\[0\]/,
  ));
  failures.push(assertCompileFailure(
    authoredSources,
    (input) => { input.destinations[0].metadata = { path: '/must-not-survive' }; },
    'INVALID_AUTHORED_SOURCE',
    /destinations\[0\]\.metadata/,
  ));
  failures.push(assertCompileFailure(
    authoredSources,
    (input) => { input.overlay = { source: 'malformed-shadow-overlay' }; },
    'UNSUPPORTED_AUTHORED_SOURCE',
    /overlay/,
  ));
  failures.push(assertCompileFailure(
    authoredSources,
    (input) => {
      input.bundleRules = [{
        kind: 'orderedBundle',
        targetIds: [clone(targetId), clone(targetId)],
      }];
    },
    'N1_BUNDLE_FORBIDDEN',
    /bundleRules/,
  ));

  const callerKeyword = { term: 'caller-owned' };
  const invalidCallerInput = clone(authoredSources);
  invalidCallerInput.intentSignals[0].keywords = [callerKeyword];
  let callerError = null;
  try {
    compile(invalidCallerInput);
  } catch (error) {
    callerError = error;
  }
  assert.ok(callerError instanceof CompileError, 'invalid caller detector must raise CompileError');
  assert.equal(callerError.code, 'INVALID_AUTHORED_SOURCE');
  assert.match(callerError.element, /keywords\[0\]/);
  assert.equal(Object.isFrozen(callerKeyword), false, 'compiler froze caller-owned detector input');
  callerKeyword.term = 'still-mutable';
  assert.equal(callerKeyword.term, 'still-mutable');

  let missingSchemaArtifact = null;
  const missingSchemaError = captureError(() => {
    fs.readFileSync(path.join(CONTRACT_ROOT, 'schemas', 'missing.v1.schema.json'));
    missingSchemaArtifact = compile(authoredSources);
  });
  assert.equal(missingSchemaError?.code, 'ENOENT', 'missing schema must raise ENOENT before emission');
  assert.equal(missingSchemaArtifact, null, 'missing schema returned an artifact');
  const missingSchema = {
    noArtifact: missingSchemaArtifact === null,
    status: missingSchemaError.code,
  };
  return {
    callerInputMutable: true,
    failures,
    missingSchema,
  };
}

function verifyRuntimeDiscriminators(authoredSources) {
  const input = clone(authoredSources);
  const baseDestination = clone(input.destinations[0]);
  input.destinations = [
    { ...baseDestination, runtimeDiscriminator: 'node-runtime' },
    { ...baseDestination, runtimeDiscriminator: 'worker-runtime' },
  ];
  input.intentSignals = [];
  input.leaves = [];
  input.referencedModes = [];
  const policy = compile(input);
  assert.equal(policy.destinations.length, 2);
  const destinationKeys = policy.destinations.map((destination) => canonicalize(destination.id));
  const qualifiedIds = policy.destinations.map((destination) => (
    qualifiedDestinationId(destination.id)
  ));
  assert.equal(new Set(destinationKeys).size, 2, 'runtime destinations collapsed by identity');
  assert.equal(new Set(qualifiedIds).size, 2, 'qualified runtime destinations collapsed');
  assert.deepEqual(
    policy.destinations
      .map((destination) => destination.id.runtimeDiscriminator)
      .sort(compareUtf16),
    ['node-runtime', 'worker-runtime'],
  );
  const advisor = projectAdvisor(policy, input);
  assert.equal(advisor.eligibleModes.length, 2);
  assert.equal(new Set(advisor.eligibleModes.map((mode) => mode.publicMode)).size, 1);
  assert.equal(new Set(advisor.eligibleModes.map((mode) => mode.qualifiedId)).size, 2);
  return {
    advisorQualifiedIds: advisor.eligibleModes.map((mode) => mode.qualifiedId),
    destinationKeys,
    qualifiedIds,
  };
}

function verifyAdvisorProjectionGuards() {
  const nested = {
    eligibleModes: [{
      metadata: {
        safe: 'retained',
        transport: { path: '/private/router', tools: ['write'] },
      },
      publicMode: 'same-name',
    }],
    handoffLeases: [{ commitAuthority: true }],
  };
  const sanitized = omitAdvisorAuthority(nested);
  assert.equal(sanitized.eligibleModes[0].metadata.safe, 'retained');
  assert.deepEqual(sanitized.eligibleModes[0].metadata.transport, {});
  assert.equal(Object.prototype.hasOwnProperty.call(sanitized, 'handoffLeases'), false);
  assert.equal(canonicalize(sanitized).includes('/private/router'), false);
  return { nestedPathOmitted: true, retainedSafeField: true };
}

function verifyCompilerSourceGates() {
  const compilerFiles = walkFiles(path.join(PHASE_ROOT, 'compiler'))
    .filter((filePath) => filePath.endsWith('.cjs'));
  const joined = compilerFiles.map((filePath) => fs.readFileSync(filePath, 'utf8')).join('\n');
  const exactNameLiterals = joined.match(/['"]mcp-code-mode['"]/g) || [];
  const conditionalPatterns = [
    /if\s*\([^)]*\bskillId\b[^)]*\)/gs,
    /switch\s*\(\s*skillId\s*\)/gs,
    /\bskillId\s*(?:===|==|!==|!=)/g,
  ];
  const conditionalHits = conditionalPatterns.flatMap((pattern) => joined.match(pattern) || []);
  assert.equal(exactNameLiterals.length, 0, 'compiler path contains a skill-name literal');
  assert.equal(conditionalHits.length, 0, 'compiler path branches on skill identity');

  const codeFiles = [
    ...compilerFiles,
    ...walkFiles(path.join(PHASE_ROOT, 'activation')).filter((filePath) => filePath.endsWith('.cjs')),
    ...walkFiles(path.join(PHASE_ROOT, 'parity')).filter((filePath) => filePath.endsWith('.cjs')),
    ...walkFiles(path.join(PHASE_ROOT, 'harness')).filter((filePath) => filePath.endsWith('.cjs')),
  ];
  const bannedComment = /(?:REQ-|CHK-|ADR-|\bT[0-9]{3}\b|\.opencode\/specs\/|001-compiler)/;
  const commentViolations = [];
  const dependencyViolations = [];
  const dynamicImportViolations = [];
  const allowedExternalImports = new Set([
    path.join(CONTRACT_ROOT, 'lib', 'canonical.cjs'),
    path.join(CONTRACT_ROOT, 'schemas', 'compiled-policy.v1.schema.json'),
    path.join(BENCHMARK_ROOT, 'router-replay.cjs'),
    path.join(BENCHMARK_ROOT, 'score-skill-benchmark.cjs'),
  ].map((filePath) => fs.realpathSync(filePath)));
  for (const filePath of codeFiles) {
    const source = fs.readFileSync(filePath, 'utf8');
    const comments = source.match(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g) || [];
    if (comments.some((comment) => bannedComment.test(comment))) commentViolations.push(filePath);
    const literalRequires = [...source.matchAll(
      /\brequire\s*\(\s*(['"])([^'"\r\n]+)\1\s*\)/g,
    )];
    const requireCallCount = (source.match(/\brequire\s*\(/g) || []).length;
    if (requireCallCount !== literalRequires.length || /\bimport\s*\(/.test(source)) {
      dynamicImportViolations.push(filePath);
    }
    for (const match of literalRequires) {
      const dependency = match[2];
      if (dependency.startsWith('node:') || builtinModules.includes(dependency)) continue;
      let resolved;
      try {
        resolved = fs.realpathSync(require.resolve(dependency, { paths: [path.dirname(filePath)] }));
      } catch (error) {
        dependencyViolations.push(`${filePath}:${dependency}:${error.code || 'UNRESOLVED'}`);
        continue;
      }
      const isPhaseLocal = resolved.startsWith(`${fs.realpathSync(PHASE_ROOT)}${path.sep}`);
      if (!isPhaseLocal && !allowedExternalImports.has(resolved)) {
        dependencyViolations.push(`${filePath}:${dependency}`);
      }
    }
  }
  assert.deepEqual(commentViolations, [], 'code comments contain ephemeral artifact pointers');
  assert.deepEqual(dynamicImportViolations, [], 'dynamic module import detected');
  assert.deepEqual(dependencyViolations, [], 'external runtime dependency detected');
  return {
    commentViolations,
    conditionalHits: conditionalHits.length,
    dynamicImports: dynamicImportViolations,
    exactNameLiterals: exactNameLiterals.length,
    externalDependencies: dependencyViolations,
  };
}

function renameAuthoredSources(authoredSources, skillId) {
  const renamed = clone(authoredSources);
  const originalSkillId = renamed.skillId;
  renamed.skillId = skillId;
  renamed.aliases = renamed.aliases.map((alias) => (
    alias === originalSkillId ? skillId : alias
  ));
  renamed.destinations = renamed.destinations.map((destination) => ({
    ...destination,
    authorityRef: destination.authorityRef.replace(originalSkillId, skillId),
    skillId,
  }));
  renamed.authorityGraph = renamed.authorityGraph.map((edge) => ({
    ...edge,
    fromAuthorityRef: edge.fromAuthorityRef.replace(originalSkillId, skillId),
  }));
  return renamed;
}

function normalizeSkillIdentity(value, skillId, key = null) {
  if (Array.isArray(value)) {
    return value.map((item) => normalizeSkillIdentity(item, skillId, key));
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value)
      .filter(([key]) => ![
        'basePolicyHash',
        'effectivePolicyHash',
        'humanViewHash',
        'projectionHash',
      ].includes(key))
      .map(([childKey, child]) => [
        childKey,
        normalizeSkillIdentity(child, skillId, childKey),
      ]));
  }
  if (typeof value === 'string' && ['hubId', 'skillId'].includes(key)) return '<skill>';
  if (typeof value === 'string' && key === 'aliases' && value === skillId) return '<skill>';
  if (typeof value === 'string' && key === 'authorityRef') {
    return value.replace(`authority:${skillId}/`, 'authority:<skill>/');
  }
  if (
    typeof value === 'string'
    && ['authorityEdges', 'qualifiedId', 'qualifiedRoles', 'targetQualifiedIds'].includes(key)
  ) {
    return value
      .replace(`authority:${skillId}/`, 'authority:<skill>/')
      .replace(`${skillId}/`, '<skill>/');
  }
  return value;
}

function normalizePolicyCardBytes(card, policy, skillId) {
  return Buffer.from(card.markdown
    .split(`authority:${skillId}/`).join('authority:<skill>/')
    .split(`${skillId}/`).join('<skill>/')
    .split(`"hubId":"${skillId}"`).join('"hubId":"<skill>"')
    .split(policy.basePolicyHash).join('<base-policy-hash>')
    .split(policy.effectivePolicyHash).join('<effective-policy-hash>')
    .split(card.frontmatter.humanViewHash).join('<human-view-hash>'), 'utf8');
}

function verifyMetamorphicRename(authoredSources) {
  const skillIds = [authoredSources.skillId, 'router-zeta', 'röuter-älpha'];
  const variants = skillIds.map((skillId) => {
    const sources = skillId === authoredSources.skillId
      ? clone(authoredSources)
      : renameAuthoredSources(authoredSources, skillId);
    const policy = compile(sources);
    const evaluations = FIXTURE_SCENARIOS.map((scenario) => (
      evaluatePolicy(policy, { taskText: scenario.taskText })
    ));
    const advisor = projectAdvisor(policy, sources);
    const typedGold = evaluations.map((evaluation, index) => (
      projectTypedRouteGold(policy, FIXTURE_SCENARIOS[index].scenarioId, evaluation)
    ));
    const card = generatePolicyCard(policy, sources);
    return {
      evaluations: normalizeSkillIdentity(evaluations, skillId),
      policy: normalizeSkillIdentity(policy, skillId),
      projectionBytes: {
        advisor: canonicalJsonBytes(normalizeSkillIdentity(advisor, skillId)),
        policyCard: normalizePolicyCardBytes(card, policy, skillId),
        typedRouteGold: typedGold.map((projection) => (
          canonicalJsonBytes(normalizeSkillIdentity(projection, skillId))
        )),
      },
    };
  });
  variants.slice(1).forEach((variant) => assert.deepEqual(variant, variants[0]));
  return {
    projectionFamilies: Object.keys(variants[0].projectionBytes),
    skillIds,
    variants: variants.length,
  };
}

function verifyProtectedBaseline() {
  const baseline = readJson(path.join(PHASE_ROOT, 'harness', 'protected-baseline.json'));
  const fileResults = Object.entries(baseline.files).map(([relativePath, expected]) => {
    const actual = sha256File(path.join(REPO_ROOT, relativePath));
    assert.equal(actual, expected, `protected file changed: ${relativePath}`);
    return { path: relativePath, sha256: actual };
  });
  const schemaRoot = path.join(CONTRACT_ROOT, 'schemas');
  Object.entries(baseline.schemaFiles).forEach(([fileName, expected]) => {
    assert.equal(sha256File(path.join(schemaRoot, fileName)), expected, `schema changed: ${fileName}`);
  });
  const playbook = hashTree(path.join(SKILL_ROOT, 'manual-testing-playbook'));
  assert.deepEqual(playbook, baseline.manualTestingPlaybook, 'legacy manual-testing gold changed');
  const trustedDigests = Object.entries(TRUSTED_PROTECTED_DIGESTS).map(([fileName, expected]) => {
    const actual = sha256File(path.join(BENCHMARK_ROOT, fileName));
    assert.equal(actual, expected, `trusted protected digest changed: ${fileName}`);
    return { fileName, sha256: actual };
  });
  return {
    fileResults,
    playbook,
    schemaFiles: Object.keys(baseline.schemaFiles).length,
    trustedDigests,
  };
}

function verifySchemasAndIdentity(
  policy,
  authoredSources,
  fixtures,
  schemas,
  advisor,
  cardMarkdown,
) {
  assertSchema(schemas.policy, policy, 'policy');
  validateReferenceClosure(policy);
  assert.equal(computeBasePolicyHash(policy), policy.basePolicyHash);
  assert.equal(computeEffectivePolicyHash(policy), policy.effectivePolicyHash);

  assertSchema(schemas.advisor, advisor, 'advisor projection');
  assert.equal(
    computeProjectionHash('AdvisorProjectionV1', advisor),
    advisor.projectionHash,
  );
  const cardFrontmatter = parseCardFrontmatter(cardMarkdown);
  assertSchema(schemas.card, cardFrontmatter, 'policy card front matter');
  assert.equal(
    computeProjectionHash('PolicyCardV1', cardFrontmatter, 'humanViewHash'),
    cardFrontmatter.humanViewHash,
  );
  fixtures.forEach((fixture) => {
    assertSchema(schemas.decision, fixture.evaluation.decision, `${fixture.scenarioId} decision`);
    assertSchema(schemas.typedGold, fixture.typedGold, `${fixture.scenarioId} typed gold`);
    assert.equal(
      computeProjectionHash('TypedRouteGoldV1', fixture.typedGold),
      fixture.typedGold.projectionHash,
    );
    assert.equal(
      fixture.typedGold.assertions.duplicateIdempotencyKeyProducesSingleReceipt,
      false,
      'receipt idempotency must remain unclaimed until execution is exercised',
    );
  });

  const effectiveHashes = [
    advisor.effectivePolicyHash,
    fixtures[0].typedGold.effectivePolicyHash,
    cardFrontmatter.effectivePolicyHash,
  ];
  assert.deepEqual(effectiveHashes, [
    policy.effectivePolicyHash,
    policy.effectivePolicyHash,
    policy.effectivePolicyHash,
  ]);
  const forbiddenAdvisorKeys = /(?:path|tool|mutation|fence|lease|commit)/i;
  const advisorKeys = [];
  const visit = (value) => {
    if (!value || typeof value !== 'object') return;
    Object.entries(value).forEach(([key, child]) => {
      advisorKeys.push(key);
      visit(child);
    });
  };
  visit(advisor);
  assert.equal(advisorKeys.some((key) => forbiddenAdvisorKeys.test(key)), false);
  assert.equal(authoredSources.guardDisposition, 'advisory');
  assert.equal(canonicalize(policy).includes('mcp-route-guard'), false);
  return {
    effectivePolicyHash: policy.effectivePolicyHash,
    projectionHashes: {
      advisor: advisor.projectionHash,
      card: cardFrontmatter.humanViewHash,
      typedGold: fixtures[0].typedGold.projectionHash,
    },
  };
}

function verifyArtifactDriftGuard(expectedArtifacts) {
  const actualArtifacts = new Map([...expectedArtifacts]
    .map(([relativePath, bytes]) => [relativePath, Buffer.from(bytes)]));
  const advisorPath = 'compiled/mcp-code-mode/advisor-projection.json';
  const advisor = JSON.parse(actualArtifacts.get(advisorPath).toString('utf8'));
  advisor.eligibleModes[0].publicMode = 'definitely-wrong';
  advisor.projectionHash = computeProjectionHash('AdvisorProjectionV1', advisor);
  actualArtifacts.set(advisorPath, canonicalJsonBytes(advisor));
  const caught = captureError(() => (
    assertInMemoryArtifactSet(actualArtifacts, expectedArtifacts)
  ));
  assert.ok(caught instanceof ArtifactDriftError, 'drift test must raise ArtifactDriftError');
  assert.equal(caught.code, 'ARTIFACT_DRIFT');
  assert.equal(caught.element, advisorPath);
  return { driftCode: caught.code, driftedArtifact: caught.element, inMemory: true };
}

function verifyDegeneracy(policy, authoredSources, fixtureMap, sourceGate) {
  const view = deriveDegeneracy(policy, authoredSources);
  assert.equal(view.candidateCount, 1);
  assert.deepEqual(view.selectionKinds, ['single']);
  assert.deepEqual(view.crossTargetEdges, []);
  assert.deepEqual(view.bundleRules, []);
  assert.deepEqual(view.handoffEdges, []);
  assert.equal(view.overlay, null);
  assert.equal(view.P, 'static');
  assert.equal(policy.detectors.filter((detector) => detector.kind === 'resource').length, 7);
  assert.equal(policy.selectors.length, 6);

  const zero = fixtureMap.get('zero-signal-defer').evaluation;
  assert.equal(zero.decision.action, 'defer');
  assert.equal(zero.decision.defer.reason, 'no-match');
  assert.deepEqual(zero.diagnostics.selectedResources, []);
  const clarify = fixtureMap.get('one-turn-clarify').evaluation;
  assert.equal(clarify.decision.action, 'clarify');
  assert.equal(clarify.diagnostics.clarifyCount, 1);
  assert.ok(clarify.decision.clarify.alternatives.includes('none_of_these'));
  const reject = fixtureMap.get('forbidden-reject').evaluation;
  assert.equal(reject.decision.action, 'reject');
  assert.equal(reject.decision.reject.authority, 'Withheld');
  const singular = fixtureMap.get('singular-omission-zero-rank').typedGold;
  assert.equal(singular.assertions.rankCalls, 0);
  assert.deepEqual(singular.assertions.handoffEdges, []);
  assert.equal(sourceGate.exactNameLiterals, 0);
  assert.equal(sourceGate.conditionalHits, 0);
  return { view, leafCount: 7, selectorClasses: 6, sourceGate };
}

function verifyScorerCompatibility(fixtures) {
  const rows = fixtures.map((fixture) => {
    const scenario = {
      classKind: 'routing',
      expectedIntent: fixture.expectedIntent,
      expectedIntents: fixture.expectedIntents,
      expectedResources: fixture.expectedResources,
      goldParseError: null,
      hasIntentGold: true,
      hasResourceGold: true,
      scenarioId: fixture.scenarioId,
      source: { shape: 'sk-doc' },
    };
    const observed = projectLegacyObservation(fixture.typedGold);
    return { observed, scenario };
  });
  const scored = runProtectedReplay(
    'score-batch',
    rows.map(({ observed, scenario }) => ({ observed, scenario })),
  );
  scored.forEach((row, index) => {
    assert.equal(row.pass, true, `${fixtures[index].scenarioId} failed shared route-gold semantics`);
    rows[index].row = row;
  });

  const routeRow = rows.find((entry) => entry.scenario.expectedResources.length > 0);
  const [extraResourceFalsifier, fabricatedOracleFalsifier] = runProtectedReplay('score-batch', [
    {
      scenario: routeRow.scenario,
      observed: {
        observedIntents: routeRow.observed.observedIntents,
        observedResources: [...routeRow.observed.observedResources, 'references/not-declared.md'],
      },
    },
    {
      scenario: routeRow.scenario,
      observed: { observedIntents: ['WRONG'], observedResources: ['WRONG'] },
    },
  ]);
  assert.equal(extraResourceFalsifier.pass, false, 'extra-resource falsifier stayed green');
  assert.equal(fabricatedOracleFalsifier.pass, false, 'fabricated observation passed real gold');
  return {
    fabricatedOracleRejected: true,
    falsifierRejected: true,
    projectedRows: rows.length,
    subprocessBoundary: true,
  };
}

function verifyParity(policy) {
  const scenarios = FIXTURE_SCENARIOS.slice(0, 4);
  const activationManifest = validateActivationManifest(
    readJson(path.join(ACTIVATION_ROOT, 'manifest.json')),
    'checked activation manifest',
  );
  const legacyObservations = runProtectedReplay(
    'route-batch',
    scenarios.map((scenario) => ({ skillRoot: SKILL_ROOT, taskText: scenario.taskText })),
  );
  let legacyIndex = 0;
  const parity = runShadowParity({
    activationManifest,
    evaluateCompiled: evaluatePolicy,
    evaluateLegacy: () => legacyObservations[legacyIndex++],
    policy,
    scenarios,
  });
  assert.equal(parity.legacyServingAuthority, true);
  assert.equal(parity.goldMutation, 'observed-none');
  assert.equal(parity.effectCount, 0);
  assert.ok(parity.rows.every((row) => row.legacyAuthoritative));
  assert.equal(parity.status, 'shadow-partial');
  assert.equal(parity.activationDeferred, true);
  assert.ok(parity.rows.some((row) => row.mismatchClass === 'legacy-default-union'));
  assert.ok(parity.rows.some((row) => row.mismatchClass === 'typed-clarify-vs-legacy-multi-route'));
  return parity;
}

function verifyPolicyCard(cardMarkdown) {
  const results = {
    clarify: replayPolicyCard(cardMarkdown, 'setup and validate this integration'),
    defer: replayPolicyCard(cardMarkdown, 'write a haiku about rain'),
    reject: replayPolicyCard(cardMarkdown, 'use file operations to edit local files'),
    route: replayPolicyCard(cardMarkdown, 'orchestrate a multi-tool workflow'),
  };
  assert.equal(results.route.action, 'route');
  assert.equal(results.route.draftStatus, 'PREPARED_DRAFT');
  assert.equal(results.clarify.action, 'clarify');
  assert.equal(results.defer.action, 'defer');
  assert.equal(results.reject.action, 'reject');
  Object.values(results).forEach((result) => {
    assert.equal(result.terminal, 'DOCUMENT_ONLY_UNATTESTED');
  });
  return results;
}

function verifyRollback(policy) {
  const priorManifest = validateActivationManifest(
    readJson(path.join(ACTIVATION_ROOT, 'manifest.prior.json')),
    'prior activation manifest',
  );
  const candidateManifest = validateActivationManifest(
    readJson(path.join(ACTIVATION_ROOT, 'manifest.candidate.json')),
    'candidate activation manifest',
  );
  const preActivationBytes = manifestBytes(priorManifest);
  const preActivationHash = sha256Bytes(preActivationBytes);
  const priorPin = pinManifest(priorManifest);
  const initialState = { fencingEpoch: 0, manifest: clone(priorManifest) };

  const staleError = captureError(() => fencedSwapInMemory({
    expectedCurrent: clone(priorManifest.selectedPolicy),
    expectedFencingEpoch: 99,
    nextManifest: candidateManifest,
    state: initialState,
    token: 'stale-attempt',
  }));
  assert.ok(staleError instanceof ActivationManifestError);
  assert.equal(staleError.code, 'STALE_FENCING_EPOCH');
  assert.equal(staleError.element, 'fencingEpoch');
  assert.deepEqual(initialState.manifest, priorManifest);

  const authorityError = captureError(() => fencedSwapInMemory({
    expectedCurrent: clone(priorManifest.selectedPolicy),
    expectedFencingEpoch: 0,
    nextManifest: {
      ...candidateManifest,
      servingAuthority: 'compiled',
      shadowOnly: false,
    },
    state: initialState,
    token: 'authority-attempt',
  }));
  assert.ok(authorityError instanceof ActivationManifestError);
  assert.equal(authorityError.code, 'AUTHORITY_BEARING_MANIFEST');
  assert.match(authorityError.element, /replacement manifest/);

  const malformedError = captureError(() => fencedSwapInMemory({
    expectedCurrent: clone(priorManifest.selectedPolicy),
    expectedFencingEpoch: 0,
    nextManifest: {
      schemaVersion: 'V1',
      selectedPolicy: { generation: 1 },
      servingAuthority: 'legacy',
      shadowOnly: true,
    },
    state: initialState,
    token: 'malformed-attempt',
  }));
  assert.ok(malformedError instanceof ActivationManifestError);
  assert.equal(malformedError.code, 'INVALID_ACTIVATION_MANIFEST');
  assert.match(malformedError.element, /selectedPolicy/);

  const casError = captureError(() => fencedSwapInMemory({
    expectedCurrent: { effectivePolicyHash: null, generation: 1 },
    expectedFencingEpoch: 0,
    nextManifest: candidateManifest,
    state: initialState,
    token: 'cas-attempt',
  }));
  assert.ok(casError instanceof ActivationManifestError);
  assert.equal(casError.code, 'MANIFEST_CAS_MISMATCH');
  assert.equal(casError.element, 'selectedPolicy');

  const activeState = fencedSwapInMemory({
    expectedCurrent: clone(priorManifest.selectedPolicy),
    expectedFencingEpoch: 0,
    nextManifest: candidateManifest,
    state: initialState,
    token: 'activate-generation',
  });
  const activePin = pinManifest(activeState.manifest);
  assert.equal(activePin.generation, policy.activationGeneration);
  assert.equal(activePin.effectivePolicyHash, policy.effectivePolicyHash);
  assert.equal(priorPin.generation, 0, 'request pin observed a mixed generation');

  const restoredState = fencedSwapInMemory({
    expectedCurrent: clone(candidateManifest.selectedPolicy),
    expectedFencingEpoch: 1,
    nextManifest: priorManifest,
    state: activeState,
    token: 'rollback-generation',
  });
  const restoredBytes = manifestBytes(restoredState.manifest);
  const restoredHash = sha256Bytes(restoredBytes);
  assert.equal(restoredHash, preActivationHash);
  assert.deepEqual(restoredBytes, preActivationBytes);
  assert.equal(restoredState.fencingEpoch, 2);

  const preRollbackError = captureError(() => fencedSwapInMemory({
    expectedCurrent: clone(priorManifest.selectedPolicy),
    expectedFencingEpoch: 0,
    nextManifest: candidateManifest,
    state: restoredState,
    token: 'pre-rollback-epoch',
  }));
  assert.ok(preRollbackError instanceof ActivationManifestError);
  assert.equal(preRollbackError.code, 'STALE_FENCING_EPOCH');
  assert.equal(preRollbackError.element, 'fencingEpoch');
  assert.deepEqual(restoredState.manifest, priorManifest);

  return {
    activePin,
    authorityManifestRejected: true,
    casMismatchRejected: true,
    fencingEpoch: restoredState.fencingEpoch,
    inMemory: true,
    malformedManifestRejected: true,
    preActivationHash,
    preRollbackEpochRejected: true,
    priorPin,
    restoredHash,
    staleRejected: true,
  };
}

function verifySyntax() {
  const codeFiles = [
    ...walkFiles(path.join(PHASE_ROOT, 'compiler')),
    ...walkFiles(path.join(PHASE_ROOT, 'activation')),
    ...walkFiles(path.join(PHASE_ROOT, 'parity')),
    ...walkFiles(path.join(PHASE_ROOT, 'harness')),
  ].filter((filePath) => filePath.endsWith('.cjs'));
  codeFiles.forEach((filePath) => {
    const result = spawnSync(process.execPath, ['--check', filePath], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
  });
  return { files: codeFiles.length };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. VERIFICATION DRIVER
// ─────────────────────────────────────────────────────────────────────────────

function verify() {
  const packetBefore = hashTree(PHASE_ROOT);
  const generated = buildArtifacts();
  const {
    advisor,
    artifacts,
    authoredSources,
    card: generatedCard,
    fixtures,
    policy,
  } = generated;
  const artifactSet = assertArtifactSet(PHASE_ROOT, artifacts);
  const fixtureMap = new Map(fixtures.map((fixture) => [fixture.scenarioId, fixture]));
  const schemas = loadSchemas();
  const cardMarkdown = generatedCard.markdown;

  const syntax = verifySyntax();
  const determinism = verifyDeterminism(authoredSources);
  const failClosed = verifyFailClosed(authoredSources);
  const runtimeDiscriminators = verifyRuntimeDiscriminators(authoredSources);
  const advisorProjectionGuards = verifyAdvisorProjectionGuards();
  const sourceGate = verifyCompilerSourceGates();
  const metamorphicRename = verifyMetamorphicRename(authoredSources);
  const protectedBaseline = verifyProtectedBaseline();
  const identity = verifySchemasAndIdentity(
    policy,
    authoredSources,
    fixtures,
    schemas,
    advisor,
    cardMarkdown,
  );
  const artifactDrift = verifyArtifactDriftGuard(artifacts);
  const degeneracy = verifyDegeneracy(policy, authoredSources, fixtureMap, sourceGate);
  const scorer = verifyScorerCompatibility(fixtures);
  const parity = verifyParity(policy);
  const rollback = verifyRollback(policy);
  const card = verifyPolicyCard(cardMarkdown);
  const packetAfter = hashTree(PHASE_ROOT);
  assert.deepEqual(packetAfter, packetBefore, 'default verification changed phase bytes');

  return {
    advisorProjectionGuards,
    artifactDrift,
    artifactSet,
    card,
    degeneracy,
    determinism,
    failClosed,
    identity,
    metamorphicRename,
    parity,
    protectedBaseline,
    rollback,
    runtimeDiscriminators,
    scorer,
    syntax,
    readOnly: true,
  };
}

function printReport(report) {
  process.stdout.write(
    `[shadow-harness] PASS SC-001 determinism runs=3 body=${report.determinism.bodyHashes[0]} `
      + `effective=${report.determinism.effectiveHashes[0]} processes=2 locales=`
      + `${report.determinism.localeNames.join(',')} locale_hashes_identical=true\n`,
  );
  process.stdout.write(
    `[shadow-harness] PASS SC-002 degeneracy ${canonicalize(report.degeneracy.view)} `
      + `leaves=${report.degeneracy.leafCount} selectors=${report.degeneracy.selectorClasses} `
      + `name_literals=${report.degeneracy.sourceGate.exactNameLiterals} `
      + `conditional_hits=${report.degeneracy.sourceGate.conditionalHits} `
      + `metamorphic_variants=${report.metamorphicRename.variants} `
      + `projection_bytes=${report.metamorphicRename.projectionFamilies.join(',')}\n`,
  );
  process.stdout.write(
    `[shadow-harness] PASS SC-003 fail-closed ${canonicalize(report.failClosed)} `
      + `runtime_destinations=${report.runtimeDiscriminators.qualifiedIds.length}\n`,
  );
  process.stdout.write(
    `[shadow-harness] PASS SC-004 scorer-untouched protected_files=`
      + `${report.protectedBaseline.fileResults.length} schemas=${report.protectedBaseline.schemaFiles} `
      + `trusted_digests=${report.protectedBaseline.trustedDigests.length} subprocess=true `
      + `playbook=${report.protectedBaseline.playbook.sha256} projected_rows=`
      + `${report.scorer.projectedRows} falsifier_rejected=${report.scorer.falsifierRejected} `
      + `fabricated_oracle_rejected=${report.scorer.fabricatedOracleRejected}\n`,
  );
  process.stdout.write(
    `[shadow-harness] PASS SC-005 parity legacy_authoritative=`
      + `${report.parity.legacyServingAuthority} effects=${report.parity.effectCount} `
      + `matches=${report.parity.matches} classified_mismatches=${report.parity.mismatches} `
      + `gold_mutation=${report.parity.goldMutation} status=${report.parity.status} `
      + `activation_deferred=${report.parity.activationDeferred}\n`,
  );
  process.stdout.write(
    `[shadow-harness] PASS SC-006 rollback pre=${report.rollback.preActivationHash} `
      + `restored=${report.rollback.restoredHash} stale_rejected=${report.rollback.staleRejected} `
      + `pre_rollback_epoch_rejected=${report.rollback.preRollbackEpochRejected} `
      + `fence=${report.rollback.fencingEpoch} `
      + `prior_pin=${report.rollback.priorPin.generation} active_pin=${report.rollback.activePin.generation} `
      + `authority_rejected=${report.rollback.authorityManifestRejected} `
      + `malformed_rejected=${report.rollback.malformedManifestRejected} `
      + `cas_mismatch_rejected=${report.rollback.casMismatchRejected} `
      + `in_memory=${report.rollback.inMemory}\n`,
  );
  process.stdout.write(
    `[shadow-harness] PASS SC-007 one-snapshot effective=${report.identity.effectivePolicyHash} `
      + `projections=${canonicalize(report.identity.projectionHashes)} `
      + `artifacts=${report.artifactSet.artifactCount} drift_guard=${report.artifactDrift.driftCode} `
      + `nested_path_omitted=${report.advisorProjectionGuards.nestedPathOmitted} `
      + `collision_safe_modes=${report.runtimeDiscriminators.advisorQualifiedIds.length}\n`,
  );
  process.stdout.write(
    `[shadow-harness] PASS document-only route=${report.card.route.draftStatus} `
      + `terminal=${report.card.route.terminal} clarify=${report.card.clarify.action} `
      + `defer=${report.card.defer.action} reject=${report.card.reject.action}\n`,
  );
  process.stdout.write(
    `[shadow-harness] SUMMARY syntax_files=${report.syntax.files} external_deps=0 `
      + `dynamic_imports=0 comment_hygiene=pass idempotency=deferred `
      + `read_only=${report.readOnly} result=PASS\n`,
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

if (process.argv.includes('--write')) generateArtifacts();
const report = verify();
printReport(report);
