// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ LIBRARY: CALIBRATION CORPUS CONTRACT                                    ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Validate sealed held-out routing evidence and identity.         ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

const crypto = require('crypto');

const {
  canonicalBytes,
  computeEffectivePolicyHash
} = require('../../../000-contract-schemas/lib/canonical.cjs');

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const ACTIONS = Object.freeze(['route', 'clarify', 'defer', 'reject']);
const POSITIVE_SELECTION_KINDS = Object.freeze([
  'single',
  'orderedBundle',
  'surfaceBundle'
]);
const ROLES = Object.freeze(['actor', 'evidence', 'transport', 'judgment']);
const SELECTION_FAMILIES = Object.freeze(['single', 'composite', 'none']);
const ROLE_RISK_PRIORITY = Object.freeze({
  actor: 4,
  judgment: 3,
  transport: 2,
  evidence: 1
});
const RISK_TOLERANCE_BPS = Object.freeze({
  actor: Object.freeze({ mutating: 250, nonmutating: 400 }),
  evidence: Object.freeze({ nonmutating: 800 }),
  judgment: Object.freeze({ mutating: 250, nonmutating: 400 }),
  transport: Object.freeze({ mutating: 400, nonmutating: 600 })
});
const FROZEN_HUB_TOPOLOGY = Object.freeze({
  'mcp-tooling': Object.freeze({
    actions: ACTIONS,
    positiveSelectionKinds: Object.freeze(['single', 'orderedBundle']),
    requiredCells: Object.freeze([
      Object.freeze({ riskSliceId: 'transport:nonmutating:single', branch: 'route' }),
      Object.freeze({ riskSliceId: 'actor:mutating:single', branch: 'route' }),
      Object.freeze({ riskSliceId: 'actor:mutating:composite', branch: 'route' }),
      Object.freeze({ riskSliceId: 'transport:nonmutating:none', branch: 'clarify' }),
      Object.freeze({ riskSliceId: 'actor:mutating:none', branch: 'defer' }),
      Object.freeze({ riskSliceId: 'transport:nonmutating:none', branch: 'reject' })
    ])
  }),
  'sk-code': Object.freeze({
    actions: ACTIONS,
    positiveSelectionKinds: Object.freeze(['single', 'surfaceBundle']),
    requiredCells: Object.freeze([
      Object.freeze({ riskSliceId: 'actor:mutating:single', branch: 'route' }),
      Object.freeze({ riskSliceId: 'actor:mutating:composite', branch: 'route' }),
      Object.freeze({ riskSliceId: 'actor:mutating:none', branch: 'clarify' }),
      Object.freeze({ riskSliceId: 'actor:mutating:none', branch: 'defer' }),
      Object.freeze({ riskSliceId: 'actor:mutating:none', branch: 'reject' })
    ])
  }),
  'system-deep-loop': Object.freeze({
    actions: ACTIONS,
    positiveSelectionKinds: Object.freeze(['single']),
    requiredCells: Object.freeze([
      Object.freeze({ riskSliceId: 'actor:mutating:single', branch: 'route' }),
      Object.freeze({ riskSliceId: 'actor:mutating:none', branch: 'clarify' }),
      Object.freeze({ riskSliceId: 'actor:mutating:none', branch: 'defer' }),
      Object.freeze({ riskSliceId: 'actor:mutating:none', branch: 'reject' })
    ])
  })
});
const DIGEST_PATTERN = /^[a-f0-9]{64}$/;
const BASIS_POINTS_SCALE = 10000;

// ─────────────────────────────────────────────────────────────────────────────
// 3. ERROR TYPE
// ─────────────────────────────────────────────────────────────────────────────

