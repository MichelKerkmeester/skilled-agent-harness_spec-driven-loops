// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ Motion Corpus Evidence Gate                                             ║
// ╚══════════════════════════════════════════════════════════════════════════╝

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { isDeepStrictEqual } from 'node:util';

import {
  AUTHORITY_ORDER,
  COMMON_PROOF_HANDOFF_FIELDS,
} from '../../shared/corpus-context/corpus-context-plan.mjs';
import {
  validateCorpusContextPlan,
  validateProofHandoffRecord,
} from '../../shared/corpus-context/validate-context-plan.mjs';
import { runHydrate, runQuery } from '../../styles/_engine/style-library.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

export const MOTION_EVIDENCE_ELIGIBILITY_VERSION = 'MOTION_EVIDENCE_ELIGIBILITY v1';
export const MOTION_NEGATIVE_BASELINE_VERSION = 'MOTION_NEGATIVE_BASELINE v1';
export const MOTION_SOURCE_EVIDENCE_VERSION = 'MOTION_SOURCE_EVIDENCE v1';
export const MOTION_SOURCE_ATTESTATION_VERSION = 'MOTION_SOURCE_ATTESTATION v1';

const REQUEST_KEYS = Object.freeze([
  'contextPlan',
  'restraintAssessment',
  'eligibility',
  'retrievalRequest',
  'authorityInputs',
]);
const RETRIEVAL_REQUEST_KEYS = Object.freeze([
  'text',
  'requiredFacets',
  'excludedFacets',
  'useFts',
]);
const RESTRAINT_KEYS = Object.freeze([
  'frequency',
  'input',
  'purpose',
  'register',
  'targetEvidence',
]);
const TARGET_EVIDENCE_KEYS = Object.freeze(['owner', 'verdict', 'evidenceId']);
const ELIGIBILITY_KEYS = Object.freeze([
  'schemaVersion',
  'requestedPurpose',
  'requestedArchetype',
  'temporalOwnerId',
  'candidates',
]);
const CANDIDATE_KEYS = Object.freeze(['sourceId', 'attestation']);
const SOURCE_ATTESTATION_KEYS = Object.freeze([
  'schemaVersion',
  'mode',
  'sourceId',
  'generationHash',
  'contentHash',
  'artifactPath',
  'artifactHash',
  'evidence',
]);
const SOURCE_EVIDENCE_KEYS = Object.freeze([
  'schemaVersion',
  'evidenceId',
  'polarity',
  'temporalEvidence',
  'purpose',
  'stateArchetype',
  'constraint',
  'evidenceLabel',
]);
const NEGATIVE_BASELINE_KEYS = Object.freeze([
  'schemaVersion',
  'kind',
  'queryIssued',
  'targetEvidenceId',
  'affectedStates',
  'preservedFeedback',
  'instantEquivalent',
  'reducedMotionPath',
  'evidenceState',
]);
const AUTHORITY_INPUT_KEYS = Object.freeze([
  'targetInteraction',
  'reducedMotion',
  'performanceProof',
  'targetMechanism',
]);
const AUTHORITY_LOCK_KEYS = Object.freeze(['authority', 'lockId', 'contentHash', 'state']);
const AUTHORITY_KEY_TO_NAME = Object.freeze({
  targetInteraction: 'target-interaction',
  reducedMotion: 'reduced-motion',
  performanceProof: 'performance-proof',
  targetMechanism: 'target-mechanism',
});
const FREQUENCIES = Object.freeze(['hundred-plus', 'tens-daily', 'occasional', 'rare']);
const INPUTS = Object.freeze([
  'keyboard-primary',
  'pointer-primary',
  'touch-primary',
  'programmatic',
]);
export const MOTION_PURPOSES = Object.freeze([
  'none',
  'feedback',
  'orientation',
  'focus',
  'continuity',
  'perceived-performance',
  'earned-delight',
]);
const REGISTERS = Object.freeze(['product', 'brand']);
const TARGET_EVIDENCE_OWNERS = Object.freeze([
  'target-interaction',
  'owned-system',
  'deterministic-check',
]);
const TARGET_EVIDENCE_VERDICTS = Object.freeze([
  'motion-eligible',
  'instant-required',
  'insufficient',
]);
export const MOTION_STATE_ARCHETYPES = Object.freeze([
  'default-to-active',
  'absent-to-present',
  'loading-to-ready',
  'expanded-to-collapsed',
  'idle-to-feedback',
]);
const POLARITIES = Object.freeze(['positive', 'negative']);
const TEMPORAL_EVIDENCE_TYPES = Object.freeze(['explicit-temporal', 'incidental']);
const SOURCE_CONSTRAINTS = Object.freeze([
  'transformed-reference-only',
  'prohibits-spectacle',
  'prohibits-motion',
]);
const EVIDENCE_LABELS = Object.freeze(['measured', 'declared', 'inferred']);
const NEGATIVE_BASELINE_KINDS = Object.freeze([
  'target-no-motion',
  'hard-negative-rejection',
  'no-corpus-temporal-authority',
  'unattested-source-rejection',
  'corpus-unavailable',
]);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const HASH_PATTERN = /^sha256:[a-f0-9]{64}$/;
const MAX_QUERY_CARDS = 5;
const HYDRATION_BYTES = 8 * 1_024;
const RETRIEVAL_UNAVAILABLE_CODES = Object.freeze(new Set([
  'manifest-missing',
  'manifest-stale',
  'ENOENT',
]));
const HYDRATION_UNAVAILABLE_CODES = Object.freeze(new Set([
  'manifest-missing',
  'manifest-invalid',
  'manifest-stale',
  'generation-mismatch',
  'unavailable',
]));

