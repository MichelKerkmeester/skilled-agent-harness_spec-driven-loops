// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: OFFLINE CORRECTION OVERLAY                                     ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Compile, replay, promote, and roll back immutable vocab maps.   ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const path = require('node:path');

const IMPLEMENTATION_ROOT = path.resolve(__dirname, '..', '..');
const {
  DOMAIN_TAGS,
  canonicalize,
  computeBasePolicyHash,
  computeEffectivePolicyHash,
  computeOverlayHash,
  computeRequestFactsHash,
  hashArtifact,
} = require(path.join(
  IMPLEMENTATION_ROOT,
  '000-contract-schemas/lib/canonical.cjs'
));
const OVERLAY_SCHEMA = require(path.join(
  IMPLEMENTATION_ROOT,
  '000-contract-schemas/schemas/correction-overlay.v1.schema.json'
));
const { destinationKey } = require(path.join(
  IMPLEMENTATION_ROOT,
  '002-decision-evaluator/lib/decision-contract.cjs'
));
const { evaluate } = require(path.join(
  IMPLEMENTATION_ROOT,
  '002-decision-evaluator/lib/evaluator.cjs'
));
const { projectToRouteGold } = require(path.join(
  IMPLEMENTATION_ROOT,
  '002-decision-evaluator/lib/projector.cjs'
));
const { scoreRouteGoldReadOnly, scorerScenario } = require(path.join(
  IMPLEMENTATION_ROOT,
  '002-decision-evaluator/replay-driver.cjs'
));
const {
  fencedSwapInMemory,
  manifestBytes,
  pinManifest,
} = require(path.join(
  IMPLEMENTATION_ROOT,
  '001-compiler-n1-shadow/activation/fenced-manifest.cjs'
));

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const INERT_WEIGHT = 4;
const SANITIZED_RECORD = Symbol('sanitized-record');
const SANITIZED_RETENTION_POLICY = Symbol('sanitized-retention-policy');
const OVERLAY_FIELDS = Object.freeze(Object.keys(OVERLAY_SCHEMA.properties));
const ADJUSTMENT_FIELDS = Object.freeze(
  Object.keys(OVERLAY_SCHEMA.$defs.adjustment.properties)
);
const DESTINATION_FIELDS = Object.freeze(
  Object.keys(OVERLAY_SCHEMA.$defs.destinationId.properties)
);
const DESTINATION_REQUIRED_FIELDS = Object.freeze(
  OVERLAY_SCHEMA.$defs.destinationId.required
);
const SENSITIVE_PATTERNS = Object.freeze([
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i,
  /\b(?:bearer|password|secret|api[_-]?key)\s*[:=]\s*\S+/i,
  /\bsk-[A-Za-z0-9_-]{12,}\b/,
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
]);

// ─────────────────────────────────────────────────────────────────────────────
// 3. ERRORS AND HELPERS
// ─────────────────────────────────────────────────────────────────────────────

class OverlayContractError extends TypeError {
  /**
   * Create a stable overlay contract failure.
   *
   * @param {string} code - Machine-readable failure code.
   * @param {string} message - Human-readable failure detail.
   */
  constructor(code, message) {
    super(message);
    this.name = 'OverlayContractError';
    this.code = code;
  }
}

function fail(code, message) {
  throw new OverlayContractError(code, message);
}

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function assertPlainObject(value, code, label) {
  if (!isPlainObject(value)) fail(code, `${label} must be a plain object`);
}

function assertExactKeys(value, allowed, code, label) {
  assertPlainObject(value, code, label);
  const expected = [...allowed].sort();
  const actual = Object.keys(value).sort();
  if (canonicalize(actual) !== canonicalize(expected)) {
    fail(code, `${label} has missing or unsupported fields`);
  }
}

function assertDigest(value, code, label) {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    fail(code, `${label} must be a lowercase SHA-256 digest`);
  }
}

function clone(value) {
  if (Array.isArray(value)) return value.map(clone);
  if (!isPlainObject(value)) return value;
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, clone(item)]));
}

function compareCodeUnits(left, right) {
  if (left < right) return -1;
  if (left > right) return 1;
  return 0;
}

function deepFreeze(value) {
  if (ArrayBuffer.isView(value)) return value;
  if (value && typeof value === 'object' && !Object.isFrozen(value)) {
    for (const item of Object.values(value)) deepFreeze(item);
    Object.freeze(value);
  }
  return value;
}

function normalizeVocabulary(value) {
  if (typeof value !== 'string') fail('VOCABULARY_INVALID', 'vocabulary must be text');
  const normalized = value.trim().toLowerCase().replace(/\s+/g, ' ');
  if (normalized.length === 0 || normalized.length > 120) {
    fail('VOCABULARY_INVALID', 'vocabulary must contain 1 to 120 normalized characters');
  }
  return normalized;
}

function destinationIndex(policy) {
  return new Map(policy.destinations.map((destination) => [
    destinationKey(destination.id),
    destination,
  ]));
}

