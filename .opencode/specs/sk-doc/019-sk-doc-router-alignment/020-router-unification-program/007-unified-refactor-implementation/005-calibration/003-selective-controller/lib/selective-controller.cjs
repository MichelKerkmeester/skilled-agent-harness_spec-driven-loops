// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Selective Classification Controller                                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const {
  DOMAIN_TAGS,
  hashArtifact,
  omitFields,
} = require('../../../000-contract-schemas/lib/canonical.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXED CONTRACT DATA
// ─────────────────────────────────────────────────────────────────────────────

const FRICTION_LIMITS = Object.freeze({
  userTurns: 1,
  candidateOptions: 3,
  attempts: 2,
  decisionCardTokens: 256,
});
const NONE_OF_THESE = 'none_of_these';
const CERTIFICATE_BODY_FIELDS = Object.freeze([
  'schemaVersion',
  'corpusId',
  'corpusHash',
  'method',
  'methodParams',
  'policyHash',
  'riskSlice',
  'evaluationWindow',
  'metrics',
  'status',
  'generation',
  'validatedAt',
  'validatedBy',
]);
const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const DECIMAL_PATTERN = /^(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. ERRORS AND VALUE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

class SelectiveControllerError extends TypeError {
  /**
   * Create a stable controller failure.
   *
   * @param {string} code - Stable rejection reason.
   * @param {string} message - Human-readable detail.
   */
  constructor(code, message) {
    super(`${code}: ${message}`);
    this.name = 'SelectiveControllerError';
    this.code = code;
  }
}

function fail(code, message) {
  throw new SelectiveControllerError(code, message);
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertPlainObject(value, code, label) {
  if (!isPlainObject(value)) fail(code, `${label} must be a plain object`);
}

function assertNonEmptyString(value, code, label) {
  if (typeof value !== 'string' || !/\S/u.test(value)) {
    fail(code, `${label} must be a non-empty string`);
  }
}

function assertDigest(value, code, label) {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    fail(code, `${label} must be a lowercase SHA-256 digest`);
  }
}

function snapshot(value) {
  return JSON.parse(JSON.stringify(value));
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const item of Object.values(value)) deepFreeze(item);
    Object.freeze(value);
  }
  return value;
}

function decimalNumber(value, code, label) {
  if (typeof value !== 'string' || !DECIMAL_PATTERN.test(value)) {
    fail(code, `${label} must be a non-negative canonical decimal string`);
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) fail(code, `${label} is outside the numeric envelope`);
  return parsed;
}