// ─────────────────────────────────────────────────────────────────────────────
// 3. CLOSED-SCHEMA VALIDATION
// ─────────────────────────────────────────────────────────────────────────────

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function validateExactKeys(errors, value, path, keys) {
  if (!isPlainObject(value)) {
    errors.push(`${path}:required-object`);
    return false;
  }
  for (const key of keys) {
    if (!Object.hasOwn(value, key)) errors.push(`${path}.${key}:required`);
  }
  for (const key of Reflect.ownKeys(value)) {
    if (!keys.includes(key)) errors.push(`${path}.${String(key)}:unexpected`);
  }
  return true;
}

function validateEnum(errors, value, path, values) {
  if (!values.includes(value)) errors.push(`${path}:invalid`);
}

function validateRetrievalRequest(errors, request) {
  if (!isPlainObject(request)) {
    errors.push('retrievalRequest:required-object');
    return;
  }
  for (const key of Reflect.ownKeys(request)) {
    if (!RETRIEVAL_REQUEST_KEYS.includes(key)) {
      errors.push(`retrievalRequest.${String(key)}:unexpected`);
    }
  }
  if (request.text !== undefined && typeof request.text !== 'string') {
    errors.push('retrievalRequest.text:invalid');
  }
  for (const key of ['requiredFacets', 'excludedFacets']) {
    if (
      request[key] !== undefined
      && (!Array.isArray(request[key]) || request[key].some((item) => typeof item !== 'string'))
    ) {
      errors.push(`retrievalRequest.${key}:invalid`);
    }
  }
  if (request.useFts !== undefined && typeof request.useFts !== 'boolean') {
    errors.push('retrievalRequest.useFts:invalid');
  }
}

function validateUuid(errors, value, path, nullable = false) {
  if (nullable && value === null) return;
  if (typeof value !== 'string' || !UUID_PATTERN.test(value)) errors.push(`${path}:invalid-id`);
}

function validateHash(errors, value, path) {
  if (typeof value !== 'string' || !HASH_PATTERN.test(value)) errors.push(`${path}:invalid-hash`);
}