function validateBasePolicy(policy) {
  assertPlainObject(policy, 'BASE_POLICY_INVALID', 'base policy');
  if (!Array.isArray(policy.destinations) || policy.destinations.length === 0) {
    fail('BASE_POLICY_INVALID', 'base policy requires at least one destination');
  }
  if (computeBasePolicyHash(policy) !== policy.basePolicyHash) {
    fail('BASE_POLICY_HASH_MISMATCH', 'base policy bytes do not match basePolicyHash');
  }
  if (computeEffectivePolicyHash(policy) !== policy.effectivePolicyHash) {
    fail('BASE_EFFECTIVE_HASH_MISMATCH', 'base effective tuple does not reproduce');
  }
  return policy;
}

/**
 * Remove an existing overlay pointer while preserving the compiled base bytes.
 *
 * @param {Object} policy - Content-valid compiled policy fixture.
 * @returns {Object} Frozen base-only policy with a reproduced effective hash.
 */
function makeBaseOnlyPolicy(policy) {
  const base = clone(policy);
  delete base.overlayHash;
  delete base.effectivePolicyHash;
  base.effectivePolicyHash = computeEffectivePolicyHash(base);
  return deepFreeze(base);
}

function assertDestinationId(value, label) {
  assertPlainObject(value, 'DESTINATION_ID_INVALID', label);
  const unsupported = Object.keys(value).filter((field) => !DESTINATION_FIELDS.includes(field));
  const missing = DESTINATION_REQUIRED_FIELDS.filter((field) => !Object.hasOwn(value, field));
  if (unsupported.length > 0 || missing.length > 0) {
    fail('DESTINATION_ID_INVALID', `${label} has missing or unsupported fields`);
  }
  for (const field of DESTINATION_FIELDS) {
    if (field === 'runtimeDiscriminator' && value[field] === undefined) continue;
    if (typeof value[field] !== 'string' || value[field].trim() === '') {
      fail('DESTINATION_ID_INVALID', `${label}.${field} must be non-empty text`);
    }
  }
}

function containsSensitiveContent(record) {
  const content = canonicalize(record);
  return SENSITIVE_PATTERNS.some((pattern) => pattern.test(content));
}

function brandSanitized(record, retentionPolicy) {
  Object.defineProperty(record, SANITIZED_RECORD, {
    enumerable: false,
    value: true,
  });
  Object.defineProperty(record, SANITIZED_RETENTION_POLICY, {
    enumerable: false,
    value: canonicalize(retentionPolicy),
  });
  return deepFreeze(record);
}

function validateAdjustment(adjustment, policyIndex) {
  assertExactKeys(
    adjustment,
    ADJUSTMENT_FIELDS,
    'OVERLAY_FIELD_FORBIDDEN',
    'overlay adjustment'
  );
  if (!Array.isArray(adjustment.vocabulary) || adjustment.vocabulary.length === 0) {
    fail('OVERLAY_VOCABULARY_INVALID', 'adjustment vocabulary must be non-empty');
  }
  const normalized = adjustment.vocabulary.map(normalizeVocabulary);
  if (new Set(normalized).size !== normalized.length) {
    fail('OVERLAY_VOCABULARY_DUPLICATE', 'adjustment vocabulary must be unique');
  }
  assertDestinationId(adjustment.destinationId, 'overlay destination');
  if (!policyIndex.has(destinationKey(adjustment.destinationId))) {
    fail('CANDIDATE_SET_WIDENED', 'overlay destination is absent from the compiled policy');
  }
}

/**
 * Validate candidate shape, identity, and destination-set closure.
 *
 * @param {Object} candidate - Candidate vocabulary assignment table.
 * @param {Object} basePolicy - Content-valid base-only policy.
 * @returns {Object} The validated candidate.
 */
function validateCandidate(candidate, basePolicy) {
  assertExactKeys(
    candidate,
    ['schemaVersion', 'basePolicyHash', 'adjustments', 'candidateId'],
    'CANDIDATE_FIELDS_INVALID',
    'candidate overlay'
  );
  if (candidate.schemaVersion !== 'V1') {
    fail('CANDIDATE_SCHEMA_INVALID', 'candidate overlay must use schema version V1');
  }
  if (candidate.basePolicyHash !== basePolicy.basePolicyHash) {
    fail('CANDIDATE_BASE_HASH_MISMATCH', 'candidate is bound to a different base policy');
  }
  assertDigest(candidate.candidateId, 'CANDIDATE_ID_INVALID', 'candidateId');
  if (!Array.isArray(candidate.adjustments)) {
    fail('CANDIDATE_ADJUSTMENTS_INVALID', 'candidate adjustments must be an array');
  }
  const policyIndex = destinationIndex(basePolicy);
  candidate.adjustments.forEach((adjustment) => validateAdjustment(adjustment, policyIndex));
  const body = {
    schemaVersion: candidate.schemaVersion,
    basePolicyHash: candidate.basePolicyHash,
    adjustments: candidate.adjustments,
  };
  const expected = hashArtifact(DOMAIN_TAGS.CorrectionOverlayV1, body);
  if (expected !== candidate.candidateId) {
    fail('CANDIDATE_ID_MISMATCH', 'candidate content identity does not reproduce');
  }
  return candidate;
}

