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
  deriveDegeneracy,
  projectLegacyObservation,
  replayPolicyCard,
  validateReferenceClosure,
} = require('../../../001-compiler-n1-shadow/compiler/index.cjs');
const { assertSchema } = require('../../../001-compiler-n1-shadow/harness/json-schema.cjs');
const { runActivationDrill } = require('../activation/run-drill.cjs');
const { runTargetShadowParity } = require('../parity/run-shadow.cjs');
const { FIXTURE_SCENARIOS, buildArtifacts } = require('./build.cjs');
const {
  BENCHMARK_ROOT,
  PHASE_ROOT,
  SKILL_ROOT,
  hashTree,
  loadSchemas,
  parseFallbackDefaults,
  runProtectedReplay,
  sha256Bytes,
  sha256File,
  walkFiles,
} = require('./support.cjs');

const TRUSTED_SCORER_HASHES = Object.freeze({
  'load-playbook-scenarios.cjs': '5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029',
  'router-replay.cjs': 'd5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47',
  'score-skill-benchmark.cjs': 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
});

function parseCardFrontmatter(markdown) {
  const match = /^---\n([^\n]+)\n---/m.exec(markdown);
  if (!match) throw new Error('policy card JSON front matter is missing');
  return JSON.parse(match[1]);
}

function assertArtifactSet(artifacts) {
  for (const [relativePath, expectedBytes] of artifacts) {
    const filePath = path.join(PHASE_ROOT, relativePath);
    assert.ok(fs.existsSync(filePath), `missing generated artifact: ${relativePath}`);
    assert.ok(fs.readFileSync(filePath).equals(expectedBytes), `artifact drift: ${relativePath}`);
  }
}

function assertArtifactMapsEqual(left, right) {
  assert.equal(left.size, right.size);
  for (const [relativePath, expectedBytes] of left) {
    const actualBytes = right.get(relativePath);
    assert.ok(actualBytes?.equals(expectedBytes), `non-deterministic artifact: ${relativePath}`);
  }
}

function verifyDeterminism(generated) {
  const second = buildArtifacts();
  assertArtifactMapsEqual(generated.artifacts, second.artifacts);
  assertArtifactSet(generated.artifacts);
  const processRuns = [0, 1].map(() => spawnSync(
    process.execPath,
    [path.join(PHASE_ROOT, 'harness', 'fingerprint.cjs')],
    { encoding: 'utf8' },
  ));
  processRuns.forEach((result) => assert.equal(result.status, 0, result.stderr));
  const fingerprints = processRuns.map((result) => JSON.parse(result.stdout));
  assert.equal(new Set(fingerprints.map((entry) => entry.bodySha256)).size, 1);
  assert.equal(new Set(fingerprints.map((entry) => entry.effectivePolicyHash)).size, 1);
  assert.equal(fingerprints[0].effectivePolicyHash, generated.policy.effectivePolicyHash);
  assert.equal(fingerprints[0].bodySha256, sha256Bytes(canonicalBytes(generated.policy)));
  return { artifacts: generated.artifacts.size, fingerprints };
}

function verifySchemas(generated) {
  const schemas = loadSchemas();
  assertSchema(schemas.policy, generated.policy, 'compiled policy');
  assert.equal(computeBasePolicyHash(generated.policy), generated.policy.basePolicyHash);
  assert.equal(computeEffectivePolicyHash(generated.policy), generated.policy.effectivePolicyHash);
  validateReferenceClosure(generated.policy);
  assertSchema(schemas.advisor, generated.advisor, 'advisor projection');
  assert.equal(
    computeProjectionHash('AdvisorProjectionV1', generated.advisor),
    generated.advisor.projectionHash,
  );
  const cardFrontmatter = parseCardFrontmatter(generated.card.markdown);
  assertSchema(schemas.card, cardFrontmatter, 'policy card');
  assert.equal(
    computeProjectionHash('PolicyCardV1', cardFrontmatter, 'humanViewHash'),
    cardFrontmatter.humanViewHash,
  );
  for (const fixture of generated.fixtures) {
    assertSchema(schemas.decision, fixture.evaluation.decision, `${fixture.scenarioId} decision`);
    assertSchema(schemas.typedGold, fixture.typedGold, `${fixture.scenarioId} typed gold`);
    assert.equal(
      computeProjectionHash('TypedRouteGoldV1', fixture.typedGold),
      fixture.typedGold.projectionHash,
    );
  }
  assert.ok(generated.fixtures.every(
    (fixture) => fixture.typedGold.effectivePolicyHash === generated.policy.effectivePolicyHash,
  ));
  assert.equal(cardFrontmatter.effectivePolicyHash, generated.policy.effectivePolicyHash);
  return { projectionCount: generated.fixtures.length + 2 };
}