function validateMotionSourceEvidence(errors, evidence, path) {
  if (!validateExactKeys(errors, evidence, path, SOURCE_EVIDENCE_KEYS)) return;
  if (evidence.schemaVersion !== MOTION_SOURCE_EVIDENCE_VERSION) {
    errors.push(`${path}.schemaVersion:invalid`);
  }
  validateHash(errors, evidence.evidenceId, `${path}.evidenceId`);
  validateEnum(errors, evidence.polarity, `${path}.polarity`, POLARITIES);
  validateEnum(
    errors,
    evidence.temporalEvidence,
    `${path}.temporalEvidence`,
    TEMPORAL_EVIDENCE_TYPES,
  );
  validateEnum(errors, evidence.purpose, `${path}.purpose`, MOTION_PURPOSES);
  validateEnum(
    errors,
    evidence.stateArchetype,
    `${path}.stateArchetype`,
    MOTION_STATE_ARCHETYPES,
  );
  validateEnum(errors, evidence.constraint, `${path}.constraint`, SOURCE_CONSTRAINTS);
  validateEnum(errors, evidence.evidenceLabel, `${path}.evidenceLabel`, EVIDENCE_LABELS);
}

function validateSourceAttestation(errors, candidate, path, generationHash) {
  const attestationPath = `${path}.attestation`;
  const attestation = candidate.attestation;
  if (!validateExactKeys(
    errors,
    attestation,
    attestationPath,
    SOURCE_ATTESTATION_KEYS,
  )) return;
  if (attestation.schemaVersion !== MOTION_SOURCE_ATTESTATION_VERSION) {
    errors.push(`${attestationPath}.schemaVersion:invalid`);
  }
  if (attestation.mode !== 'motion') errors.push(`${attestationPath}.mode:invalid`);
  validateUuid(errors, attestation.sourceId, `${attestationPath}.sourceId`);
  validateHash(errors, attestation.generationHash, `${attestationPath}.generationHash`);
  validateHash(errors, attestation.contentHash, `${attestationPath}.contentHash`);
  validateHash(errors, attestation.artifactHash, `${attestationPath}.artifactHash`);
  if (
    typeof attestation.artifactPath !== 'string'
    || !/^[^/\\]+\/(DESIGN\.md|source\.md)$/.test(attestation.artifactPath)
  ) {
    errors.push(`${attestationPath}.artifactPath:invalid`);
  }
  if (attestation.sourceId !== candidate.sourceId) {
    errors.push(`${attestationPath}.sourceId:candidate-mismatch`);
  }
  if (attestation.generationHash !== generationHash) {
    errors.push(`${attestationPath}.generationHash:context-mismatch`);
  }
  validateMotionSourceEvidence(errors, attestation.evidence, `${attestationPath}.evidence`);
}

function validateRestraintAssessment(errors, assessment) {
  if (!validateExactKeys(errors, assessment, 'restraintAssessment', RESTRAINT_KEYS)) return;
  validateEnum(errors, assessment.frequency, 'restraintAssessment.frequency', FREQUENCIES);
  validateEnum(errors, assessment.input, 'restraintAssessment.input', INPUTS);
  validateEnum(errors, assessment.purpose, 'restraintAssessment.purpose', MOTION_PURPOSES);
  validateEnum(errors, assessment.register, 'restraintAssessment.register', REGISTERS);
  if (validateExactKeys(
    errors,
    assessment.targetEvidence,
    'restraintAssessment.targetEvidence',
    TARGET_EVIDENCE_KEYS,
  )) {
    validateEnum(
      errors,
      assessment.targetEvidence.owner,
      'restraintAssessment.targetEvidence.owner',
      TARGET_EVIDENCE_OWNERS,
    );
    validateEnum(
      errors,
      assessment.targetEvidence.verdict,
      'restraintAssessment.targetEvidence.verdict',
      TARGET_EVIDENCE_VERDICTS,
    );
    validateHash(
      errors,
      assessment.targetEvidence.evidenceId,
      'restraintAssessment.targetEvidence.evidenceId',
    );
  }
}

