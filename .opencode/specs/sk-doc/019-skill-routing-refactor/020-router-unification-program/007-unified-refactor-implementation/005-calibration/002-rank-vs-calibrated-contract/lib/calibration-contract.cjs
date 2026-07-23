// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Calibration Certificate and Route Evidence Contract                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const fs = require('fs');
const path = require('path');

const {
  DOMAIN_TAGS,
  canonicalBytes,
  canonicalize,
  hashArtifact,
  omitFields,
} = require('../../../000-contract-schemas/lib/canonical.cjs');
const {
  computeCorpusHash,
} = require('../../001-holdout-corpus/lib/calibration-corpus.cjs');
const {
  parseRouteDecisionShape,
} = require('../../../002-decision-evaluator/lib/decision-contract.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. FIXED CONTRACT DATA
// ─────────────────────────────────────────────────────────────────────────────

const METHOD_ENVELOPE_PATH = path.resolve(
  __dirname,
  '../calibration-method-envelope.v1.json'
);
const METHOD_ENVELOPE = deepFreeze(
  JSON.parse(fs.readFileSync(METHOD_ENVELOPE_PATH, 'utf8'))
);
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
const CERTIFICATE_FIELDS = Object.freeze([
  'certificateId',
  ...CERTIFICATE_BODY_FIELDS,
  'certHash',
]);
const ROUTE_FIELDS = Object.freeze([
  'selectionKind',
  'targets',
  'basis',
  'evidence',
  'authority',
]);
const TARGET_FIELDS = Object.freeze([
  'destinationId',
  'role',
  'authorityRef',
  'mutatesWorkspace',
]);
const DESTINATION_FIELDS = Object.freeze([
  'skillId',
  'workflowMode',
  'packetId',
  'packetKind',
  'backendKind',
]);
const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const DECIMAL_PATTERN = /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]+)?$/;
const UNIT_DECIMAL_PATTERN = /^(?:0(?:\.[0-9]+)?|1(?:\.0+)?)$/;
const POSITIVE_DECIMAL_PATTERN = /^(?:0\.(?:0*[1-9][0-9]*)|[1-9][0-9]*(?:\.[0-9]+)?)$/;

// ─────────────────────────────────────────────────────────────────────────────
// 3. ERRORS AND VALUE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

class CalibrationContractError extends TypeError {
  /**
   * Create a contract error with a stable reason code.
   *
   * @param {string} code - Stable rejection reason.
   * @param {string} message - Human-readable detail.
   */
  constructor(code, message) {
    super(message);
    this.name = 'CalibrationContractError';
    this.code = code;
  }
}

function fail(code, message) {
  throw new CalibrationContractError(code, message);
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertPlainObject(value, code, label) {
  if (!isPlainObject(value)) fail(code, `${label} must be a plain object`);
}

function assertExactKeys(value, allowedKeys, code, label) {
  const allowed = new Set(allowedKeys);
  const extras = Object.keys(value).filter((key) => !allowed.has(key));
  if (extras.length > 0) {
    fail(code, `${label} contains unsupported fields: ${extras.join(', ')}`);
  }
}

function assertRequiredKeys(value, requiredKeys, code, label) {
  const missing = requiredKeys.filter(
    (key) => !Object.prototype.hasOwnProperty.call(value, key)
  );
  if (missing.length > 0) fail(code, `${label} is missing fields: ${missing.join(', ')}`);
}

function assertNonEmptyString(value, code, label) {
  if (typeof value !== 'string' || !/\S/.test(value)) {
    fail(code, `${label} must be a non-empty string`);
  }
}

function assertDigest(value, code, label) {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    fail(code, `${label} must be a lowercase SHA-256 digest`);
  }
}

function cloneValue(value) {
  if (Array.isArray(value)) return value.map(cloneValue);
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, cloneValue(item)])
  );
}

function deepFreeze(value) {
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const item of Object.values(value)) deepFreeze(item);
    Object.freeze(value);
  }
  return value;
}

function sameCanonical(left, right) {
  return canonicalBytes(left).equals(canonicalBytes(right));
}