function verifyAuthoredRouter(generated) {
  const skillMarkdown = fs.readFileSync(path.join(SKILL_ROOT, 'SKILL.md'), 'utf8');
  assert.deepEqual(parseFallbackDefaults(skillMarkdown), [
    'references/readiness/code-graph-readiness-check.md',
    'references/runtime/tool-surface.md',
  ]);
  assert.match(skillMarkdown, /DEFAULT_RESOURCE_SEMANTICS\s*=\s*"fallback-only"/);
  assert.equal(generated.authoredSources.defaultResource, null);
  assert.deepEqual(generated.authoredSources.negativeAdmissions, [
    'filename or path globbing',
    'semantic concept search without known structure',
    'text-only exact searches',
  ]);
  assert.deepEqual(
    generated.authoredSources.sourceHashes.map((source) => source.sourceId).sort(),
    ['SKILL.md', 'leaf-manifest.json'],
  );
  assert.equal(generated.policy.destinations.length, 1);
  assert.equal(generated.policy.selectors.length, 37);
  assert.equal(
    generated.policy.detectors.filter((detector) => detector.kind === 'resource').length,
    53,
  );
  assert.equal(
    generated.policy.detectors.filter((detector) => detector.kind === 'negative').length,
    3,
  );
  const view = deriveDegeneracy(generated.policy, generated.authoredSources);
  assert.deepEqual(view, {
    P: 'static',
    R: ['clarify', 'defer', 'reject'],
    T: 'exact-admission',
    bundleRules: [],
    candidateCount: 1,
    crossTargetEdges: [],
    handoffEdges: [],
    overlay: null,
    selectionKinds: ['single'],
  });
  return { defaults: 2, leaves: 53, negatives: 3, selectors: 37, view };
}

function verifyClosedAlgebra(generated) {
  const fixtureMap = new Map(generated.fixtures.map((fixture) => [fixture.scenarioId, fixture]));
  const route = fixtureMap.get('exact-single-route');
  const zero = fixtureMap.get('zero-signal-defer');
  const clarify = fixtureMap.get('one-turn-clarify');
  const reject = fixtureMap.get('forbidden-reject');
  const singular = fixtureMap.get('singular-omission-zero-rank');
  assert.equal(route.evaluation.decision.action, 'route');
  assert.deepEqual(route.evaluation.diagnostics.selectedIntents, ['TOOL_SURFACE']);
  assert.equal(zero.evaluation.decision.action, 'defer');
  assert.equal(zero.evaluation.decision.defer.reason, 'no-match');
  assert.deepEqual(zero.evaluation.diagnostics.selectedResources, []);
  assert.equal(clarify.evaluation.decision.action, 'clarify');
  assert.equal(clarify.evaluation.diagnostics.clarifyCount, 1);
  assert.equal(reject.evaluation.decision.action, 'reject');
  assert.equal(reject.evaluation.decision.reject.reason, 'forbidden');
  assert.equal(singular.typedGold.assertions.rankCalls, 0);
  assert.deepEqual(singular.typedGold.assertions.handoffEdges, []);
  for (const fixture of [zero, clarify, reject]) {
    assert.equal(Object.hasOwn(fixture.evaluation.decision, 'route'), false);
    assert.equal(canonicalize(fixture.evaluation.decision).includes('WithheldUntilVerify'), false);
    assert.deepEqual(fixture.typedGold.targetQualifiedIds, []);
    assert.deepEqual(fixture.evaluation.diagnostics.effects, []);
  }
  return { clarifyCount: 1, nonRoutes: 3, rankCalls: 0 };
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
  scored.forEach((result, index) => {
    assert.equal(result.pass, true, `${generated.fixtures[index].scenarioId} failed real scorer`);
  });
  const positive = rows[0];
  const [extraResource, fabricated] = runProtectedReplay('score-batch', [
    {
      scenario: positive.scenario,
      observed: {
        observedIntents: positive.observed.observedIntents,
        observedResources: [...positive.observed.observedResources, 'references/not-authored.md'],
      },
    },
    {
      scenario: positive.scenario,
      observed: { observedIntents: ['WRONG'], observedResources: ['WRONG'] },
    },
  ]);
  assert.equal(extraResource.pass, false);
  assert.equal(fabricated.pass, false);
  return { falsifiers: 2, rows: scored.length, subprocess: true };
}