class CorpusValidationError extends Error {
  /**
   * Create a stable validation failure with a machine-checkable reason.
   *
   * @param {string} code - Stable rejection reason.
   * @param {string} message - Human-readable detail.
   */
  constructor(code, message) {
    super(`${code}: ${message}`);
    this.name = 'CorpusValidationError';
    this.code = code;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function fail(code, message) {
  throw new CorpusValidationError(code, message);
}

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function requirePlainObject(value, code, label) {
  if (!isPlainObject(value)) fail(code, `${label} must be an object`);
}

function requireNonEmptyString(value, code, label) {
  if (typeof value !== 'string' || value.trim() === '') {
    fail(code, `${label} must be a non-empty string`);
  }
}

function requireDigest(value, code, label) {
  if (typeof value !== 'string' || !DIGEST_PATTERN.test(value)) {
    fail(code, `${label} must be a lowercase SHA-256 digest`);
  }
}

function unique(values) {
  return [...new Set(values)];
}

function selectionFamily(selectionKind) {
  if (selectionKind === 'single') return 'single';
  if (selectionKind === 'orderedBundle' || selectionKind === 'surfaceBundle') {
    return 'composite';
  }
  return 'none';
}

/**
 * Build the canonical cell identifier from destination risk and composition.
 *
 * @param {Object} slice - Risk-slice fields.
 * @returns {string} Canonical risk-slice identifier.
 */
function riskSliceId(slice) {
  const mutation = slice.mutatesWorkspace ? 'mutating' : 'nonmutating';
  return `${slice.role}:${mutation}:${slice.selectionKindFamily}`;
}

function toleranceForDestination(destination) {
  const mutation = destination.mutatesWorkspace ? 'mutating' : 'nonmutating';
  const tolerance = RISK_TOLERANCE_BPS[destination.role]?.[mutation];
  if (!Number.isInteger(tolerance)) {
    fail(
      'RISK_DESTINATION_PROHIBITED',
      `${destination.role}:${mutation} is outside the risk taxonomy`
    );
  }
  return tolerance;
}

function compareDestinationRisk(left, right) {
  const toleranceDifference = toleranceForDestination(left) - toleranceForDestination(right);
  if (toleranceDifference !== 0) return toleranceDifference;
  if (left.mutatesWorkspace !== right.mutatesWorkspace) {
    return left.mutatesWorkspace ? -1 : 1;
  }
  const roleDifference = ROLE_RISK_PRIORITY[right.role] - ROLE_RISK_PRIORITY[left.role];
  if (roleDifference !== 0) return roleDifference;
  return Buffer.compare(canonicalBytes(left), canonicalBytes(right));
}

function strictestDestination(destinations) {
  return destinations.reduce((strictest, destination) => (
    compareDestinationRisk(destination, strictest) < 0
      ? destination
      : strictest
  ));
}

function parseRiskSliceId(sliceId) {
  requireNonEmptyString(sliceId, 'LIVE_RISK_SLICE_INVALID', 'riskSliceId');
  const parts = sliceId.split(':');
  if (
    parts.length !== 3 ||
    !ROLES.includes(parts[0]) ||
    !['mutating', 'nonmutating'].includes(parts[1]) ||
    !SELECTION_FAMILIES.includes(parts[2])
  ) {
    fail('LIVE_RISK_SLICE_INVALID', `${sliceId} is outside the fixed taxonomy`);
  }
  return {
    role: parts[0],
    mutatesWorkspace: parts[1] === 'mutating',
    selectionKindFamily: parts[2]
  };
}

function sha256Canonical(value) {
  return crypto.createHash('sha256').update(canonicalBytes(value)).digest('hex');
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. IDENTITY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Compute the immutable corpus digest from every admission-relevant corpus byte.
 *
 * @param {Object} corpus - Calibration corpus.
 * @returns {string} Lowercase SHA-256 digest.
 */
function computeCorpusHash(corpus) {
  const identityBody = Object.fromEntries(
    Object.entries(corpus).filter(([key]) => !['corpusHash', 'corpusId'].includes(key))
  );
  return crypto.createHash('sha256').update(canonicalBytes(identityBody)).digest('hex');
}

function validateEffectivePolicyBinding(corpus) {
  requirePlainObject(
    corpus.effectivePolicyIdentity,
    'EFFECTIVE_POLICY_IDENTITY_INVALID',
    'effectivePolicyIdentity'
  );
  requireDigest(
    corpus.effectivePolicyIdentity.basePolicyHash,
    'EFFECTIVE_POLICY_IDENTITY_INVALID',
    'effectivePolicyIdentity.basePolicyHash'
  );
  if (corpus.effectivePolicyIdentity.overlayHash !== undefined) {
    requireDigest(
      corpus.effectivePolicyIdentity.overlayHash,
      'EFFECTIVE_POLICY_IDENTITY_INVALID',
      'effectivePolicyIdentity.overlayHash'
    );
  }
  const computed = computeEffectivePolicyHash(corpus.effectivePolicyIdentity);
  if (computed !== corpus.effectivePolicyHash) {
    fail(
      'EFFECTIVE_POLICY_HASH_MISMATCH',
      `expected ${computed}, received ${corpus.effectivePolicyHash}`
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. RECORD VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function validateDestination(destination, label) {
  requirePlainObject(destination, 'DESTINATION_INVALID', label);
  requirePlainObject(destination.id, 'DESTINATION_INVALID', `${label}.id`);
  for (const field of ['skillId', 'workflowMode', 'packetId', 'packetKind', 'backendKind']) {
    requireNonEmptyString(destination.id[field], 'DESTINATION_INVALID', `${label}.id.${field}`);
  }
  if (!ROLES.includes(destination.role)) {
    fail('DESTINATION_INVALID', `${label}.role is not in the closed role algebra`);
  }
  if (typeof destination.mutatesWorkspace !== 'boolean') {
    fail('DESTINATION_INVALID', `${label}.mutatesWorkspace must be boolean`);
  }
  if (destination.role === 'evidence' && destination.mutatesWorkspace) {
    fail('EVIDENCE_MUTATION_FORBIDDEN', `${label} cannot mutate the workspace`);
  }
}

function validateIntentGold(record) {
  const gold = record.intentGold;
  requirePlainObject(gold, 'INTENT_GOLD_INVALID', `${record.recordId}.intentGold`);
  if (!ACTIONS.includes(gold.action)) {
    fail('INTENT_GOLD_INVALID', `${record.recordId} uses an unknown action`);
  }
  requirePlainObject(
    gold.expectedLegacy,
    'INTENT_GOLD_INVALID',
    `${record.recordId}.intentGold.expectedLegacy`
  );
  if (!Array.isArray(gold.expectedLegacy.intents) || !Array.isArray(gold.expectedLegacy.resources)) {
    fail('INTENT_GOLD_INVALID', `${record.recordId} legacy gold must contain arrays`);
  }
  if (gold.action === 'route') {
    if (!POSITIVE_SELECTION_KINDS.includes(gold.selectionKind)) {
      fail('ROUTE_SELECTION_INVALID', `${record.recordId} lacks a positive selection kind`);
    }
    if (!Array.isArray(gold.targets) || gold.targets.length === 0) {
      fail('ROUTE_TARGETS_EMPTY', `${record.recordId} route must carry targets`);
    }
    for (const [index, target] of gold.targets.entries()) {
      validateDestination(target, `${record.recordId}.intentGold.targets[${index}]`);
    }
    if (gold.authority !== 'WithheldUntilVerify') {
      fail('ROUTE_AUTHORITY_INVALID', `${record.recordId} must withhold authority until verify`);
    }
  } else {
    requireNonEmptyString(gold.reason, 'NEGATIVE_REASON_MISSING', `${record.recordId}.reason`);
    if (gold.targets !== undefined || gold.selectionKind !== undefined) {
      fail('NEGATIVE_TARGET_LEAK', `${record.recordId} negative branch carries route fields`);
    }
    if (gold.authority !== 'Withheld') {
      fail('NEGATIVE_AUTHORITY_INVALID', `${record.recordId} negative branch must withhold authority`);
    }
    if (gold.expectedLegacy.intents.length !== 0 || gold.expectedLegacy.resources.length !== 0) {
      fail('NEGATIVE_PROJECTION_OVER_EMISSION', `${record.recordId} negative projection is not empty`);
    }
  }
  if (gold.action === 'defer' && gold.reason === 'no-match') {
    if (gold.expectedLegacy.intents.length !== 0 || gold.expectedLegacy.resources.length !== 0) {
      fail('ZERO_SIGNAL_DEFAULT_UNION', `${record.recordId} no-match defer emits a default union`);
    }
  }
}

function validateAttestation(record) {
  if (record.labelProvenance !== 'intent-derived') {
    fail('LABEL_PROVENANCE_INVALID', `${record.recordId} is not intent-derived`);
  }
  const attestation = record.authorAttestation;
  requirePlainObject(attestation, 'AUTHOR_ATTESTATION_MISSING', record.recordId);
  if (attestation.goldSource !== 'user-intent') {
    fail(
      'LABEL_LEAKAGE_ROUTER_SOURCE',
      `${record.recordId} gold source is ${String(attestation.goldSource)}`
    );
  }
  if (attestation.routerOutputViewedBeforeLabelLock !== false) {
    fail('LABEL_LEAKAGE_ROUTER_VIEWED', `${record.recordId} author viewed router output before lock`);
  }
  if (attestation.reconciledAgainstRouterOutput !== false) {
    fail('LABEL_LEAKAGE_RECONCILED', `${record.recordId} gold was reconciled against router output`);
  }
  if (attestation.independentFromRouterOperator !== true) {
    fail('AUTHOR_NOT_INDEPENDENT', `${record.recordId} author independence is not attested`);
  }
  requireNonEmptyString(attestation.authorId, 'AUTHOR_ATTESTATION_MISSING', 'authorId');
  if (!Number.isInteger(attestation.labelLockedAtEpoch) || attestation.labelLockedAtEpoch < 0) {
    fail('AUTHOR_ATTESTATION_MISSING', `${record.recordId} lacks a valid label-lock time`);
  }
}

function validateRiskSlice(record) {
  const slice = record.riskSlice;
  requirePlainObject(slice, 'RISK_SLICE_INVALID', `${record.recordId}.riskSlice`);
  if (!ROLES.includes(slice.role) || !SELECTION_FAMILIES.includes(slice.selectionKindFamily)) {
    fail('RISK_SLICE_INVALID', `${record.recordId} has an unknown slice dimension`);
  }
  if (riskSliceId(slice) !== slice.id) {
    fail('RISK_SLICE_ID_MISMATCH', `${record.recordId} does not map to exactly one canonical cell`);
  }
  validateDestination(slice.contextDestination, `${record.recordId}.riskSlice.contextDestination`);
  const candidateDestinations = record.intentGold.action === 'route'
    ? record.intentGold.targets
    : [slice.contextDestination];
  const derivedDestination = strictestDestination(candidateDestinations);
  const contextMatchesDerived = canonicalBytes(slice.contextDestination.id)
    .equals(canonicalBytes(derivedDestination.id));
  if (
    !contextMatchesDerived ||
    derivedDestination.role !== slice.role ||
    derivedDestination.mutatesWorkspace !== slice.mutatesWorkspace ||
    slice.contextDestination.role !== derivedDestination.role ||
    slice.contextDestination.mutatesWorkspace !== derivedDestination.mutatesWorkspace
  ) {
    fail(
      'RISK_STRICTEST_TARGET_MISMATCH',
      `${record.recordId} slice is not derived from its strictest destination`
    );
  }
  const expectedFamily = selectionFamily(record.intentGold.selectionKind);
  if (expectedFamily !== slice.selectionKindFamily) {
    fail('RISK_SELECTION_FAMILY_MISMATCH', `${record.recordId} selection family is inconsistent`);
  }
  if (
    !Number.isInteger(slice.toleranceBps) ||
    slice.toleranceBps < 0 ||
    slice.toleranceBps > BASIS_POINTS_SCALE
  ) {
    fail('RISK_TOLERANCE_INVALID', `${record.recordId} tolerance must be integer basis points`);
  }
  const expectedTolerance = toleranceForDestination(derivedDestination);
  if (slice.toleranceBps !== expectedTolerance) {
    fail(
      'RISK_TOLERANCE_MISMATCH',
      `${record.recordId} requires ${expectedTolerance} basis points`
    );
  }
}

/**
 * Validate one independently labeled record.
 *
 * @param {Object} record - Corpus record.
 * @param {string} expectedHubId - Owning corpus hub.
 * @returns {true} Validation success.
 */
function validateRecord(record, expectedHubId) {
  requirePlainObject(record, 'RECORD_INVALID', 'record');
  requireNonEmptyString(record.recordId, 'RECORD_INVALID', 'recordId');
  if (record.hubId !== expectedHubId) {
    fail('RECORD_HUB_MISMATCH', `${record.recordId} belongs to ${String(record.hubId)}`);
  }
  requirePlainObject(record.requestFacts, 'REQUEST_FACTS_INVALID', record.recordId);
  requireNonEmptyString(record.requestFacts.prompt, 'REQUEST_FACTS_INVALID', 'prompt');
  if (record.requestFacts.piiScrubStatus !== 'passed') {
    fail('PII_SCRUB_REQUIRED', `${record.recordId} has not passed the PII scrub`);
  }
  validateIntentGold(record);
  validateAttestation(record);
  validateRiskSlice(record);
  if (!ACTIONS.includes(record.calibration && record.calibration.predictedAction)) {
    fail('CALIBRATION_PREDICTION_INVALID', `${record.recordId} predicted action is invalid`);
  }
  if (
    !Number.isInteger(record.calibration.confidenceBps) ||
    record.calibration.confidenceBps < 0 ||
    record.calibration.confidenceBps > BASIS_POINTS_SCALE
  ) {
    fail('CALIBRATION_CONFIDENCE_INVALID', `${record.recordId} confidence must be integer basis points`);
  }
  requireNonEmptyString(record.deletionKey, 'DELETION_KEY_MISSING', record.recordId);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. CORPUS AND COVERAGE VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Validate declared minimums and the external frozen hub topology.
 *
 * @param {Object} corpus - Calibration corpus.
 * @returns {true} Coverage success.
 */
function validateCoverage(corpus) {
  const requirements = corpus.coverageRequirements;
  if (!Array.isArray(requirements) || requirements.length === 0) {
    fail('COVERAGE_REQUIREMENTS_MISSING', `${corpus.hubId} has no coverage declaration`);
  }
  const records = Array.isArray(corpus.records) ? corpus.records : [];
  for (const requirement of requirements) {
    const cellRecords = records.filter((record) => record.riskSlice.id === requirement.riskSliceId);
    if (cellRecords.length === 0) {
      fail('COVERAGE_CELL_MISSING', `${corpus.hubId}/${requirement.riskSliceId}`);
    }
    if (cellRecords.length < requirement.minimumRecords) {
      fail(
        'COVERAGE_MINIMUM_UNMET',
        `${corpus.hubId}/${requirement.riskSliceId} has ${cellRecords.length}`
      );
    }
    for (const branch of requirement.requiredBranches) {
      if (!cellRecords.some((record) => record.intentGold.action === branch)) {
        fail('COVERAGE_BRANCH_MISSING', `${corpus.hubId}/${requirement.riskSliceId}/${branch}`);
      }
    }
  }
  const topology = FROZEN_HUB_TOPOLOGY[corpus.hubId];
  if (!topology) fail('HUB_TOPOLOGY_UNKNOWN', `${corpus.hubId} is not in the frozen topology`);
  for (const cell of topology.requiredCells) {
    if (!records.some((record) => (
      record.riskSlice.id === cell.riskSliceId && record.intentGold.action === cell.branch
    ))) {
      fail(
        'HUB_TOPOLOGY_CELL_MISSING',
        `${corpus.hubId}/${cell.riskSliceId}/${cell.branch}`
      );
    }
  }
  const observedActions = unique(records.map((record) => record.intentGold.action));
  for (const action of topology.actions) {
    if (!observedActions.includes(action)) {
      fail('HUB_TOPOLOGY_BRANCH_MISSING', `${corpus.hubId}/${action}`);
    }
  }
  const observedSelectionKinds = unique(
    records
      .filter((record) => record.intentGold.action === 'route')
      .map((record) => record.intentGold.selectionKind)
  );
  for (const selectionKind of topology.positiveSelectionKinds) {
    if (!observedSelectionKinds.includes(selectionKind)) {
      fail('HUB_TOPOLOGY_SELECTION_MISSING', `${corpus.hubId}/${selectionKind}`);
    }
  }
  return true;
}

function validatePrivacyAndSeal(corpus) {
  requirePlainObject(corpus.privacySignoff, 'PRIVACY_SIGNOFF_REQUIRED', 'privacySignoff');
  requireNonEmptyString(
    corpus.privacySignoff.reviewerId,
    'PRIVACY_SIGNOFF_REQUIRED',
    'privacySignoff.reviewerId'
  );
  if (
    corpus.privacySignoff.status !== 'approved' ||
    corpus.privacySignoff.independentFromAuthors !== true
  ) {
    fail('PRIVACY_SIGNOFF_REQUIRED', `${corpus.hubId} lacks independent approval`);
  }
  requirePlainObject(corpus.seal, 'CORPUS_NOT_SEALED', 'seal');
  if (corpus.seal.sealed !== true || corpus.seal.immutable !== true) {
    fail('CORPUS_NOT_SEALED', `${corpus.hubId} is mutable or unsealed`);
  }
  if (corpus.privacySignoff.reviewedAtEpoch > corpus.seal.sealedAtEpoch) {
    fail('PRIVACY_SIGNOFF_AFTER_SEAL', `${corpus.hubId} was reviewed after sealing`);
  }
  if (corpus.seal.casFenceRequired !== true || corpus.seal.priorGenerationRetained !== true) {
    fail('REVERSIBILITY_INVARIANT_MISSING', `${corpus.hubId} lacks fenced rollback`);
  }
  requirePlainObject(corpus.retentionPolicy, 'RETENTION_POLICY_MISSING', 'retentionPolicy');
  if (corpus.retentionPolicy.rightToBeForgotten !== true) {
    fail('DELETION_GOVERNANCE_MISSING', `${corpus.hubId} lacks deletion governance`);
  }
}

function validateGenerationLineage(corpus, priorCorpus) {
  if (corpus.priorCorpusId === null) {
    if (corpus.generation !== 1) {
      fail('CORPUS_LINEAGE_MARKER_MISSING', `${corpus.hubId} non-genesis corpus has no prior id`);
    }
    if (priorCorpus !== null && priorCorpus !== undefined) {
      fail('CORPUS_LINEAGE_UNEXPECTED_PRIOR', `${corpus.hubId} genesis corpus received a prior`);
    }
    return true;
  }
  requireDigest(corpus.priorCorpusId, 'CORPUS_LINEAGE_INVALID', 'priorCorpusId');
  if (priorCorpus === null || priorCorpus === undefined) {
    fail('CORPUS_PRIOR_REQUIRED', `${corpus.hubId} non-genesis corpus requires a trusted prior`);
  }
  requirePlainObject(priorCorpus, 'CORPUS_LINEAGE_INVALID', 'prior corpus');
  requireDigest(priorCorpus.corpusId, 'CORPUS_LINEAGE_INVALID', 'prior corpus id');
  requireDigest(priorCorpus.corpusHash, 'CORPUS_LINEAGE_INVALID', 'prior corpus hash');
  if (priorCorpus.corpusId === corpus.corpusId) {
    fail('CORPUS_LINEAGE_SELF_REFERENCE', `${corpus.hubId} candidate cannot be its own prior`);
  }
  if (
    priorCorpus.hubId !== corpus.hubId ||
    !Number.isInteger(priorCorpus.generation) ||
    priorCorpus.corpusHash !== priorCorpus.corpusId ||
    computeCorpusHash(priorCorpus) !== priorCorpus.corpusId
  ) {
    fail('CORPUS_LINEAGE_INVALID', `${corpus.hubId} prior lineage does not match`);
  }
  if (corpus.priorCorpusId !== priorCorpus.corpusId) {
    fail('CORPUS_LINEAGE_ID_MISMATCH', `${corpus.hubId} lineage marker is not the trusted prior`);
  }
  if (corpus.generation < priorCorpus.generation) {
    fail('CORPUS_GENERATION_REGRESSION', `${corpus.hubId} generation moved backward`);
  }
  const recordsChanged = !canonicalBytes(corpus.records).equals(canonicalBytes(priorCorpus.records));
  if (recordsChanged && corpus.generation <= priorCorpus.generation) {
    fail(
      'CORPUS_GENERATION_NOT_INCREMENTED',
      `${corpus.hubId} changed samples without a newer generation`
    );
  }
  return true;
}

/**
 * Validate a sealed corpus and its content-addressed identity.
 *
 * @param {Object} corpus - Calibration corpus.
 * @param {Object} [priorCorpus] - Externally trusted prior for non-genesis validation.
 * @returns {true} Validation success.
 */
function validateCorpus(corpus, priorCorpus) {
  requirePlainObject(corpus, 'CORPUS_INVALID', 'corpus');
  if (
    corpus.schemaVersion !== 'V1' ||
    !Number.isInteger(corpus.generation) ||
    corpus.generation < 1
  ) {
    fail('CORPUS_VERSION_INVALID', `${String(corpus.hubId)} has invalid version metadata`);
  }
  requireNonEmptyString(corpus.hubId, 'CORPUS_INVALID', 'hubId');
  if (corpus.priorCorpusId !== null) {
    requireDigest(corpus.priorCorpusId, 'CORPUS_LINEAGE_INVALID', 'priorCorpusId');
  }
  if (!['shadow-fixture', 'compiled-policy'].includes(corpus.policyBindingClass)) {
    fail('POLICY_BINDING_CLASS_INVALID', `${corpus.hubId} has an unknown binding class`);
  }
  requireDigest(corpus.effectivePolicyHash, 'EFFECTIVE_POLICY_HASH_INVALID', 'effectivePolicyHash');
  validateEffectivePolicyBinding(corpus);
  if (!Array.isArray(corpus.records) || corpus.records.length === 0) {
    fail('CORPUS_RECORDS_EMPTY', `${corpus.hubId} has no records`);
  }
  const recordIds = corpus.records.map((record) => record.recordId);
  if (unique(recordIds).length !== recordIds.length) {
    fail('DUPLICATE_RECORD_ID', `${corpus.hubId} contains duplicate record ids`);
  }
  for (const record of corpus.records) validateRecord(record, corpus.hubId);
  validateCoverage(corpus);
  validatePrivacyAndSeal(corpus);
  const computedHash = computeCorpusHash(corpus);
  if (computedHash !== corpus.corpusHash || corpus.corpusId !== corpus.corpusHash) {
    fail('CORPUS_HASH_MISMATCH', `${corpus.hubId} expected ${computedHash}`);
  }
  validateGenerationLineage(corpus, priorCorpus);
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. CALIBRATION AND BINDING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Measure one-bin reliability error for every hub/risk-slice cell.
 *
 * @param {Object} corpus - Validated corpus.
 * @param {Map<string, Object>} observations - Replay results keyed by record id.
 * @returns {Array<Object>} Per-slice ECE rows in basis points.
 */
function measureSliceCalibration(corpus, observations) {
  const grouped = new Map();
  for (const record of corpus.records) {
    const observation = observations.get(record.recordId);
    if (!observation) fail('REPLAY_OBSERVATION_MISSING', record.recordId);
    const isCorrect =
      observation.action === record.calibration.predictedAction &&
      observation.routeGoldPass === true;
    const group = grouped.get(record.riskSlice.id) || {
      riskSliceId: record.riskSlice.id,
      confidenceTotalBps: 0,
      correctCount: 0,
      sampleCount: 0,
      toleranceBps: record.riskSlice.toleranceBps
    };
    group.confidenceTotalBps += record.calibration.confidenceBps;
    group.correctCount += isCorrect ? 1 : 0;
    group.sampleCount += 1;
    group.toleranceBps = Math.min(group.toleranceBps, record.riskSlice.toleranceBps);
    grouped.set(record.riskSlice.id, group);
  }
  return [...grouped.values()].map((group) => {
    const meanConfidenceBps = Math.round(group.confidenceTotalBps / group.sampleCount);
    const accuracyBps = Math.round(
      (group.correctCount * BASIS_POINTS_SCALE) / group.sampleCount
    );
    const eceBps = Math.abs(meanConfidenceBps - accuracyBps);
    return {
      riskSliceId: group.riskSliceId,
      sampleCount: group.sampleCount,
      meanConfidenceBps,
      accuracyBps,
      eceBps,
      toleranceBps: group.toleranceBps,
      pass: eceBps <= group.toleranceBps
    };
  }).sort((left, right) => left.riskSliceId.localeCompare(right.riskSliceId));
}

/**
 * Fail closed unless a claim exactly binds to the sealed corpus and policy.
 *
 * @param {Object} claim - Certificate or canary claim.
 * @param {Object} corpus - Validated corpus.
 * @returns {true} Binding success.
 */
function validateCorpusBinding(claim, corpus, priorCorpus) {
  requirePlainObject(claim, 'CALIBRATION_CLAIM_INVALID', 'claim');
  validateCorpus(corpus, priorCorpus);
  if (
    claim.schemaVersion !== 'V1' ||
    !['calibration-certificate', 'per-hub-canary'].includes(claim.claimKind)
  ) {
    fail('CALIBRATION_CLAIM_INVALID', 'claim version or kind is invalid');
  }
  if (claim.hubId !== corpus.hubId) {
    fail('CLAIM_HUB_MISMATCH', `${String(claim.hubId)} does not match ${corpus.hubId}`);
  }
  if (!claim.corpusId) fail('CORPUS_ID_MISSING', `${claim.hubId} claim has no corpus id`);
  if (claim.corpusId !== corpus.corpusId) {
    fail('CORPUS_ID_MISMATCH', `${claim.hubId} claim references a different corpus`);
  }
  if (claim.effectivePolicyHash !== corpus.effectivePolicyHash) {
    fail('CORPUS_POLICY_MISMATCH', `${claim.hubId} claim references a different policy`);
  }
  if (claim.corpusGeneration !== corpus.generation) {
    fail('CORPUS_GENERATION_STALE', `${claim.hubId} claim references a stale generation`);
  }
  if (!corpus.coverageRequirements.some((item) => item.riskSliceId === claim.riskSliceId)) {
    fail('CLAIM_RISK_SLICE_MISSING', `${claim.hubId} claim references an uncovered slice`);
  }
  if (typeof claim.activationAdmission !== 'boolean') {
    fail('ACTIVATION_ADMISSION_UNDECLARED', `${claim.hubId} claim omits activation posture`);
  }
  if (claim.activationAdmission === true) {
    if (
      corpus.policyBindingClass !== 'compiled-policy' ||
      corpus.privacySignoff.attestationKind !== 'operational'
    ) {
      fail('ACTIVATION_EVIDENCE_INADMISSIBLE', `${claim.hubId} is bound only to shadow evidence`);
    }
    validateActivationAttestation(corpus);
  }
  if (claim.grantsCommitAuthority !== false) {
    fail('CORPUS_AUTHORITY_ESCALATION', `${claim.hubId} claim attempts to grant COMMIT authority`);
  }
  if (!corpus.seal || corpus.seal.sealed !== true) {
    fail('CORPUS_NOT_SEALED', `${claim.hubId} claim references an unsealed corpus`);
  }
  return true;
}

function validateActivationAttestation(corpus) {
  const attestation = corpus.privacySignoff.externalAttestation;
  if (!isPlainObject(attestation)) {
    fail('ACTIVATION_EXTERNAL_ATTESTATION_REQUIRED', `${corpus.hubId} has no external attestation`);
  }
  if (
    typeof attestation.compilerProofId !== 'string' ||
    attestation.compilerProofId.trim() === '' ||
    typeof attestation.privacyReviewerSignatureRef !== 'string' ||
    attestation.privacyReviewerSignatureRef.trim() === '' ||
    attestation.compilerProofId === corpus.corpusId ||
    attestation.privacyReviewerSignatureRef === corpus.corpusId
  ) {
    fail('ACTIVATION_EXTERNAL_PROOF_MISSING', `${corpus.hubId} lacks external proof references`);
  }
  if (
    typeof attestation.compilerAuthorityRef !== 'string' ||
    attestation.compilerAuthorityRef.trim() === '' ||
    typeof attestation.privacyReviewerAuthorityRef !== 'string' ||
    attestation.privacyReviewerAuthorityRef.trim() === ''
  ) {
    fail('ACTIVATION_ATTESTATION_AUTHORITY_MISSING', `${corpus.hubId} lacks authority references`);
  }
  const authorIds = new Set(corpus.records.map((record) => record.authorAttestation.authorId));
  if (authorIds.has(corpus.privacySignoff.reviewerId)) {
    fail('ACTIVATION_ATTESTATION_SELF_ISSUED', `${corpus.hubId} reviewer is a corpus author`);
  }
  return true;
}

/**
 * Validate a privacy-filtered, evidence-only live-shadow summary.
 *
 * @param {Object} summary - Live/offline divergence summary.
 * @param {Object} corpus - Trusted sealed corpus bound to the live summary.
 * @param {Object} [priorCorpus] - Externally trusted prior for non-genesis corpus validation.
 * @returns {true} Gate success.
 */
function validateLiveGateSummary(summary, corpus, priorCorpus) {
  requirePlainObject(summary, 'LIVE_GATE_INVALID', 'live gate summary');
  validateCorpus(corpus, priorCorpus);
  requirePlainObject(summary.policyBinding, 'LIVE_CORPUS_BINDING_MISSING', 'policyBinding');
  if (summary.hubId !== corpus.hubId) {
    fail('LIVE_HUB_MISMATCH', `${String(summary.hubId)} does not match ${corpus.hubId}`);
  }
  if (summary.policyBinding.corpusId !== corpus.corpusId) {
    fail('LIVE_CORPUS_ID_MISMATCH', `${corpus.hubId} live summary references another corpus`);
  }
  if (summary.policyBinding.effectivePolicyHash !== corpus.effectivePolicyHash) {
    fail('LIVE_POLICY_ID_MISMATCH', `${corpus.hubId} live summary references another policy`);
  }
  if (summary.policyBinding.corpusGeneration !== corpus.generation) {
    fail('LIVE_CORPUS_GENERATION_STALE', `${corpus.hubId} live summary references another generation`);
  }
  if (summary.privacyFiltered !== true) {
    fail('LIVE_PRIVACY_FILTER_REQUIRED', 'live samples were not privacy filtered');
  }
  if (summary.nonAuthority !== true) {
    fail('LIVE_AUTHORITY_FORBIDDEN', 'live shadow attempted to carry authority');
  }
  if (!Array.isArray(summary.slices) || summary.slices.length === 0) {
    fail('LIVE_SLICES_MISSING', 'live gate contains no slice measurements');
  }
  const retentionPolicyHash = sha256Canonical(corpus.retentionPolicy);
  for (const slice of summary.slices) {
    const dimensions = parseRiskSliceId(slice.riskSliceId);
    if (!corpus.coverageRequirements.some((item) => item.riskSliceId === slice.riskSliceId)) {
      fail('LIVE_RISK_SLICE_UNBOUND', `${slice.riskSliceId} is not covered by ${corpus.hubId}`);
    }
    const minimumSamples = (
      dimensions.mutatesWorkspace && ['actor', 'judgment'].includes(dimensions.role)
    ) ? 100 : 50;
    if (!Number.isInteger(slice.sampleCount) || slice.sampleCount < minimumSamples) {
      fail(
        'LIVE_SAMPLE_FLOOR_UNMET',
        `${slice.riskSliceId} has ${String(slice.sampleCount)} samples; ${minimumSamples} required`
      );
    }
    requirePlainObject(
      slice.deletionLineage,
      'LIVE_RETENTION_LINEAGE_MISSING',
      `${slice.riskSliceId}.deletionLineage`
    );
    if (
      slice.deletionLineage.corpusId !== corpus.corpusId ||
      slice.deletionLineage.retentionPolicyHash !== retentionPolicyHash
    ) {
      fail('LIVE_RETENTION_POLICY_MISMATCH', `${slice.riskSliceId} retention lineage is unbound`);
    }
    if (slice.deletionLineage.deletionKeyCount !== slice.sampleCount) {
      fail('LIVE_DELETION_LINEAGE_INCOMPLETE', `${slice.riskSliceId} lacks per-sample deletion keys`);
    }
    if (!Number.isInteger(slice.liveEceBps) || !Number.isInteger(slice.offlineEceBps)) {
      fail('LIVE_GATE_INVALID', `${slice.riskSliceId} ECE values must be integer basis points`);
    }
    const divergenceBps = Math.abs(slice.liveEceBps - slice.offlineEceBps);
    const divergenceToleranceBps = (
      dimensions.mutatesWorkspace && ['actor', 'judgment'].includes(dimensions.role)
    ) ? 200 : 400;
    if (divergenceBps > divergenceToleranceBps) {
      fail('LIVE_OFFLINE_DIVERGENCE', `${slice.riskSliceId} diverged by ${divergenceBps} bps`);
    }
    const calibrationToleranceBps = toleranceForDestination(dimensions);
    if (slice.liveEceBps > calibrationToleranceBps) {
      fail('LIVE_CALIBRATION_TOLERANCE', `${slice.riskSliceId} exceeds calibration tolerance`);
    }
  }
  return true;
}

/**
 * Accept singleton hubs only through explicit data, never a hub-name branch.
 *
 * @param {Array<Object>} corpora - Multi-candidate corpora.
 * @param {Array<Object>} noSliceRecords - Explicit singleton records.
 * @param {Array<string>} expectedHubIds - Closed expected hub set.
 * @returns {true} Hub coverage success.
 */
function validateHubCoverage(corpora, noSliceRecords, expectedHubIds) {
  const covered = new Set(corpora.map((corpus) => corpus.hubId));
  for (const record of noSliceRecords) {
    requirePlainObject(record, 'NO_SLICE_RECORD_INVALID', 'no-slice record');
    if (
      record.candidateCount !== 1 ||
      record.noCalibrationSlice !== true ||
      record.reason !== 'no calibration slice — nothing to calibrate (one candidate)'
    ) {
      fail('NO_SLICE_RECORD_INVALID', `${String(record.hubId)} lacks the singleton proof`);
    }
    covered.add(record.hubId);
  }
  for (const hubId of expectedHubIds) {
    if (!covered.has(hubId)) fail('EXPECTED_HUB_MISSING', hubId);
  }
  return true;
}

// ─────────────────────────────────────────────────────────────────────────────
// 9. EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  ACTIONS,
  CorpusValidationError,
  FROZEN_HUB_TOPOLOGY,
  RISK_TOLERANCE_BPS,
  computeCorpusHash,
  measureSliceCalibration,
  riskSliceId,
  validateCorpus,
  validateCorpusBinding,
  validateCoverage,
  validateGenerationLineage,
  validateHubCoverage,
  validateLiveGateSummary,
  validateRecord
};