function validateEligibility(errors, eligibility, generationHash) {
  if (!validateExactKeys(errors, eligibility, 'eligibility', ELIGIBILITY_KEYS)) return;
  if (eligibility.schemaVersion !== MOTION_EVIDENCE_ELIGIBILITY_VERSION) {
    errors.push('eligibility.schemaVersion:invalid');
  }
  validateEnum(errors, eligibility.requestedPurpose, 'eligibility.requestedPurpose', MOTION_PURPOSES);
  validateEnum(
    errors,
    eligibility.requestedArchetype,
    'eligibility.requestedArchetype',
    MOTION_STATE_ARCHETYPES,
  );
  validateUuid(errors, eligibility.temporalOwnerId, 'eligibility.temporalOwnerId', true);
  if (!Array.isArray(eligibility.candidates)) {
    errors.push('eligibility.candidates:required-array');
    return;
  }
  const candidateIds = new Set();
  for (const [index, candidate] of eligibility.candidates.entries()) {
    const path = `eligibility.candidates.${index}`;
    if (!validateExactKeys(errors, candidate, path, CANDIDATE_KEYS)) continue;
    validateUuid(errors, candidate.sourceId, `${path}.sourceId`);
    validateSourceAttestation(
      errors,
      candidate,
      path,
      generationHash,
    );
    if (candidateIds.has(candidate.sourceId)) errors.push(`${path}.sourceId:duplicate`);
    candidateIds.add(candidate.sourceId);
  }
  if (
    eligibility.temporalOwnerId !== null
    && !candidateIds.has(eligibility.temporalOwnerId)
  ) {
    errors.push('eligibility.temporalOwnerId:not-a-candidate');
  }
}

function validateAuthorityInputs(errors, authorityInputs) {
  if (!validateExactKeys(errors, authorityInputs, 'authorityInputs', AUTHORITY_INPUT_KEYS)) return;
  for (const key of AUTHORITY_INPUT_KEYS) {
    const path = `authorityInputs.${key}`;
    const lock = authorityInputs[key];
    if (!validateExactKeys(errors, lock, path, AUTHORITY_LOCK_KEYS)) continue;
    validateEnum(errors, lock.authority, `${path}.authority`, [AUTHORITY_KEY_TO_NAME[key]]);
    validateUuid(errors, lock.lockId, `${path}.lockId`);
    validateHash(errors, lock.contentHash, `${path}.contentHash`);
    validateEnum(errors, lock.state, `${path}.state`, ['locked']);
  }
}

/**
 * Validate every input channel before the restraint gate can execute.
 *
 * @param {Object} input - Neutral plan, target gate, eligibility, and locks.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateMotionEvidenceRequest(input) {
  const errors = [];
  if (!validateExactKeys(errors, input, 'input', REQUEST_KEYS)) {
    return { valid: false, errors };
  }
  errors.push(...validateCorpusContextPlan(input.contextPlan).errors);
  validateRetrievalRequest(errors, input.retrievalRequest);
  validateRestraintAssessment(errors, input.restraintAssessment);
  validateEligibility(
    errors,
    input.eligibility,
    input.contextPlan?.generationIdentity?.observedGenerationHash,
  );
  validateAuthorityInputs(errors, input.authorityInputs);
  if (input.eligibility.requestedPurpose !== input.restraintAssessment.purpose) {
    errors.push('eligibility.requestedPurpose:restraint-purpose-mismatch');
  }
  return { valid: errors.length === 0, errors };
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. RESTRAINT AND ELIGIBILITY
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Resolve whether target evidence permits motion before any corpus retrieval.
 *
 * @param {Object} assessment - Closed restraint assessment.
 * @returns {{verdict:string,reason:string}} Gate verdict and typed reason.
 */
export function evaluateMotionRestraint(assessment) {
  if (assessment.frequency === 'hundred-plus') {
    return { verdict: 'do-not-move', reason: 'frequency-ceiling' };
  }
  if (assessment.input === 'keyboard-primary') {
    return { verdict: 'do-not-move', reason: 'keyboard-must-remain-instant' };
  }
  if (assessment.targetEvidence.verdict === 'instant-required') {
    return { verdict: 'do-not-move', reason: 'target-evidence-requires-instant-state' };
  }
  if (assessment.purpose === 'none') {
    return { verdict: 'do-not-move', reason: 'no-purpose' };
  }
  if (
    assessment.register === 'product'
    && assessment.purpose === 'earned-delight'
    && assessment.frequency !== 'rare'
  ) {
    return { verdict: 'do-not-move', reason: 'register-ceiling' };
  }
  return { verdict: 'eligible-for-evidence', reason: 'target-gate-passed' };
}

