#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ HARNESS: Execution Plane Shadow Verification                            ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Prove transitions, determinism, and protected scorer parity.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

/* ─────────────────────────────────────────────────────────────
   1. MODULE IMPORTS
──────────────────────────────────────────────────────────────── */

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const {
  DOMAIN_TAGS,
  canonicalize,
  hashArtifact,
} = require('../../000-contract-schemas/lib/canonical.cjs');
const { prepareRoute } = require('../lib/execution-plane.cjs');
const { projectExecutionToRouteGold } = require('../lib/projector.cjs');
const { runTests } = require('../tests/execution-plane.test.cjs');

/* ─────────────────────────────────────────────────────────────
   2. PATHS AND CONSTANTS
──────────────────────────────────────────────────────────────── */

const PHASE_ROOT = path.resolve(__dirname, '..');
const FIXTURE_FILE = path.resolve(PHASE_ROOT, 'fixtures', 'execution-route-gold.v1.json');
const REPLAY_RUNS = 25;
const TRUSTED_DIGESTS = Object.freeze({
  'router-replay.cjs': 'b039b8dd22dbfaaa91042f613998d54610080feadef6179362e0d01b83e8bedf',
  'score-skill-benchmark.cjs': 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
});
const FORBIDDEN_HANDOFF_FIELDS = Object.freeze([
  'handoff',
  'handoffEdges',
  'question',
  'alternatives',
  'budgetRef',
  'recovery',
]);
const SCORER_SUBPROCESS_SOURCE = String.raw`
'use strict';
const fs = require('fs');
const scorerPath = process.argv[1];
const routerPath = process.argv[2];
const inputs = JSON.parse(fs.readFileSync(0, 'utf8'));
const attempts = [];
const deny = (method) => (...args) => {
  attempts.push({ method, target: typeof args[0] === 'string' ? args[0] : null });
  const error = new Error('protected scorer attempted a filesystem write');
  error.code = 'PROTECTED_WRITE_ATTEMPT';
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
const { routeSkillResources } = require(routerPath);
if (typeof evaluateRouteGold !== 'function') throw new TypeError('evaluateRouteGold unavailable');
if (typeof routeSkillResources !== 'function') throw new TypeError('routeSkillResources unavailable');
const verdicts = inputs.map((input) => evaluateRouteGold(input));
process.stdout.write(JSON.stringify({ verdicts, writeBackAttempts: attempts }));
`;

/* ─────────────────────────────────────────────────────────────
   3. HELPERS
──────────────────────────────────────────────────────────────── */

function findRepoRoot(start) {
  let current = start;
  while (current !== path.dirname(current)) {
    if (fs.existsSync(path.join(current, '.opencode', 'skills'))) return current;
    current = path.dirname(current);
  }
  throw new Error('repository root not found');
}

const REPO_ROOT = findRepoRoot(PHASE_ROOT);
const SCORER_ROOT = path.join(
  REPO_ROOT,
  '.opencode',
  'skills',
  'system-deep-loop',
  'deep-improvement',
  'scripts',
  'skill-benchmark'
);
const PROTECTED_FILES = Object.freeze({
  'router-replay.cjs': path.join(SCORER_ROOT, 'router-replay.cjs'),
  'score-skill-benchmark.cjs': path.join(SCORER_ROOT, 'score-skill-benchmark.cjs'),
});

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function fileHash(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function protectedHashes() {
  return Object.fromEntries(Object.entries(PROTECTED_FILES).map(([name, filePath]) => (
    [name, fileHash(filePath)]
  )));
}

function assertTrustedProtectedDigests() {
  const observed = protectedHashes();
  assert.deepStrictEqual(observed, TRUSTED_DIGESTS, 'trusted scorer or router digest mismatch');
  return observed;
}

function scenarioFor(fixture) {
  return {
    scenarioId: fixture.id,
    classKind: 'routing',
    hasIntentGold: true,
    hasResourceGold: true,
    expectedIntent: fixture.gold.expectedIntents[0],
    expectedIntents: fixture.gold.expectedIntents,
    expectedResources: fixture.gold.expectedResources,
    goldParseError: null,
    source: { shape: 'sk-doc' },
  };
}

function scoreReadOnly(inputs) {
  assertTrustedProtectedDigests();
  const child = spawnSync(
    process.execPath,
    [
      '-e',
      SCORER_SUBPROCESS_SOURCE,
      PROTECTED_FILES['score-skill-benchmark.cjs'],
      PROTECTED_FILES['router-replay.cjs'],
    ],
    { cwd: REPO_ROOT, encoding: 'utf8', input: JSON.stringify(inputs) }
  );
  assert.strictEqual(child.status, 0, child.stderr || 'read-only scorer subprocess failed');
  const result = JSON.parse(child.stdout);
  assertTrustedProtectedDigests();
  return result;
}

function listCjsFiles(root) {
  const files = [];
  const pending = [root];
  while (pending.length > 0) {
    const directory = pending.pop();
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) pending.push(entryPath);
      if (entry.isFile() && entry.name.endsWith('.cjs')) files.push(entryPath);
    }
  }
  return files.sort();
}