function tryDecimalNumber(value) {
  if (typeof value !== 'string' || !DECIMAL_PATTERN.test(value)) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function decisionCardTokenCount(card) {
  if (typeof card !== 'string') return 0;
  const trimmed = card.trim();
  return trimmed === '' ? 0 : trimmed.split(/\s+/u).length;
}

function certificateBody(certificate) {
  return Object.fromEntries(
    CERTIFICATE_BODY_FIELDS
      .filter((field) => certificate[field] !== undefined)
      .map((field) => [field, certificate[field]])
  );
}

function computeCertificateId(certificate) {
  return hashArtifact(DOMAIN_TAGS.RouteDecisionV1, {
    artifactType: 'CalibrationCertificateV1',
    hashPurpose: 'certificate-id',
    body: certificateBody(certificate),
  });
}

function computeCertificateHash(certificate) {
  return hashArtifact(DOMAIN_TAGS.RouteDecisionV1, {
    artifactType: 'CalibrationCertificateV1',
    hashPurpose: 'fenced-cas',
    certificate: omitFields(certificate, ['certHash']),
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. INPUT CONTRACT
// ─────────────────────────────────────────────────────────────────────────────

function validateRequest(request) {
  assertPlainObject(request, 'REQUEST_INVALID', 'request');
  assertNonEmptyString(request.requestId, 'REQUEST_INVALID', 'request.requestId');
  assertNonEmptyString(request.hubId, 'REQUEST_INVALID', 'request.hubId');
  assertPlainObject(
    request.pinnedActivationGeneration,
    'REQUEST_POLICY_IDENTITY_INVALID',
    'request.pinnedActivationGeneration'
  );
  assertDigest(
    request.pinnedActivationGeneration.effectivePolicyHash,
    'REQUEST_POLICY_IDENTITY_INVALID',
    'effectivePolicyHash'
  );
  if (!Number.isInteger(request.pinnedActivationGeneration.generation)
    || request.pinnedActivationGeneration.generation < 0) {
    fail('REQUEST_POLICY_IDENTITY_INVALID', 'pinned generation must be non-negative');
  }
  assertNonEmptyString(request.riskSlice, 'REQUEST_RISK_SLICE_INVALID', 'riskSlice');
  if (!Array.isArray(request.evidence)) {
    fail('REQUEST_EVIDENCE_INVALID', 'request.evidence must be an array');
  }
  if (request.policyPosture !== undefined) {
    assertPlainObject(
      request.policyPosture,
      'REQUEST_POLICY_POSTURE_INVALID',
      'request.policyPosture'
    );
    if (!['selective', 'bounded-default-low'].includes(
      request.policyPosture.thresholdPolicy
    )) {
      fail('REQUEST_POLICY_POSTURE_INVALID', 'thresholdPolicy is outside the closed posture');
    }
  }
}

function validateBudget(budget, request) {
  assertPlainObject(budget, 'UNCERTAINTY_BUDGET_INVALID', 'uncertaintyBudget');
  if (budget.schemaVersion !== 'V1'
    || budget.userTurns !== FRICTION_LIMITS.userTurns
    || budget.handoffHops !== 1
    || !Array.isArray(budget.visited)) {
    fail('UNCERTAINTY_BUDGET_INVALID', 'budget does not match the shared contract');
  }
  assertNonEmptyString(budget.budgetId, 'UNCERTAINTY_BUDGET_INVALID', 'budgetId');
  if (budget.budgetId !== `budget:${request.requestId}`) {
    fail('UNCERTAINTY_BUDGET_REQUEST_MISMATCH', 'budgetId is not bound to requestId');
  }
}

function validateTarget(target, label) {
  assertPlainObject(target, 'CANDIDATE_TARGET_INVALID', label);
  assertPlainObject(
    target.destinationId,
    'CANDIDATE_TARGET_INVALID',
    `${label}.destinationId`
  );
  for (const field of ['skillId', 'workflowMode', 'packetId', 'packetKind', 'backendKind']) {
    assertNonEmptyString(
      target.destinationId[field],
      'CANDIDATE_TARGET_INVALID',
      `${label}.destinationId.${field}`
    );
  }
  if (!['actor', 'evidence', 'transport', 'judgment'].includes(target.role)) {
    fail('CANDIDATE_TARGET_INVALID', `${label}.role is outside the closed vocabulary`);
  }
  assertNonEmptyString(
    target.authorityRef,
    'CANDIDATE_TARGET_INVALID',
    `${label}.authorityRef`
  );
  if (typeof target.mutatesWorkspace !== 'boolean') {
    fail('CANDIDATE_TARGET_INVALID', `${label}.mutatesWorkspace must be boolean`);
  }
  if (target.role === 'evidence' && target.mutatesWorkspace) {
    fail('CANDIDATE_TARGET_INVALID', 'evidence candidates cannot mutate');
  }
}

function validateRankedCandidates(ranked) {
  assertPlainObject(ranked, 'RANKED_CANDIDATES_INVALID', 'rankedCandidates');
  if (!Number.isInteger(ranked.candidateCount) || ranked.candidateCount < 1) {
    fail('RANKED_CANDIDATES_INVALID', 'candidateCount must be a positive integer');
  }
  if (!Array.isArray(ranked.candidates)
    || ranked.candidates.length !== ranked.candidateCount) {
    fail('RANKED_CANDIDATES_INVALID', 'candidateCount must equal candidates.length');
  }
  ranked.candidates.forEach((candidate, index) => {
    assertPlainObject(candidate, 'CANDIDATE_INVALID', `candidates[${index}]`);
    validateTarget(candidate.target, `candidates[${index}].target`);
    if (typeof candidate.localLegal !== 'boolean') {
      fail('CANDIDATE_INVALID', `candidates[${index}].localLegal must be boolean`);
    }
  });
  if (!['single', 'orderedBundle', 'surfaceBundle'].includes(ranked.selectionKind)) {
    fail('RANKED_CANDIDATES_INVALID', 'selectionKind is outside the closed vocabulary');
  }
  if (!Number.isInteger(ranked.interaction?.attempt)
    || ranked.interaction.attempt < 1) {
    fail('FRICTION_ATTEMPTS_INVALID', 'interaction.attempt must be a positive integer');
  }
  if (!Number.isInteger(ranked.interaction.userTurnsUsed)
    || ranked.interaction.userTurnsUsed < 0) {
    fail('FRICTION_USER_TURNS_INVALID', 'userTurnsUsed must be non-negative');
  }
}

function validateFrictionState(ranked) {
  if (ranked.interaction.userTurnsUsed > FRICTION_LIMITS.userTurns) {
    fail('FRICTION_USER_TURNS_EXCEEDED', 'a second user turn is forbidden');
  }
  if (ranked.interaction.attempt > FRICTION_LIMITS.attempts) {
    fail('FRICTION_ATTEMPTS_EXCEEDED', 'a third controller attempt is forbidden');
  }
}

function canSpendUserTurn(ranked) {
  return ranked.interaction.userTurnsUsed < FRICTION_LIMITS.userTurns;
}

function assertSingularFold(ranked, certificateHandle) {
  if (ranked.selectionKind !== 'single') {
    fail('SINGULAR_SELECTION_KIND_INVALID', 'N=1 can only emit a single selection');
  }
  if (ranked.rankingInvoked === true || ranked.rankEvidence !== undefined) {
    fail('SINGULAR_THRESHOLD_LOGIC_FORBIDDEN', 'N=1 cannot invoke ranking evidence');
  }
  if (certificateHandle?.state !== 'absent') {
    fail('SINGULAR_THRESHOLD_LOGIC_FORBIDDEN', 'N=1 cannot resolve a certificate');
  }
  if (ranked.boundedDefaultCandidateIndex !== undefined) {
    fail('SINGULAR_THRESHOLD_LOGIC_FORBIDDEN', 'N=1 has no threshold default corner');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CERTIFICATE AND EVIDENCE GATES
// ─────────────────────────────────────────────────────────────────────────────

function certificateUnavailable(code) {
  return { available: false, reason: code };
}

function validateCertificateGate(request, certificateHandle) {
  if (!certificateHandle || certificateHandle.state === 'absent') {
    return certificateUnavailable('CERTIFICATE_ABSENT');
  }
  if (certificateHandle.state === 'stale') {
    return certificateUnavailable('CERTIFICATE_STALE');
  }
  if (certificateHandle.state !== 'live') {
    return certificateUnavailable('CERTIFICATE_HANDLE_STATE_INVALID');
  }
  const certificate = certificateHandle.certificate;
  if (!isPlainObject(certificate)) return certificateUnavailable('CERTIFICATE_UNRESOLVED');
  if (certificate.status !== 'validated') {
    return certificateUnavailable('CERTIFICATE_STATUS_NOT_VALIDATED');
  }
  if (certificate.method !== 'selective-classification-threshold') {
    return certificateUnavailable('CERTIFICATE_RISK_METHOD_MISMATCH');
  }
  let computedCertificateId;
  let computedCertificateHash;
  try {
    computedCertificateId = computeCertificateId(certificate);
    computedCertificateHash = computeCertificateHash(certificate);
  } catch {
    return certificateUnavailable('CERTIFICATE_MALFORMED');
  }
  if (computedCertificateId !== certificate.certificateId) {
    return certificateUnavailable('CERTIFICATE_ID_MISMATCH');
  }
  if (computedCertificateHash !== certificate.certHash) {
    return certificateUnavailable('CERTIFICATE_HASH_MISMATCH');
  }
  if (certificateHandle.activeCertificateId !== certificate.certificateId) {
    return certificateUnavailable('CERTIFICATE_NOT_ACTIVE');
  }
  if (certificate.policyHash
    !== request.pinnedActivationGeneration.effectivePolicyHash) {
    return certificateUnavailable('CERTIFICATE_POLICY_MISMATCH');
  }
  if (certificate.riskSlice !== request.riskSlice) {
    return certificateUnavailable('CERTIFICATE_RISK_SLICE_MISMATCH');
  }
  if (certificate.generation !== request.pinnedActivationGeneration.generation) {
    return certificateUnavailable('CERTIFICATE_GENERATION_MISMATCH');
  }
  if (certificate.corpusId !== certificate.corpusHash) {
    return certificateUnavailable('CERTIFICATE_CORPUS_IDENTITY_MISMATCH');
  }
  if (!isPlainObject(certificate.methodParams)
    || !isPlainObject(certificate.metrics)
    || typeof certificate.metrics.selectiveRisk !== 'string') {
    return certificateUnavailable('CERTIFICATE_RISK_EVIDENCE_MISSING');
  }
  const threshold = tryDecimalNumber(certificate.methodParams.abstentionThreshold);
  if (threshold === null) {
    return certificateUnavailable('CERTIFICATE_THRESHOLD_INVALID');
  }
  if (tryDecimalNumber(certificate.metrics.selectiveRisk) === null) {
    return certificateUnavailable('CERTIFICATE_SELECTIVE_RISK_INVALID');
  }
  return { available: true, reason: 'CERTIFICATE_BOUND', certificate, threshold };
}

function advisorDisposition(request, rankEvidence) {
  const advisor = rankEvidence?.advisor;
  if (!advisor || advisor.trust === 'absent' || advisor.trust === 'unavailable') {
    return { contributes: false, reason: 'ADVISOR_ZERO_EVIDENCE' };
  }
  if (advisor.trust === 'stale') {
    return { contributes: false, reason: 'ADVISOR_STALE_ANNOTATION_ONLY' };
  }
  if (advisor.trust !== 'live') {
    return { contributes: false, reason: 'ADVISOR_TRUST_INVALID' };
  }
  if (advisor.policyHash !== request.pinnedActivationGeneration.effectivePolicyHash
    || advisor.riskSlice !== request.riskSlice) {
    return { contributes: false, reason: 'ADVISOR_IDENTITY_MISMATCH' };
  }
  return { contributes: true, reason: 'ADVISOR_LIVE_IDENTITY_MATCH' };
}

function rankDisposition(request, ranked) {
  const evidence = ranked.rankEvidence;
  if (!isPlainObject(evidence)) {
    return { usable: false, reason: 'RANK_EVIDENCE_ABSENT', evidence: null };
  }
  if (!['compiled-policy', 'advisor', 'combined'].includes(evidence.source)) {
    return { usable: false, reason: 'RANK_EVIDENCE_SOURCE_INVALID', evidence: null };
  }
  for (const field of ['rankScore', 'scoreMargin']) {
    if (!isPlainObject(evidence[field]) || evidence[field].nonAuthority !== true) {
      return { usable: false, reason: 'RANK_EVIDENCE_AUTHORITY_INVALID', evidence: null };
    }
    decimalNumber(evidence[field].value, 'RANK_EVIDENCE_INVALID', field);
  }
  const advisor = advisorDisposition(request, evidence);
  const compiledPolicyContributes = evidence.source === 'compiled-policy'
    || evidence.source === 'combined';
  const advisorContributes = evidence.source !== 'compiled-policy' && advisor.contributes;
  return {
    usable: compiledPolicyContributes || advisorContributes,
    reason: compiledPolicyContributes ? 'COMPILED_POLICY_RANK' : advisor.reason,
    advisor,
    evidence,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. DECISION BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

function makeCalibrationClaim(certificate) {
  return {
    status: 'validated',
    certificateId: certificate.certificateId,
    corpusId: certificate.corpusId,
    method: certificate.method,
    policyHash: certificate.policyHash,
    riskSlice: certificate.riskSlice,
    evaluationWindow: snapshot(certificate.evaluationWindow),
    estimatedError: Number(certificate.metrics.selectiveRisk),
  };
}

function makeRoute(ranked, basisKind, certificate, selectedIndex = 0) {
  const selected = ranked.selectionKind === 'single'
    ? [ranked.candidates[selectedIndex]]
    : ranked.candidates;
  if (selected.some((candidate) => !candidate || candidate.localLegal !== true)) {
    fail('LOCAL_ROUTE_ILLEGAL', 'route selection includes a non-local or illegal candidate');
  }
  const rankEvidence = ranked.rankEvidence || {
    rankScore: { value: '0', nonAuthority: true },
    scoreMargin: { value: '0', nonAuthority: true },
  };
  return {
    schemaVersion: 'V1',
    action: 'route',
    route: {
      selectionKind: ranked.selectionKind,
      targets: selected.map((candidate) => snapshot(candidate.target)),
      basis: { kind: basisKind },
      evidence: {
        rankScore: snapshot(rankEvidence.rankScore),
        scoreMargin: snapshot(rankEvidence.scoreMargin),
        calibration: certificate
          ? makeCalibrationClaim(certificate)
          : { status: 'unvalidated' },
      },
      authority: 'WithheldUntilVerify',
    },
  };
}

function makeClarify(clarification, budget) {
  return {
    schemaVersion: 'V1',
    action: 'clarify',
    clarify: {
      question: clarification.question,
      budgetRef: budget.budgetId,
      alternatives: [
        ...clarification.options.map((option) => option.label),
        NONE_OF_THESE,
      ],
      authority: 'Withheld',
    },
  };
}

function makeDefer(reason) {
  return {
    schemaVersion: 'V1',
    action: 'defer',
    defer: {
      reason,
      recovery: ['defer'],
      authority: 'Withheld',
    },
  };
}

function validateClarification(ranked) {
  const clarification = ranked.clarification;
  if (!isPlainObject(clarification)) return null;
  assertNonEmptyString(
    clarification.question,
    'CLARIFICATION_INVALID',
    'clarification.question'
  );
  if (!Array.isArray(clarification.options) || clarification.options.length === 0) {
    fail('CLARIFICATION_INVALID', 'clarification requires candidate options');
  }
  if (clarification.options.length > FRICTION_LIMITS.candidateOptions) {
    fail('FRICTION_OPTIONS_EXCEEDED', 'a fourth candidate option is forbidden');
  }
  const optionIds = new Set();
  for (const option of clarification.options) {
    assertPlainObject(option, 'CLARIFICATION_INVALID', 'clarification option');
    assertNonEmptyString(option.id, 'CLARIFICATION_INVALID', 'clarification option id');
    assertNonEmptyString(
      option.label,
      'CLARIFICATION_INVALID',
      'clarification option label'
    );
    if (option.id === NONE_OF_THESE || optionIds.has(option.id)) {
      fail('CLARIFICATION_INVALID', 'clarification option ids must be unique and typed');
    }
    optionIds.add(option.id);
    if (!Number.isInteger(option.candidateIndex)
      || option.candidateIndex < 0
      || option.candidateIndex >= ranked.candidateCount) {
      fail('CLARIFICATION_INVALID', 'clarification option points outside candidates');
    }
  }
  const cardTokens = decisionCardTokenCount(clarification.decisionCard);
  if (cardTokens > FRICTION_LIMITS.decisionCardTokens) {
    fail('FRICTION_CARD_TOKENS_EXCEEDED', 'decision card exceeds 256 contract tokens');
  }
  return { ...clarification, optionIds, cardTokens };
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

function resolveSingular(ranked, budget) {
  const candidate = ranked.candidates[0];
  if (candidate.localLegal === true && candidate.exactSignal === true) {
    return {
      decision: makeRoute(ranked, 'signal', null),
      trace: {
        branch: 'singular-exact-signal',
        rankCalls: 0,
        thresholdCalls: 0,
        rescoreCalls: 0,
        userTurns: ranked.interaction.userTurnsUsed,
      },
    };
  }
  const clarification = validateClarification(ranked);
  if (clarification && ranked.interaction.attempt === 1 && canSpendUserTurn(ranked)) {
    return {
      decision: makeClarify(clarification, budget),
      trace: {
        branch: 'singular-leaf-clarify',
        rankCalls: 0,
        thresholdCalls: 0,
        rescoreCalls: 0,
        userTurns: ranked.interaction.userTurnsUsed + 1,
        cardTokens: clarification.cardTokens,
      },
    };
  }
  return {
    decision: makeDefer('no-match'),
    trace: {
      branch: 'singular-no-match',
      rankCalls: 0,
      thresholdCalls: 0,
      rescoreCalls: 0,
      userTurns: ranked.interaction.userTurnsUsed,
    },
  };
}

function resolveMultiCandidate(request, ranked, certificateHandle, budget) {
  const certificate = validateCertificateGate(request, certificateHandle);
  const rank = rankDisposition(request, ranked);
  const rankScore = rank.usable
    ? decimalNumber(rank.evidence.rankScore.value, 'RANK_EVIDENCE_INVALID', 'rankScore')
    : null;
  const clarification = validateClarification(ranked);
  const acceptedAnswer = ranked.interaction.acceptedAnswer;
  const acceptedOption = acceptedAnswer === NONE_OF_THESE
    ? null
    : clarification?.options.find((option) => option.id === acceptedAnswer);
  const isAcceptedRescore = ranked.interaction.attempt === 2
    && typeof acceptedAnswer === 'string';
  const acceptedCandidate = acceptedOption
    ? ranked.candidates[acceptedOption.candidateIndex]
    : null;

  if (isAcceptedRescore && acceptedCandidate?.localLegal !== true) {
    return {
      decision: makeDefer('no-match'),
      trace: {
        branch: 'accepted-answer-no-match',
        certificateReason: certificate.reason,
        advisorReason: rank.advisor?.reason || null,
        rankCalls: rank.usable ? 1 : 0,
        thresholdCalls: 0,
        rescoreCalls: 1,
        userTurns: ranked.interaction.userTurnsUsed,
      },
    };
  }

  if (certificate.available && rank.usable && rankScore >= certificate.threshold) {
    const selectedIndex = isAcceptedRescore && acceptedOption
      ? acceptedOption.candidateIndex
      : 0;
    return {
      decision: makeRoute(ranked, 'signal', certificate.certificate, selectedIndex),
      trace: {
        branch: isAcceptedRescore ? 'accepted-answer-certified-route' : 'certified-signal-route',
        certificateReason: certificate.reason,
        advisorReason: rank.advisor?.reason || null,
        rankCalls: 1,
        thresholdCalls: 1,
        rescoreCalls: isAcceptedRescore ? 1 : 0,
        userTurns: ranked.interaction.userTurnsUsed,
      },
    };
  }

  const isCertifiedLowCorner = certificate.available
    && rank.usable
    && request.policyPosture?.thresholdPolicy === 'bounded-default-low'
    && Number.isInteger(ranked.boundedDefaultCandidateIndex)
    && ranked.boundedDefaultCandidateIndex >= 0
    && ranked.boundedDefaultCandidateIndex < ranked.candidateCount;
  if (isCertifiedLowCorner) {
    return {
      decision: makeRoute(
        ranked,
        'bounded-default',
        certificate.certificate,
        ranked.boundedDefaultCandidateIndex
      ),
      trace: {
        branch: 'certified-bounded-default',
        certificateReason: certificate.reason,
        advisorReason: rank.advisor?.reason || null,
        rankCalls: rank.usable ? 1 : 0,
        thresholdCalls: 1,
        rescoreCalls: isAcceptedRescore ? 1 : 0,
        userTurns: ranked.interaction.userTurnsUsed,
      },
    };
  }

  if (isAcceptedRescore) {
    return {
      decision: makeDefer(acceptedOption ? 'evidence-unavailable' : 'no-match'),
      trace: {
        branch: acceptedOption ? 'accepted-answer-uncertified' : 'accepted-answer-no-match',
        certificateReason: certificate.reason,
        advisorReason: rank.advisor?.reason || null,
        rankCalls: rank.usable ? 1 : 0,
        thresholdCalls: certificate.available ? 1 : 0,
        rescoreCalls: 1,
        userTurns: ranked.interaction.userTurnsUsed,
      },
    };
  }

  if (clarification && ranked.interaction.attempt === 1 && canSpendUserTurn(ranked)) {
    return {
      decision: makeClarify(clarification, budget),
      trace: {
        branch: 'certificate-gated-clarify',
        certificateReason: certificate.reason,
        advisorReason: rank.advisor?.reason || null,
        rankCalls: rank.usable ? 1 : 0,
        thresholdCalls: certificate.available ? 1 : 0,
        rescoreCalls: 0,
        userTurns: ranked.interaction.userTurnsUsed + 1,
        cardTokens: clarification.cardTokens,
      },
    };
  }

  return {
    decision: makeDefer(rank.usable ? 'evidence-unavailable' : 'no-match'),
    trace: {
      branch: 'bounded-abstention',
      certificateReason: certificate.reason,
      advisorReason: rank.advisor?.reason || null,
      rankCalls: rank.usable ? 1 : 0,
      thresholdCalls: certificate.available && rank.usable ? 1 : 0,
      rescoreCalls: 0,
      userTurns: ranked.interaction.userTurnsUsed,
    },
  };
}

/**
 * Resolve one request without effects or destination authority.
 *
 * @param {Object} request - Request-pinned policy and risk identity.
 * @param {Object} rankedCandidates - Ordered local candidates and evidence.
 * @param {Object} certificateHandle - External certificate registry handle.
 * @param {Object} uncertaintyBudget - Shared one-turn recovery budget.
 * @returns {Object} Frozen RouteDecisionV1.
 * @throws {SelectiveControllerError} When a hard contract bound is exceeded.
 */
function resolveSelectiveController(
  request,
  rankedCandidates,
  certificateHandle,
  uncertaintyBudget
) {
  return inspectSelectiveController(
    request,
    rankedCandidates,
    certificateHandle,
    uncertaintyBudget
  ).decision;
}

/**
 * Resolve one request and return replay diagnostics beside the public decision.
 *
 * @param {Object} request - Request-pinned policy and risk identity.
 * @param {Object} rankedCandidates - Ordered local candidates and evidence.
 * @param {Object} certificateHandle - External certificate registry handle.
 * @param {Object} uncertaintyBudget - Shared one-turn recovery budget.
 * @returns {Object} Frozen decision and non-authoritative replay trace.
 * @throws {SelectiveControllerError} When a hard contract bound is exceeded.
 */
function inspectSelectiveController(
  request,
  rankedCandidates,
  certificateHandle,
  uncertaintyBudget
) {
  validateRequest(request);
  validateBudget(uncertaintyBudget, request);
  validateRankedCandidates(rankedCandidates);
  validateFrictionState(rankedCandidates);

  const result = rankedCandidates.candidateCount === 1
    ? (() => {
      assertSingularFold(rankedCandidates, certificateHandle);
      return resolveSingular(rankedCandidates, uncertaintyBudget);
    })()
    : resolveMultiCandidate(
      request,
      rankedCandidates,
      certificateHandle,
      uncertaintyBudget
    );
  return deepFreeze(snapshot(result));
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  FRICTION_LIMITS,
  NONE_OF_THESE,
  SelectiveControllerError,
  decisionCardTokenCount,
  inspectSelectiveController,
  resolveSelectiveController,
};