function verifyParity(generated) {
  const scenarios = FIXTURE_SCENARIOS.slice(0, 4);
  const legacyObservations = runProtectedReplay(
    'route-batch',
    scenarios.map((scenario) => ({ skillRoot: SKILL_ROOT, taskText: scenario.taskText })),
  );
  const report = runTargetShadowParity({
    activationManifest: generated.priorManifest,
    legacyObservations,
    policy: generated.policy,
    scenarios,
  });
  assert.equal(report.legacyServingAuthority, true);
  assert.equal(report.effectCount, 0);
  assert.equal(report.goldMutation, 'observed-none');
  assert.equal(report.matches, 1);
  assert.equal(report.mismatches, 3);
  assert.deepEqual(report.rows.map((row) => row.mismatchClass), [
    null,
    'typed-defer-vs-legacy-route',
    'typed-clarify-vs-legacy-multi-route',
    'typed-reject-vs-legacy-route',
  ]);
  return report;
}

function verifyPolicyCard(generated) {
  const card = generated.card.markdown;
  const results = {
    clarify: replayPolicyCard(card, 'tool surface reference readiness check reference'),
    defer: replayPolicyCard(card, 'write a haiku about rain'),
    reject: replayPolicyCard(card, 'text-only exact searches'),
    route: replayPolicyCard(card, 'tool surface reference'),
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

function verifyProtectedScorer() {
  return Object.entries(TRUSTED_SCORER_HASHES).map(([fileName, expected]) => {
    const actual = sha256File(path.join(BENCHMARK_ROOT, fileName));
    assert.equal(actual, expected, `protected scorer changed: ${fileName}`);
    return { fileName, sha256: actual };
  });
}

function verifyGenericCompiler() {
  const root = path.resolve(PHASE_ROOT, '..', '..', '001-compiler-n1-shadow', 'compiler');
  const source = walkFiles(root)
    .filter((filePath) => filePath.endsWith('.cjs'))
    .map((filePath) => fs.readFileSync(filePath, 'utf8'))
    .join('\n');
  assert.equal(source.includes("'system-code-graph'"), false);
  assert.equal(source.includes('"system-code-graph"'), false);
  const branches = [
    /if\s*\([^)]*\bskillId\b[^)]*\)/gs,
    /switch\s*\(\s*skillId\s*\)/gs,
    /\bskillId\s*(?:===|==|!==|!=)/g,
  ].flatMap((pattern) => source.match(pattern) || []);
  assert.deepEqual(branches, []);
  return { nameLiterals: 0, skillBranches: 0 };
}