function extractConditions(source, keyword) {
  const conditions = [];
  const pattern = new RegExp(`\\b${keyword}\\s*\\(`, 'g');
  for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
    const openingIndex = source.indexOf('(', match.index);
    let depth = 0;
    let quote = null;
    let escaped = false;
    for (let index = openingIndex; index < source.length; index += 1) {
      const character = source[index];
      if (quote !== null) {
        if (escaped) escaped = false;
        else if (character === '\\') escaped = true;
        else if (character === quote) quote = null;
        continue;
      }
      if (character === '\'' || character === '"' || character === '`') {
        quote = character;
        continue;
      }
      if (character === '(') depth += 1;
      if (character === ')') {
        depth -= 1;
        if (depth === 0) {
          conditions.push(source.slice(openingIndex + 1, index));
          pattern.lastIndex = index + 1;
          break;
        }
      }
    }
  }
  return conditions;
}

function runStaticGates(fixtures) {
  const codeFiles = listCjsFiles(PHASE_ROOT);
  const source = codeFiles.map((filePath) => fs.readFileSync(filePath, 'utf8')).join('\n');
  const skillNames = uniqueSkillNames(fixtures);
  const skillIdentifierPattern = new RegExp(['\\bskill', 'Id\\b'].join(''));
  const branchViolations = [];
  for (const keyword of ['if', 'switch']) {
    for (const condition of extractConditions(source, keyword)) {
      if (skillIdentifierPattern.test(condition)
        || skillNames.some((name) => condition.includes(`'${name}'`)
          || condition.includes(`"${name}"`)
          || condition.includes(`\`${name}\``))) {
        branchViolations.push(`${keyword}: ${condition.trim()}`);
      }
    }
  }
  for (const statement of source.split(';')) {
    const ternaryIndex = statement.indexOf('?');
    if (ternaryIndex < 0) continue;
    const condition = statement.slice(0, ternaryIndex);
    if (skillIdentifierPattern.test(condition)
      || skillNames.some((name) => condition.includes(name))) {
      branchViolations.push(`ternary: ${condition.trim()}`);
    }
  }
  assert.deepStrictEqual(branchViolations, [], 'source branches on skill identity');

  const commentPattern = /\b(?:ADR|REQ|CHK|T)-?\d+\b|\.opencode\/specs\//i;
  for (const filePath of codeFiles) {
    const comments = fs.readFileSync(filePath, 'utf8')
      .split('\n')
      .filter((line) => /^\s*(?:\/\/|\/\*|\*)/.test(line))
      .join('\n');
    assert.ok(!commentPattern.test(comments), `ephemeral artifact pointer in ${filePath}`);
  }
  return {
    codeFilesChecked: codeFiles.length,
    skillNamesChecked: skillNames.length,
    branchViolations: branchViolations.length,
    commentViolations: 0,
  };
}

function uniqueSkillNames(fixtures) {
  const names = new Set();
  for (const fixture of fixtures.cases) {
    for (const target of fixture.decision.route.targets) {
      names.add(target.destinationId.skillId);
    }
  }
  return [...names];
}

function assertNoForbiddenHandoffArtifacts(fixture) {
  const serialized = JSON.stringify(fixture.decision);
  for (const field of FORBIDDEN_HANDOFF_FIELDS) {
    assert.strictEqual(serialized.includes(`"${field}"`), false, `forbidden field present: ${field}`);
  }
}

/* ─────────────────────────────────────────────────────────────
   4. REPLAY
──────────────────────────────────────────────────────────────── */