/**
 * Validate the frozen promoted artifact against the external schema shape.
 *
 * @param {Object} overlay - Promoted correction overlay.
 * @param {Object} basePolicy - Content-valid base-only policy.
 * @returns {Object} The validated overlay.
 */
function validateOverlay(overlay, basePolicy) {
  assertExactKeys(overlay, OVERLAY_FIELDS, 'OVERLAY_FIELDS_INVALID', 'correction overlay');
  if (overlay.schemaVersion !== 'V1') {
    fail('OVERLAY_SCHEMA_INVALID', 'correction overlay must use schema version V1');
  }
  if (overlay.basePolicyHash !== basePolicy.basePolicyHash) {
    fail('OVERLAY_BASE_HASH_MISMATCH', 'overlay is bound to a different base policy');
  }
  if (!Array.isArray(overlay.adjustments)) {
    fail('OVERLAY_ADJUSTMENTS_INVALID', 'overlay adjustments must be an array');
  }
  const policyIndex = destinationIndex(basePolicy);
  overlay.adjustments.forEach((adjustment) => validateAdjustment(adjustment, policyIndex));
  assertExactKeys(
    overlay.promotionProvenance,
    ['candidateId', 'approvedBy', 'replayHash'],
    'PROMOTION_PROVENANCE_INVALID',
    'promotion provenance'
  );
  assertDigest(overlay.promotionProvenance.candidateId, 'CANDIDATE_ID_INVALID', 'candidateId');
  assertDigest(overlay.promotionProvenance.replayHash, 'REPLAY_HASH_INVALID', 'replayHash');
  if (typeof overlay.promotionProvenance.approvedBy !== 'string'
    || overlay.promotionProvenance.approvedBy.trim() === '') {
    fail('APPROVAL_INVALID', 'approvedBy must be non-empty text');
  }
  if (computeOverlayHash(overlay) !== overlay.overlayHash) {
    fail('OVERLAY_HASH_MISMATCH', 'overlay content identity does not reproduce');
  }
  return overlay;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. OFFLINE INGESTION AND COMPILATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Filter raw correction traffic before any record can reach compilation.
 *
 * @param {Array<Object>} rawRecords - Offline receipt and handoff records.
 * @param {Object} retention - Epoch retention and partition policy.
 * @returns {{sanitizedRecords:Array<Object>,excluded:Array<Object>,policy:Object}}
 *   Filtered immutable records and exclusion evidence.
 */
function ingestCorrectionRecords(rawRecords, retention) {
  if (!Array.isArray(rawRecords)) fail('CORPUS_INVALID', 'raw records must be an array');
  assertExactKeys(
    retention,
    ['currentEpoch', 'maxAgeEpochs', 'partition'],
    'RETENTION_POLICY_INVALID',
    'retention policy'
  );
  if (!Number.isSafeInteger(retention.currentEpoch) || retention.currentEpoch < 0
    || !Number.isSafeInteger(retention.maxAgeEpochs) || retention.maxAgeEpochs < 1
    || typeof retention.partition !== 'string' || retention.partition.trim() === '') {
    fail('RETENTION_POLICY_INVALID', 'retention policy has invalid epoch or partition values');
  }

  const sanitizedRecords = [];
  const excluded = [];
  for (const raw of rawRecords) {
    if (!isPlainObject(raw) || typeof raw.recordId !== 'string') {
      excluded.push({ recordId: null, reason: 'invalid-record' });
      continue;
    }
    if (containsSensitiveContent(raw)) {
      excluded.push({ recordId: raw.recordId, reason: 'privacy-filter' });
      continue;
    }
    if (!Number.isSafeInteger(raw.capturedAtEpoch)
      || raw.capturedAtEpoch > retention.currentEpoch
      || retention.currentEpoch - raw.capturedAtEpoch > retention.maxAgeEpochs) {
      excluded.push({ recordId: raw.recordId, reason: 'retention-policy' });
      continue;
    }
    if (!['receipt', 'handoff'].includes(raw.kind)
      || !['corrected', 'accepted'].includes(raw.outcome)
      || !Array.isArray(raw.vocabulary)
      || raw.vocabulary.length === 0) {
      excluded.push({ recordId: raw.recordId, reason: 'non-training-record' });
      continue;
    }
    try {
      assertDestinationId(raw.correctedDestinationId, 'corrected destination');
      sanitizedRecords.push(brandSanitized({
        schemaVersion: 'V1',
        recordId: raw.recordId,
        kind: raw.kind,
        capturedAtEpoch: raw.capturedAtEpoch,
        partition: retention.partition,
        vocabulary: [...new Set(raw.vocabulary.map(normalizeVocabulary))].sort(),
        correctedDestinationId: clone(raw.correctedDestinationId),
      }, retention));
    } catch (error) {
      excluded.push({ recordId: raw.recordId, reason: error.code || 'invalid-record' });
    }
  }
  return deepFreeze({
    sanitizedRecords,
    excluded,
    policy: clone(retention),
  });
}

/**
 * Compile sanitized records into a deterministic vocabulary assignment table.
 *
 * @param {Array<Object>} sanitizedRecords - Branded records from ingestion.
 * @param {Object} basePolicy - Content-valid compiled policy.
 * @returns {{status:string,overlay:Object|null,reason:string|null}}
 *   Immutable candidate, or the cardinality-one inert result.
 */
function compileCandidateOverlay(sanitizedRecords, basePolicy) {
  validateBasePolicy(basePolicy);
  if (!Array.isArray(sanitizedRecords)) {
    fail('SANITIZED_CORPUS_REQUIRED', 'compiler input must be a sanitized record array');
  }
  if (basePolicy.destinations.length === 1) {
    return deepFreeze({ status: 'inert', overlay: null, reason: 'single-destination' });
  }
  if (sanitizedRecords.length === 0
    || sanitizedRecords.some((record) => record[SANITIZED_RECORD] !== true)) {
    fail('SANITIZED_CORPUS_REQUIRED', 'every compiler input must pass ingestion first');
  }
  const partitions = new Set(sanitizedRecords.map((record) => record.partition));
  if (partitions.size !== 1) {
    fail('MIXED_CORPUS_PARTITION', 'compiler input must come from one corpus partition');
  }
  const retentionPolicies = new Set(
    sanitizedRecords.map((record) => record[SANITIZED_RETENTION_POLICY])
  );
  if (retentionPolicies.size !== 1 || retentionPolicies.has(undefined)) {
    fail(
      'MIXED_RETENTION_POLICY',
      'compiler input must come from one retention-policy identity'
    );
  }

  const policyIndex = destinationIndex(basePolicy);
  const votes = new Map();
  for (const record of sanitizedRecords) {
    const key = destinationKey(record.correctedDestinationId);
    if (!policyIndex.has(key)) {
      fail('CANDIDATE_SET_WIDENED', 'training record names an undeclared destination');
    }
    for (const vocabulary of record.vocabulary) {
      if (!votes.has(vocabulary)) votes.set(vocabulary, new Map());
      const destinations = votes.get(vocabulary);
      destinations.set(key, (destinations.get(key) || 0) + 1);
    }
  }

  const vocabularyByDestination = new Map();
  for (const [vocabulary, destinations] of [...votes].sort()) {
    const ranked = [...destinations].sort((left, right) => (
      right[1] - left[1] || compareCodeUnits(left[0], right[0])
    ));
    if (ranked.length > 1 && ranked[0][1] === ranked[1][1]) {
      fail('AMBIGUOUS_TRAINING_SIGNAL', `vocabulary has a tied destination: ${vocabulary}`);
    }
    const selectedKey = ranked[0][0];
    if (!vocabularyByDestination.has(selectedKey)) vocabularyByDestination.set(selectedKey, []);
    vocabularyByDestination.get(selectedKey).push(vocabulary);
  }

  const adjustments = [...vocabularyByDestination]
    .sort(([left], [right]) => compareCodeUnits(left, right))
    .map(([key, vocabulary]) => ({
      vocabulary: vocabulary.sort(),
      destinationId: clone(policyIndex.get(key).id),
    }));
  const body = {
    schemaVersion: 'V1',
    basePolicyHash: basePolicy.basePolicyHash,
    adjustments,
  };
  const overlay = deepFreeze({
    ...body,
    candidateId: hashArtifact(DOMAIN_TAGS.CorrectionOverlayV1, body),
  });
  validateCandidate(overlay, basePolicy);
  return deepFreeze({ status: 'candidate', overlay, reason: null });
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. REPLAY AND PROMOTION GATES
// ─────────────────────────────────────────────────────────────────────────────

function materializeEvaluatorPolicy(candidate, basePolicy) {
  validateBasePolicy(basePolicy);
  if (candidate === null) return basePolicy;
  validateCandidate(candidate, basePolicy);
  if (candidate.adjustments.length === 0) return basePolicy;

  const policy = clone(basePolicy);
  delete policy.overlayHash;
  delete policy.effectivePolicyHash;
  for (const [adjustmentIndex, adjustment] of candidate.adjustments.entries()) {
    for (const [vocabularyIndex, vocabulary] of adjustment.vocabulary.entries()) {
      const suffix = `${candidate.candidateId}:${adjustmentIndex}:${vocabularyIndex}`;
      const detectorId = `overlay-detector:${suffix}`;
      policy.detectors.push({ id: detectorId, kind: 'alias', value: vocabulary });
      policy.selectors.push({
        id: `overlay-selector:${suffix}`,
        destinationId: clone(adjustment.destinationId),
        detectorIds: [detectorId],
      });
    }
  }
  // Additive evaluator nodes are execution-only and cannot redefine the base artifact.
  policy.basePolicyHash = basePolicy.basePolicyHash;
  policy.overlayHash = candidate.candidateId;
  policy.effectivePolicyHash = computeEffectivePolicyHash(policy);
  return deepFreeze(policy);
}

function replayRequest(fixture, policy, supplementalObservations = []) {
  assertPlainObject(fixture, 'ROUTE_GOLD_FIXTURE_INVALID', 'route-gold fixture');
  if (Object.hasOwn(fixture, 'expectedIntents')
    || Object.hasOwn(fixture, 'expectedResources')) {
    fail('CALLER_GOLD_FORBIDDEN', 'route-gold fixtures cannot supply scorer gold');
  }
  if (typeof fixture.id !== 'string' || fixture.id.trim() === ''
    || typeof fixture.taskText !== 'string' || fixture.taskText.trim() === '') {
    fail('ROUTE_GOLD_FIXTURE_INVALID', 'route-gold fixture requires id and taskText');
  }
  const observationKind = fixture.observationKind || 'intent';
  if (!['intent', 'resource', 'command', 'constraint'].includes(observationKind)) {
    fail('ROUTE_GOLD_FIXTURE_INVALID', 'route-gold observationKind is invalid');
  }
  const request = {
    schemaVersion: 'V1',
    observations: [
      { kind: observationKind, value: fixture.taskText },
      ...supplementalObservations,
    ],
    evidence: [{
      id: 'compatibility:pinned-overlay-policy',
      kind: 'compatibility',
      value: canonicalize({
        activationGeneration: policy.activationGeneration,
        effectivePolicyHash: policy.effectivePolicyHash,
      }),
      provenance: {
        source: 'offline-overlay-replay',
        capturedAtEpoch: policy.activationGeneration,
      },
      trust: 'live',
    }],
    pinnedActivationGeneration: policy.activationGeneration,
  };
  request.requestFactsHash = computeRequestFactsHash(request);
  return deepFreeze(request);
}

function overlayObservations(fixture, evaluatorPolicy) {
  const normalizedTask = normalizeVocabulary(fixture.taskText);
  const matchedDetectorIds = new Set(evaluatorPolicy.detectors
    .filter((detector) => (
      detector.id.startsWith('overlay-detector:')
      && normalizedTask.includes(detector.value)
    ))
    .map((detector) => detector.id));
  const qualifiedModes = evaluatorPolicy.selectors
    .filter((selector) => (
      selector.id.startsWith('overlay-selector:')
      && selector.detectorIds.every((detectorId) => matchedDetectorIds.has(detectorId))
    ))
    .map((selector) => (
      `${selector.destinationId.skillId}/${selector.destinationId.workflowMode}`
    ));
  return [...new Set(qualifiedModes)]
    .sort(compareCodeUnits)
    .map((value) => ({ kind: 'intent', value }));
}

function projectReplayDecision(decision, fixture, policy) {
  return projectToRouteGold(decision, {
    policy,
    leafPairs: fixture.leafPairs || [],
    manifestResources: fixture.manifestResources || [],
  });
}

/**
 * Replay a candidate through the external closed algebra, projector, and scorer.
 *
 * @param {Object|null} candidate - Immutable candidate overlay or the base-only lane.
 * @param {Object} basePolicy - Content-valid base-only policy.
 * @param {Array<Object>} fixtures - Offline route-gold cases.
 * @returns {Object} Real scorer verdicts and deterministic replay identity.
 */
function runRouteGoldReplay(candidate, basePolicy, fixtures) {
  validateBasePolicy(basePolicy);
  if (candidate !== null) validateCandidate(candidate, basePolicy);
  if (!Array.isArray(fixtures) || fixtures.length === 0) {
    fail('ROUTE_GOLD_REQUIRED', 'route-gold fixtures must be non-empty');
  }
  const evaluatorPolicy = materializeEvaluatorPolicy(candidate, basePolicy);
  const rows = fixtures.map((fixture) => {
    const baselineRequest = replayRequest(fixture, basePolicy);
    const baselineDecision = evaluate(baselineRequest, basePolicy);
    const baselineProjection = projectReplayDecision(baselineDecision, fixture, basePolicy);
    const request = replayRequest(
      fixture,
      basePolicy,
      overlayObservations(fixture, evaluatorPolicy)
    );
    const decision = evaluate(request, basePolicy);
    const projection = projectReplayDecision(decision, fixture, basePolicy);
    return { fixture, baselineDecision, baselineProjection, decision, projection };
  });
  const scorer = scoreRouteGoldReadOnly(rows.map(({
    fixture,
    baselineDecision,
    baselineProjection,
    projection,
  }) => ({
    scenario: scorerScenario({
      id: fixture.id,
      intentGold: {
        expectedIntents: baselineProjection.observedIntents.length > 0
          ? baselineProjection.observedIntents
          : [baselineDecision.action],
        expectedResources: baselineProjection.observedResources,
      },
    }),
    observed: projection,
  })));
  const verdictRows = rows.map((row, index) => ({
    id: row.fixture.id,
    baselineDecision: row.baselineDecision,
    baselineProjection: row.baselineProjection,
    decision: row.decision,
    projection: row.projection,
    verdict: scorer.verdicts[index],
  }));
  const replayBody = {
    candidateId: candidate ? candidate.candidateId : null,
    evaluatorBasePolicyHash: evaluatorPolicy.basePolicyHash,
    evaluatorPolicyHash: evaluatorPolicy.effectivePolicyHash,
    rows: verdictRows.map((row) => ({
      id: row.id,
      projection: row.projection,
      pass: row.verdict.pass,
    })),
  };
  return deepFreeze({
    allPass: verdictRows.every((row) => row.verdict.pass === true),
    replayHash: hashArtifact(DOMAIN_TAGS.TypedRouteGoldV1, replayBody),
    rows: verdictRows,
    writeBackAttempts: scorer.writeBackAttempts,
    protectedDigests: scorer.trustedProtectedDigests,
    evaluatorBasePolicyHash: evaluatorPolicy.basePolicyHash,
    evaluatorPolicyHash: evaluatorPolicy.effectivePolicyHash,
  });
}

function validatePromotionHardGates(verdicts) {
  assertExactKeys(
    verdicts,
    ['negativeTargetFree', 'evidenceNeverCommits', 'commitRequiresVerify'],
    'HARD_GATE_VERDICTS_REQUIRED',
    'promotion hard-gate verdicts'
  );
  const gates = [
    ['negativeTargetFree', 'NEGATIVE_TARGET_FORBIDDEN', 'NEGATIVE_TARGET_GATE_FAILED'],
    ['evidenceNeverCommits', 'ROLE_CANNOT_COMMIT', 'EVIDENCE_COMMIT_GATE_FAILED'],
    ['commitRequiresVerify', 'COMMIT_WITHOUT_READY', 'VERIFY_GATE_FAILED'],
  ];
  for (const [name, expectedCode, failureCode] of gates) {
    const verdict = verdicts[name];
    assertExactKeys(
      verdict,
      ['pass', 'code'],
      'HARD_GATE_VERDICTS_REQUIRED',
      `${name} verdict`
    );
    if (verdict.pass !== true || verdict.code !== expectedCode) {
      fail(failureCode, `${name} hard gate rejected promotion`);
    }
  }
}

function validateApproval(approval, candidate) {
  assertExactKeys(
    approval,
    ['candidateId', 'proposedBy', 'approvedBy', 'approvedAtEpoch'],
    'APPROVAL_INVALID',
    'approval record'
  );
  if (approval.candidateId !== candidate.candidateId) {
    fail('APPROVAL_CANDIDATE_MISMATCH', 'approval is bound to a different candidate');
  }
  if (typeof approval.proposedBy !== 'string' || approval.proposedBy.trim() === ''
    || typeof approval.approvedBy !== 'string' || approval.approvedBy.trim() === '') {
    fail('APPROVAL_INVALID', 'approval identities must be non-empty text');
  }
  if (approval.proposedBy === approval.approvedBy) {
    fail('INDEPENDENT_APPROVAL_REQUIRED', 'proposer and approver must be distinct');
  }
  if (!Number.isSafeInteger(approval.approvedAtEpoch) || approval.approvedAtEpoch < 0) {
    fail('APPROVAL_INVALID', 'approval epoch must be a non-negative integer');
  }
}

function telemetryCorpusHash(sanitizedRecords) {
  if (!Array.isArray(sanitizedRecords) || sanitizedRecords.length === 0
    || sanitizedRecords.some((record) => record[SANITIZED_RECORD] !== true)) {
    fail('SANITIZED_CORPUS_REQUIRED', 'telemetry evidence requires admitted corpus records');
  }
  return hashArtifact(DOMAIN_TAGS.TypedRouteGoldV1, {
    schemaVersion: 'V1',
    partition: sanitizedRecords[0].partition,
    records: sanitizedRecords.map((record) => clone(record)),
  });
}

function validateTelemetryGain(evidence, sanitizedRecords) {
  assertExactKeys(
    evidence,
    ['source', 'corpusHash', 'sampleSize', 'baselineCorrect', 'candidateCorrect'],
    'TELEMETRY_GAIN_REQUIRED',
    'telemetry evidence'
  );
  assertDigest(evidence.corpusHash, 'TELEMETRY_GAIN_REQUIRED', 'telemetry corpusHash');
  const observedCorpusHash = telemetryCorpusHash(sanitizedRecords);
  if (evidence.corpusHash !== observedCorpusHash) {
    fail('TELEMETRY_CORPUS_MISMATCH', 'telemetry evidence does not bind admitted corpus bytes');
  }
  if (evidence.source !== 'real-correction-telemetry'
    || !Number.isSafeInteger(evidence.sampleSize) || evidence.sampleSize < 1
    || !Number.isSafeInteger(evidence.baselineCorrect) || evidence.baselineCorrect < 0
    || !Number.isSafeInteger(evidence.candidateCorrect) || evidence.candidateCorrect < 0
    || evidence.baselineCorrect > evidence.sampleSize
    || evidence.candidateCorrect > evidence.sampleSize
    || evidence.sampleSize !== sanitizedRecords.length
    || evidence.candidateCorrect <= evidence.baselineCorrect) {
    fail('TELEMETRY_GAIN_REQUIRED', 'promotion requires a measured positive routing gain');
  }
}

function sealOverlay(candidate, basePolicy, approval, replay) {
  const body = {
    schemaVersion: 'V1',
    basePolicyHash: basePolicy.basePolicyHash,
    adjustments: clone(candidate.adjustments),
    promotionProvenance: {
      candidateId: candidate.candidateId,
      approvedBy: approval.approvedBy,
      replayHash: replay.replayHash,
    },
  };
  const overlay = deepFreeze({ ...body, overlayHash: computeOverlayHash(body) });
  return validateOverlay(overlay, basePolicy);
}

/**
 * Bind base, optional overlay, schema, and generation through canonical hashing.
 *
 * @param {Object} basePolicy - Content-valid base-only policy.
 * @param {Object|null} overlay - Frozen promoted overlay or null.
 * @param {number} generation - Activation generation.
 * @returns {Object} Frozen effective identity tuple.
 */
function effectiveTuple(basePolicy, overlay, generation) {
  validateBasePolicy(basePolicy);
  if (overlay !== null) validateOverlay(overlay, basePolicy);
  if (!Number.isSafeInteger(generation) || generation < 0) {
    fail('GENERATION_INVALID', 'activation generation must be non-negative');
  }
  const tuple = {
    schemaVersion: basePolicy.schemaVersion,
    activationGeneration: generation,
    basePolicyHash: basePolicy.basePolicyHash,
    overlayHash: overlay ? overlay.overlayHash : null,
  };
  return deepFreeze({ ...tuple, effectivePolicyHash: computeEffectivePolicyHash(tuple) });
}

function retainArtifact(basePolicy, overlay, tuple) {
  return deepFreeze({
    basePolicy: clone(basePolicy),
    overlay: overlay === null ? null : clone(overlay),
    tuple: clone(tuple),
  });
}

function validateRetainedArtifact(artifact, manifest) {
  assertExactKeys(
    artifact,
    ['basePolicy', 'overlay', 'tuple'],
    'RETAINED_ARTIFACT_REQUIRED',
    'retained activation artifact'
  );
  const reproduced = effectiveTuple(
    artifact.basePolicy,
    artifact.overlay,
    artifact.tuple.activationGeneration
  );
  if (canonicalize(reproduced) !== canonicalize(artifact.tuple)) {
    fail('RETAINED_ARTIFACT_IDENTITY_MISMATCH', 'retained artifact tuple does not reproduce');
  }
  const pin = pinManifest(manifest);
  if (pin.generation !== reproduced.activationGeneration
    || pin.effectivePolicyHash !== reproduced.effectivePolicyHash) {
    fail('RETAINED_ARTIFACT_IDENTITY_MISMATCH', 'manifest does not name retained artifact bytes');
  }
  return artifact;
}

function activationManifest(tuple) {
  return deepFreeze({
    schemaVersion: 'V1',
    selectedPolicy: {
      effectivePolicyHash: tuple.effectivePolicyHash,
      generation: tuple.activationGeneration,
    },
    servingAuthority: 'legacy',
    shadowOnly: true,
  });
}

/**
 * Create the dormant base-only activation state retained by the optional plane.
 *
 * @param {Object} basePolicy - Content-valid base-only policy.
 * @returns {Object} Fenced state, manifest, and byte-stable effective tuple.
 */
function createDormantActivation(basePolicy) {
  validateBasePolicy(basePolicy);
  const tuple = effectiveTuple(basePolicy, null, basePolicy.activationGeneration);
  const manifest = activationManifest(tuple);
  return deepFreeze({
    tuple,
    manifest,
    state: { fencingEpoch: 0, manifest },
    retainedArtifact: retainArtifact(basePolicy, null, tuple),
  });
}

/**
 * Reject a request that attempts to combine activation generations.
 *
 * @param {Array<Object>} pins - Request-scoped activation pins.
 * @returns {Object} The one immutable pin.
 */
function assertSingleGeneration(pins) {
  if (!Array.isArray(pins) || pins.length === 0) {
    fail('REQUEST_PIN_REQUIRED', 'request requires one activation pin');
  }
  const identities = new Set(pins.map((pin) => canonicalize({
    generation: pin.generation,
    effectivePolicyHash: pin.effectivePolicyHash,
  })));
  if (identities.size !== 1) {
    fail('MIXED_GENERATIONS', 'one request cannot observe mixed activation generations');
  }
  return deepFreeze(clone(pins[0]));
}

/**
 * Promote an admissible candidate through real replay and a fenced pointer CAS.
 *
 * @param {Object} input - Candidate, gates, activation preimage, and telemetry.
 * @returns {Object} Promoted immutable artifacts with retained prior bytes.
 */
function promoteCandidate(input) {
  const {
    candidate,
    basePolicy,
    routeGold,
    approval,
    telemetryEvidence,
    sanitizedRecords,
    activation,
    expectedFencingEpoch,
    expectedCurrent,
    aggregateScore,
    hardGateVerdicts,
  } = input;
  validateBasePolicy(basePolicy);
  validateCandidate(candidate, basePolicy);
  validatePromotionHardGates(hardGateVerdicts);
  validateApproval(approval, candidate);
  validateTelemetryGain(telemetryEvidence, sanitizedRecords);
  const replay = runRouteGoldReplay(candidate, basePolicy, routeGold);
  if (!replay.allPass) {
    fail('ROUTE_GOLD_GATE_FAILED', 'real route-gold replay rejected the candidate');
  }
  if (replay.writeBackAttempts.length > 0) {
    fail('SCORER_WRITE_ATTEMPT', 'route-gold scorer attempted a write');
  }
  const overlay = sealOverlay(candidate, basePolicy, approval, replay);
  const priorManifest = activation.state.manifest;
  const priorArtifact = validateRetainedArtifact(activation.retainedArtifact, priorManifest);
  if (canonicalize(priorArtifact.basePolicy) !== canonicalize(basePolicy)) {
    fail('RETAINED_ARTIFACT_IDENTITY_MISMATCH', 'promotion base differs from retained bytes');
  }
  const priorPin = pinManifest(priorManifest);
  assertSingleGeneration([priorPin]);
  if (priorPin.generation !== basePolicy.activationGeneration) {
    fail('MANIFEST_CAS_MISMATCH', 'expected prior generation differs from activation state');
  }
  const tuple = effectiveTuple(basePolicy, overlay, priorPin.generation + 1);
  if (computeEffectivePolicyHash(tuple) !== tuple.effectivePolicyHash) {
    fail('EFFECTIVE_IDENTITY_MISMATCH', 'effective tuple identity does not reproduce');
  }
  const nextManifest = activationManifest(tuple);
  const state = fencedSwapInMemory({
    state: activation.state,
    expectedFencingEpoch,
    expectedCurrent,
    nextManifest,
    token: 'overlay-promotion',
  });
  const activePin = assertSingleGeneration([pinManifest(state.manifest)]);
  const activeArtifact = retainArtifact(basePolicy, overlay, tuple);
  return deepFreeze({
    status: 'promoted-shadow',
    aggregateScore: aggregateScore ?? null,
    replay,
    overlay,
    tuple,
    state,
    activePin,
    activeArtifact,
    priorManifest,
    retainedPriorArtifact: priorArtifact,
    retainedPriorManifestBytes: manifestBytes(priorManifest),
  });
}

/**
 * Restore the retained manifest through a second fenced generation/hash CAS.
 *
 * @param {Object} promotion - Result returned by promoteCandidate.
 * @returns {Object} Rolled-back state and exact-byte restoration evidence.
 */
function rollbackPromotion(promotion) {
  const retainedPriorArtifact = validateRetainedArtifact(
    promotion.retainedPriorArtifact,
    promotion.priorManifest
  );
  const state = fencedSwapInMemory({
    state: promotion.state,
    expectedFencingEpoch: promotion.state.fencingEpoch,
    expectedCurrent: promotion.state.manifest.selectedPolicy,
    nextManifest: promotion.priorManifest,
    token: 'overlay-rollback',
  });
  const restoredBytes = manifestBytes(state.manifest);
  if (!restoredBytes.equals(promotion.retainedPriorManifestBytes)) {
    fail('ROLLBACK_BYTES_MISMATCH', 'rollback did not restore retained manifest bytes');
  }
  return deepFreeze({
    state,
    restoredArtifact: retainedPriorArtifact,
    restoredBytes,
    priorBytes: promotion.retainedPriorManifestBytes,
    byteExact: true,
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  INERT_WEIGHT,
  OverlayContractError,
  assertSingleGeneration,
  compileCandidateOverlay,
  createDormantActivation,
  effectiveTuple,
  ingestCorrectionRecords,
  makeBaseOnlyPolicy,
  materializeEvaluatorPolicy,
  promoteCandidate,
  rollbackPromotion,
  runRouteGoldReplay,
  validateCandidate,
  validateOverlay,
};