function isHardNegative(candidate) {
  const evidence = candidate.attestation.evidence;
  return evidence.polarity === 'negative'
    || evidence.constraint === 'prohibits-motion'
    || evidence.constraint === 'prohibits-spectacle';
}

function classifyAttestedCandidates(eligibility) {
  const eligible = eligibility.candidates.filter((candidate) => (
    !isHardNegative(candidate)
    && candidate.attestation.evidence.temporalEvidence === 'explicit-temporal'
    && candidate.attestation.evidence.purpose === eligibility.requestedPurpose
    && candidate.attestation.evidence.stateArchetype === eligibility.requestedArchetype
    && candidate.attestation.evidence.constraint === 'transformed-reference-only'
  ));
  const selected = eligible.find((candidate) => (
    candidate.sourceId === eligibility.temporalOwnerId
  )) ?? null;
  return {
    candidate: selected,
    hardNegatives: eligibility.candidates.filter(isHardNegative),
    rejected: eligibility.candidates.filter((candidate) => !eligible.includes(candidate)),
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. OUTPUT BUILDERS
// ─────────────────────────────────────────────────────────────────────────────

function provenanceFromCard(card) {
  const provenance = card.provenance ?? {};
  return {
    status: ['known', 'partial', 'unknown'].includes(provenance.status)
      ? provenance.status
      : 'unknown',
    sourceUrl: provenance.sourceUrl ?? null,
    licenseStatus: provenance.licenseStatus ?? 'unknown',
    rightsKnown: provenance.rightsKnown === true,
    useLabel: provenance.rightsKnown === true ? 'transformed-reference' : 'rights-unknown',
  };
}

function sourceDescriptor(card, hydration, candidate) {
  const provenanceUseLabel = provenanceFromCard(card);
  const evidence = candidate.attestation.evidence;
  return {
    sourceId: card.id,
    generationHash: card.generationHash,
    contentHash: card.contentHash,
    sourceUrl: provenanceUseLabel.sourceUrl,
    role: 'temporal-owner',
    sourceEvidenceId: evidence.evidenceId,
    purpose: evidence.purpose,
    stateArchetype: evidence.stateArchetype,
    evidenceLabel: evidence.evidenceLabel,
    provenanceUseLabel,
    artifactHashes: hydration.artifacts.map((artifact) => ({
      path: artifact.path,
      sha256: artifact.sha256,
      truncated: artifact.truncated,
    })),
  };
}

function sourceReference(source) {
  return {
    sourceId: source.sourceId,
    generationHash: source.generationHash,
    contentHash: source.contentHash,
    role: source.role,
    sourceEvidenceId: source.sourceEvidenceId,
    purpose: source.purpose,
    stateArchetype: source.stateArchetype,
    evidenceLabel: source.evidenceLabel,
    provenanceUseLabel: structuredClone(source.provenanceUseLabel),
  };
}

function negativeProofHandoff(contextPlan, outcome) {
  const isUnavailable = outcome === 'unavailable';
  return {
    generationIdentity: contextPlan.generationIdentity,
    sourceIdentity: null,
    provenanceUseLabel: {
      status: isUnavailable ? 'unavailable' : 'unknown',
      sourceUrl: null,
      licenseStatus: 'not-applicable',
      rightsKnown: false,
      useLabel: isUnavailable ? 'unavailable' : 'not-used',
    },
    semanticRole: { role: 'none', dimensions: [] },
    transformation: {
      state: 'not-applicable',
      summary: 'No corpus motion literal or choreography influenced the target.',
      copiedSourceSpecificMaterial: false,
    },
    fallback: {
      state: isUnavailable ? 'ordinary-workflow' : 'target-derived',
      reason: 'The target keeps its instant or target-native motion path.',
    },
    proofState: {
      outcome,
      status: 'accepted-evidence',
      targetChecks: 'not-assessed',
    },
  };
}

function positiveProofHandoff(contextPlan, source) {
  const hasKnownRights = source.provenanceUseLabel.rightsKnown;
  return {
    generationIdentity: contextPlan.generationIdentity,
    sourceIdentity: {
      sourceId: source.sourceId,
      contentHash: source.contentHash,
      sourceUrl: source.sourceUrl,
    },
    provenanceUseLabel: source.provenanceUseLabel,
    semanticRole: { role: 'reference', dimensions: ['relationship', 'rationale'] },
    transformation: {
      state: 'transformed',
      summary: 'Purpose and state relationships informed target-owned motion without timing literals.',
      copiedSourceSpecificMaterial: false,
    },
    fallback: {
      state: hasKnownRights ? 'not-needed' : 'target-derived',
      reason: hasKnownRights
        ? 'A bounded temporal relationship fit the target gate.'
        : 'Unknown rights keep source-specific choreography out of the target.',
    },
    proofState: {
      outcome: hasKnownRights ? 'positive' : 'unknown-rights',
      status: 'accepted-evidence',
      targetChecks: 'not-assessed',
    },
  };
}

function validateBuiltProof(proofHandoff) {
  const validation = validateProofHandoffRecord(proofHandoff);
  if (!validation.valid) {
    return { ok: false, error: 'invalid-proof-handoff', details: validation.errors };
  }
  return null;
}

function authorityPreservation(authorityInputs, snapshot) {
  const snapshotUnchanged = isDeepStrictEqual(authorityInputs, snapshot);
  const locks = AUTHORITY_INPUT_KEYS.map((key) => ({
    authority: authorityInputs[key].authority,
    lockId: authorityInputs[key].lockId,
    state: snapshotUnchanged ? 'preserved' : 'violated',
  }));
  return {
    order: [...AUTHORITY_ORDER],
    locks,
    allPreserved: locks.every((lock) => lock.state === 'preserved'),
  };
}

function negativeResult(input, gate, kind, sharedOutcome, queryIssued, warnings = []) {
  const proofHandoff = negativeProofHandoff(input.contextPlan, sharedOutcome);
  const proofError = validateBuiltProof(proofHandoff);
  if (proofError) return proofError;
  const snapshot = structuredClone(input.authorityInputs);
  const negativeBaseline = {
    schemaVersion: MOTION_NEGATIVE_BASELINE_VERSION,
    kind,
    queryIssued,
    targetEvidenceId: input.restraintAssessment.targetEvidence.evidenceId,
    affectedStates: [input.eligibility.requestedArchetype],
    preservedFeedback: 'target-feedback-preserved',
    instantEquivalent: kind === 'target-no-motion'
      ? 'instant-state-change'
      : 'target-native-state-change',
    reducedMotionPath: 'same-instant-equivalent',
    evidenceState: 'accepted-evidence',
  };
  const baselineValidation = validateMotionNegativeBaseline(negativeBaseline);
  if (!baselineValidation.valid) {
    return {
      ok: false,
      error: 'invalid-motion-negative-baseline',
      details: baselineValidation.errors,
    };
  }
  return {
    ok: true,
    outcome: kind === 'target-no-motion' ? 'do-not-move' : 'no-temporal-authority',
    restraintGate: { ...gate, queryIssued },
    negativeBaseline,
    temporalOwner: null,
    rejectedCandidateCount: input.eligibility.candidates.length,
    hardNegativeCount: input.eligibility.candidates.filter(isHardNegative).length,
    authorityPreservation: authorityPreservation(input.authorityInputs, snapshot),
    averagedTimingValues: false,
    copiedSourceSpecificMaterial: false,
    proofHandoff,
    warnings,
  };
}

/**
 * Validate the audit-complete negative path emitted by the motion gate.
 *
 * @param {Object} baseline - Closed negative motion evidence record.
 * @returns {{valid:boolean,errors:string[]}} Stable validation result.
 */
export function validateMotionNegativeBaseline(baseline) {
  const errors = [];
  if (!validateExactKeys(errors, baseline, 'negativeBaseline', NEGATIVE_BASELINE_KEYS)) {
    return { valid: false, errors };
  }
  if (baseline.schemaVersion !== MOTION_NEGATIVE_BASELINE_VERSION) {
    errors.push('negativeBaseline.schemaVersion:invalid');
  }
  validateEnum(errors, baseline.kind, 'negativeBaseline.kind', NEGATIVE_BASELINE_KINDS);
  if (typeof baseline.queryIssued !== 'boolean') {
    errors.push('negativeBaseline.queryIssued:invalid');
  }
  validateHash(errors, baseline.targetEvidenceId, 'negativeBaseline.targetEvidenceId');
  if (!Array.isArray(baseline.affectedStates) || baseline.affectedStates.length === 0) {
    errors.push('negativeBaseline.affectedStates:non-empty-array-required');
  } else {
    if (new Set(baseline.affectedStates).size !== baseline.affectedStates.length) {
      errors.push('negativeBaseline.affectedStates:duplicate-item');
    }
    for (const state of baseline.affectedStates) {
      validateEnum(errors, state, 'negativeBaseline.affectedStates', MOTION_STATE_ARCHETYPES);
    }
  }
  if (baseline.preservedFeedback !== 'target-feedback-preserved') {
    errors.push('negativeBaseline.preservedFeedback:invalid');
  }
  validateEnum(
    errors,
    baseline.instantEquivalent,
    'negativeBaseline.instantEquivalent',
    ['instant-state-change', 'target-native-state-change'],
  );
  if (baseline.reducedMotionPath !== 'same-instant-equivalent') {
    errors.push('negativeBaseline.reducedMotionPath:invalid');
  }
  if (baseline.evidenceState !== 'accepted-evidence') {
    errors.push('negativeBaseline.evidenceState:invalid');
  }
  return { valid: errors.length === 0, errors };
}

function typedEvidenceRecords(content) {
  const records = [];
  const pattern = /```motion-evidence\s*\n([\s\S]*?)\n```/g;
  for (const match of content.matchAll(pattern)) {
    try {
      records.push(JSON.parse(match[1]));
    } catch {
      records.push(null);
    }
  }
  return records;
}

function validateHydratedAttestation(candidate, card, hydration) {
  const errors = [];
  const attestation = candidate.attestation;
  if (attestation.sourceId !== card.id) errors.push('sourceId:card-mismatch');
  if (attestation.generationHash !== card.generationHash) {
    errors.push('generationHash:card-mismatch');
  }
  if (attestation.generationHash !== hydration.generationHash) {
    errors.push('generationHash:hydration-mismatch');
  }
  if (attestation.contentHash !== card.contentHash) errors.push('contentHash:card-mismatch');
  const artifact = hydration.artifacts.find((entry) => entry.path === attestation.artifactPath);
  if (!artifact) {
    errors.push('artifactPath:not-hydrated');
  } else {
    if (artifact.sha256 !== attestation.artifactHash) errors.push('artifactHash:mismatch');
    if (artifact.truncated) errors.push('artifact:truncated');
    const evidenceRecords = typedEvidenceRecords(artifact.content);
    const hasMatchingEvidence = evidenceRecords.some((record) => {
      const recordErrors = [];
      validateMotionSourceEvidence(recordErrors, record, 'sourceEvidence');
      return recordErrors.length === 0 && isDeepStrictEqual(record, attestation.evidence);
    });
    if (!hasMatchingEvidence) errors.push('sourceEvidence:not-attested-by-artifact');
  }
  return { valid: errors.length === 0, errors };
}

function isKnownRetrievalUnavailable(error) {
  return error instanceof SyntaxError || RETRIEVAL_UNAVAILABLE_CODES.has(error?.code);
}

async function hydrateTemporalOwner(card, engineOptions) {
  try {
    return await runHydrate({
      id: card.id,
      generationHash: card.generationHash,
      mode: 'motion',
      usage: 'reference',
      includes: ['DESIGN.md', 'source.md'],
      maxBytes: HYDRATION_BYTES,
    }, engineOptions);
  } catch (error) {
    if (!isKnownRetrievalUnavailable(error)) throw error;
    return { ok: false, error: error.code ?? 'manifest-invalid' };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. PUBLIC API
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Run restraint first, then retrieve at most one eligible temporal owner.
 *
 * @param {Object} input - Closed target gate, eligibility, and authority records.
 * @param {Object} engineOptions - Retrieval-engine corpus and manifest paths.
 * @returns {Promise<Object>} Motion evidence, negative baseline, or refusal.
 */
export async function buildMotionEvidencePlan(input, engineOptions = {}) {
  const validation = validateMotionEvidenceRequest(input);
  if (!validation.valid) {
    return { ok: false, error: 'invalid-motion-request', details: validation.errors };
  }
  const authoritySnapshot = structuredClone(input.authorityInputs);
  const gate = evaluateMotionRestraint(input.restraintAssessment);
  if (gate.verdict === 'do-not-move') {
    return negativeResult(input, gate, 'target-no-motion', 'no-fit', false);
  }

  const eligibility = classifyAttestedCandidates(input.eligibility);
  if (!eligibility.candidate) {
    const kind = eligibility.hardNegatives.length > 0
      ? 'hard-negative-rejection'
      : 'no-corpus-temporal-authority';
    return negativeResult(input, gate, kind, 'no-fit', false);
  }
  if (input.contextPlan.availability === 'unavailable') {
    return negativeResult(input, gate, 'corpus-unavailable', 'unavailable', false);
  }

  let query;
  try {
    query = await runQuery({
      ...(input.retrievalRequest ?? {}),
      usage: 'reference',
      exactReuse: false,
      limit: MAX_QUERY_CARDS,
    }, engineOptions);
  } catch (error) {
    if (!isKnownRetrievalUnavailable(error)) throw error;
    return negativeResult(
      input,
      gate,
      'corpus-unavailable',
      'no-fit',
      true,
      [`retrieval-unavailable:${error.code ?? 'invalid-manifest'}`],
    );
  }
  if (query.generationHash !== input.contextPlan.generationIdentity.observedGenerationHash) {
    return negativeResult(
      input,
      gate,
      'corpus-unavailable',
      'no-fit',
      true,
      ['retrieval-unavailable:generation-mismatch'],
    );
  }
  const card = query.cards.find((candidate) => candidate.id === eligibility.candidate.sourceId);
  if (!card) {
    return negativeResult(input, gate, 'no-corpus-temporal-authority', 'no-fit', true);
  }
  const hydration = await hydrateTemporalOwner(card, engineOptions);
  if (!hydration.ok) {
    if (!HYDRATION_UNAVAILABLE_CODES.has(hydration.error)) {
      return { ok: false, error: `temporal-owner-${hydration.error}` };
    }
    return negativeResult(
      input,
      gate,
      'corpus-unavailable',
      'no-fit',
      true,
      [`temporal-owner-unavailable:${hydration.error}`],
    );
  }
  const attestationValidation = validateHydratedAttestation(
    eligibility.candidate,
    card,
    hydration,
  );
  if (!attestationValidation.valid) {
    return negativeResult(
      input,
      gate,
      'unattested-source-rejection',
      'no-fit',
      true,
      attestationValidation.errors.map((error) => `source-attestation-rejected:${error}`),
    );
  }
  if (!isDeepStrictEqual(input.authorityInputs, authoritySnapshot)) {
    return { ok: false, error: 'authority-input-mutated' };
  }
  const source = sourceDescriptor(card, hydration, eligibility.candidate);
  const proofHandoff = positiveProofHandoff(input.contextPlan, source);
  const proofError = validateBuiltProof(proofHandoff);
  if (proofError) return proofError;

  return {
    ok: true,
    outcome: 'temporal-reference',
    restraintGate: { ...gate, queryIssued: true },
    negativeBaseline: null,
    temporalOwner: sourceReference(source),
    rejectedCandidateCount: eligibility.rejected.length,
    hardNegativeCount: eligibility.hardNegatives.length,
    authorityPreservation: authorityPreservation(input.authorityInputs, authoritySnapshot),
    averagedTimingValues: false,
    copiedSourceSpecificMaterial: false,
    proofHandoff,
    warnings: [],
  };
}

/**
 * Return the unchanged shared proof field set used by motion.
 *
 * @returns {string[]} Stable common proof/handoff fields.
 */
export function motionProofHandoffFields() {
  return [...COMMON_PROOF_HANDOFF_FIELDS];
}
