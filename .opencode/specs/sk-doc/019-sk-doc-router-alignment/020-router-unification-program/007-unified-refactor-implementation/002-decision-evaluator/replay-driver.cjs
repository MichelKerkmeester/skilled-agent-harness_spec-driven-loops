#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Decision Evaluator Shadow Replay Driver                      ║
// ║ PURPOSE: Prove deterministic projection parity without gold write-back. ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  DOMAIN_TAGS,
  canonicalize,
  hashArtifact,
} = require('../000-contract-schemas/lib/canonical.cjs');
const { evaluateWithTrace } = require('./lib/evaluator.cjs');
const { projectToRouteGold } = require('./lib/projector.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const REPO_ROOT = path.resolve(__dirname, '../../../../../../..');
const CONTRACT_FIXTURES = path.resolve(__dirname, '..', '000-contract-schemas', 'fixtures');
const FIXTURE_FILE = path.resolve(__dirname, 'fixtures', 'evaluator-cases.v1.json');
const PROTECTED_DIGESTS_FILE = path.resolve(__dirname, 'harness', 'protected-digests.json');
const SCORER_FILE = path.resolve(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/score-skill-benchmark.cjs'
);
const ROUTER_REPLAY_FILE = path.resolve(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/router-replay.cjs'
);
const PROTECTED_FILES = Object.freeze([
  SCORER_FILE,
  ROUTER_REPLAY_FILE,
  path.resolve(CONTRACT_FIXTURES, 'typed-route-gold.negative.json'),
  path.resolve(CONTRACT_FIXTURES, 'typed-route-gold.singular-duplicate.json'),
]);
const EVALUATOR_SOURCE_FILES = Object.freeze([
  path.resolve(__dirname, 'lib', 'decision-contract.cjs'),
  path.resolve(__dirname, 'lib', 'evaluator.cjs'),
  path.resolve(__dirname, 'lib', 'projector.cjs'),
]);
const REPLAY_RUNS = 25;
const CHILD_PROCESSES = 3;
const TRUSTED_PROTECTED_DIGESTS = Object.freeze(Object.fromEntries(
  readJson(PROTECTED_DIGESTS_FILE).files.map(({ path: repoRelativePath, sha256 }) => (
    [path.resolve(REPO_ROOT, repoRelativePath), sha256]
  ))
));
const SCORER_SUBPROCESS_SOURCE = String.raw`
'use strict';
const fs = require('fs');
const scorerPath = process.argv[1];
const inputs = JSON.parse(fs.readFileSync(0, 'utf8'));
const attempts = [];
const deny = (method) => (...args) => {
  attempts.push({ method, target: typeof args[0] === 'string' ? args[0] : null });
  const error = new Error('read-only scorer attempted a filesystem write');
  error.code = 'SCORER_WRITE_ATTEMPT';
  throw error;
};
for (const method of [
  'appendFileSync', 'chmodSync', 'chownSync', 'copyFileSync', 'createWriteStream',
  'linkSync', 'lchownSync', 'lutimesSync', 'mkdirSync', 'mkdtempSync', 'renameSync',
  'rmSync', 'rmdirSync', 'symlinkSync', 'truncateSync', 'unlinkSync', 'utimesSync',
  'writeFileSync',
]) {
  if (typeof fs[method] === 'function') fs[method] = deny(method);
}
for (const method of [
  'appendFile', 'chmod', 'chown', 'copyFile', 'link', 'lchown', 'lutimes', 'mkdir',
  'mkdtemp', 'rename', 'rm', 'rmdir', 'symlink', 'truncate', 'unlink', 'utimes',
  'writeFile',
]) {
  if (typeof fs[method] === 'function') fs[method] = deny(method);
  if (fs.promises && typeof fs.promises[method] === 'function') {
    fs.promises[method] = deny('promises.' + method);
  }
}
const originalOpenSync = fs.openSync;
fs.openSync = (target, flags, ...rest) => {
  const textFlags = typeof flags === 'string' ? flags : '';
  const numericWrite = typeof flags === 'number'
    && Boolean(flags & (fs.constants.O_WRONLY | fs.constants.O_RDWR | fs.constants.O_CREAT
      | fs.constants.O_TRUNC | fs.constants.O_APPEND));
  if (/[wa+]/.test(textFlags) || numericWrite) return deny('openSync')(target, flags, ...rest);
  return originalOpenSync(target, flags, ...rest);
};
const { evaluateRouteGold } = require(scorerPath);
if (typeof evaluateRouteGold !== 'function') throw new TypeError('evaluateRouteGold export unavailable');
const verdicts = inputs.map((input) => evaluateRouteGold(input));
process.stdout.write(JSON.stringify({ verdicts, writeBackAttempts: attempts }));
`;

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function fileHash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function protectedHashes() {
  return Object.fromEntries(PROTECTED_FILES.map((filePath) => [filePath, fileHash(filePath)]));
}

function assertTrustedProtectedDigests() {
  const observed = Object.fromEntries(
    Object.keys(TRUSTED_PROTECTED_DIGESTS).map((filePath) => [filePath, fileHash(filePath)])
  );
  assert.deepStrictEqual(observed, TRUSTED_PROTECTED_DIGESTS, 'trusted scorer or router digest mismatch');
  return observed;
}

function policyFor(fixture) {
  return readJson(path.resolve(CONTRACT_FIXTURES, fixture.policyFixture));
}

function decisionHash(decision) {
  return hashArtifact(DOMAIN_TAGS.RouteDecisionV1, decision);
}

function childHashes(fixtures) {
  return fixtures.cases.map((fixture) => (
    decisionHash(evaluateWithTrace(fixture.request, policyFor(fixture)).decision)
  ));
}

function scorerScenario(fixture) {
  const gold = fixture.intentGold;
  assert.ok(gold && Array.isArray(gold.expectedIntents), `${fixture.id} lacks authored intent gold`);
  assert.ok(Array.isArray(gold.expectedResources), `${fixture.id} lacks authored resource gold`);
  return {
    scenarioId: fixture.id,
    classKind: 'routing',
    hasIntentGold: true,
    hasResourceGold: true,
    expectedIntent: gold.expectedIntents[0],
    expectedIntents: gold.expectedIntents,
    expectedResources: gold.expectedResources,
    goldParseError: null,
    source: { shape: 'sk-doc' },
  };
}

function scoreRouteGoldReadOnly(inputs) {
  const trustedProtectedDigests = assertTrustedProtectedDigests();
  const child = spawnSync(process.execPath, ['-e', SCORER_SUBPROCESS_SOURCE, SCORER_FILE], {
    cwd: REPO_ROOT,
    encoding: 'utf8',
    input: JSON.stringify(inputs),
  });
  assert.strictEqual(child.status, 0, child.stderr || 'read-only scorer subprocess failed');
  const result = JSON.parse(child.stdout);
  assertTrustedProtectedDigests();
  return {
    verdicts: result.verdicts,
    writeBackAttempts: result.writeBackAttempts,
    writeBackAttempted: result.writeBackAttempts.length > 0,
    trustedProtectedDigests,
  };
}

function classifyMismatch(routeGold) {
  if (routeGold.reason === 'gold-parse-failure') return 'gold-parse-failure';
  if (routeGold.intentOk === false && routeGold.resourceOk === false) {
    return 'intent-and-resource-mismatch';
  }
  if (routeGold.intentOk === false) return 'intent-mismatch';
  if (routeGold.resourceOk === false) return 'resource-mismatch';
  return 'unclassified-mismatch';
}

function runStaticGates(fixtures) {
  const source = EVALUATOR_SOURCE_FILES.map((filePath) => fs.readFileSync(filePath, 'utf8')).join('\n');
  const forbiddenEffects = [
    /require\(['"](?:node:)?fs['"]\)/,
    /require\(['"](?:node:)?https?['"]\)/,
    /\bfetch\s*\(/,
    /\bDate\s*\(/,
    /Date\.now\s*\(/,
    /Math\.random\s*\(/,
    /randomBytes\s*\(/,
  ];
  for (const pattern of forbiddenEffects) {
    assert.ok(!pattern.test(source), `pure evaluator source contains forbidden effect: ${pattern}`);
  }

  const skillIds = new Set();
  for (const fixture of fixtures.cases) {
    for (const destination of policyFor(fixture).destinations) skillIds.add(destination.id.skillId);
  }
  for (const skillId of skillIds) {
    const quoted = new RegExp(`['\"]${skillId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['\"]`);
    assert.ok(!quoted.test(source), `evaluator source contains a destination-name literal: ${skillId}`);
  }

  const controlFlowOnSkillId = [
    /if\s*\([\s\S]{0,240}?(?:\.skillId|\bskillId\b)\s*(?:===|!==)\s*['"]/,
    /switch\s*\([\s\S]{0,120}?(?:\.skillId|\bskillId\b)[\s\S]{0,120}?\)/,
    /(?:\.skillId|\bskillId\b)\s*(?:===|!==)\s*['"][\s\S]{0,120}?\?[\s\S]{0,120}?:/,
  ];
  for (const pattern of controlFlowOnSkillId) {
    assert.ok(!pattern.test(source), `evaluator source branches on skill identity: ${pattern}`);
  }

  const codeFiles = [
    ...EVALUATOR_SOURCE_FILES,
    __filename,
    path.resolve(__dirname, 'tests', 'decision-evaluator.test.cjs'),
  ];
  const forbiddenComment = /\b(?:ADR|REQ|CHK|T)-?\d+\b|\.opencode\/specs\//i;
  for (const filePath of codeFiles) {
    const comments = fs.readFileSync(filePath, 'utf8')
      .split('\n')
      .filter((line) => /^\s*(?:\/\/|\/\*|\*)/.test(line))
      .join('\n');
    assert.ok(!forbiddenComment.test(comments), `ephemeral artifact pointer in comments: ${filePath}`);
  }

  return {
    pureEffectPatternsRejected: forbiddenEffects.length,
    destinationNamesAbsent: [...skillIds].length,
    controlFlowPatternsRejected: controlFlowOnSkillId.length,
    commentFilesChecked: codeFiles.length,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. REPLAY
// ─────────────────────────────────────────────────────────────────────────────

function runReplay() {
  const fixtures = readJson(FIXTURE_FILE);
  const { runTests } = require('./tests/decision-evaluator.test.cjs');
  const protectedBefore = protectedHashes();
  assertTrustedProtectedDigests();
  const unit = runTests();
  const staticGates = runStaticGates(fixtures);
  const rows = [];
  const scorerInputs = [];

  for (const fixture of fixtures.cases) {
    const policy = policyFor(fixture);
    const runHashes = [];
    let finalProjection;
    let finalTrace;
    for (let run = 0; run < REPLAY_RUNS; run += 1) {
      const result = evaluateWithTrace(fixture.request, policy);
      runHashes.push(decisionHash(result.decision));
      finalTrace = result.trace;
      finalProjection = projectToRouteGold(result.decision, {
        policy,
        leafPairs: fixture.leafPairs,
        manifestResources: fixtures.manifestResources,
      });
    }
    assert.strictEqual(new Set(runHashes).size, 1, `${fixture.id} changed across repeated runs`);
    assert.strictEqual(runHashes[0], fixture.expectedDecisionHash, `${fixture.id} hash oracle mismatch`);
    assert.deepStrictEqual(finalTrace, fixture.expectedTrace, `${fixture.id} trace mismatch`);
    scorerInputs.push({
      scenario: scorerScenario(fixture),
      observed: finalProjection,
    });
    rows.push({
      id: fixture.id,
      family: fixture.family,
      action: fixture.expectedDecision.action,
      decisionHash: runHashes[0],
      repeatedRuns: REPLAY_RUNS,
      projection: finalProjection,
      trace: finalTrace,
    });
  }

  const processHashes = [];
  for (let index = 0; index < CHILD_PROCESSES; index += 1) {
    const child = spawnSync(process.execPath, [__filename, '--child-hashes'], {
      cwd: REPO_ROOT,
      encoding: 'utf8',
    });
    assert.strictEqual(child.status, 0, child.stderr || 'child replay failed');
    processHashes.push(JSON.parse(child.stdout));
  }
  for (const hashes of processHashes) {
    assert.deepStrictEqual(hashes, rows.map((row) => row.decisionHash));
  }

  const positiveIndex = fixtures.cases.findIndex((fixture) => fixture.expectedDecision.action === 'route');
  const positive = fixtures.cases[positiveIndex];
  const corrupted = {
    ...rows[positiveIndex].projection,
    observedIntents: ['deliberate-mismatch'],
  };
  const scorerRun = scoreRouteGoldReadOnly([
    ...scorerInputs,
    { scenario: scorerScenario(positive), observed: corrupted },
  ]);
  const mismatchRow = scorerRun.verdicts.pop();
  scorerRun.verdicts.forEach((routeGold, index) => {
    assert.strictEqual(routeGold.pass, true, `${rows[index].id} shared route-gold scorer mismatch`);
    rows[index].sharedScorerPass = routeGold.pass;
  });
  assert.strictEqual(mismatchRow.pass, false, 'mismatch injection must fail the shared scorer');
  const mismatchClassification = classifyMismatch(mismatchRow);
  assert.strictEqual(mismatchClassification, 'intent-mismatch');

  const protectedAfter = protectedHashes();
  assert.deepStrictEqual(protectedAfter, protectedBefore, 'protected scorer or gold bytes changed');
  assertTrustedProtectedDigests();

  const singularRows = rows.filter((row) => row.id === 'exact-single-route'
    || row.id === 'zero-signal-defer'
    || row.id === 'degraded-fallback');
  assert.ok(singularRows.every((row) => (
    row.trace.rankCalls === 0
    && row.trace.bundleCalls === 0
    && row.trace.handoffCalls === 0
  )));

  const successCriteria = {
    'SC-001': {
      status: 'pass',
      sameProcessRunsPerFixture: REPLAY_RUNS,
      crossProcessRuns: CHILD_PROCESSES,
      decisionHashes: Object.fromEntries(rows.map((row) => [row.id, row.decisionHash])),
    },
    'SC-002': {
      status: 'pass',
      specificGuardReasons: unit.guardCodes,
    },
    'SC-003': {
      status: 'shadow-partial',
      scope: 'projection shape and real read-only scorer pass against locally authored intent and resource gold',
      authoredGoldRows: rows.length,
      scorerPasses: rows.filter((row) => row.sharedScorerPass).length,
      legacyCorpusMapping: 'not-established',
      deferred: 'full route-gold against the real router-replay producer and real hub scenarios '
        + 'at per-hub activation / Stage 4',
      trustedProtectedDigests: scorerRun.trustedProtectedDigests,
      protectedFileHashes: protectedAfter,
    },
    'SC-004': {
      status: 'pass',
      deterministicRows: rows.length,
      projectedRowsScored: rows.length,
      injectedMismatchClassification: mismatchClassification,
      writeBackAttempted: scorerRun.writeBackAttempted,
      writeBackAttempts: scorerRun.writeBackAttempts,
    },
    'SC-005': {
      status: 'pass',
      singularRows: singularRows.map((row) => ({ id: row.id, action: row.action, trace: row.trace })),
    },
  };
  const criterionStatuses = Object.values(successCriteria).map(({ status }) => status);
  assert.ok(
    criterionStatuses.every((status) => status === 'pass' || status === 'shadow-partial'),
    'success criterion reported a failing status'
  );
  const status = criterionStatuses.includes('shadow-partial') ? 'shadow-partial' : 'pass';

  return {
    status,
    fixtureCount: rows.length,
    assertions: unit.assertions,
    successCriteria,
    staticGates,
    rows,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  TRUSTED_PROTECTED_DIGESTS,
  runReplay,
  scoreRouteGoldReadOnly,
  scorerScenario,
};

if (require.main === module && process.argv.includes('--child-hashes')) {
  process.stdout.write(`${JSON.stringify(childHashes(readJson(FIXTURE_FILE)))}\n`);
} else if (require.main === module) {
  try {
    const result = runReplay();
    process.stdout.write(`${canonicalize(result)}\n`);
  } catch (error) {
    process.stderr.write(`[decision-replay] ${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}