function certificateBody(certificate) {
  return Object.fromEntries(
    CERTIFICATE_BODY_FIELDS
      .filter((field) => certificate[field] !== undefined)
      .map((field) => [field, certificate[field]])
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CERTIFICATE IDENTITY AND SHAPE
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the immutable certificate identity through the frozen hash function.
 *
 * @param {Object} certificate - Certificate body or sealed certificate.
 * @returns {string} Domain-separated lowercase digest.
 */
function computeCertificateId(certificate) {
  return hashArtifact(DOMAIN_TAGS.RouteDecisionV1, {
    artifactType: 'CalibrationCertificateV1',
    hashPurpose: 'certificate-id',
    body: certificateBody(certificate),
  });
}

/**
 * Compute the fenced-CAS hash through the frozen hash function.
 *
 * @param {Object} certificate - Sealed certificate without or with certHash.
 * @returns {string} Domain-separated lowercase digest.
 */
function computeCertHash(certificate) {
  const withoutHash = omitFields(certificate, ['certHash']);
  return hashArtifact(DOMAIN_TAGS.RouteDecisionV1, {
    artifactType: 'CalibrationCertificateV1',
    hashPurpose: 'fenced-cas',
    certificate: withoutHash,
  });
}

function assertEvaluationWindow(window) {
  assertPlainObject(
    window,
    'CERTIFICATE_EVALUATION_WINDOW_INVALID',
    'evaluationWindow'
  );
  const isCorpusWindow = Object.prototype.hasOwnProperty.call(window, 'corpusVersion');
  if (isCorpusWindow) {
    assertExactKeys(
      window,
      ['corpusVersion', 'sampleCount'],
      'CERTIFICATE_EVALUATION_WINDOW_INVALID',
      'evaluationWindow'
    );
    assertRequiredKeys(
      window,
      ['corpusVersion', 'sampleCount'],
      'CERTIFICATE_EVALUATION_WINDOW_INVALID',
      'evaluationWindow'
    );
    assertNonEmptyString(
      window.corpusVersion,
      'CERTIFICATE_EVALUATION_WINDOW_INVALID',
      'evaluationWindow.corpusVersion'
    );
    if (!Number.isInteger(window.sampleCount) || window.sampleCount < 1) {
      fail(
        'CERTIFICATE_EVALUATION_WINDOW_INVALID',
        'evaluationWindow.sampleCount must be a positive integer'
      );
    }
    return;
  }
  assertExactKeys(
    window,
    ['from', 'to'],
    'CERTIFICATE_EVALUATION_WINDOW_INVALID',
    'evaluationWindow'
  );
  assertRequiredKeys(
    window,
    ['from', 'to'],
    'CERTIFICATE_EVALUATION_WINDOW_INVALID',
    'evaluationWindow'
  );
  const from = Date.parse(window.from);
  const to = Date.parse(window.to);
  if (!Number.isFinite(from) || !Number.isFinite(to) || from >= to) {
    fail(
      'CERTIFICATE_EVALUATION_WINDOW_INVALID',
      'evaluationWindow must contain an ordered date-time range'
    );
  }
}

function assertUnitDecimal(value, code, label) {
  if (typeof value !== 'string' || !UNIT_DECIMAL_PATTERN.test(value)) {
    fail(code, `${label} must be a canonical decimal string in [0,1]`);
  }
}

function assertMethodParams(method, params) {
  assertPlainObject(params, 'CERTIFICATE_METHOD_PARAMS_INVALID', 'methodParams');
  const contract = METHOD_ENVELOPE.methods[method];
  if (!contract) fail('CERTIFICATE_METHOD_INVALID', `unsupported method: ${String(method)}`);
  assertExactKeys(
    params,
    contract.methodParams,
    'CERTIFICATE_METHOD_PARAMS_INVALID',
    'methodParams'
  );
  assertRequiredKeys(
    params,
    contract.methodParams,
    'CERTIFICATE_METHOD_PARAMS_INVALID',
    'methodParams'
  );
  if (method === 'temperature-scaling') {
    if (typeof params.temperature !== 'string'
      || !POSITIVE_DECIMAL_PATTERN.test(params.temperature)) {
      fail(
        'CERTIFICATE_METHOD_PARAMS_INVALID',
        'temperature must be a positive canonical decimal string'
      );
    }
    return;
  }
  assertUnitDecimal(
    params.abstentionThreshold,
    'CERTIFICATE_METHOD_PARAMS_INVALID',
    'methodParams.abstentionThreshold'
  );
  assertUnitDecimal(
    params.coverageTarget,
    'CERTIFICATE_METHOD_PARAMS_INVALID',
    'methodParams.coverageTarget'
  );
}

function assertMetrics(metrics) {
  assertPlainObject(metrics, 'CERTIFICATE_METRICS_INVALID', 'metrics');
  assertExactKeys(
    metrics,
    METHOD_ENVELOPE.metrics,
    'CERTIFICATE_METRICS_INVALID',
    'metrics'
  );
  assertRequiredKeys(
    metrics,
    METHOD_ENVELOPE.metrics,
    'CERTIFICATE_METRICS_INVALID',
    'metrics'
  );
  for (const metric of METHOD_ENVELOPE.metrics.filter((name) => name !== 'sampleCount')) {
    assertUnitDecimal(metrics[metric], 'CERTIFICATE_METRICS_INVALID', `metrics.${metric}`);
  }
  if (!Number.isInteger(metrics.sampleCount) || metrics.sampleCount < 1) {
    fail('CERTIFICATE_METRICS_INVALID', 'metrics.sampleCount must be a positive integer');
  }
}

function validateCertificateBody(body) {
  assertPlainObject(body, 'CERTIFICATE_INVALID', 'certificate body');
  assertExactKeys(body, CERTIFICATE_BODY_FIELDS, 'CERTIFICATE_FIELDS_INVALID', 'certificate body');
  const required = CERTIFICATE_BODY_FIELDS.filter(
    (field) => !['validatedAt', 'validatedBy'].includes(field)
  );
  assertRequiredKeys(body, required, 'CERTIFICATE_FIELDS_MISSING', 'certificate body');
  if (body.schemaVersion !== 'V1') {
    fail('CERTIFICATE_SCHEMA_VERSION_INVALID', 'certificate schemaVersion must be V1');
  }
  assertDigest(body.corpusId, 'CERTIFICATE_CORPUS_ID_INVALID', 'corpusId');
  assertDigest(body.corpusHash, 'CERTIFICATE_CORPUS_HASH_INVALID', 'corpusHash');
  assertDigest(body.policyHash, 'CERTIFICATE_POLICY_HASH_INVALID', 'policyHash');
  assertNonEmptyString(body.riskSlice, 'CERTIFICATE_RISK_SLICE_INVALID', 'riskSlice');
  assertMethodParams(body.method, body.methodParams);
  assertEvaluationWindow(body.evaluationWindow);
  assertMetrics(body.metrics);
  if (!METHOD_ENVELOPE.lifecycle.includes(body.status)) {
    fail('CERTIFICATE_STATUS_INVALID', `unsupported status: ${String(body.status)}`);
  }
  if (!Number.isInteger(body.generation) || body.generation < 0) {
    fail('CERTIFICATE_GENERATION_INVALID', 'generation must be a non-negative integer');
  }
  if (body.status !== 'candidate') {
    assertNonEmptyString(
      body.validatedAt,
      'CERTIFICATE_VALIDATION_METADATA_MISSING',
      'validatedAt'
    );
    assertNonEmptyString(
      body.validatedBy,
      'CERTIFICATE_VALIDATION_METADATA_MISSING',
      'validatedBy'
    );
    if (!Number.isFinite(Date.parse(body.validatedAt))) {
      fail('CERTIFICATE_VALIDATION_METADATA_INVALID', 'validatedAt must be a date-time');
    }
  } else if (body.validatedAt !== undefined || body.validatedBy !== undefined) {
    fail(
      'CERTIFICATE_CANDIDATE_VALIDATION_METADATA_FORBIDDEN',
      'candidate certificates cannot claim validation metadata'
    );
  }
  return true;
}

/**
 * Seal a certificate body with reproducible identity and CAS hashes.
 *
 * @param {Object} body - Certificate body without identity fields.
 * @returns {Object} Frozen sealed certificate.
 */
function sealCertificate(body) {
  validateCertificateBody(body);
  const copiedBody = cloneValue(body);
  const certificateId = computeCertificateId(copiedBody);
  const withId = { certificateId, ...copiedBody };
  return deepFreeze({ ...withId, certHash: computeCertHash(withId) });
}

/**
 * Validate a sealed certificate and recompute both identities.
 *
 * @param {Object} certificate - Candidate sealed certificate.
 * @returns {Object} Frozen validated copy.
 */
function validateCertificate(certificate) {
  assertPlainObject(certificate, 'CERTIFICATE_INVALID', 'certificate');
  assertExactKeys(certificate, CERTIFICATE_FIELDS, 'CERTIFICATE_FIELDS_INVALID', 'certificate');
  assertRequiredKeys(
    certificate,
    CERTIFICATE_FIELDS.filter(
      (field) => !['validatedAt', 'validatedBy'].includes(field)
    ),
    'CERTIFICATE_FIELDS_MISSING',
    'certificate'
  );
  validateCertificateBody(certificateBody(certificate));
  assertDigest(certificate.certificateId, 'CERTIFICATE_ID_INVALID', 'certificateId');
  assertDigest(certificate.certHash, 'CERTIFICATE_HASH_INVALID', 'certHash');
  if (computeCertificateId(certificate) !== certificate.certificateId) {
    fail('CERTIFICATE_ID_MISMATCH', 'certificateId does not match canonical content');
  }
  if (computeCertHash(certificate) !== certificate.certHash) {
    fail('CERTIFICATE_HASH_MISMATCH', 'certHash does not match canonical content');
  }
  return deepFreeze(cloneValue(certificate));
}

/**
 * Create the next immutable lifecycle artifact.
 *
 * @param {Object} certificate - Current sealed certificate.
 * @param {string} nextStatus - Valid next lifecycle status.
 * @param {Object} [validation] - External validation metadata for promotion.
 * @returns {Object} Frozen sealed successor artifact.
 */
function transitionCertificate(certificate, nextStatus, validation = {}) {
  const current = validateCertificate(certificate);
  const allowed = current.status === 'candidate'
    ? ['validated']
    : current.status === 'validated'
      ? ['expired', 'revoked']
      : [];
  if (!allowed.includes(nextStatus)) {
    fail(
      'CERTIFICATE_LIFECYCLE_INVALID',
      `${current.status} cannot transition to ${String(nextStatus)}`
    );
  }
  const body = certificateBody(current);
  body.status = nextStatus;
  if (nextStatus === 'validated') {
    assertNonEmptyString(
      validation.validatedAt,
      'CERTIFICATE_VALIDATION_METADATA_MISSING',
      'validatedAt'
    );
    assertNonEmptyString(
      validation.validatedBy,
      'CERTIFICATE_VALIDATION_METADATA_MISSING',
      'validatedBy'
    );
    body.validatedAt = validation.validatedAt;
    body.validatedBy = validation.validatedBy;
  }
  return sealCertificate(body);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. ROUTE EVIDENCE AND LEGALITY
// ─────────────────────────────────────────────────────────────────────────────

function assertRankValue(value, label) {
  assertPlainObject(value, 'RANK_EVIDENCE_INVALID', label);
  assertExactKeys(value, ['value', 'nonAuthority'], 'RANK_EVIDENCE_FIELDS_INVALID', label);
  assertRequiredKeys(value, ['value', 'nonAuthority'], 'RANK_EVIDENCE_FIELDS_INVALID', label);
  if (typeof value.value !== 'string' || !DECIMAL_PATTERN.test(value.value)) {
    fail('RANK_EVIDENCE_VALUE_INVALID', `${label}.value must be a decimal string`);
  }
  if (value.nonAuthority !== true) {
    fail('RANK_EVIDENCE_AUTHORITY_FORBIDDEN', `${label} must be non-authority evidence`);
  }
}

function assertCalibration(calibration) {
  assertPlainObject(calibration, 'CALIBRATION_INVALID', 'calibration');
  if (calibration.status === 'unvalidated') {
    assertExactKeys(
      calibration,
      ['status'],
      'CALIBRATION_UNVALIDATED_FIELDS',
      'unvalidated calibration'
    );
    return;
  }
  if (calibration.status !== 'validated') {
    fail('CALIBRATION_STATUS_INVALID', 'calibration status is outside the union');
  }
  const fields = [
    'status',
    'certificateId',
    'corpusId',
    'method',
    'policyHash',
    'riskSlice',
    'evaluationWindow',
    'estimatedError',
  ];
  assertExactKeys(calibration, fields, 'CALIBRATION_VALIDATED_FIELDS', 'calibration');
  assertRequiredKeys(calibration, fields, 'CALIBRATION_VALIDATED_FIELDS', 'calibration');
  assertDigest(calibration.certificateId, 'CALIBRATION_CERTIFICATE_ID_INVALID', 'certificateId');
  assertDigest(calibration.corpusId, 'CALIBRATION_CORPUS_ID_INVALID', 'corpusId');
  assertDigest(calibration.policyHash, 'CALIBRATION_POLICY_HASH_INVALID', 'policyHash');
  assertNonEmptyString(
    calibration.riskSlice,
    'CALIBRATION_RISK_SLICE_INVALID',
    'riskSlice'
  );
  if (!METHOD_ENVELOPE.methods[calibration.method]) {
    fail('CALIBRATION_METHOD_INVALID', 'calibration method is outside the envelope');
  }
  assertEvaluationWindow(calibration.evaluationWindow);
  if (typeof calibration.estimatedError !== 'number'
    || !Number.isFinite(calibration.estimatedError)
    || calibration.estimatedError < 0
    || calibration.estimatedError > 1) {
    fail('CALIBRATION_ESTIMATED_ERROR_INVALID', 'estimatedError must be a number in [0,1]');
  }
}

function assertDestinationId(destinationId) {
  assertPlainObject(destinationId, 'TARGET_DESTINATION_INVALID', 'destinationId');
  assertExactKeys(
    destinationId,
    [...DESTINATION_FIELDS, 'runtimeDiscriminator'],
    'TARGET_DESTINATION_INVALID',
    'destinationId'
  );
  assertRequiredKeys(
    destinationId,
    DESTINATION_FIELDS,
    'TARGET_DESTINATION_INVALID',
    'destinationId'
  );
  for (const field of DESTINATION_FIELDS) {
    assertNonEmptyString(
      destinationId[field],
      'TARGET_DESTINATION_INVALID',
      `destinationId.${field}`
    );
  }
  if (destinationId.runtimeDiscriminator !== undefined) {
    assertNonEmptyString(
      destinationId.runtimeDiscriminator,
      'TARGET_DESTINATION_INVALID',
      'destinationId.runtimeDiscriminator'
    );
  }
}

function assertTarget(target) {
  assertPlainObject(target, 'TARGET_INVALID', 'target');
  assertExactKeys(target, TARGET_FIELDS, 'TARGET_FIELDS_INVALID', 'target');
  assertRequiredKeys(target, TARGET_FIELDS, 'TARGET_FIELDS_INVALID', 'target');
  assertDestinationId(target.destinationId);
  if (!['actor', 'evidence', 'transport', 'judgment'].includes(target.role)) {
    fail('TARGET_ROLE_INVALID', 'target role is outside the closed vocabulary');
  }
  assertNonEmptyString(target.authorityRef, 'TARGET_AUTHORITY_INVALID', 'authorityRef');
  if (typeof target.mutatesWorkspace !== 'boolean') {
    fail('TARGET_MUTATION_FLAG_INVALID', 'mutatesWorkspace must be boolean');
  }
  if (target.role === 'evidence' && target.mutatesWorkspace) {
    fail('EVIDENCE_TARGET_MUTATION_FORBIDDEN', 'evidence targets cannot mutate');
  }
}

function assertBasis(basis) {
  assertPlainObject(basis, 'ROUTE_BASIS_INVALID', 'basis');
  if (!['signal', 'bounded-default', 'degraded-fallback'].includes(basis.kind)) {
    fail('ROUTE_BASIS_INVALID', 'basis kind is outside the closed vocabulary');
  }
  const fields = basis.kind === 'degraded-fallback'
    ? ['kind', 'unavailableEvidence']
    : ['kind'];
  assertExactKeys(basis, fields, 'ROUTE_BASIS_FIELDS_INVALID', 'basis');
  assertRequiredKeys(basis, fields, 'ROUTE_BASIS_FIELDS_INVALID', 'basis');
  if (basis.kind === 'degraded-fallback'
    && (!Array.isArray(basis.unavailableEvidence) || basis.unavailableEvidence.length === 0)) {
    fail('ROUTE_BASIS_INVALID', 'degraded fallback must name unavailable evidence');
  }
}

/**
 * Validate a public route through the frozen decision oracle.
 *
 * @param {Object} decision - Frozen public route decision.
 * @returns {Object} Frozen validated copy.
 */
function validateRouteDecision(decision) {
  let parsed;
  try {
    parsed = parseRouteDecisionShape(decision);
  } catch (error) {
    fail(error.code || 'ROUTE_DECISION_INVALID', error.message);
  }
  if (parsed.action !== 'route') {
    fail('DECISION_ACTION_INVALID', 'calibration evidence can accompany only a route');
  }
  return parsed;
}

function validateCalibrationEnvelope(envelope) {
  assertPlainObject(envelope, 'CALIBRATION_ENVELOPE_INVALID', 'calibration envelope');
  const fields = ['schemaVersion', 'decision', 'calibration'];
  assertExactKeys(envelope, fields, 'CALIBRATION_ENVELOPE_FIELDS_INVALID', 'calibration envelope');
  assertRequiredKeys(envelope, fields, 'CALIBRATION_ENVELOPE_FIELDS_INVALID', 'calibration envelope');
  if (envelope.schemaVersion !== 'CalibrationEvidenceEnvelopeV1') {
    fail('CALIBRATION_ENVELOPE_VERSION_INVALID', 'calibration envelope version is invalid');
  }
  const decision = validateRouteDecision(envelope.decision);
  assertCalibration(envelope.calibration);
  return deepFreeze({
    schemaVersion: envelope.schemaVersion,
    decision,
    calibration: cloneValue(envelope.calibration),
  });
}

function validateRequest(request) {
  assertPlainObject(request, 'REQUEST_INVALID', 'request');
  assertNonEmptyString(request.requestId, 'REQUEST_INVALID', 'requestId');
  assertNonEmptyString(request.hubId, 'REQUEST_INVALID', 'hubId');
  assertPlainObject(
    request.pinnedActivationGeneration,
    'REQUEST_POLICY_IDENTITY_INVALID',
    'pinnedActivationGeneration'
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
  assertPlainObject(
    request.calibrationProfile,
    'REQUEST_CALIBRATION_PROFILE_INVALID',
    'calibrationProfile'
  );
  if (!Number.isInteger(request.calibrationProfile.candidateCount)
    || request.calibrationProfile.candidateCount < 1
    || typeof request.calibrationProfile.noCalibrationSlice !== 'boolean') {
    fail('REQUEST_CALIBRATION_PROFILE_INVALID', 'calibration profile is malformed');
  }
  if (request.calibrationProfile.noCalibrationSlice
    !== (request.calibrationProfile.candidateCount === 1)) {
    fail(
      'REQUEST_CALIBRATION_PROFILE_INVALID',
      'noCalibrationSlice must be derived from candidate cardinality'
    );
  }
  if (!Array.isArray(request.rankedTargetIds) || request.rankedTargetIds.length === 0) {
    fail('REQUEST_RANKED_TARGETS_INVALID', 'rankedTargetIds must be non-empty');
  }
  request.rankedTargetIds.forEach(assertDestinationId);
  if (request.clarification?.oneAnswerDiscriminatesToLegalLocalRoute === true) {
    assertNonEmptyString(
      request.clarification.question,
      'REQUEST_CLARIFICATION_INVALID',
      'clarification.question'
    );
    assertNonEmptyString(
      request.clarification.budgetRef,
      'REQUEST_CLARIFICATION_INVALID',
      'clarification.budgetRef'
    );
    if (!Array.isArray(request.clarification.alternatives)
      || request.clarification.alternatives.length < 2
      || request.clarification.alternatives.length > 4) {
      fail(
        'REQUEST_CLARIFICATION_INVALID',
        'clarification requires two to four alternatives'
      );
    }
    request.clarification.alternatives.forEach((alternative) => {
      assertNonEmptyString(
        alternative,
        'REQUEST_CLARIFICATION_INVALID',
        'clarification alternative'
      );
    });
  }
}

function assertCandidateSet(request, decision) {
  const selectedIds = decision.route.targets.map((target) => target.destinationId);
  if (selectedIds.length > request.rankedTargetIds.length
    || selectedIds.some(
      (id) => !request.rankedTargetIds.some((ranked) => sameCanonical(id, ranked))
    )) {
    fail('CANDIDATE_SET_WIDENED', 'certificate evidence cannot widen ranked targets');
  }
  if (!sameCanonical(selectedIds, request.rankedTargetIds)) {
    fail('CANDIDATE_SET_CHANGED', 'certificate evidence cannot alter ranked target order');
  }
}

function rankOnlyEvidence(evidence) {
  return cloneValue(evidence);
}

function makeFallbackDecision(request) {
  const clarification = request.clarification;
  if (clarification?.oneAnswerDiscriminatesToLegalLocalRoute === true) {
    return {
      schemaVersion: 'V1',
      action: 'clarify',
      clarify: {
        question: clarification.question,
        budgetRef: clarification.budgetRef,
        alternatives: cloneValue(clarification.alternatives),
        authority: 'Withheld',
      },
    };
  }
  return {
    schemaVersion: 'V1',
    action: 'defer',
    defer: {
      reason: 'evidence-unavailable',
      recovery: ['defer'],
      authority: 'Withheld',
    },
  };
}

function probabilityHit(value, pathName = '$') {
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const hit = probabilityHit(value[index], `${pathName}[${index}]`);
      if (hit) return hit;
    }
    return null;
  }
  if (isPlainObject(value)) {
    const protectedKeys = new Set(
      METHOD_ENVELOPE.probabilityLanguage.keys.map(
        (key) => key.toLowerCase().replace(/[^a-z0-9]/g, '')
      )
    );
    for (const [key, item] of Object.entries(value)) {
      const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (protectedKeys.has(normalizedKey)) {
        return `${pathName}.${key}`;
      }
      const hit = probabilityHit(item, `${pathName}.${key}`);
      if (hit) return hit;
    }
    return null;
  }
  if (typeof value !== 'string') return null;
  const normalized = value.toLowerCase();
  if (value.includes('%')) return pathName;
  const term = METHOD_ENVELOPE.probabilityLanguage.terms.find(
    (candidate) => new RegExp(`\\b${candidate}\\b`, 'u').test(normalized)
  );
  return term ? pathName : null;
}

/**
 * Reject probability fields or wording when no external certificate licensed them.
 *
 * @param {Array<*>} artifacts - Decision and projection artifacts.
 * @param {boolean} isLicensed - External legality result.
 * @returns {true} True when language is admissible.
 */
function assertProbabilityLegality(artifacts, isLicensed) {
  if (isLicensed) return true;
  for (const artifact of artifacts) {
    const hit = probabilityHit(artifact);
    if (hit) {
      fail(
        'PROBABILITY_LANGUAGE_FORBIDDEN',
        `probability language is not licensed at ${hit}`
      );
    }
  }
  return true;
}

function fallbackResult(request, route, reason) {
  const decision = makeFallbackDecision(request);
  const result = {
    decision,
    calibration: { status: 'unvalidated' },
    evaluatedEvidence: rankOnlyEvidence(route.route.evidence),
    calibratedAutoRouteAvailable: false,
    certificateNoOp: false,
    legalityReason: reason,
  };
  assertProbabilityLegality([decision], false);
  return deepFreeze(result);
}

function certificateCorpusLegalityReason(certificate, corpusResolver) {
  const corpus = typeof corpusResolver === 'function'
    ? corpusResolver(certificate.corpusId)
    : null;
  if (!corpus) return 'CERTIFICATE_CORPUS_UNRESOLVED';

  let computedCorpusHash;
  try {
    computedCorpusHash = computeCorpusHash(corpus);
  } catch {
    return 'CERTIFICATE_CORPUS_HASH_MISMATCH';
  }
  if (computedCorpusHash !== corpus.corpusId
    || computedCorpusHash !== corpus.corpusHash) {
    return 'CERTIFICATE_CORPUS_HASH_MISMATCH';
  }
  if (corpus.corpusId !== certificate.corpusId
    || corpus.corpusHash !== certificate.corpusHash
    || corpus.effectivePolicyHash !== certificate.policyHash
    || corpus.generation !== certificate.generation
    || !Array.isArray(corpus.records)
    || !corpus.records.some(
      (record) => record?.riskSlice?.id === certificate.riskSlice
    )) {
    return 'CERTIFICATE_CORPUS_UNRESOLVED';
  }
  return null;
}

function certificateExternalLegalityReason(certificate, request, corpusResolver) {
  if (certificate.status !== 'validated') {
    return 'CERTIFICATE_STATUS_NOT_VALIDATED';
  }
  if (certificate.policyHash
    !== request.pinnedActivationGeneration.effectivePolicyHash) {
    return 'CERTIFICATE_POLICY_MISMATCH';
  }
  if (certificate.riskSlice !== request.riskSlice) {
    return 'CERTIFICATE_RISK_SLICE_MISMATCH';
  }
  if (certificate.generation !== request.pinnedActivationGeneration.generation) {
    return 'CERTIFICATE_GENERATION_MISMATCH';
  }
  return certificateCorpusLegalityReason(certificate, corpusResolver);
}

/**
 * Resolve calibrated legality against request, registry, and corpus authorities.
 *
 * @param {Object} args - Evaluation inputs.
 * @param {Object} args.request - Immutable request-pinned identities and ranked set.
 * @param {Object} args.routeEnvelope - Route plus out-of-band calibration evidence.
 * @param {Object} args.registry - External certificate registry.
 * @param {Function} args.corpusResolver - Trusted corpus identity resolver.
 * @returns {Object} Licensed route or safe clarify/defer result.
 */
function evaluateCalibratedRoute({ request, routeEnvelope, registry, corpusResolver }) {
  validateRequest(request);
  const envelope = validateCalibrationEnvelope(routeEnvelope);
  const route = envelope.decision;
  assertCandidateSet(request, route);

  if (request.calibrationProfile.noCalibrationSlice) {
    const decision = cloneValue(route);
    assertProbabilityLegality([decision], false);
    return deepFreeze({
      decision,
      calibration: { status: 'unvalidated' },
      evaluatedEvidence: decision.route.evidence,
      calibratedAutoRouteAvailable: false,
      certificateNoOp: true,
      legalityReason: 'NO_CALIBRATION_SLICE',
      rankCalls: 0,
    });
  }

  const claim = envelope.calibration;
  if (claim.status !== 'validated') {
    return fallbackResult(request, route, 'CERTIFICATE_NOT_RESOLVED');
  }
  if (!registry || typeof registry.get !== 'function') {
    return fallbackResult(request, route, 'CERTIFICATE_REGISTRY_UNAVAILABLE');
  }
  const certificate = registry.get(claim.certificateId);
  if (!certificate) return fallbackResult(request, route, 'CERTIFICATE_NOT_RESOLVED');
  if (registry.activeCertificateId !== certificate.certificateId) {
    return fallbackResult(request, route, 'CERTIFICATE_NOT_ACTIVE');
  }

  let parsedCertificate;
  try {
    parsedCertificate = validateCertificate(certificate);
  } catch (error) {
    return fallbackResult(
      request,
      route,
      error instanceof CalibrationContractError ? error.code : 'CERTIFICATE_INVALID'
    );
  }
  if (parsedCertificate.status !== 'validated') {
    return fallbackResult(request, route, 'CERTIFICATE_STATUS_NOT_VALIDATED');
  }
  if (parsedCertificate.policyHash
    !== request.pinnedActivationGeneration.effectivePolicyHash) {
    return fallbackResult(request, route, 'CERTIFICATE_POLICY_MISMATCH');
  }
  if (parsedCertificate.riskSlice !== request.riskSlice) {
    return fallbackResult(request, route, 'CERTIFICATE_RISK_SLICE_MISMATCH');
  }
  if (parsedCertificate.generation !== request.pinnedActivationGeneration.generation) {
    return fallbackResult(request, route, 'CERTIFICATE_GENERATION_MISMATCH');
  }
  const claimBindingsMatch = claim.certificateId === parsedCertificate.certificateId
    && claim.corpusId === parsedCertificate.corpusId
    && claim.method === parsedCertificate.method
    && claim.policyHash === parsedCertificate.policyHash
    && claim.riskSlice === parsedCertificate.riskSlice
    && sameCanonical(claim.evaluationWindow, parsedCertificate.evaluationWindow);
  if (!claimBindingsMatch) {
    return fallbackResult(request, route, 'CALIBRATION_CLAIM_BINDING_MISMATCH');
  }
  const corpusLegalityReason = certificateCorpusLegalityReason(
    parsedCertificate,
    corpusResolver
  );
  if (corpusLegalityReason) {
    return fallbackResult(request, route, corpusLegalityReason);
  }
  const decision = cloneValue(route);
  assertProbabilityLegality([decision], true);
  return deepFreeze({
    decision,
    calibration: cloneValue(claim),
    evaluatedEvidence: decision.route.evidence,
    calibratedAutoRouteAvailable: true,
    certificateNoOp: false,
    legalityReason: 'VALIDATED_CERTIFICATE_BOUND',
  });
}

/**
 * Attach a validated certificate claim to otherwise unchanged ranking evidence.
 *
 * @param {Object} routeDecision - Rank-only route.
 * @param {Object} certificate - External validated certificate.
 * @param {number} estimatedError - Licensed estimate in [0,1].
 * @param {Object} context - Request-pinned identity and trusted corpus resolver.
 * @returns {Object} Calibration evidence envelope with an unchanged public decision.
 */
function attachCalibration(routeDecision, certificate, estimatedError, context) {
  assertPlainObject(context, 'CALIBRATION_CONTEXT_INVALID', 'calibration context');
  validateRequest(context.request);
  const route = validateRouteDecision(routeDecision);
  assertCandidateSet(context.request, route);
  const parsedCertificate = validateCertificate(certificate);
  const legalityReason = certificateExternalLegalityReason(
    parsedCertificate,
    context.request,
    context.corpusResolver
  );
  if (legalityReason) {
    fail(legalityReason, 'certificate cannot license calibrated route evidence');
  }
  const calibration = {
    status: 'validated',
    certificateId: parsedCertificate.certificateId,
    corpusId: parsedCertificate.corpusId,
    method: parsedCertificate.method,
    policyHash: parsedCertificate.policyHash,
    riskSlice: parsedCertificate.riskSlice,
    evaluationWindow: cloneValue(parsedCertificate.evaluationWindow),
    estimatedError,
  };
  return validateCalibrationEnvelope({
    schemaVersion: 'CalibrationEvidenceEnvelopeV1',
    decision: route,
    calibration,
  });
}

module.exports = {
  CalibrationContractError,
  METHOD_ENVELOPE,
  assertProbabilityLegality,
  attachCalibration,
  computeCertHash,
  computeCertificateId,
  evaluateCalibratedRoute,
  sealCertificate,
  transitionCertificate,
  validateCalibrationEnvelope,
  validateCertificate,
  validateRouteDecision,
};