function runReplay() {
  const fixtures = readJson(FIXTURE_FILE);
  const protectedBefore = assertTrustedProtectedDigests();
  const unit = runTests();
  const staticGates = runStaticGates(fixtures);
  const rows = [];
  const scorerInputs = [];

  for (const fixture of fixtures.cases) {
    const hashes = [];
    let projection;
    let proofHash;
    for (let run = 0; run < REPLAY_RUNS; run += 1) {
      const prepared = prepareRoute(fixture.decision, fixture.context);
      projection = projectExecutionToRouteGold(fixture.decision, []);
      proofHash = prepared.preparedLegs[0].proof.proofHash;
      hashes.push(hashArtifact(DOMAIN_TAGS.TypedRouteGoldV1, {
        id: fixture.id,
        proofHashes: prepared.preparedLegs.map((leg) => leg.proof.proofHash),
        projection,
      }));
    }
    assert.strictEqual(new Set(hashes).size, 1, `${fixture.id} replay changed across runs`);
    assert.strictEqual(hashes[0], fixture.expectedReplayHash, `${fixture.id} replay oracle mismatch`);
    assert.strictEqual(proofHash, fixture.expectedProofHash, `${fixture.id} proof oracle mismatch`);
    scorerInputs.push({ scenario: scenarioFor(fixture), observed: projection });
    rows.push({
      id: fixture.id,
      repeatedRuns: REPLAY_RUNS,
      replayHash: hashes[0],
      proofHash,
      projection,
    });
  }

  const directFixture = fixtures.cases.find((fixture) => (
    fixture.id === 'direct-route-carrying-no-forbidden-handoff-artifacts'
  ));
  assertNoForbiddenHandoffArtifacts(directFixture);

  const corrupted = {
    scenario: scenarioFor(directFixture),
    observed: { observedIntents: ['deliberate-mismatch'], observedResources: [] },
  };
  const scorerResult = scoreReadOnly([...scorerInputs, corrupted]);
  const mismatch = scorerResult.verdicts.pop();
  assert.strictEqual(mismatch.pass, false, 'corrupted projection must fail the real scorer');
  scorerResult.verdicts.forEach((verdict, index) => {
    assert.strictEqual(verdict.pass, true, `${rows[index].id} failed the real scorer`);
    rows[index].sharedScorerPass = true;
  });
  assert.deepStrictEqual(scorerResult.writeBackAttempts, [], 'protected scorer attempted a write');

  const protectedAfter = assertTrustedProtectedDigests();
  assert.deepStrictEqual(protectedAfter, protectedBefore, 'protected scorer bytes changed');

  const successCriteria = {
    'SC-001': {
      status: 'pass',
      verifyState: unit.stale.state,
      effectCount: unit.stale.effectCount,
      commitReached: false,
    },
    'SC-002': {
      status: 'pass',
      effectCount: unit.duplicate.effectCount,
      receiptCount: unit.duplicate.receiptCount,
      duplicateReturnedOriginalReceipt: true,
    },
    'SC-003': {
      status: 'pass',
      negativeProofCount: 0,
      bareProofCommitError: 'COMMIT_WITHOUT_READY',
      verifyStates: unit.verifyStates,
    },
    'SC-004': {
      status: 'pass',
      singlePath: unit.singlePath,
      bundlePath: unit.fencing.protocolPath,
      nameBranchViolations: staticGates.branchViolations,
      fencedState: unit.fencing.fencedState,
    },
    'SC-005': {
      status: 'shadow-partial',
      stageAppropriateRouteGold: 'pass',
      projectedRowsScored: rows.length,
      scorerPasses: scorerResult.verdicts.filter((verdict) => verdict.pass).length,
      mismatchFalsifierPass: mismatch.pass === false,
      protectedDigests: protectedAfter,
      writeBackAttempts: scorerResult.writeBackAttempts,
      deferred: 'real hub scenarios and router-replay production are deferred to per-hub activation',
    },
    'SC-006': {
      status: 'pass',
      preparedProofsAfterDisable: unit.disableDrill.preparedProofsAfterDisable,
      effectCount: unit.disableDrill.effectCount,
      postCommitRecoveryOwner: 'destination',
      nonAtomicPendingEffects: unit.nonAtomicRecovery.pendingReceipts,
      nonAtomicRetryEffectCount: unit.nonAtomicRecovery.effectCount,
    },
  };

  return {
    status: 'shadow-partial',
    assertions: unit.assertions,
    fixtureCount: rows.length,
    replayRunsPerFixture: REPLAY_RUNS,
    successCriteria,
    staticGates,
    rows,
  };
}

/* ─────────────────────────────────────────────────────────────
   5. EXPORTS AND ENTRY POINT
──────────────────────────────────────────────────────────────── */

module.exports = {
  TRUSTED_DIGESTS,
  runReplay,
};

if (require.main === module) {
  try {
    process.stdout.write(`${canonicalize(runReplay())}\n`);
  } catch (error) {
    process.stderr.write(`[execution-plane-harness] ${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}
