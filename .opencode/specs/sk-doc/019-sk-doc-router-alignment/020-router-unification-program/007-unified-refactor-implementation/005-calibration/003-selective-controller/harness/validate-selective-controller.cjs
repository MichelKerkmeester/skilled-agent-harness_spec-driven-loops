#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Selective Controller Validator                                          ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const assert = require('assert');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const {
  canonicalBytes,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  computeCorpusHash,
  validateCorpus,
} = require('../../001-holdout-corpus/lib/calibration-corpus.cjs');
const {
  computeCertHash,
  computeCertificateId,
  validateCertificate,
} = require('../../002-rank-vs-calibrated-contract/lib/calibration-contract.cjs');
const {
  projectCompatibility,
} = require('../../002-rank-vs-calibrated-contract/lib/compatibility-projector.cjs');
const {
  FRICTION_LIMITS,
  SelectiveControllerError,
  inspectSelectiveController,
  resolveSelectiveController,
} = require('../lib/selective-controller.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. PATHS AND FIXED ORACLES
// ─────────────────────────────────────────────────────────────────────────────

const PHASE_ROOT = path.resolve(__dirname, '..');
const IMPLEMENTATION_ROOT = path.resolve(PHASE_ROOT, '../..');
const REPO_ROOT = path.resolve(IMPLEMENTATION_ROOT, '../../../../../..');
const FIXTURE_FILE = path.resolve(PHASE_ROOT, 'fixtures', 'controller-route-gold.v1.json');
const METRICS_FILE = path.resolve(PHASE_ROOT, 'promotion-metrics.v1.json');
const CONTRACT_FILE = path.resolve(PHASE_ROOT, 'selective-controller-contract.md');
const CONTROLLER_FILE = path.resolve(PHASE_ROOT, 'lib', 'selective-controller.cjs');
const HOLDOUT_CORPUS_FILE = path.resolve(
  PHASE_ROOT,
  '../001-holdout-corpus/fixtures/corpora/sk-code.v1.json'
);
const SCORER_ROOT = path.resolve(
  REPO_ROOT,
  '.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark'
);
const PROTECTED_FILES = Object.freeze({
  'score-skill-benchmark.cjs': Object.freeze({
    path: path.resolve(SCORER_ROOT, 'score-skill-benchmark.cjs'),
    sha256: 'd5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c',
  }),
  'router-replay.cjs': Object.freeze({
    path: path.resolve(SCORER_ROOT, 'router-replay.cjs'),
    sha256: 'b039b8dd22dbfaaa91042f613998d54610080feadef6179362e0d01b83e8bedf',
  }),
  'load-playbook-scenarios.cjs': Object.freeze({
    path: path.resolve(SCORER_ROOT, 'load-playbook-scenarios.cjs'),
    sha256: '249be7c1cae9dcfe1faec8dcfc2965a0a0fc89e0af8e30bdd271625f300a6fde',
  }),
});
const HARD_FAILURE_REASONS = Object.freeze({
  'second-user-turn': 'FRICTION_USER_TURNS_EXCEEDED',
  'fourth-candidate-option': 'FRICTION_OPTIONS_EXCEEDED',
  'third-attempt': 'FRICTION_ATTEMPTS_EXCEEDED',
  'card-257-tokens': 'FRICTION_CARD_TOKENS_EXCEEDED',
  'singular-ranking': 'SINGULAR_THRESHOLD_LOGIC_FORBIDDEN',
  'singular-ordered-bundle': 'SINGULAR_SELECTION_KIND_INVALID',
});
const EXPECTED_CERTIFICATE_NEGATIVES = Object.freeze({
  'absent-certificate-clarifies': 'CERTIFICATE_ABSENT',
  'stale-certificate-clarifies': 'CERTIFICATE_STALE',
  'policy-mismatch-clarifies': 'CERTIFICATE_POLICY_MISMATCH',
  'risk-slice-mismatch-clarifies': 'CERTIFICATE_RISK_SLICE_MISMATCH',
  'rank-only-never-routes': 'CERTIFICATE_ABSENT',
  'malformed-certificate-threshold-abstains': 'CERTIFICATE_THRESHOLD_INVALID',
});
const FALSIFIER_IDS = Object.freeze([
  'none-of-these-defers-no-match',
  'zero-signal-valid-certificate-defers',
  'spent-turn-cannot-clarify',
  'singular-bundle-hard-block',
  'malformed-certificate-threshold-abstains',
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. FIXTURE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

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
  return Object.fromEntries(
    Object.entries(PROTECTED_FILES).map(([name, entry]) => [name, fileHash(entry.path)])
  );
}

function assertProtectedHashes() {
  const observed = protectedHashes();
  for (const [name, entry] of Object.entries(PROTECTED_FILES)) {
    assert.strictEqual(observed[name], entry.sha256, `${name} digest changed`);
  }
  return observed;
}

function deleteProperty(target, key) {
  Reflect.deleteProperty(target, key);
}

function materializeVariant(base, variant) {
  const input = clone(base);
  const { request, rankedCandidates: ranked, certificateHandle } = input;
  if (variant === 'base') return input;
  if (variant === 'bounded-default') {
    request.policyPosture.thresholdPolicy = 'bounded-default-low';
    ranked.rankEvidence.rankScore.value = '0.500000';
    ranked.boundedDefaultCandidateIndex = 1;
    input.projection.leafPairs = [
      { workflowMode: 'code-review', leafResourceId: 'review-skill' },
    ];
    return input;
  }
  if (variant === 'certificate-absent') {
    input.certificateHandle = { state: 'absent' };
    return input;
  }
  if (variant === 'certificate-stale') {
    certificateHandle.state = 'stale';
    return input;
  }
  if (variant === 'request-policy-mismatch') {
    request.pinnedActivationGeneration.effectivePolicyHash = 'a'.repeat(64);
    return input;
  }
  if (variant === 'request-risk-mismatch') {
    request.riskSlice = 'actor:nonmutating:single';
    return input;
  }
  if (variant === 'accepted-answer') {
    ranked.interaction = { attempt: 2, userTurnsUsed: 1, acceptedAnswer: 'quality' };
    return input;
  }
  if (variant === 'accepted-none-of-these') {
    ranked.interaction = { attempt: 2, userTurnsUsed: 1, acceptedAnswer: 'none_of_these' };
    return input;
  }
  if (variant === 'attempt-exhausted') {
    ranked.interaction = { attempt: 2, userTurnsUsed: 1 };
    input.certificateHandle = { state: 'absent' };
    return input;
  }
  if (variant === 'zero-signal') {
    deleteProperty(ranked, 'rankEvidence');
    deleteProperty(ranked, 'clarification');
    input.certificateHandle = { state: 'absent' };
    return input;
  }
  if (variant === 'zero-signal-valid-certificate') {
    request.policyPosture.thresholdPolicy = 'bounded-default-low';
    ranked.boundedDefaultCandidateIndex = 1;
    deleteProperty(ranked, 'rankEvidence');
    deleteProperty(ranked, 'clarification');
    return input;
  }
  if (variant === 'spent-turn-clarification') {
    ranked.interaction = { attempt: 1, userTurnsUsed: 1 };
    input.certificateHandle = { state: 'absent' };
    return input;
  }
  if (variant === 'malformed-certificate-threshold') {
    const certificate = certificateHandle.certificate;
    certificate.methodParams.abstentionThreshold = 'not-a-decimal';
    certificate.certificateId = computeCertificateId(certificate);
    certificate.certHash = computeCertHash(certificate);
    certificateHandle.activeCertificateId = certificate.certificateId;
    return input;
  }
  if (variant === 'advisor-stale-combined') {
    ranked.rankEvidence.source = 'combined';
    ranked.rankEvidence.advisor = { trust: 'stale' };
    return input;
  }
  if (variant === 'advisor-absent-combined') {
    ranked.rankEvidence.source = 'combined';
    ranked.rankEvidence.advisor = { trust: 'absent' };
    return input;
  }
  if (variant === 'singular-exact') {
    ranked.candidateCount = 1;
    ranked.candidates = [ranked.candidates[0]];
    ranked.candidates[0].exactSignal = true;
    ranked.rankingInvoked = false;
    deleteProperty(ranked, 'rankEvidence');
    input.certificateHandle = { state: 'absent' };
    return input;
  }
  throw new TypeError(`unsupported fixture variant: ${variant}`);
}

function applyHardFailureMutation(base, mutation) {
  if (mutation === 'singular-ordered-bundle') {
    const input = materializeVariant(base, 'singular-exact');
    input.rankedCandidates.selectionKind = 'orderedBundle';
    return input;
  }
  const input = materializeVariant(base, 'certificate-absent');
  const ranked = input.rankedCandidates;
  if (mutation === 'second-user-turn') {
    ranked.interaction.userTurnsUsed = 2;
  } else if (mutation === 'fourth-candidate-option') {
    ranked.clarification.options.push({
      id: 'quality-copy',
      label: 'Second quality gate',
      candidateIndex: 0,
    });
    ranked.clarification.options.push({
      id: 'review-copy',
      label: 'Second findings review',
      candidateIndex: 1,
    });
  } else if (mutation === 'third-attempt') {
    ranked.interaction.attempt = 3;
  } else if (mutation === 'card-257-tokens') {
    ranked.clarification.decisionCard = Array(257).fill('token').join(' ');
  } else if (mutation === 'singular-ranking') {
    ranked.candidateCount = 1;
    ranked.candidates = [ranked.candidates[0]];
  } else {
    throw new TypeError(`unsupported hard-failure mutation: ${mutation}`);
  }
  return input;
}

function typedProjection(decision, projection) {
  const compatibility = projectCompatibility(decision, projection);
  const route = decision.action === 'route' ? decision.route : null;
  return {
    decisionAction: decision.action,
    ...(route ? { selectionKind: route.selectionKind } : {}),
    targetQualifiedIds: route
      ? route.targets.map((target) => (
        `${target.destinationId.skillId}/${target.destinationId.workflowMode}`
      ))
      : [],
    observedIntents: compatibility.observedIntents,
    observedResources: compatibility.observedResources,
  };
}

function scorerScenario(caseFixture) {
  const gold = caseFixture.typedGold;
  const expectedIntent = gold.observedIntents.length > 0
    ? gold.observedIntents[0]
    : 'defer';
  return {
    scenarioId: caseFixture.id,
    classKind: 'routing',
    hasIntentGold: true,
    hasResourceGold: true,
    expectedIntent,
    expectedIntents: gold.observedIntents.length > 0
      ? gold.observedIntents
      : [expectedIntent],
    expectedResources: gold.observedResources,
    goldParseError: null,
    source: { shape: 'sk-doc' },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. STATIC AND CONTRACT GATES
// ─────────────────────────────────────────────────────────────────────────────

function runStaticGates() {
  const source = fs.readFileSync(CONTROLLER_FILE, 'utf8');
  const requireCalls = [...source.matchAll(/require\((['"])([^'"]+)\1\)/gu)]
    .map((match) => match[2]);
  assert.deepStrictEqual(
    requireCalls,
    ['../../../000-contract-schemas/lib/canonical.cjs'],
    'controller dependency boundary widened'
  );
  const forbiddenEffects = [
    /require\(['"](?:node:)?fs['"]\)/u,
    /require\(['"](?:node:)?https?['"]\)/u,
    /\bfetch\s*\(/u,
    /\bDate(?:\.now)?\s*\(/u,
    /Math\.random\s*\(/u,
    /randomBytes\s*\(/u,
  ];
  for (const pattern of forbiddenEffects) {
    assert.ok(!pattern.test(source), `pure controller contains forbidden effect: ${pattern}`);
  }
  const skillNameBranch = /(?:\.skillId|\bskillId\b)\s*(?:===|!==)\s*['"]/u;
  assert.ok(!skillNameBranch.test(source), 'controller branches on a skill name');
  const comments = source
    .split('\n')
    .filter((line) => /^\s*(?:\/\/|\/\*|\*)/u.test(line))
    .join('\n');
  const forbiddenComment = /\b(?:ADR|REQ|CHK|T)-?\d+\b|\.opencode\/specs\//iu;
  assert.ok(!forbiddenComment.test(comments), 'controller comment contains an artifact pointer');
  return {
    requireCalls,
    forbiddenEffectPatternsChecked: forbiddenEffects.length,
    skillNameBranchAbsent: true,
    commentHygiene: 'pass',
  };
}

function runContractGates() {
  const contract = fs.readFileSync(CONTRACT_FILE, 'utf8');
  for (const phrase of [
    'resolveSelectiveController(',
    'referentially transparent',
    'WithheldUntilVerify',
    'none_of_these',
    'Stage 3 shadow evidence only',
    'synthesis §2.3',
    'synthesis §8.1',
    'synthesis §8.2',
    'synthesis §9',
    'synthesis §10',
  ]) {
    assert.ok(contract.includes(phrase), `controller contract omits: ${phrase}`);
  }
  assert.deepStrictEqual(FRICTION_LIMITS, {
    userTurns: 1,
    candidateOptions: 3,
    attempts: 2,
    decisionCardTokens: 256,
  });
  const promotion = readJson(METRICS_FILE);
  const metricNames = promotion.metrics.map((metric) => metric.name);
  assert.deepStrictEqual(metricNames, [
    'coverage',
    'selectiveRisk',
    'optionRecall',
    'clarificationResolution',
    'cancelDecline',
    'addedTurns',
    'cardSize',
  ]);
  for (const metric of promotion.metrics) {
    assert.ok(metric.numerator && metric.denominator && metric.unit);
  }
  assert.match(promotion.corpusAuthority.thresholdRule, /held-out/u);
  assert.match(promotion.corpusAuthority.thresholdRule, /Fleet-wide constants/u);
  const fixtures = readJson(FIXTURE_FILE);
  const certificate = validateCertificate(fixtures.base.certificateHandle.certificate);
  const corpus = readJson(HOLDOUT_CORPUS_FILE);
  assert.strictEqual(validateCorpus(corpus), true, 'external held-out corpus is invalid');
  const externalCorpusHash = computeCorpusHash(corpus);
  assert.strictEqual(externalCorpusHash, corpus.corpusId);
  assert.strictEqual(certificate.corpusId, corpus.corpusId);
  assert.strictEqual(certificate.corpusHash, externalCorpusHash);
  assert.strictEqual(certificate.policyHash, corpus.effectivePolicyHash);
  assert.strictEqual(certificate.generation, corpus.generation);
  const matchingRecordCount = corpus.records.filter((record) => (
    record.riskSlice?.id === certificate.riskSlice
  )).length;
  assert.ok(matchingRecordCount > 0, 'certificate risk slice has no held-out records');
  assert.strictEqual(certificate.evaluationWindow.sampleCount, matchingRecordCount);
  assert.strictEqual(certificate.metrics.sampleCount, matchingRecordCount);
  return {
    metricNames,
    heldOutOnlyThresholdRule: true,
    externalCorpusHash,
    certificateId: certificate.certificateId,
    matchingRecordCount,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. REPLAY AND FALSIFIERS
// ─────────────────────────────────────────────────────────────────────────────

function runHardFailureCases(fixtures) {
  const rows = [];
  for (const caseFixture of fixtures.hardFailureCases) {
    const input = applyHardFailureMutation(fixtures.base, caseFixture.mutation);
    const expectedReason = HARD_FAILURE_REASONS[caseFixture.mutation];
    assert.ok(expectedReason, `${caseFixture.id} has no fixed reason oracle`);
    assert.throws(
      () => resolveSelectiveController(
        input.request,
        input.rankedCandidates,
        input.certificateHandle,
        input.uncertaintyBudget
      ),
      (error) => error instanceof SelectiveControllerError
        && error.code === expectedReason,
      `${caseFixture.id} did not hard-fail with ${expectedReason}`
    );
    rows.push({ id: caseFixture.id, reason: expectedReason });
  }
  return rows;
}

function runProjectionInvisibility(base) {
  const input = materializeVariant(base, 'base');
  const result = inspectSelectiveController(
    input.request,
    input.rankedCandidates,
    input.certificateHandle,
    input.uncertaintyBudget
  );
  const withoutCertificate = clone(result.decision);
  withoutCertificate.route.evidence.calibration = { status: 'unvalidated' };
  const withProjection = projectCompatibility(result.decision, input.projection);
  const withoutProjection = projectCompatibility(withoutCertificate, input.projection);
  assert.ok(
    canonicalBytes(withProjection).equals(canonicalBytes(withoutProjection)),
    'calibration evidence leaked into compatibility projection'
  );
  return {
    withCertificateBytes: canonicalBytes(withProjection).toString('utf8'),
    withoutCertificateBytes: canonicalBytes(withoutProjection).toString('utf8'),
    byteEqual: true,
  };
}

function collectFalsifierEvidence(rows, hardFailures) {
  const evidence = {};
  for (const id of FALSIFIER_IDS) {
    const row = rows.find((entry) => entry.id === id);
    const hardFailure = hardFailures.find((entry) => entry.id === id);
    assert.ok(row || hardFailure, `${id} falsifier was not executed`);
    evidence[id] = row || hardFailure;
  }
  return evidence;
}

function runReplay() {
  const fixtures = readJson(FIXTURE_FILE);
  const protectedBefore = assertProtectedHashes();
  const { evaluateRouteGold } = require(PROTECTED_FILES['score-skill-benchmark.cjs'].path);
  assert.strictEqual(typeof evaluateRouteGold, 'function');
  const rows = [];
  const scorerRows = [];

  for (const caseFixture of fixtures.cases) {
    const input = materializeVariant(fixtures.base, caseFixture.variant);
    const decisionBytes = [];
    let result;
    for (let run = 0; run < 25; run += 1) {
      result = inspectSelectiveController(
        input.request,
        input.rankedCandidates,
        input.certificateHandle,
        input.uncertaintyBudget
      );
      decisionBytes.push(JSON.stringify(result.decision));
    }
    assert.strictEqual(new Set(decisionBytes).size, 1, `${caseFixture.id} is nondeterministic`);
    const actualTyped = typedProjection(result.decision, input.projection);
    assert.deepStrictEqual(actualTyped, caseFixture.typedGold, `${caseFixture.id} typed gold mismatch`);
    for (const [field, expected] of Object.entries(caseFixture.expectedTrace)) {
      assert.deepStrictEqual(result.trace[field], expected, `${caseFixture.id} trace.${field}`);
    }
    if (caseFixture.expectedDecisionReason !== undefined) {
      assert.strictEqual(
        result.decision[result.decision.action].reason,
        caseFixture.expectedDecisionReason,
        `${caseFixture.id} decision reason`
      );
    }
    if (EXPECTED_CERTIFICATE_NEGATIVES[caseFixture.id]) {
      assert.strictEqual(
        result.trace.certificateReason,
        EXPECTED_CERTIFICATE_NEGATIVES[caseFixture.id]
      );
      assert.notStrictEqual(result.decision.action, 'route');
      if (result.decision.action === 'route') {
        assert.notStrictEqual(result.decision.route.basis.kind, 'bounded-default');
      }
    }
    if (result.decision.action !== 'route') {
      assert.ok(!Object.hasOwn(result.decision[result.decision.action], 'targets'));
      assert.strictEqual(result.decision[result.decision.action].authority, 'Withheld');
    }
    const routeGold = evaluateRouteGold({
      scenario: scorerScenario(caseFixture),
      observed: {
        observedIntents: actualTyped.observedIntents,
        observedResources: actualTyped.observedResources,
      },
    });
    assert.strictEqual(routeGold.pass, true, `${caseFixture.id} real scorer mismatch`);
    scorerRows.push(routeGold);
    const decisionPayload = result.decision[result.decision.action];
    rows.push({
      id: caseFixture.id,
      action: result.decision.action,
      ...(decisionPayload.reason ? { decisionReason: decisionPayload.reason } : {}),
      repeatedRuns: 25,
      trace: result.trace,
      routeGoldPass: routeGold.pass,
    });
  }

  const positive = fixtures.cases.find((caseFixture) => (
    caseFixture.typedGold.decisionAction === 'route'
  ));
  const corrupted = evaluateRouteGold({
    scenario: scorerScenario(positive),
    observed: {
      observedIntents: ['deliberate-corruption'],
      observedResources: positive.typedGold.observedResources,
    },
  });
  assert.strictEqual(corrupted.pass, false, 'corrupted route-gold observation stayed green');
  assert.strictEqual(corrupted.intentOk, false, 'corruption did not fail intent gold');

  const hardFailures = runHardFailureCases(fixtures);
  const projectionInvisibility = runProjectionInvisibility(fixtures.base);
  const protectedAfter = assertProtectedHashes();
  assert.deepStrictEqual(protectedAfter, protectedBefore, 'protected scorer bytes changed');

  const singular = rows.find((row) => row.id === 'singular-exact-signal');
  assert.ok(singular, 'singular fixture was not executed');
  assert.strictEqual(singular.trace.rankCalls, 0);
  assert.strictEqual(singular.trace.thresholdCalls, 0);
  assert.strictEqual(singular.trace.rescoreCalls, 0);
  const falsifiers = collectFalsifierEvidence(rows, hardFailures);

  return {
    rows,
    scorerRows: scorerRows.length,
    corruptedObservation: {
      pass: corrupted.pass,
      intentOk: corrupted.intentOk,
    },
    hardFailures,
    projectionInvisibility,
    protectedHashes: protectedAfter,
    falsifiers,
    singular: {
      action: singular.action,
      trace: singular.trace,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. ENTRY POINT
// ─────────────────────────────────────────────────────────────────────────────

function runValidation() {
  const staticGates = runStaticGates();
  const contractGates = runContractGates();
  const replay = runReplay();
  const frictionReasons = Object.fromEntries(
    replay.hardFailures.map((row) => [row.id, row.reason])
  );
  return {
    status: 'shadow-partial',
    successCriteria: {
      'SC-001': {
        status: 'pass',
        contract: 'pure four-input controller with closed terminal ladder',
        replayRows: replay.rows.length,
      },
      'SC-002': {
        status: 'pass',
        certificateNegatives: EXPECTED_CERTIFICATE_NEGATIVES,
        rankOnlySignalRouteUnavailable: true,
      },
      'SC-003': {
        status: 'pass',
        fixedLimits: FRICTION_LIMITS,
        hardFailureReasons: frictionReasons,
      },
      'SC-004': {
        status: 'pass',
        metrics: contractGates.metricNames,
        heldOutOnlyThresholdRule: contractGates.heldOutOnlyThresholdRule,
        externalCorpusHash: contractGates.externalCorpusHash,
        certificateId: contractGates.certificateId,
        matchingRecordCount: contractGates.matchingRecordCount,
      },
      'SC-005': {
        status: 'shadow-partial',
        projectionInvisibility: replay.projectionInvisibility,
        realRouteGoldRows: replay.scorerRows,
        corruptedObservation: replay.corruptedObservation,
        protectedHashes: replay.protectedHashes,
        deferred: 'real threshold fitting and per-hub canary evidence remain Stage 4 work',
      },
    },
    n1Fold: replay.singular,
    falsifiers: replay.falsifiers,
    staticGates,
    replayRows: replay.rows,
  };
}

if (require.main === module) {
  try {
    const result = runValidation();
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`[selective-controller-validator] ${error.stack || error.message}\n`);
    process.exitCode = 1;
  }
}

module.exports = {
  runValidation,
};