function verifySyntaxAndComments() {
  const files = walkFiles(PHASE_ROOT).filter((filePath) => filePath.endsWith('.cjs'));
  const banned = /(?:REQ-|CHK-|ADR-|\bT[0-9]{3}\b|\.opencode\/specs\/|compiler-n1-shadow)/;
  for (const filePath of files) {
    const result = spawnSync(process.execPath, ['--check', filePath], { encoding: 'utf8' });
    assert.equal(result.status, 0, result.stderr);
    const source = fs.readFileSync(filePath, 'utf8');
    const comments = source.match(/\/\/[^\n]*|\/\*[\s\S]*?\*\//g) || [];
    assert.equal(comments.some((comment) => banned.test(comment)), false, filePath);
  }
  return { files: files.length };
}

function verify() {
  const treeBefore = hashTree(PHASE_ROOT);
  const protectedBefore = verifyProtectedScorer();
  const generated = buildArtifacts();
  const determinism = verifyDeterminism(generated);
  const schemas = verifySchemas(generated);
  const authored = verifyAuthoredRouter(generated);
  const algebra = verifyClosedAlgebra(generated);
  const compiler = verifyGenericCompiler();
  const scorer = verifyScorer(generated);
  const parity = verifyParity(generated);
  const rollback = runActivationDrill(generated);
  const card = verifyPolicyCard(generated);
  const syntax = verifySyntaxAndComments();
  const protectedAfter = verifyProtectedScorer();
  assert.deepEqual(protectedAfter, protectedBefore);
  const treeAfter = hashTree(PHASE_ROOT);
  assert.deepEqual(treeAfter, treeBefore, 'validation changed target bytes');
  return {
    algebra,
    authored,
    card,
    compiler,
    determinism,
    parity,
    protectedAfter,
    rollback,
    schemas,
    scorer,
    syntax,
  };
}

function printReport(report) {
  process.stdout.write(
    `[target-harness] PASS deterministic artifacts=${report.determinism.artifacts} `
      + `processes=${report.determinism.fingerprints.length} `
      + `body=${report.determinism.fingerprints[0].bodySha256} `
      + `effective=${report.determinism.fingerprints[0].effectivePolicyHash}\n`,
  );
  process.stdout.write(
    `[target-harness] PASS authored candidateCount=${report.authored.view.candidateCount} `
      + `selectors=${report.authored.selectors} leaves=${report.authored.leaves} `
      + `defaults=fallback-only:${report.authored.defaults} negatives=${report.authored.negatives} `
      + `P=${report.authored.view.P} overlay=null compiler_name_literals=`
      + `${report.compiler.nameLiterals} compiler_skill_branches=${report.compiler.skillBranches}\n`,
  );
  process.stdout.write(
    `[target-harness] PASS algebra zero_signal=defer forbidden=reject ambiguous=clarify:1 `
      + `non_route_target_free=${report.algebra.nonRoutes} rank_calls=${report.algebra.rankCalls}\n`,
  );
  process.stdout.write(
    `[target-harness] PASS real-scorer rows=${report.scorer.rows} falsifiers=`
      + `${report.scorer.falsifiers} subprocess=${report.scorer.subprocess} projections=`
      + `${report.schemas.projectionCount}\n`,
  );
  process.stdout.write(
    `[target-harness] PASS shadow-parity legacy_authoritative=`
      + `${report.parity.legacyServingAuthority} effects=${report.parity.effectCount} `
      + `matches=${report.parity.matches} classified_mismatches=${report.parity.mismatches} `
      + `gold_mutation=${report.parity.goldMutation} status=${report.parity.status}\n`,
  );
  process.stdout.write(
    `[target-harness] PASS fenced-rollback pre=${report.rollback.priorHash} `
      + `restored=${report.rollback.restoredHash} fence=${report.rollback.fencingEpoch} `
      + `stale_rejected=${report.rollback.staleRejected} authority_rejected=`
      + `${report.rollback.authorityRejected} prior_pin=${report.rollback.priorPin.generation} `
      + `active_pin=${report.rollback.activePin.generation}\n`,
  );
  for (const file of report.protectedAfter) {
    process.stdout.write(`[target-harness] PASS scorer-sha256 ${file.sha256} ${file.fileName}\n`);
  }
  process.stdout.write(
    `[target-harness] PASS node-check files=${report.syntax.files} comment_hygiene=pass `
      + `document_only=${report.card.route.draftStatus}/${report.card.route.terminal}\n`,
  );
  process.stdout.write('[target-harness] GREEN result=PASS live_authority=0 target_bytes_unchanged=true\n');
}

const report = verify();
printReport(report);
